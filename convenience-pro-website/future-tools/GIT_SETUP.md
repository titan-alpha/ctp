# Git Repository Setup Instructions

**Purpose**: Initialize separate git repositories for future-tools/
**Date**: 2025-11-17
**Status**: Manual setup required

---

## Why Separate Repository?

- **Access Control**: Product team needs write access without main codebase access
- **Visibility**: Roadmap can be public/private independently
- **History**: Product decisions tracked separately from code changes
- **Workflow**: Engineers clone both repos for full context

---

## Setup Steps

### 1. Create GitHub Repository

```bash
# Via GitHub CLI
gh repo create conveniencepro/future-tools \
  --description "Prioritized product roadmap for ConveniencePro tools" \
  --private \
  --clone

# Or via GitHub web UI
# https://github.com/new
# Repository name: future-tools
# Description: Prioritized product roadmap for ConveniencePro tools
# Visibility: Private (or Public for transparency)
```

### 2. Initialize Git in future-tools/

```bash
# Navigate to future-tools directory
cd /path/to/utility-tools-template/future-tools

# Initialize git
git init

# Add remote
git remote add origin git@github.com:conveniencepro/future-tools.git

# Initial commit
git add .
git commit -m "Initial roadmap structure

- Add README and TEMPLATE
- Add priority folders
- Add example: PDF Merger (P1)
"

# Push
git branch -M main
git push -u origin main
```

### 3. Add to .gitignore in Main Repo

```bash
# In utility-tools-template/.gitignore
echo "future-tools/" >> .gitignore

# Commit the change
git add .gitignore
git commit -m "Exclude future-tools/ (separate git repo)"
git push
```

### 4. Document in README

Add to main repository README.md:

```markdown
## Related Repositories

- **Main Website**: [github.com/conveniencepro/utility-tools-website](https://github.com/conveniencepro/utility-tools-website)
- **Future Tools Roadmap**: [github.com/conveniencepro/future-tools](https://github.com/conveniencepro/future-tools)
- **User Feedback**: [github.com/conveniencepro/feedback](https://github.com/conveniencepro/feedback)
```

---

## Repository Permissions

### Team Access

**Product Team**:
- future-tools: Write
- feedback: Read
- utility-tools-website: Read (optional)

**Engineering Team**:
- future-tools: Read
- utility-tools-website: Write
- feedback: Read

**COO**:
- All repositories: Admin

---

## Workflow After Setup

### Product Team
```bash
# Clone both repos
git clone git@github.com:conveniencepro/feedback.git
git clone git@github.com:conveniencepro/future-tools.git

# Weekly workflow
cd feedback
gh issue list --label "feature" --state open

cd ../future-tools
# Analyze issues, add to priority folders
git add high-priority/new-tool.md
git commit -m "Analyze: New Tool (P1, 8.5/10)"
git push
```

### Engineering Team
```bash
# Clone both repos
git clone git@github.com:conveniencepro/utility-tools-website.git
git clone git@github.com:conveniencepro/future-tools.git

# Sprint planning
cd future-tools
git pull
cat high-priority/*.md  # Review upcoming work

cd ../utility-tools-website
# Build tools, commit, push
```

---

## Branch Strategy

### Main Branch
- Protected
- Requires pull request
- COO approval required for merges

### Feature Branches
```bash
# Create branch for batch analysis
git checkout -b analysis/2025-week-47

# Add multiple analyses
git add high-priority/*.md medium-priority/*.md

# Commit
git commit -m "Weekly analysis: 5 features (3 P1, 2 P2)"

# Push and create PR
git push -u origin analysis/2025-week-47
gh pr create --title "Week 47 Feature Analysis" --body "Analyzed 5 new features from feedback repo"
```

---

## Automation Opportunities

### GitHub Actions

**future-tools/.github/workflows/notify-engineering.yml**:
```yaml
name: Notify Engineering on High Priority

on:
  push:
    paths:
      - 'high-priority/**'

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Slack Notification
        run: |
          curl -X POST -H 'Content-type: application/json' \
          --data '{"text":"New high-priority tool added to roadmap!"}' \
          ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

## Status

- [ ] Create conveniencepro/future-tools repository
- [ ] Initialize git in future-tools/
- [ ] Push initial structure
- [ ] Add to utility-tools-template/.gitignore
- [ ] Configure team permissions
- [ ] Document in main README
- [ ] Test workflow with engineering team

---

**Next Steps**: Create repository and follow setup steps above
