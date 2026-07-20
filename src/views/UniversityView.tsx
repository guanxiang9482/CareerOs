import { useMemo, useState } from 'react'
import { UNIVERSITY_STATS, FACULTY_BENCHMARKS, CANDIDATES } from '../data/mockData'
import { useAppContext } from '../data/AppContext'
import { Card, Badge, ProgressBar, StatBlock, SectionHeading } from '../components/ui'
import { DashboardLayout, type SidebarSection } from '../components/DashboardLayout'

type Segment = 'All' | 'On Track' | 'Needs a Nudge' | 'At Risk'

const SECTIONS: SidebarSection[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'benchmarks', label: 'Faculty Benchmarks' },
  { id: 'segments', label: 'Student Segments' },
]

export function UniversityView({ onSwitchRole }: { onSwitchRole: () => void }) {
  const { applications } = useAppContext()
  const [segment, setSegment] = useState<Segment>('All')
  const um = UNIVERSITY_STATS[0]

  const activeApplicationsByCandidate = useMemo(() => {
    const map = new Map<string, number>()
    applications
      .filter((a) => a.stage === 'Reviewing Queue' || a.stage === 'Top Tier Pool' || a.stage === 'Queueing')
      .forEach((a) => map.set(a.candidateId, (map.get(a.candidateId) ?? 0) + 1))
    return map
  }, [applications])

  const cohortWithLiveStatus = useMemo(() => {
    const fromUM = CANDIDATES.filter((c) => c.university === um.university)
    return fromUM.map((c) => {
      const activeCount = activeApplicationsByCandidate.get(c.id) ?? 0
      let status: Segment = c.status
      if (c.gradYear <= 2026 && activeCount === 0 && c.applicationsFiled === 0) {
        status = 'At Risk'
      }
      return { ...c, liveStatus: status, activeCount }
    })
  }, [activeApplicationsByCandidate, um.university])

  const cohort = useMemo(() => {
    return segment === 'All' ? cohortWithLiveStatus : cohortWithLiveStatus.filter((c) => c.liveStatus === segment)
  }, [segment, cohortWithLiveStatus])

  const counts = useMemo(() => {
    return {
      'On Track': cohortWithLiveStatus.filter((c) => c.liveStatus === 'On Track').length,
      'Needs a Nudge': cohortWithLiveStatus.filter((c) => c.liveStatus === 'Needs a Nudge').length,
      'At Risk': cohortWithLiveStatus.filter((c) => c.liveStatus === 'At Risk').length,
    }
  }, [cohortWithLiveStatus])

  return (
    <DashboardLayout roleLabel="University" personaName="Universiti Malaya" personaSub="Career & Placement Office" sections={SECTIONS} onSwitchRole={onSwitchRole}>
      <section id="overview" className="scroll-mt-24">
        <SectionHeading eyebrow="University" title="Academic Administration" italicWord="Hub" description={um.university} />
        <Card className="grid grid-cols-3 gap-6 p-7">
          <StatBlock label="6-month employability" value={String(um.employabilityRate)} suffix="%" tone="positive" />
          <StatBlock label="Median starting salary" value={`RM ${um.medianSalary.toLocaleString()}`} />
          <StatBlock label="Median time to first job" value={String(um.medianTimeToJobDays)} suffix="days" />
        </Card>
      </section>

      <section id="benchmarks" className="scroll-mt-24">
        <Card className="p-7">
          <p className="mb-5 text-sm font-semibold text-[#0B1E33]">
            Inter-faculty performance <span className="font-serif italic font-normal text-[#9A7B56]">benchmarks</span>
          </p>
          <div className="space-y-5">
            {FACULTY_BENCHMARKS.map((f) => (
              <div key={f.faculty}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-[#0B1E33]">{f.faculty}</span>
                  <span className="font-mono text-[#9A7B56]">{f.employabilityRate}% · RM {f.medianSalary.toLocaleString()}</span>
                </div>
                <ProgressBar value={f.employabilityRate} tone={f.employabilityRate > 80 ? 'emerald' : f.employabilityRate > 65 ? 'indigo' : 'amber'} />
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section id="segments" className="scroll-mt-24">
        <Card className="p-7">
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm font-semibold text-[#0B1E33]">
              Student outcome <span className="font-serif italic font-normal text-[#9A7B56]">segments</span>
            </p>
            <div className="flex items-center gap-1 rounded-full border border-[#EBE7E0] bg-[#F6F3EE] p-1">
              {(['All', 'On Track', 'Needs a Nudge', 'At Risk'] as Segment[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSegment(s)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    segment === s ? 'bg-[#0B1E33] text-white' : 'text-[#6B5A44] hover:text-[#0B1E33]'
                  }`}
                >
                  {s} {s !== 'All' && `(${counts[s]})`}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-96 space-y-2 overflow-y-auto">
            {cohort.slice(0, 40).map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-lg border border-[#EBE7E0] px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-[#0B1E33]">{c.name}</p>
                  <p className="text-xs text-[#9A7B56]">{c.field} · Class of {c.gradYear} · {c.activeCount} active application{c.activeCount === 1 ? '' : 's'}</p>
                </div>
                <Badge tone={c.liveStatus === 'On Track' ? 'positive' : c.liveStatus === 'Needs a Nudge' ? 'warning' : 'danger'}>
                  {c.liveStatus}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </DashboardLayout>
  )
}
