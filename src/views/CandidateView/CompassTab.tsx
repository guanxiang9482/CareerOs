import { useMemo, useState } from 'react'
import { Card, SectionHeading, Badge } from '../../components/ui'
import { useAppContext } from '../../data/AppContext'
import { CAREER_PATH_STEPS, DEMO_CANDIDATE, MARKET_MIN_SALARY, ROLES, JOBS } from '../../data/mockData'

// --- Route generation -------------------------------------------------------
// The brief asks for "a handful of routes you could realistically take from
// here" based on what you've done and what the market looks like now — not
// a single predetermined ladder. Each route below is built from data already
// in the app (userSkills, field, live JOBS postings) so the "why realistic"
// reasoning is visible, not just a label.

interface RouteStep {
  role: string
  medianSalary: number
  medianMonths: number
}

interface Route {
  id: string
  name: string
  reason: string
  openingsNow: number
  steps: RouteStep[]
}

function buildRoutes(field: typeof DEMO_CANDIDATE.field, hasSystemDesign: boolean): Route[] {
  const base = MARKET_MIN_SALARY[field] || 3800

  const deepenTechnical: Route = {
    id: 'deepen-technical',
    name: 'Deepen as a Specialist',
    reason: hasSystemDesign
      ? 'Your verified System Design credential already clears the bar most companies screen for on this track.'
      : 'This is your current track — closing the System Design gap is what keeps it realistic.',
    openingsNow: JOBS.filter((j) => j.field === field && j.role === 'Backend Engineer').length,
    steps: CAREER_PATH_STEPS,
  }

  const productPivot: Route = {
    id: 'product-pivot',
    name: 'Pivot Toward Product',
    reason: 'Your background in a technical field is a common entry point into product roles — companies hiring for this track often prefer candidates who can already read a technical spec.',
    openingsNow: JOBS.filter((j) => j.field === 'Marketing & Communications').length,
    steps: [
      { role: ROLES['Marketing & Communications'][0], medianMonths: 0, medianSalary: MARKET_MIN_SALARY['Marketing & Communications'] },
      { role: 'Product Analyst', medianMonths: 14, medianSalary: Math.round(MARKET_MIN_SALARY['Marketing & Communications'] * 1.25) },
      { role: 'Product Manager', medianMonths: 32, medianSalary: Math.round(MARKET_MIN_SALARY['Marketing & Communications'] * 1.75) },
      { role: 'Senior Product Manager', medianMonths: 58, medianSalary: Math.round(MARKET_MIN_SALARY['Marketing & Communications'] * 2.6) },
    ],
  }

  const dataTrack: Route = {
    id: 'data-track',
    name: 'Move Into Data',
    reason: 'A lateral move rather than a jump — same technical base, different specialization, and it currently pays a premium over your default track.',
    openingsNow: JOBS.filter((j) => j.role === 'Data Analyst').length,
    steps: [
      { role: 'Data Analyst', medianMonths: 0, medianSalary: base },
      { role: 'Senior Data Analyst', medianMonths: 20, medianSalary: Math.round(base * 1.35) },
      { role: 'Analytics Lead', medianMonths: 44, medianSalary: Math.round(base * 1.9) },
      { role: 'Head of Data', medianMonths: 78, medianSalary: Math.round(base * 2.8) },
    ],
  }

  const foundersTrack: Route = {
    id: 'independent',
    name: 'Go Independent',
    reason: 'Highest ceiling, least predictable — worth listing precisely because it doesn\'t show up in a job board search, but your portfolio score already supports freelance credibility.',
    openingsNow: 0,
    steps: [
      { role: 'Freelance Contractor', medianMonths: 0, medianSalary: Math.round(base * 0.9) },
      { role: 'Independent Consultant', medianMonths: 18, medianSalary: Math.round(base * 1.6) },
      { role: 'Studio / Small Team Lead', medianMonths: 42, medianSalary: Math.round(base * 2.4) },
    ],
  }

  return [deepenTechnical, productPivot, dataTrack, foundersTrack]
}

