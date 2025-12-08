# r/ConveniencePro - Launch Checklist

**Document Type**: Launch Execution Plan
**Version**: 1.0
**Last Updated**: 2025-11-24
**Status**: Pre-Launch Planning

---

## Overview

This checklist ensures r/ConveniencePro launches successfully with all systems in place, content prepared, and team ready to engage. Follow this step-by-step to go from empty subreddit to thriving community.

**Timeline**: 2-3 weeks from start to public launch

---

## Phase 1: Pre-Launch Setup (Week 1-2)

### Subreddit Configuration

**Basic Settings**:
- [ ] Create subreddit r/ConveniencePro
- [ ] Set subreddit to "Public"
- [ ] Set language to English
- [ ] Enable "Allow people to post" option
- [ ] Set content tag requirements (optional)
- [ ] Configure spam filter settings (low initially)
- [ ] Enable user flair
- [ ] Enable post flair
- [ ] Configure suggested sort for posts (Best)

**Subreddit Type**:
- [ ] Set type: Public
- [ ] Set maturity: General Audience (no NSFW)
- [ ] Set content tags: Productivity, Tools, Privacy, Workflows

**Description & About**:
- [ ] Write and upload main description (500 char limit)
- [ ] Write extended sidebar description
- [ ] Set subreddit topics/tags for discovery
- [ ] Write "About Community" section
- [ ] Add subreddit creation date and info

---

### Visual Identity

**Icon**:
- [ ] Design subreddit icon (512x512px, per visual-identity.md)
- [ ] Get team approval on icon design
- [ ] Export @1x, @2x, @3x versions
- [ ] Upload icon to Reddit

**Banner**:
- [ ] Design desktop banner (1920x384px)
- [ ] Design mobile banner (640x192px)
- [ ] Get team approval on banner design
- [ ] Export at recommended resolutions
- [ ] Upload banners to Reddit
- [ ] Test appearance on desktop and mobile
- [ ] Verify text is readable

**Color Scheme**:
- [ ] Set primary color: #2563EB
- [ ] Set highlight color: #60A5FA
- [ ] Configure header background color
- [ ] Test colors in light and dark mode
- [ ] Verify accessibility (contrast ratios)

---

### Menu and Navigation

**Menu Tabs**:
- [ ] Create "Home" tab (default)
- [ ] Create "Rules" tab (link to wiki rules)
- [ ] Create "FAQ" tab (link to wiki FAQ)
- [ ] Create "Tools" tab (link to conveniencepro.cc)
- [ ] Create "Weekly Threads" tab (collection)
- [ ] Create "Best Of" tab (collection)

**Collections** (if using):
- [ ] Create "Weekly Threads" collection
- [ ] Create "Best Workflows" collection
- [ ] Create "Tutorials" collection

---

### Rules Configuration

**Create Rules** (per rules.md):
1. [ ] Rule 1: Be Respectful and Constructive
2. [ ] Rule 2: Stay On Topic
3. [ ] Rule 3: No Spam or Self-Promotion Without Value
4. [ ] Rule 4: Search Before Posting
5. [ ] Rule 5: Provide Context and Details
6. [ ] Rule 6: No Privacy-Invasive Recommendations
7. [ ] Rule 7: Give Credit and Cite Sources
8. [ ] Rule 8: No Illegal Content or Requests
9. [ ] Rule 9: Respect Moderator Decisions
10. [ ] Rule 10: Use Appropriate Flairs and Titles

**For Each Rule**:
- [ ] Write short version (appears in sidebar)
- [ ] Write full version (appears in rule details)
- [ ] Set violation reason for reports
- [ ] Configure removal reason template

---

### Flair Configuration

**User Flairs**:
- [ ] 🆕 New Member
- [ ] 💼 Small Business Owner
- [ ] 🎓 Student
- [ ] 💻 Developer
- [ ] 🔒 Privacy Advocate
- [ ] ⚡ Power User
- [ ] 🏆 Workflow Wizard
- [ ] 🌟 Community Helper
- [ ] 🛠️ Tool Master
- [ ] 👑 MVP

