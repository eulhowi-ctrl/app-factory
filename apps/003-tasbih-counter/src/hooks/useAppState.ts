import { useCallback, useEffect, useRef, useState } from 'react'
import type { AppState } from '../core/state'
import { loadState, saveState } from '../core/storage'

/** 상태 + 변경 즉시 localStorage 저장(탭마다). */
export function useAppState() {
  const [state, setState] = useState<AppState>(loadState)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    saveState(state)
  }, [state])

  const update = useCallback((fn: (s: AppState) => AppState) => setState(fn), [])
  return [state, update] as const
}
