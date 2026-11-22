import { useRef, useState } from 'react'
import { CheckIcon, PhoneIcon, WarningIcon, SirenIcon } from '@phosphor-icons/react'
import { useStore, dateKey, evaluateLog, formatLongDate, formatShortDate, formatKg } from '../store.jsx'
import { CONTACTS } from '../content.js'
import { Choice, TopBar } from '../components.jsx'
import { go } from '../router.js'

const SESAK = { tidak: 'Tidak sesak', ringan: 'Sesak ringan', berat: 'Sesak berat' }
const BENGKAK = { tidak: 'Tidak bengkak', sama: 'Sama seperti kemarin', bertambah: 'Bengkak bertambah' }

function flagsOf(log) {
  const f = []
  if (log.sesak !== 'tidak') f.push(SESAK[log.sesak])
  if (log.bantal === 'ya') f.push('Perlu bantal tinggi')
  if (log.bengkak !== 'tidak') f.push(BENGKAK[log.bengkak])
  if (log.nyeriDada === 'ya') f.push('Nyeri dada')
  return f
}

/* ---------- grafik berat badan ---------- */

function WeightChart({ entries }) {
  if (entries.length < 2) {
    return <p className="empty">Grafik muncul setelah ada catatan berat badan minimal 2 hari.</p>
  }
  const W = 340
  const H = 190
  const pad = { l: 44, r: 12, t: 16, b: 30 }
  const ws = entries.map((e) => e.weight)
  let min = Math.min(...ws)
  let max = Math.max(...ws)
  if (max - min < 2) {
    const mid = (max + min) / 2
    min = mid - 1
    max = mid + 1
  }
  const x = (i) => pad.l + (i * (W - pad.l - pad.r)) / (entries.length - 1)
  const y = (w) => pad.t + ((max - w) * (H - pad.t - pad.b)) / (max - min)
  const points = entries.map((e, i) => `${x(i)},${y(e.weight)}`).join(' ')
  const first = entries[0]
  const lastE = entries[entries.length - 1]

  return (
    <svg
      className="chart"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`Grafik berat badan ${entries.length} catatan terakhir, dari ${formatKg(first.weight)} pada ${formatShortDate(first.key)} sampai ${formatKg(lastE.weight)} pada ${formatShortDate(lastE.key)}`}
    >
      <line x1={pad.l} x2={W - pad.r} y1={y(max)} y2={y(max)} stroke="#cfd4e6" strokeWidth="1.5" strokeDasharray="4 4" />
      <line x1={pad.l} x2={W - pad.r} y1={y(min)} y2={y(min)} stroke="#cfd4e6" strokeWidth="1.5" strokeDasharray="4 4" />
      <text x={pad.l - 6} y={y(max) + 4} textAnchor="end">{max.toFixed(1).replace('.', ',')}</text>
      <text x={pad.l - 6} y={y(min) + 4} textAnchor="end">{min.toFixed(1).replace('.', ',')}</text>
      <polyline points={points} fill="none" stroke="#1f2a6b" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      {entries.map((e, i) => (
        <circle key={e.key} cx={x(i)} cy={y(e.weight)} r={i === entries.length - 1 ? 6 : 4} fill={i === entries.length - 1 ? '#f2b705' : '#1f2a6b'} stroke="#1f2a6b" strokeWidth="2" />
      ))}
      <text x={x(0)} y={H - 8} textAnchor="start">{formatShortDate(first.key)}</text>
      <text x={x(entries.length - 1)} y={H - 8} textAnchor="end">{formatShortDate(lastE.key)}</text>
    </svg>
  )
}

/* ---------- tab Catatan ---------- */

