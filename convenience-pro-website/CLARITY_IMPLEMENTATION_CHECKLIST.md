# Microsoft Clarity Implementation Checklist for ConveniencePro

Copy and paste this into your project management tool to track implementation progress.

## Pre-Implementation

- [ ] Review CLARITY_SUMMARY.md (5 minutes)
- [ ] Get buy-in from team/stakeholders
- [ ] Decide on GDPR consent approach (required if targeting EU users)
- [ ] Assign implementation owner

---

## Phase 1: Setup (5-10 minutes)

### Account & Configuration
- [ ] Sign up at https://clarity.microsoft.com (free)
- [ ] Create new project with your website URL
- [ ] Copy Project ID from dashboard
- [ ] Store Project ID safely (will use in .env.local)

### Environment Setup
- [ ] Create or update `.env.local` file in project root
- [ ] Add line: `NEXT_PUBLIC_CLARITY_PROJECT_ID=your_project_id_here`
- [ ] Replace `your_project_id_here` with actual ID from dashboard
- [ ] Verify file is in `.gitignore` (for security)

### Code Implementation
- [ ] Create file: `app/components/ClarityScript.tsx`
- [ ] Copy code from `clarity-implementation-example.tsx` (Example 1: Basic Setup)
- [ ] Update `app/layout.tsx` to import ClarityScript
- [ ] Add `<ClarityScript />` before closing `</body>` tag
- [ ] Save all files

### Verification
- [ ] Restart development server (`npm run dev` or `yarn dev`)
- [ ] Open website in browser
- [ ] Open DevTools (F12 or Cmd+Option+I)
- [ ] Go to Network tab
- [ ] Filter for "clarity" or "clarity.ms"
- [ ] Perform action on site (click, scroll, etc.)
- [ ] Confirm POST requests appear to `clarity.ms/collect`
- [ ] If no requests: Restart server and check `.env.local` again

### Dashboard Verification
- [ ] Go to https://clarity.microsoft.com
- [ ] Open your project dashboard
- [ ] Wait 5-10 minutes
- [ ] Check "Active users" counter (should show current visitors)
- [ ] Look for session recordings in "Recordings" tab
- [ ] Celebrate Phase 1 completion! 🎉

---

## Phase 2: GDPR Compliance (10-15 minutes)

*Only required if your site targets EU/UK/Switzerland users. Skip if not applicable.*

### Legal Review
- [ ] Confirm if GDPR applies to your audience (location of users)
- [ ] Check current privacy policy
- [ ] Ensure legal can review Clarity compliance

### Add Consent Banner
- [ ] Create file: `app/components/ConsentBanner.tsx`
- [ ] Copy code from `clarity-implementation-example.tsx` (Example 3)
- [ ] Update banner text if needed (keep it clear and honest)
- [ ] Add styling to match your site's design
- [ ] Import ConsentBanner in `app/layout.tsx`
- [ ] Add `<ConsentBanner />` to layout
- [ ] Test banner appears when site loads
- [ ] Test "Accept" button saves consent to localStorage
- [ ] Test "Reject" button prevents Clarity tracking

### Privacy Policy Update
- [ ] Add section about Microsoft Clarity
- [ ] Explain what data is collected (user interactions, not video)
- [ ] Explain why (UX optimization)
- [ ] Mention data retention (30 days)
- [ ] Link to Microsoft's privacy policy
- [ ] Include opt-out information

### Data Masking (Optional but Recommended)
- [ ] Identify sensitive form fields on your site
- [ ] Create file: `app/components/ClarityAdvanced.tsx`
- [ ] Copy code from `clarity-implementation-example.tsx` (Example 4)
- [ ] Add CSS classes to sensitive fields (e.g., password, credit card)
- [ ] Update `maskCssClassNames` with your class names
- [ ] Test that sensitive data appears as asterisks in recordings
- [ ] Replace basic ClarityScript with ClarityAdvanced in layout

### Testing
- [ ] Open site in private/incognito browser
- [ ] Confirm consent banner appears
- [ ] Accept consent
- [ ] Check Network tab for clarity.ms requests
- [ ] Go to Clarity dashboard
- [ ] Confirm session appears with consent status

---

## Phase 3: Custom Event Tracking (15-30 minutes)

*Optional but highly recommended for e-commerce*

### Setup
- [ ] Create file: `app/hooks/useClarityEvent.ts`
- [ ] Copy code from `clarity-implementation-example.tsx` (Example 5)
- [ ] Create file: `app/utils/clarity.ts` (Examples 9 & 10)
- [ ] Define all custom events you want to track

### Identify Events to Track
- [ ] Product viewed
- [ ] Product added to cart
- [ ] Cart abandoned
- [ ] Checkout started
- [ ] Checkout step completed (shipping, payment, etc.)
- [ ] Checkout abandoned
- [ ] Order completed
- [ ] Search performed
- [ ] Error occurred
- [ ] Other key flows specific to ConveniencePro

