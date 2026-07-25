import { useAppContext } from '../../data/AppContext'
import { DEMO_CANDIDATE, COMPANIES } from '../../data/mockData'
import { Card, Badge } from '../../components/ui'

interface TodayTabProps {
  onNavigate: (id: string) => void
}

export function TodayTab({ onNavigate }: TodayTabProps) {
  const { applications, userSkills, addSkill } = useAppContext()
  const c = DEMO_CANDIDATE

  const aisyahApps = applications.filter(a => a.candidateId === c.id)
  const hasSystemDesign = userSkills.includes('System Design')
  const currentScore = hasSystemDesign ? 94 : 78

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0B1E33] tracking-tight">Good morning, {c.name.split(' ')[0]}</h2>
          <p className="text-xs text-[#6B5A44] mt-0.5">Fresh graduate &middot; BSc {c.field}, UM &middot; The Owl 🦉</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs text-emerald-800 font-medium font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
          Open to work - Kuala Lumpur
        </span>
      </div>

      <Card className="p-6 bg-[#0B1E33] text-white border-none relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#B5A88F] uppercase block">Upcoming &bull; In 2 Days</span>
            <h3 className="text-2xl font-bold tracking-tight">CIMB - Graduate Analyst Interview</h3>
            <p className="text-xs text-[#D8CFC0] leading-relaxed max-w-xl">
              Thursday, 2:00 PM. Haven lined up 8 likely questions drawn from the role and your Maybank internship — rehearse so you walk in ready.
            </p>
            <div className="pt-2 flex gap-3">
              <button onClick={() => onNavigate('haven')} className="rounded-md bg-[#9A7B56] px-4 py-2 text-xs font-semibold text-white border-none cursor-pointer">Rehearse with Haven &rarr;</button>
              <button onClick={() => onNavigate('tracker')} className="rounded-md bg-white/10 px-4 py-2 text-xs font-semibold text-white border border-white/10 cursor-pointer">View application</button>
            </div>
          </div>
          <div className="md:col-span-4 text-center md:text-right">
            <p className="font-mono text-6xl font-bold text-white">{currentScore}%</p>
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#B5A88F] mt-1">Profile Strength Score</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { val: '12', label: 'Matches this week', sub: '▲ 4 vs last week' },
          { val: aisyahApps.length.toString(), label: 'Active applications', sub: 'In status funnel' },
          { val: '2', label: 'Interviews booked', sub: 'Next: Thu 2pm' },
          { val: `Top ${hasSystemDesign ? '8%' : '15%'}`, label: 'Ecosystem Standing', sub: 'Graduating CS cohort' }
        ].map((m, idx) => (
          <Card key={idx} className="p-4 bg-white border border-[#EBE7E0]">
            <p className="font-mono text-2xl font-bold text-[#0B1E33]">{m.val}</p>
            <p className="text-[10px] font-semibold text-[#0B1E33] mt-1 tracking-tight">{m.label}</p>
            <p className="text-[9px] font-mono text-[#9A7B56] mt-0.5">{m.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#9A7B56] font-bold">Top Matches For You</h4>
          <div className="space-y-3">
            {[
              { role: 'Data Engineer', comp: 'Maybank', fit: 92, sal: 'RM 6,000 - 8,500' },
              { role: 'Graduate Analyst', comp: 'CIMB Group', fit: hasSystemDesign ? 94 : 89, sal: 'RM 4,500 - 5,500' }
            ].map((match, i) => (
              <div key={i} className="bg-white border border-[#EBE7E0] rounded-xl p-4 flex justify-between items-start shadow-2xs">
                <div>
                  <h5 className="text-sm font-bold text-[#0B1E33]">{match.role}</h5>
                  <p className="text-xs text-[#6B5A44]">{match.comp} &bull; {match.sal}</p>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">{match.fit}% fit</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#9A7B56] font-bold">From Haven</h4>
          <div className="bg-[#FAF6EE] border border-[#9A7B56]/30 rounded-xl p-4 space-y-2">
            <p className="text-xs font-bold text-[#0B1E33]">
              {hasSystemDesign ? '🎉 System Design project verified!' : '💡 Close 1 target skill gap'}
            </p>
            <p className="text-[11px] text-[#6B5A44] leading-relaxed">
              {hasSystemDesign ? 'Your credential update was successfully distributed to target enterprise recruiters.' : 'Adding a verified Docker deployment container will advance your profile score instantly.'}
            </p>
            {!hasSystemDesign && (
              <button onClick={() => addSkill('System Design')} className="w-full mt-2 rounded-md bg-[#0B1E33] text-white text-xs font-bold py-2 border-none cursor-pointer">
                Inject Docker Project Plan
              </button>
            )}
          </div>
        </div>
      </div>

      <Card className="p-5 border border-[#EBE7E0] bg-white flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl">
        <div>
          <h4 className="text-sm font-bold text-[#0B1E33]">Living Portfolio Metrics</h4>
          <p className="text-xs text-[#6B5A44]">Tracked credentials travel securely with your profile rank across target corporate funnels.</p>
        </div>
        <button onClick={() => onNavigate('portfolio')} className="rounded-md bg-[#0B1E33] text-white text-xs font-bold px-5 py-2.5 border-none cursor-pointer">
          Open Portfolio Network
        </button>
      </Card>
    </div>
  )
}