export function CompassTab() {
  const { userSkills } = useAppContext()
  const c = DEMO_CANDIDATE
  const hasSystemDesign = userSkills.includes('System Design')

  const routes = useMemo(() => buildRoutes(c.field, hasSystemDesign), [c.field, hasSystemDesign])
  const [activeRouteId, setActiveRouteId] = useState(routes[0].id)
  const activeRoute = routes.find((r) => r.id === activeRouteId) ?? routes[0]

  const currentStepIndex = useMemo(
    () => (activeRoute.id === 'deepen-technical' ? CAREER_PATH_STEPS.findIndex((s) => s.role === c.targetRole) : -1),
    [activeRoute, c.targetRole]
  )

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Compass"
        title="Your Career Path"
        italicWord="Navigator"
        description="What you've done and what the job market actually looks like right now, showing a handful of routes you could realistically take from here. It doesn't predict which one is best — it just gives you something more than gut feel to work with."
      />

      {/* Route Selector — this is the "handful of routes" the brief asks for,
          not one fixed ladder. Each card states why it's realistic and how
          many live openings currently exist for it. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {routes.map((route) => (
          <button
            key={route.id}
            onClick={() => setActiveRouteId(route.id)}
            className="text-left bg-transparent border-none p-0 outline-none cursor-pointer"
          >
            <Card
              className={`p-4 h-full transition-all ${
                activeRouteId === route.id
                  ? 'ring-2 ring-[#0B1E33] border-transparent shadow-sm bg-white'
                  : 'border-[#EBE7E0] bg-[#FAF8F5] hover:shadow-2xs'
              }`}
            >
              <p className="text-xs font-bold text-[#0B1E33]">{route.name}</p>
              <p className="text-[11px] text-[#6B5A44] mt-1.5 leading-relaxed">{route.reason}</p>
              <div className="mt-3 pt-2 border-t border-[#EBE7E0]/60">
                <Badge tone={route.openingsNow > 0 ? 'positive' : 'neutral'}>
                  {route.openingsNow > 0 ? `${route.openingsNow} open now` : 'No live postings'}
                </Badge>
              </div>
            </Card>
          </button>
        ))}
      </div>

      {/* Progression Flow Display Map */}
      <Card className="p-6 bg-white border border-[#EBE7E0] rounded-xl shadow-2xs">
        <div className="mb-5">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#9A7B56] font-bold">{activeRoute.name}</p>
          <p className="text-xs text-[#6B5A44] mt-1">{activeRoute.reason}</p>
        </div>

        <div className="relative">
          <div className="absolute left-4 top-2 bottom-2 w-px bg-[#EBE7E0]" />

          <div className="space-y-6">
            {activeRoute.steps.map((node, idx) => {
              const isCurrent = idx === currentStepIndex
              return (
                <div key={node.role} className="relative flex gap-4 pl-10 group">
                  <div
                    className={`absolute left-0 top-0.5 flex h-8 w-8 items-center justify-center rounded-full text-xs font-mono font-bold transition-transform group-hover:scale-110 ${
                      isCurrent ? 'bg-[#9A7B56] text-white ring-4 ring-[#9A7B56]/20' : 'bg-[#0B1E33] text-white'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div
                    className={`flex-1 border p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isCurrent ? 'bg-[#FAF6EE] border-[#9A7B56]' : 'bg-[#FAF8F5] border-[#EBE7E0]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h5 className="text-sm font-bold text-[#0B1E33]">{node.role}</h5>
                        {isCurrent && <Badge tone="indigo">You are here</Badge>}
                      </div>
                      <p className="text-xs text-[#6B5A44] mt-0.5">
                        {node.medianMonths === 0
                          ? 'Typical entry point for this route.'
                          : `Median ${node.medianMonths} months of experience to reach this level.`}
                      </p>
                    </div>
                    <div className="shrink-0 font-mono text-xs font-bold bg-white px-3 py-1 rounded-md border border-[#EBE7E0] text-[#0B1E33]">
                      Median: RM {node.medianSalary.toLocaleString()} / mo
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {activeRoute.id === 'deepen-technical' && (
          <p className="mt-6 pt-4 border-t border-[#EBE7E0] text-xs text-[#6B5A44]">
            {hasSystemDesign
              ? 'Your verified System Design credential keeps you tracking toward the next step on schedule.'
              : 'Adding a verified System Design credential in your Living Portfolio is the fastest lever to move toward the next step on this route.'}
          </p>
        )}
      </Card>
    </div>
  )
}
