import { useMemo, useState } from 'react'
import type { ApplicationRecord } from '../data/appState'
import { DEMO_CANDIDATE } from '../data/mockData'
import type { JobPosting } from '../data/mockData'
import { useAppContext } from '../data/AppContext'

export type ViewKey = 'candidate' | 'employer' | 'university'

interface Message {
  id: number
  from: 'haven' | 'user'
  text: string
}

interface Chip {
  label: string
  reply: string
}

function buildChips(view: ViewKey, applications: ApplicationRecord[], selectedJob: JobPosting): Chip[] {
  const aisyahApp = applications.find((a) => a.candidateId === DEMO_CANDIDATE.id)

  if (view === 'candidate') {
    const matchLine = aisyahApp
      ? `Your match score for ${aisyahApp.jobRole} at ${aisyahApp.company} is currently ${Math.round(aisyahApp.matchScore)}%, based on your portfolio strength (${Math.round(aisyahApp.portfolioScore)}) and verified credentials.`
      : 'Your match score updates live as your portfolio strengthens.'
    const stageLine = aisyahApp
      ? aisyahApp.stage === 'Not Qualified'
        ? `Your application is currently in Not Qualified because of a missing ${aisyahApp.missingSkills.join(', ') || 'skill'}. Head to the Application Tracker tab and use my suggestion to close that gap.`
        : `Your application has moved into ${aisyahApp.stage} — nice work closing that skill gap.`
      : 'No active application found yet.'
    return [
      { label: 'Why is my match score what it is?', reply: matchLine },
      { label: 'What is blocking my application?', reply: stageLine },
      {
        label: 'Is this offer fair pay?',
        reply: `Based on ${selectedJob.cityTier} cost-of-living and the offer range for ${selectedJob.role}, I would compare the calculated disposable income against the market baseline shown in the Fair Pay Engine worksheet before accepting.`,
      },
    ]
  }

  if (view === 'employer') {
    const notQualifiedCount = applications.filter((a) => a.stage === 'Not Qualified').length
    const topTier = applications.filter((a) => a.stage === 'Top Tier Pool').length
    return [
      {
        label: 'Why is time-to-hire rising?',
        reply: `${notQualifiedCount} applications in your pipeline are currently flagged Not Qualified, mostly due to skill-verification gaps — that's widening the screening stage this cycle.`,
      },
      {
        label: 'Suggest a stronger shortlist',
        reply: `You have ${topTier} candidates in the Top Tier Pool right now. I'd prioritise those first, then review the Reviewing Queue for anyone close to clearing verification.`,
      },
      {
        label: 'Explain offer acceptance rate',
        reply: 'Acceptance rate tracks closely with offers that clear the market-rate baseline for a candidate\u2019s city tier. Offers below that baseline see more declines.',
      },
    ]
  }

  const atRiskHint = 'Students with zero active applications close to graduation are automatically surfaced in the At Risk filter so your team can prioritise outreach.'
  return [
    { label: 'Which faculty needs support?', reply: 'Check the Inter-faculty benchmarks card — the faculty with the lowest employability rate this cycle should get first priority for portfolio-review workshops.' },
    { label: 'Who is At Risk this term?', reply: atRiskHint },
    { label: 'Compare us to last intake', reply: 'Median time-to-first-job has been trending down versus last intake, largely driven by stronger Computer Science placement outcomes.' },
  ]
}

export function Haven({ view }: { view: ViewKey | null }) {
  const [open, setOpen] = useState(false)
  const { applications, selectedJob } = useAppContext()

  const [messages, setMessages] = useState<Message[]>([
    { id: 0, from: 'haven', text: 'Hi, I\u2019m Haven \u2014 your AI career concept assistant. Ask me anything, or tap a suggestion below.' },
  ])

  const chips = useMemo(() => (view ? buildChips(view, applications, selectedJob) : []), [view, applications, selectedJob])

  function handleChip(chip: Chip) {
    setMessages((m) => [
      ...m,
      { id: m.length, from: 'user', text: chip.label },
      { id: m.length + 1, from: 'haven', text: chip.reply },
    ])
  }

  if (!view) return null

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 flex h-[420px] w-80 flex-col overflow-hidden rounded-xl border border-[#EBE7E0] bg-white shadow-xl">
          <div className="flex items-center gap-2 border-b border-[#EBE7E0] bg-[#0B1E33] px-4 py-3">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-sm font-medium text-white">Haven</span>
            <span className="ml-auto font-mono text-[10px] uppercase tracking-wide text-[#B5A88F]">Simulated · Concept only</span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#FDFBF9] px-4 py-3">
            {messages.map((m) => (
              <div key={m.id} className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
                m.from === 'haven' ? 'bg-white border border-[#EBE7E0] text-[#0B1E33]' : 'ml-auto bg-[#0B1E33] text-white'
              }`}>
                {m.text}
              </div>
            ))}
          </div>

          <div className="border-t border-[#EBE7E0] bg-white p-3">
            <div className="flex flex-wrap gap-1.5">
              {chips.map((c) => (
                <button
                  key={c.label}
                  onClick={() => handleChip(c)}
                  className="rounded-full border border-[#9A7B56]/30 bg-[#9A7B56]/10 px-2.5 py-1 text-[11px] font-medium text-[#8A6C48] hover:bg-[#9A7B56]/20"
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0B1E33] text-white shadow-lg transition-transform hover:scale-105"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        ) : (
          <span className="font-serif italic text-sm font-semibold">Haven</span>
        )}
      </button>
    </div>
  )
}
