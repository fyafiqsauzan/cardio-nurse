import { useEffect, useId, useState } from 'react'
import {
  ArrowLeftIcon,
  BookOpenTextIcon,
  GearSixIcon,
  HouseIcon,
  LifebuoyIcon,
  NotePencilIcon,
  SpeakerHighIcon,
  SpeakerSlashIcon,
  TextAaIcon,
} from '@phosphor-icons/react'
import { useStore } from './store.jsx'
import { back } from './router.js'

const SIZES = ['normal', 'besar', 'sangat']
export const SIZE_LABEL = { normal: 'Normal', besar: 'Besar', sangat: 'Sangat besar' }

export function TextSizeButton() {
  const { state, update } = useStore()
  const next = SIZES[(SIZES.indexOf(state.fontSize) + 1) % SIZES.length]
  return (
    <button
      type="button"
      className="tool-btn"
      onClick={() => update({ fontSize: next })}
      aria-label={`Ukuran huruf: ${SIZE_LABEL[state.fontSize]}. Ketuk untuk ganti ke ${SIZE_LABEL[next]}`}
    >
      <TextAaIcon weight="bold" aria-hidden="true" />
      <span>Huruf</span>
    </button>
  )
}

export function AppHeader() {
  return (
    <header className="app-header">
      <a href="#/" className="wordmark" aria-label="Cardio Nurse, ke beranda">
        <span className="wordmark-mark" aria-hidden="true" />
        Cardio Nurse
      </a>
      <div className="app-header-tools">
        <TextSizeButton />
        <a href="#/pengaturan" className="tool-btn">
          <GearSixIcon weight="bold" aria-hidden="true" />
          <span>Atur</span>
        </a>
      </div>
    </header>
  )
}

export function TopBar({ title, fallback = '/' }) {
  return (
    <header className="top-bar">
      <button type="button" className="back-btn" onClick={() => back(fallback)}>
        <ArrowLeftIcon weight="bold" aria-hidden="true" />
        Kembali
      </button>
      {title && <p className="top-bar-title">{title}</p>}
      <TextSizeButton />
    </header>
  )
}

const TABS = [
  { href: '#/', match: (p) => p === '/', label: 'Beranda', Icon: HouseIcon },
  { href: '#/belajar', match: (p) => p.startsWith('/belajar'), label: 'Belajar', Icon: BookOpenTextIcon },
  { href: '#/catatan', match: (p) => p.startsWith('/catatan'), label: 'Catatan', Icon: NotePencilIcon },
  { href: '#/bantuan', match: (p) => p.startsWith('/bantuan'), label: 'Bantuan', Icon: LifebuoyIcon },
]

export function BottomNav({ path }) {
  return (
    <nav className="bottom-nav" aria-label="Menu utama">
      {TABS.map(({ href, match, label, Icon }) => {
        const active = match(path)
        return (
          <a key={href} href={href} className="tab" aria-current={active ? 'page' : undefined}>
            <Icon weight="duotone" className="duo" aria-hidden="true" />
            <span>{label}</span>
          </a>
        )
      })}
    </nav>
  )
}

/* Form yang tetap jalan di bingkai sandbox (mis. pratinjau file HTML di app chat).
   Di sana submit bawaan browser diblokir sehingga onSubmit tidak pernah terpanggil,
   tetapi event klik pada tombol submit tetap muncul, termasuk saat menekan Enter.
   Jadi form dikirim dari klik tombol; onSubmit hanya cadangan. */
export function Form({ onSubmit, children, ...props }) {
  function handleClick(e) {
    const btn = e.target.closest('button')
    if (!btn || btn.type !== 'submit' || btn.form !== e.currentTarget) return
    e.preventDefault()
    onSubmit(e)
  }
  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(e)
  }
  return (
    <form {...props} noValidate onClick={handleClick} onSubmit={handleSubmit}>
      {children}
    </form>
  )
}

export function Choice({ label, hint, value, options, onChange, error }) {
  const name = useId()
  return (
    <fieldset className={`choice${error ? ' has-error' : ''}`}>
      <legend>{label}</legend>
      {hint && <p className="field-hint">{hint}</p>}
      <div className="choice-options" data-count={options.length}>
        {options.map((o) => (
          <label key={o.value} className="choice-option" data-tone={o.tone}>
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="field-error" role="alert">{error}</p>}
    </fieldset>
  )
}

export function SpeakButton({ text }) {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => () => supported && window.speechSynthesis.cancel(), [supported])

  if (!supported) return null

  function toggle() {
    const synth = window.speechSynthesis
    if (speaking) {
      synth.cancel()
      setSpeaking(false)
      return
    }
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'id-ID'
    u.rate = 0.9
    const voice = synth.getVoices().find((v) => v.lang?.toLowerCase().startsWith('id'))
    if (voice) u.voice = voice
    u.onend = () => setSpeaking(false)
    u.onerror = () => setSpeaking(false)
    synth.cancel()
    synth.speak(u)
    setSpeaking(true)
  }

  return (
    <button type="button" className="btn btn-quiet speak-btn" onClick={toggle} aria-pressed={speaking}>
      {speaking ? <SpeakerSlashIcon weight="bold" aria-hidden="true" /> : <SpeakerHighIcon weight="bold" aria-hidden="true" />}
      {speaking ? 'Berhenti membacakan' : 'Dengarkan materi'}
    </button>
  )
}
