import { useState } from 'react'
import { DEMO_CANDIDATE } from '../data/mockData'
import { Eyebrow } from '../components/ui'

export type RoleKey = 'candidate' | 'employer' | 'university'

const ROLE_META: Record<RoleKey, { title: string; blurb: string; persona: string; sub: string }> = {
  candidate: {
    title: 'Candidate',
    blurb: 'Track applications, discover matched roles, and see exactly what fair pay looks like for you.',
    persona: DEMO_CANDIDATE.name,
    sub: `${DEMO_CANDIDATE.university} · Class of ${DEMO_CANDIDATE.gradYear}`,
  },
  employer: {
    title: 'Employer',
    blurb: 'Run your hiring funnel, spot strong matches early, and keep pipeline health visible at a glance.',
    persona: 'CIMB Group',
    sub: 'Talent Acquisition Team',
  },
  university: {
    title: 'University',
    blurb: 'Monitor graduate outcomes, benchmark faculties, and catch at-risk students before it is too late.',
    persona: 'Universiti Malaya',
    sub: 'Career & Placement Office',
  },
}

// Data structures from the actual reference build interface
const FEATURED_COMPANIES = [
  { name: 'CIMB', industry: 'Banking', location: 'Kuala Lumpur', roles: 19, icon: 'C' },
  { name: 'HSBC', industry: 'Banking', location: 'Kuala Lumpur', roles: 18, icon: 'H' },
  { name: 'Unilever', industry: 'FMCG', location: 'Petaling Jaya', roles: 13, icon: 'U' },
  { name: 'Intel', industry: 'Semiconductor', location: 'Penang', roles: 31, icon: 'I' },
  { name: 'Shell', industry: 'Energy', location: 'Cyberjaya', roles: 24, icon: 'S' },
  { name: 'Grab', industry: 'Technology', location: 'Singapore', roles: 21, icon: 'G' },
  { name: 'Microsoft', industry: 'Technology', location: 'Kuala Lumpur', roles: 16, icon: 'M' },
  { name: 'Dell', industry: 'Technology', location: 'Cyberjaya', roles: 15, icon: 'D' },
]

const MARKET_LADDER = [
  { tier: 'JUNIOR 0–2 YRS', role: 'Marketing Executive', pay: 'RM 2,800–4,000', change: '+9%' },
  { tier: 'MID 3–4 YRS', role: 'Account / Brand Manager', pay: 'RM 4,800–7,500', change: '+17%' },
  { tier: 'SENIOR 5–7 YRS', role: 'Marketing / Sales Manager', pay: 'RM 8,500–13,000', change: '+24%' },
  { tier: 'LEAD 8–10 YRS', role: 'Head of Growth', pay: 'RM 14,000–20,000', change: '+28%' },
  { tier: 'DIRECTOR 10+ YRS', role: 'Marketing Director / CMO', pay: 'RM 22,000–35,000', change: '+13%' },
]

interface LandingSurfaceProps {
  onExplore: () => void
  onSelectRole: (role: RoleKey) => void
  stage: 'LANDING' | 'ROLE_SELECTION'
}

