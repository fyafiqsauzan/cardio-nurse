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

function useTextSize() {
  const { state, update } = useStore()
  const next = SIZES[(SIZES.indexOf(state.fontSize) + 1) % SIZES.length]
  return {
    label: `Ukuran huruf: ${SIZE_LABEL[state.fontSize]}. Ketuk untuk ganti ke ${SIZE_LABEL[next]}`,
    current: SIZE_LABEL[state.fontSize],
    cycle: () => update({ fontSize: next }),
  }
}

export function TextSizeButton() {
  const { label, cycle } = useTextSize()
  return (
    <button type="button" className="tool-btn" onClick={cycle} aria-label={label}>
      <TextAaIcon weight="bold" aria-hidden="true" />
      <span>Huruf</span>
    </button>
  )
}

export function Brand({ as: Tag = 'span', ...props }) {
  return (
    <Tag className="brand" {...props}>
      <span className="brand-mark" aria-hidden="true" />
      Cardio Nurse
    </Tag>
  )
}

/* Header layar utama di ponsel. Di layar lebar diganti navigasi samping. */
export function AppHeader() {
  return (
    <header className="app-header">
      <Brand as="a" href="#/" aria-label="Cardio Nurse, ke beranda" />
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

export const TABS = [
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
            <span className="tab-icon"><Icon weight="duotone" className="duo" aria-hidden="true" /></span>
            <span>{label}</span>
          </a>
        )
      })}
    </nav>
  )
}

/* Navigasi samping untuk laptop/komputer (disembunyikan di ponsel lewat CSS). */
export function SideNav({ path }) {
  const { label, current, cycle } = useTextSize()
  return (
    <nav className="side-nav" aria-label="Menu utama">
      <Brand as="a" href="#/" aria-label="Cardio Nurse, ke beranda" />
      {TABS.map(({ href, match, label: text, Icon }) => (
        <a key={href} href={href} className="side-link" aria-current={match(path) ? 'page' : undefined}>
          <Icon weight="duotone" className="duo" aria-hidden="true" />
          {text}
        </a>
      ))}
      <span className="side-sep" />
      <button type="button" className="side-link" onClick={cycle} aria-label={label}>
        <TextAaIcon weight="bold" aria-hidden="true" />
        Huruf: {current}
      </button>
      <a href="#/pengaturan" className="side-link" aria-current={path.startsWith('/pengaturan') ? 'page' : undefined}>
        <GearSixIcon weight="bold" aria-hidden="true" />
        Pengaturan
      </a>
    </nav>
  )
}

/* Ikon di dalam lingkaran. tone: teal (bawaan), lime, solid, danger. size: lg, xl. */
export function IconBadge({ Icon, tone, size, weight = 'duotone', className = '' }) {
  const cls = ['icon-badge', tone, size, className].filter(Boolean).join(' ')
  return (
    <span className={cls} aria-hidden="true">
      <Icon weight={weight} className="duo" />
    </span>
  )
}

export function PageHead({ title, lead, children }) {
  return (
    <div className="page-head">
      <h1>{title}</h1>
      {lead && <p className="lead">{lead}</p>}
      {children}
    </div>
  )
}

export function EmptyState({ Icon, children }) {
  return (
    <div className="empty">
      <IconBadge Icon={Icon} />
      <p>{children}</p>
    </div>
  )
}

export function Progress({ value, max, label }) {
  const pct = max ? Math.round((value / max) * 100) : 0
  return (
    <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} aria-label={label}>
      <span style={{ width: `${pct}%` }} />
    </div>
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
