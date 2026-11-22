import { useState } from 'react'
import { BackspaceIcon, BookOpenTextIcon, ScalesIcon, SirenIcon, HandHeartIcon } from '@phosphor-icons/react'
import { useStore } from '../store.jsx'
import { DEMO_LOGIN } from '../content.js'
import { Brand, Choice, Form, IconBadge, TextSizeButton } from '../components.jsx'

function PlainHeader() {
  return (
    <header className="app-header">
      <Brand />
      <div className="app-header-tools">
        <TextSizeButton />
      </div>
    </header>
  )
}

/* ---------- 1. Persetujuan penelitian ---------- */

export function Consent() {
  const { update } = useStore()
  const [agree, setAgree] = useState(false)
  const [declined, setDeclined] = useState(false)

  if (declined) {
    return (
      <>
        <PlainHeader />
        <main className="screen">
          <h1>Terima kasih</h1>
          <p className="lead">Bapak/Ibu tidak ikut dalam penelitian ini. Keputusan ini tidak memengaruhi perawatan Bapak/Ibu di rumah sakit.</p>
          <button type="button" className="btn btn-outline" onClick={() => setDeclined(false)}>
            Baca lagi lembar persetujuan
          </button>
        </main>
      </>
    )
  }

  return (
    <>
      <PlainHeader />
      <main className="screen">
        <div className="stack">
          <span className="hero-art"><IconBadge Icon={HandHeartIcon} size="xl" /></span>
          <h1>Persetujuan ikut penelitian</h1>
          <p className="lead">Silakan baca dulu. Kalau ada yang kurang jelas, tanyakan ke peneliti.</p>
        </div>

        <div className="card consent-box" tabIndex={0} aria-label="Isi lembar persetujuan">
          <h2>Tentang penelitian ini</h2>
          <p>[Teks dari peneliti] Judul penelitian, nama peneliti, dan institusi.</p>
          <h2>Apa yang Bapak/Ibu lakukan</h2>
          <p>[Teks dari peneliti] Mencoba aplikasi ini dan mengisi kuesioner singkat, kurang lebih 20–30 menit.</p>
          <h2>Data Bapak/Ibu</h2>
          <p>[Teks dari peneliti] Data apa yang dikumpulkan, siapa yang bisa melihat, dan berapa lama disimpan. Nama tidak ditampilkan, hanya kode responden.</p>
          <h2>Hak Bapak/Ibu</h2>
          <p>[Teks dari peneliti] Boleh berhenti kapan saja tanpa memengaruhi perawatan.</p>
        </div>

        <label className="checkline">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <span>Saya sudah membaca dan bersedia ikut penelitian ini.</span>
        </label>

        <div className="btn-row">
          <button type="button" className="btn" disabled={!agree} onClick={() => update({ consent: true })}>
            Setuju dan lanjut
          </button>
          <button type="button" className="btn btn-outline" onClick={() => setDeclined(true)}>
            Saya tidak bersedia
          </button>
        </div>
      </main>
    </>
  )
}

/* ---------- 2. Masuk: kode responden + PIN ---------- */

export function Login() {
  const { update } = useStore()
  const [step, setStep] = useState('code')
  const [code, setCode] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  function submitCode(e) {
    e.preventDefault()
    if (!code.trim()) {
      setError('Tulis kode responden dulu.')
      return
    }
    setError('')
    setStep('pin')
  }

  function press(d) {
    setError('')
    const next = (pin + d).slice(0, 6)
    setPin(next)
    if (next.length === 6) {
      const ok = code.trim().toUpperCase() === DEMO_LOGIN.code && next === DEMO_LOGIN.pin
      if (ok) {
        update({ session: { code: DEMO_LOGIN.code, at: Date.now() } })
      } else {
        setTimeout(() => {
          setPin('')
          setError('Kode atau PIN tidak cocok. Periksa lagi, atau tanyakan ke peneliti.')
        }, 150)
      }
    }
  }

  return (
    <>
      <PlainHeader />
      <main className="screen">
        <div className="welcome">
          <span className="brand-mark lg" aria-hidden="true" />
          <span className="welcome-name">Cardio Nurse</span>
          <p className="muted">Teman perawatan jantung di rumah</p>
        </div>
        {step === 'code' ? (
          <Form className="stack" onSubmit={submitCode}>
            <h1>Masuk</h1>
            <p className="lead">Kode responden tertulis di kartu yang diberikan peneliti.</p>
            <div className={`field${error ? ' has-error' : ''}`}>
              <label htmlFor="code">Kode responden</label>
              <input
                id="code"
                className="input"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase())
                  setError('')
                }}
                autoCapitalize="characters"
                autoComplete="off"
                placeholder="Contoh: CN-001"
                aria-describedby={error ? 'code-error' : undefined}
              />
              {error && <p id="code-error" className="field-error" role="alert">{error}</p>}
            </div>
            <button type="submit" className="btn">Lanjut</button>
            <p className="demo-hint">Untuk uji coba prototipe: kode <strong>{DEMO_LOGIN.code}</strong>, PIN <strong>{DEMO_LOGIN.pin}</strong>.</p>
          </Form>
        ) : (
          <div className="stack">
            <h1>Masukkan PIN</h1>
            <p className="lead">6 angka. Kode: <strong>{code}</strong></p>
            <div className="pin-dots" aria-label={`${pin.length} dari 6 angka sudah diisi`}>
              {Array.from({ length: 6 }, (_, i) => (
                <span key={i} className={i < pin.length ? 'on' : ''} />
              ))}
            </div>
            {error && <p className="field-error" role="alert">{error}</p>}
            <div className="keypad">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
                <button key={d} type="button" onClick={() => press(d)}>{d}</button>
              ))}
              <button type="button" onClick={() => { setStep('code'); setPin(''); setError('') }} style={{ fontSize: '1rem' }}>
                Ganti kode
              </button>
              <button type="button" onClick={() => press('0')}>0</button>
              <button type="button" onClick={() => setPin(pin.slice(0, -1))} aria-label="Hapus satu angka">
                <BackspaceIcon weight="bold" aria-hidden="true" />
              </button>
            </div>
            <p className="muted small">Lupa PIN? Hubungi peneliti untuk mengatur ulang.</p>
          </div>
        )}
      </main>
    </>
  )
}