### Implementation
- [ ] Add event tracking to product page
- [ ] Add event tracking to cart/checkout pages
- [ ] Add event tracking to error handlers
- [ ] Add event tracking to success messages
- [ ] Test each event fires correctly
- [ ] Check Clarity dashboard for custom events appearing

### Verification in Clarity Dashboard
- [ ] Go to Events section
- [ ] Confirm custom events are appearing
- [ ] Check event data is being captured correctly
- [ ] Verify no sensitive data in event payloads

---

## Phase 4: Testing & Optimization (10-20 minutes)

### Cross-Browser Testing
- [ ] Test on Chrome (desktop)
- [ ] Test on Firefox (desktop)
- [ ] Test on Safari (desktop)
- [ ] Test on Chrome (mobile)
- [ ] Test on Safari (mobile/iPad)
- [ ] Confirm Clarity works on all browsers

### Performance Testing
- [ ] Run Lighthouse audit (DevTools)
- [ ] Check that Clarity doesn't hurt performance
- [ ] Verify Core Web Vitals aren't negatively impacted
- [ ] Monitor page load time (should be minimal impact)

### Privacy Testing
- [ ] Test consent banner on first visit
- [ ] Test that consent persists across sessions
- [ ] Verify Clarity doesn't track if consent is rejected
- [ ] Test data masking on forms
- [ ] Confirm sensitive data is masked in recordings

### Device Testing
- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768px width)
- [ ] Test on mobile (375px width)
- [ ] Verify heatmaps appear correctly for each device
- [ ] Check session recordings capture all interactions

---

## Phase 5: Initial Data Review (Day 1)

### Dashboard Familiarization
- [ ] Login to Clarity dashboard
- [ ] Explore the UI (sidebar, filters, etc.)
- [ ] Find Recordings section
- [ ] Find Heatmaps section
- [ ] Find Events section
- [ ] Find Insights/Analytics section

### Review First Sessions
- [ ] Watch 3-5 session recordings
- [ ] Observe user behavior patterns
- [ ] Note any obvious friction points
- [ ] Look for dead clicks or rage clicks
- [ ] Check scroll depth on main pages

### Initial Observations
- [ ] Document what you learned
- [ ] Identify 2-3 quick wins to improve
- [ ] Note any potential bugs or issues
- [ ] Plan first improvements

---

## Phase 6: Weekly Monitoring (Ongoing)

### Every Monday
- [ ] Check Clarity dashboard
- [ ] Review new sessions from weekend
- [ ] Check for any new rage clicks or dead clicks
- [ ] Review heatmaps for high-traffic pages
- [ ] Check custom event data (if implemented)

### Rage Clicks Review
- [ ] Filter sessions with rage clicks
- [ ] Identify affected elements
- [ ] Check if it's a known issue or new problem
- [ ] Prioritize fixes by frequency

### Dead Clicks Review
- [ ] Filter sessions with dead clicks
- [ ] Identify what users expected to click
- [ ] Determine if element should be clickable or needs better UX
- [ ] Plan UI improvements

### Heatmap Analysis
- [ ] Compare heatmaps across devices (desktop vs mobile)
- [ ] Check if CTAs are getting clicked
- [ ] Review scroll depth (is content too long?)
- [ ] Look for patterns across multiple pages

### Monthly Data Export
- [ ] Export session data (if available)
- [ ] Cross-reference with GA4 data
- [ ] Identify correlation between Clarity findings and GA4 metrics
- [ ] Update improvement roadmap

---

## Phase 7: Optimization & Iteration

### Fix #1 Implementation
- [ ] Identify first friction point from Clarity
- [ ] Implement fix/improvement
- [ ] Deploy to production
- [ ] Monitor GA4 for impact (conversions, bounce rate, etc.)
- [ ] Document results in team wiki/docs

### A/B Testing Integration
- [ ] Set up A/B test for improvement
- [ ] Use Clarity to compare heatmaps between variants
- [ ] Track conversion improvement in GA4
- [ ] Make data-informed decision

### Ongoing Improvements
- [ ] Add feedback loop: Clarity findings → GA4 impact → next improvement
- [ ] Share weekly insights with team
- [ ] Create quarterly report of improvements made
- [ ] Celebrate conversions recovered!

---

## Post-Launch Monitoring Checklist

### Weekly Tasks
- [ ] Check for new rage clicks
- [ ] Review dead clicks
- [ ] Watch 5-10 session recordings
- [ ] Check custom event data
- [ ] Update issue tracking with findings

### Monthly Tasks
- [ ] Comprehensive heatmap review
- [ ] Device comparison analysis
- [ ] Cross-reference with GA4 data
- [ ] Identify top 3 improvements for next month
- [ ] Review and delete old/irrelevant data

### Quarterly Tasks
- [ ] Full UX audit using Clarity data
- [ ] Comprehensive report to stakeholders
- [ ] Update privacy policy if needed
- [ ] Review compliance with GDPR/CCPA
- [ ] Plan major improvements for next quarter

---

## Troubleshooting Checklist

