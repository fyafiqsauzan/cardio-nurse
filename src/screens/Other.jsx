import { useState } from 'react'
import { CaretRightIcon, CheckIcon, FirstAidKitIcon, IdentificationCardIcon, InfoIcon, PhoneIcon, PillIcon, SignOutIcon, UserIcon } from '@phosphor-icons/react'
import { useStore, dateKey, formatLongDate, demoLogs } from '../store.jsx'
import { CONTACTS, FAQ } from '../content.js'
import { Choice, IconBadge, PageHead, TopBar, SIZE_LABEL } from '../components.jsx'
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
        <div className="med-intro narrow">
          <PageHead title="Jadwal obat" lead={formatLongDate(today)}>
            <p>Ketuk jamnya setelah obat diminum.</p>
          </PageHead>
          <IconBadge Icon={PillIcon} size="xl" />
        </div>

        <div className="stack narrow" style={{ gap: '1rem' }}>
        {state.meds.map((m) => (
          <article key={m.id} className="card etiket" aria-labelledby={`med-${m.id}`}>
            <div className="etiket-head">
              <PillIcon weight="bold" aria-hidden="true" />
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
                      <span className="dose-mark" aria-hidden="true">{on && <CheckIcon weight="bold" />}</span>
                      <span className="dose-state">{on ? 'Sudah diminum' : 'Belum diminum'}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </article>
        ))}
        </div>

        <p className="draft-note narrow"><InfoIcon weight="bold" aria-hidden="true" style={{ flex: 'none', width: '1.3rem', height: '1.3rem' }} />Obat di atas contoh. Di versi penelitian, jadwal diisi sesuai resep tiap pasien. Notifikasi pengingat belum aktif di prototipe ini.</p>
      </main>
    </>
  )
}

/* ---------- bantuan ---------- */

export function Help() {
  return (
    <main className="screen">
      <PageHead title="Bantuan" lead="Ketuk untuk langsung menelepon." />

      <div className="home-grid">
        <section className="stack" aria-labelledby="call-title">
          <h2 id="call-title" className="group-label">Kontak</h2>
          <ul className="list-group">
            <li>
              <a href={`tel:${CONTACTS.nurse.number}`} className="list-row call-row">
                <IconBadge Icon={PhoneIcon} />
                <span className="row-text">
                  <span className="row-title">{CONTACTS.nurse.label}</span>
                  <span className="row-sub">{CONTACTS.nurse.shown}</span>
                </span>
                <CaretRightIcon weight="bold" className="chev" aria-hidden="true" />
              </a>
            </li>
            <li>
              <a href={`tel:${CONTACTS.emergency.number}`} className="list-row call-row emergency">
                <IconBadge Icon={FirstAidKitIcon} tone="danger" />
                <span className="row-text">
                  <span className="row-title">{CONTACTS.emergency.label}</span>
                  <span className="row-sub">Telepon {CONTACTS.emergency.shown} bila nyeri dada, sesak berat, atau pingsan</span>
                </span>
                <CaretRightIcon weight="bold" className="chev" aria-hidden="true" />
              </a>
            </li>
          </ul>
          <p className="muted small">{CONTACTS.nurse.note}</p>
        </section>

        <section className="stack" aria-labelledby="faq-title">
          <h2 id="faq-title" className="group-label">Pertanyaan yang sering ditanyakan</h2>
          <div className="card faq">
            {FAQ.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
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
        <PageHead title="Pengaturan" />

        <div className="stack narrow" style={{ gap: '1.5rem' }}>
          <section className="card">
            <Choice
              label="Ukuran huruf"
              hint="Juga bisa diganti lewat tombol Huruf di bagian atas layar."
              value={state.fontSize}
              onChange={(v) => update({ fontSize: v })}
              options={Object.entries(SIZE_LABEL).map(([value, label]) => ({ value, label }))}
            />
          </section>

          <section className="stack" aria-labelledby="acc-title">
            <h2 id="acc-title" className="group-label">Akun</h2>
            <ul className="list-group">
              <li>
                <div className="list-row">
                  <IconBadge Icon={IdentificationCardIcon} />
                  <span className="row-text"><span className="row-sub">Kode responden</span><span className="row-title">{state.session?.code}</span></span>
                  <span />
                </div>
              </li>
              <li>
                <div className="list-row">
                  <IconBadge Icon={UserIcon} tone="lime" />
                  <span className="row-text"><span className="row-sub">Nama</span><span className="row-title">{state.profile?.salutation} {state.profile?.name}</span></span>
                  <span />
                </div>
              </li>
              <li>
                <button
                  type="button"
                  className="list-row"
                  onClick={() => {
                    update({ session: null })
                    go('/')
                  }}
                >
                  <IconBadge Icon={SignOutIcon} weight="bold" />
                  <span className="row-text"><span className="row-title">Keluar</span></span>
                  <CaretRightIcon weight="bold" className="chev" aria-hidden="true" />
                </button>
              </li>
            </ul>
          </section>

          <section className="stack" aria-labelledby="demo-title">
            <h2 id="demo-title" className="group-label">Untuk uji coba prototipe</h2>
            <div className="card">
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
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
