import { useState } from 'react'
import { generateRoutingResults } from '../utils/aiRouter'
import PromptCard from './PromptCard'

const EXAMPLES = [
  'Write a Python function that sorts a list of dictionaries by a given key.',
  'Help me write a professional email declining a job offer politely.',
  'Explain the difference between supervised and unsupervised machine learning.',
  'Solve: What is the derivative of x^3 + 2x^2 - 5x + 7?',
  'Brainstorm creative names for a new productivity app.',
]

/**
 * ContextForm – the main UI for entering a context prompt and viewing
 * AI-specific optimized prompts along with routing recommendations.
 */
export default function ContextForm() {
  const [context, setContext] = useState('')
  const [results, setResults] = useState(null)
  const [showAll, setShowAll] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!context.trim()) return
    const routing = generateRoutingResults(context)
    setResults(routing)
    setShowAll(false)
  }

  function handleExample(text) {
    setContext(text)
    const routing = generateRoutingResults(text)
    setResults(routing)
    setShowAll(false)
  }

  function handleReset() {
    setContext('')
    setResults(null)
    setShowAll(false)
  }

  const recommended = results?.filter((r) => r.isRecommended) ?? []
  const others = results?.filter((r) => !r.isRecommended) ?? []
  const detectedCategory = results?.[0]?.categoryLabel

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Input form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col gap-4"
        aria-label="Context input form"
      >
        <label
          htmlFor="context-input"
          className="text-base font-semibold text-gray-800"
        >
          Describe your task or paste your conversation context
        </label>

        <textarea
          id="context-input"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="e.g. Write a Python function that reads a CSV file and returns the top 10 rows sorted by date…"
          rows={5}
          className="w-full rounded-xl border border-gray-300 p-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-y"
          aria-label="Context input"
        />

        <div className="flex flex-wrap gap-2 items-center">
          <button
            type="submit"
            disabled={!context.trim()}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-sm font-medium transition-colors"
          >
            Generate Prompts →
          </button>

          {results && (
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </form>

      {/* Example prompts */}
      {!results && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            Try an example
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => handleExample(ex)}
                className="text-xs px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full border border-indigo-200 transition-colors text-left"
              >
                {ex.length > 55 ? ex.slice(0, 55) + '…' : ex}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="flex flex-col gap-4" data-testid="results-section">
          {/* Detected category banner */}
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-xl">
            <span className="text-indigo-500 text-sm">🔍</span>
            <p className="text-sm text-indigo-800">
              Detected task category:{' '}
              <strong>{detectedCategory}</strong> — showing best-matched AI prompts first.
            </p>
          </div>

          {/* Recommended AI prompts */}
          {recommended.length > 0 && (
            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Recommended for this task
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {recommended.map((result) => (
                  <PromptCard key={result.ai.id} result={result} />
                ))}
              </div>
            </div>
          )}

          {/* Show more / other AIs */}
          {others.length > 0 && (
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowAll((v) => !v)}
                className="text-sm text-indigo-600 hover:underline self-start"
                aria-expanded={showAll}
              >
                {showAll
                  ? '▲ Hide other AI prompts'
                  : `▼ Show all AI prompts (${others.length} more)`}
              </button>

              {showAll && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {others.map((result) => (
                    <PromptCard key={result.ai.id} result={result} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
