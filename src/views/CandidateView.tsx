import { useMemo } from 'react'
import {
  DEMO_CANDIDATE,
  COST_OF_LIVING,
  MARKET_MIN_SALARY,
  CAREER_PATH_STEPS,
  JOBS,
} from '../data/mockData'
import { KANBAN_STAGES, type ApplicationRecord, type PipelineStage } from '../data/appState'
import { useAppContext } from '../data/AppContext'
import { Card, Badge, ProgressBar, SectionHeading, BaselineSlider, Eyebrow } from '../components/ui'
import { DashboardLayout, type SidebarSection } from '../components/DashboardLayout'

const SECTIONS: SidebarSection[] = [
  { id: 'today', label: 'Today' },
  { id: 'discover', label: 'Discover' },
  { id: 'tracker', label: 'Application Tracker' },
  { id: 'portfolio', label: 'Living Portfolio' },
  { id: 'compass', label: 'Compass' },
]

export function CandidateView({ onSwitchRole }: { onSwitchRole: () => void }) {
  const { applications, selectedJobId, setSelectedJobId, injectDockerProject } = useAppContext()
  const c = DEMO_CANDIDATE
  const aisyahApp = applications.find((a) => a.candidateId === c.id)

  return (
    <DashboardLayout
      roleLabel="Candidate"
      personaName={c.name}
      personaSub={`${c.university} · Class of ${c.gradYear}`}
      sections={SECTIONS}
      onSwitchRole={onSwitchRole}
    >
      <section id="today" className="scroll-mt-24">
        <TodayTab />
      </section>

      <section id="discover" className="scroll-mt-24">
        <DiscoverTab selectedJobId={selectedJobId} onSelectJob={setSelectedJobId} />
      </section>

      <section id="tracker" className="scroll-mt-24">
        {aisyahApp && <TrackerTab application={aisyahApp} onInjectDockerProject={injectDockerProject} />}
      </section>

      <section id="portfolio" className="scroll-mt-24">
        <PortfolioTab application={aisyahApp} />
      </section>

      <section id="compass" className="scroll-mt-24">
        <CompassTab />
      </section>
    </DashboardLayout>
  )
}

function TodayTab() {
  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Today" title="Your" italicWord="workspace" description="What needs your attention right now." />

      <Card className="p-7">
        <div className="flex items-center justify-between gap-6">
          <div>
            <Badge tone="indigo">Upcoming</Badge>
            <p className="mt-3 text-lg font-semibold text-[#0B1E33]">CIMB Group Interview</p>
            <p className="mt-1 text-sm text-[#6B5A44]">Backend Engineer — Panel Round</p>
          </div>
          <div className="text-right">
            <p className="font-serif text-6xl font-light leading-none text-[#0B1E33]">5<span className="text-2xl align-top">h</span></p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-[#9A7B56]">until interview</p>
          </div>
        </div>
      </Card>

      <Card className="p-7">
        <Badge tone="positive">Peer signal</Badge>
        <p className="mt-3 text-sm font-semibold text-[#0B1E33]">18 UM peers applied at CIMB</p>
        <p className="mt-1 text-sm text-[#6B5A44]">Backend Engineer role — same graduating cohort</p>
      </Card>
    </div>
  )
}

