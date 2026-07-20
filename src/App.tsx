import { useState } from 'react'
import { AppProvider, useAppContext } from './data/AppContext'
import { LandingSurface, type RoleKey } from './pages/LandingSurface'
import { CandidateView } from './views/CandidateView'
import { EmployerView } from './views/EmployerView'
import { UniversityView } from './views/UniversityView'
import { Haven, type ViewKey } from './components/Haven'

export type AppView = 'LANDING' | 'ROLE_SELECTION' | 'CANDIDATE' | 'EMPLOYER' | 'UNIVERSITY'

const NAV_ITEMS: { view: AppView; label: string }[] = [
  { view: 'LANDING', label: 'CareerOS' },
  { view: 'CANDIDATE', label: 'Candidate' },
  { view: 'EMPLOYER', label: 'Employer' },
  { view: 'UNIVERSITY', label: 'University' },
]

function roleToView(role: RoleKey): AppView {
  if (role === 'candidate') return 'CANDIDATE'
  if (role === 'employer') return 'EMPLOYER'
  return 'UNIVERSITY'
}

function havenView(view: AppView): ViewKey | null {
  if (view === 'CANDIDATE') return 'candidate'
  if (view === 'EMPLOYER') return 'employer'
  if (view === 'UNIVERSITY') return 'university'
  return null
}

function AppShell() {
  const [view, setView] = useState<AppView>('LANDING')
  const { setAuthedName } = useAppContext()

  function handleSelectRole(role: RoleKey) {
    const personaNames: Record<RoleKey, string> = {
      candidate: 'Aisyah Yusof',
      employer: 'CIMB Group',
      university: 'Universiti Malaya',
    }
    setAuthedName(personaNames[role])
    setView(roleToView(role))
  }

  function handleSwitchRole() {
    setAuthedName(null)
    setView('LANDING')
  }

  function handleAcceleratorNav(target: AppView) {
    if (target === 'CANDIDATE') setAuthedName('Aisyah Yusof')
    else if (target === 'EMPLOYER') setAuthedName('CIMB Group')
    else if (target === 'UNIVERSITY') setAuthedName('Universiti Malaya')
    else setAuthedName(null)
    setView(target)
  }

  return (
    <div className="min-h-screen bg-[#FDFBF9] font-sans text-[#0B1E33]">
      <JudgeAcceleratorBanner currentView={view} onNavigate={handleAcceleratorNav} />

      {view === 'LANDING' && (
        <LandingSurface stage="LANDING" onExplore={() => setView('ROLE_SELECTION')} onSelectRole={handleSelectRole} />
      )}

      {view === 'ROLE_SELECTION' && (
        <LandingSurface stage="ROLE_SELECTION" onExplore={() => setView('ROLE_SELECTION')} onSelectRole={handleSelectRole} />
      )}

      {view === 'CANDIDATE' && <CandidateView onSwitchRole={handleSwitchRole} />}
      {view === 'EMPLOYER' && <EmployerView onSwitchRole={handleSwitchRole} />}
      {view === 'UNIVERSITY' && <UniversityView onSwitchRole={handleSwitchRole} />}

      <Haven view={havenView(view)} />
    </div>
  )
}

function JudgeAcceleratorBanner({
  currentView,
  onNavigate,
}: {
  currentView: AppView
  onNavigate: (view: AppView) => void
}) {
  return (
    <div className="sticky top-0 z-[60] border-b border-[#EBE7E0] bg-[#0B1E33] text-white">
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 overflow-x-auto px-6 py-2">
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-[#B5A88F]">
          Judge accelerator
        </span>
        <div className="flex shrink-0 items-center gap-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive =
              currentView === item.view ||
              (item.view === 'LANDING' && currentView === 'ROLE_SELECTION')
            return (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  isActive ? 'bg-[#9A7B56] text-white' : 'text-[#D8CFC0] hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>
        <span className="ml-auto shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-[#B5A88F]">
          One-click bypass &middot; no credentials required
        </span>
      </div>
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}

export default App
