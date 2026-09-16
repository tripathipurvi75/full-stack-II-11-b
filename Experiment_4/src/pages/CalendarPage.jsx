import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import CalendarView, { postToEvent } from '../components/CalendarView'
import FilterBar from '../components/FilterBar'
import PostModal from '../components/PostModal'
import {
  RenderMonitorProvider,
  RenderMonitor,
  useRenderCount,
  useSetRenderMode,
  resetCardCounter
} from '../components/RenderMonitor'
import {
  selectPost,
  clearSelectedPost,
  deletePost,
  reschedulePost,
  setPlatformFilter,
  setStatusFilter
} from '../redux/postsSlice'

function selectFilters(state) {
  return {
    platform: state.posts.filters.platform,
    status: state.posts.filters.status
  }
}

function selectPostsCalendarData(state) {
  return state.posts.posts.map((p) => ({
    id: p.id,
    date: p.date,
    time: p.time,
    platform: p.platform,
    status: p.status,
    title: p.title,
    description: p.description
  }))
}

function postsShallowEqualArray(a, b) {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (!shallowEqual(a[i], b[i])) return false
  }
  return true
}

function CalendarPageInner({ renderOptimized, onToggleOptimized, onToggleNonOptimized, onRequestEdit }) {
  const dispatch = useDispatch()
  useRenderCount('calendarPage')
  const setRenderMode = useSetRenderMode()

  const forcedTickRef = useRef(0)
  const [, setTickState] = useState(0)

  useEffect(() => {
    setRenderMode(renderOptimized ? 'Optimized' : 'Non-Optimized')
  }, [renderOptimized, setRenderMode])

  const selectedPost = useSelector((state) => state.posts.selectedPost, shallowEqual)

  const filters = useSelector(selectFilters, shallowEqual)
  const platformFilter = filters.platform
  const statusFilter = filters.status

  const postsForCalendar = useSelector(
    selectPostsCalendarData,
    (a, b) => (renderOptimized ? postsShallowEqualArray(a, b) : a === b)
  )

  const posts = useSelector((state) => state.posts.posts, (a, b) => {
    if (!renderOptimized) return a === b
    return postsShallowEqualArray(
      a.map((p) => ({ id: p.id, date: p.date, time: p.time, platform: p.platform, status: p.status, title: p.title, description: p.description })),
      b.map((p) => ({ id: p.id, date: p.date, time: p.time, platform: p.platform, status: p.status, title: p.title, description: p.description }))
    )
  })

  const filteredPosts = useMemo(() => {
    return postsForCalendar.filter((post) => {
      const platformMatch = platformFilter === 'All' || post.platform === platformFilter
      const statusMatch = statusFilter === 'All' || post.status === statusFilter
      return platformMatch && statusMatch
    })
  }, [postsForCalendar, platformFilter, statusFilter])

  const calendarEvents = useMemo(() => {
    return filteredPosts.map((post) => postToEvent({
      id: post.id,
      title: post.title,
      description: post.description,
      date: post.date,
      time: post.time,
      platform: post.platform,
      status: post.status
    }))
  }, [filteredPosts])

  const forceTickNonOptimized = useCallback(() => {
    forcedTickRef.current += 1
    setTickState(forcedTickRef.current)
  }, [])

  const handleEventClick = useCallback((postId) => {
    const allPosts = posts.length > 0 ? posts : postsForCalendar
    const post = allPosts.find((p) => p.id === postId)
    if (post) {
      dispatch(selectPost(post))
    }
  }, [posts, postsForCalendar, dispatch])

  const handleEventDrop = useCallback((postId, newDate, newTime) => {
    resetCardCounter()
    dispatch(reschedulePost({ id: postId, date: newDate, time: newTime }))
    if (!renderOptimized) {
      forceTickNonOptimized()
    }
  }, [dispatch, renderOptimized, forceTickNonOptimized])

  const handlePlatformChange = useCallback((value) => {
    resetCardCounter()
    dispatch(setPlatformFilter(value))
  }, [dispatch])

  const handleStatusChange = useCallback((value) => {
    resetCardCounter()
    dispatch(setStatusFilter(value))
  }, [dispatch])

  const handleDelete = useCallback((id) => {
    resetCardCounter()
    dispatch(deletePost(id))
    if (!renderOptimized) {
      forceTickNonOptimized()
    }
  }, [dispatch, renderOptimized, forceTickNonOptimized])

  const handleCloseSelected = useCallback(() => {
    dispatch(clearSelectedPost())
  }, [dispatch])

  const handleSwitchToEdit = useCallback(() => {
    if (selectedPost) {
      onRequestEdit(selectedPost)
      dispatch(clearSelectedPost())
    }
  }, [selectedPost, onRequestEdit, dispatch])

  const calendarViewKey = renderOptimized
    ? 'optimized-view'
    : `non-optimized-view-${forcedTickRef.current}`

  const filterBarKey = renderOptimized
    ? 'optimized-filterbar'
    : `non-optimized-filterbar-${forcedTickRef.current}`

  return (
    <div className="calendar-page" data-testid="calendar-page">
      <div className="page-header">
        <div className="page-header-top">
          <div>
            <h2 className="page-title">Content Calendar</h2>
            <p className="page-subtitle">Manage and reschedule your posts with drag &amp; drop.</p>
          </div>
          <div className="render-mode-toggle" data-testid="render-mode-toggle">
            <span className="render-mode-label">Rendering Mode:</span>
            <div className="render-mode-group" role="group" aria-label="Rendering mode">
              <button
                type="button"
                className={`render-mode-btn ${renderOptimized ? 'render-mode-btn-active' : ''}`}
                onClick={onToggleOptimized}
                data-testid="btn-mode-optimized"
              >
                Optimized
              </button>
              <button
                type="button"
                className={`render-mode-btn ${!renderOptimized ? 'render-mode-btn-active render-mode-btn-secondary' : ''}`}
                onClick={onToggleNonOptimized}
                data-testid="btn-mode-nonoptimized"
              >
                Non-Optimized
              </button>
            </div>
          </div>
        </div>
      </div>

      <RenderMonitor />

      <FilterBar
        key={filterBarKey}
        platformFilter={platformFilter}
        statusFilter={statusFilter}
        onPlatformChange={handlePlatformChange}
        onStatusChange={handleStatusChange}
      />

      <div className="card calendar-card">
        <CalendarView
          key={calendarViewKey}
          events={calendarEvents}
          onEventClick={handleEventClick}
          onEventDrop={handleEventDrop}
        />
      </div>

      <PostModal
        isOpen={!!selectedPost}
        mode="details"
        initialData={selectedPost}
        onClose={handleCloseSelected}
        onSave={(modeArg) => {
          if (modeArg === 'edit') {
            handleSwitchToEdit()
          }
        }}
        onDelete={handleDelete}
      />
    </div>
  )
}

function CalendarPage({ onCloseAdd, onRequestEdit }) {
  const [renderOptimized, setRenderOptimized] = useState(true)
  const forcedTickRefSwitch = useRef(0)
  const [, setTickSwitch] = useState(0)

  const handleToggleOptimized = useCallback(() => {
    setRenderOptimized(true)
  }, [])

  const handleToggleNonOptimized = useCallback(() => {
    setRenderOptimized(false)
    forcedTickRefSwitch.current += 1
    setTickSwitch(forcedTickRefSwitch.current)
  }, [])

  return (
    <RenderMonitorProvider initialMode={renderOptimized ? 'Optimized' : 'Non-Optimized'}>
      <CalendarPageInner
        renderOptimized={renderOptimized}
        onToggleOptimized={handleToggleOptimized}
        onToggleNonOptimized={handleToggleNonOptimized}
        onRequestEdit={onRequestEdit}
      />
    </RenderMonitorProvider>
  )
}

export default CalendarPage
