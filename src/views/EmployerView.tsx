import { useMemo, useState } from 'react'
import { useAppContext } from '../data/AppContext'
import { Card, Badge, StatBlock, SectionHeading, MiniBarRow, Eyebrow } from '../components/ui'
import { DashboardLayout, type SidebarSection } from '../components/DashboardLayout'
import { getSlaStatus, stageDisplayLabel, SLA_WINDOW_DAYS, type ApplicationRecord, type PipelineStage } from '../data/appState'
import { WORKFORCE, EXIT_SURVEYS, FAIRPAY_FEEDBACK, REJECTION_REASONS, type WorkforceRecord } from '../data/mockData'

const SECTIONS: SidebarSection[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'retention', label: 'Talent Retention Signals' },
  { id: 'fairpay', label: 'Fair-Pay Insights' },
  { id: 'tracker', label: 'Application Tracker' },
  { id: 'funnel', label: 'Hiring Funnel' },
  { id: 'matches', label: 'Strong Matches' },
]

type RiskFilter = 'All' | 'Elevated' | 'Watch' | 'Stable'

const riskTone: Record<WorkforceRecord['riskLevel'], 'danger' | 'warning' | 'positive'> = {
  Elevated: 'danger',
  Watch: 'warning',
  Stable: 'positive',
}

const slaTone: Record<string, 'danger' | 'warning' | 'positive' | 'neutral'> = {
  Breached: 'danger',
  'Due Soon': 'warning',
  'On Track': 'positive',
  Resolved: 'neutral',
}

