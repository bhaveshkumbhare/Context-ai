import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ContextForm from '../components/ContextForm'

describe('ContextForm', () => {
  it('renders the textarea and submit button', () => {
    render(<ContextForm />)
    expect(screen.getByLabelText('Context input')).toBeInTheDocument()
    expect(screen.getByText('Generate Prompts →')).toBeInTheDocument()
  })

  it('submit button is disabled when textarea is empty', () => {
    render(<ContextForm />)
    expect(screen.getByText('Generate Prompts →')).toBeDisabled()
  })

  it('submit button is enabled when context is entered', () => {
    render(<ContextForm />)
    const textarea = screen.getByLabelText('Context input')
    fireEvent.change(textarea, { target: { value: 'Write a Python sorting function' } })
    expect(screen.getByText('Generate Prompts →')).not.toBeDisabled()
  })

  it('shows results section after form submission', () => {
    render(<ContextForm />)
    const textarea = screen.getByLabelText('Context input')
    fireEvent.change(textarea, { target: { value: 'Debug this JavaScript code for me' } })
    fireEvent.click(screen.getByText('Generate Prompts →'))
    expect(screen.getByTestId('results-section')).toBeInTheDocument()
  })

  it('shows detected category banner after submission', () => {
    render(<ContextForm />)
    const textarea = screen.getByLabelText('Context input')
    fireEvent.change(textarea, { target: { value: 'Write a Python function to parse JSON' } })
    fireEvent.click(screen.getByText('Generate Prompts →'))
    expect(screen.getByText(/Detected task category/)).toBeInTheDocument()
  })

  it('renders prompt cards for recommended AIs', () => {
    render(<ContextForm />)
    const textarea = screen.getByLabelText('Context input')
    fireEvent.change(textarea, { target: { value: 'Implement a REST API using Node.js and Express' } })
    fireEvent.click(screen.getByText('Generate Prompts →'))
    // At least one recommended prompt card should render
    expect(screen.getByTestId('prompt-card-copilot')).toBeInTheDocument()
  })

  it('resets state when Reset button is clicked', async () => {
    render(<ContextForm />)
    const textarea = screen.getByLabelText('Context input')
    fireEvent.change(textarea, { target: { value: 'Write a blog post' } })
    fireEvent.click(screen.getByText('Generate Prompts →'))
    expect(screen.getByTestId('results-section')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Reset'))
    await waitFor(() => {
      expect(screen.queryByTestId('results-section')).not.toBeInTheDocument()
    })
  })

  it('populates textarea and shows results when an example is clicked', () => {
    render(<ContextForm />)
    // Example buttons appear before results
    const exampleButtons = screen.getAllByRole('button').filter(
      (btn) => btn.className.includes('indigo-50')
    )
    expect(exampleButtons.length).toBeGreaterThan(0)
    fireEvent.click(exampleButtons[0])
    expect(screen.getByTestId('results-section')).toBeInTheDocument()
  })
})
