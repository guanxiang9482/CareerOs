import { useMemo } from 'react'
import { useAppContext } from '../data/AppContext'
import { Card, Badge, StatBlock, SectionHeading } from '../components/ui'
import { DashboardLayout, type SidebarSection } from '../components/DashboardLayout'

const SECTIONS: SidebarSection[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'funnel', label: 'Hiring Funnel' },
  { id: 'matches', label: 'Strong Matches' },
]

export function EmployerView({ onSwitchRole }: { onSwitchRole: () => void }) {
  const { applications } = useAppContext()

  const avgTimeToHire = 21
  const offerAcceptanceRate = 86
  const pipelineHealth = 'Strong'

  const funnelCounts = useMemo(() => {
    const applied = applications.length
    const notQualified = applications.filter((a) => a.stage === 'Not Qualified').length
    const screened = applied - notQualified
    const reviewing = applications.filter((a) => a.stage === 'Reviewing Queue' || a.stage === 'Top Tier Pool' || a.stage === 'Hired').length
    const offer = applications.filter((a) => a.stage === 'Top Tier Pool' || a.stage === 'Hired').length
    const hired = applications.filter((a) => a.stage === 'Hired').length
    return { applied, screened, interview: reviewing, offer, hired }
  }, [applications])

  const strongMatches = useMemo(() => {
    return [...applications].sort((a, b) => b.matchScore - a.matchScore).slice(0, 6)
  }, [applications])

  const funnelDisplay = [
    { label: 'Applied', value: funnelCounts.applied },
    { label: 'Screened', value: funnelCounts.screened },
    { label: 'Interview', value: funnelCounts.interview },
    { label: 'Offer', value: funnelCounts.offer },
    { label: 'Hired', value: funnelCounts.hired },
  ]

  return (
    <DashboardLayout roleLabel="Employer" personaName="CIMB Group" personaSub="Talent Acquisition Team" sections={SECTIONS} onSwitchRole={onSwitchRole}>
      <section id="overview" className="scroll-mt-24">
        <SectionHeading eyebrow="Employer" title="Recruitment Command" italicWord="Center" description="CIMB Group · Talent Acquisition" />
        <Card className="grid grid-cols-3 gap-6 p-7">
          <StatBlock label="Avg. time-to-hire" value={String(avgTimeToHire)} suffix="days" />
          <StatBlock label="Offer acceptance rate" value={String(offerAcceptanceRate)} suffix="%" tone="positive" />
          <StatBlock label="Pipeline health" value={pipelineHealth} tone="positive" />
        </Card>
      </section>

      <section id="funnel" className="scroll-mt-24">
        <Card className="p-7">
          <p className="mb-5 text-sm font-semibold text-[#0B1E33]">
            Hiring funnel <span className="font-serif italic font-normal text-[#9A7B56]">across all open roles</span>
          </p>
          <div className="flex items-end gap-3">
            {funnelDisplay.map((s, i) => {
              const max = Math.max(1, funnelCounts.applied)
              const heightPct = Math.max(8, Math.round((s.value / max) * 100))
              return (
                <div key={s.label} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-40 w-full items-end">
                    <div
                      className="w-full rounded-t-md bg-[#0B1E33] transition-all duration-500"
                      style={{ height: `${heightPct}%`, opacity: 1 - i * 0.12 }}
                    />
                  </div>
                  <p className="font-mono text-lg font-bold text-[#0B1E33]">{s.value.toLocaleString()}</p>
                  <p className="text-xs text-[#9A7B56]">{s.label}</p>
                </div>
              )
            })}
          </div>
        </Card>
      </section>

      <section id="matches" className="scroll-mt-24">
        <Card className="p-7">
          <p className="mb-5 text-sm font-semibold text-[#0B1E33]">
            Strong matches <span className="font-serif italic font-normal text-[#9A7B56]">feed</span>
          </p>
          <div className="space-y-3">
            {strongMatches.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border border-[#EBE7E0] px-5 py-3.5 transition-all duration-500">
                <div>
                  <p className="text-sm font-semibold text-[#0B1E33]">{a.candidateName}</p>
                  <p className="text-xs text-[#9A7B56]">{a.jobRole} · {a.university.split(' (')[0]}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone="neutral">Portfolio {Math.round(a.portfolioScore)}</Badge>
                  <Badge tone={a.stage === 'Not Qualified' ? 'danger' : a.stage === 'Hired' ? 'positive' : 'indigo'}>{a.stage}</Badge>
                  <span className="font-mono text-sm font-bold text-[#0B1E33]">{Math.round(a.matchScore)}% Fit</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </DashboardLayout>
  )
}
