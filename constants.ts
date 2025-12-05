import { Course } from './types';

export const GEMINI_TEXT_MODEL = 'gemini-2.5-flash';
export const GEMINI_IMAGE_MODEL = 'gemini-2.5-flash-image';

export const COURSES: Course[] = [
  {
    id: 'day-1-foundation',
    title: 'Day 1: Foundation & First Assets',
    description: 'Establish your AI environment, codify your brand voice, and produce your first assets. 6-hour curriculum.',
    tags: ['Setup', 'Brand Voice', 'Visuals'],
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
    modules: [
      {
        id: 'm1.1-welcome',
        title: 'Module 1.1: Welcome & Expectations',
        duration: '15 min',
        type: 'video',
        content: `
### Welcome to Stop the Content Grind
Today is where your entire system gets assembled—your tools, your voice, your context, your first outputs.

**By the end of Day 1, you’ll have:**
*   A fully configured AI environment
*   A codified brand voice
*   Your first long-form piece
*   Ten AI-generated visuals

This is not theory. Today is execution.
        `,
        quiz: [
          {
            id: 'q1-goal',
            question: 'What is the primary outcome of Day 1?',
            options: ['To learn theory', 'To build a full website', 'To configure your AI environment and produce first assets', 'To hire a team'],
            correctAnswer: 2,
            explanation: 'Day 1 is focused on setting up your foundation and producing your first tangible assets.'
          }
        ]
      },
      {
        id: 'm1.2-setup',
        title: 'Module 1.2: AI Tool Arsenal Setup',
        duration: '45 min',
        type: 'lab',
        content: `
### Tool Stack Setup
We’re getting your stack online so nothing slows you down later.

**1. Account Verification:**
*   ChatGPT Plus / Claude Pro
*   Midjourney / DALL·E

**2. Browser Extensions:**
*   Notion AI
*   Grammarly
*   SaveToNotion

**3. Folder Structure:**
*   /AI Machine
*   /Brand Context
*   /Voice & Prompts
*   /Image Prompts
*   /Published Content
        `
      },
      {
        id: 'ex-1-prompt',
        title: 'Live Exercise 1: First Prompt Test',
        duration: '30 min',
        type: 'lab',
        content: `
### Business Input Template
Input your business into the template, generate headlines, and test your results.

**Template Prompt:**
"Using the business info above, generate 3 strong headline variations that:
- hook instantly
- emphasize outcome
- avoid clichés
- use clear, high-impact language"

**Deliverable:**
1. Screenshot of AI dashboard
2. 3 refined headlines
        `
      },
      {
        id: 'm2.1-voice',
        title: 'Module 2.1: Voice DNA Extraction',
        duration: '30 min',
        type: 'reading',
        content: `
### Voice Analysis Framework
Codify the exact rules that make your voice distinct.

**1. Tone Spectrum Sliders (1-10):**
*   Formal ↔ Casual
*   Technical ↔ Conversational
*   Polished ↔ Raw

**2. Vocabulary Mapping:**
*   Power words
*   Industry terminology
*   "Signature phrases"
*   Phrases to avoid
        `,
        quiz: [
          {
            id: 'q1-voice',
            question: 'Why is defining "Never-Say Phrases" important?',
            options: ['It limits your creativity', 'It ensures brand consistency and avoids generic AI tone', 'It makes the AI work slower', 'It is not important'],
            correctAnswer: 1,
            explanation: 'Explicitly telling the AI what NOT to say is as important as what TO say for maintaining a unique brand voice.'
          }
        ]
      },
      {
        id: 'proj-1-brand-brief',
        title: 'Live Project: Brand Voice Brief',
        duration: '45 min',
        type: 'lab',
        content: `
### Build These Assets
1.  **AI-Refined Mission Statement**
2.  **Audience Psychographics** (motives, fears, desires)
3.  **10 Sample Phrases in Brand Voice**
4.  **5 Never-Say Phrases**
5.  **Tone Calibration Scale**
        `
      },
      {
        id: 'm2.2-long-form',
        title: 'Module 2.2: Long-Form Content Generation',
        duration: '15 min',
        type: 'reading',
        content: `
### Reliable Structures
*   **Listicle Format**
*   **How-To Process Format**
*   **Thought Leadership Format**
*   **Case Study Format**

**SEO & Human Layer:**
*   Use 1 primary keyword, 2-3 secondary.
*   Add contrarian statements, personal anecdotes, specific details.
        `
      },
      {
        id: 'ex-2-blog',
        title: 'Live Exercise 2: First Blog Post',
        duration: '60 min',
        type: 'lab',
        content: `
### 1,500-word Article
Write a 1,500-word article using the course’s blog-generation prompt pack.

**Peer Review Requirements:**
*   Comment on clarity
*   Identify weak sections
*   Suggest 1 additional angle
        `
      },
      {
        id: 'm3.1-image-prompt',
        title: 'Module 3.1: Image Prompt Engineering',
        duration: '30 min',
        type: 'reading',
        content: `
### Anatomy of a Strong Image Prompt
1.  **Subject**
2.  **Style**
3.  **Camera/Angle**
4.  **Lighting**
5.  **Composition**
6.  **Mood**

**Style Consistency:**
*   Use seed numbers
*   Use a consistent adjective stack
        `,
        quiz: [
          {
            id: 'q1-image',
            question: 'Which element helps most with maintaining style consistency across multiple images?',
            options: ['Changing the subject', 'Using a consistent "adjective stack" and seed', 'Using different AI models', 'Keeping the prompt very short'],
            correctAnswer: 1,
            explanation: 'Reusing the same stylistic descriptors (adjective stack) and seed ensures the visual vibe remains consistent.'
          }
        ]
      },
      {
        id: 'sprint-1-graphics',
        title: 'Sprint Challenge 1: 10 Graphics',
        duration: '60 min',
        type: 'lab',
        content: `
### Create 10 Graphics in 60 Minutes
*   3 social posts
*   2 blog headers
*   3 IG story templates
*   2 LI carousel slides

**Submission:** Upload best 3 to gallery.
        `
      }
    ]
  },
  {
    id: 'day-2-production',
    title: 'Day 2: Content Production Machine',
    description: 'Move from scattered creation to predictable, systematic output. Build a 30-day calendar and automate social media.',
    tags: ['Automation', 'Social Media', 'Video', 'SEO'],
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
    modules: [
      {
        id: 'm4.1-calendar',
        title: 'Module 4.1: Calendar Strategy',
        duration: '30 min',
        type: 'reading',
        content: `
### Content Pillars
*   **Educate:** tutorials, frameworks
*   **Entertain:** stories, humor
*   **Engage:** polls, questions
*   **Promote:** product pushes

**Batching Strategy:**
Batch 10 hooks → turn into 30 posts → turn into 90 variations.
        `
      },
      {
        id: 'proj-2-calendar',
        title: 'Live Project 2: 30-Day Calendar',
        duration: '60 min',
        type: 'lab',
        content: `
### Generate 30-Day Calendar
*   30 post ideas (headline-level)
*   30 hooks
*   3 platform variations each
*   12 hashtag groups
*   5 repurposing opportunities highlighted
        `
      },
      {
        id: 'm4.2-repurposing',
        title: 'Module 4.2: Repurposing Formulas',
        duration: '30 min',
        type: 'reading',
        content: `
### Blog → 10 Social Posts Formula
1. Quote
2. Statistic
3. Opinion
4. Infographic
5. Carousel
6. LinkedIn essay
7. Tweet thread
8. Hook rewrite
9. Contrarian take
10. Q&A format
        `,
        quiz: [
          {
            id: 'q1-strategy',
            question: 'What is the primary goal of the "Batching Strategy"?',
            options: ['To write one post at a time', 'To turn a few core ideas into many variations efficiently', 'To avoid using AI', 'To post only on one platform'],
            correctAnswer: 1,
            explanation: 'Batching allows you to scale output by deriving multiple assets from core ideas.'
          }
        ]
      },
      {
        id: 'm5.1-video-script',
        title: 'Module 5.1: Video Scripting System',
        duration: '45 min',
        type: 'video',
        content: `
### Framework: Hook → Body → CTA
*   **Hook:** pattern interrupt, bold claim, question
*   **Body:** 3 supporting points
*   **CTA:** soft or hard ask

**Caption & Subtitles:**
*   Autogenerated SRT
*   70–110 WPM teleprompter pacing
        `,
        quiz: [
          {
            id: 'q1-video',
            question: 'What are the three core components of a video script?',
            options: ['Intro, Outro, Music', 'Hook, Body, CTA', 'Title, Description, Tags', 'Visuals, Audio, Text'],
            correctAnswer: 1,
            explanation: 'A strong script follows the Hook (grab attention), Body (deliver value), and CTA (call to action) structure.'
          }
        ]
      },
      {
        id: 'sprint-2-scripts',
        title: 'Sprint Challenge 2: Script 5 Videos',
        duration: '60 min',
        type: 'lab',
        content: `
### Required Scripts
*   1 tutorial
*   3 short-form
*   1 promo

**Every Script Must Include:**
*   Hook
*   3 key points
*   CTA
        `
      },
      {
        id: 'm5.2-faceless',
        title: 'Module 5.2: Faceless Video Production',
        duration: '15 min',
        type: 'reading',
        content: `
### Tools & Workflow
*   Stock AI footage (Pexels, Runway, Storyblocks)
*   AI voiceover options
*   AI avatar tools
*   Auto-subtitles workflow
        `
      },
      {
        id: 'm6.1-copywriting',
        title: 'Module 6.1: Conversion Copywriting',
        duration: '45 min',
        type: 'reading',
        content: `
### Frameworks
**PAS:** Problem, Agitate, Solution
**AIDA:** Attention, Interest, Desire, Action

**Feature → Benefit Translation:**
Feature: "AI calendar generator"
Benefit: "Never run out of content again."
        `,
        quiz: [
          {
            id: 'q1-copy',
            question: 'What does the "PAS" copywriting framework stand for?',
            options: ['Product, Audience, Sales', 'Problem, Agitate, Solution', 'Post, Analyze, Share', 'Plan, Act, Succeed'],
            correctAnswer: 1,
            explanation: 'PAS stands for Problem (identify pain), Agitate (make it visceral), Solution (offer the fix).'
          }
        ]
      },
      {
        id: 'ex-3-landing-page',
        title: 'Live Exercise 3: Landing Page Copy',
        duration: '45 min',
        type: 'lab',
        content: `
### Students Produce:
*   5 headlines
*   Subheadline
*   Hero section copy
*   3 benefit sections
*   Testimonials
*   CTA buttons
        `
      },
      {
        id: 'm6.2-email',
        title: 'Module 6.2: Email Sequence Builder',
        duration: '30 min',
        type: 'reading',
        content: `
### Welcome Sequence Structure
1.  Welcome / story
2.  Value lesson
3.  Quick win
4.  Deeper problem
5.  Social proof
6.  Offer
7.  Reminder / CTA
        `
      },
      {
        id: 'sprint-3-email',
        title: 'Sprint Challenge 3: 7-Email Series',
        duration: '30 min',
        type: 'lab',
        content: `
### Generate Full Sequence
Students generate full 7-email welcome sequence + preview text.
        `
      },
      {
        id: 'm7.1-keyword',
        title: 'Module 7.1: Keyword Research',
        duration: '45 min',
        type: 'reading',
        content: `
### Core Concepts
*   Search intent categories
*   Long-tail clustering
*   Gap analysis against competitors

**Template Output:**
*   50 keywords
*   Intent label
*   Difficulty estimate
*   Cluster group
        `,
        quiz: [
          {
            id: 'q1-keyword',
            question: 'What is "Long-tail clustering"?',
            options: ['Grouping short keywords together', 'Grouping related specific (long-tail) keywords to build topical authority', 'Ignoring long keywords', 'Only using one keyword per page'],
            correctAnswer: 1,
            explanation: 'Clustering long-tail keywords helps you cover a topic comprehensively and build authority.'
          }
        ]
      },
      {
        id: 'proj-3-keyword',
        title: 'Live Project 3: Keyword Strategy',
        duration: '45 min',
        type: 'lab',
        content: `
### Deliverables
*   50 keywords
*   1 pillar topic
*   5 subtopic clusters
*   Keyword → URL mapping
        `
      },
      {
        id: 'm7.2-onpage',
        title: 'Module 7.2: On-Page Optimization',
        duration: '30 min',
        type: 'reading',
        content: `
### Optimization Checklist
*   Rewrite meta descriptions
*   Generate header hierarchy
*   Optimize alt text
*   Add internal links
        `,
        quiz: [
          {
            id: 'q2-seo',
            question: 'What is a key component of on-page optimization?',
            options: ['Keyword stuffing', 'Header hierarchy and meta descriptions', 'Buying backlinks', 'Hiding text'],
            correctAnswer: 1,
            explanation: 'Proper structure (headers) and meta descriptions are fundamental to on-page SEO.'
          }
        ]
      }
    ]
  },
  {
    id: 'day-3-systems',
    title: 'Day 3: Advanced Systems & Launch',
    description: 'Become an architect. Build automated pipelines, custom GPTs, and a 90-day rollout plan.',
    tags: ['Workflows', 'Custom GPTs', 'Scaling'],
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    modules: [
      {
        id: 'm8.1-automation',
        title: 'Module 8.1: No-Code Automation',
        duration: '45 min',
        type: 'video',
        content: `
### Zapier Integration
*   Connecting ChatGPT, Notion, Google Drive, WordPress
*   Parsing incoming content
*   Building a simple Content → Repurpose → Schedule chain

**Example Workflow:**
New blog → GPT summarizer → headline variations → auto-publish to LinkedIn.
        `,
        quiz: [
          {
            id: 'q1-automation',
            question: 'What is the role of a "Trigger" in an automation workflow?',
            options: ['It stops the workflow', 'It initiates the workflow based on an event', 'It deletes data', 'It writes the content'],
            correctAnswer: 1,
            explanation: 'A trigger is the event (e.g., "New blog post") that starts the automated sequence.'
          }
        ]
      },
      {
        id: 'demo-automation',
        title: 'Live Demo: Build Automation',
        duration: '30 min',
        type: 'video',
        content: `
### Workflow Built Live
1.  **Trigger:** New blog post published
2.  **Action 1:** GPT → generate 5 social posts
3.  **Action 2:** GPT → create image prompts
4.  **Action 3:** DALL·E → generate graphics
5.  **Action 4:** Schedule to Buffer
        `
      },
      {
        id: 'm8.2-custom-gpt',
        title: 'Module 8.2: Custom GPT Creation',
        duration: '45 min',
        type: 'reading',
        content: `
### When to Use Custom GPT
*   You constantly repeat prompts
*   You have strict brand rules
*   You want a dedicated "Content Brain"

**Training:**
Upload Brand Voice Brief, Visual Style Guide, sample posts.
        `
      },
      {
        id: 'proj-4-brand-gpt',
        title: 'Live Project 4: Build Brand GPT',
        duration: '45 min',
        type: 'lab',
        content: `
### Steps
1.  Upload Brand Voice Document
2.  Add product/service details
3.  Add reusable prompt templates
4.  Save, test, refine
        `
      },
      {
        id: 'm9.1-human-edit',
        title: 'Module 9.1: The Human Edit Process',
        duration: '45 min',
        type: 'reading',
        content: `
### Generic AI Tells
*   Overusing "in today’s world…"
*   Repeating intro structure
*   Symmetrical sentence patterns

**Injection Points:**
Add personal anecdotes, metaphors, contrarian angles, specific data.
        `
      },
      {
        id: 'ex-4-editing',
        title: 'Live Exercise 4: Editing Sprint',
        duration: '30 min',
        type: 'lab',
        content: `
### Before/After Editing
1.  Show raw AI output
2.  Call out issues
3.  Edit live
4.  Compare before vs after
        `
      },
      {
        id: 'm9.2-editorial',
        title: 'Module 9.2: Building Editorial Standards',
        duration: '30 min',
        type: 'reading',
        content: `
### Standards Checklist
*   Voice consistency
*   Formatting rules
*   Brand vocabulary
*   Forbidden tone types
*   AI disclosure policy
        `
      },
      {
        id: 'm10.1-roadmap',
        title: 'Module 10.1: 90-Day Roadmap',
        duration: '45 min',
        type: 'reading',
        content: `
### Roadmap Template
**Weeks 1–4: Foundation**
*   Publish 3× weekly
*   Build automation v1

**Weeks 5–8: Optimization**
*   Test 2 new content formats
*   Improve automation

**Weeks 9–12: Scaling**
*   Delegate tasks
*   Expand platform presence
        `
      },
      {
        id: 'proj-5-action-plan',
        title: 'Live Project 5: Personal Action Plan',
        duration: '45 min',
        type: 'lab',
        content: `
### Complete:
*   Week 1 task list
*   Final tool stack list
*   Budget sheet
*   Delegation plan
*   KPI definition
        `
      },
      {
        id: 'm10.2-obstacle',
        title: 'Module 10.2: Obstacle Premortem',
        duration: '30 min',
        type: 'reading',
        content: `
### Failure Safeguards
*   Common failure patterns (burnout, perfectionism)
*   Backup plans
*   Community accountability
*   Workflow redundancy
        `,
        quiz: [
          {
            id: 'q3-comprehensive',
            question: 'What is a primary purpose of the "Obstacle Premortem"?',
            options: ['To complain about the course', 'To identify potential failure points and build safeguards', 'To give up before starting', 'To blame AI for mistakes'],
            correctAnswer: 1,
            explanation: 'Anticipating obstacles allows you to build systems to overcome them.'
          }
        ]
      },
      {
        id: 'm11.1-portfolio',
        title: 'Module 11.1: Portfolio Review',
        duration: '60 min',
        type: 'lab',
        content: `
### Present Work
*   Best 3 pieces
*   Automation workflow
*   Branding GPT output

**Critique:**
Instructor provides sharp critique on headlines, CTAs, and workflows.
        `
      },
      {
        id: 'm11.2-accountability',
        title: 'Module 11.2: Accountability Lock-In',
        duration: '30 min',
        type: 'reading',
        content: `
### Next Steps
*   "30-Day Content Challenge" walkthrough
*   Partner assignments
*   Private community onboarding
*   Weekly check-in calendar
        `
      }
    ]
  }
];