import { useState } from 'react'
import { FirstAidKitIcon, PhoneIcon, SignOutIcon } from '@phosphor-icons/react'
import { useStore, dateKey, formatLongDate, demoLogs } from '../store.jsx'
import { CONTACTS, FAQ } from '../content.js'
import { Choice, TopBar, SIZE_LABEL } from '../components.jsx'
import { go } from '../router.js'

/* ---------- jadwal obat (etiket) ---------- */

export function Meds() {
  const { state, update } = useStore()
  const today = dateKey()
  const takenToday = state.medTaken[today] || {}

  function toggle(doseId) {
    update((s) => {
      const day = { ...(s.medTaken[today] || {}) }
      day[doseId] = !day[doseId]
      return { medTaken: { ...s.medTaken, [today]: day } }
    })
  }

  return (
    <>
      <TopBar title="Jadwal obat" fallback="/" />
      <main className="screen">
        <div className="stack" style={{ gap: '0.25rem' }}>
          <h1>Jadwal obat</h1>
          <p className="lead">{formatLongDate(today)}</p>
        </div>
        <p>Ketuk jamnya setelah obat diminum.</p>

        {state.meds.map((m) => (
          <article key={m.id} className="etiket" aria-labelledby={`med-${m.id}`}>
            <div className="etiket-head">
              <span>{m.kind}</span>
            </div>
            <div className="etiket-body">
              <h2 id={`med-${m.id}`} className="etiket-name">{m.name}</h2>
              <dl style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div className="etiket-line"><dt>Aturan pakai</dt><dd>{m.rule}</dd></div>
                <div className="etiket-line"><dt>Waktu</dt><dd>{m.when}</dd></div>
              </dl>
              <div className="dose-grid">
                {m.times.map((t) => {
                  const id = `${m.id}@${t}`
                  const on = Boolean(takenToday[id])
                  return (
                    <button key={id} type="button" className="dose-btn" aria-pressed={on} onClick={() => toggle(id)}>
                      <span className="dose-time">{t}</span>
                      <span className="dose-state">{on ? 'Sudah diminum' : 'Belum diminum'}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </article>
        ))}

        <p className="draft-note">Obat di atas contoh. Di versi penelitian, jadwal diisi sesuai resep tiap pasien. Notifikasi pengingat belum aktif di prototipe ini.</p>
      </main>
    </>
  )
}

/* ---------- bantuan ---------- */

export function Help() {
  return (
    <main className="screen">
      <div className="stack" style={{ gap: '0.4rem' }}>
        <h1>Bantuan</h1>
        <p className="lead">Ketuk untuk langsung menelepon.</p>
      </div>

      <div className="stack">
        <a href={`tel:${CONTACTS.nurse.number}`} className="call-card">
          <PhoneIcon weight="duotone" className="duo" aria-hidden="true" />
          <span className="call-label">{CONTACTS.nurse.label}</span>
          <span className="call-number">{CONTACTS.nurse.shown}</span>
        </a>
        <a href={`tel:${CONTACTS.emergency.number}`} className="call-card emergency">
          <FirstAidKitIcon weight="bold" aria-hidden="true" />
          <span className="call-label">{CONTACTS.emergency.label}</span>
          <span className="call-number">Telepon {CONTACTS.emergency.shown} bila nyeri dada, sesak berat, atau pingsan</span>
        </a>
        <p className="muted small">{CONTACTS.nurse.note}</p>
      </div>

      <section className="stack" aria-labelledby="faq-title">
        <h2 id="faq-title">Pertanyaan yang sering ditanyakan</h2>
        <div className="faq">
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  )
}

/* ---------- pengaturan ---------- */

export function Settings() {
  const { state, update, reset } = useStore()
  const [confirmReset, setConfirmReset] = useState(false)
  const [demoDone, setDemoDone] = useState(false)

  function fillDemo() {
    const today = dateKey()
    update((s) => ({ logs: { ...demoLogs(today), ...s.logs } }))
    setDemoDone(true)
  }

  return (
    <>
      <TopBar title="Pengaturan" fallback="/" />
      <main className="screen">
        <h1>Pengaturan</h1>

        <Choice
          label="Ukuran huruf"
          hint="Juga bisa diganti lewat tombol Huruf di bagian atas layar."
          value={state.fontSize}
          onChange={(v) => update({ fontSize: v })}
          options={Object.entries(SIZE_LABEL).map(([value, label]) => ({ value, label }))}
        />

        <section className="stack" aria-labelledby="acc-title">
          <h2 id="acc-title">Akun</h2>
          <dl className="summary-list">
            <div><dt>Kode responden</dt><dd>{state.session?.code}</dd></div>
            <div><dt>Nama</dt><dd>{state.profile?.salutation} {state.profile?.name}</dd></div>
          </dl>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              update({ session: null })
              go('/')
            }}
          >
            <SignOutIcon weight="bold" aria-hidden="true" /> Keluar
          </button>
        </section>

        <section className="stack" aria-labelledby="demo-title">
          <h2 id="demo-title">Untuk uji coba prototipe</h2>
          <p className="muted">Bagian ini untuk peneliti dan pengembang, akan dihapus di versi penelitian.</p>
          <button type="button" className="btn btn-quiet" onClick={fillDemo} disabled={demoDone}>
            {demoDone ? 'Data contoh 7 hari sudah diisi' : 'Isi data contoh 7 hari'}
          </button>
          {confirmReset ? (
            <div className="stack">
              <p><strong>Semua data di HP ini akan dihapus</strong>, termasuk catatan dan progres belajar.</p>
              <button type="button" className="btn btn-danger" onClick={() => { reset(); go('/') }}>Ya, hapus semua data</button>
              <button type="button" className="btn btn-outline" onClick={() => setConfirmReset(false)}>Batal</button>
            </div>
          ) : (
            <button type="button" className="btn btn-danger-outline" onClick={() => setConfirmReset(true)}>Hapus semua data</button>
          )}
        </section>
      </main>
    </>
  )
}
