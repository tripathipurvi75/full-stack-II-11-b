import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import React from 'react'
import CalendarPage from '../pages/CalendarPage'
import App from '../App'
import { setupStore } from '../redux/store'
import { addPost, deletePost, updatePost, reschedulePost, setPlatformFilter, setStatusFilter } from '../redux/postsSlice'
import { bumpCardRenderCount } from '../components/RenderMonitor'

function renderWithProviders(ui, preloadedState) {
  const store = setupStore(preloadedState)
  return { store, ...render(<Provider store={store}>{ui}</Provider>) }
}

describe('Calendar and Integration Tests', () => {
  it('renders Calendar page with filter bar and FullCalendar container', async () => {
    renderWithProviders(<CalendarPage isAddOpen={null} onCloseAdd={() => {}} onRequestEdit={() => {}} />)
    expect(screen.getByTestId('calendar-page')).toBeInTheDocument()
    expect(screen.getByTestId('filter-bar')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByTestId('calendar-view')).toBeInTheDocument()
    })
  })

  it('can create a new post via Redux dispatch and store updates', () => {
    const { store } = renderWithProviders(<CalendarPage isAddOpen={null} onCloseAdd={() => {}} onRequestEdit={() => {}} />)
    const initialCount = store.getState().posts.posts.length
    store.dispatch(addPost({
      title: 'Integration Test Post',
      platform: 'Instagram',
      date: '2026-09-15',
      time: '09:00',
      status: 'Scheduled',
      description: 'Test'
    }))
    const state = store.getState().posts
    expect(state.posts.length).toBe(initialCount + 1)
    expect(state.posts[state.posts.length - 1].title).toBe('Integration Test Post')
    expect(state.toast.message).toContain('created')
  })

  it('can update an existing post via Redux dispatch', () => {
    const { store } = renderWithProviders(<CalendarPage isAddOpen={null} onCloseAdd={() => {}} onRequestEdit={() => {}} />)
    const target = store.getState().posts.posts[0]
    store.dispatch(updatePost({ id: target.id, title: 'Updated Title' }))
    const updated = store.getState().posts.posts.find(p => p.id === target.id)
    expect(updated.title).toBe('Updated Title')
    expect(updated.platform).toBe(target.platform)
  })

  it('can delete a post via Redux dispatch', () => {
    const { store } = renderWithProviders(<CalendarPage isAddOpen={null} onCloseAdd={() => {}} onRequestEdit={() => {}} />)
    const target = store.getState().posts.posts[0]
    const initialCount = store.getState().posts.posts.length
    store.dispatch(deletePost(target.id))
    expect(store.getState().posts.posts.length).toBe(initialCount - 1)
    expect(store.getState().posts.posts.find(p => p.id === target.id)).toBeUndefined()
  })

  it('can reschedule a post (drag-drop simulation) using reschedulePost action', () => {
    const { store } = renderWithProviders(<CalendarPage isAddOpen={null} onCloseAdd={() => {}} onRequestEdit={() => {}} />)
    const target = store.getState().posts.posts[0]
    store.dispatch(reschedulePost({ id: target.id, date: '2026-12-25', time: '12:00' }))
    const updated = store.getState().posts.posts.find(p => p.id === target.id)
    expect(updated.date).toBe('2026-12-25')
    expect(updated.time).toBe('12:00')
    expect(store.getState().posts.toast.message).toContain('rescheduled')
  })

  it('filter actions update Redux filter state correctly', () => {
    const { store } = renderWithProviders(<CalendarPage isAddOpen={null} onCloseAdd={() => {}} onRequestEdit={() => {}} />)
    store.dispatch(setPlatformFilter('LinkedIn'))
    expect(store.getState().posts.filters.platform).toBe('LinkedIn')
    store.dispatch(setStatusFilter('Published'))
    expect(store.getState().posts.filters.status).toBe('Published')
  })

  it('Add Post button opens create modal when Header + App rendered', async () => {
    const user = userEvent.setup()
    renderWithProviders(<App />)
    const addButton = screen.getByRole('button', { name: /\+ Add Post/i })
    expect(addButton).toBeInTheDocument()
    await act(async () => {
      await user.click(addButton)
    })
    await waitFor(() => {
      expect(screen.getByTestId('post-modal')).toBeInTheDocument()
      expect(screen.getByTestId('modal-title').textContent).toMatch(/Create New Post/i)
    })
  })

  it('renders initial sample posts (15) and dashboard stats correctly', async () => {
    const { store } = renderWithProviders(<App />)
    const posts = store.getState().posts.posts
    expect(posts.length).toBeGreaterThanOrEqual(10)
    const byStatus = {
      Scheduled: posts.filter(p => p.status === 'Scheduled').length,
      Published: posts.filter(p => p.status === 'Published').length,
      Draft: posts.filter(p => p.status === 'Draft').length
    }
    expect(byStatus.Scheduled + byStatus.Published + byStatus.Draft).toBe(posts.length)
    expect(byStatus.Scheduled).toBeGreaterThan(0)
    expect(byStatus.Published).toBeGreaterThan(0)
    expect(byStatus.Draft).toBeGreaterThan(0)
  })

  it('renders RenderMonitor with reset button and resets counter when clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CalendarPage isAddOpen={null} onCloseAdd={() => {}} onRequestEdit={() => {}} />)

    const resetBtn = screen.getByTestId('btn-reset-counter')
    expect(resetBtn).toBeInTheDocument()
    expect(resetBtn).toHaveAttribute('title', 'Reset render count')

    const countDisplay = screen.getByTestId('count-cards-rerendered')
    expect(countDisplay.textContent).toBe('0')

    const monitor = screen.getByTestId('render-monitor')
    expect(monitor.textContent).toContain('Optimized ✓')

    // Click reset button
    await act(async () => {
      await user.click(resetBtn)
    })
    expect(screen.getByTestId('count-cards-rerendered').textContent).toBe('0')
  })

  it('toggles between Optimized and Non-Optimized rendering modes properly without resetting counter', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CalendarPage isAddOpen={null} onCloseAdd={() => {}} onRequestEdit={() => {}} />)

    const resetBtn = screen.getByTestId('btn-reset-counter')
    await act(async () => {
      await user.click(resetBtn)
    })
    expect(screen.getByTestId('count-cards-rerendered').textContent).toBe('0')

    // Set a non-zero count
    act(() => {
      bumpCardRenderCount(4)
    })
    expect(screen.getByTestId('count-cards-rerendered').textContent).toBe('4')

    const btnNonOpt = screen.getByTestId('btn-mode-nonoptimized')
    const btnOpt = screen.getByTestId('btn-mode-optimized')

    // Click Non-Optimized: mode changes, counter does NOT reset
    await act(async () => {
      await user.click(btnNonOpt)
    })

    const monitor = screen.getByTestId('render-monitor')
    expect(monitor.textContent).toContain('Non-Optimized')
    expect(screen.getByTestId('count-cards-rerendered').textContent).toBe('4')

    // Click Optimized: mode changes, counter does NOT reset
    await act(async () => {
      await user.click(btnOpt)
    })

    expect(monitor.textContent).toContain('Optimized ✓')
    expect(screen.getByTestId('count-cards-rerendered').textContent).toBe('4')
  })

  it('increments card re-render count by +2 per shift in Optimized and +30 in Non-Optimized mode', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CalendarPage isAddOpen={null} onCloseAdd={() => {}} onRequestEdit={() => {}} />)

    const resetBtn = screen.getByTestId('btn-reset-counter')
    await act(async () => {
      await user.click(resetBtn)
    })
    expect(screen.getByTestId('count-cards-rerendered').textContent).toBe('0')

    // In Optimized mode, post shifts bump +2 each
    act(() => {
      bumpCardRenderCount(2)
    })
    expect(screen.getByTestId('count-cards-rerendered').textContent).toBe('2')

    act(() => {
      bumpCardRenderCount(2)
    })
    expect(screen.getByTestId('count-cards-rerendered').textContent).toBe('4')

    // Reset button resets to 0
    await act(async () => {
      await user.click(resetBtn)
    })
    expect(screen.getByTestId('count-cards-rerendered').textContent).toBe('0')

    // Switch to Non-Optimized
    const btnNonOpt = screen.getByTestId('btn-mode-nonoptimized')
    await act(async () => {
      await user.click(btnNonOpt)
    })

    // In Non-Optimized mode, post shifts bump +30 each
    act(() => {
      bumpCardRenderCount(30)
    })
    expect(screen.getByTestId('count-cards-rerendered').textContent).toBe('30')

    act(() => {
      bumpCardRenderCount(30)
    })
    expect(screen.getByTestId('count-cards-rerendered').textContent).toBe('60')

    // Reset button resets to 0
    await act(async () => {
      await user.click(resetBtn)
    })
    expect(screen.getByTestId('count-cards-rerendered').textContent).toBe('0')
  })
})
