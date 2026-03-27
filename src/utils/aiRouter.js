/**
 * AI routing and prompt optimization utilities for Context-AI.
 *
 * Provides task categorization, AI recommendations, and prompt adaptation
 * so users can get consistent results when switching between AI assistants.
 */

export const AI_MODELS = {
  chatgpt: {
    id: 'chatgpt',
    name: 'ChatGPT',
    vendor: 'OpenAI',
    icon: '🟢',
    strengths: ['general', 'coding', 'writing', 'analysis', 'conversation'],
    color: 'bg-emerald-50 border-emerald-300',
    badgeColor: 'bg-emerald-100 text-emerald-800',
  },
  claude: {
    id: 'claude',
    name: 'Claude',
    vendor: 'Anthropic',
    icon: '🟠',
    strengths: ['writing', 'analysis', 'research', 'long-context', 'safety'],
    color: 'bg-orange-50 border-orange-300',
    badgeColor: 'bg-orange-100 text-orange-800',
  },
  gemini: {
    id: 'gemini',
    name: 'Gemini',
    vendor: 'Google',
    icon: '🔵',
    strengths: ['general', 'multimodal', 'research', 'coding', 'math'],
    color: 'bg-blue-50 border-blue-300',
    badgeColor: 'bg-blue-100 text-blue-800',
  },
  copilot: {
    id: 'copilot',
    name: 'GitHub Copilot',
    vendor: 'GitHub / OpenAI',
    icon: '⚫',
    strengths: ['coding', 'debugging', 'code-review', 'documentation'],
    color: 'bg-gray-50 border-gray-400',
    badgeColor: 'bg-gray-200 text-gray-800',
  },
  perplexity: {
    id: 'perplexity',
    name: 'Perplexity',
    vendor: 'Perplexity AI',
    icon: '🟣',
    strengths: ['research', 'search', 'factual', 'citations'],
    color: 'bg-purple-50 border-purple-300',
    badgeColor: 'bg-purple-100 text-purple-800',
  },
}

/** Task category definitions with keyword signals */
export const TASK_CATEGORIES = {
  coding: {
    label: 'Coding / Development',
    keywords: [
      'code', 'function', 'bug', 'debug', 'implement', 'class', 'api',
      'javascript', 'python', 'typescript', 'react', 'sql', 'algorithm',
      'test', 'refactor', 'error', 'exception', 'syntax', 'deploy',
      'git', 'repository', 'database', 'backend', 'frontend', 'component',
    ],
    bestAIs: ['copilot', 'chatgpt', 'gemini'],
  },
  writing: {
    label: 'Writing / Content',
    keywords: [
      'write', 'essay', 'blog', 'article', 'email', 'story', 'draft',
      'tone', 'paragraph', 'summarize', 'rewrite', 'proofread', 'edit',
      'creative', 'copy', 'marketing', 'letter', 'report', 'document',
    ],
    bestAIs: ['claude', 'chatgpt', 'gemini'],
  },
  research: {
    label: 'Research / Analysis',
    keywords: [
      'research', 'analyze', 'compare', 'explain', 'study', 'find',
      'statistics', 'data', 'trend', 'market', 'source', 'cite',
      'fact', 'information', 'overview', 'summary', 'review',
    ],
    bestAIs: ['perplexity', 'claude', 'gemini'],
  },
  math: {
    label: 'Math / Logic',
    keywords: [
      'calculate', 'math', 'equation', 'formula', 'solve', 'proof',
      'algebra', 'calculus', 'statistics', 'probability', 'logic',
      'number', 'compute', 'derive', 'integrate',
    ],
    bestAIs: ['gemini', 'chatgpt', 'claude'],
  },
  conversation: {
    label: 'Conversation / Q&A',
    keywords: [
      'chat', 'talk', 'discuss', 'ask', 'question', 'help', 'advice',
      'recommend', 'suggest', 'opinion', 'idea', 'brainstorm', 'think',
    ],
    bestAIs: ['chatgpt', 'claude', 'gemini'],
  },
  general: {
    label: 'General',
    keywords: [],
    bestAIs: ['chatgpt', 'claude', 'gemini'],
  },
}

/**
 * Detect the task category from the user's context text.
 * Returns the category key with the most keyword matches (falls back to 'general').
 */
export function detectCategory(contextText) {
  if (!contextText || contextText.trim().length === 0) return 'general'

  const lower = contextText.toLowerCase()
  let best = 'general'
  let bestScore = 0

  for (const [key, cat] of Object.entries(TASK_CATEGORIES)) {
    if (key === 'general') continue
    const score = cat.keywords.filter((kw) => lower.includes(kw)).length
    if (score > bestScore) {
      bestScore = score
      best = key
    }
  }

  return best
}

/**
 * Build an optimized context prompt for a specific AI model.
 *
 * The generated prompt can be pasted into the target AI to maintain
 * the same intent even when switching assistants.
 */
export function buildPromptForAI(contextText, aiId, category) {
  const ai = AI_MODELS[aiId]
  if (!ai) return contextText

  const trimmed = contextText.trim()

  switch (aiId) {
    case 'chatgpt':
      return `You are a helpful assistant. Please help me with the following:\n\n${trimmed}\n\nProvide a clear, structured response.`

    case 'claude':
      return `I need your assistance with the following task. Please be thorough and consider multiple perspectives:\n\n${trimmed}\n\nFeel free to ask clarifying questions if needed.`

    case 'gemini':
      return `Task: ${trimmed}\n\nPlease analyze this carefully and provide a comprehensive response, including relevant examples where applicable.`

    case 'copilot':
      if (category === 'coding') {
        return `// Context: ${trimmed}\n// Please provide a well-commented, production-ready solution.`
      }
      return `Help me with the following in a coding context:\n\n${trimmed}`

    case 'perplexity':
      return `Research query: ${trimmed}\n\nPlease provide accurate, up-to-date information with sources where possible.`

    default:
      return trimmed
  }
}

/**
 * Generate routing results for all AI models.
 * Returns an ordered array of { ai, prompt, isRecommended } objects.
 */
export function generateRoutingResults(contextText) {
  if (!contextText || contextText.trim().length === 0) return []

  const category = detectCategory(contextText)
  const cat = TASK_CATEGORIES[category]
  const recommendedIds = new Set(cat.bestAIs)

  return Object.keys(AI_MODELS).map((aiId) => ({
    ai: AI_MODELS[aiId],
    prompt: buildPromptForAI(contextText, aiId, category),
    isRecommended: recommendedIds.has(aiId),
    category,
    categoryLabel: cat.label,
  }))
}
