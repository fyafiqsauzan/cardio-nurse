import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { SAMPLE_MEDS, RULES } from './content.js'

const KEY = 'cardio-nurse:v1'

const initialState = {
  consent: false,
  session: null,
  introDone: false,
  profile: null,
  fontSize: 'normal',
  logs: {},
  meds: SAMPLE_MEDS,
  medTaken: {},
  learn: {},
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return initialState
    return { ...initialState, ...JSON.parse(raw) }
  } catch {
    return initialState
  }
}

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [state, setState] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* penyimpanan penuh atau diblokir: data hanya bertahan selama halaman terbuka */
    }
  }, [state])

  useEffect(() => {
    document.documentElement.dataset.size = state.fontSize
  }, [state.fontSize])

  const update = useCallback((patch) => {
    setState((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }))
  }, [])

  const reset = useCallback(() => setState(initialState), [])

  return <StoreContext.Provider value={{ state, update, reset }}>{children}</StoreContext.Provider>
}

export function useStore() {
  return useContext(StoreContext)
}

/* ---------- tanggal ---------- */

export function dateKey(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function shiftKey(key, days) {
  const [y, m, d] = key.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  dt.setDate(dt.getDate() + days)
  return dateKey(dt)
}

export function formatLongDate(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(y, m - 1, d))
}

export function formatShortDate(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(new Date(y, m - 1, d))
}

export function greeting(date = new Date()) {
  const h = date.getHours()
  if (h < 4) return 'Selamat malam'
  if (h < 11) return 'Selamat pagi'
  if (h < 15) return 'Selamat siang'
  if (h < 18) return 'Selamat sore'
  return 'Selamat malam'
}

export function formatKg(n) {
  return `${n.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg`
}

/* ---------- aturan tanda bahaya (CONTOH, menunggu validasi klinisi) ---------- */

export function evaluateLog(key, log, logs) {
  const reasons = []
  let level = null

  if (log.nyeriDada === 'ya') {
    reasons.push('Ada nyeri dada')
    level = 'darurat'
  }
  if (log.sesak === 'berat') {
    reasons.push('Sesak napas berat')
    level = 'darurat'
  }

  const previous = []
  for (let i = 1; i <= RULES.weightGainDays; i++) {
    const prev = logs[shiftKey(key, -i)]
    if (prev && typeof prev.weight === 'number') previous.push(prev.weight)
  }
  if (previous.length && typeof log.weight === 'number') {
    const gain = log.weight - Math.min(...previous)
    if (gain > RULES.weightGainKg) {
      reasons.push(`Berat badan naik ${formatKg(Math.round(gain * 10) / 10)} dalam ${RULES.weightGainDays} hari terakhir`)
      level = level || 'segera'
    }
  }
  if (log.bantal === 'ya') {
    reasons.push('Perlu bantal lebih tinggi supaya bisa bernapas saat tidur')
    level = level || 'segera'
  }
  if (log.bengkak === 'bertambah') {
    reasons.push('Bengkak di kaki bertambah')
    level = level || 'segera'
  }

  return { level, reasons }
}

/* ---------- data contoh untuk demo ---------- */

export function demoLogs(todayKey) {
  const weights = [61.2, 61.0, 61.4, 61.3, 61.1, 61.5, 61.4]
  const logs = {}
  weights.forEach((w, i) => {
    const key = shiftKey(todayKey, -(weights.length - i))
    logs[key] = { weight: w, sesak: i === 2 ? 'ringan' : 'tidak', bantal: 'tidak', bengkak: 'tidak', nyeriDada: 'tidak', savedAt: Date.now() }
  })
  return logs
}
