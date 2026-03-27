import { describe, it, expect } from 'vitest'
import {
  detectCategory,
  buildPromptForAI,
  generateRoutingResults,
  AI_MODELS,
  TASK_CATEGORIES,
} from '../utils/aiRouter'

describe('detectCategory', () => {
  it('returns "general" for empty input', () => {
    expect(detectCategory('')).toBe('general')
    expect(detectCategory('   ')).toBe('general')
    expect(detectCategory(null)).toBe('general')
  })

  it('detects coding tasks', () => {
    expect(detectCategory('Write a Python function to sort a list')).toBe('coding')
    expect(detectCategory('Debug this JavaScript error in my React component')).toBe('coding')
    expect(detectCategory('Implement a REST API with Node.js')).toBe('coding')
  })

  it('detects writing tasks', () => {
    expect(detectCategory('Write a professional email declining a job offer')).toBe('writing')
    expect(detectCategory('Help me draft a blog post about AI trends')).toBe('writing')
  })

  it('detects research tasks', () => {
    expect(detectCategory('Research the latest trends in renewable energy')).toBe('research')
    expect(detectCategory('Analyze and compare different database solutions')).toBe('research')
  })

  it('detects math tasks', () => {
    expect(detectCategory('Calculate the derivative of x^3 + 2x')).toBe('math')
    expect(detectCategory('Solve this algebra equation: 2x + 5 = 15')).toBe('math')
  })

  it('detects conversation/general tasks', () => {
    const result = detectCategory('I want to brainstorm some ideas for my project')
    // Could be conversation or general, both valid
    expect(['conversation', 'general']).toContain(result)
  })
})

describe('buildPromptForAI', () => {
  const context = 'Sort a list in Python'

  it('builds a ChatGPT prompt', () => {
    const prompt = buildPromptForAI(context, 'chatgpt', 'coding')
    expect(prompt).toContain(context)
    expect(prompt).toContain('helpful assistant')
  })

  it('builds a Claude prompt', () => {
    const prompt = buildPromptForAI(context, 'claude', 'coding')
    expect(prompt).toContain(context)
    expect(prompt).toContain('assistance')
  })

  it('builds a Gemini prompt', () => {
    const prompt = buildPromptForAI(context, 'gemini', 'coding')
    expect(prompt).toContain(context)
    expect(prompt).toContain('Task:')
  })

  it('builds a GitHub Copilot prompt with code comment style for coding', () => {
    const prompt = buildPromptForAI(context, 'copilot', 'coding')
    expect(prompt).toContain(context)
    expect(prompt).toMatch(/\/\//)
  })

  it('builds a Perplexity prompt', () => {
    const prompt = buildPromptForAI(context, 'perplexity', 'research')
    expect(prompt).toContain(context)
    expect(prompt).toContain('Research query')
  })

  it('returns the original context for unknown AI id', () => {
    const prompt = buildPromptForAI(context, 'unknown-ai', 'general')
    expect(prompt).toBe(context)
  })
})

describe('generateRoutingResults', () => {
  it('returns an empty array for empty input', () => {
    expect(generateRoutingResults('')).toEqual([])
    expect(generateRoutingResults(null)).toEqual([])
  })

  it('returns one result per AI model', () => {
    const results = generateRoutingResults('Write a blog post about space exploration')
    expect(results).toHaveLength(Object.keys(AI_MODELS).length)
  })

  it('each result contains required fields', () => {
    const results = generateRoutingResults('Implement a binary search algorithm in JavaScript')
    for (const result of results) {
      expect(result).toHaveProperty('ai')
      expect(result).toHaveProperty('prompt')
      expect(result).toHaveProperty('isRecommended')
      expect(result).toHaveProperty('category')
      expect(result).toHaveProperty('categoryLabel')
    }
  })

  it('marks correct AIs as recommended for a coding task', () => {
    const results = generateRoutingResults('Debug this Python function and fix the bug')
    const recommended = results.filter((r) => r.isRecommended).map((r) => r.ai.id)
    // Coding best AIs are copilot, chatgpt, gemini
    expect(recommended).toContain('copilot')
    expect(recommended).toContain('chatgpt')
    expect(recommended).toContain('gemini')
  })

  it('marks correct AIs as recommended for a research task', () => {
    const results = generateRoutingResults('Research and analyze renewable energy statistics and sources')
    const recommended = results.filter((r) => r.isRecommended).map((r) => r.ai.id)
    expect(recommended).toContain('perplexity')
    expect(recommended).toContain('claude')
  })

  it('detects category correctly for a math task', () => {
    const results = generateRoutingResults('Calculate and solve this calculus integration problem')
    expect(results[0].category).toBe('math')
    expect(results[0].categoryLabel).toBe(TASK_CATEGORIES.math.label)
  })
})
