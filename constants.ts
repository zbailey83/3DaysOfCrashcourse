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
        videoUrl: '/3-Day-Overview-Intro-Video.mp4',
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
        id: 'ex-3-calendar',
        title: 'Live Exercise 3: 30-Day Calendar',
        duration: '45 min',
        type: 'lab',
        content: `
### Fill the Calendar
Using the "Calendar Architect" prompt, generate a 30-day plan.

**Requirements:**
*   Mix of formats (video, text, image)
*   Aligned with content pillars
*   Realistic production schedule
        `
      },
      {
        id: 'm4.2-repurposing',
        title: 'Module 4.2: The Repurposing Engine',
        duration: '20 min',
        type: 'reading',
        content: `
### One Idea, Many Assets
**Source:** 1 YouTube Video (10 min)
**Derivatives:**
1.  3 YouTube Shorts
2.  1 Blog Post
3.  1 Newsletter
4.  5 Tweets/Threads
5.  2 LinkedIn Posts
6.  3 IG Stories

**The Golden Rule:** Never create a piece of content that only lives once.
        `
      },
      {
        id: 'm5.1-video-script',
        title: 'Module 5.1: AI Video Scripting',
        duration: '30 min',
        type: 'reading',
        content: `
### Script Structure
1.  **The Hook (0-3s):** Visual + Verbal interruption.
2.  **The Retain (3-30s):** Promise value, show proof.
3.  **The Meat (30s-end):** Deliver value efficiently.
4.  **The CTA:** Clear instruction.

**AI Prompting:**
"Write a script for a 60-second vertical video about [topic] that is fast-paced, uses visual cues, and ends with a question."
        `
      },
      {
        id: 'ex-4-video',
        title: 'Live Exercise 4: Record 3 Shorts',
        duration: '60 min',
        type: 'lab',
        content: `
### Action!
1.  Generate 3 scripts.
2.  Record them on your phone (no fancy editing yet).
3.  Watch them back.

**Critique:**
*   Did you bore yourself?
*   Was the lighting okay?
*   Was the audio clear?
        `
      },
      {
        id: 'm5.2-automation',
        title: 'Module 5.2: Basic Automation',
        duration: '30 min',
        type: 'reading',
        content: `
### Tools for Automation
*   **Make.com / Zapier:** Connect apps.
*   **Buffer / Hypefury:** Schedule posts.

**Simple Workflow:**
New Blog Post (RSS) → ChatGPT (Summarize) → Buffer (Draft Tweet).
        `
      },
      {
        id: 'sprint-2-campaign',
        title: 'Sprint Challenge 2: Full Campaign',
        duration: '90 min',
        type: 'lab',
        content: `
### The "Launch" Simulation
Create a full campaign for a fictional product launch.
*   1 Landing Page Copy
*   5 Email Sequence
*   10 Social Posts
*   1 Video Script

**Goal:** Cohesion and speed.
        `
      }
    ]
  },
  {
    id: 'day-3-scale',
    title: 'Day 3: Scale & Optimization',
    description: 'Analyze performance, refine your models, and build advanced workflows for scaling up.',
    tags: ['Analytics', 'Scaling', 'Advanced Workflows'],
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    modules: [
      {
        id: 'm6.1-analytics',
        title: 'Module 6.1: Reading the Data',
        duration: '30 min',
        type: 'reading',
        content: `
### Metrics That Matter
*   **Reach/Impressions:** Top of funnel.
*   **Engagement Rate:** Middle of funnel (Quality).
*   **CTR (Click-Through Rate):** Bottom of funnel (Interest).
*   **Conversion Rate:** The Goal.

**AI Analysis:**
Feed your analytics export to ChatGPT: "Analyze this data and tell me which 3 topics performed best and why."
        `
      },
      {
        id: 'm6.2-refinement',
        title: 'Module 6.2: Refining Your Models',
        duration: '30 min',
        type: 'reading',
        content: `
### Feedback Loop
1.  **Publish**
2.  **Analyze**
3.  **Update Brand Voice:** "We found that humor works well. Let's adjust the tone slider to be 7/10 casual."
4.  **Update Prompts:** "The last blog post was too generic. Add a constraint to use more metaphors."

**Iterate:** Your AI system should get smarter every week.
        `
      },
      {
        id: 'ex-5-audit',
        title: 'Live Exercise 5: Content Audit',
        duration: '45 min',
        type: 'lab',
        content: `
### Audit Your Past 48 Hours
Review everything you created in Day 1 & 2.
*   What is "on brand"?
*   What feels "AI-generated"?
*   Fix the prompts that generated the weak content.
        `
      },
      {
        id: 'm7.1-advanced',
        title: 'Module 7.1: Advanced Workflows',
        duration: '45 min',
        type: 'reading',
        content: `
### Multi-Step Agents
Using tools like AutoGPT or BabyAGI (conceptually) or chaining prompts.

**Example Chain:**
1.  Research Agent: "Find top 5 trends in [Industry]."
2.  Writer Agent: "Write a post about Trend #1."
3.  Editor Agent: "Critique this post for tone."
4.  Formatter Agent: "Format for LinkedIn."
        `
      },
      {
        id: 'final-project',
        title: 'Final Project: The 30-Day Machine',
        duration: '120 min',
        type: 'lab',
        content: `
### Graduation Project
Build your sustainable content machine.
1.  **Finalized Brand Voice Doc**
2.  **Master Prompt Library** (Blog, Social, Email, Image)
3.  **30-Day Content Calendar** (Filled)
4.  **1 Week of Content Scheduled**

**Congratulations! You have stopped the grind.**
        `
      }
    ]
  }
];