export function LandingSurface({ onExplore, onSelectRole, stage }: LandingSurfaceProps) {
  const [activeRole, setActiveRole] = useState<RoleKey | null>(null)
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')

  function openAuth(role: RoleKey) {
    setActiveRole(role)
    setPasscode('')
    setError('')
  }

  function handleAuth() {
    if (passcode.trim().length === 0) {
      setError('Enter any passcode to continue — this is a simulated login for judging.')
      return
    }
    if (!activeRole) return
    onSelectRole(activeRole)
  }

  if (stage === 'ROLE_SELECTION') {
    return (
      <div className="mx-auto min-h-[calc(100vh-56px)] max-w-[1100px] px-6 py-24">
        <div className="mb-12 text-center">
          <Eyebrow>Judge access</Eyebrow>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Choose a role to <span className="font-serif italic font-normal text-[#9A7B56]">enter</span>
          </h2>
          <p className="mt-2 text-sm text-[#6B5A44]">Each view opens its own dedicated, scrollable workspace.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {(Object.keys(ROLE_META) as RoleKey[]).map((role) => (
            <button key={role} onClick={() => openAuth(role)} className="text-left cursor-pointer group">
              <div className="h-full rounded-xl border border-[#EBE7E0] bg-white p-7 shadow-xs transition-all hover:border-[#9A7B56] hover:shadow-md">
                <Eyebrow>{ROLE_META[role].title} View</Eyebrow>
                <p className="mt-2 text-lg font-semibold text-[#0B1E33]">{ROLE_META[role].persona}</p>
                <p className="mt-1 text-xs text-[#9A7B56]">{ROLE_META[role].sub}</p>
                <p className="mt-3 text-sm text-[#6B5A44]">{ROLE_META[role].blurb}</p>
                <p className="mt-5 text-xs font-semibold text-[#0B1E33] group-hover:text-[#9A7B56] transition-colors">
                  Sign in as {ROLE_META[role].title} &rarr;
                </p>
              </div>
            </button>
          ))}
        </div>

        {activeRole && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1E33]/40 px-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-xl border border-[#EBE7E0] bg-white p-7 shadow-xl">
              <Eyebrow>{ROLE_META[activeRole].title} sign in</Eyebrow>
              <p className="mt-1.5 text-lg font-semibold text-[#0B1E33]">{ROLE_META[activeRole].persona}</p>
              <p className="mt-3 text-sm text-[#6B5A44]">
                Enter any passcode to continue. This is a simulated one-click login for judging.
              </p>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Passcode"
                className="mt-4 w-full rounded-lg border border-[#EBE7E0] bg-[#FDFBF9] px-4 py-2.5 text-sm text-[#0B1E33] outline-none focus:border-[#9A7B56]"
              />
              {error && <p className="mt-2 text-xs text-rose-600 font-mono">{error}</p>}
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setActiveRole(null)}
                  className="flex-1 rounded-full border border-[#EBE7E0] py-2.5 text-xs font-semibold text-[#6B5A44] hover:bg-[#F6F3EE] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAuth}
                  className="flex-1 rounded-full bg-[#0B1E33] py-2.5 text-xs font-semibold text-white hover:bg-[#132A47] cursor-pointer"
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

  return (
    <div className="bg-[#FDFBF9]">
      <style>{`
        @keyframes tickerMove {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker { animation: tickerMove 25s linear infinite; }
      `}</style>

      {/* 1. HERO SECTION */}
      <section className="mx-auto max-w-[1200px] px-6 pt-24 pb-20 text-center">
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#9A7B56]">
          Asia's Lifelong Career Platform
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl font-sans text-5xl font-bold tracking-tight text-[#0B1E33] sm:text-6xl md:text-7xl">
          Where the world's <br />
          <span className="font-serif italic font-normal text-[#9A7B56]">most admired companies</span> hire.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-[#6B5A44]">
          From Citi to Petronas to Nestlé, your next move starts at 900+ of the most admired companies, guided by AI.
        </p>

        {/* Search Mock Widget */}
        <div className="mx-auto mt-10 flex max-w-2xl items-center rounded-full border border-[#EBE7E0] bg-white p-1.5 shadow-sm focus-within:border-[#9A7B56]">
          <span className="pl-4 text-xs font-mono text-[#9A7B56]">✦</span>
          <input
            type="text"
            readOnly
            placeholder='Try "graduate tech jobs above RM 4k"'
            className="w-full bg-transparent px-3 text-sm text-[#0B1E33] outline-none placeholder-[#0B1E33]/40 cursor-default"
          />
          <button onClick={onExplore} className="rounded-full bg-[#0B1E33] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#132A47] cursor-pointer">
            Search
          </button>
        </div>
        <p className="mt-3 text-[11px] font-mono text-[#9A7B56]/70">Trusted by candidates across Asia Pacific and beyond</p>

        {/* Counter Stats Container */}
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-6 border-t border-[#EBE7E0] pt-10">
          {[
            { value: '900+', label: 'Leading companies' },
            { value: '27,880+', label: 'Live roles' },
            { value: '52', label: 'Sectors' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-mono text-3xl font-bold tracking-tight text-[#0B1E33] sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-[10px] font-mono uppercase tracking-widest text-[#9A7B56]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. INFINITE LOGO WALL */}
      <section className="border-y border-[#EBE7E0] bg-white py-8 overflow-hidden relative">
        <p className="text-center text-[10px] font-mono uppercase tracking-[0.2em] text-[#9A7B56]/80 mb-5">
          Trusted by Fortune 500 and the world's largest companies
        </p>
        <div className="flex whitespace-nowrap animate-ticker gap-16 min-w-full">
          {[...Array(3)].flatMap(() => ['Grab', 'Emirates', 'PwC', 'BMW', 'Petronas', 'Citi', 'Nestlé', 'Intel']).map((brand, i) => (
            <span key={i} className="text-lg font-serif tracking-widest font-bold text-[#0B1E33]/30 uppercase select-none">
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="mx-auto max-w-[1100px] px-6 py-20">
        <div className="text-center mb-14">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#9A7B56]">How It Works</span>
          <h2 className="text-3xl font-bold tracking-tight text-[#0B1E33] mt-2">
            We hold your hand, <span className="font-serif italic font-normal text-[#9A7B56]">every step.</span>
          </h2>
          <p className="text-xs text-[#6B5A44] mt-1">Three simple steps. No guesswork, no getting lost — Haven does the heavy lifting.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { num: '1', title: 'We set you up in minutes', desc: 'Answer a few easy questions and your profile builds itself. No long forms, no CV stress.' },
            { num: '2', title: 'AI finds your matches', desc: 'Haven scans every role at 900+ companies and surfaces the ones that genuinely fit, with reasons why.' },
            { num: '3', title: 'Apply with one tap', desc: 'We pre-fill your application, track every status and nudge you at the right moments.' },
          ].map((step) => (
            <div key={step.num} className="relative p-6 rounded-xl border border-[#EBE7E0] bg-white">
              <span className="absolute top-4 right-6 font-serif text-5xl font-light text-[#9A7B56]/20">{step.num}</span>
              <h3 className="text-base font-semibold text-[#0B1E33] mt-4">{step.title}</h3>
              <p className="text-xs text-[#6B5A44] mt-2 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED COMPANIES MATRIX */}
      <section className="bg-[#F9F7F3] border-y border-[#EBE7E0] py-20">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#9A7B56]">Featured Companies</span>
              <h2 className="text-3xl font-bold tracking-tight text-[#0B1E33] mt-1">
                The most admired companies, <span className="font-serif italic font-normal text-[#9A7B56]">all in one place.</span>
              </h2>
            </div>
            <button onClick={onExplore} className="mt-4 sm:mt-0 text-xs font-semibold text-[#0B1E33] border-b border-[#0B1E33] pb-0.5 hover:text-[#9A7B56] hover:border-[#9A7B56] cursor-pointer">
              Browse all 900+
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURED_COMPANIES.map((comp) => (
              <div key={comp.name} className="bg-white border border-[#EBE7E0] rounded-xl p-5 shadow-2xs hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#0B1E33] text-white font-mono flex items-center justify-center font-bold text-sm">
                    {comp.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0B1E33]">{comp.name}</h4>
                    <p className="text-[11px] text-[#9A7B56]">{comp.industry} · {comp.location}</p>
                  </div>
                </div>
                <div className="border-t border-[#F1EDE5] pt-3 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-700 font-medium font-mono">{comp.roles} roles open</span>
                  <span className="text-[#6B5A44]/60">✦ Picked for you</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. LIVE MARKET INTELLIGENCE MATRIX */}
      <section className="mx-auto max-w-[900px] px-6 py-20">
        <div className="text-center mb-12">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#9A7B56]">Live Market Intelligence</span>
          <h2 className="text-3xl font-bold tracking-tight text-[#0B1E33] mt-1">
            Know what the next rung <span className="font-serif italic font-normal text-[#9A7B56]">actually pays.</span>
          </h2>
          <p className="text-xs text-[#6B5A44] mt-2">Map real climbs based on tracked verification, not guesswork. Sales & Marketing sector template showcase:</p>
        </div>

        <div className="border border-[#EBE7E0] bg-white rounded-xl overflow-hidden shadow-xs">
          <div className="bg-[#0B1E33] text-white px-5 py-3 font-mono text-[10px] uppercase tracking-wider flex justify-between">
            <span>Career Tier Level</span>
            <span>Indicative Base Pay / Mo</span>
          </div>
          <div className="divide-y divide-[#EBE7E0]">
            {MARKET_LADDER.map((row) => (
              <div key={row.tier} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#FDFBF9]">
                <div>
                  <span className="text-[10px] font-mono tracking-wider text-[#9A7B56] block">{row.tier}</span>
                  <span className="text-sm font-bold text-[#0B1E33]">{row.role}</span>
                </div>
                <div className="text-right flex items-center gap-4 justify-between sm:justify-end">
                  <span className="font-mono text-sm font-semibold text-[#0B1E33]">{row.pay}</span>
                  <span className="bg-emerald-50 text-emerald-700 text-[11px] font-mono font-bold px-2 py-0.5 rounded-sm">{row.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PLATFORM ONBOARDING CTAs */}
      <section className="bg-[#0B1E33] text-white py-20 text-center relative overflow-hidden">
        <div className="mx-auto max-w-xl px-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Your whole working life, <br />
            <span className="font-serif italic font-normal text-[#9A7B56]">one platform.</span>
          </h2>
          <p className="text-xs text-[#D8CFC0] max-w-xs mx-auto mt-4 leading-relaxed">
            Career OS grows with you from age 15 to 65. Track trajectory cleanly with data metrics.
          </p>
          <button onClick={onExplore} className="mt-8 rounded-full bg-[#9A7B56] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#866A48] transition-colors cursor-pointer shadow-md">
            Get Started Framework
          </button>
        </div>
      </section>

      <footer className="py-12 text-center text-[11px] font-mono text-[#9A7B56] border-t border-[#EBE7E0]">
        © 2026 Talentbank Career OS · Architectural Reference Demo Platform
      </footer>
    </div>
  )
}