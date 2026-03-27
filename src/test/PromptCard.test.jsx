import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PromptCard from '../components/PromptCard'
import { AI_MODELS } from '../utils/aiRouter'

const sampleResult = {
  ai: AI_MODELS.chatgpt,
  prompt: 'You are a helpful assistant. Please help me with the following:\n\nSort a list\n\nProvide a clear, structured response.',
  isRecommended: true,
  category: 'coding',
  categoryLabel: 'Coding / Development',
}

describe('PromptCard', () => {
  it('renders AI name and vendor', () => {
    render(<PromptCard result={sampleResult} />)
    expect(screen.getByText('ChatGPT')).toBeInTheDocument()
    expect(screen.getByText('OpenAI')).toBeInTheDocument()
  })

  it('shows Recommended badge when isRecommended is true', () => {
    render(<PromptCard result={sampleResult} />)
    expect(screen.getByLabelText('Recommended for this task')).toBeInTheDocument()
  })

  it('does not show Recommended badge when isRecommended is false', () => {
    render(<PromptCard result={{ ...sampleResult, isRecommended: false }} />)
    expect(screen.queryByLabelText('Recommended for this task')).not.toBeInTheDocument()
  })

  it('renders the prompt text', () => {
    render(<PromptCard result={sampleResult} />)
    expect(screen.getByLabelText(`Prompt for ${sampleResult.ai.name}`)).toBeInTheDocument()
    expect(screen.getByLabelText(`Prompt for ${sampleResult.ai.name}`)).toHaveTextContent('helpful assistant')
  })

  it('renders Copy Prompt button', () => {
    render(<PromptCard result={sampleResult} />)
    expect(screen.getByLabelText(`Copy prompt for ${sampleResult.ai.name}`)).toBeInTheDocument()
  })

  it('shows "Copied!" feedback when copy button is clicked', async () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    })

    render(<PromptCard result={sampleResult} />)
    const copyBtn = screen.getByLabelText(`Copy prompt for ${sampleResult.ai.name}`)
    fireEvent.click(copyBtn)
    expect(await screen.findByText('✓ Copied!')).toBeInTheDocument()
  })
})
