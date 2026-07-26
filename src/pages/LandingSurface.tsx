import { useState, useEffect, useMemo } from 'react'
import { DEMO_CANDIDATE, JOBS } from '../data/mockData'
import { Eyebrow } from '../components/ui'
import { useAppContext } from '../data/AppContext'

export type RoleKey = 'candidate' | 'employer' | 'university'

export const ROLE_META: Record<RoleKey, { title: string; blurb: string; persona: string; sub: string }> = {
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

const FEATURED_COMPANIES = [
  { name: 'CIMB Group', industry: 'Banking & Finance', location: 'Kuala Lumpur', roles: 19, icon: 'C' },
  { name: 'HSBC', industry: 'Banking & Finance', location: 'Kuala Lumpur', roles: 18, icon: 'H' },
  { name: 'Unilever', industry: 'Retail & FMCG', location: 'Petaling Jaya', roles: 13, icon: 'U' },
  { name: 'Intel', industry: 'Engineering', location: 'Penang', roles: 31, icon: 'I' },
  { name: 'Shell', industry: 'Energy', location: 'Cyberjaya', roles: 24, icon: 'S' },
  { name: 'Grab Malaysia', industry: 'Technology', location: 'Singapore', roles: 21, icon: 'G' },
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

const SPOTLIGHT_COMPANIES = [
  { name: 'JP Morgan', tag: 'BANKING & FINANCE', industry: 'Banking & Finance', location: 'Kuala Lumpur', blurb: 'First-class business, first-class way.', desc: 'Global investment banking operations with renowned analyst fast-tracks and financial engineering at massive scale.', employees: '290k+', hubs: '60+', openRoles: 15, rating: '4.1' },
  { name: 'Google APAC', tag: 'TECHNOLOGY & SYSTEMS', industry: 'Technology', location: 'Singapore', blurb: 'Build for everyone.', desc: 'Pioneering planetary-scale infrastructure software systems, large language model hubs, and cloud infrastructure operations.', employees: '180k+', hubs: '42+', openRoles: 24, rating: '4.8' },
  { name: 'Petronas', tag: 'ENERGY & INFRASTRUCTURE', industry: 'Energy', location: 'Kuala Lumpur', blurb: 'Powering value pipelines for generations.', desc: 'National energy management cluster coordinating process engineering pathways and sustainable energy solutions across Asia.', employees: '50k+', hubs: '14+', openRoles: 32, rating: '4.6' }
]

const FAST_GROWTH_COMPANIES = [
  { name: 'Banyan Retail Asia', tag: 'RETAIL & E-COMMERCE', industry: 'Retail & FMCG', location: 'Penang', blurb: 'High Promotion Velocity Framework.', desc: 'Expanding unified commerce data grids by +45% this fiscal quarter window. Ranked highest for rapid internal trajectory jumps.', employees: '12k+', hubs: '8+', openRoles: 9, rating: '4.7' },
  { name: 'Cempaka Ventures', tag: 'VENTURE TECH LABS', industry: 'Technology', location: 'Remote', blurb: 'Rapid Seniority Progression Track.', desc: 'Investing heavily in direct talent incubation nodes. Offers accelerated pathways into high-autonomy technical lead roles.', employees: '2k+', hubs: '4+', openRoles: 7, rating: '4.9' },
  { name: 'Indah Holdings', tag: 'DIGITAL LOGISTICS', industry: 'Banking & Finance', location: 'Kuching', blurb: 'Structured Early Leadership Tracks.', desc: 'Transforming supply network workflows. Features dedicated rotation modules pushing junior staff into management within 24 months.', employees: '8k+', hubs: '11+', openRoles: 14, rating: '4.5' }
]

interface CompanyProfile {
  name: string
  industry: string
  location: string
  rating: string
  openRoles: number
  icon?: string
  tag?: string
  blurb?: string
  desc?: string
  employees?: string
  hubs?: string
  followers?: string
  partner?: string
}

interface LandingSurfaceProps {
  onExplore: () => void
  onEmployerSignup: () => void
  onSelectRole: (role: RoleKey) => void
  stage: 'LANDING' | 'ROLE_SELECTION'
  onNavigateToHavenChat?: () => void
}

export function LandingSurface({ onExplore, onEmployerSignup, onSelectRole, stage, onNavigateToHavenChat }: LandingSurfaceProps) {
  const { isLoggedIn, applyToJob, hasApplied } = useAppContext()
  const [activeRole, setActiveRole] = useState<RoleKey | null>(null)
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')
  
  const [subView, setSubView] = useState<'HOME' | 'COMPANIES' | 'PROFILE' | 'SEARCH'>('HOME')
  const [selectedCompanyName, setSelectedCompanyName] = useState<string>('')
  
  const [searchQuery, setSearchQuery] = useState('')
  const [heroSearchQuery, setHeroSearchQuery] = useState('')
  const [selectedSector, setSelectedSector] = useState<string>('All sectors')
  const [selectedLocation, setSelectedLocation] = useState<string>('All locations')
  
  const [spotlightIdx, setSpotlightIdx] = useState(0)

  function runHeroSearch() {
    if (!heroSearchQuery.trim()) {
      setSubView('COMPANIES')
      return
    }
    setSubView('SEARCH')
  }

  // Real text-match filtering against role, company, and location, since the
  // placeholder ("graduate tech jobs above RM 4k") implies searching postings,
  // not just opening the company directory unfiltered.
  const heroSearchResults = useMemo(() => {
    const q = heroSearchQuery.trim().toLowerCase()
    if (!q) return []
    return JOBS.filter((j) =>
      j.role.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q) ||
      j.field.toLowerCase().includes(q)
    ).slice(0, 30)
  }, [heroSearchQuery])

  useEffect(() => {
    if (subView !== 'HOME') return
    const interval = setInterval(() => {
      setSpotlightIdx((prev) => (prev + 1) % SPOTLIGHT_COMPANIES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [subView])

  const selectedCompanyProfile = useMemo<CompanyProfile>(() => {
    const featuredNormalized = FEATURED_COMPANIES.map(c => ({
      name: c.name, industry: c.industry, location: c.location, rating: '4.4', openRoles: c.roles, icon: c.icon, followers: '12k', partner: 'Premier Partner'
    }))
    const spotlightNormalized = SPOTLIGHT_COMPANIES.map(c => ({
      name: c.name, industry: c.industry, location: c.location, rating: c.rating, openRoles: c.openRoles, tag: c.tag, blurb: c.blurb, desc: c.desc, employees: c.employees, hubs: c.hubs, followers: '15k', partner: 'Premier Partner'
    }))
    const fastGrowthNormalized = FAST_GROWTH_COMPANIES.map(c => ({
      name: c.name, industry: c.industry, location: c.location, rating: c.rating, openRoles: c.openRoles, tag: c.tag, blurb: c.blurb, desc: c.desc, employees: c.employees, hubs: c.hubs, followers: '10k', partner: 'Verified Employer'
    }))

    const allPools = [...featuredNormalized, ...spotlightNormalized, ...fastGrowthNormalized]
    return allPools.find(c => c.name.toLowerCase() === selectedCompanyName.toLowerCase()) || 
           { name: selectedCompanyName, industry: 'Technology', location: 'Kuala Lumpur', rating: '4.4', openRoles: 4, followers: '5k', partner: 'Verified Employer' }
  }, [selectedCompanyName])

  const companyRoles = useMemo(() => {
    return JOBS.filter(j => j.company.toLowerCase().includes(selectedCompanyName.toLowerCase()) || selectedCompanyName.toLowerCase().includes(j.company.toLowerCase()))
  }, [selectedCompanyName])

  const filteredCompaniesList = useMemo(() => {
    return FEATURED_COMPANIES.filter(c => {
      const matchQuery = c.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchSec = selectedSector === 'All sectors' || c.industry.includes(selectedSector) || selectedSector.includes(c.industry)
      const matchLoc = selectedLocation === 'All locations' || c.location.includes(selectedLocation)
      return matchQuery && matchSec && matchLoc
    })
  }, [searchQuery, selectedSector, selectedLocation])

  function handleAuth() {
    if (passcode.trim().length === 0) {
      setError('Enter any passcode to continue — this is a simulated login for judging.')
      return
    }
    if (!activeRole) return
    onSelectRole(activeRole)
  }

  if (subView === 'SEARCH') {
    return (
      <div className="mx-auto max-w-[1000px] px-6 py-12 bg-[#FDFBF9]">
        <button onClick={() => setSubView('HOME')} className="mb-6 inline-flex items-center gap-2 text-xs font-mono tracking-wider text-[#9A7B56] hover:underline cursor-pointer border-none bg-transparent">
          &larr; Back to interactive homepage interface
        </button>

        <div className="mb-8">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#9A7B56]">Search Results</span>
          <h2 className="text-3xl font-bold text-[#0B1E33] tracking-tight mt-1">"{heroSearchQuery}"</h2>
          <p className="text-xs text-[#6B5A44] mt-1">{heroSearchResults.length} matching roles found.</p>
        </div>

        <div className="rounded-xl border border-[#EBE7E0] bg-white p-4 divide-y divide-[#EBE7E0]">
          {heroSearchResults.map((job) => {
            const applied = hasApplied(job.id)
            return (
              <div key={job.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-[#0B1E33]">{job.role}</h4>
                  <p className="text-xs text-[#6B5A44]">{job.company} &middot; {job.location}</p>
                  <p className="text-[11px] text-[#9A7B56] font-mono mt-0.5">RM {job.salaryMin.toLocaleString()} – {job.salaryMax.toLocaleString()}</p>
                </div>
                {isLoggedIn ? (
                  <button
                    onClick={() => !applied && applyToJob(job.id)}
                    disabled={applied}
                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold border-none cursor-pointer transition-colors ${
                      applied ? 'bg-emerald-50 text-emerald-700 cursor-default' : 'bg-[#0B1E33] text-white hover:bg-[#132A47]'
                    }`}
                  >
                    {applied ? '✓ Applied' : 'Apply'}
                  </button>
                ) : (
                  <span className="shrink-0 text-[11px] font-mono text-[#9A7B56]/70 italic">Log in to apply</span>
                )}
              </div>
            )
          })}
          {heroSearchResults.length === 0 && (
            <div className="py-10 text-center text-xs text-[#6B5A44] italic">
              No roles matched that search — try a role title, company, or location.
            </div>
          )}
        </div>
      </div>
    )
  }

  if (subView === 'PROFILE') {
    return (
      <div className="mx-auto max-w-[1000px] px-6 py-12 bg-[#FDFBF9]">
        <button onClick={() => setSubView('COMPANIES')} className="mb-6 inline-flex items-center gap-2 text-xs font-mono tracking-wider text-[#9A7B56] hover:underline cursor-pointer border-none bg-transparent">
          &larr; Back to employer directory listings
        </button>
        
        <div className="rounded-xl border border-[#EBE7E0] bg-white p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FAF8F5] pb-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#9A7B56]">
                {selectedCompanyProfile.industry} &middot; {selectedCompanyProfile.location}
              </span>
              <h2 className="text-3xl font-bold text-[#0B1E33] tracking-tight mt-1">{selectedCompanyProfile.name}</h2>
              <p className="text-xs text-[#6B5A44] mt-1">★ {selectedCompanyProfile.rating} &middot; Verified Partner Channel</p>
            </div>
            <span className="rounded-full bg-[#0B1E33] text-white font-mono text-[10px] uppercase px-4 py-1.5 font-semibold">
              Premier Partner
            </span>
          </div>

          <h3 className="text-sm font-mono uppercase tracking-wider text-[#9A7B56] mt-8 mb-4">Open Positions Pipeline</h3>
          <div className="divide-y divide-[#EBE7E0] border-t border-b border-[#EBE7E0]">
            {companyRoles.map((job, idx) => {
              const applied = hasApplied(job.id)
              return (
                <div key={job.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-[#0B1E33]">{job.role}</h4>
                    <p className="text-xs text-[#6B5A44]">Compensation Scale: RM {job.salaryMin.toLocaleString()} – {job.salaryMax.toLocaleString()}</p>
                  </div>
                  <div className="text-right flex flex-col sm:items-end gap-1.5">
                    <div className="flex flex-col sm:items-end">
                      <span className="text-xs font-mono font-semibold text-emerald-700">{idx % 2 === 0 ? '2 openings remaining' : '1 opening remaining'}</span>
                      <span className="text-[10px] font-mono text-[#9A7B56] mt-0.5">Submission Deadline: 14 days left</span>
                      <span className={`inline-block mt-1 rounded-md px-2 py-0.5 text-[9px] font-mono font-bold uppercase ${idx === 2 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                        {idx === 2 ? 'Freezing' : 'Still Hiring'}
                      </span>
                    </div>
                    {isLoggedIn ? (
                      <button
                        onClick={() => !applied && applyToJob(job.id)}
                        disabled={applied}
                        className={`rounded-full px-4 py-1.5 text-[11px] font-semibold border-none cursor-pointer transition-colors ${
                          applied ? 'bg-emerald-50 text-emerald-700 cursor-default' : 'bg-[#0B1E33] text-white hover:bg-[#132A47]'
                        }`}
                      >
                        {applied ? '✓ Applied' : 'Apply now'}
                      </button>
                    ) : (
                      <span className="text-[10px] font-mono text-[#9A7B56]/70 italic">Log in to apply</span>
                    )}
                  </div>
                </div>
              )
            })}
            {companyRoles.length === 0 && (
              <div className="py-8 text-center text-xs text-[#6B5A44] italic">
                All active tracks filled. Access Haven Assistant module to query hidden unlisted career matching streams.
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (subView === 'COMPANIES') {
    return (
      <div className="mx-auto max-w-[1200px] px-6 py-12 bg-[#FDFBF9]">
        <button onClick={() => setSubView('HOME')} className="mb-6 inline-flex items-center gap-2 text-xs font-mono tracking-wider text-[#9A7B56] hover:underline cursor-pointer border-none bg-transparent">
          &larr; Back to interactive homepage interface
        </button>

        <div className="mb-8">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#9A7B56]">Browse Employers</span>
          <h2 className="text-3xl font-bold text-[#0B1E33] tracking-tight mt-1">Employers worth knowing.</h2>
          <p className="text-xs text-[#6B5A44] mt-1">Every company here is verified and established — no ghost listings, no spam.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          <div className="space-y-4 rounded-xl border border-[#EBE7E0] bg-white p-5 shadow-2xs">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#9A7B56] mb-1.5">Search Company Name</label>
              <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-lg border border-[#EBE7E0] bg-[#FAF8F5] px-3 py-2 text-xs outline-none focus:border-[#9A7B56] text-[#0B1E33]" />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#9A7B56] mb-1.5">Sector Matrix</label>
              <select value={selectedSector} onChange={(e) => setSelectedSector(e.target.value)} className="w-full rounded-lg border border-[#EBE7E0] bg-[#FAF8F5] px-3 py-2 text-xs outline-none text-[#0B1E33]">
                <option>All sectors</option>
                <option>Banking</option>
                <option>Technology</option>
                <option>Energy</option>
                <option>Engineering</option>
                <option>FMCG</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#9A7B56] mb-1.5">Location Clusters</label>
              <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="w-full rounded-lg border border-[#EBE7E0] bg-[#FAF8F5] px-3 py-2 text-xs outline-none text-[#0B1E33]">
                <option>All locations</option>
                <option>Kuala Lumpur</option>
                <option>Petaling Jaya</option>
                <option>Penang</option>
                <option>Cyberjaya</option>
              </select>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <p className="text-xs font-mono text-[#9A7B56]">{filteredCompaniesList.length} verified employers matching filtered indices</p>
            {filteredCompaniesList.map(comp => (
              <div key={comp.name} className="bg-white border border-[#EBE7E0] rounded-xl p-6 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#0B1E33] text-white font-mono flex items-center justify-center font-bold text-sm shrink-0">
                    {comp.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base font-bold text-[#0B1E33]">{comp.name}</h4>
                      <span className="bg-[#9A7B56]/10 text-[#9A7B56] text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-sm">Graduates' Choice</span>
                    </div>
                    <p className="text-xs text-[#6B5A44] font-medium mt-0.5">{comp.industry} &middot; {comp.location}</p>
                    <p className="text-xs text-emerald-700 mt-1 font-mono font-medium">{comp.roles} live roles open on pipeline</p>
                  </div>
                </div>
                <div className="text-right shrink-0 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 flex sm:flex-col justify-between items-center sm:items-end gap-2">
                  <span className="text-[10px] font-mono text-[#9A7B56]">Verified Signals</span>
                  <button onClick={() => { setSelectedCompanyName(comp.name); setSubView('PROFILE') }} className="rounded-full bg-[#0B1E33] px-5 py-2 text-xs font-semibold text-white hover:bg-[#132A47] cursor-pointer border-none">
                    View profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
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
            <button key={role} onClick={() => { setActiveRole(role); setPasscode(''); setError(''); }} className="text-left cursor-pointer group border-none bg-transparent p-0">
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
              <p className="mt-3 text-sm text-[#6B5A44]">Enter any passcode to continue. This is a simulated one-click login for judging.</p>
              <input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} placeholder="Passcode" className="mt-4 w-full rounded-lg border border-[#EBE7E0] bg-[#FDFBF9] px-4 py-2.5 text-sm text-[#0B1E33] outline-none focus:border-[#9A7B56]" />
              {error && <p className="mt-2 text-xs text-rose-600 font-mono">{error}</p>}
              <div className="mt-5 flex gap-3">
                <button onClick={() => setActiveRole(null)} className="flex-1 rounded-full border border-[#EBE7E0] py-2.5 text-xs font-semibold text-[#6B5A44] hover:bg-[#F6F3EE] cursor-pointer">Cancel</button>
                <button onClick={handleAuth} className="flex-1 rounded-full bg-[#0B1E33] py-2.5 text-xs font-semibold text-white hover:bg-[#132A47] cursor-pointer">Enter dashboard</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  const currentSpotlight = SPOTLIGHT_COMPANIES[spotlightIdx]

  return (
    <div className="bg-[#FDFBF9]">
      <style>{`
        @keyframes tickerMove { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
        .animate-ticker { animation: tickerMove 25s linear infinite; }
      `}</style>

      {/* SECTION 1: HERO MODULE LAYER */}
      <section className="w-full bg-gradient-to-b from-[#FAF6EE] via-[#FAF5EC] to-[#F3EDE2] border-b border-[#EBE7E0]/70 px-6 pt-24 pb-20 text-center">
        <div className="mx-auto max-w-[1200px]">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#9A7B56]">
            Asia's Lifelong Career Platform
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl font-sans text-5xl font-bold tracking-tight text-[#0B1E33] sm:text-6xl md:text-7xl leading-tight">
            Where the world's <br />
            <span className="font-serif italic font-normal text-[#9A7B56]">most admired companies</span> hire.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-[#6B5A44]">
            From Citi to Petronas to Nestlé, your next move starts at 900+ of the most admired companies, guided by AI.
          </p>

          <div className="mx-auto mt-10 flex max-w-2xl items-center rounded-full border border-[#EBE7E0] bg-white p-1.5 shadow-sm focus-within:border-[#9A7B56]">
            <span className="pl-4 text-xs font-mono text-[#9A7B56]">✦</span>
            <input
              type="text"
              value={heroSearchQuery}
              onChange={(e) => setHeroSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') runHeroSearch() }}
              placeholder='Try "Data Analyst" or "Penang"'
              className="w-full bg-transparent px-3 text-sm text-[#0B1E33] outline-none placeholder-[#0B1E33]/40"
            />
            <button onClick={runHeroSearch} className="rounded-full bg-[#0B1E33] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#132A47] cursor-pointer border-none">
              Search
            </button>
          </div>
          <p className="mt-3 text-[11px] font-mono text-[#9A7B56]/70">Trusted by candidates across Asia Pacific and beyond</p>

          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-6 border-t border-[#EBE7E0]/60 pt-10">
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
        </div>
      </section>

      {/* SECTION 2: ORIGINAL INFINITE BRAND TICKER WALL */}
      <section className="border-y border-[#EBE7E0] bg-white py-8 overflow-hidden relative">
        <p className="text-center text-[10px] font-mono uppercase tracking-[0.2em] text-[#9A7B56]/80 mb-5">
          Trusted by Fortune 500 and the world's largest companies
        </p>
        
        <style>{`
          @keyframes tickerLeft { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          @keyframes tickerRight { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
          .animate-ticker-left { display: flex; width: max-content; animation: tickerLeft 40s linear infinite; }
          .animate-ticker-right { display: flex; width: max-content; animation: tickerRight 40s linear infinite; }
        `}</style>

        <div className="flex flex-col gap-6 w-full">
          <div className="animate-ticker-left gap-16 flex whitespace-nowrap">
            {[...Array(4)].flatMap(() => ['Grab', 'Emirates', 'PwC', 'BMW', 'Petronas', 'Citi', 'Nestlé', 'Intel', 'CIMB', "L'Oréal"]).map((brand, i) => (
              <span key={i} className="text-lg font-serif tracking-widest font-bold text-[#0B1E33]/30 uppercase select-none">
                {brand}
              </span>
            ))}
          </div>

          <div className="animate-ticker-right gap-16 flex whitespace-nowrap">
            {[...Array(4)].flatMap(() => ['Toyota', 'Microsoft', 'NVIDIA', 'Huawei', 'Shell', 'Google', 'HSBC', 'JP Morgan', 'Mitsubishi', 'IBM']).map((brand, i) => (
              <span key={i} className="text-lg font-serif tracking-widest font-bold text-[#0B1E33]/30 uppercase select-none">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: ORIGINAL HOW IT WORKS SEQUENCE CARD GRID */}
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
            <div key={step.num} className="relative p-6 rounded-xl border border-[#EBE7E0] bg-white shadow-3xs">
              <span className="absolute top-4 right-6 font-serif text-5xl font-light text-[#9A7B56]/20">{step.num}</span>
              <h3 className="text-base font-semibold text-[#0B1E33] mt-4">{step.title}</h3>
              <p className="text-xs text-[#6B5A44] mt-2 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: ORIGINAL FEATURED COMPANIES PROFILE REDIRECT MATRIX */}
      <section className="bg-[#F9F7F3] border-y border-[#EBE7E0] py-20">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#9A7B56]">Featured Companies</span>
              <h2 className="text-3xl font-bold tracking-tight text-[#0B1E33] mt-1">
                The most admired companies, <span className="font-serif italic font-normal text-[#9A7B56]">all in one place.</span>
              </h2>
            </div>
            <button onClick={() => setSubView('COMPANIES')} className="mt-4 rounded-full bg-[#9A7B56] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#866A48] transition-colors cursor-pointer border-none shadow-sm">
              Browse all 900+
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURED_COMPANIES.map((comp) => (
              <div 
                key={comp.name} 
                onClick={() => { setSelectedCompanyName(comp.name); setSubView('PROFILE') }}
                className="bg-white border border-[#EBE7E0] rounded-xl p-5 shadow-2xs hover:shadow-md transition-all hover:border-[#9A7B56] cursor-pointer group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-12 rounded-lg bg-[#0B1E33] text-white font-mono flex items-center justify-center font-bold text-sm group-hover:bg-[#9A7B56] transition-colors">
                    {comp.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0B1E33]">{comp.name}</h4>
                    <p className="text-[11px] text-[#9A7B56]">{comp.industry}</p>
                    <p className="text-[11px] text-[#9A7B56]">📍 {comp.location} </p>
                  </div>
                </div>
                <div className="border-t border-[#F1EDE5] pt-3 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-700 font-medium font-mono">{comp.roles} roles open</span>
                  <span className="text-[#6B5A44]/60 group-hover:text-[#9A7B56] transition-colors">✦ View Profile</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DYNAMIC HUB: COMPANY SPOTLIGHT AND FAST GROWTH MATRIX */}
      <section className="mx-auto max-w-[1100px] px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#9A7B56]">Company Spotlight</span>
              <h3 className="text-2xl font-bold text-[#0B1E33] tracking-tight">Every admired company, in the light.</h3>
            </div>
            <span className="bg-amber-100 text-amber-800 font-mono text-[9px] font-bold px-2 py-0.5 rounded-sm animate-pulse shrink-0">
              Auto-cycling 5s
            </span>
          </div>

          <div className="rounded-xl border border-[#9A7B56]/40 bg-white shadow-md relative overflow-hidden flex flex-col justify-between min-h-[360px]">
            <div className="bg-[#0B1E33] p-4 text-white flex justify-between items-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#B5A88F]">
                ✦ {currentSpotlight.tag}
              </span>
              <span className="bg-white/10 text-white font-mono text-xs px-2.5 py-0.5 rounded-full border border-white/10">
                Score Rating: ★ {currentSpotlight.rating}
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-2xl font-bold text-[#0B1E33] tracking-tight">{currentSpotlight.name}</h4>
                <p className="font-serif italic font-normal text-[#9A7B56] text-sm mt-0.5">"{currentSpotlight.blurb}"</p>
                <p className="text-xs text-[#6B5A44] leading-relaxed mt-3.5">{currentSpotlight.desc}</p>
              </div>

              <div className="border-t border-[#F1EDE5] pt-4 mt-6 grid grid-cols-3 gap-2 text-center bg-[#FAF8F5] rounded-lg p-3">
                <div>
                  <p className="font-mono text-base font-bold text-[#0B1E33]">{currentSpotlight.employees}</p>
                  <p className="text-[9px] font-mono uppercase tracking-wider text-[#9A7B56] mt-0.5">Ecosystem Staff</p>
                </div>
                <div>
                  <p className="font-mono text-base font-bold text-[#0B1E33]">{currentSpotlight.hubs}</p>
                  <p className="text-[9px] font-mono uppercase tracking-wider text-[#9A7B56] mt-0.5">Global Hubs</p>
                </div>
                <div>
                  <p className="font-mono text-base font-bold text-emerald-700">{currentSpotlight.openRoles} active</p>
                  <p className="text-[9px] font-mono uppercase tracking-wider text-emerald-700 mt-0.5">Live Roles</p>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <button 
                  onClick={() => { setSelectedCompanyName(currentSpotlight.name); setSubView('PROFILE') }}
                  className="w-full rounded-lg bg-[#0B1E33] py-2.5 text-xs font-semibold text-white hover:bg-[#132A47] cursor-pointer text-center border-none transition-colors"
                >
                  View Open Positions &amp; Deadlines
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#9A7B56]">Algorithmic Recommendations</span>
              <h3 className="text-2xl font-bold text-[#0B1E33] tracking-tight">Fast Growth Companies</h3>
            </div>
            <span className="bg-emerald-100 text-emerald-800 font-mono text-[9px] font-bold px-2 py-0.5 rounded-sm shrink-0">
              High Promotion Probability
            </span>
          </div>

          <div className="rounded-xl border border-[#9A7B56]/40 bg-white shadow-md relative overflow-hidden flex flex-col justify-between min-h-[360px]">
            <div className="bg-[#0B1E33] p-4 text-white flex justify-between items-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#B5A88F]">
                ✦ {FAST_GROWTH_COMPANIES[0].tag}
              </span>
              <span className="bg-white/10 text-white font-mono text-xs px-2.5 py-0.5 rounded-full border border-white/10">
                Score Rating: ★ {FAST_GROWTH_COMPANIES[0].rating}
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-2xl font-bold text-[#0B1E33] tracking-tight">{FAST_GROWTH_COMPANIES[0].name}</h4>
                <p className="font-serif italic font-normal text-[#9A7B56] text-sm mt-0.5">"{FAST_GROWTH_COMPANIES[0].blurb}"</p>
                <p className="text-xs text-[#6B5A44] leading-relaxed mt-3.5">{FAST_GROWTH_COMPANIES[0].desc}</p>
              </div>

              <div className="border-t border-[#F1EDE5] pt-4 mt-6 grid grid-cols-3 gap-2 text-center bg-[#FAF8F5] rounded-lg p-3">
                <div>
                  <p className="font-mono text-base font-bold text-[#0B1E33]">{FAST_GROWTH_COMPANIES[0].employees}</p>
                  <p className="text-[9px] font-mono uppercase tracking-wider text-[#9A7B56] mt-0.5">Ecosystem Staff</p>
                </div>
                <div>
                  <p className="font-mono text-base font-bold text-[#0B1E33]">{FAST_GROWTH_COMPANIES[0].hubs}</p>
                  <p className="text-[9px] font-mono uppercase tracking-wider text-[#9A7B56] mt-0.5">Global Hubs</p>
                </div>
                <div>
                  <p className="font-mono text-base font-bold text-emerald-700">{FAST_GROWTH_COMPANIES[0].openRoles} active</p>
                  <p className="text-[9px] font-mono uppercase tracking-wider text-emerald-700 mt-0.5">Live Roles</p>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <button 
                  onClick={() => { setSelectedCompanyName(FAST_GROWTH_COMPANIES[0].name); setSubView('PROFILE') }}
                  className="w-full rounded-lg bg-[#9A7B56] py-2.5 text-xs font-semibold text-white hover:bg-[#866A48] transition-colors cursor-pointer text-center border-none"
                >
                  Explore Promotion Tracks &amp; Roles
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTELLIGENCE TELEMETRY LABS */}
      <section className="bg-[#FAF8F5] border-y border-[#EBE7E0] py-20">
        <div className="mx-auto max-w-[1100px] px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-6 space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#9A7B56]">Matched To You</span>
              <h3 className="text-2xl font-bold text-[#0B1E33] tracking-tight">Roles Haven thinks you'll fit.</h3>
            </div>
            
            <div className="space-y-3">
              {[
                { role: 'Data Engineer', company: 'Maybank', salary: 'RM 7,000 – 9,000', match: '92% fit', tags: ['SQL', 'Python'] },
                { role: 'Product Analyst', company: 'Grab Malaysia', salary: 'RM 6,000 – 8,000', match: '87% fit', tags: ['A/B Testing', 'Product Analytics'] },
                { role: 'Graduate Analyst', company: 'CIMB Group', salary: 'RM 4,500 – 5,500', match: '88% fit', tags: ['SQL', 'Financial Modeling'] }
              ].map((match, idx) => (
                <div key={idx} className="bg-white border border-[#EBE7E0] rounded-xl p-5 flex items-center justify-between shadow-2xs hover:border-[#9A7B56] transition-all">
                  <div>
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm">{match.match}</span>
                    <h4 className="text-sm font-bold text-[#0B1E33] mt-1.5">{match.role}</h4>
                    <p className="text-xs text-[#6B5A44]">{match.company} &middot; {match.salary}</p>
                    <div className="flex gap-1.5 mt-2">
                      {match.tags.map(t => <span key={t} className="bg-[#FAF8F5] border border-[#EBE7E0] text-[10px] font-mono px-2 py-0.5 text-[#6B5A44] rounded-sm">{t}</span>)}
                    </div>
                  </div>
                  <button onClick={() => { setSelectedCompanyName(match.company); setSubView('PROFILE') }} className="text-xs font-semibold text-[#0B1E33] hover:text-[#9A7B56] cursor-pointer bg-transparent border-none">
                    Apply &rarr;
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#9A7B56]">Labour Market Intelligence</span>
              <h3 className="text-2xl font-bold text-[#0B1E33] tracking-tight">Trend of Employability (Past 3 Months)</h3>
            </div>

            <div className="rounded-xl border border-[#EBE7E0] bg-white p-6 shadow-2xs space-y-6">
              <p className="text-xs text-[#6B5A44] leading-relaxed">
                Rolling hiring demand trends mapped cleanly on client-side percentage layout charts:
              </p>
              
              <div className="space-y-4">
                {[
                  { sector: 'Computer Science & AI Infrastructure', growth: '+28%', pct: '94%', count: '420 hires', color: 'bg-[#0B1E33]' },
                  { sector: 'Banking, Digital Finance & FinTech', growth: '+17%', pct: '82%', count: '310 hires', color: 'bg-[#9A7B56]' },
                  { sector: 'Semiconductor Manufacturing & Hardware', growth: '+12%', pct: '71%', count: '240 hires', color: 'bg-[#C9B896]' },
                  { sector: 'Growth Marketing & Brand Automation', growth: '+9%', pct: '58%', count: '190 hires', color: 'bg-[#EBE7E0]' }
                ].map((track, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="text-[#0B1E33] font-medium tracking-tight">{track.sector}</span>
                      <div className="space-x-2 font-mono text-[11px]">
                        <span className="text-[#6B5A44]/60">{track.count}</span>
                        <span className="text-emerald-700 font-bold">{track.growth} YoY</span>
                      </div>
                    </div>
                    <div className="h-6 w-full bg-[#FAF8F5] border border-[#EBE7E0] rounded-md overflow-hidden relative flex items-center">
                      <div 
                        className={`h-full ${track.color} transition-all duration-500`} 
                        style={{ width: track.pct }} 
                      />
                      <span className="absolute left-3 font-mono text-[10px] text-white mix-blend-difference font-semibold">
                        {track.pct} Ecosystem Capacity
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: LIVE MARKET INTELLIGENCE LADDER */}
      <section className="mx-auto max-w-[900px] px-6 py-20">
        <div className="text-center mb-12">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#9A7B56]">Live Market Intelligence</span>
          <h2 className="text-3xl font-bold tracking-tight text-[#0B1E33] mt-1">
            Know what the next rung <span className="font-serif italic font-normal text-[#9A7B56]">actually pays.</span>
          </h2>
          <p className="text-xs text-[#6B5A44] mt-2">Map real climbs based on tracked verification. Sales &amp; Marketing sector template:</p>
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

      {/* COMPONENT: HAVEN AI CTA BLOCK */}
      <section className="mx-auto max-w-[1100px] px-6 py-10">
        <div className="rounded-2xl bg-[#0B1E33] p-22 text-white grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="md:col-span-8 space-y-4">
            <span className="text-[12px] font-mono uppercase tracking-[0.2em] text-[#B5A88F]">Haven AI Career Companion</span>
            <h3 className="text-5xl font-bold tracking-tight">Not a chatbot. <span className="font-serif italic font-normal text-[#9A7B56]">A career companion that knows your story.</span></h3>
            <p className="text-xs text-[#D8CFC0] max-w-xl leading-relaxed">
              Haven reads your living portfolio configuration, calculates local cost-of-living indices, and tracks trajectory paths cleanly across every dashboard screen.
            </p>
          </div>

          <div className="md:col-span-4 md:text-right">
            <button 
              onClick={onNavigateToHavenChat} 
              className="w-full sm:w-auto rounded-full bg-[#9A7B56] px-8 py-4 text-xs font-mono uppercase tracking-wider text-white hover:bg-[#866A48] transition-all shadow-sm cursor-pointer border-none"
            >
              Meet Haven AI &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 6: LIFECYCLE TRACKER - Adjusted to a premium soft warm cream tint */}
      <section className="w-full bg-[#F9F7F2] px-6 py-24 border-t border-[#EBE7E0]/60">
        <div className="mx-auto max-w-[1200px]">
          <div className="text-center mb-16">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#9A7B56]">
              Whoever You Are
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0B1E33] sm:text-4xl md:text-5xl">
              One career home, <span className="font-serif italic font-normal text-[#9A7B56]">built for every ambitious career.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#6B5A44]">
              Career OS grows with you through every stage of your working life. Start anywhere, stay for the journey.
            </p>
          </div>

          <div className="relative my-16 hidden md:block max-w-[1000px] mx-auto">
            <div className="absolute top-6 left-6 right-6 h-[1.5px] bg-[#0B1E33]/10" />
            
            <div className="relative flex justify-between items-start">
              {[
                { label: 'Explore', sub: '16+ discover strengths', color: 'border-[#9A7B56] text-[#9A7B56]', icon: '🧭' },
                { label: 'Study', sub: 'courses that lead somewhere', color: 'border-[#9A7B56] text-[#9A7B56]', icon: '🎓' },
                { label: 'First job', sub: 'land it with AI guidance', color: 'border-[#9A7B56] text-[#9A7B56]', icon: '⚡' },
                { label: 'Mid-career', sub: 'grow, lead, earn more', color: 'border-emerald-600 text-emerald-700', icon: '📈' },
                { label: 'Pivot', sub: 'change direction safely', color: 'border-emerald-600 text-emerald-700', icon: '🔄' },
                { label: 'Pre-retirement', sub: 'plan the next chapter', color: 'border-emerald-600 text-emerald-700', icon: '🎯' },
              ].map((step, idx) => (
                <div key={idx} className="flex flex-col items-center max-w-[140px] text-center bg-[#F9F7F2] px-2 z-10">
                  <div className={`w-12 h-12 rounded-full border-2 bg-white flex items-center justify-center text-sm font-semibold shadow-2xs transition-transform duration-300 hover:scale-110 ${step.color}`}>
                    {step.icon}
                  </div>
                  <h4 className="text-xs font-bold text-[#0B1E33] mt-3 tracking-tight">{step.label}</h4>
                  <p className="text-[11px] text-[#6B5A44] leading-tight mt-1 font-sans">{step.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="md:hidden space-y-4 max-w-sm mx-auto my-10">
            {[
              { label: 'Explore', sub: '16+ discover your strengths', icon: '🧭', border: 'border-l-2 border-[#9A7B56]' },
              { label: 'Study', sub: 'courses that lead somewhere', icon: '🎓', border: 'border-l-2 border-[#9A7B56]' },
              { label: 'First job', sub: 'land it with AI guidance', icon: '⚡', border: 'border-l-2 border-[#9A7B56]' },
              { label: 'Mid-career', sub: 'grow, lead, earn more', icon: '📈', border: 'border-l-2 border-emerald-600' },
              { label: 'Pivot', sub: 'change direction safely', icon: '🔄', border: 'border-l-2 border-emerald-600' },
              { label: 'Pre-retirement', sub: 'plan the next chapter', icon: '🎯', border: 'border-l-2 border-emerald-600' }
            ].map((item, idx) => (
              <div key={idx} className={`flex items-center gap-4 bg-white border border-[#EBE7E0] p-3 rounded-lg shadow-3xs ${item.border}`}>
                <span className="text-xl">{item.icon}</span>
                <div>
                  <h4 className="text-xs font-bold text-[#0B1E33]">{item.label}</h4>
                  <p className="text-[11px] text-[#6B5A44]">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="inline-block rounded-full bg-white border border-[#EBE7E0] px-6 py-2 text-xs font-medium text-[#0B1E33] font-sans shadow-2xs">
              <span className="font-bold text-[#0B1E33]">One profile, for life.</span> Your skills, story and trajectory travel with you — and Haven guides each stage.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 7: SPLIT ONBOARDING CARDS - Re-calibrated to flow perfectly into the unified layout grid background */}
      <section className="w-full bg-[#F9F7F2] px-6 pb-24">
        <div className="mx-auto max-w-[1100px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            {/* FOR TALENT GATEWAY */}
            <div className="rounded-2xl border border-[#EBE7E0] bg-white p-8 shadow-sm flex flex-col justify-between items-start transition-all duration-300 hover:shadow-md hover:border-[#9A7B56]/50 group">
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-[#0B1E33] tracking-tight">
                  For <span className="font-serif italic font-normal text-[#9A7B56]">talent</span>
                </h3>
                <p className="text-xs text-[#6B5A44] leading-relaxed max-w-sm font-sans">
                  Find work you're built for, build a portfolio employers actually trust, and see your path years ahead — all in one place.
                </p>
              </div>
              
              <button 
                onClick={onExplore}
                className="mt-8 rounded-full bg-[#0B1E33] px-6 py-3 text-xs font-mono uppercase tracking-wider text-white font-semibold shadow-2xs hover:bg-[#132A47] transition-all cursor-pointer border-none group-hover:translate-x-1"
              >
                Create your profile
              </button>
            </div>

            {/* FOR EMPLOYERS GATEWAY */}
            <div className="rounded-2xl border border-[#0B1E33] bg-[#0B1E33] p-8 shadow-md flex flex-col justify-between items-start transition-all duration-300 hover:shadow-lg relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
              
              <div className="space-y-3 relative z-10">
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  For <span className="font-serif italic font-normal text-[#B5A88F]">employers</span>
                </h3>
                <p className="text-xs text-[#D8CFC0] leading-relaxed max-w-sm font-sans">
                  Reach a pipeline of candidates with proven portfolios and real signal — not just CVs. Post a role and see matches the moment you publish.
                </p>
              </div>

              <button 
                onClick={onEmployerSignup}
                className="mt-8 rounded-full bg-white px-6 py-3 text-xs font-mono uppercase tracking-wider text-[#0B1E33] font-semibold shadow-2xs hover:bg-[#FAF8F5] transition-all cursor-pointer border-none relative z-10 group-hover:scale-102"
              >
                Hire with Career OS
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER ACTION BANNER */}
      <section className="bg-[#0B1E33] text-white py-20 text-center relative overflow-hidden border-t border-white/10">
        <div className="mx-auto max-w-xl px-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Your whole working life, <br />
            <span className="font-serif italic font-normal text-[#9A7B56]">one platform.</span>
          </h2>
          <p className="text-xs text-[#D8CFC0] max-w-xs mx-auto mt-4 leading-relaxed">
            Career OS grows with you from age 15 to 65. Track trajectory cleanly with data metrics.
          </p>
          <button onClick={onExplore} className="mt-8 rounded-full bg-[#9A7B56] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#866A48] transition-colors cursor-pointer border-none shadow-md">
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