function DiscoverTab({ selectedJobId, onSelectJob }: { selectedJobId: string; onSelectJob: (jobId: string) => void }) {
  const matches = useMemo(() => {
    return JOBS.filter((j) => j.field === DEMO_CANDIDATE.field)
      .slice(0, 6)
      .map((j) => ({ ...j, match: Math.min(97, 60 + (DEMO_CANDIDATE.portfolioScore - 40)) }))
      .sort((a, b) => b.match - a.match)
  }, [])

  const selectedJob = matches.find((m) => m.id === selectedJobId) ?? matches[0]

  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Discover" title="Roles matched to" italicWord="your profile" description="Select a role to open the Fair Pay Engine worksheet." />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {matches.map((m) => (
          <button key={m.id} onClick={() => onSelectJob(m.id)} className="text-left">
            <Card className={`p-6 transition-shadow hover:shadow-md ${m.id === selectedJobId ? 'ring-2 ring-[#0B1E33]' : ''}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#0B1E33]">{m.role}</p>
                  <p className="text-xs text-[#9A7B56]">{m.company}</p>
                </div>
                <span className="font-mono text-lg font-bold text-[#0B1E33]">{m.match}%</span>
              </div>
              <div className="mt-3"><ProgressBar value={m.match} /></div>
              <div className="mt-3 flex items-center justify-between text-xs text-[#6B5A44]">
                <span>RM {m.salaryMin.toLocaleString()}–{m.salaryMax.toLocaleString()}</span>
                <span>{m.cityTier.split(' ')[0]} {m.cityTier.split(' ')[1]}</span>
              </div>
            </Card>
          </button>
        ))}
      </div>

      {selectedJob && <FairPayWorksheet salaryMin={selectedJob.salaryMin} salaryMax={selectedJob.salaryMax} cityTier={selectedJob.cityTier} role={selectedJob.role} company={selectedJob.company} />}
    </div>
  )
}

function FairPayWorksheet({
  salaryMin,
  salaryMax,
  cityTier,
  role,
  company,
}: {
  salaryMin: number
  salaryMax: number
  cityTier: keyof typeof COST_OF_LIVING
  role: string
  company: string
}) {
  const c = DEMO_CANDIDATE
  const grossSalary = Math.round((salaryMin + salaryMax) / 2)
  const col = COST_OF_LIVING[cityTier]
  const tax = Math.round(grossSalary * col.taxRate)
  const disposable = grossSalary - tax - col.rent - col.transport - col.living
  const marketMin = MARKET_MIN_SALARY[c.field]
  const isUnderpaid = disposable < 500

  const lineItems = [
    { label: 'Gross salary', value: grossSalary },
    { label: 'Estimated tax', value: -tax },
    { label: `Rent · ${cityTier.split(' ')[0]} ${cityTier.split(' ')[1]}`, value: -col.rent },
    { label: 'Commute', value: -col.transport },
    { label: 'Living expenses', value: -col.living },
  ]

  const segments = [
    { label: 'Disposable', amount: Math.max(0, disposable), color: '#0B1E33' },
    { label: 'Tax', amount: tax, color: '#9A7B56' },
    { label: 'Rent', amount: col.rent, color: '#C9B896' },
    { label: 'Commute + Living', amount: col.transport + col.living, color: '#EBE7E0' },
  ]

  return (
    <Card className="p-7">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <Eyebrow>Innovation · Fair Pay Engine</Eyebrow>
          <p className="mt-1.5 text-lg font-semibold text-[#0B1E33]">
            {role} <span className="font-serif italic font-normal">at {company}</span>
          </p>
        </div>
        {isUnderpaid && (
          <span className="animate-pulse">
            <Badge tone="danger">Underpay Detection Warning</Badge>
          </span>
        )}
      </div>

      <div className="divide-y divide-[#EBE7E0]">
        {lineItems.map((r) => (
          <div key={r.label} className="flex items-baseline justify-between py-2.5">
            <span className="text-sm text-[#6B5A44]">{r.label}</span>
            <span className={`font-mono text-sm ${r.value < 0 ? 'text-[#9A7B56]' : 'text-[#0B1E33] font-medium'}`}>
              {r.value >= 0 ? '' : '−'}RM {Math.abs(r.value).toLocaleString()}
            </span>
          </div>
        ))}
        <div className="flex items-baseline justify-between py-3">
          <span className="text-sm font-semibold text-[#0B1E33]">Disposable income</span>
          <span className={`font-mono text-xl font-semibold ${disposable >= 500 ? 'text-emerald-700' : 'text-rose-600'}`}>
            RM {disposable.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="mt-4 flex h-2.5 w-full overflow-hidden rounded-full bg-[#F1EDE5]">
        {segments.map((s) => (
          <div
            key={s.label}
            style={{ width: `${(s.amount / grossSalary) * 100}%`, backgroundColor: s.color }}
            title={`${s.label}: RM ${s.amount.toLocaleString()}`}
          />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#9A7B56]">
        {segments.map((s) => (
          <span key={s.label} className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />
            {s.label}
          </span>
        ))}
      </div>

      <div className="mt-5">
        <BaselineSlider
          value={grossSalary}
          max={marketMin * 1.6}
          baseline={marketMin}
          valueLabel={`Offer: RM ${grossSalary.toLocaleString()}`}
          baselineLabel={`Market baseline: RM ${marketMin.toLocaleString()}`}
        />
      </div>
    </Card>
  )
}

function TrackerTab({
  application,
  onInjectDockerProject,
}: {
  application: ApplicationRecord
  onInjectDockerProject: (applicationId: string) => void
}) {
  const grouped: Record<PipelineStage, ApplicationRecord[]> = {
    'Top Tier Pool': [],
    'Reviewing Queue': [],
    'Queueing': [],
    'Not Qualified': [],
    'Hired': [],
  }
  grouped[application.stage] = [application]

  const canInject = application.stage === 'Not Qualified' && application.missingSkills.includes('System Design')

  return (
    <div>
      <SectionHeading eyebrow="Application Tracker" title="Your pipeline," italicWord="split by pool" description="Aisyah's live application status for the Backend Engineer role at CIMB Group." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KANBAN_STAGES.map((stage) => (
          <div key={stage} className="rounded-xl border border-[#EBE7E0] bg-[#F9F7F3] p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#9A7B56]">{stage}</p>
            <div className="min-h-[88px] space-y-2">
              {grouped[stage].map((app) => (
                <div
                  key={app.id}
                  className="rounded-lg border border-[#EBE7E0] bg-white p-3 shadow-sm transition-all duration-500"
                >
                  <p className="text-sm font-semibold text-[#0B1E33]">{app.candidateName}</p>
                  <p className="text-xs text-[#9A7B56]">{app.jobRole} · {app.company}</p>
                  {app.missingSkills.length > 0 && (
                    <div className="mt-2"><Badge tone="warning">Missing: {app.missingSkills.join(', ')}</Badge></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {canInject && (
        <Card className="mt-6 p-6">
          <Eyebrow>Haven AI Suggestion</Eyebrow>
          <p className="mt-1.5 text-sm font-semibold text-[#0B1E33]">
            Inject verified <span className="font-serif italic font-normal">Docker Project</span>
          </p>
          <p className="mt-1 text-sm text-[#6B5A44]">
            Your portfolio is missing a System Design credential. Adding a verified Docker deployment project closes this gap and should move your application into the Reviewing Queue.
          </p>
          <button
            onClick={() => onInjectDockerProject(application.id)}
            className="mt-4 rounded-full bg-[#0B1E33] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#132A47]"
          >
            Haven AI Suggestion: Inject verified Docker Project
          </button>
        </Card>
      )}

      {!canInject && application.stage !== 'Not Qualified' && (
        <Card className="mt-6 p-6">
          <Badge tone="positive">Update applied</Badge>
          <p className="mt-2 text-sm text-[#6B5A44]">
            Your Docker project was added and verified. Match score is now {Math.round(application.matchScore)}% and your application moved to {application.stage}.
          </p>
        </Card>
      )}
    </div>
  )
}

function PortfolioTab({ application }: { application: ApplicationRecord | undefined }) {
  const c = DEMO_CANDIDATE
  const score = application?.portfolioScore ?? c.portfolioScore
  const skills = [
    { name: 'System Design', status: application && !application.missingSkills.includes('System Design') ? 'closed' : 'open' },
    { name: 'SQL & Data Modelling', status: 'closed' },
    { name: 'Cloud Deployment (AWS)', status: 'closed' },
    { name: 'API Security', status: 'open' },
  ]
  return (
    <div>
      <SectionHeading eyebrow="Living Portfolio" title="Your verified" italicWord="profile" />

      <Card className="mb-4 p-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[#0B1E33]">Portfolio strength</p>
            <p className="text-xs text-[#9A7B56]">Compared against top candidates in {c.field}</p>
          </div>
          <p className="font-mono text-3xl font-bold text-[#0B1E33]">{Math.round(score)} <span className="text-sm font-normal text-[#9A7B56]">{score >= 70 ? 'Strong' : 'Building'}</span></p>
        </div>
        <div className="mt-3"><ProgressBar value={score} tone="emerald" /></div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="p-6">
          <p className="mb-3 text-sm font-semibold text-[#0B1E33]">Verified credentials</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between"><span className="text-[#6B5A44]">B.CS, Universiti Malaya</span><Badge tone="positive">Verified</Badge></div>
            <div className="flex items-center justify-between"><span className="text-[#6B5A44]">AWS Cloud Practitioner</span><Badge tone="positive">Verified</Badge></div>
            <div className="flex items-center justify-between"><span className="text-[#6B5A44]">Internship — Grab Malaysia</span><Badge tone="positive">Verified</Badge></div>
            {application && !application.missingSkills.includes('System Design') && (
              <div className="flex items-center justify-between"><span className="text-[#6B5A44]">Docker Deployment Project</span><Badge tone="positive">Verified</Badge></div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <p className="mb-3 text-sm font-semibold text-[#0B1E33]">Skill gaps</p>
          <div className="space-y-2 text-sm">
            {skills.map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <span className="text-[#6B5A44]">{s.name}</span>
                <Badge tone={s.status === 'closed' ? 'positive' : 'warning'}>{s.status === 'closed' ? 'Closed' : 'Open'}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

function CompassTab() {
  return (
    <div>
      <SectionHeading eyebrow="Compass" title="Your career" italicWord="path" description="Median trajectory for candidates who started where you are." />
      <Card className="p-7">
        <div className="relative">
          <div className="absolute left-4 top-2 bottom-2 w-px bg-[#EBE7E0]" />
          <div className="space-y-6">
            {CAREER_PATH_STEPS.map((s, i) => (
              <div key={s.role} className="relative flex gap-4 pl-10">
                <div className={`absolute left-0 top-0.5 flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs font-semibold ${
                  i <= 1 ? 'bg-[#0B1E33] text-white' : 'bg-[#F6F3EE] text-[#9A7B56]'
                }`}>{i + 1}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#0B1E33]">{s.role}</p>
                    <span className="font-mono text-sm text-[#6B5A44]">RM {s.medianSalary.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-[#9A7B56]">{s.medianMonths === 0 ? 'Starting point' : `~${s.medianMonths} months median`}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