/* ---------- 3. Perkenalan aplikasi ---------- */

const SLIDES = [
  { Icon: BookOpenTextIcon, title: 'Belajar merawat jantung di rumah', body: 'Materi pendek tentang obat, makanan, cairan, dan aktivitas. Bisa dibaca atau didengarkan.' },
  { Icon: ScalesIcon, title: 'Catat berat badan dan keluhan setiap pagi', body: 'Cukup satu menit. Catatan membantu Bapak/Ibu dan perawat melihat perubahan.' },
  { Icon: SirenIcon, title: 'Diingatkan kalau ada tanda bahaya', body: 'Kalau catatan menunjukkan tanda bahaya, aplikasi akan meminta Bapak/Ibu menghubungi perawat.' },
]

export function Intro() {
  const { update } = useStore()
  const [i, setI] = useState(0)
  const slide = SLIDES[i]
  const last = i === SLIDES.length - 1

  return (
    <>
      <PlainHeader />
      <main className="screen">
        <p className="step-text">{i + 1} dari {SLIDES.length}</p>
        <div className="dots" aria-hidden="true">
          {SLIDES.map((_, n) => <span key={n} className={n === i ? 'on' : ''} />)}
        </div>
        <div className="stack" style={{ flex: 1 }}>
          <span className="hero-art"><IconBadge Icon={slide.Icon} size="xl" /></span>
          <h1>{slide.title}</h1>
          <p className="lead">{slide.body}</p>
        </div>
        <div className="btn-row">
          <button type="button" className="btn" onClick={() => (last ? update({ introDone: true }) : setI(i + 1))}>
            {last ? 'Mulai' : 'Lanjut'}
          </button>
          {i > 0 && (
            <button type="button" className="btn btn-outline" onClick={() => setI(i - 1)}>
              Sebelumnya
            </button>
          )}
        </div>
      </main>
    </>
  )
}

/* ---------- 4. Kenalan (asesmen awal singkat) ---------- */

export function Assessment() {
  const { update } = useStore()
  const [form, setForm] = useState({ salutation: '', name: '', age: '', helper: '' })
  const [errors, setErrors] = useState({})

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => ({ ...e, [k]: undefined }))
  }

  function submit(e) {
    e.preventDefault()
    const errs = {}
    if (!form.salutation) errs.salutation = 'Pilih salah satu.'
    if (!form.name.trim()) errs.name = 'Tulis nama panggilan.'
    const age = Number(form.age)
    if (!form.age || !Number.isFinite(age) || age < 18 || age > 110) errs.age = 'Tulis usia dalam angka, misalnya 62.'
    if (!form.helper) errs.helper = 'Pilih salah satu.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    update({ profile: { ...form, name: form.name.trim(), age } })
  }

  return (
    <>
      <PlainHeader />
      <main className="screen">
        <Form className="stack form-cards" style={{ gap: '1.25rem' }} onSubmit={submit}>
          <div className="stack">
            <h1>Kenalan dulu</h1>
            <p className="lead">Supaya aplikasi bisa menyapa dengan benar.</p>
          </div>

          <Choice
            label="Sapaan"
            value={form.salutation}
            onChange={(v) => set('salutation', v)}
            options={[{ value: 'Bapak', label: 'Bapak' }, { value: 'Ibu', label: 'Ibu' }]}
            error={errors.salutation}
          />

          <div className={`field${errors.name ? ' has-error' : ''}`}>
            <label htmlFor="name">Nama panggilan</label>
            <input id="name" className="input" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Contoh: Siti" autoComplete="off" />
            {errors.name && <p className="field-error" role="alert">{errors.name}</p>}
          </div>

          <div className={`field${errors.age ? ' has-error' : ''}`}>
            <label htmlFor="age">Usia (tahun)</label>
            <input id="age" className="input" inputMode="numeric" value={form.age} onChange={(e) => set('age', e.target.value.replace(/\D/g, '').slice(0, 3))} placeholder="Contoh: 62" />
            {errors.age && <p className="field-error" role="alert">{errors.age}</p>}
          </div>

          <Choice
            label="Saat memakai HP, Bapak/Ibu biasanya…"
            value={form.helper}
            onChange={(v) => set('helper', v)}
            options={[{ value: 'sendiri', label: 'Memakai sendiri' }, { value: 'keluarga', label: 'Dibantu keluarga' }]}
            error={errors.helper}
          />

          <button type="submit" className="btn">Simpan dan mulai</button>
        </Form>
      </main>
    </>
  )
}
