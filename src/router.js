import { useEffect, useState } from 'react'

function current() {
  const h = window.location.hash.replace(/^#/, '')
  return h || '/'
}

export function useRoute() {
  const [path, setPath] = useState(current)
  useEffect(() => {
    const onChange = () => {
      setPath(current())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return path
}

export function go(path) {
  window.location.hash = path
}

export function back(fallback = '/') {
  if (window.history.length > 1) window.history.back()
  else go(fallback)
}