### Issue: No Data in Clarity Dashboard

- [ ] Check Project ID is correct in `.env.local`
- [ ] Verify `.env.local` file exists in project root
- [ ] Restart development server
- [ ] Clear browser cache and reload
- [ ] Open DevTools → Application → Storage → Local Storage
- [ ] Look for `clr_*` keys (Clarity's storage)
- [ ] Check Network tab for `clarity.ms/collect` requests
- [ ] Disable ad blockers and try again
- [ ] Check that ClarityScript component is in layout
- [ ] Verify component is actually rendering (DevTools → Elements)

### Issue: Consent Banner Not Showing

- [ ] Check ConsentBanner component is imported in layout
- [ ] Verify component is rendering (DevTools → Elements)
- [ ] Clear localStorage: `localStorage.clear()`
- [ ] Hard refresh: Ctrl+Shift+R or Cmd+Shift+R
- [ ] Check browser console for errors
- [ ] Verify localStorage is enabled in browser

### Issue: Sensitive Data Not Masked

- [ ] Check `maskCssClassNames` in ClarityAdvanced component
- [ ] Verify sensitive fields have matching CSS classes
- [ ] Check if using `maskAllInputs: true` (should mask all inputs)
- [ ] Wait for new sessions (old ones won't be masked retroactively)
- [ ] Check data masking in Clarity settings (dashboard)

### Issue: Performance Degradation

- [ ] Change script strategy from `afterInteractive` to `lazyOnload`
- [ ] Check if other scripts are conflicting
- [ ] Profile with Lighthouse (DevTools → Lighthouse)
- [ ] Check if Clarity is being loaded multiple times
- [ ] Verify only one ClarityScript component in layout

### Issue: GDPR Not Compliant

- [ ] Verify consent banner is showing for EU users
- [ ] Check that consent is being saved to localStorage
- [ ] Verify Clarity only tracks when consent is given
- [ ] Review privacy policy has been updated
- [ ] Have legal review your implementation
- [ ] Check Microsoft's GDPR documentation

---

## Documentation Checklist

- [ ] Document Project ID location (Clarity dashboard)
- [ ] Document consent approach (required for GDPR)
- [ ] Document custom events being tracked
- [ ] Document data masking configuration
- [ ] Document where Clarity data is used (team wiki/docs)
- [ ] Document insights found (weekly)
- [ ] Document improvements made (monthly)
- [ ] Add Clarity to security audit documentation
- [ ] Update privacy policy with Clarity info
- [ ] Create runbook for monitoring Clarity

---

## Team Communication Checklist

- [ ] Announce Clarity implementation to team
- [ ] Explain what data will be collected
- [ ] Share how it will be used (UX improvements)
- [ ] Address privacy concerns
- [ ] Schedule training on using Clarity dashboard
- [ ] Set up weekly sync to review findings
- [ ] Create channel for sharing insights (#clarity-insights or similar)
- [ ] Document best practices for session review
- [ ] Create decision-making process for improvements

---

## Success Metrics

### Technical Success
- [ ] Zero console errors
- [ ] Data appearing in dashboard within 15 min
- [ ] 95%+ sessions successfully recorded
- [ ] No performance degradation
- [ ] Working on all browsers/devices

### Business Success (Month 1)
- [ ] Identified top 3 UX friction points
- [ ] Made 2+ improvements based on Clarity insights
- [ ] 5%+ improvement in primary conversion metric
- [ ] Team engaged and using Clarity insights
- [ ] Privacy compliant (GDPR/CCPA)

### Ongoing Success
- [ ] Weekly insights from Clarity data
- [ ] Monthly improvements implemented
- [ ] Quarterly increase in conversion metrics
- [ ] User satisfaction improvements
- [ ] Reduction in support tickets related to UX

---

## Final Sign-Off

- [ ] All phases completed
- [ ] All tests passing
- [ ] Documentation complete
- [ ] Team trained
- [ ] Privacy compliant
- [ ] Monitoring process established
- [ ] Success metrics defined

**Implementation Date**: ________________

**Completed By**: ____________________

**Approved By**: ____________________

---

## Quick Reference

| File | Purpose | Read Time |
|------|---------|-----------|
| CLARITY_README.md | Navigation hub | 5 min |
| CLARITY_SUMMARY.md | What/why explanation | 10 min |
| CLARITY_QUICK_START.md | Fast implementation | 5 min |
| MICROSOFT_CLARITY_GUIDE.md | Complete reference | 30 min |
| clarity-implementation-example.tsx | Code examples | 20 min |
| CLARITY_IMPLEMENTATION_CHECKLIST.md | This file | 10 min |

---

**Start here**: CLARITY_SUMMARY.md
**Get coding**: CLARITY_QUICK_START.md
**Need help**: CLARITY_README.md
**Need details**: MICROSOFT_CLARITY_GUIDE.md
**Need code**: clarity-implementation-example.tsx

---

**Last Updated**: November 22, 2025
**Status**: Ready for Implementation
