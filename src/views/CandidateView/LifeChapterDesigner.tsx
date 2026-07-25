import { useState } from 'react'
import { Card, SectionHeading } from '../../components/ui'

export function LifeChapterDesigner() {
  const [breakMonths, setBreakMonths] = useState(6)
  const [targetAspiration, setTargetAspiration] = useState('FOUNDER')

  // Calculate return trajectory probability index based on control metrics
  const projectedReturnIndex = Math.max(45, 94 - Math.round(breakMonths * 1.8))

  return (
    <div className="space-y-6">
      <SectionHeading 
        eyebrow="Lifecycle Configuration" 
        title="Manage Career" 
        italicWord="Breaks &amp; Chapters" 
        description="Career planning usually assumes you just keep working straight through. Real life isn't like that. People take time off for family, for health, to start something, to study again, and then come back. This module helps you plan around those breaks instead of pretending they won't happen." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Variable Slider Configuration Card Container */}
        <div className="lg:col-span-5 rounded-xl border border-[#EBE7E0] bg-white p-5 space-y-5 shadow-2xs">
          <h5 className="text-xs font-mono uppercase tracking-wider text-[#9A7B56] font-bold">Model Career Gap Scenario</h5>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-[#6B5A44]">Sabbatical Break Length</span>
              <span className="font-mono font-bold text-[#0B1E33]">{breakMonths} Months</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="24" 
              value={breakMonths} 
              onChange={(e) => setBreakMonths(Number(e.target.value))}
              className="w-full accent-[#0B1E33] cursor-pointer"
            />
          </div>

          <div className="space-y-1.5 pt-1">
            <label className="block text-xs font-medium text-[#6B5A44]">Next Core Professional Focus</label>
            <select 
              value={targetAspiration} 
              onChange={(e) => setTargetAspiration(e.target.value)}
              className="w-full rounded-md border border-[#EBE7E0] bg-[#FAF8F5] p-2 text-xs text-[#0B1E33] outline-none"
            >
              <option value="FOUNDER">Launch Independent Startup/Venture Lab</option>
              <option value="MASTERS">Return to Postgraduate Academic Track</option>
              <option value="CORPORATE">Scale Senior Corporate Infrastructure Tracks</option>
            </select>
          </div>
        </div>

        {/* Dynamic Projections Output Screen */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <Card className="p-6 bg-white border border-[#EBE7E0] rounded-xl flex-1 flex flex-col justify-between space-y-6 shadow-2xs">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-sm inline-block">
                Ecosystem 5-Year Trajectory Projections
              </span>
              <h4 className="text-base font-bold text-[#0B1E33] mt-3">Calculated Future Outcomes</h4>
            </div>

            <div className="grid grid-cols-2 gap-4 border-y border-[#EBE7E0] py-4 my-1">
              <div>
                <p className="font-mono text-xl font-bold text-[#0B1E33]">{projectedReturnIndex}%</p>
                <p className="text-[9px] font-mono uppercase tracking-wider text-[#9A7B56] mt-0.5">Calculated Re-entry Employability</p>
              </div>
              <div>
                <p className="font-mono text-xl font-bold text-[#0B1E33]">Year {breakMonths > 12 ? '3' : '2'}</p>
                <p className="text-[9px] font-mono uppercase tracking-wider text-[#9A7B56] mt-0.5">Projected Senior Compensation Re-alignment</p>
              </div>
            </div>

            <div className="rounded-lg bg-[#FAF8F5] border border-[#EBE7E0] p-3 text-xs text-[#6B5A44] leading-relaxed">
              💡 <span className="font-bold text-[#0B1E33]">Haven Adaptation Metric:</span> Taking a <span className="font-mono font-bold text-[#9A7B56]">{breakMonths}-month</span> hiatus targeting <span className="font-semibold">{targetAspiration === 'FOUNDER' ? 'your own venture setup' : targetAspiration === 'MASTERS' ? 'advanced postgraduate degrees' : 'enterprise systems'}</span> scales parameters. Haven will balance credentials automatically 90 days prior to re-entry window closing to optimize matching scores.
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}