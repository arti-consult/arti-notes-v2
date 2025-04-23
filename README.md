<h1 align="center">🧠 Arti Notes</h1>

<p align="center">
  A revolutionary assistant for conversations — captures key points and summarizes discussions.<br/>
  <strong>Speak freely. Arti remembers.</strong>
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  <img alt="Status" src="https://img.shields.io/badge/status-in%20progress-orange" />
</p>

<p align="center">
  🔗 <a href="https://www.notion.so/articonsult/Arti-Notes-x-ByBreyholtz-Utvikling-1b2094de4dcb80e2aebae2efbc3894bc?pvs=4" target="_blank">
    <img alt="Notion" src="https://img.shields.io/badge/View%20on-Notion-000000?logo=notion&logoColor=white" />
  </a>
</p>

---

## ✨ Overview

**Arti Notes** is your smart companion during conversations.

It helps you:

- 🧠 Identify and highlight key topics
- 📝 Summarize meaningful insights
- 📚 Keep track of discussions without distractions

Whether you're in a meeting, a brainstorming session, or just talking with someone — **Arti has your back**.

---

## Project structure

```

.
├── src
│ ├── app               # Next.js app directory
│ ├── components        # Reusable UI components
│ ├── config            # App configuration
│ ├── contexts          # React contexts
│ ├── hooks             # Custom React hooks
│ ├── lib               # Library functions and utilities
│ ├── services          # API and business logic
│ ├── types             # TypeScript type definitions
│ └── utils             # General utility functions
├── middleware.ts       # Next.js middleware for handling requests
├── .env.example        # Example environment configuration
├── .env.local          # Local environment variables (not committed)
├── .gitignore          # Git ignore rules
├── components.json     # ShadCN UI component configuration
├── eslint.config.js    # ESLint configuration
├── next-env.d.ts       # Next.js TypeScript environment definitions
├── next.config.js      # Next.js configuration
├── package-lock.json   # Dependency lock file
├── package.json        # Project metadata and dependencies
├── postcss.config.js   # PostCSS configuration
├── README.md           # Project documentation
├── tailwind.config.js  # Tailwind CSS configuration

```

---

## ⚙️ Tech Stack

- [Next.js](https://nextjs.org/) — React framework
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS
- [ShadCN UI](https://ui.shadcn.dev/) — Accessible and beautiful UI components
- [Supabase](https://supabase.com/) — Auth and database as a service
- [Supabase Storage](https://supabase.com/storage) — Scalable file storage
- [Gladia](https://gladia.io/) — AI-powered audio transcription (Speech-to-Text)
- [OpenAI](https://openai.com/) — Natural language understanding and generation
- [Recall](https://recall.ai/) — API for virtual meeting bots and real-time transcription
- [Stripe](https://stripe.com/) — Payments and billing integration
- _(Upcoming)_ AI + Speech-to-Text (Whisper or similar)

---

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/arti-consult/arti-notes-v2.git
   ```

2. Install the required dependencies:

   ```
   npm install
   ```

3. Run the development:

   ```
   npm run dev
   ```

## Environment Variables

[.env.sample](https://github.com/arti-consult/arti-notes-v2/blob/main/.env.example)