export function EmployerView({ onSwitchRole }: { onSwitchRole: () => void }) {
  const { applications, authedName, updateApplicationStage, submitApplicationFeedback } = useAppContext()

  // LIVE LINK LOGIC: Scope the database strictly to the active authenticated employer
  const employerName = authedName || 'CIMB Group'

  const employerApps = useMemo(() => {
    return applications.filter(a => a.company === employerName)
  }, [applications, employerName])

  const companyFairPay = useMemo(() => {
    return FAIRPAY_FEEDBACK.filter(f => f.company === employerName).slice(0, 12)
  }, [employerName])

  const avgTimeToHire = 21
  const offerAcceptanceRate = 86
  const pipelineHealth = 'Strong'

  // ---- Overview -------------------------------------------------------
  const slaComplianceRate = useMemo(() => {
    const withStatus = employerApps.map((a) => getSlaStatus(a))
    const breached = withStatus.filter((s) => s === 'Breached').length
    return Math.round(((employerApps.length - breached) / Math.max(1, employerApps.length)) * 100)
  }, [employerApps])

  const funnelCounts = useMemo(() => {
    const applied = employerApps.length
    const notQualified = employerApps.filter((a) => a.stage === 'Not Qualified').length
    const screened = applied - notQualified
    const reviewing = employerApps.filter((a) => a.stage === 'Reviewing Queue' || a.stage === 'Top Tier Pool' || a.stage === 'Hired').length
    const offer = employerApps.filter((a) => a.stage === 'Top Tier Pool' || a.stage === 'Hired').length
    const hired = employerApps.filter((a) => a.stage === 'Hired').length
    return { applied, screened, interview: reviewing, offer, hired }
  }, [employerApps])

  const strongMatches = useMemo(() => {
    return [...employerApps].sort((a, b) => b.matchScore - a.matchScore).slice(0, 6)
  }, [employerApps])

  const funnelDisplay = [
    { label: 'Applied', value: funnelCounts.applied },
    { label: 'Screened', value: funnelCounts.screened },
    { label: 'Interview', value: funnelCounts.interview },
    { label: 'Offer', value: funnelCounts.offer },
    { label: 'Hired', value: funnelCounts.hired },
  ]

  // ---- Talent Retention Signals ----------------------------------------
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('Elevated')

  const riskCounts = useMemo(
    () => ({
      Elevated: WORKFORCE.filter((w) => w.riskLevel === 'Elevated').length,
      Watch: WORKFORCE.filter((w) => w.riskLevel === 'Watch').length,
      Stable: WORKFORCE.filter((w) => w.riskLevel === 'Stable').length,
    }),
    []
  )

  const filteredWorkforce = useMemo(() => {
    const pool = riskFilter === 'All' ? WORKFORCE : WORKFORCE.filter((w) => w.riskLevel === riskFilter)
    return [...pool].sort((a, b) => (b.riskLevel === 'Elevated' ? 1 : 0) - (a.riskLevel === 'Elevated' ? 1 : 0)).slice(0, 10)
  }, [riskFilter])

  // ---- Application Tracker (28-day SLA + preset feedback) --------------
  type TrackerFilter = 'Needs Response' | 'Due Soon' | 'Breached' | 'Resolved'
  const [trackerFilter, setTrackerFilter] = useState<TrackerFilter>('Needs Response')
  const [openRowId, setOpenRowId] = useState<string | null>(null)
  const [reasonDraft, setReasonDraft] = useState<Record<string, string>>({})
  const [noteDraft, setNoteDraft] = useState<Record<string, string>>({})

  const trackerRows = useMemo(() => {
    const withSla = employerApps.map((a) => ({ app: a, sla: getSlaStatus(a) }))
    let filtered: typeof withSla
    if (trackerFilter === 'Resolved') filtered = withSla.filter((r) => r.sla === 'Resolved')
    else if (trackerFilter === 'Breached') filtered = withSla.filter((r) => r.sla === 'Breached')
    else if (trackerFilter === 'Due Soon') filtered = withSla.filter((r) => r.sla === 'Due Soon')
    else filtered = withSla.filter((r) => r.sla === 'On Track' || r.sla === 'Due Soon' || r.sla === 'Breached')
    return filtered.sort((a, b) => b.app.daysSinceApplied - a.app.daysSinceApplied).slice(0, 20) // Show up to 20 for scrolling test
  }, [employerApps, trackerFilter])

  const trackerCounts = useMemo(() => {
    const withSla = employerApps.map((a) => getSlaStatus(a))
    return {
      'Needs Response': withSla.filter((s) => s === 'On Track' || s === 'Due Soon' || s === 'Breached').length,
      'Due Soon': withSla.filter((s) => s === 'Due Soon').length,
      Breached: withSla.filter((s) => s === 'Breached').length,
      Resolved: withSla.filter((s) => s === 'Resolved').length,
    }
  }, [employerApps])

  function handleDecline(app: ApplicationRecord) {
    const reason = reasonDraft[app.id] ?? REJECTION_REASONS[0]
    const note = noteDraft[app.id] ?? ''
    submitApplicationFeedback(app.id, reason, note)
    setOpenRowId(null)
  }

  return (
    <DashboardLayout roleLabel="Employer" personaName={employerName} personaSub="Talent Acquisition Team" sections={SECTIONS} onSwitchRole={onSwitchRole}>
      <section id="overview" className="scroll-mt-24">
        <SectionHeading eyebrow="Employer" title="Recruitment Command" italicWord="Center" description={`${employerName} · Talent Acquisition`} />
        <Card className="grid grid-cols-2 gap-6 p-7 sm:grid-cols-4">
          <StatBlock label="Avg. time-to-hire" value={String(avgTimeToHire)} suffix="days" />
          <StatBlock label="Offer acceptance rate" value={String(offerAcceptanceRate)} suffix="%" tone="positive" />
          <StatBlock label="Pipeline health" value={pipelineHealth} tone="positive" />
          <StatBlock
            label={`${SLA_WINDOW_DAYS}-day response SLA`}
            value={String(slaComplianceRate)}
            suffix="%"
            tone={slaComplianceRate >= 90 ? 'positive' : slaComplianceRate >= 75 ? 'warning' : 'default'}
          />
        </Card>
      </section>

      {/* ---------------- Talent Retention Signals ---------------- */}
      <section id="retention" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Retention"
          title="Talent Retention"
          italicWord="Signals"
          description="A predictive layer flags elevated resignation risk from existing profile data. A diagnostic layer captures the real reason once someone does resign — individual responses stay anonymous; only thresholded, team-level patterns roll up here."
        />

        <Card className="p-7">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-[#0B1E33]">
              Predictive layer <span className="font-serif italic font-normal text-[#9A7B56]">— behavioral risk flags</span>
            </p>
            <div className="flex items-center gap-1 rounded-full border border-[#EBE7E0] bg-[#F6F3EE] p-1">
              {(['Elevated', 'Watch', 'Stable', 'All'] as RiskFilter[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRiskFilter(r)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    riskFilter === r ? 'bg-[#0B1E33] text-white' : 'text-[#6B5A44] hover:text-[#0B1E33]'
                  }`}
                >
                  {r} {r !== 'All' && `(${riskCounts[r]})`}
                </button>
              ))}
            </div>
          </div>

          <p className="mb-4 text-xs text-[#6B5A44]">
            {WORKFORCE.length} employees monitored across {new Set(WORKFORCE.map((w) => w.team)).size} teams · signals are drawn from onboarding and profile data already on file — no new documents collected.
          </p>

          <div className="space-y-2">
            {filteredWorkforce.map((w) => (
              <div key={w.id} className="rounded-lg border border-[#EBE7E0] px-5 py-3.5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#0B1E33]">{w.name}</p>
                    <p className="text-xs text-[#9A7B56]">{w.role} · {w.team} · {w.tenureMonths} mo tenure · reports to {w.managerName}</p>
                  </div>
                  <Badge tone={riskTone[w.riskLevel]}>{w.riskLevel} risk</Badge>
                </div>
                {w.riskSignals.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {w.riskSignals.map((s) => (
                      <span key={s} className="rounded-md border border-[#EBE7E0] bg-[#FAF8F5] px-2 py-1 text-[11px] text-[#6B5A44]">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {filteredWorkforce.length === 0 && (
              <p className="rounded-lg border border-dashed border-[#EBE7E0] px-5 py-6 text-center text-xs text-[#9A7B56]">
                No employees in this risk band right now.
              </p>
            )}
          </div>
        </Card>

        <Card className="mt-6 p-7">
          <p className="mb-1.5 text-sm font-semibold text-[#0B1E33]">
            Diagnostic layer <span className="font-serif italic font-normal text-[#9A7B56]">— anonymized exit themes, Q2 2026</span>
          </p>
          <p className="mb-5 text-xs text-[#6B5A44]">
            Teams below a 3-respondent threshold are intentionally left un-broken-down here to protect individual anonymity.
          </p>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {EXIT_SURVEYS.map((row) => (
              <div key={row.team} className="rounded-xl border border-[#EBE7E0] bg-[#FAF8F5] p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#0B1E33]">{row.team}</p>
                  <Badge tone="neutral">{row.respondentCount} respondent{row.respondentCount === 1 ? '' : 's'}</Badge>
                </div>
                {row.thresholdMet ? (
                  <div className="space-y-2.5">
                    <MiniBarRow label="Management" pct={row.themes.management} tone="indigo" />
                    <MiniBarRow label="Workload" pct={row.themes.workload} tone="amber" />
                    <MiniBarRow label="Pay" pct={row.themes.pay} tone="indigo" />
                    <MiniBarRow label="Growth" pct={row.themes.growth} tone="amber" />
                    <p className="pt-1.5 text-[11px] italic text-[#6B5A44]">{row.topThemeNote}</p>
                  </div>
                ) : (
                  <p className="rounded-lg border border-dashed border-[#EBE7E0] bg-white px-3 py-4 text-center text-[11px] text-[#9A7B56]">
                    Not enough respondents yet to preserve anonymity.
                  </p>
                )}
              </div>
            ))}
          </div>
          <p className="mt-5 text-[11px] text-[#9A7B56]">
            Suggested cadence: a quarterly sync between HR and each team lead to review root causes and agree on actions where a signal was triggered.
          </p>
        </Card>
      </section>

      {/* ---------------- Fair-Pay Insights (secondary/aggregated) ---------------- */}
      <section id="fairpay" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Fair-Pay Engine"
          title="Applicant Fair-Pay"
          italicWord="Insights"
          description="Candidates are the primary user of the Fair-Pay Engine. This is a secondary, aggregated view — how applicants rated disposable income for your open roles — never an individual candidate's worksheet."
        />
        <Card className="p-7">
          <div className="space-y-4">
            {companyFairPay.map((f) => (
              <div key={f.jobId} className="rounded-lg border border-[#EBE7E0] px-5 py-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#0B1E33]">{f.role}</p>
                  <span className="font-mono text-xs text-[#9A7B56]">{f.respondentCount} candidate ratings</span>
                </div>
                <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-[#F1EDE5]">
                  <div className="h-full bg-emerald-500" style={{ width: `${f.pctComfortable}%` }} title="Comfortable" />
                  <div className="h-full bg-[#9A7B56]" style={{ width: `${f.pctTight}%` }} title="Tight" />
                  <div className="h-full bg-rose-400" style={{ width: `${f.pctNotSustainable}%` }} title="Not sustainable" />
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#6B5A44]">
                  <span>
                    <span className="font-semibold text-emerald-700">{f.pctComfortable}% Comfortable</span> ·{' '}
                    <span className="font-semibold text-[#9A7B56]">{f.pctTight}% Tight</span> ·{' '}
                    <span className="font-semibold text-rose-600">{f.pctNotSustainable}% Not sustainable</span>
                  </span>
                  <span className="font-mono">
                    Avg. est. disposable: <span className={f.avgDisposable >= 0 ? 'text-emerald-700' : 'text-rose-600'}>RM {f.avgDisposable.toLocaleString()}</span>/mo
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* ---------------- Application Tracker (SLA + preset feedback + Status Editor) ---------------- */}
      <section id="tracker" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Application Tracker"
          title="Live Candidate"
          italicWord="Pipeline"
          description={`Manage live applications for ${employerName}. Change the dropdowns below to instantly notify candidates and shift them across your Kanban funnels.`}
        />
        <Card className="p-7">
          <div className="mb-5 flex items-center gap-1 rounded-full border border-[#EBE7E0] bg-[#F6F3EE] p-1 w-fit">
            {(['Needs Response', 'Due Soon', 'Breached', 'Resolved'] as TrackerFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setTrackerFilter(f)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  trackerFilter === f ? 'bg-[#0B1E33] text-white' : 'text-[#6B5A44] hover:text-[#0B1E33]'
                }`}
              >
                {f} ({trackerCounts[f]})
              </button>
            ))}
          </div>

          <div className="space-y-2.5">
            {trackerRows.map(({ app, sla }) => {
              const isOpen = openRowId === app.id
              const canDecide = sla !== 'Resolved'
              return (
                <div key={app.id} className="rounded-lg border border-[#EBE7E0] px-5 py-3.5 transition-colors hover:border-[#9A7B56]">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#0B1E33]">{app.candidateName}</p>
                      <p className="text-xs text-[#9A7B56]">{app.jobRole} · {app.university.split(' (')[0]} · Day {app.daysSinceApplied} of {SLA_WINDOW_DAYS}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge tone={slaTone[sla]}>{sla}</Badge>
                      
                      {/* LIVE LINK: This Dropdown controls the state, making the candidate-employer workflow truly live */}
                      <select 
                        value={app.stage} 
                        onChange={(e) => updateApplicationStage(app.id, e.target.value as PipelineStage)}
                        className="border border-[#EBE7E0] bg-[#FAF8F5] text-[10px] uppercase font-mono px-3 py-1.5 rounded-md font-bold text-[#0B1E33] outline-none focus:border-[#9A7B56] cursor-pointer"
                      >
                        <option value="Queueing">Queueing</option>
                        <option value="Reviewing Queue">Reviewing Queue</option>
                        <option value="Top Tier Pool">Top Tier Pool</option>
                        <option value="Hired">Hired (Offer Accepted)</option>
                        <option value="Not Qualified">Not Qualified / Rejected</option>
                      </select>

                      {canDecide && (
                        <button
                          onClick={() => setOpenRowId(isOpen ? null : app.id)}
                          className="rounded-full border border-[#EBE7E0] px-3.5 py-1.5 text-[10px] font-mono font-medium text-[#6B5A44] hover:bg-[#F6F3EE] cursor-pointer"
                        >
                          {isOpen ? 'Close' : 'Feedback'}
                        </button>
                      )}
                    </div>
                  </div>

                  {app.stage === 'Not Qualified' && (app.employerFeedbackReason || app.employerNote) && (
                    <p className="mt-2 text-[11px] text-[#6B5A44] bg-rose-50 p-2 rounded">
                      Feedback sent: <span className="font-medium text-[#0B1E33]">{app.employerFeedbackReason}</span>
                      {app.employerNote && <span className="italic"> — "{app.employerNote}"</span>}
                    </p>
                  )}

                  {isOpen && (
                    <div className="mt-3.5 space-y-3 rounded-lg border border-[#EBE7E0] bg-[#FAF8F5] p-4">
                      <div>
                        <Eyebrow>Advance Candidate</Eyebrow>
                        <button
                          onClick={() => updateApplicationStage(app.id, 'Top Tier Pool')}
                          className="mt-1.5 rounded-full bg-[#0B1E33] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#132A47] cursor-pointer border-none"
                        >
                          Move to Top Tier Pool
                        </button>
                      </div>
                      <div className="pt-2 border-t border-[#EBE7E0]">
                        <Eyebrow>Or send "Not a match this time"</Eyebrow>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {REJECTION_REASONS.map((r) => (
                            <button
                              key={r}
                              onClick={() => setReasonDraft((prev) => ({ ...prev, [app.id]: r }))}
                              className={`rounded-full border px-3 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                                (reasonDraft[app.id] ?? REJECTION_REASONS[0]) === r
                                  ? 'border-[#0B1E33] bg-[#0B1E33] text-white'
                                  : 'border-[#EBE7E0] bg-white text-[#6B5A44] hover:bg-[#F6F3EE]'
                              }`}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          maxLength={120}
                          placeholder="Optional one-line addition for the candidate…"
                          value={noteDraft[app.id] ?? ''}
                          onChange={(e) => setNoteDraft((prev) => ({ ...prev, [app.id]: e.target.value }))}
                          className="mt-2 w-full rounded-lg border border-[#EBE7E0] bg-white px-3.5 py-2 text-xs outline-none focus:border-[#9A7B56]"
                        />
                        <button
                          onClick={() => handleDecline(app)}
                          className="mt-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100 cursor-pointer"
                        >
                          Send decision
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            {trackerRows.length === 0 && (
              <p className="rounded-lg border border-dashed border-[#EBE7E0] px-5 py-6 text-center text-xs text-[#9A7B56]">
                Nothing in this view right now.
              </p>
            )}
          </div>
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
                  <Badge tone={a.stage === 'Not Qualified' ? 'danger' : a.stage === 'Hired' ? 'positive' : 'indigo'}>{stageDisplayLabel(a.stage)}</Badge>
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