import { useState } from 'react'
import { useAppContext } from '../data/AppContext'

export function EmployerSignupView({ onComplete }: { onComplete: () => void }) {
  const { registerUser } = useAppContext()
  const [form, setForm] = useState({
    companyName: 'CIMB Bank',
    workEmail: 'recruitment@cimb.com',
    fullName: 'Azran Mansor',
    roleTitle: 'Talent Acquisition Lead',
    companySize: '201–1,000',
    industry: 'Banking & Finance'
  })
  const [password, setPassword] = useState('')
  const [submitError, setSubmitError] = useState('')

  function handleCreateAccount() {
    const cleanEmail = form.workEmail.trim().toLowerCase()
    if (!cleanEmail) {
      setSubmitError('A work email is required.')
      return
    }
    if (!password.trim()) {
      setSubmitError('Choose a password so you can log back in later.')
      return
    }
    setSubmitError('')

    const result = registerUser({
      email: cleanEmail,
      name: form.fullName.trim() || form.companyName.trim() || 'Employer Account',
      role: 'employer',
      password: password.trim(),
    })

    if (!result.ok) {
      setSubmitError(result.error)
      return
    }

    onComplete()
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-68px)] max-w-[1200px] items-center justify-center px-4 py-12 bg-[#FDFBF9]">
      
      <div className="grid w-full grid-cols-1 overflow-hidden rounded-2xl border border-[#EBE7E0] bg-white shadow-lg md:grid-cols-12 max-w-[1050px]">
        
        <div className="bg-[#0B1E33] p-10 text-white md:col-span-5 flex flex-col justify-between">
          <div className="space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B5A88F] block">
              For Employers
            </span>
            <h2 className="text-3xl font-bold tracking-tight leading-tight">
              Hire people who <br />
              <span className="font-serif italic font-normal text-[#9A7B56]">can prove it.</span>
            </h2>
            <p className="text-xs text-[#D8CFC0] leading-relaxed">
              Career OS gives you candidates with verified portfolios and real signal — not just CVs. Post a role and see matched, ranked talent the moment you publish.
            </p>

            <div className="space-y-4 pt-4 text-xs">
              {[
                { bold: 'Proven portfolios, not promises.', normal: 'Every candidate ships verified work and live projects.' },
                { bold: 'AI matching from day one.', normal: 'Ranked shortlists the moment your role goes live.' },
                { bold: 'Pipelines to top universities.', normal: 'Reach graduates and early-career talent across the region.' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/10 font-mono text-[9px] text-[#B5A88F]">
                    ✓
                  </span>
                  <p className="text-[#FAF8F5]">
                    <strong className="font-semibold text-white">{item.bold}</strong> {item.normal}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6">
            <div className="grid grid-cols-3 gap-2 border-b border-white/10 pb-6 mb-6">
              <div>
                <p className="font-mono text-lg font-bold text-white">900+</p>
                <p className="text-[8px] font-mono uppercase tracking-wider text-[#B5A88F]">Hiring Companies</p>
              </div>
              <div>
                <p className="font-mono text-lg font-bold text-white">21d</p>
                <p className="text-[8px] font-mono uppercase tracking-wider text-[#B5A88F]">Avg Time-To-Hire</p>
              </div>
              <div>
                <p className="font-mono text-lg font-bold text-white">86%</p>
                <p className="text-[8px] font-mono uppercase tracking-wider text-[#B5A88F]">Offer Acceptance</p>
              </div>
            </div>

            <div className="rounded-lg bg-white/5 p-4 border border-white/5">
              <p className="text-[11px] leading-relaxed text-[#D8CFC0] italic">
                "We filled two graduate analyst roles in under three weeks — the portfolios meant we interviewed people who could actually do the work."
              </p>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-wider text-[#9A7B56]">
                — Talent Lead, regional bank
              </p>
            </div>
          </div>
        </div>

        <div className="p-10 bg-white md:col-span-7 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-[#0B1E33] tracking-tight">Create your hiring account</h3>
              <p className="text-xs text-[#6B5A44] mt-1">Free to set up - post your first role in minutes.</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[#9A7B56] mb-1.5">Company Name</label>
                  <input type="text" value={form.companyName} onChange={(e) => setForm({...form, companyName: e.target.value})} placeholder="e.g. CIMB Bank" className="w-full rounded-lg border border-[#EBE7E0] bg-[#FAF8F5] px-4 py-2.5 text-sm outline-none focus:border-[#0B1E33]" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[#9A7B56] mb-1.5">Work Email</label>
                  <input type="email" value={form.workEmail} onChange={(e) => setForm({...form, workEmail: e.target.value})} placeholder="you@company.com" className="w-full rounded-lg border border-[#EBE7E0] bg-[#FAF8F5] px-4 py-2.5 text-sm outline-none focus:border-[#0B1E33]" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[#9A7B56] mb-1.5">Your Name</label>
                  <input type="text" value={form.fullName} onChange={(e) => setForm({...form, fullName: e.target.value})} placeholder="Full name" className="w-full rounded-lg border border-[#EBE7E0] bg-[#FAF8F5] px-4 py-2.5 text-sm outline-none focus:border-[#0B1E33]" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[#9A7B56] mb-1.5">Your Role</label>
                  <input type="text" value={form.roleTitle} onChange={(e) => setForm({...form, roleTitle: e.target.value})} placeholder="e.g. Talent Lead" className="w-full rounded-lg border border-[#EBE7E0] bg-[#FAF8F5] px-4 py-2.5 text-sm outline-none focus:border-[#0B1E33]" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[#9A7B56] mb-1.5">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 4 characters" className="w-full rounded-lg border border-[#EBE7E0] bg-[#FAF8F5] px-4 py-2.5 text-sm outline-none focus:border-[#0B1E33]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[#9A7B56] mb-1.5">Company Size</label>
                  <select value={form.companySize} onChange={(e) => setForm({...form, companySize: e.target.value})} className="w-full rounded-lg border border-[#EBE7E0] bg-[#FAF8F5] px-4 py-2.5 text-sm outline-none text-[#0B1E33]">
                    <option>1–50</option>
                    <option>51–200</option>
                    <option>201–1,000</option>
                    <option>1,000+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[#9A7B56] mb-1.5">Industry</label>
                  <select value={form.industry} onChange={(e) => setForm({...form, industry: e.target.value})} className="w-full rounded-lg border border-[#EBE7E0] bg-[#FAF8F5] px-4 py-2.5 text-sm outline-none text-[#0B1E33]">
                    <option>Banking & Finance</option>
                    <option>Technology</option>
                    <option>Energy</option>
                    <option>Retail & FMCG</option>
                  </select>
                </div>
              </div>

              {submitError && (
                <div className="rounded-md bg-rose-50 border border-rose-100 p-3 text-xs text-rose-600 font-mono">
                  {submitError}
                </div>
              )}

              <button onClick={handleCreateAccount} className="w-full rounded-lg bg-[#0B1E33] py-3.5 text-sm font-semibold text-white hover:bg-[#132A47] cursor-pointer shadow-xs mt-2">
                Create employer account &rarr;
              </button>
            </div>

            <div className="text-center pt-4 border-t border-[#FAF8F5] space-y-3">
              <p className="text-[10px] text-[#6B5A44]/70">
                Trusted by <span className="font-semibold text-[#0B1E33]">M · C · H · I</span> &amp; 900+ more partners
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
