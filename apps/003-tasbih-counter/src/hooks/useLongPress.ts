import { useCallback, useRef, useState } from 'react'

/** 길게 누르기(기본 700ms). 진행 중 여부를 돌려줘 버튼에 채움 애니메이션을 준다. */
export function useLongPress(onLongPress: () => void, ms = 700) {
  const timer = useRef<number | null>(null)
  const [pressing, setPressing] = useState(false)

  const cancel = useCallback(() => {
    if (timer.current !== null) window.clearTimeout(timer.current)
    timer.current = null
    setPressing(false)
  }, [])

  const start = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      cancel()
      setPressing(true)
      timer.current = window.setTimeout(() => {
        timer.current = null
        setPressing(false)
        onLongPress()
      }, ms)
    },
    [cancel, ms, onLongPress],
  )

  return {
    pressing,
    handlers: {
      onPointerDown: start,
      onPointerUp: cancel,
      onPointerLeave: cancel,
      onPointerCancel: cancel,
      onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
    },
  }
}
