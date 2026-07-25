import { useState } from 'react'
import { Card, SectionHeading } from '../../components/ui'

export function CompassTab() {
  const [trackMode, setTrackMode] = useState<'ENGINEERING' | 'MANAGEMENT'>('ENGINEERING')

  const pathBlueprints = {
    ENGINEERING: [
      { level: '1', role: 'Associate Backend Architect', pay: 'RM 4,500', note: 'Ecosystem baseline starting parameter node.' },
      { level: '2', role: 'Systems Infrastructure Engineer', pay: 'RM 8,800', note: 'Demands production containerization and pipeline credentials.' },
      { level: '3', role: 'Principal Technical Director', pay: 'RM 17,500', note: 'Requires planetary scale system capacity mapping records.' }
    ],
    MANAGEMENT: [
      { level: '1', role: 'Graduate Product Specialist', pay: 'RM 4,800', note: 'Cross-functional track mapping strategy workflows.' },
      { level: '2', role: 'Technical Product Manager (TPM)', pay: 'RM 9,200', note: 'Coordinates core microservices lifecycle releases.' },
      { level: '3', role: 'VP of Product Ecosystems', pay: 'RM 22,000', note: 'High leverage executive track holding ultimate roadmap decisions.' }
    ]
  }

  return (
    <div className="space-y-6">
      <SectionHeading 
        eyebrow="Compass" 
        title="Your Career Path" 
        italicWord="Navigator" 
        description="What you've done and what the job market actually looks like right now, showing you a handful of routes you could realistically take from here. It doesn't predict which one is best. It just gives you something more than gut feel to work with." 
      />

      {/* Selector Toggle Button Row */}
      <div className="flex gap-2 border-b border-[#EBE7E0] pb-px">
        {([
          { id: 'ENGINEERING', name: 'Technical Specialist Track' },
          { id: 'MANAGEMENT', name: 'Product Management Track' }
        ] as const).map((btn) => (
          <button
            key={btn.id}
            onClick={() => setTrackMode(btn.id)}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase border-b-2 transition-all cursor-pointer bg-transparent outline-none ${
              trackMode === btn.id ? 'border-[#0B1E33] text-[#0B1E33]' : 'border-transparent text-[#9A7B56]'
            }`}
          >
            {btn.name}
          </button>
        ))}
      </div>

      {/* Progression Flow Display Map */}
      <Card className="p-6 bg-white border border-[#EBE7E0] rounded-xl shadow-2xs">
        <div className="relative">
          <div className="absolute left-4 top-2 bottom-2 w-px bg-[#EBE7E0]" />
          
          <div className="space-y-6">
            {pathBlueprints[trackMode].map((node) => (
              <div key={node.level} className="relative flex gap-4 pl-10 group">
                <div className="absolute left-0 top-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#0B1E33] text-white font-mono text-xs font-bold transition-transform group-hover:scale-110">
                  {node.level}
                </div>
                <div className="flex-1 bg-[#FAF8F5] border border-[#EBE7E0] p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h5 className="text-sm font-bold text-[#0B1E33]">{node.role}</h5>
                    <p className="text-xs text-[#6B5A44] mt-0.5">{node.note}</p>
                  </div>
                  <div className="shrink-0 font-mono text-xs font-bold bg-white px-3 py-1 rounded-md border border-[#EBE7E0] text-[#0B1E33]">
                    Median: {node.pay} / mo
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}