import {
  BookOpenTextIcon,
  CaretRightIcon,
  CheckIcon,
  LifebuoyIcon,
  NotePencilIcon,
  PillIcon,
  PlusIcon,
  ScalesIcon,
} from '@phosphor-icons/react'
import { useStore, dateKey, formatLongDate, greeting, formatKg } from '../store.jsx'
import { MODULES } from '../content.js'
import { IconBadge, Progress } from '../components.jsx'

function TaskRow({ href, done, Icon, title, sub }) {
  return (
    <a href={href} className={`task-row${done ? ' is-done' : ''}`}>
      <IconBadge Icon={done ? CheckIcon : Icon} weight={done ? 'bold' : 'duotone'} />
      <span className="row-text">
        <span className="row-top">
          <span className="row-title">{title}</span>
          <span className={`pill${done ? ' ok' : ''}`}>{done ? 'Sudah' : 'Belum'}</span>
        </span>
        <span className="row-sub">{sub}</span>
      </span>
      <CaretRightIcon weight="bold" className="chev" aria-hidden="true" />
    </a>
  )
}

const MENU = [
  { href: '#/belajar', label: 'Belajar', Icon: BookOpenTextIcon },
  { href: '#/catatan', label: 'Catatan harian', Icon: NotePencilIcon, tone: 'lime' },
  { href: '#/obat', label: 'Jadwal obat', Icon: PillIcon },
  { href: '#/bantuan', label: 'Bantuan', Icon: LifebuoyIcon, tone: 'lime' },
]

export default function Home() {
  const { state } = useStore()
  const today = dateKey()
  const p = state.profile

  const doses = state.meds.flatMap((m) => m.times.map((t) => `${m.id}@${t}`))
  const taken = doses.filter((d) => state.medTaken[today]?.[d]).length
  const medsDone = taken === doses.length
  const logDone = Boolean(state.logs[today])
  const readToday = Object.values(state.learn).some((l) => l.readOn === today)
  const doneCount = [medsDone, logDone, readToday].filter(Boolean).length

  const keys = Object.keys(state.logs).sort()
  const lastKey = keys[keys.length - 1]
  const last = lastKey ? state.logs[lastKey] : null
  const prev = keys.length > 1 ? state.logs[keys[keys.length - 2]] : null
  const diff = last && prev ? Math.round((last.weight - prev.weight) * 10) / 10 : null

  const readCount = MODULES.filter((m) => state.learn[m.id]?.read).length
  const nextModule = MODULES.find((m) => !state.learn[m.id]?.read) || MODULES[0]
  const allRead = readCount === MODULES.length

  return (
    <main className="screen">
      <section className="hello">
        <span className="avatar" aria-hidden="true">{p.name.charAt(0).toUpperCase()}</span>
        <div>
          <p className="hello-greet">{greeting()},</p>
          <h1>{p.salutation} {p.name}</h1>
          <p className="muted">{formatLongDate(today)}</p>
        </div>
      </section>

      <div className="home-grid">
        <div className="home-col">
          <section className="card today-card" aria-labelledby="kartu-title">
            <div className="today-head">
              <div className="card-head">
                <h2 id="kartu-title">Kartu hari ini</h2>
                <p>{doneCount} dari 3 sudah</p>
              </div>
              <Progress value={doneCount} max={3} label="Kemajuan kartu hari ini" />
            </div>
            <TaskRow href="#/obat" done={medsDone} Icon={PillIcon} title="Minum obat" sub={`${taken} dari ${doses.length} kali minum`} />
            <TaskRow href="#/catatan/isi" done={logDone} Icon={ScalesIcon} title="Timbang dan isi catatan" sub="Berat badan dan keluhan" />
            <TaskRow href={`#/belajar/${nextModule.id}`} done={readToday} Icon={BookOpenTextIcon} title="Baca satu materi" sub={readToday ? 'Sudah membaca hari ini' : nextModule.title} />
          </section>

          <section className="stack" aria-labelledby="menu-title">
            <h2 id="menu-title" className="group-label">Menu</h2>
            <div className="menu-grid">
              {MENU.map(({ href, label, Icon, tone }) => (
                <a key={href} href={href} className="menu-item">
                  <IconBadge Icon={Icon} tone={tone} size="lg" />
                  {label}
                </a>
              ))}
            </div>
          </section>
        </div>

        <div className="home-col">
          <div className="stat-grid">
            <a href={last ? '#/catatan' : '#/catatan/isi'} className="stat-card">
              <IconBadge Icon={ScalesIcon} tone="lime" />
              <span className="stat-label">Berat badan terakhir</span>
              {last ? (
                <>
                  <span className="stat-value">{formatKg(last.weight)}</span>
                  <span className="stat-sub">
                    {lastKey === today ? 'Dicatat hari ini' : `Dicatat ${formatLongDate(lastKey)}`}
                    {diff !== null && (diff === 0 ? ', sama dengan sebelumnya.' : `, ${diff > 0 ? 'naik' : 'turun'} ${formatKg(Math.abs(diff))}.`)}
                  </span>
                  <span className="action-link">Lihat <span className="nowrap">riwayat<CaretRightIcon weight="bold" aria-hidden="true" /></span></span>
                </>
              ) : (
                <>
                  <span className="stat-sub">Belum ada catatan berat badan.</span>
                  <span className="action-link"><PlusIcon weight="bold" aria-hidden="true" /> Isi catatan</span>
                </>
              )}
            </a>
            <a href="#/belajar" className="stat-card">
              <IconBadge Icon={BookOpenTextIcon} />
              <span className="stat-label">Materi dibaca</span>
              <span className="stat-value">{readCount} <small>dari {MODULES.length}</small></span>
              <Progress value={readCount} max={MODULES.length} label="Materi yang sudah dibaca" />
              <span className="action-link">Daftar <span className="nowrap">materi<CaretRightIcon weight="bold" aria-hidden="true" /></span></span>
            </a>
          </div>

          <a href={allRead ? '#/belajar' : `#/belajar/${nextModule.id}`} className="banner">
            <span className="row-text">
              <span className="banner-label">{allRead ? 'Semua materi sudah dibaca' : 'Lanjutkan belajar'}</span>
              <span className="banner-title">{allRead ? 'Ulangi materi' : nextModule.title}</span>
            </span>
            <IconBadge Icon={BookOpenTextIcon} size="lg" />
          </a>
        </div>
      </div>
    </main>
  )
}
