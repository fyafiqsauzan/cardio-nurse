import { useState } from 'react'
import { CaretRightIcon, CheckIcon } from '@phosphor-icons/react'
import { MODULES } from '../content.js'
import { useStore, dateKey } from '../store.jsx'
import { Choice, SpeakButton, TopBar } from '../components.jsx'
import { go } from '../router.js'

export function LearnList() {
  const { state } = useStore()
  const readCount = MODULES.filter((m) => state.learn[m.id]?.read).length

  return (
    <main className="screen">
      <div className="stack" style={{ gap: '0.4rem' }}>
        <h1>Belajar</h1>
        <p className="lead">Urutan di bawah ini disarankan, tapi boleh dibuka yang mana saja.</p>
        <p className="progress-text">{readCount} dari {MODULES.length} materi sudah dibaca</p>
      </div>

      <ol className="module-list">
        {MODULES.map((m, i) => {
          const l = state.learn[m.id]
          const meta = [`${m.minutes} menit baca`]
          if (l?.quizDone) meta.push(`kuis benar ${l.quizScore} dari ${m.quiz.length}`)
          return (
            <li key={m.id} className={`module-item${l?.read ? ' is-read' : ''}`}>
              <a href={`#/belajar/${m.id}`}>
                <span className="module-num" aria-hidden="true">{l?.read ? <CheckIcon weight="bold" /> : i + 1}</span>
                <span className="row-text">
                  <span className="module-title">{m.title}</span>
                  <span className="module-meta">
                    {l?.read ? 'Sudah dibaca. ' : ''}
                    {meta.join(', ')}
                  </span>
                </span>
                <CaretRightIcon weight="bold" className="chev" aria-hidden="true" />
              </a>
            </li>
          )
        })}
      </ol>
    </main>
  )
}

export function ModulePage({ id }) {
  const { state, update } = useStore()
  const m = MODULES.find((x) => x.id === id)
  if (!m) return <NotFound />

  const spoken = [m.title, ...m.sections.flatMap((s) => [s.heading, s.body])].join('. ')

  function finish() {
    update((s) => ({ learn: { ...s.learn, [m.id]: { ...s.learn[m.id], read: true, readOn: dateKey() } } }))
    go(`/belajar/${m.id}/kuis`)
  }

  return (
    <>
      <TopBar title="Materi" fallback="/belajar" />
      <main className="screen">
        <article className="article">
          <div className="stack" style={{ gap: '0.4rem' }}>
            <h1>{m.title}</h1>
            <p className="muted">{m.minutes} menit baca</p>
          </div>
          <SpeakButton text={spoken} />
          {m.sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              <p>{s.body}</p>
            </section>
          ))}
          <p className="draft-note">Materi contoh untuk prototipe. Naskah final dari peneliti dan divalidasi ahli materi.</p>
        </article>
        <div className="btn-row">
          <button type="button" className="btn" onClick={finish}>
            Selesai membaca, lanjut kuis
          </button>
          {state.learn[m.id]?.read && (
            <a href="#/belajar" className="btn btn-outline">Kembali ke daftar materi</a>
          )}
        </div>
      </main>
    </>
  )
}

export function QuizPage({ id }) {
  const { update } = useStore()
  const m = MODULES.find((x) => x.id === id)
  const [i, setI] = useState(0)
  const [choice, setChoice] = useState('')
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  if (!m) return <NotFound />
  const q = m.quiz[i]

  function check() {
    if (choice === '') {
      setError('Pilih salah satu jawaban dulu.')
      return
    }
    setChecked(true)
    if (Number(choice) === q.answer) setScore((s) => s + 1)
  }

  function next() {
    if (i < m.quiz.length - 1) {
      setI(i + 1)
      setChoice('')
      setChecked(false)
      return
    }
    update((s) => ({ learn: { ...s.learn, [m.id]: { ...s.learn[m.id], read: true, quizDone: true, quizScore: score } } }))
    setDone(true)
  }

  function restart() {
    setI(0)
    setChoice('')
    setChecked(false)
    setScore(0)
    setDone(false)
  }

  if (done) {
    const nextIdx = MODULES.findIndex((x) => x.id === m.id) + 1
    const nextModule = MODULES[nextIdx]
    return (
      <>
        <TopBar title="Kuis" fallback="/belajar" />
        <main className="screen">
          <div className="stack">
            <h1>Kuis selesai</h1>
            <p className="lead">Benar {score} dari {m.quiz.length} pertanyaan.</p>
            <p>{score === m.quiz.length ? 'Semua jawaban benar.' : 'Materinya bisa dibaca lagi kapan saja.'}</p>
          </div>
          <div className="btn-row">
            {nextModule && (
              <a href={`#/belajar/${nextModule.id}`} className="btn">Materi berikutnya: {nextModule.title}</a>
            )}
            <a href="#/belajar" className="btn btn-outline">Kembali ke daftar materi</a>
            <button type="button" className="text-link" onClick={restart}>Ulangi kuis</button>
          </div>
        </main>
      </>
    )
  }

  const correct = Number(choice) === q.answer

  return (
    <>
      <TopBar title={`Kuis: ${m.title}`} fallback={`/belajar/${m.id}`} />
      <main className="screen">
        <p className="progress-text">Pertanyaan {i + 1} dari {m.quiz.length}</p>
        <Choice
          label={q.q}
          value={choice}
          onChange={(v) => {
            if (checked) return
            setChoice(v)
            setError('')
          }}
          options={q.options.map((o, n) => ({ value: String(n), label: o }))}
          error={error}
        />
        {checked && (
          <div className={`feedback ${correct ? 'correct' : 'wrong'}`} role="status">
            <strong>{correct ? 'Benar.' : `Jawaban yang tepat: ${q.options[q.answer]}`}</strong>
            <p>{q.why}</p>
          </div>
        )}
        {checked ? (
          <button type="button" className="btn" onClick={next}>
            {i < m.quiz.length - 1 ? 'Pertanyaan berikutnya' : 'Lihat hasil'}
          </button>
        ) : (
          <button type="button" className="btn" onClick={check}>Periksa jawaban</button>
        )}
      </main>
    </>
  )
}

function NotFound() {
  return (
    <>
      <TopBar fallback="/belajar" />
      <main className="screen">
        <h1>Materi tidak ditemukan</h1>
        <a href="#/belajar" className="btn">Ke daftar materi</a>
      </main>
    </>
  )
}
