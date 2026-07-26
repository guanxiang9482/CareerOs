import { useState, useMemo, useRef, useEffect } from 'react'
import { useAppContext } from '../../data/AppContext'
import { DEMO_CANDIDATE, MARKET_MIN_SALARY } from '../../data/mockData'
import { Card } from '../../components/ui'

type ChatMessage = { actor: 'haven' | 'user'; content: string }

function executeMentorLogic(
  query: string, 
  ctx: { userSkills: string[]; marketFloor: number; gapAmount: number; isUnderpaid: boolean }
): string {
  const text = query.toLowerCase()
  const hasSystemDesign = ctx.userSkills.includes('System Design')

  if (/qa engineer|qa|test|istqb|automation|selenium|certificate/.test(text)) {
    return `To accelerate your journey as a QA Engineer or automation tester in this field, I recommend securing the ISTQB Foundation Level certification, followed by practical validation in Selenium or Cypress frameworks. Adding a verified automated testing pipeline project to your Living Portfolio tab will immediately boost your match score across available testing openings!`
  }

  if (/underpaid|salary|pay|worth|raise|increment/.test(text)) {
    if (ctx.isUnderpaid) {
      return `Looking at your current salary against the market floor for ${DEMO_CANDIDATE.field}, you're sitting about RM ${ctx.gapAmount.toLocaleString()} below the RM ${ctx.marketFloor.toLocaleString()} baseline. That's worth raising at your next review — check the Fair Pay tab for a full negotiation script built off this same number.`
    }
    return `You're currently at or above the RM ${ctx.marketFloor.toLocaleString()} market floor for ${DEMO_CANDIDATE.field}, so pay isn't the flag right now — but it's worth rechecking each quarter as the market moves.`
  }

  if (/match|score|profile|qualif/.test(text)) {
    return `Your current alignment score is ${hasSystemDesign ? '94%' : '78%'} for the target engineering pipeline tracks. ${hasSystemDesign ? "That's Top Tier range." : 'Closing the System Design gap in your Living Portfolio tab would move you into the Top Tier pool.'}`
  }

  if (/interview|prep|sprint|practice/.test(text)) {
    return `For upcoming backend infrastructure loops, expect questions on system fallback design and scaling under peak load. ${hasSystemDesign ? 'You already have a verified project to point to for this.' : "You don't have a verified project for this yet — worth building one before that interview."}`
  }

  if (/negotiat/.test(text)) {
    return `The market floor for your field is RM ${ctx.marketFloor.toLocaleString()}. Lead with that number, then point to your verified portfolio as proof you clear it. Full talking points are in the Fair Pay tab's negotiation panel.`
  }

  return `I understand your career target. Adding a verified technical milestone project right now gives us the leverage needed to negotiate upper-quartile pay brackets inside the region.`
}

