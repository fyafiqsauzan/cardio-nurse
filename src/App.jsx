import { useStore } from './store.jsx'
import { useRoute } from './router.js'
import { BookOpenTextIcon, HeartbeatIcon, PillIcon } from '@phosphor-icons/react'
import { AppHeader, BottomNav, Brand, IconBadge, SideNav } from './components.jsx'
import { Consent, Login, Intro, Assessment } from './screens/Onboarding.jsx'
import Home from './screens/Home.jsx'
import { LearnList, ModulePage, QuizPage } from './screens/Learn.jsx'
import { LogHome, LogForm, LogResult } from './screens/Log.jsx'
import { Meds, Help, Settings } from './screens/Other.jsx'

function resolve(path) {
  const parts = path.split('/').filter(Boolean)
  const [a, b, c] = parts
  if (!a) return { el: <Home />, tab: true }
  if (a === 'belajar' && !b) return { el: <LearnList />, tab: true }
  if (a === 'belajar' && b && c === 'kuis') return { el: <QuizPage id={b} key={b} />, tab: false }
  if (a === 'belajar' && b) return { el: <ModulePage id={b} />, tab: false }
  if (a === 'catatan' && !b) return { el: <LogHome />, tab: true }
  if (a === 'catatan' && b === 'isi') return { el: <LogForm />, tab: false }
  if (a === 'catatan' && b === 'hasil') return { el: <LogResult />, tab: false }
  if (a === 'bantuan') return { el: <Help />, tab: true }
  if (a === 'obat') return { el: <Meds />, tab: false }
  if (a === 'pengaturan') return { el: <Settings />, tab: false }
  return { el: <Home />, tab: true }
}

export default function App() {
  const { state } = useStore()
  const path = useRoute()

  let content
  if (!state.consent) content = <Consent />
  else if (!state.session) content = <Login />
  else if (!state.introDone) content = <Intro />
  else if (!state.profile) content = <Assessment />

  if (content) {
    return (
      <div className="app onboard">
        <OnboardBrand />
        <div className="onboard-main">
          <div className="app-main">{content}</div>
        </div>
      </div>
    )
  }

  const { el, tab } = resolve(path)
  return (
    <div className={`app shell${tab ? ' with-nav' : ''}`}>
      <SideNav path={path} />
      <div className="app-main">
        {tab && <AppHeader />}
        {el}
      </div>
      {tab && <BottomNav path={path} />}
    </div>
  )
}

/* Panel merek di kiri layar persetujuan & masuk (hanya di layar lebar). */
function OnboardBrand() {
  return (
    <aside className="onboard-brand">
      <Brand />
      <div className="onboard-art" aria-hidden="true">
        <IconBadge Icon={HeartbeatIcon} className="a1" />
        <IconBadge Icon={PillIcon} className="a2" />
        <IconBadge Icon={BookOpenTextIcon} className="a3" />
      </div>
      <div className="stack">
        <h2>Teman perawatan jantung di rumah</h2>
        <p>Belajar, mencatat, dan minum obat tepat waktu, dengan huruf besar dan tombol yang mudah ditekan.</p>
      </div>
    </aside>
  )
}
