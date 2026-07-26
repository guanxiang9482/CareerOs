import { useState } from 'react'
import { AppProvider, useAppContext } from './data/AppContext'
import { LandingSurface, type RoleKey } from './pages/LandingSurface'
import { CandidateView } from './views/CandidateView/CandidateView'
import { EmployerView } from './views/EmployerView'
import { UniversityView } from './views/UniversityView'
import { Haven, type ViewKey } from './components/Haven'
import { RegistrationView } from './views/RegistrationView'
import { LoginPage } from './views/LoginPage'
import { EmployerSignupView } from './views/EmployerSignupView'
import { StorageDebugPanel } from './components/StorageDebugPanel'
import type { RegisteredUser } from './data/appState'

export type AppView = 'LANDING' | 'ROLE_SELECTION' | 'CANDIDATE' | 'EMPLOYER' | 'UNIVERSITY' | 'LOG IN' | 'GET STARTED' | 'EMPLOYER_SIGNUP'

const NAV_ITEMS: { view: AppView; label: string }[] = [
  { view: 'LANDING', label: 'CareerOS' },
  { view: 'CANDIDATE', label: 'Candidate' },
  { view: 'EMPLOYER', label: 'Employer' },
  { view: 'UNIVERSITY', label: 'University' },
  { view: 'LOG IN', label: 'Log In' },
  { view: 'GET STARTED', label: 'Get Started'}
]

const PROTECTED_VIEWS: AppView[] = ['CANDIDATE', 'EMPLOYER', 'UNIVERSITY']

function viewToRole(view: AppView): RegisteredUser['role'] | null {
  if (view === 'CANDIDATE') return 'candidate'
  if (view === 'EMPLOYER') return 'employer'
  if (view === 'UNIVERSITY') return 'university'
  return null
}

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
  const { isLoggedIn, currentUserRole, logoutUser } = useAppContext()

  function navigateTo(target: AppView) {
    const requiredRole = viewToRole(target)
    if (requiredRole) {
      if (!isLoggedIn || currentUserRole !== requiredRole) {
        setView('LOG IN')
        return
      }
    }
    setView(target)
  }

  function handleSelectRole(role: RoleKey) {
    navigateTo(roleToView(role))
  }

  function handleSwitchRole() {
    logoutUser()
    setView('LANDING')
  }

  return (
    <div className="min-h-screen bg-[#FDFBF9] font-sans text-[#0B1E33]">
      <JudgeAcceleratorBanner currentView={view} onNavigate={navigateTo} />

      {view === 'LANDING' && (
        <LandingSurface 
          stage="LANDING" 
          onExplore={() => setView('GET STARTED')} 
          onEmployerSignup={() => setView('EMPLOYER_SIGNUP')}
          onSelectRole={handleSelectRole} 
          onNavigateToHavenChat={() => navigateTo('CANDIDATE')}
        />
      )}

      {view === 'ROLE_SELECTION' && (
        <LandingSurface 
          stage="ROLE_SELECTION" 
          onExplore={() => setView('ROLE_SELECTION')} 
          onEmployerSignup={() => setView('EMPLOYER_SIGNUP')}
          onSelectRole={handleSelectRole} 
          onNavigateToHavenChat={() => navigateTo('CANDIDATE')}
        />
      )}

      {view === 'CANDIDATE' && isLoggedIn && currentUserRole === 'candidate' && (
        <CandidateView onSwitchRole={handleSwitchRole} />
      )}
      {view === 'EMPLOYER' && isLoggedIn && currentUserRole === 'employer' && (
        <EmployerView onSwitchRole={handleSwitchRole} />
      )}
      {view === 'UNIVERSITY' && isLoggedIn && currentUserRole === 'university' && (
        <UniversityView onSwitchRole={handleSwitchRole} />
      )}

      {PROTECTED_VIEWS.includes(view) && (!isLoggedIn || currentUserRole !== viewToRole(view)) && (
        <div className="mx-auto max-w-lg px-6 py-24 text-center">
          <h2 className="text-xl font-bold text-[#0B1E33]">Log in to continue</h2>
          <p className="mt-2 text-sm text-[#6B5A44]">
            Register an account first, then sign in with your email and password to open this workspace.
          </p>
          <button
            type="button"
            onClick={() => setView('LOG IN')}
            className="mt-6 rounded-full bg-[#0B1E33] px-6 py-3 text-sm font-semibold text-white hover:bg-[#132A47]"
          >
            Go to Log In
          </button>
        </div>
      )}

      {view === 'GET STARTED' && (
        <RegistrationView onComplete={() => navigateTo('CANDIDATE')} />
      )}

      {view === 'LOG IN' && (
        <LoginPage
          onLoginSuccess={(targetView) => {
            navigateTo(targetView)
          }}
        />
      )}

      {view === 'EMPLOYER_SIGNUP' && (
        <EmployerSignupView onComplete={() => navigateTo('EMPLOYER')} />
      )}

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
  const coreNavItems = NAV_ITEMS.filter((item) => item.view !== 'LOG IN' && item.view !== 'GET STARTED')
  return (
    <div className="sticky top-0 z-[60] border-b border-[#EBE7E0] bg-[#0B1E33] text-white">
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 overflow-x-auto px-32 py-4"> 

        <div className="flex shrink-0 items-center gap-1.5">
          {coreNavItems.map((item) => {
            const isActive =
              currentView === item.view ||
              (item.view === 'LANDING' && currentView === 'ROLE_SELECTION')
            return (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-[#9A7B56] text-white' : 'text-[#D8CFC0] hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-4 pl-4">
          <StorageDebugPanel />

          <button onClick={() => onNavigate('LOG IN')}
            className={`text-sm font-medium transition-colors cursor-pointer ${
              currentView === 'LOG IN'
                ? 'text-[#9A7B56] font-semibold underline underline-offset-4'
                : 'text-[#D8CFC0] hover:text-white'
            }`}>
            Log In
          </button>

          <button
            onClick={() => onNavigate('GET STARTED')}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all cursor-pointer shadow-xs ${
              currentView === 'GET STARTED'
                ? 'bg-[#9A7B56] text-white border border-[#9A7B56]'
                : 'bg-white text-[#0B1E33] hover:bg-[#FAF8F5] active:scale-98'
            }`}
          >
            Get Started
          </button>

        </div>

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