**Post Flairs**:
- [ ] 💡 Workflow Share (Purple: #8B5CF6)
- [ ] 🆘 Help Needed (Red: #EF4444)
- [ ] 🐛 Bug Report (Dark Red: #DC2626)
- [ ] ✨ Feature Request (Cyan: #06B6D4)
- [ ] 📚 Tutorial (Green: #10B981)
- [ ] 💬 Discussion (Gray: #6B7280)
- [ ] 📰 News & Updates (Blue: #3B82F6)
- [ ] 🎉 Success Story (Amber: #F59E0B)
- [ ] 🗳️ Poll / Survey (Purple: #8B5CF6)
- [ ] 📌 Announcement (Primary Blue: #2563EB) [Mod only]
- [ ] 🎯 Weekly Thread (Emerald: #059669) [Mod only]

**Configuration**:
- [ ] Set flair colors per visual-identity.md
- [ ] Test flair appearance in light/dark mode
- [ ] Enable user flair self-assignment
- [ ] Set post flair as required

---

### AutoModerator Setup

**Create AutoModerator Rules**:

**Rule 1: Minimum Account Requirements**
```yaml
# Minimum account age and karma
type: submission
author:
    combined_karma: "< 5"
    account_age: "< 3 days"
action: filter
action_reason: "New account - manual review"
```

**Rule 2: Welcome New Users**
```yaml
# Welcome message for first-time posters
type: submission
author:
    is_contributor: false
moderators_exempt: false
action: approve
comment: |
    Welcome to r/ConveniencePro! 👋

    Thanks for posting. Here are some tips:
    - Check if your question has been answered in our FAQ
    - Be specific about your issue (browser, OS, tool used)
    - Screenshots help!
    - We're a friendly community - don't hesitate to ask!
```

**Rule 3: Auto-Reply to Help Posts**
```yaml
# Help request auto-response
type: submission
flair_text: "Help Needed"
comment: |
    Thanks for posting a help request! To get the fastest support:

    ✅ What tool are you using?
    ✅ What browser and version?
    ✅ What OS?
    ✅ What exactly happened vs. what you expected?
    ✅ Can you share a screenshot?

    Community members and moderators will respond soon!
```

**Rule 4: Spam Filter**
```yaml
# Filter common spam patterns
type: submission
title+body: ["make money fast", "click here", "limited time offer"]
action: spam
action_reason: "Spam keywords detected"
```

**Rule 5: Referral Link Filter**
```yaml
# Filter undisclosed referral/affiliate links
type: submission
body: ["ref=", "affiliate", "?aff="]
~body: ["disclosure", "affiliate link"]
action: filter
action_reason: "Possible undisclosed affiliate link"
comment: |
    Your post has been filtered because it contains what appears to be an affiliate or referral link.

    If you're sharing a relevant tool with an affiliate link, please add a clear disclosure and explanation of why it's relevant to r/ConveniencePro.

    Message the moderators if you believe this was in error.
```

**Checklist**:
- [ ] Create AutoModerator wiki page
- [ ] Add all AutoMod rules
- [ ] Test each rule with dummy accounts
- [ ] Adjust thresholds based on spam levels
- [ ] Document rules for future reference

---

### Widget Configuration (Sidebar)

**Widget 1: Rules**
- [ ] Add rules widget (auto-generated)

**Widget 2: Quick Links**
- [ ] Title: "Quick Start"
- [ ] Add link to Welcome Post
- [ ] Add link to Rules
- [ ] Add link to FAQ Wiki
- [ ] Add link to ConveniencePro website
- [ ] Add link to latest discussion thread

**Widget 3: Weekly Threads**
- [ ] Title: "This Week"
- [ ] Add link to current Workflow Wednesday
- [ ] Add link to current Feature Friday
- [ ] Add link to current Weekend Showcase
- [ ] Update weekly

**Widget 4: Community Stats**
- [ ] Title: "Community Stats"
- [ ] Add member count (auto)
- [ ] Add online count (auto)
- [ ] Add custom stats (tools available, workflows shared)
- [ ] Update monthly

**Widget 5: Recognition**
- [ ] Title: "This Month's Stars"
- [ ] Add Workflow of the Month winner
- [ ] Add Helper of the Month winner
- [ ] Add Creative Use Award winner
- [ ] Update monthly

**Widget 6: About ConveniencePro**
- [ ] Title: "About ConveniencePro"
- [ ] Add bullet points (free, privacy-first, no login, etc.)
- [ ] Add button linking to conveniencepro.cc
- [ ] Add custom imagery if desired

---

### Wiki Setup

**Create Wiki Pages**:
- [ ] Enable wiki
- [ ] Set wiki edit permissions (mods only initially)
- [ ] Create index page
- [ ] Create FAQ page
- [ ] Create rules page (comprehensive version)
- [ ] Create tool roadmap page
- [ ] Create workflow collection page
- [ ] Create tutorial index page

**FAQ Content** (to be written):
- [ ] What is ConveniencePro?
- [ ] Is it really free?
- [ ] Do you collect my data?
- [ ] How can I suggest new tools?
- [ ] What browsers are supported?
- [ ] Can I use tools offline?
- [ ] How can I support ConveniencePro?
- [ ] Who built this?
- [ ] Common troubleshooting issues

---

### Content Preparation

**Seed Posts** (prepare 10-15 before launch):

High-Quality Posts to Prepare:
- [ ] Post 1: "My freelance document workflow" (Workflow Share)
- [ ] Post 2: "How I use ConveniencePro for client projects" (Workflow Share)
- [ ] Post 3: "Best PDF tools for small business" (Tutorial)
- [ ] Post 4: "Privacy-first alternatives to Google Docs for simple edits" (Discussion)
- [ ] Post 5: "Image optimization workflow for web designers" (Workflow Share)
- [ ] Post 6: "5 ConveniencePro tools every student should know" (Tutorial)
- [ ] Post 7: "How I saved 10 hours/week with these file conversion tools" (Success Story)
- [ ] Post 8: "Complete guide to PDF merging and splitting" (Tutorial)
- [ ] Post 9: "Remote work document workflow" (Workflow Share)
- [ ] Post 10: "Financial calculator comparison and when to use each" (Tutorial)
- [ ] Post 11-15: Additional diverse content

**Content Mix**:
- [ ] 4-5 Workflow Shares
- [ ] 3-4 Tutorials
- [ ] 2-3 Discussions
- [ ] 1-2 Success Stories
- [ ] Diverse tool coverage (PDF, image, text, financial, etc.)

**Quality Standards**:
- [ ] Each post is 300+ words
- [ ] Includes specific examples
- [ ] Screenshots where appropriate
- [ ] Helpful, not promotional tone
- [ ] Proper formatting and structure

---

### Team Preparation

**Moderator Setup**:
- [ ] Add all team moderators with appropriate permissions
- [ ] Create moderator guidelines document
- [ ] Schedule moderator training session
- [ ] Assign initial responsibilities:
  - [ ] Primary responder (first 48 hours)
  - [ ] Content poster
  - [ ] Community engagement lead
  - [ ] Technical support specialist
- [ ] Set up moderator communication channel (Discord, Slack, etc.)

**Response Playbook**:
- [ ] Create template responses for common questions
- [ ] Define escalation process for technical issues
- [ ] Establish crisis communication protocol
- [ ] Document brand voice and tone guidelines
- [ ] Create FAQ for moderators

**Monitoring Tools**:
- [ ] Set up Reddit notifications for subreddit
- [ ] Configure modmail notifications
- [ ] Set up keyword alerts (if using third-party tools)
- [ ] Create monitoring schedule (who checks when)

---

### Beta Testing (Internal)

**Week Before Launch**:
- [ ] Invite 5-10 trusted ConveniencePro users to private beta
- [ ] Ask them to test:
  - [ ] Posting with different flairs
  - [ ] Commenting and replying
  - [ ] Navigating sidebar and wiki
  - [ ] Searching for content
  - [ ] Mobile experience
  - [ ] Dark mode appearance
- [ ] Gather feedback on:
  - [ ] Visual design
  - [ ] Rules clarity
  - [ ] Content quality
  - [ ] Overall first impression
- [ ] Make adjustments based on feedback

---

### Launch Announcement Preparation

**ConveniencePro Website**:
- [ ] Add subreddit link to website footer
- [ ] Add "Join our community" CTA on homepage (subtle)
- [ ] Link to subreddit in FAQ/Support section
- [ ] Test all links

**Launch Announcement Post** (for other subreddits):
- [ ] Draft announcement for r/productivity
- [ ] Draft announcement for r/privacy
- [ ] Draft announcement for r/newreddits
- [ ] Draft announcement for relevant communities
- [ ] Get moderator approval for cross-posts (where required)
- [ ] Prepare to respond to comments/questions

**Email** (if you have email list):
- [ ] Draft launch announcement email
- [ ] Include subreddit link and CTA
- [ ] Preview and test
- [ ] Schedule for launch day

---

## Phase 2: Launch Day (Day 1)

### Hour 0-2: Soft Launch

**Morning Preparation** (before going public):
- [ ] Final review of all settings
- [ ] Post Welcome Post (sticky #1)
- [ ] Post first 3-5 seed posts with timestamps
- [ ] Verify all links work
- [ ] Test on mobile and desktop

**Go Public**:
- [ ] Make subreddit public (if was private for testing)
- [ ] Announce to team that we're live
- [ ] Post to ConveniencePro website announcement

**Internal Beta Launch**:
- [ ] Invite beta testers to start engaging
- [ ] Post internal announcement to team channels
- [ ] Share with ConveniencePro early adopters/power users (if you have list)

---

### Hour 2-6: External Announcement

**Cross-Post to Related Communities**:

**r/productivity**:
- [ ] Post: "[New Community] r/ConveniencePro - Privacy-first productivity tools"
- [ ] Include context, not just link
- [ ] Engage with comments immediately
- [ ] Monitor for 2-3 hours after posting

**r/privacy**:
- [ ] Post: "New community for privacy-respecting productivity tools"
- [ ] Emphasize client-side processing and zero data collection
- [ ] Engage authentically with privacy-conscious users

**r/newreddits**:
- [ ] Post: "r/ConveniencePro - Community for free, privacy-first productivity tools"
- [ ] Include subreddit description
- [ ] Note it's brand new and invite participation

**Industry-Specific Subreddits** (choose 2-3):
- [ ] r/freelance
- [ ] r/smallbusiness
- [ ] r/digitalnomad
- [ ] r/entrepreneur
- [ ] Follow each community's self-promotion rules
- [ ] Add value, don't just promote

**Response Protocol**:
- [ ] Reply to every comment within 1 hour
- [ ] Thank everyone who subscribes
- [ ] Answer all questions thoroughly
- [ ] Redirect interested users to Welcome Post

---

### Hour 6-24: Active Engagement

**Content Posting**:
- [ ] Post 2-3 more seed posts throughout day
- [ ] Space posts 3-4 hours apart
- [ ] Vary post types and topics
- [ ] Use different accounts if available (team members)

**Community Engagement**:
- [ ] Welcome every new subscriber in comments
- [ ] Respond to all posts and comments
- [ ] Upvote quality contributions
- [ ] Ask follow-up questions to encourage discussion
- [ ] Thank users for valuable input

**Monitoring**:
- [ ] Check modqueue every hour
- [ ] Monitor spam filter
- [ ] Review all reported content
- [ ] Track subscriber growth
- [ ] Note any technical issues
- [ ] Document feedback and suggestions

**Evening Check**:
- [ ] Review day's activity
- [ ] Address any issues that arose
- [ ] Plan next day's content
- [ ] Communicate with team about progress
- [ ] Celebrate wins (first 10/50/100 members!)

---

### Day 1 Goals

**Target Metrics**:
- [ ] 50-100 subscribers
- [ ] 10+ organic posts (including seed content)
- [ ] 20+ comments
- [ ] 100+ total impressions
- [ ] Zero spam or rule violations
- [ ] All questions answered

**Success Indicators**:
- Positive comments and feedback
- Users introducing themselves
- First organic workflow share
- Questions being answered by community (not just mods)
- Users finding value and saying so

---

## Phase 3: Week 1 (Days 2-7)

### Daily Tasks

**Every Morning**:
- [ ] Review overnight activity
- [ ] Respond to all new posts/comments
- [ ] Clear modqueue
- [ ] Post or schedule 1-2 pieces of content
- [ ] Update sidebar widgets if needed

**Every Evening**:
- [ ] Final response check
- [ ] Review day's growth
- [ ] Plan next day's content
- [ ] Note any issues or patterns
- [ ] Celebrate milestones

---

### Content Calendar - Week 1

**Monday (Day 2)**:
- [ ] Morning: Post Tutorial ("Getting Started with ConveniencePro")
- [ ] Afternoon: Respond and engage with community
- [ ] Evening: Post seed content (Workflow Share)

**Tuesday (Day 3)**:
- [ ] Morning: Respond to all posts
- [ ] Afternoon: Post Discussion ("What tools do you wish existed?")
- [ ] Evening: Engage in discussion thread

**Wednesday (Day 4)**:
- [ ] Morning: Prepare Workflow Wednesday thread
- [ ] 9 AM: Post FIRST Workflow Wednesday (use template)
- [ ] All day: Actively engage in Workflow Wednesday
- [ ] Evening: Thank participants, highlight best workflows

**Thursday (Day 5)**:
- [ ] Morning: Post Tutorial or Help guide
- [ ] Afternoon: Follow up on Workflow Wednesday discussions
- [ ] Evening: Post seed content

**Friday (Day 6)**:
- [ ] Morning: Prepare Feature Friday thread
- [ ] 10 AM: Post FIRST Feature Friday (pick popular tool)
- [ ] All day: Engage in Feature Friday discussion
- [ ] Evening: Gather votes for next week's tool

**Saturday (Day 7)**:
- [ ] Morning: Post seed content (Success Story or Tutorial)
- [ ] Afternoon: Respond and engage
- [ ] Evening: Moderate and plan Sunday

**Sunday (Day 8)**:
- [ ] Noon: Post FIRST Weekend Project Showcase
- [ ] All day: Engage with project shares
- [ ] Evening: Feature best project, thank participants

---

### Week 1 Engagement Tactics

**Response Strategy**:
- [ ] Reply to EVERY post within 2 hours
- [ ] Reply to EVERY comment within 4 hours
- [ ] Ask follow-up questions to encourage discussion
- [ ] Thank users for contributions
- [ ] Highlight great comments

**Recognition**:
- [ ] Call out helpful users by name
- [ ] Award user flairs for contributions
- [ ] Screenshot and share great comments
- [ ] Express genuine appreciation

**Community Building**:
- [ ] Introduce moderators in comments
- [ ] Share "behind the scenes" insights
- [ ] Ask community for input on decisions
- [ ] Create polls for engagement
- [ ] Foster connections between users

---

### Week 1 Growth Tactics

**Organic Discovery**:
- [ ] Optimize post titles for search
- [ ] Use relevant keywords in posts
- [ ] Link to subreddit in helpful comments elsewhere (authentic, not spammy)
- [ ] Ensure high-quality content that people want to share

**Cross-Promotion** (careful, not spammy):
- [ ] Share 1-2 best posts to relevant subreddits (with context)
- [ ] Participate authentically in related communities
- [ ] Mention r/ConveniencePro when genuinely relevant
- [ ] Never violate other communities' rules

**Website Integration**:
- [ ] Monitor website traffic to subreddit
- [ ] Adjust CTA placement if needed
- [ ] Consider site-wide announcement banner (subtle)

---

### Week 1 Monitoring

**Daily Metrics to Track**:
- [ ] Subscriber growth (net new)
- [ ] Daily active users
- [ ] Posts per day (total and organic)
- [ ] Comments per post (average)
- [ ] Upvote engagement
- [ ] Moderation actions needed

**Qualitative Monitoring**:
- [ ] Sentiment of comments (positive/negative)
- [ ] Quality of discussions
- [ ] User-to-user interactions (are users helping each other?)
- [ ] Types of questions being asked
- [ ] Feature requests and feedback themes

**Issues to Watch For**:
- [ ] Spam or low-quality content
- [ ] Rule violations
- [ ] Negative sentiment or complaints
- [ ] Technical issues reported
- [ ] Confusion about subreddit purpose

---

### End of Week 1 Review

**Team Retrospective**:
- [ ] Schedule 30-60 minute team meeting
- [ ] Review metrics and goals
- [ ] Discuss what worked well
- [ ] Identify what needs improvement
- [ ] Gather team feedback on process
- [ ] Plan Week 2 adjustments

**Questions to Answer**:
1. Did we hit subscriber target (100-200 by end of Week 1)?
2. Is community engagement healthy (comments, discussions)?
3. Are users helping each other or just asking mods?
4. What content types perform best?
5. What issues arose and how did we handle them?
6. What should we do differently in Week 2?

**Adjustments to Make**:
- [ ] Content calendar tweaks based on engagement
- [ ] AutoMod rule adjustments if spam issues
- [ ] Sidebar/wiki updates based on common questions
- [ ] Moderation approach refinements
- [ ] Growth tactic pivots if needed

---

## Phase 4: Week 2-4 (Ongoing Launch Period)

### Week 2 Goals

**Targets**:
- [ ] 200-300 total subscribers
- [ ] 5-10 organic posts per week
- [ ] 50+ comments per week
- [ ] First user-generated tutorial or workflow
- [ ] First community member helps answer question

**Focus Areas**:
- [ ] Encourage user-generated content
- [ ] Identify potential power users
- [ ] Refine weekly thread formats
- [ ] Build wiki and FAQ based on actual questions
- [ ] Experiment with content types

---

### Week 3 Goals

**Targets**:
- [ ] 400-500 total subscribers
- [ ] 10+ organic posts per week
- [ ] 70%+ of posts are user-generated
- [ ] First "Helper of the Week" recognition
- [ ] First external mention or cross-post by user

**Focus Areas**:
- [ ] Reduce team-generated content
- [ ] Empower community leaders
- [ ] Optimize weekly thread timing and format
- [ ] Start featuring best community content
- [ ] Begin subtle growth tactics

---

### Week 4 Goals

**Targets**:
- [ ] 500-700 total subscribers
- [ ] 15+ organic posts per week
- [ ] 80%+ user-generated content
- [ ] Regular users emerging (5-10 repeat posters)
- [ ] Community starting to self-moderate (reports, helpful corrections)

**Focus Areas**:
- [ ] Identify community moderator candidates
- [ ] Launch recognition programs fully
- [ ] Build wiki comprehensively
- [ ] Create community case studies
- [ ] Plan Month 2 initiatives

---

## Success Criteria

### Quantitative Metrics

**By End of Week 1**:
- ✅ 100+ subscribers
- ✅ 15+ posts (seed + organic)
- ✅ 30+ comments
- ✅ 3+ organic posts from users

**By End of Week 4**:
- ✅ 500+ subscribers
- ✅ 50+ posts (80%+ organic)
- ✅ 200+ comments
- ✅ 10+ regular/repeat users
- ✅ 5+ external mentions or shares

### Qualitative Metrics

**Community Health**:
- ✅ Positive sentiment in majority of posts
- ✅ Users helping each other (not just mods answering)
- ✅ Minimal spam or rule violations
- ✅ Constructive criticism, not complaints
- ✅ Users sharing genuine workflows and tips

**Brand Alignment**:
- ✅ Privacy-first discussions happening naturally
- ✅ Users appreciate free, no-account tools
- ✅ Authentic tone maintained in all communications
- ✅ Community feels genuine, not corporate

**Sustainability Indicators**:
- ✅ Posts continue when mods don't seed content
- ✅ Questions get answered by community, not just mods
- ✅ Weekly threads generate consistent participation
- ✅ Users return to subreddit regularly

---

## Risk Mitigation

### If Week 1 Subscriber Goal Not Met

**Diagnose**:
- Is content high-quality and valuable?
- Are cross-posts reaching the right audiences?
- Is website traffic directing to subreddit?
- Are we engaging quickly enough with early users?

**Adjust**:
- Increase seed content quality
- More targeted cross-promotion
- Adjust website CTA prominence
- Faster response times

**Don't**:
- Buy subscribers or engagement
- Spam other communities
- Lower quality standards

---

### If Spam Becomes Issue

**Immediate**:
- [ ] Tighten AutoMod rules
- [ ] Increase account age/karma requirements
- [ ] Add more keyword filters
- [ ] Review and remove spam quickly

**Longer-term**:
- [ ] Recruit more moderators if needed
- [ ] Implement approved user list for trusted members
- [ ] Consider temporary restrictions if severe

---

### If Negative Community Culture Emerges

**Immediate**:
- [ ] Address rule violations quickly
- [ ] Model positive behavior aggressively
- [ ] Remove toxic content/users
- [ ] Post about community values

**Longer-term**:
- [ ] Review rule enforcement
- [ ] Strengthen community guidelines
- [ ] Feature positive examples prominently
- [ ] Consider cooling-off periods for problematic users

---

### If Low Engagement Despite Subscribers

**Diagnose**:
- Are posts valuable and discussion-worthy?
- Are we asking questions that invite response?
- Is content too promotional/not authentic?
- Are we responding to encourage more participation?

**Adjust**:
- More open-ended discussion posts
- Direct questions to community
- Feature and celebrate engagement
- Make it easier/clearer how to participate

---

## Post-Launch Maintenance

### Daily (First Month)

**Morning Routine** (15-30 min):
- [ ] Check modqueue
- [ ] Review overnight posts/comments
- [ ] Respond to all unanswered questions
- [ ] Post or schedule daily content

**Evening Routine** (15-30 min):
- [ ] Final response check
- [ ] Review and approve/remove reported content
- [ ] Update metrics tracking
- [ ] Plan next day

### Weekly (First Month)

**Monday**:
- [ ] Review previous week's metrics
- [ ] Plan week's content
- [ ] Update sidebar widgets
- [ ] Prepare monthly thread (if first Monday)

**Wednesday**:
- [ ] Post Workflow Wednesday (9 AM)
- [ ] Actively engage all day

**Friday**:
- [ ] Post Feature Friday (10 AM)
- [ ] Engage throughout day

**Sunday**:
- [ ] Post Weekend Project Showcase (noon)
- [ ] Feature previous week's best project
- [ ] Plan Monday content

**Weekly Review**:
- [ ] Team check-in (30 min)
- [ ] Review what worked/didn't
- [ ] Adjust approach for next week

### Monthly (Ongoing)

**First Monday**:
- [ ] Post Monthly Tool Request & Voting Thread
- [ ] Update recognition widgets (Helper of Month, etc.)
- [ ] Review and update FAQ based on questions
- [ ] Analyze metrics and trends
- [ ] Strategic planning session

---

## Resources and References

**Internal Documents**:
- `subreddit-strategy.md` - Overall strategy
- `rules.md` - Community rules
- `moderation-guidelines.md` - Detailed mod policies
- `content-templates.md` - Post templates
- `visual-identity.md` - Design guidelines
- `subreddit-description.md` - Sidebar content
- `welcome-post.md` - Welcome post text
- `about.md` - About page content

**External Resources**:
- [Reddit Mod Guidelines](https://www.redditinc.com/policies/moderator-guidelines)
- [Reddit Content Policy](https://www.redditinc.com/policies/content-policy)
- [Reddit Community Best Practices](https://reddithelp.com/en/categories/reddit-101)
- [AutoModerator Documentation](https://www.reddit.com/wiki/automoderator)

**Tools**:
- Reddit Mod Tools (built-in)
- Reddit Insights (for metrics)
- Google Analytics (if linking from website)
- Spreadsheet for tracking metrics
- Team communication channel

---

## Launch Team Roles

**Lead Moderator**:
- Overall strategy execution
- Final decision authority
- Crisis management
- Team coordination

**Community Manager**:
- Daily engagement and responses
- Content posting
- User relationship building
- Tone and voice guardian

**Technical Support**:
- Tool-related questions
- Bug report handling
- Feature request documentation
- Developer liaison

**Content Curator**:
- Seed content creation
- Weekly thread management
- Best-of collection
- Tutorial development

**All Team Members**:
- Monitor and respond
- Report issues
- Contribute ideas
- Support each other

---

## Communication Plan

**Internal (Team)**:
- Daily async updates in team channel
- Weekly 30-min sync meeting
- Emergency alerts for critical issues
- Shared tracking spreadsheet

**External (Community)**:
- Respond to all posts/comments
- Weekly threads for structured engagement
- Monthly announcements for updates
- Transparent communication about changes

---

## Launch Day Checklist Summary

**Final Pre-Launch** (1 hour before):
- [ ] All settings configured
- [ ] Visual design uploaded and tested
- [ ] Rules and flairs created
- [ ] AutoMod rules active
- [ ] Sidebar and wiki complete
- [ ] Welcome post ready
- [ ] Seed posts prepared
- [ ] Team briefed and ready
- [ ] Monitoring tools set up
- [ ] Response templates ready

**Launch** (Hour 0):
- [ ] Make subreddit public
- [ ] Post Welcome Post (sticky)
- [ ] Post first seed content
- [ ] Announce internally
- [ ] Begin monitoring

**First 6 Hours**:
- [ ] Cross-post to relevant subreddits
- [ ] Respond to all comments
- [ ] Welcome all subscribers
- [ ] Monitor for issues
- [ ] Post additional seed content

**First 24 Hours**:
- [ ] Continuous engagement
- [ ] Address all questions
- [ ] Clear any spam/reports
- [ ] Thank everyone
- [ ] Document feedback
- [ ] Celebrate milestones

---

**You're ready to launch!** 🚀

Good luck, and remember: **Authenticity, helpfulness, and patience** are the keys to community building. The first subscribers will set the tone - make them feel valued and heard.

---

**Document Owner**: Marketing & Community Team
**Review**: After Week 1, Week 4, then monthly
**Next Review**: Post-launch retrospective

**Version History**:
- v1.0 (2025-11-24): Initial launch checklist
