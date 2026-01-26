import { render, screen } from '@testing-library/react'
import AiChatDrawer from '@/components/Ai/AiChatDrawer'

describe('AiChatDrawer', () => {
  it('does not render free quota label', () => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn()
    render(<AiChatDrawer />)
    expect(screen.queryByText(/免费剩余/)).toBeNull()
  })
})
