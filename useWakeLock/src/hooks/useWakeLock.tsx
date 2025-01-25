import { useState, useEffect, useRef } from 'react'

type UseWakeLock = (initial?:boolean) => {
  isWakeLock: boolean;
  setIsWakeLock: (checked: boolean) => void
}

/**
 * Custom hook to manage the Screen Wake Lock API.
 * 
 * This hook allows you to request and release a wake lock to prevent the screen from dimming or locking.
 * 
 * @param {boolean} initial - Initial state of the wake lock (default is false).
 * @returns {Object} An object containing:
 * - `isWakeLock` (boolean): Current state of the wake lock.
 * - `setIsWakeLock` (function): Function to toggle the wake lock state.
 * 
 * @example
 * const { isWakeLock, setIsWakeLock } = useWakeLock();
 * 
 * // To enable wake lock
 * setIsWakeLock(true);
 * 
 * // To disable wake lock
 * setIsWakeLock(false);
 * 
 * @remarks
 * This hook uses the Screen Wake Lock API which may not be supported in all browsers.
 * It also handles visibility changes to re-acquire the wake lock if it was released when the document became hidden.
 */
export const useWakeLock:UseWakeLock = (initial:boolean = false) => {
  if (!navigator.wakeLock) throw new Error('当前浏览器不支持Screen Wake Lock API！')
  let wakeLock = useRef<WakeLockSentinel | null>(null)
  const [isWakeLock, setIsWakeLock] = useState<boolean>(initial)
  const isWakeLockRef = useRef<boolean>(initial)

  const setWakeLock = () => {
    if (wakeLock.current) return
    navigator.wakeLock.request('screen').then(result => {
      wakeLock.current = result
      console.log('已激活')
      wakeLock.current.addEventListener('release', () => {
        wakeLock.current = null
        console.log('已释放')
      })
    }).catch((err) => {
      console.error(`失败：${err.message}`)
    })
  }

  const toggleWakeLock = (checked: boolean):void => {
    if (isWakeLock !== checked) {
      setIsWakeLock(checked)
      isWakeLockRef.current = checked
    }
    if (checked) {
      setWakeLock()
    } else {
      wakeLock.current && wakeLock.current.release().then(() => {
        wakeLock.current = null
      })
    }
  }

  useEffect(() => {
    toggleWakeLock(initial)
  }, [])

  useEffect(() => {
    const onVisibilitychange = () => {
      if (wakeLock.current === null && document.visibilityState === 'visible' && isWakeLockRef.current) {
        setWakeLock()
      }
    }
    document.addEventListener('visibilitychange', onVisibilitychange)
    return () => {
      document.removeEventListener('visibilitychange', onVisibilitychange)
    }
  }, [])

  return { isWakeLock, setIsWakeLock: toggleWakeLock }
}

export default useWakeLock
