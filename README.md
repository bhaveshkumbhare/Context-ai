# Context AI

A web application that helps you get consistent results when switching between AI assistants.

## What it does

Enter your task or context prompt, and Context AI will:

1. **Detect** the task category (coding, writing, research, math, conversation, etc.)
2. **Recommend** the best AI assistant(s) for your task
3. **Generate** optimized, AI-specific prompts you can copy and paste into any major AI

### Supported AI assistants

| AI | Best for |
|----|----------|
| ChatGPT (OpenAI) | General, coding, writing, analysis |
| Claude (Anthropic) | Writing, analysis, long-context tasks |
| Gemini (Google) | General, multimodal, research, math |
| GitHub Copilot | Coding, debugging, code review |
| Perplexity | Research, search, factual queries |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run unit tests |
| `npm run lint` | Run ESLint |

## Tech stack

- **React 19** + **Vite** — Fast, modern frontend tooling
- **Tailwind CSS v4** — Utility-first styling
- **Vitest** + **Testing Library** — Unit and component tests
