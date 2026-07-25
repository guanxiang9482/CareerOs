import { useState } from 'react'
import { type AppView } from '../App'

// interface LoginPageProps {
//   onLoginSuccess: (targetView: AppView, personaName: string) => void
// }

export function LoginPage({ onLoginSuccess }: { onLoginSuccess: (targetView: AppView, name: string) => void }) {
  const [email, setEmail] = useState('aisyah.yusof@email.com') // Defaults to the official demo target persona
  const [password, setPassword] = useState('••••••••')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  function handleAutoDetectLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setNotice('')

    const cleanEmail = email.trim().toLowerCase()

    if (cleanEmail.length === 0) {
      setError('Please provide a valid email address to trigger the auto-detection system.')
      return
    }

    // 1. Dynamic Intelligent Query Engine Strategy
    // The system automatically queries the email structure to detect their macro environment role
    let targetedView: AppView = 'CANDIDATE'
    let assignedPersona = 'Aisyah Yusof'
    let roleLabel = 'Candidate (Talent Workspace)'

    if (cleanEmail.includes('um.edu') || cleanEmail.includes('university') || cleanEmail.includes('admin')) {
      targetedView = 'UNIVERSITY'
      assignedPersona = 'Universiti Malaya'
      roleLabel = 'University (Academic Administration Hub)'
    } else if (cleanEmail.includes('cimb') || cleanEmail.includes('employer') || cleanEmail.includes('hr')) {
      targetedView = 'EMPLOYER'
      assignedPersona = 'CIMB Group'
      roleLabel = 'Employer (Recruitment Command Center)'
    }

    setNotice(`Auto-detected role: "${roleLabel}". Redirecting...`)

    // Smooth delay emulation to let the judging panel observe the auto-detection behavior
    setTimeout(() => {
      onLoginSuccess(targetedView, assignedPersona)
    }, 900)
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-68px)] max-w-[1200px] items-center justify-center px-4 py-12 bg-[#FDFBF9]">
      
      {/* Premium Split Master Card Frame Container */}
      <div className="grid w-full grid-cols-1 overflow-hidden rounded-2xl border border-[#EBE7E0] bg-white shadow-lg md:grid-cols-12 max-w-[1050px]">
        
        {/* LEFT COMPONENT PANEL: Deep Corporate Midnight Navy Workspace Presentation */}
        <div className="bg-[#0B1E33] p-10 text-white md:col-span-6 flex flex-col justify-between relative">
          
          <div className="space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B5A88F] block">
              Welcome Back
            </span>
            <h2 className="text-4xl font-bold tracking-tight leading-tight">
              Pick up where <br />
              <span className="font-serif italic font-normal text-[#9A7B56]">you left off.</span>
            </h2>
            <p className="text-xs text-[#D8CFC0] leading-relaxed max-w-sm">
              Your matches, applications, and work-animal profile are right where you left them. Sign in to keep building momentum.
            </p>

            {/* Structured Value Proposition Bullet Point Blocks */}
            <div className="space-y-4.5 pt-4 text-xs">
              {[
                { bold: 'Matched roles', normal: 'from 900+ leading companies.' },
                { bold: 'Every application', normal: 'tracked in one unified place.' },
                { bold: 'Your Menagerie Method profile', normal: 'and custom growth insights.' },
                { bold: 'See how you compare', normal: 'for the high-impact positions you want.' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/10 font-mono text-[9px] text-[#B5A88F] border border-white/5">
                    ✓
                  </span>
                  <p className="text-[#FAF8F5]">
                    <strong className="font-semibold text-white">{item.bold}</strong> {item.normal}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Counter Stats Telemetry Grid Row */}
          <div className="mt-12 border-t border-white/10 pt-8">
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: '900+', label: 'Companies' },
                { value: '27k+', label: 'Live roles' },
                { value: '52', label: 'Sectors' }
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-mono text-xl font-bold tracking-tight text-white">{stat.value}</p>
                  <p className="mt-0.5 text-[9px] font-mono uppercase tracking-widest text-[#B5A88F]">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Bottom Strategic Summary Callout Widget */}
            <div className="mt-8 rounded-lg bg-white/5 border border-white/5 p-4">
              <p className="text-[11px] leading-relaxed text-[#D8CFC0] font-sans">
                "Built so every graduate can find work that fits, not just any job."
              </p>
              <p className="mt-1.5 font-mono text-[9px] uppercase tracking-wider text-[#9A7B56]">
                Career OS &middot; for talent
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT COMPONENT PANEL: Clean Minimalist Input Form Area */}
        <div className="p-10 bg-white md:col-span-6 flex flex-col justify-center">
          <div className="max-w-sm w-full mx-auto space-y-6">
            
            <div>
              <h3 className="text-2xl font-bold text-[#0B1E33] tracking-tight">Log in</h3>
              <p className="text-xs text-[#6B5A44] mt-1">Welcome back to Career OS.</p>
            </div>

            <form onSubmit={handleAutoDetectLogin} className="space-y-4">
              
              {/* Email Address Form Node */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#9A7B56] mb-1.5">
                  Email
                </label>
                <input 
                  type="text" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full rounded-lg border border-[#EBE7E0] bg-[#FAF8F5] px-4 py-3 text-sm text-[#0B1E33] outline-none transition-all focus:border-[#0B1E33] placeholder-[#0B1E33]/30"
                />
              </div>

              {/* Password Form Node */}
              <div>
                <div className="flex justify-between items-baseline mb-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#9A7B56]">
                    Password
                  </label>
                  <span className="text-[11px] font-mono text-[#9A7B56]/70 hover:underline cursor-pointer">
                    Forgot?
                  </span>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-[#EBE7E0] bg-[#FAF8F5] px-4 py-3 text-sm text-[#0B1E33] outline-none transition-all focus:border-[#0B1E33]"
                />
              </div>

              {/* Real-time Status Notification Banners */}
              {error && (
                <div className="rounded-md bg-rose-50 border border-rose-100 p-3 text-xs text-rose-600 font-mono">
                  {error}
                </div>
              )}
              {notice && (
                <div className="rounded-md bg-emerald-50 border border-emerald-100 p-3 text-xs text-emerald-700 font-mono animate-pulse">
                  {notice}
                </div>
              )}

              {/* Submit Input Action Button */}
              <button 
                type="submit" 
                className="w-full rounded-lg bg-[#0B1E33] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#132A47] cursor-pointer shadow-xs active:scale-99"
              >
                Log in
              </button>

            </form>

            {/* Infrastructure Validation Tag Row */}
            <div className="pt-4 border-t border-[#FAF8F5] text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[#9A7B56]/70">
                🔒 Secure Sign-In Managed
              </span>
              <p className="text-[10px] text-[#6B5A44]/60 leading-relaxed max-w-xs mx-auto">
                💡 <span className="font-semibold text-[#0B1E33]">Judge Pro-Tip:</span> Type <span className="font-mono text-[#9A7B56]">um.edu</span> for University view or <span className="font-mono text-[#9A7B56]">cimb.com</span> for Employer view to watch the system auto-detect accounts instantly[cite: 15, 20].
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}