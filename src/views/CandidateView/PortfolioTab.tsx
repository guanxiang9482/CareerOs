import { useState, useMemo } from 'react'
import { useAppContext } from '../../data/AppContext'
import { calculatePortfolioScore, type PortfolioCertificate } from '../../data/appState'
import { Card, Badge, ProgressBar } from '../../components/ui'

export function PortfolioTab() {
  const { addSkill, portfolio, updatePortfolio, isLoggedIn } = useAppContext()

  // --- Local input buffers for the "add new X" forms only. The actual
  // portfolio data itself (skills, experiences, certificates, academics,
  // projects) lives in context/localStorage via `portfolio`, not here — this
  // is what makes entries survive a refresh instead of resetting.
  const [newSkill, setNewSkill] = useState('')
  const [newRole, setNewRole] = useState('')
  const [newCompany, setNewCompany] = useState('')
  const [newPeriod, setNewPeriod] = useState('')
  const [newExpBullet, setNewExpBullet] = useState('')
  const [newCertName, setNewCertName] = useState('')
  const [newCertIssuer, setNewCertIssuer] = useState('')
  const [newInst, setNewInst] = useState('')
  const [newDegree, setNewDegree] = useState('')
  const [newAcadPeriod, setNewAcadPeriod] = useState('')
  const [newAcadBullet, setNewAcadBullet] = useState('')
  const [newProjectTitle, setNewProjectTitle] = useState('')
  const [newProjectDesc, setNewProjectDesc] = useState('')

  const profileMetrics = useMemo(() => {
    if (!portfolio) return { score: 0, verifiedCount: 0 }
    const verifiedCount = portfolio.certificates.filter((c) => c.status === 'Verified').length
    return { score: calculatePortfolioScore(portfolio), verifiedCount }
  }, [portfolio])

  if (!isLoggedIn || !portfolio) {
    return (
      <div className="space-y-6">
        <Card className="p-8 bg-white border border-[#EBE7E0] rounded-xl shadow-3xs text-center">
          <h3 className="text-sm font-bold text-[#0B1E33]">Your Living Portfolio isn't loaded yet</h3>
          <p className="text-xs text-[#6B5A44] mt-2 max-w-md mx-auto">
            The portfolio is created the moment you register and saved to your account.
            Log in (or register) to see and edit it here — entries you add will still be here next time you log back in.
          </p>
        </Card>
      </div>
    )
  }

  // --- Action append macros — all mutate through updatePortfolio, which
  // context automatically persists to localStorage on every change.

  const handleAppendSkill = () => {
    if (!newSkill.trim()) return
    const formatted = newSkill.trim()
    updatePortfolio((prev) => ({ ...prev, skills: [...prev.skills, formatted] }))
    if (formatted === 'System Design' || formatted === 'Docker') {
      addSkill('System Design')
    }
    setNewSkill('')
  }

  const handleAppendExperience = () => {
    if (!newRole.trim() || !newCompany.trim() || !newPeriod.trim()) return
    updatePortfolio((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          role: newRole.trim(),
          company: newCompany.trim(),
          period: newPeriod.trim(),
          bullets: newExpBullet.trim() ? [newExpBullet.trim()] : ['Assigned to core software infrastructure sprint loops.'],
        },
      ],
    }))
    setNewRole('')
    setNewCompany('')
    setNewPeriod('')
    setNewExpBullet('')
  }

  const handleAppendCertificate = () => {
    if (!newCertName.trim() || !newCertIssuer.trim()) return
    updatePortfolio((prev) => ({
      ...prev,
      certificates: [
        ...prev.certificates,
        { id: `cert-${Date.now()}`, name: newCertName.trim(), issuer: newCertIssuer.trim(), status: 'Pending' },
      ],
    }))
    setNewCertName('')
    setNewCertIssuer('')
  }

  const triggerVerificationSim = (id: string) => {
    updatePortfolio((prev) => ({
      ...prev,
      certificates: prev.certificates.map((c: PortfolioCertificate) => {
        if (c.id === id) {
          if (c.name.toLowerCase().includes('docker') || c.name.toLowerCase().includes('system design')) {
            addSkill('System Design')
          }
          return { ...c, status: 'Verified' as const }
        }
        return c
      }),
    }))
  }

  const handleAppendAcademic = () => {
    if (!newInst.trim() || !newDegree.trim() || !newAcadPeriod.trim()) return
    updatePortfolio((prev) => ({
      ...prev,
      academics: [
        ...prev.academics,
        {
          institution: newInst.trim(),
          degree: newDegree.trim(),
          period: newAcadPeriod.trim(),
          bullets: newAcadBullet.trim() ? [newAcadBullet.trim()] : [],
        },
      ],
    }))
    setNewInst('')
    setNewDegree('')
    setNewAcadPeriod('')
    setNewAcadBullet('')
  }

  const handleAppendProject = () => {
    if (!newProjectTitle.trim()) return
    updatePortfolio((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { id: `proj-${Date.now()}`, title: newProjectTitle.trim(), description: newProjectDesc.trim() },
      ],
    }))
    setNewProjectTitle('')
    setNewProjectDesc('')
  }

  return (
    <div className="space-y-6">

      {/* Real-time Indicator Bar Banner */}
      <Card className="p-6 bg-white border border-[#EBE7E0] rounded-xl shadow-3xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0B1E33]">Living Portfolio Strength</h3>
            <p className="text-xs text-[#9A7B56]">Saved to your account — recalculated instantly as you add entries.</p>
          </div>
          <div className="text-right">
            <span className="font-mono text-3xl font-bold text-[#0B1E33]">{profileMetrics.score}%</span>
            <p className="text-[10px] font-mono text-emerald-700 font-bold">{profileMetrics.score >= 90 ? 'Top Tier Status' : 'Competitive Track'}</p>
          </div>
        </div>
        <div className="mt-4"><ProgressBar value={profileMetrics.score} tone="emerald" /></div>
      </Card>

      {/* Main Content Layout Grid splitting input selectors from canvas sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT COLUMN: Interactive Profile Customizer Panel Form Sheet (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-4">

          {/* Skill Form */}
          <Card className="p-4 bg-white border border-[#EBE7E0] rounded-xl space-y-2 shadow-3xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#9A7B56] font-bold block">Add Portfolio Skill</span>
            <div className="flex gap-2">
              <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="e.g. System Design, Go, Docker" className="flex-1 text-xs border border-[#EBE7E0] bg-[#FAF8F5] p-2 rounded outline-none" />
              <button onClick={handleAppendSkill} className="bg-[#0B1E33] text-white font-mono text-xs px-3 rounded border-none cursor-pointer hover:bg-neutral-800">Add</button>
            </div>
          </Card>

          {/* Project Form */}
          <Card className="p-4 bg-white border border-[#EBE7E0] rounded-xl space-y-2 shadow-3xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#9A7B56] font-bold block">Add Project</span>
            <input type="text" value={newProjectTitle} onChange={(e) => setNewProjectTitle(e.target.value)} placeholder="Project Title" className="w-full text-xs border border-[#EBE7E0] bg-[#FAF8F5] p-2 rounded outline-none" />
            <textarea value={newProjectDesc} onChange={(e) => setNewProjectDesc(e.target.value)} placeholder="What it does, tools used" className="w-full text-xs border border-[#EBE7E0] bg-[#FAF8F5] p-2 rounded outline-none mt-1 h-16 resize-none" />
            <button onClick={handleAppendProject} className="w-full bg-[#0B1E33] text-white font-mono text-xs py-2 rounded border-none cursor-pointer hover:bg-neutral-800 mt-1">Add Project</button>
          </Card>

          {/* Experience Form */}
          <Card className="p-4 bg-white border border-[#EBE7E0] rounded-xl space-y-2 shadow-3xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#9A7B56] font-bold block">Append Work Experience</span>
            <input type="text" value={newRole} onChange={(e) => setNewRole(e.target.value)} placeholder="Role Title" className="w-full text-xs border border-[#EBE7E0] bg-[#FAF8F5] p-2 rounded outline-none" />
            <input type="text" value={newCompany} onChange={(e) => setNewCompany(e.target.value)} placeholder="Company Name" className="w-full text-xs border border-[#EBE7E0] bg-[#FAF8F5] p-2 rounded outline-none mt-1" />
            <input type="text" value={newPeriod} onChange={(e) => setNewPeriod(e.target.value)} placeholder="Period (e.g. 05/2025 - Present)" className="w-full text-xs border border-[#EBE7E0] bg-[#FAF8F5] p-2 rounded outline-none mt-1" />
            <textarea value={newExpBullet} onChange={(e) => setNewExpBullet(e.target.value)} placeholder="Primary Achievement Bullet Point" className="w-full text-xs border border-[#EBE7E0] bg-[#FAF8F5] p-2 rounded outline-none mt-1 h-16 resize-none" />
            <button onClick={handleAppendExperience} className="w-full bg-[#0B1E33] text-white font-mono text-xs py-2 rounded border-none cursor-pointer hover:bg-neutral-800 mt-1">Append Experience Section</button>
          </Card>

          {/* Certificate Form */}
          <Card className="p-4 bg-white border border-[#EBE7E0] rounded-xl space-y-2 shadow-3xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#9A7B56] font-bold block">Upload Certificate Profile</span>
            <input type="text" value={newCertName} onChange={(e) => setNewCertName(e.target.value)} placeholder="Certificate Title Name" className="w-full text-xs border border-[#EBE7E0] bg-[#FAF8F5] p-2 rounded outline-none" />
            <input type="text" value={newCertIssuer} onChange={(e) => setNewCertIssuer(e.target.value)} placeholder="Issuing Organization Authority" className="w-full text-xs border border-[#EBE7E0] bg-[#FAF8F5] p-2 rounded outline-none mt-1" />
            <button onClick={handleAppendCertificate} className="w-full bg-[#0B1E33] text-white font-mono text-xs py-2 rounded border-none cursor-pointer hover:bg-neutral-800 mt-1">Upload Certificate Record</button>
          </Card>

          {/* Academic Form */}
          <Card className="p-4 bg-white border border-[#EBE7E0] rounded-xl space-y-2 shadow-3xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#9A7B56] font-bold block">Add Academic History</span>
            <input type="text" value={newInst} onChange={(e) => setNewInst(e.target.value)} placeholder="Institution Name" className="w-full text-xs border border-[#EBE7E0] bg-[#FAF8F5] p-2 rounded outline-none" />
            <input type="text" value={newDegree} onChange={(e) => setNewDegree(e.target.value)} placeholder="Degree &amp; Major Field" className="w-full text-xs border border-[#EBE7E0] bg-[#FAF8F5] p-2 rounded outline-none mt-1" />
            <input type="text" value={newAcadPeriod} onChange={(e) => setNewAcadPeriod(e.target.value)} placeholder="Timeline Space" className="w-full text-xs border border-[#EBE7E0] bg-[#FAF8F5] p-2 rounded outline-none mt-1" />
            <button onClick={handleAppendAcademic} className="w-full bg-[#0B1E33] text-white font-mono text-xs py-2 rounded border-none cursor-pointer hover:bg-neutral-800 mt-1">Add Academic Track</button>
          </Card>
        </div>

        {/* RIGHT COLUMN: The High Fidelity Resume Presentation Canvas Sheet (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-white border border-[#EBE7E0] rounded-xl overflow-hidden shadow-sm font-sans text-neutral-800">

          {/* Top Profile Header Panel */}
          <div className="bg-[#4A3B32] p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-serif font-bold tracking-tight">{portfolio.name}</h2>
              <p className="text-xs text-[#D8CFC0] max-w-md font-serif italic leading-relaxed">
                {portfolio.headline || 'No headline set yet.'}
              </p>
            </div>
            <div className="space-y-1.5 text-xs text-[#D8CFC0] md:text-right font-mono tracking-tight shrink-0">
              <p>✉️ {portfolio.candidateEmail}</p>
            </div>
          </div>

          <div className="p-8 space-y-6">

            {/* Dynamic Skills Grid Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#4A3B32] font-bold border-b border-[#EBE7E0] pb-1">Technical Skills Summary</h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {portfolio.skills.map((skill, idx) => (
                  <span key={idx} className="bg-neutral-100 text-[#0B1E33] border border-neutral-200 text-xs font-mono px-2.5 py-1 rounded-sm">
                    {skill}
                  </span>
                ))}
                {portfolio.skills.length === 0 && <span className="text-xs italic text-neutral-400">No skills added yet.</span>}
              </div>
            </div>

            {/* Dynamic Projects Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#4A3B32] font-bold border-b border-[#EBE7E0] pb-1">Projects</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {portfolio.projects.map((proj) => (
                  <div key={proj.id} className="p-3 rounded-lg border border-[#EBE7E0] bg-[#FAF8F5]">
                    <p className="font-bold text-[#0B1E33]">{proj.title}</p>
                    {proj.description && <p className="text-neutral-600 mt-1 leading-relaxed">{proj.description}</p>}
                  </div>
                ))}
                {portfolio.projects.length === 0 && <span className="text-xs italic text-neutral-400">No projects added yet.</span>}
              </div>
            </div>

            {/* Dynamic Experiences Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#4A3B32] font-bold border-b border-[#EBE7E0] pb-1">Professional Experience Ledger</h3>
              <div className="relative pl-6 space-y-6">
                <div className="absolute left-1.5 top-2 bottom-2 w-px bg-[#4A3B32]/30" />
                {portfolio.experiences.map((exp, i) => (
                  <div key={i} className="relative space-y-1">
                    <div className="absolute -left-[23px] top-1 h-2.5 w-2.5 rounded-full border border-[#4A3B32] bg-white shadow-3xs" />
                    <div className="flex justify-between text-xs font-bold text-[#0B1E33]">
                      <h5>{exp.role}</h5>
                      <span className="font-mono text-neutral-500 font-normal">{exp.period}</span>
                    </div>
                    <p className="text-[11px] text-[#9A7B56] font-medium font-serif italic">{exp.company}</p>
                    <ul className="list-disc pl-4 text-xs text-neutral-600 space-y-1 mt-1">
                      {exp.bullets.map((b, idx) => <li key={idx}>{b}</li>)}
                    </ul>
                  </div>
                ))}
                {portfolio.experiences.length === 0 && <span className="text-xs italic text-neutral-400">No experience added yet.</span>}
              </div>
            </div>

            {/* Dynamic Certificates Section with Interactive Verification Trigger Action Link */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#4A3B32] font-bold border-b border-[#EBE7E0] pb-1">Certificates</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {portfolio.certificates.map((cert) => (
                  <div key={cert.id} className={`p-3 rounded-lg border flex justify-between items-center ${cert.status === 'Verified' ? 'bg-emerald-50/40 border-emerald-200' : 'bg-amber-50/30 border-amber-200'}`}>
                    <div>
                      <p className="font-bold text-[#0B1E33]">{cert.name}</p>
                      <p className="text-[10px] text-neutral-500 font-mono mt-0.5">{cert.issuer}</p>
                    </div>
                    <div>
                      {cert.status === 'Verified' ? (
                        <Badge tone="positive">✓ Verified</Badge>
                      ) : (
                        <button onClick={() => triggerVerificationSim(cert.id)} className="rounded bg-amber-600 px-2 py-1 text-[10px] font-mono font-bold text-white border-none cursor-pointer hover:bg-amber-700 transition-colors shadow-3xs animate-pulse">
                          Verify
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {portfolio.certificates.length === 0 && <span className="text-xs italic text-neutral-400">No certificates added yet.</span>}
              </div>
            </div>

            {/* Dynamic Academics Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#4A3B32] font-bold border-b border-[#EBE7E0] pb-1">Academic Records</h3>
              <div className="space-y-4">
                {portfolio.academics.map((acad, i) => (
                  <div key={i} className="text-xs space-y-1">
                    <div className="flex justify-between font-bold text-[#0B1E33]">
                      <h5>{acad.institution}</h5>
                      <span className="font-mono text-neutral-500 font-normal">{acad.period}</span>
                    </div>
                    <p className="text-neutral-600 font-medium">{acad.degree}</p>
                    {acad.bullets.length > 0 && (
                      <ul className="list-disc pl-4 text-neutral-600 space-y-0.5 mt-1">
                        {acad.bullets.map((b, idx) => <li key={idx}>{b}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
                {portfolio.academics.length === 0 && <span className="text-xs italic text-neutral-400">No academic history added yet.</span>}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
