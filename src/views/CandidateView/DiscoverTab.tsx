import { useMemo, useState } from 'react'
import { useAppContext } from '../../data/AppContext'
import { DEMO_CANDIDATE, MARKET_MIN_SALARY, JOBS, CANDIDATES, type FieldKey } from '../../data/mockData'
import { Card, SectionHeading, BaselineSlider, Eyebrow} from '../../components/ui'

export function DiscoverTab() {
  const { 
    authedName, // FIXED: Grab real session user name instead of candidateProfile
    selectedJobId, 
    setSelectedJobId, 
    rentInput, 
    setRentInput, 
    livingInput, 
    setLivingInput, 
    transportInput, 
    setTransportInput,
    applyToJob,
    hasApplied
  } = useAppContext()
  
  // Use the active logged in user profile matched by name, otherwise fallback
  const c = useMemo(() => {
    return CANDIDATES.find(cand => cand.name === authedName) || DEMO_CANDIDATE
  }, [authedName])

  // Extended dynamic modifier variables
  const [dependants, setDependants] = useState<number>(0)
  const [apparelInput, setApparelInput] = useState<number>(200)
  const [socialInput, setSocialInput] = useState<number>(350)
  const [householdInput, setHouseholdInput] = useState<number>(150)
  const [educationInput, setEducationInput] = useState<number>(0)
  const [petInput, setPetInput] = useState<number>(0)
  const [insuranceInput, setInsuranceInput] = useState<number>(300)
  const [othersInput, setOthersInput] = useState<number>(100)
  
  // Interface visibility switches
  const [showNegotiationScript, setShowNegotiationScript] = useState<boolean>(false)
  const [isExplorerOpen, setIsExplorerOpen] = useState<boolean>(false)
  const [explorerSearch, setExplorerSearch] = useState<string>('')

  // Dynamically extract targeted matching roles using the live session user's field
  const targetedMatches = useMemo(() => {
    return JOBS.filter(j => j.field === c.field || j.field === 'Computer Science')
      .map(j => ({ ...j, fitRate: Math.min(97, 70 + (j.salaryMin % 26)) }))
      .sort((a, b) => b.fitRate - a.fitRate)
  }, [c.field])

  const selectedJob = JOBS.find(m => m.id === selectedJobId) || targetedMatches[0] || JOBS[0]
  const alreadyApplied = hasApplied(selectedJob.id)

  // Dynamic Multi-Tier Compensation Data Mapping (FIXED: Casted to FieldKey)
  const tierBenchmarks = useMemo(() => {
    const base = MARKET_MIN_SALARY[selectedJob.field as FieldKey] || 3800
    return {
      'Tier 1 (KL/Selangor)': { min: base, max: Math.round(base * 1.5), label: 'Tier 1 (KL / Selangor Cluster)' },
      'Tier 2 (Penang/JB)': { min: Math.round(base * 0.85), max: Math.round(base * 1.3), label: 'Tier 2 (Penang / JB Cluster)' },
      'Tier 3 (Other states)': { min: Math.round(base * 0.65), max: Math.round(base * 1.05), label: 'Tier 3 (Regional / Other States)' }
    }
  }, [selectedJob.field])

  // Fair Pay Calculations
  const grossSalary = Math.round((selectedJob.salaryMin + selectedJob.salaryMax) / 2)
  const incomeTax = Math.round(grossSalary * 0.05)
  const dependantCostMultiplier = dependants * 350

  const totalExpenses = 
    rentInput + 
    livingInput + 
    transportInput + 
    apparelInput + 
    socialInput + 
    householdInput + 
    educationInput + 
    othersInput + 
    incomeTax + 
    dependantCostMultiplier

  const monthlyDisposable = grossSalary - totalExpenses
  const marketBaseline = MARKET_MIN_SALARY[c.field as FieldKey] || 3800 // FIXED: Casted to FieldKey

  // Filtered all jobs pool for the Explorer Drawer Modal
  const filteredExplorerJobs = useMemo(() => {
    return JOBS.filter(j => 
      j.role.toLowerCase().includes(explorerSearch.toLowerCase()) ||
      j.company.toLowerCase().includes(explorerSearch.toLowerCase()) ||
      j.location.toLowerCase().includes(explorerSearch.toLowerCase())
    ).slice(0, 15)
  }, [explorerSearch])

  // Negotiation Script Output Data
  const negotiationPoints = useMemo(() => {
    return {
      opening: `Thank you for extending the offer for the ${selectedJob.role} role at ${selectedJob.company}. I am excited about the opportunity to contribute to the team.`,
      market: `Looking at verified market indicators for ${selectedJob.field} roles within the ${selectedJob.cityTier} environment, the baseline standard clusters around RM ${tierBenchmarks[selectedJob.cityTier]?.min.toLocaleString()}.`,
      ask: `Given my matching background metrics, I want to ensure my compensation aligns with localized cost structures. Can we discuss adjusting the baseline package toward RM ${Math.round(grossSalary * 1.08).toLocaleString()} to optimize this partnership?`
    }
  }, [selectedJob, grossSalary, tierBenchmarks])

  return (
    <div className="space-y-6 relative">
      
      {/* Header View Options Wrapper */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <SectionHeading 
            eyebrow="Fair Pay Core" 
            title="Open Market" 
            italicWord="Opportunities" 
            description={`Calibrate your localized expenses against active corporate job updates matching your ${c.field} profile.`}
          />
        </div>
        <button 
          onClick={() => setIsExplorerOpen(true)}
          className="rounded-full bg-[#0B1E33] px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider text-white border-none cursor-pointer hover:bg-[#1C3554] transition-all shadow-sm shrink-0 self-start sm:self-center"
        >
          🔍 Open Global Market Directory
        </button>
      </div>

      {/* Suggested Matches Stream Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {targetedMatches.slice(0, 4).map((m) => (
          <button key={m.id} onClick={() => setSelectedJobId(m.id)} className="text-left bg-transparent border-none p-0 outline-none w-full cursor-pointer">
            <Card className={`p-4 transition-all bg-white border h-full flex flex-col justify-between ${m.id === selectedJobId ? 'ring-2 ring-[#0B1E33] border-transparent shadow-sm' : 'border-[#EBE7E0] hover:shadow-2xs'}`}>
              <div>
                <div className="flex justify-between items-start gap-2">
                  <p className="text-xs font-bold text-[#0B1E33] truncate">{m.role}</p>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-sm bg-emerald-50 text-emerald-800 shrink-0">{m.fitRate}% fit</span>
                </div>
                <p className="text-[11px] text-[#9A7B56] truncate mt-0.5">{m.company}</p>
              </div>
              <div className="mt-4 text-[10px] font-mono text-[#6B5A44] border-t border-[#F1EDE5] pt-2 flex justify-between">
                <span className="font-semibold text-[#0B1E33]">RM {m.salaryMin.toLocaleString()}</span>
                <span className="opacity-70">📍 {m.location}</span>
              </div>
            </Card>
          </button>
        ))}
      </div>

      {/* Interactive Main Calculations Layout Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Beautiful Personalized Cost Modifiers Card Form */}
        <div className="lg:col-span-4 rounded-xl border border-[#EBE7E0] bg-white p-5 space-y-5 shadow-sm">
          <div>
            <h4 className="text-s font-mono uppercase tracking-wider text-[#0B1E33] font-bold">Personalized Cost Modifiers</h4>
            <p className="text-[11px] text-[#6B5A44] mt-0.5">Enter your real monthly commitments below to update variables live.</p>
          </div>

          <div className="space-y-3 bg-[#FAF8F5] p-5 rounded-xl border border-[#EBE7E0]/70">
            <div className="space-y-1">
              <label className="block text-[10px] font-mono uppercase text-[#9A7B56] font-bold">Rental Costs (RM/mo)</label>
              <input 
                type="number" 
                value={rentInput} 
                onChange={(e) => setRentInput(Math.max(0, Number(e.target.value)))} 
                className="w-full rounded-lg border border-[#EBE7E0] bg-white px-3 py-2 text-sm text-[#0B1E33] font-mono outline-none focus:border-[#9A7B56] shadow-2xs" 
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-mono uppercase text-[#9A7B56] font-bold">Number of Dependants</label>
              <input 
                type="number" 
                min="0" 
                max="6" 
                value={dependants} 
                onChange={(e) => setDependants(Math.max(0, Number(e.target.value)))} 
                className="w-full rounded-lg border border-[#EBE7E0] bg-white px-3 py-2 text-sm text-[#0B1E33] font-mono outline-none focus:border-[#9A7B56] shadow-2xs" 
              />
            </div>
          </div>

          <div className="space-y-7 border-t border-[#EBE7E0]/60 pt-4">
            <span className="text-[14px] font-mono uppercase tracking-widest text-[#9A7B56] block font-bold">Itemized Monthly Outflow</span>
            
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="block text-[10px] text-[#6B5A44] font-medium">Food &amp; Health</label>
                <input type="number" value={livingInput} onChange={(e) => setLivingInput(Number(e.target.value))} className="w-full rounded-md border border-[#EBE7E0] bg-[#FAF8F5] p-2 text-xs font-mono text-[#0B1E33] outline-none" />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] text-[#6B5A44] font-medium">Transit &amp; Petrol</label>
                <input type="number" value={transportInput} onChange={(e) => setTransportInput(Number(e.target.value))} className="w-full rounded-md border border-[#EBE7E0] bg-[#FAF8F5] p-2 text-xs font-mono text-[#0B1E33] outline-none" />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] text-[#6B5A44] font-medium">Apparel &amp; Gear</label>
                <input type="number" value={apparelInput} onChange={(e) => setApparelInput(Number(e.target.value))} className="w-full rounded-md border border-[#EBE7E0] bg-[#FAF8F5] p-2 text-xs font-mono text-[#0B1E33] outline-none" />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] text-[#6B5A44] font-medium">Social &amp; Leisure</label>
                <input type="number" value={socialInput} onChange={(e) => setSocialInput(Number(e.target.value))} className="w-full rounded-md border border-[#EBE7E0] bg-[#FAF8F5] p-2 text-xs font-mono text-[#0B1E33] outline-none" />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] text-[#6B5A44] font-medium">Households</label>
                <input type="number" value={householdInput} onChange={(e) => setHouseholdInput(Number(e.target.value))} className="w-full rounded-md border border-[#EBE7E0] bg-[#FAF8F5] p-2 text-xs font-mono text-[#0B1E33] outline-none" />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] text-[#6B5A44] font-medium">Education</label>
                <input type="number" value={educationInput} onChange={(e) => setEducationInput(Number(e.target.value))} className="w-full rounded-md border border-[#EBE7E0] bg-[#FAF8F5] p-2 text-xs font-mono text-[#0B1E33] outline-none" />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] text-[#6B5A44] font-medium">Pets</label>
                <input type="number" value={petInput} onChange={(e) => setPetInput(Number(e.target.value))} className="w-full rounded-md border border-[#EBE7E0] bg-[#FAF8F5] p-2 text-xs font-mono text-[#0B1E33] outline-none" />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] text-[#6B5A44] font-medium">Insurances & Loans</label>
                <input type="number" value={insuranceInput} onChange={(e) => setInsuranceInput(Number(e.target.value))} className="w-full rounded-md border border-[#EBE7E0] bg-[#FAF8F5] p-2 text-xs font-mono text-[#0B1E33] outline-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] text-[#6B5A44] font-medium">Others</label>
              <input type="number" value={othersInput} onChange={(e) => setOthersInput(Number(e.target.value))} className="w-full rounded-md border border-[#EBE7E0] bg-[#FAF8F5] p-2 text-xs font-mono text-[#0B1E33] outline-none" />
            </div>
          </div>
        </div>

        {/* Right-Hand Column Workspace Display Layout Area */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. Dynamic Geographic Multi-Tier Horizontal Bar Chart Component */}
          <Card className="p-6 bg-white border border-[#EBE7E0] rounded-xl space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#9A7B56] font-bold block">Comparative Telemetry Matrix</span>
              <h5 className="text-sm font-bold text-[#0B1E33] mt-0.5">Macro Cross-Tier Compensation Distribution By Region</h5>
              <p className="text-xs text-[#6B5A44] leading-relaxed mt-1">
                The targeted zone matching your currently selected active job posting is highlighted in gold.
              </p>
            </div>

            {/* Structured Multi-Tier Graphic Stack */}
            <div className="space-y-3 pt-1">
              {(Object.keys(tierBenchmarks) as Array<keyof typeof tierBenchmarks>).map((tierKey) => {
                const tier = tierBenchmarks[tierKey]
                const isSelectedZone = selectedJob.cityTier === tierKey
                
                return (
                  <div key={tierKey} className={`p-3 rounded-lg border transition-all ${isSelectedZone ? 'bg-[#FAF6EE] border-[#9A7B56] shadow-2xs' : 'bg-[#FAF8F5] border-[#EBE7E0]/60 opacity-70'}`}>
                    <div className="flex justify-between items-baseline text-xs mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${isSelectedZone ? 'bg-[#9A7B56]' : 'bg-neutral-400'}`} />
                        <span className={`font-mono text-xs ${isSelectedZone ? 'text-[#0B1E33] font-bold' : 'text-[#6B5A44]'}`}>{tier.label}</span>
                      </div>
                      <span className="font-mono font-bold text-[#0B1E33]">RM {tier.min.toLocaleString()} - {tier.max.toLocaleString()}</span>
                    </div>
                    {/* Horizontal capacity fill element */}
                    <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden relative">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${isSelectedZone ? 'bg-[#0B1E33]' : 'bg-[#9A7B56]/60'}`}
                        style={{ width: tierKey === 'Tier 1 (KL/Selangor)' ? '90%' : tierKey === 'Tier 2 (Penang/JB)' ? '70%' : '50%' }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* 2. Side-by-Side Verification Display Matrix Column */}
          <Card className="p-6 bg-white border border-[#EBE7E0] rounded-xl shadow-xs">
            
            {/* Main Title Row with Working Live Application Dispatch Trigger */}
            <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FAF8F5] pb-4">
              <div>
                <Eyebrow>Fair Pay Calculation Workspace</Eyebrow>
                <h4 className="text-base font-bold text-[#0B1E33] mt-0.5">{selectedJob.role} &middot; <span className="font-serif text-[#9A7B56] font-normal italic">{selectedJob.company}</span></h4>
                <p className="text-[11px] text-[#9A7B56] font-mono mt-0.5">📍 Core Location: {selectedJob.location} ({selectedJob.cityTier})</p>
              </div>
              <button
                disabled={alreadyApplied}
                onClick={() => applyToJob(selectedJob.id)}
                className={`rounded-full px-6 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all border-none shadow-2xs ${
                  alreadyApplied 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-not-allowed' 
                    : 'bg-[#0B1E33] text-white hover:bg-[#1C3554] cursor-pointer'
                }`}
              >
                {alreadyApplied ? '✓ Application Submitted' : '⚡ Submit Profile Package'}
              </button>
            </div>

            {/* Split Parity Analytics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-[#EBE7E0] pb-6 mb-6">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-[#9A7B56] tracking-wider block font-bold">1. Range Benchmark</span>
                <div className="bg-[#FAF8F5] p-3 rounded-lg border border-[#EBE7E0] space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#6B5A44]">Offered Scope:</span>
                    <span className="font-mono text-[#0B1E33] font-bold">RM {selectedJob.salaryMin.toLocaleString()} - {selectedJob.salaryMax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B5A44]">Ecosystem Floor:</span>
                    <span className="font-mono text-[#0B1E33]">RM {marketBaseline.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-[#9A7B56] tracking-wider block font-bold">2. Personal Disposable Outlook</span>
                <div className="bg-[#FAF8F5] p-3 rounded-lg border border-[#EBE7E0] space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#6B5A44]">Total Deductions + Tax:</span>
                    <span className="font-mono text-rose-600 font-semibold">-RM {totalExpenses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-1 border-t border-[#EBE7E0]/60">
                    <span className="text-[#0B1E33]">Disposable Surplus:</span>
                    <span className={monthlyDisposable >= 750 ? 'text-emerald-700' : 'text-rose-600'}>RM {monthlyDisposable.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <BaselineSlider 
                value={grossSalary}
                max={Math.round(marketBaseline * 1.6)}
                baseline={marketBaseline}
                valueLabel={`Calculated Median Midpoint: RM ${grossSalary.toLocaleString()}`}
                baselineLabel={`Market Standard Floor: RM ${marketBaseline.toLocaleString()}`}
              />

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowNegotiationScript(!showNegotiationScript)}
                  className="rounded-full bg-[#0B1E33] px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-white border-none cursor-pointer hover:bg-[#1C3554] shadow-xs transition-colors"
                >
                  {showNegotiationScript ? 'Hide Tactics Board' : '✦ Generate Data Negotiation Points'}
                </button>
              </div>
            </div>
          </Card>

          {/* 3. Actionable Negotiation Script Output Display */}
          {showNegotiationScript && (
            <div className="rounded-xl border border-[#9A7B56]/40 bg-[#FAF6EE] p-5 space-y-3 animate-fade-in shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#9A7B56]">✦</span>
                <h5 className="text-xs font-mono uppercase tracking-widest text-[#9A7B56] font-bold">Data-Backed Negotiation Script Summary</h5>
              </div>
              <p className="text-[11px] text-[#6B5A44] leading-relaxed">
                This generated summary compares your offer to the market range and cost-adjusted value, giving you concrete talking points to use before your loop session:
              </p>
              
              <div className="bg-white border border-[#EBE7E0] rounded-lg p-4 font-mono text-xs text-[#0B1E33] space-y-3 leading-relaxed shadow-3xs select-all">
                <p>"{negotiationPoints.opening}"</p>
                <p>"{negotiationPoints.market}"</p>
                <p>"{negotiationPoints.ask}"</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Pure HTML/CSS Full Market Job Explorer Overlay Drawer Modal */}
      {isExplorerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#0B1E33]/40 backdrop-blur-xs transition-all animate-fade-in">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between p-6 border-l border-[#EBE7E0] animate-slide-in">
            
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-[#FAF8F5] pb-3">
                <div>
                  <h4 className="text-base font-bold text-[#0B1E33]">Market Job Directory</h4>
                  <p className="text-[11px] text-[#6B5A44]">Browse all active verified listings in the database.</p>
                </div>
                <button 
                  onClick={() => setIsExplorerOpen(false)}
                  className="rounded-full bg-[#FAF8F5] border border-[#EBE7E0] p-1 text-xs font-bold w-7 h-7 flex items-center justify-center cursor-pointer hover:bg-[#F1EDE5]"
                >
                  ✕
                </button>
              </div>

              <input 
                type="text" 
                value={explorerSearch}
                onChange={(e) => setExplorerSearch(e.target.value)}
                placeholder="Filter by company name, role title, or location tags..." 
                className="w-full rounded-lg border border-[#EBE7E0] bg-[#FAF8F5] px-4 py-2 text-xs outline-none focus:border-[#9A7B56] text-[#0B1E33]" 
              />

              <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-12rem)] pr-1">
                {filteredExplorerJobs.map((job) => (
                  <button 
                    key={job.id}
                    onClick={() => {
                      setSelectedJobId(job.id);
                      setIsExplorerOpen(false);
                    }}
                    className={`w-full p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      selectedJobId === job.id 
                        ? 'bg-[#FAF6EE] border-[#9A7B56]' 
                        : 'bg-white border-[#EBE7E0] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-xs font-bold text-[#0B1E33]">{job.role}</p>
                      <span className="text-[9px] font-mono text-neutral-400 bg-neutral-100 px-1.5 py-0.2 rounded-sm uppercase">{job.location}</span>
                    </div>
                    <p className="text-[11px] text-[#9A7B56] mt-0.5">{job.company}</p>
                    <p className="text-[10px] font-mono text-emerald-800 mt-2 font-semibold">Base: RM {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-[#EBE7E0] pt-4 text-center">
              <p className="text-[10px] font-mono text-[#9A7B56]">Showing top {filteredExplorerJobs.length} real-time verified job configurations</p>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}