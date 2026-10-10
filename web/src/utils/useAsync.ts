import { useEffect, useState } from 'react'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

/**
 * Small hook to run an async service call and track loading/error/data state.
 *
 * If the underlying (live) request rejects, the error is captured and exposed
 * as `error` — it is never silently replaced with mock data. The component is
 * responsible for rendering the error to the user.
 */
export function useAsync<T>(
  factory: (signal: AbortSignal) => Promise<T>,
  deps: unknown[] = [],
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    setState({ data: null, loading: true, error: null })

    factory(controller.signal)
      .then((data) => {
        if (active) setState({ data, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (!active) return
        const message =
          err instanceof Error ? err.message : 'Something went wrong loading data.'
        setState({ data: null, loading: false, error: message })
      })

    return () => {
      active = false
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
