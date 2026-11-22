import { useState } from 'react'
import { CaretRightIcon, CheckIcon, ClockIcon, InfoIcon, TrophyIcon } from '@phosphor-icons/react'
import { MODULES } from '../content.js'
import { useStore, dateKey } from '../store.jsx'
import { Choice, IconBadge, PageHead, Progress, SpeakButton, TopBar } from '../components.jsx'
import { go } from '../router.js'

export function LearnList() {
  const { state } = useStore()
  const readCount = MODULES.filter((m) => state.learn[m.id]?.read).length

  return (
    <main className="screen">
      <PageHead title="Belajar" lead="Urutan di bawah ini disarankan, tapi boleh dibuka yang mana saja." />

      <section className="card progress-card" aria-label="Kemajuan belajar">
        <p>{readCount} dari {MODULES.length} materi sudah dibaca</p>
        <Progress value={readCount} max={MODULES.length} label="Materi yang sudah dibaca" />
      </section>

      <ol className="list-group">
        {MODULES.map((m, i) => {
          const l = state.learn[m.id]
          const meta = [`${m.minutes} menit baca`]
          if (l?.quizDone) meta.push(`kuis benar ${l.quizScore} dari ${m.quiz.length}`)
          return (
            <li key={m.id} className={l?.read ? 'is-read' : undefined}>
              <a href={`#/belajar/${m.id}`} className="list-row">
                <span className="module-num" aria-hidden="true">{l?.read ? <CheckIcon weight="bold" /> : i + 1}</span>
                <span className="row-text">
                  <span className="row-title">{m.title}</span>
                  <span className="row-sub">
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
  const idx = MODULES.findIndex((x) => x.id === id)
  const m = MODULES[idx]
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
        <article className="article narrow">
          <div className="article-head">
            <div className="article-meta">
              <span className="pill lime">Materi {idx + 1} dari {MODULES.length}</span>
              <span className="pill"><ClockIcon weight="bold" aria-hidden="true" /> {m.minutes} menit baca</span>
            </div>
            <h1>{m.title}</h1>
            <SpeakButton text={spoken} />
          </div>
          <div className="card article-body">
            {m.sections.map((s) => (
              <section key={s.heading}>
                <h2>{s.heading}</h2>
                <p>{s.body}</p>
              </section>
            ))}
          </div>
          <p className="draft-note"><InfoIcon weight="bold" aria-hidden="true" style={{ flex: 'none', width: '1.3rem', height: '1.3rem' }} />Materi contoh untuk prototipe. Naskah final dari peneliti dan divalidasi ahli materi.</p>
        </article>
        <div className="btn-row narrow">
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
          <section className="card result-card narrow">
            <IconBadge Icon={TrophyIcon} tone="lime" size="xl" />
            <h1>Kuis selesai</h1>
            <p className="score" aria-label={`Benar ${score} dari ${m.quiz.length} pertanyaan`}>{score}<small> / {m.quiz.length}</small></p>
            <p className="lead">{score === m.quiz.length ? 'Semua jawaban benar.' : 'Materinya bisa dibaca lagi kapan saja.'}</p>
          </section>
          <div className="btn-row narrow">
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
        <div className="quiz-progress narrow">
          <p className="progress-text">Pertanyaan {i + 1} dari {m.quiz.length}</p>
          <Progress value={i + (checked ? 1 : 0)} max={m.quiz.length} label="Kemajuan kuis" />
        </div>
        <div className="form-cards narrow stack" style={{ gap: '1.25rem' }}>
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
        </div>
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
