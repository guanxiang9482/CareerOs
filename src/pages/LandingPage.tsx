import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../data/AppContext'
import { DEMO_CANDIDATE } from '../data/mockData'

type RoleKey = 'candidate' | 'employer' | 'university'

const ROLE_META: Record<RoleKey, { title: string; blurb: string; persona: string; route: string }> = {
  candidate: {
    title: 'Candidate',
    blurb: 'Track applications, discover matched roles, and see exactly what fair pay looks like for you.',
    persona: DEMO_CANDIDATE.name,
    route: '/candidate',
  },
  employer: {
    title: 'Employer',
    blurb: 'Run your hiring funnel, spot strong matches early, and keep pipeline health visible at a glance.',
    persona: 'CIMB Group',
    route: '/employer',
  },
  university: {
    title: 'University',
    blurb: 'Monitor graduate outcomes, benchmark faculties, and catch at-risk students before it is too late.',
    persona: 'Universiti Malaya',
    route: '/university',
  },
}

export function LandingPage() {
  const [activeRole, setActiveRole] = useState<RoleKey | null>(null)
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { setAuthedName } = useAppContext()

  function openAuth(role: RoleKey) {
    setActiveRole(role)
    setPasscode('')
    setError('')
  }

  function closeAuth() {
    setActiveRole(null)
  }

  function handleAuth() {
    if (passcode.trim().length === 0) {
      setError('Enter any passcode to continue — this is a simulated login for judging.')
      return
    }
    if (!activeRole) return
    setAuthedName(ROLE_META[activeRole].persona)
    navigate(ROLE_META[activeRole].route)
  }

  return (
    <div className="min-h-screen bg-[#FDFBF9] font-sans text-[#0B1E33]">
      <header className="sticky top-0 z-40 bg-[#FDFBF9]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B1E33] font-mono text-xs font-bold text-white">OS</div>
            <span className="text-sm font-semibold tracking-tight">Career OS</span>
          </div>
          <a href="#roles" className="rounded-full bg-[#0B1E33] px-5 py-2 text-xs font-semibold text-white hover:bg-[#132A47]">
            Enter platform
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-[1000px] px-6 pt-20 pb-24 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#9A7B56]">Talentbank Tech Hackathon 2026</p>
        <h1 className="mt-4 text-5xl font-semibold leading-tight tracking-tight">
          A unified career <span className="font-serif italic font-normal">operating system</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-[#6B5A44]">
          Career OS connects candidates, employers, and universities on one platform —
          transparent pay, verified portfolios, and live outcome tracking, all in one place.
        </p>
        <a
          href="#roles"
          className="mt-8 inline-block rounded-full bg-[#0B1E33] px-7 py-3 text-sm font-semibold text-white hover:bg-[#132A47]"
        >
          Explore the platform
        </a>
      </section>

      <section className="mx-auto max-w-[1100px] px-6 py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <FeatureCard
            eyebrow="For candidates"
            title="Fair Pay Engine"
            body="See your real disposable income before you accept — not just a gross salary number."
          />
          <FeatureCard
            eyebrow="For employers"
            title="Live pipeline health"
            body="Track applied-to-hired conversion and surface your strongest matches instantly."
          />
          <FeatureCard
            eyebrow="For universities"
            title="At-risk detection"
            body="Spot graduating students with zero active applications before it becomes a crisis."
          />
        </div>
      </section>

      <section id="roles" className="mx-auto max-w-[1100px] px-6 py-20">
        <div className="mb-10 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#9A7B56]">Judge access</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Choose a role to <span className="font-serif italic font-normal">enter</span>
          </h2>
          <p className="mt-2 text-sm text-[#6B5A44]">Each view opens its own dedicated, scrollable workspace.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {(Object.keys(ROLE_META) as RoleKey[]).map((role) => (
            <button key={role} onClick={() => openAuth(role)} className="text-left">
              <div className="h-full rounded-xl border border-[#EBE7E0] bg-white p-7 shadow-sm transition-shadow hover:shadow-md">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#9A7B56]">{ROLE_META[role].title} View</p>
                <p className="mt-2 text-lg font-semibold">{ROLE_META[role].persona}</p>
                <p className="mt-2 text-sm text-[#6B5A44]">{ROLE_META[role].blurb}</p>
                <p className="mt-5 text-xs font-semibold text-[#0B1E33]">Sign in as {ROLE_META[role].title} &rarr;</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#EBE7E0] py-10 text-center text-xs text-[#9A7B56]">
        Career OS &middot; Talentbank Tech Hackathon 2026 &middot; Prototype for judging only
      </footer>

      {activeRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1E33]/40 px-4">
          <div className="w-full max-w-sm rounded-xl border border-[#EBE7E0] bg-white p-7 shadow-xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#9A7B56]">{ROLE_META[activeRole].title} sign in</p>
            <p className="mt-1.5 text-lg font-semibold text-[#0B1E33]">{ROLE_META[activeRole].persona}</p>
            <p className="mt-3 text-sm text-[#6B5A44]">
              Enter any passcode to continue. This is a simulated one-click login for judging — no real credentials required.
            </p>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Passcode"
              className="mt-4 w-full rounded-lg border border-[#EBE7E0] bg-[#FDFBF9] px-4 py-2.5 text-sm text-[#0B1E33] outline-none focus:border-[#0B1E33]"
            />
            {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
            <div className="mt-5 flex gap-3">
              <button
                onClick={closeAuth}
                className="flex-1 rounded-full border border-[#EBE7E0] py-2.5 text-xs font-semibold text-[#6B5A44] hover:bg-[#F6F3EE]"
              >
                Cancel
              </button>
              <button
                onClick={handleAuth}
                className="flex-1 rounded-full bg-[#0B1E33] py-2.5 text-xs font-semibold text-white hover:bg-[#132A47]"
              >
                Enter dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FeatureCard({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-[#EBE7E0] bg-white p-6 shadow-sm">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#9A7B56]">{eyebrow}</p>
      <p className="mt-2 text-base font-semibold text-[#0B1E33]">{title}</p>
      <p className="mt-2 text-sm text-[#6B5A44]">{body}</p>
    </div>
  )
}
