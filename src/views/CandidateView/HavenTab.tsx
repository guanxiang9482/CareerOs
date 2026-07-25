import { useState } from 'react'
import { Card, SectionHeading, Badge } from '../../components/ui'
import { useAppContext } from '../../data/AppContext'

export function HavenTab() {
  const { userSkills } = useAppContext()
  const [chatLogs, setChatLogs] = useState([
    { actor: 'haven', content: 'Hello Aisyah! I am your interactive Haven Career Companion. Select one of the validation prompts below to run immediate profile diagnostic analysis.' }
  ])
  const [computing, setComputing] = useState(false)

  const hasSystemDesign = userSkills.includes('System Design')

  const PRESETS = [
    { label: '📊 Check my application match rate', reply: `Analyzing your current profile assets... Your alignment score sits at ${hasSystemDesign ? '94%' : '78%'}. ${hasSystemDesign ? 'Your System Design project is verified, placing you in the Top Tier review pool.' : 'You have a missing System Design credential. Inject it inside the Living Portfolio tab to lift your score instantly!'}` },
    { label: '⚖️ Open compensation negotiation guidelines', reply: 'Based on regional indices for Kuala Lumpur entry-level engineering tracks, keep positioning clear: "Open tracking data places the 75th percentile baseline at RM 4,800. My verified portfolio record fully satisfies this baseline requirement."' },
    { label: '📝 Map target sprint prep loops', reply: 'Reviewing CIMB interview questions... Focus on explaining system fallback architecture configurations and container cluster isolation mechanics under peak request parameters.' }
  ]

  function executePresetAction(label: string, reply: string) {
    if (computing) return
    setChatLogs(prev => [...prev, { actor: 'user', content: label }])
    setComputing(true)

    setTimeout(() => {
      setChatLogs(prev => [...prev, { actor: 'haven', content: reply }])
      setComputing(false)
    }, 600)
  }

  return (
    <div className="space-y-6">
      <SectionHeading 
        eyebrow="Haven AI" 
        title="Your Co-Pilot" 
        italicWord="Assistant" 
        description="Always active, parsing portfolio records and calculating optimization steps in real time." 
      />

      <Card className="p-0 border border-[#EBE7E0] overflow-hidden flex flex-col min-h-[460px] bg-white rounded-xl shadow-2xs">
        {/* Module Banner Controls Header */}
        <div className="bg-[#0B1E33] p-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-[#B5A88F]">✦</span>
            <h4 className="text-xs font-mono uppercase tracking-widest">Haven Diagnostics Console</h4>
          </div>
          <Badge tone="positive">Online</Badge>
        </div>

        {/* Message Feeds Layout Window */}
        <div className="flex-1 p-5 space-y-4 overflow-y-auto max-h-[280px] bg-[#FAF8F5]">
          {chatLogs.map((log, idx) => (
            <div key={idx} className={`flex ${log.actor === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-md rounded-xl px-4 py-2.5 text-xs leading-relaxed ${
                log.actor === 'user' 
                  ? 'bg-[#9A7B56] text-white rounded-br-none shadow-xs' 
                  : 'bg-white border border-[#EBE7E0] text-[#0B1E33] rounded-bl-none shadow-3xs'
              }`}>
                {log.content}
              </div>
            </div>
          ))}
          {computing && (
            <div className="text-left"><span className="text-xs font-mono text-[#9A7B56] animate-pulse">Haven engine compiling metrics...</span></div>
          )}
        </div>

        {/* Preset Evaluation Macro Controls Block */}
        <div className="border-t border-[#EBE7E0] p-4 bg-white space-y-2">
          <p className="text-[10px] font-mono uppercase tracking-wider text-[#9A7B56] font-bold">Suggested AI Mentor Queries:</p>
          <div className="flex flex-col sm:flex-row gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => executePresetAction(p.label, p.reply)}
                className="flex-1 rounded-lg border border-[#EBE7E0] bg-[#FAF8F5] p-2.5 text-[11px] text-[#0B1E33] text-left hover:border-[#9A7B56] transition-all font-sans cursor-pointer outline-none"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}