export function LogHome() {
  const { state } = useStore()
  const today = dateKey()
  const todayLog = state.logs[today]
  const keys = Object.keys(state.logs).sort()
  const entries = keys.slice(-14).map((k) => ({ key: k, ...state.logs[k] }))

  return (
    <main className="screen">
      <h1>Catatan harian</h1>

      <section className="today-panel" aria-labelledby="today-title">
        <h2 id="today-title">Hari ini</h2>
        {todayLog ? (
          <>
            <dl className="summary-list">
              <div><dt>Berat badan</dt><dd>{formatKg(todayLog.weight)}</dd></div>
              <div><dt>Keluhan</dt><dd className={flagsOf(todayLog).length ? 'warn' : ''}>{flagsOf(todayLog).join(', ') || 'Tidak ada keluhan'}</dd></div>
            </dl>
            <a href="#/catatan/isi" className="btn btn-outline">Ubah catatan hari ini</a>
          </>
        ) : (
          <>
            <p>Belum ada catatan. Timbang badan dulu, lalu isi catatan.</p>
            <a href="#/catatan/isi" className="btn">Isi catatan hari ini</a>
          </>
        )}
      </section>

      <section className="stack" aria-labelledby="chart-title">
        <h2 id="chart-title">Berat badan</h2>
        <WeightChart entries={entries} />
      </section>

      <section className="stack" aria-labelledby="history-title">
        <h2 id="history-title">Riwayat</h2>
        {keys.length ? (
          <ul className="history">
            {[...keys].reverse().slice(0, 14).map((k) => {
              const l = state.logs[k]
              const f = flagsOf(l)
              return (
                <li key={k}>
                  <span className="h-date">{formatLongDate(k)}</span>
                  <span className="h-weight">{formatKg(l.weight)}</span>
                  <span className={`h-flags${l.alert ? ' warn' : ''}`}>{f.length ? f.join(', ') : 'Tidak ada keluhan'}</span>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="empty">Riwayat masih kosong. Catatan pertama akan muncul di sini.</p>
        )}
      </section>
    </main>
  )
}

/* ---------- formulir catatan ---------- */

export function LogForm() {
  const { state, update } = useStore()
  const today = dateKey()
  const existing = state.logs[today]
  const lastKey = Object.keys(state.logs).filter((k) => k < today).sort().pop()
  const lastWeight = lastKey ? state.logs[lastKey].weight : null

  const [weight, setWeight] = useState(String((existing?.weight ?? lastWeight ?? 60).toFixed(1)).replace('.', ','))
  const [form, setForm] = useState({
    sesak: existing?.sesak ?? '',
    bantal: existing?.bantal ?? '',
    bengkak: existing?.bengkak ?? '',
    nyeriDada: existing?.nyeriDada ?? '',
  })
  const [errors, setErrors] = useState({})
  const formRef = useRef(null)

  const num = Number(weight.replace(',', '.'))

  function step(delta) {
    const base = Number.isFinite(num) ? num : 60
    const v = Math.max(20, Math.min(250, Math.round((base + delta) * 10) / 10))
    setWeight(v.toFixed(1).replace('.', ','))
    setErrors((e) => ({ ...e, weight: undefined }))
  }

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => ({ ...e, [k]: undefined }))
  }

  function submit(e) {
    e.preventDefault()
    const errs = {}
    if (!Number.isFinite(num) || num < 20 || num > 250) errs.weight = 'Tulis berat badan dalam kg, misalnya 61,5.'
    for (const k of ['sesak', 'bantal', 'bengkak', 'nyeriDada']) if (!form[k]) errs[k] = 'Pilih salah satu.'
    setErrors(errs)
    if (Object.keys(errs).length) {
      requestAnimationFrame(() => formRef.current?.querySelector('.has-error')?.scrollIntoView({ block: 'center' }))
      return
    }
    const log = { weight: Math.round(num * 10) / 10, ...form, savedAt: Date.now() }
    const result = evaluateLog(today, log, state.logs)
    log.alert = result.level
    log.reasons = result.reasons
    update((s) => ({ logs: { ...s.logs, [today]: log } }))
    go('/catatan/hasil')
  }

  return (
    <>
      <TopBar title="Catatan hari ini" fallback="/catatan" />
      <main className="screen">
        <form ref={formRef} className="stack" style={{ gap: '1.75rem' }} onSubmit={submit} noValidate>
          <div className="stack" style={{ gap: '0.25rem' }}>
            <h1>Catatan hari ini</h1>
            <p className="lead">{formatLongDate(today)}</p>
          </div>

          <div className={`field stepper${errors.weight ? ' has-error' : ''}`}>
            <label htmlFor="weight">Berat badan pagi ini</label>
            <p className="field-hint">Timbang setelah buang air kecil, sebelum makan.{lastWeight ? ` Catatan terakhir: ${formatKg(lastWeight)}.` : ''}</p>
            <div className="stepper-value">
              <input
                id="weight"
                inputMode="decimal"
                value={weight}
                onChange={(e) => {
                  setWeight(e.target.value.replace(/[^\d,.]/g, '').slice(0, 5))
                  setErrors((x) => ({ ...x, weight: undefined }))
                }}
              />
              <span>kg</span>
            </div>
            <div className="stepper-buttons">
              <button type="button" onClick={() => step(-1)} aria-label="Kurangi 1 kilogram">−1</button>
              <button type="button" onClick={() => step(-0.1)} aria-label="Kurangi 0,1 kilogram">−0,1</button>
              <button type="button" onClick={() => step(0.1)} aria-label="Tambah 0,1 kilogram">+0,1</button>
              <button type="button" onClick={() => step(1)} aria-label="Tambah 1 kilogram">+1</button>
            </div>
            {errors.weight && <p className="field-error" role="alert">{errors.weight}</p>}
          </div>

          <Choice
            label="Sesak napas hari ini?"
            value={form.sesak}
            onChange={(v) => set('sesak', v)}
            options={[
              { value: 'tidak', label: 'Tidak sesak' },
              { value: 'ringan', label: 'Sesak ringan, saat beraktivitas' },
              { value: 'berat', label: 'Sesak berat, walau sedang istirahat', tone: 'warn' },
            ]}
            error={errors.sesak}
          />

          <Choice
            label="Tadi malam perlu bantal lebih tinggi dari biasa supaya bisa bernapas?"
            value={form.bantal}
            onChange={(v) => set('bantal', v)}
            options={[
              { value: 'tidak', label: 'Tidak' },
              { value: 'ya', label: 'Ya', tone: 'warn' },
            ]}
            error={errors.bantal}
          />

          <Choice
            label="Bengkak di kaki?"
            value={form.bengkak}
            onChange={(v) => set('bengkak', v)}
            options={[
              { value: 'tidak', label: 'Tidak bengkak' },
              { value: 'sama', label: 'Ada, sama seperti kemarin' },
              { value: 'bertambah', label: 'Ada, bertambah', tone: 'warn' },
            ]}
            error={errors.bengkak}
          />

          <Choice
            label="Nyeri dada hari ini?"
            value={form.nyeriDada}
            onChange={(v) => set('nyeriDada', v)}
            options={[
              { value: 'tidak', label: 'Tidak' },
              { value: 'ya', label: 'Ya', tone: 'warn' },
            ]}
            error={errors.nyeriDada}
          />

          <button type="submit" className="btn">Simpan catatan</button>
        </form>
      </main>
    </>
  )
}

/* ---------- hasil setelah simpan ---------- */

export function LogResult() {
  const { state } = useStore()
  const today = dateKey()
  const log = state.logs[today]

  if (!log) {
    return (
      <main className="screen">
        <h1>Belum ada catatan hari ini</h1>
        <a href="#/catatan/isi" className="btn">Isi catatan hari ini</a>
      </main>
    )
  }

  if (log.alert) {
    const urgent = log.alert === 'darurat'
    return (
      <main className={`screen alert-screen level-${log.alert}`} role="alert" aria-live="assertive">
        {urgent ? <SirenIcon weight="bold" className="alert-icon" aria-hidden="true" /> : <WarningIcon weight="bold" className="alert-icon" aria-hidden="true" />}
        <div className="stack">
          <h1>{urgent ? 'Segera ke IGD atau telepon 119' : `${state.profile.salutation} perlu menghubungi perawat hari ini`}</h1>
          <p className="lead" style={{ color: 'var(--ink)' }}>Catatan hari ini menunjukkan:</p>
          <ul className="reason-list">
            {log.reasons.map((r) => <li key={r}>{r}</li>)}
          </ul>
        </div>
        <div className="btn-row">
          {urgent ? (
            <>
              <a href={`tel:${CONTACTS.emergency.number}`} className="btn btn-danger">
                <PhoneIcon weight="bold" aria-hidden="true" /> Telepon {CONTACTS.emergency.shown}
              </a>
              <a href={`tel:${CONTACTS.nurse.number}`} className="btn btn-danger-outline">
                <PhoneIcon weight="bold" aria-hidden="true" /> Telepon perawat
              </a>
            </>
          ) : (
            <>
              <a href={`tel:${CONTACTS.nurse.number}`} className="btn">
                <PhoneIcon weight="bold" aria-hidden="true" /> Telepon perawat
              </a>
              <p className="small" style={{ color: 'var(--ink)' }}>Kalau muncul nyeri dada atau sesak berat, langsung telepon {CONTACTS.emergency.shown}.</p>
            </>
          )}
          <a href="#/" className="text-link">Saya sudah menghubungi, kembali ke beranda</a>
        </div>
        <p className="draft-note">Aturan peringatan ini contoh untuk prototipe dan wajib divalidasi tenaga kesehatan.</p>
      </main>
    )
  }

  return (
    <main className="screen">
      <div className="success-mark" aria-hidden="true"><CheckIcon weight="bold" /></div>
      <div className="stack">
        <h1>Catatan tersimpan</h1>
        <p className="lead">Tidak ada tanda bahaya dari catatan hari ini. Tetap minum obat sesuai jadwal.</p>
      </div>
      <dl className="summary-list">
        <div><dt>Berat badan</dt><dd>{formatKg(log.weight)}</dd></div>
        <div><dt>Keluhan</dt><dd>{flagsOf(log).join(', ') || 'Tidak ada keluhan'}</dd></div>
      </dl>
      <div className="btn-row">
        <a href="#/" className="btn">Kembali ke beranda</a>
        <a href="#/catatan" className="btn btn-outline">Lihat riwayat catatan</a>
      </div>
    </main>
  )
}
