import { CaretRightIcon, CheckIcon } from '@phosphor-icons/react'
import { useStore, dateKey, formatLongDate, greeting, formatKg } from '../store.jsx'
import { MODULES } from '../content.js'

function Row({ href, done, title, sub }) {
  return (
    <a href={href} className={`kartu-row${done ? ' is-done' : ''}`}>
      <span className="tick" aria-hidden="true">{done && <CheckIcon weight="bold" />}</span>
      <span className="kartu-row-text">
        <span className="kartu-row-top">
          <span className="kartu-row-title">{title}</span>
          <span className="status-tag">{done ? 'Sudah' : 'Belum'}</span>
        </span>
        <span className="kartu-row-sub">{sub}</span>
      </span>
    </a>
  )
}

export default function Home() {
  const { state } = useStore()
  const today = dateKey()
  const p = state.profile

  const doses = state.meds.flatMap((m) => m.times.map((t) => `${m.id}@${t}`))
  const taken = doses.filter((d) => state.medTaken[today]?.[d]).length
  const logDone = Boolean(state.logs[today])
  const readToday = Object.values(state.learn).some((l) => l.readOn === today)
  const doneCount = [taken === doses.length, logDone, readToday].filter(Boolean).length

  const keys = Object.keys(state.logs).sort()
  const lastKey = keys[keys.length - 1]
  const last = lastKey ? state.logs[lastKey] : null
  const prev = keys.length > 1 ? state.logs[keys[keys.length - 2]] : null
  const diff = last && prev ? Math.round((last.weight - prev.weight) * 10) / 10 : null

  const nextModule = MODULES.find((m) => !state.learn[m.id]?.read) || MODULES[0]
  const allRead = MODULES.every((m) => state.learn[m.id]?.read)

  return (
    <main className="screen">
      <div className="stack" style={{ gap: '0.25rem' }}>
        <h1>{greeting()}, {p.salutation} {p.name}</h1>
        <p className="lead">{formatLongDate(today)}</p>
      </div>

      <section className="kartu" aria-labelledby="kartu-title">
        <div className="kartu-head">
          <h2 id="kartu-title">Kartu hari ini</h2>
          <p>{doneCount} dari 3 sudah</p>
        </div>
        <Row href="#/obat" done={taken === doses.length} title="Minum obat" sub={`${taken} dari ${doses.length} kali minum`} />
        <Row href="#/catatan/isi" done={logDone} title="Timbang dan isi catatan" sub="Berat badan dan keluhan" />
        <Row href={`#/belajar/${nextModule.id}`} done={readToday} title="Baca satu materi" sub={readToday ? 'Sudah membaca hari ini' : nextModule.title} />
      </section>

      {last && (
        <a href="#/catatan" className="weight-strip">
          <span className="w-label">Berat badan terakhir</span>
          <CaretRightIcon weight="bold" className="chev" aria-hidden="true" />
          <span className="w-value">{formatKg(last.weight)}</span>
          <span className="w-change">
            {lastKey === today ? 'Dicatat hari ini' : `Dicatat ${formatLongDate(lastKey)}`}
            {diff !== null && (diff === 0 ? ', sama dengan catatan sebelumnya.' : `, ${diff > 0 ? 'naik' : 'turun'} ${formatKg(Math.abs(diff))} dari catatan sebelumnya.`)}
          </span>
        </a>
      )}

      <a href={allRead ? '#/belajar' : `#/belajar/${nextModule.id}`} className="next-module">
        <span className="row-text">
          <span className="nm-label">{allRead ? 'Semua materi sudah dibaca' : 'Lanjutkan belajar'}</span>
          <span className="nm-title">{allRead ? 'Ulangi materi' : nextModule.title}</span>
        </span>
        <CaretRightIcon weight="bold" className="chev" aria-hidden="true" />
      </a>
    </main>
  )
}
