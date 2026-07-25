import { useMemo } from 'react'
import { useAppContext } from '../../data/AppContext'
import { DEMO_CANDIDATE, JOBS } from '../../data/mockData'
import { Card, ProgressBar, SectionHeading, BaselineSlider, Eyebrow } from '../../components/ui'

export function DiscoverTab() {
  const { selectedJobId, setSelectedJobId, rentInput, setRentInput, livingInput, setLivingInput, transportInput, setTransportInput } = useAppContext()
  const c = DEMO_CANDIDATE

  const targetedMatches = useMemo(() => {
    return JOBS.filter(j => j.field === c.field || j.field === 'Computer Science')
      .slice(0, 4)
      .map(j => ({ ...j, fitRate: Math.min(96, 75 + (j.salaryMin % 20)) }))
  }, [c.field])

  const selectedJob = targetedMatches.find(m => m.id === selectedJobId) || targetedMatches[0]

  const grossSalary = Math.round((selectedJob.salaryMin + selectedJob.salaryMax) / 2)
  const incomeTax = Math.round(grossSalary * 0.05)
  const monthlyDisposable = grossSalary - (rentInput + livingInput + transportInput + incomeTax)

  return (
    <div className="space-y-6">
      <SectionHeading 
        eyebrow="Discover" 
        title="Open Market" 
        italicWord="Opportunities" 
        description="Select an active role listing below to calibrate living expenses and run baseline market compensation analysis." 
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {targetedMatches.map((m) => (
          <button key={m.id} onClick={() => setSelectedJobId(m.id)} className="text-left bg-transparent border-none p-0 outline-none w-full cursor-pointer">
            <Card className={`p-5 transition-all bg-white border ${m.id === selectedJobId ? 'ring-2 ring-[#0B1E33] border-transparent shadow-md' : 'border-[#EBE7E0] hover:shadow-sm'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-[#0B1E33]">{m.role}</p>
                  <p className="text-xs text-[#9A7B56]">{m.company}</p>
                </div>
                <span className="font-mono text-xs font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-sm">{m.fitRate}% match</span>
              </div>
              <div className="mt-3"><ProgressBar value={m.fitRate} tone="emerald" /></div>
              <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[#6B5A44]">
                <span>RM {m.salaryMin.toLocaleString()} – {m.salaryMax.toLocaleString()}</span>
                <span className="text-neutral-400">📍 KL Region</span>
              </div>
            </Card>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 rounded-xl border border-[#EBE7E0] bg-white p-5 space-y-4 shadow-2xs">
          <h4 className="text-xs font-mono uppercase tracking-wider text-[#9A7B56] font-bold">Dynamic Budget Calibration</h4>
          
          <div className="space-y-1">
            <label className="block text-[10px] font-mono uppercase text-[#9A7B56]">Target Rent (RM/mo)</label>
            <input type="number" value={rentInput} onChange={(e) => setRentInput(Number(e.target.value))} className="w-full rounded-lg border border-[#EBE7E0] bg-[#FAF8F5] p-2 text-xs text-[#0B1E33] outline-none" />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-mono uppercase text-[#9A7B56]">Living &amp; Food Costs (RM/mo)</label>
            <input type="number" value={livingInput} onChange={(e) => setLivingInput(Number(e.target.value))} className="w-full rounded-lg border border-[#EBE7E0] bg-[#FAF8F5] p-2 text-xs text-[#0B1E33] outline-none" />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-mono uppercase text-[#9A7B56]">Commute &amp; Transport (RM/mo)</label>
            <input type="number" value={transportInput} onChange={(e) => setTransportInput(Number(e.target.value))} className="w-full rounded-lg border border-[#EBE7E0] bg-[#FAF8F5] p-2 text-xs text-[#0B1E33] outline-none" />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <Card className="p-6 bg-white border border-[#EBE7E0] rounded-xl shadow-2xs">
            <div className="mb-4">
              <Eyebrow>Fair Pay Engine Workspace</Eyebrow>
              <h4 className="text-base font-bold text-[#0B1E33] mt-0.5">{selectedJob.role} &middot; <span className="font-serif text-[#9A7B56] font-normal italic">{selectedJob.company}</span></h4>
            </div>

            <div className="divide-y divide-[#EBE7E0] text-xs space-y-2.5">
              <div className="flex justify-between items-baseline pt-2">
                <span className="text-[#6B5A44]">Estimated Gross Offer (Median)</span>
                <span className="font-mono font-bold text-[#0B1E33]">RM {grossSalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2">
                <span className="text-[#6B5A44]">Estimated Statutory Deduction (Tax/EPF)</span>
                <span className="font-mono text-[#9A7B56]">-RM {incomeTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 bg-[#FAF8F5] p-2 rounded-md">
                <span className="font-bold text-[#0B1E33]">Dynamic Calculated Disposable Income</span>
                <span className={`font-mono font-bold text-sm ${monthlyDisposable > 1000 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  RM {monthlyDisposable.toLocaleString()} / mo
                </span>
              </div>
            </div>

            <div className="mt-6">
              <BaselineSlider 
                value={grossSalary}
                max={9000}
                baseline={3800}
                valueLabel={`Calculated Median Pay: RM ${grossSalary.toLocaleString()}`}
                baselineLabel="National CS Baseline: RM 3,800"
              />
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-6 bg-white border border-[#EBE7E0] rounded-xl space-y-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#9A7B56] block">Ecosystem Calibration Index</span>
          <h4 className="text-base font-bold text-[#0B1E33] mt-0.5">Market Distribution Profile Range</h4>
          <p className="text-xs text-[#6B5A44] leading-relaxed mt-1">
            Most people find out they are underpaid by accident, or never know how to push back when their boss says no. This module checks your pay against what people in similar roles are actually earning, tells you if there's a gap, and helps you figure out how to bring it up before your next scheduled performance review.
          </p>
        </div>

        <div className="pt-6 pb-2">
          <div className="flex items-end justify-between gap-4 h-28 max-w-md mx-auto">
            {[
              { height: '40%', label: '25th Pct', amt: 'RM 3.6k', active: false },
              { height: '65%', label: '50th Pct', amt: 'RM 4.2k', active: false },
              { height: '90%', label: '75th Pct (Ecosystem Target)', amt: `RM ${(grossSalary/1000).toFixed(1)}k`, active: true },
              { height: '55%', label: '90th Pct', amt: 'RM 6.8k', active: false }
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="font-mono text-[9px] text-[#9A7B56] font-bold">{bar.amt}</span>
                <div 
                  className={`w-full rounded-t-sm transition-all duration-300 ${bar.active ? 'bg-[#0B1E33]' : 'bg-[#EBE7E0]'}`}
                  style={{ height: bar.height }}
                />
                <span className={`text-[9px] font-mono text-center tracking-tight leading-none ${bar.active ? 'text-[#0B1E33] font-bold' : 'text-[#6B5A44]'}`}>{bar.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}