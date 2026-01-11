# Minimal Logging Pattern for Privacy-Focused Serverless APIs

**Created:** December 4, 2025
**Platform:** Vercel Serverless (Next.js)
**Goal:** Minimize data logging while maintaining functionality

---

## The Reality of Serverless Logging

### What CANNOT Be Avoided (Platform Infrastructure):

Vercel automatically logs:
- ✅ Function invocation metadata (timestamp, duration, memory, status code)
- ✅ Cold start events
- ✅ Uncaught errors and stack traces
- ✅ Request/response headers

**These cannot be disabled.** They are inherent to serverless platforms.

### What CAN Be Avoided (Application-Level):

- ❌ Request body content
- ❌ Query parameters
- ❌ User data
- ❌ Processing results
- ❌ Debug information

---

## Implementation Pattern

### 1. Silent Success Pattern

```typescript
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // ✅ DO: Process silently
    const result = toolFunction(body)

    // ✅ DO: Return immediately without logging
    return NextResponse.json(result)

    // ❌ DON'T: console.log('Processed:', body)
    // ❌ DON'T: console.log('Result:', result)

  } catch (error) {
    // ✅ DO: Return generic error without details
    return NextResponse.json({
      success: false,
      error: 'Processing failed',
      errorCode: 'EXECUTION_ERROR'
    }, { status: 500 })

    // ❌ DON'T: console.error('Error:', error, body)
    // ❌ DON'T: console.error('Failed input:', JSON.stringify(body))
  }
}
```

### 2. Error Handling Without Data Leakage

```typescript
try {
  const result = processSensitiveData(input)
  return NextResponse.json({ success: true, data: result })
} catch (error) {
  // ✅ Log error TYPE, not error DATA
  // Even this is risky - uncaught errors log stack traces

  // ❌ BAD: Logs user data
  // console.error('Failed to process:', input, error)

  // ⚠️  ACCEPTABLE: Logs error type only
  // const errorType = error instanceof ValidationError ? 'VALIDATION' : 'UNKNOWN'
  // console.error(`Error type: ${errorType}`)

  // ✅ BEST: Silent error handling
  return NextResponse.json({
    success: false,
    error: 'Processing failed'
  }, { status: 500 })
}
```

### 3. Prevent Uncaught Errors

```typescript
// ✅ Wrap ALL processing in try-catch
export async function POST(request: Request) {
  try {
    // Parse input
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({
        success: false,
        error: 'Invalid JSON'
      }, { status: 400 })
    }

    // Process
    try {
      const result = toolFunction(body)
      return NextResponse.json(result)
    } catch {
      return NextResponse.json({
        success: false,
        error: 'Processing failed'
      }, { status: 500 })
    }

  } catch {
    // Fallback: absolutely nothing should reach here
    return NextResponse.json({
      success: false,
      error: 'Unknown error'
    }, { status: 500 })
  }
}
```

### 4. Silent Tool Execution

```typescript
// Tool implementation should never log
export function base64Encoder(params: Base64Params): ToolResult {
  // ❌ DON'T: console.log('Encoding:', params.text)

  if (!params.text) {
    return failure('Missing required parameter: text', 'MISSING_REQUIRED')
  }

  try {
    const encoded = btoa(params.text)
    return success({ encoded, length: encoded.length })

    // ❌ DON'T: console.log('Encoded result:', encoded)
  } catch (error) {
    return failure('Encoding failed', 'ENCODING_ERROR')

    // ❌ DON'T: console.error('Error encoding:', params.text, error)
  }
}
```

---

## What Still Gets Logged (Unavoidable)

### Vercel Infrastructure Logs

```
[2025-12-04 10:30:15] INFO
Function: /run/base64-encoder
Status: 200
Duration: 45ms
Memory: 128MB
Region: iad1
Cold Start: false
```

**This contains:**
- ✅ Timestamp
- ✅ Endpoint called
- ✅ HTTP status code
- ✅ Performance metrics

**This does NOT contain:**
- ❌ Request body
- ❌ Query parameters
- ❌ User data
- ❌ Results

### Example: What Vercel Sees

**Request:**
```http
POST /run/base64-encoder
Content-Type: application/json

{"text":"MySecretPassword123"}
```

**Vercel Infrastructure Log:**
```
POST /run/base64-encoder - 200 OK (45ms)
```

**Vercel Does NOT See:**
```
{"text":"MySecretPassword123"} ← Not in infrastructure logs
```

### When Errors Occur

**If uncaught error happens:**
```typescript
// This throws an uncaught error
const result = JSON.parse(undefined) // ← TypeError
```

**Vercel logs:**
```
[ERROR] Unhandled exception in function
TypeError: Cannot read property of undefined
  at handler (/var/task/route.ts:42:18)
  at process._tickCallback (internal/process/next_tick.js:68:7)

Request: POST /run/base64-encoder
```

**To avoid this:** Wrap everything in try-catch (see Pattern #3 above)

---

## Privacy Levels Compared

| Logging Level | Infrastructure Logs | Application Logs | Request Bodies | Errors |
|---------------|---------------------|------------------|----------------|--------|
| **Standard Server** | ✅ Yes | ✅ Yes | ⚠️ Often | ✅ Yes |
| **Vercel (Default)** | ✅ Yes | ⚠️ If you log | ❌ No | ⚠️ If uncaught |
| **Vercel (Our Pattern)** | ✅ Yes | ❌ No | ❌ No | ❌ Caught silently |
| **Client-Side Only** | ❌ No | ❌ No | ❌ No | ❌ No |

---

## Recommendations

### For Non-Sensitive Data (formatting, validation):
✅ **Use API with POST method** (minimal logging pattern)
- Infrastructure logs only (no request bodies)
- Silent error handling
- No application logging

### For Sensitive Data (passwords, API keys, PII):
✅ **Use client-side execution only**
- Import tools directly in browser
- Zero server involvement
- Zero logging anywhere

---

## Implementation Checklist

**API Routes:**
- [ ] No `console.log()` calls
- [ ] No `console.error()` with user data
- [ ] All errors wrapped in try-catch
- [ ] Generic error messages returned
- [ ] No debugging tools (debugger statements, etc.)

**Tool Implementations:**
- [ ] No logging in tool functions
- [ ] All errors caught and returned as `failure()` results
- [ ] No stack trace logging

**Deployment:**
- [ ] Verify no logging in production build
- [ ] Monitor Vercel logs to confirm minimal data
- [ ] Document privacy limitations in API docs

---

## The Hard Truth

**You cannot achieve zero logging on Vercel serverless.**

Infrastructure logs are unavoidable. The best you can do:

1. ✅ Eliminate application-level logging (we do this)
2. ✅ Use POST to keep data out of URLs (we do this)
3. ✅ Catch all errors silently (we do this)
4. ⚠️ Accept that infrastructure logs exist (unavoidable)

**For true zero-logging privacy:** Use client-side execution where data never touches a server.

---

## Pattern Name

**"Silent Server Pattern"**

Core principles:
1. Process requests silently without logging
2. Return results immediately
3. Catch all errors without logging details
4. Accept infrastructure logging as unavoidable
5. Recommend client-side for sensitive data

This is the best possible privacy on a serverless platform.