export function HavenTab() {
  const { userSkills } = useAppContext()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const metrics = useMemo(() => {
    const marketFloor = MARKET_MIN_SALARY[DEMO_CANDIDATE.field] || 3800
    const isUnderpaid = DEMO_CANDIDATE.currentSalary < marketFloor
    const gapAmount = marketFloor - DEMO_CANDIDATE.currentSalary
    return { marketFloor, isUnderpaid, gapAmount }
  }, [])

  const [chatLogs, setChatLogs] = useState<ChatMessage[]>([
    { actor: 'haven', content: 'Morning, Aisyah. You\'ve got the CIMB interview in 5 hours. Want to run through the questions most likely to come up?' }
  ])
  const [inputValue, setInputValue] = useState('')
  const [computing, setComputing] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatLogs, computing])

  function handleSendPrompt(textToSend: string) {
    const trimmed = textToSend.trim()
    if (!trimmed || computing) return

    setChatLogs(prev => [...prev, { actor: 'user', content: trimmed }])
    if (inputValue) setInputValue('')
    setComputing(true)

    const standardReply = executeMentorLogic(trimmed, { userSkills, ...metrics })

    setTimeout(() => {
      setChatLogs(prev => [...prev, { actor: 'haven', content: standardReply }])
      setComputing(false)
    }, 700)
  }

  return (
    <div className="fixed inset-0 top-[120px] left-[240px] bg-[#FAF8F5] z-10 flex flex-col font-sans text-[#0B1E33]">
      
      {/* Immersive Top Header Panel featuring High Fidelity AI Profile Avatar */}
      <div className="bg-white border-b border-[#EBE7E0] px-8 py-6 shrink-0 flex items-center justify-between shadow-3xs">
        <div className="flex items-center gap-4">
          
          {/* AI Banner Profile Image Layout Asset Container */}
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#9A7B56] to-[#0B1E33] flex items-center justify-center text-white font-serif font-bold text-lg shadow-sm">
              ✦
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#0B1E33]">Haven</h3>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">Online &middot; your AI career companion</p>
          </div>
        </div>
        
        <div className="hidden sm:block text-xs font-mono text-[#9A7B56]">
          <Card className="px-3 py-1.5 bg-[#FAF8F5] border border-[#EBE7E0] rounded-lg">
            TALENTBANK AI
          </Card>
        </div>
      </div>

      {/* Primary Messages Log Window */}
      <div className="flex-1 overflow-y-auto p-8 bg-[#FAF8F5]">
        <div className="max-w-3xl mx-auto space-y-6">
          {chatLogs.map((log, idx) => (
            <div key={idx} className={`flex items-start gap-3.5 ${log.actor === 'user' ? 'justify-end' : 'justify-start'}`}>
              
              {/* Left-Side Aligned Profile Photo Icon for AI Responses */}
              {log.actor === 'haven' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#9A7B56] to-[#0B1E33] flex items-center justify-center text-white text-xs font-serif font-bold shrink-0 shadow-3xs">
                  ✦
                </div>
              )}

              <div className={`max-w-xl rounded-2xl px-5 py-3.5 text-xs leading-relaxed shadow-3xs relative ${
                log.actor === 'user'
                  ? 'bg-[#0B1E33] text-white rounded-br-none'
                  : 'bg-white border border-[#EBE7E0] text-[#0B1E33] rounded-bl-none'
              }`}>
                {log.actor === 'haven' && <p className="font-mono text-[9px] text-[#9A7B56] mb-1 font-bold">Haven AI</p>}
                {log.actor === 'user' && <p className="font-mono text-[9px] text-[#B5A88F] mb-1 text-right font-bold">Aisyah (You)</p>}
                <p className="font-normal">{log.content}</p>
              </div>

              {/* Right-Side Aligned Profile Photo Icon for Candidate User Submissions */}
              {log.actor === 'user' && (
                <div className="w-8 h-8 rounded-full bg-[#9A7B56] flex items-center justify-center text-white text-[10px] font-mono font-bold shrink-0 shadow-3xs">
                  AY
                </div>
              )}

            </div>
          ))}
          
          {computing && (
            <div className="flex justify-start items-center gap-3 pl-[46px]">
              <div className="flex justify-start items-center gap-2 text-xs font-mono text-[#9A7B56] bg-white border border-[#EBE7E0] px-4 py-2.5 rounded-xl shadow-3xs animate-pulse">
                <span>✦ Haven engine evaluating query parameters...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Floating Suggestion Macro Actions & Input Bar Footer Area */}
      <div className="bg-white border-t border-[#EBE7E0] p-6 shrink-0 shadow-sm">
        <div className="max-w-3xl mx-auto space-y-4">
          
          {/* File 6 Matching Macro Option Buttons */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: '📝 Prep me', text: 'Yes, let\'s prep.' },
              { label: '📊 Show my gaps', text: 'What are my current structural portfolio skill gaps?' },
              { label: '💡 What should I ask them?', text: 'If i wish to complete my job as a QA Engineer, which action/certificate should be taken.' },
              { label: '🔍 Find matches', text: 'Which open vacancies currently clear my verified credentials?' }
            ].map((pill, i) => (
              <button
                key={i}
                disabled={computing}
                onClick={() => handleSendPrompt(pill.text)}
                className="rounded-full bg-[#FAF8F5] border border-[#EBE7E0] px-4 py-1.5 text-xs font-medium text-[#6B5A44] hover:border-[#9A7B56] hover:bg-white transition-all cursor-pointer outline-none shadow-3xs"
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Console Action Input Form Field */}
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              disabled={computing}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSendPrompt(inputValue) }}
              placeholder="Ask Haven anything about your career..."
              className="flex-1 rounded-xl border border-[#EBE7E0] bg-[#FAF8F5] px-4 py-3 text-xs text-[#0B1E33] outline-none focus:border-[#9A7B56] transition-colors shadow-3xs placeholder-neutral-400 font-sans"
            />
            <button
              onClick={() => handleSendPrompt(inputValue)}
              disabled={computing || !inputValue.trim()}
              className="rounded-xl bg-[#0B1E33] px-6 text-xs font-bold text-white border-none cursor-pointer hover:bg-[#132A47] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm font-mono uppercase"
            >
              Send 🚀
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}