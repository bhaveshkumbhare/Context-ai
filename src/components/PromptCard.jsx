import { useState } from 'react'

/**
 * PromptCard – displays a tailored prompt for a single AI model.
 * Shows whether the AI is recommended for the detected task category,
 * and allows the user to copy the optimized prompt to clipboard.
 */
export default function PromptCard({ result }) {
  const [copied, setCopied] = useState(false)

  const { ai, prompt, isRecommended } = result

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for environments without clipboard API
      const textarea = document.createElement('textarea')
      textarea.value = prompt
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div
      className={`rounded-xl border-2 p-4 flex flex-col gap-3 transition-shadow hover:shadow-md ${ai.color}`}
      data-testid={`prompt-card-${ai.id}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">{ai.icon}</span>
          <div>
            <p className="font-semibold text-gray-800">{ai.name}</p>
            <p className="text-xs text-gray-500">{ai.vendor}</p>
          </div>
        </div>
        {isRecommended && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${ai.badgeColor}`}
            aria-label="Recommended for this task"
          >
            ✓ Recommended
          </span>
        )}
      </div>

      {/* Prompt preview */}
      <pre
        className="bg-white bg-opacity-70 rounded-lg p-3 text-sm text-gray-700 whitespace-pre-wrap break-words max-h-40 overflow-y-auto font-mono"
        aria-label={`Prompt for ${ai.name}`}
      >
        {prompt}
      </pre>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className={`w-full py-1.5 rounded-lg text-sm font-medium transition-colors ${
          copied
            ? 'bg-green-500 text-white'
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
        aria-label={`Copy prompt for ${ai.name}`}
      >
        {copied ? '✓ Copied!' : 'Copy Prompt'}
      </button>
    </div>
  )
}
