import { useState, useMemo } from 'react'
import { useAppContext } from '../../data/AppContext'
import { DEMO_CANDIDATE } from '../../data/mockData'
import { Card, Badge, ProgressBar } from '../../components/ui'

interface ExperienceItem {
  role: string
  company: string
  period: string
  bullets: string[]
}

interface CertificateItem {
  id: string
  name: string
  issuer: string
  status: 'Pending' | 'Verified'
}

interface AcademicItem {
  institution: string
  degree: string
  period: string
  bullets: string[]
}

export function PortfolioTab() {
  const { addSkill } = useAppContext()
  const c = DEMO_CANDIDATE

  // 1. Core Reactive State Storage Pools
  const [skillsList, setSkillsList] = useState<string[]>(['SQL Architecture', 'Python Pipelines', 'AWS Cloud Core Operations'])
  const [newSkill, setNewSkill] = useState('')

  const [experiences, setExperiences] = useState<ExperienceItem[]>([
    {
      role: 'Technical Specialist Trainee Development Program',
      company: 'Grab Malaysia Technology',
      period: '01/2025 - Present',
      bullets: [
        'Assisted in optimizing production database indices, boosting application query loops.',
        'Successfully integrated verified server deployments across tracking nodes.'
      ]
    },
    {
      role: 'Enterprise Engineering Architecture Assistant',
      company: 'Maybank Financial Services Systems',
      period: '06/2024 - 12/2024',
      bullets: [
        'Managed core code tracking records for automated analytics report extraction.',
        'Maintained system health dashboard frameworks, minimizing reporting drops.'
      ]
    }
  ])
  const [newRole, setNewRole] = useState('')
  const [newCompany, setNewCompany] = useState('')
  const [newPeriod, setNewPeriod] = useState('')
  const [newExpBullet, setNewExpBullet] = useState('')

  const [certificates, setCertificates] = useState<CertificateItem[]>([
    { id: 'cert-1', name: 'AWS Cloud Practitioner Certification', issuer: 'Amazon Web Services', status: 'Verified' },
    { id: 'cert-2', name: 'Container Orchestration Standards (Docker Stack)', issuer: 'Ecosystem Core', status: 'Pending' }
  ])
  const [newCertName, setNewCertName] = useState('')
  const [newCertIssuer, setNewCertIssuer] = useState('')

  const [academics, setAcademics] = useState<AcademicItem[]>([
    {
      institution: 'Universiti Malaya (UM)',
      degree: 'Bachelor of Science in Computer Science',
      period: 'Graduation: Class of 2025',
      bullets: [
        'Recipient of Faculty First-Class Academic Scholarship Excellence Award.',
        'Core Representative at University Software Systems Integration Lab.'
      ]
    }
  ])
  const [newInst, setNewInst] = useState('')
  const [newDegree, setNewDegree] = useState('')
  const [newAcadPeriod, setNewAcadPeriod] = useState('')
  const [newAcadBullet, setNewAcadBullet] = useState('')

  // 2. Dynamic Algorithmic Profile Score Recalculator
  const profileMetrics = useMemo(() => {
    const verifiedCount = certificates.filter(cert => cert.status === 'Verified').length
    const score = Math.min(99, 65 + (skillsList.length * 3) + (verifiedCount * 6) + (experiences.length * 4))
    return { score, verifiedCount }
  }, [skillsList, certificates, experiences])

  // 3. Action Append Macro Triggers
  const handleAppendSkill = () => {
    if (!newSkill.trim()) return
    const formatted = newSkill.trim()
    setSkillsList(prev => [...prev, formatted])
    if (formatted === 'System Design' || formatted === 'Docker') {
      addSkill('System Design')
    }
    setNewSkill('')
  }

  const handleAppendExperience = () => {
    if (!newRole.trim() || !newCompany.trim() || !newPeriod.trim()) return
    setExperiences(prev => [
      ...prev,
      {
        role: newRole.trim(),
        company: newCompany.trim(),
        period: newPeriod.trim(),
        bullets: newExpBullet.trim() ? [newExpBullet.trim()] : ['Assigned to core software infrastructure sprint loops.']
      }
    ])
    setNewRole('')
    setNewCompany('')
    setNewPeriod('')
    setNewExpBullet('')
  }

  const handleAppendCertificate = () => {
    if (!newCertName.trim() || !newCertIssuer.trim()) return
    setCertificates(prev => [
      ...prev,
      { id: `cert-${Date.now()}`, name: newCertName.trim(), issuer: newCertIssuer.trim(), status: 'Pending' }
    ])
    setNewCertName('')
    setNewCertIssuer('')
  }

  const triggerVerificationSim = (id: string) => {
    setCertificates(prev => prev.map(c => {
      if (c.id === id) {
        if (c.name.toLowerCase().includes('docker') || c.name.toLowerCase().includes('system design')) {
          addSkill('System Design')
        }
        return { ...c, status: 'Verified' }
      }
      return c
    }))
  }

  const handleAppendAcademic = () => {
    if (!newInst.trim() || !newDegree.trim() || !newAcadPeriod.trim()) return
    setAcademics(prev => [
      ...prev,
      {
        institution: newInst.trim(),
        degree: newDegree.trim(),
        period: newAcadPeriod.trim(),
        bullets: newAcadBullet.trim() ? [newAcadBullet.trim()] : []
      }
    ])
    setNewInst('')
    setNewDegree('')
    setNewAcadPeriod('')
    setNewAcadBullet('')
  }

  return (
    <div className="space-y-6">
      
      {/* Real-time Indicator Bar Banner */}
      <Card className="p-6 bg-white border border-[#EBE7E0] rounded-xl shadow-3xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0B1E33]">Global Cryptographic Profile Strength</h3>
            <p className="text-xs text-[#9A7B56]">Recalculated instantly across active candidate views upon entry mutations.</p>
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
              <h2 className="text-3xl font-serif font-bold tracking-tight">{c.name}</h2>
              <p className="text-xs text-[#D8CFC0] max-w-md font-serif italic leading-relaxed">
                Ambitious entry-level systems software analyst with high matching scores across automated ecosystem talent funnels. Cleared for secure contract alignment logs.
              </p>
            </div>
            <div className="space-y-1.5 text-xs text-[#D8CFC0] md:text-right font-mono tracking-tight shrink-0">
              <p>📍 Location: Kuala Lumpur Region</p>
              <p>📱 Secure Core Axis: +60 12-5742296</p>
              <p>✉️ Ecosystem Mail: {c.name.toLowerCase().replace(' ', '')}@gmail.com</p>
            </div>
          </div>

          <div className="p-8 space-y-6">
            
            {/* Dynamic Skills Grid Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#4A3B32] font-bold border-b border-[#EBE7E0] pb-1">Technical Skills Summary</h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {skillsList.map((skill, idx) => (
                  <span key={idx} className="bg-neutral-100 text-[#0B1E33] border border-neutral-200 text-xs font-mono px-2.5 py-1 rounded-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Dynamic Experiences Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#4A3B32] font-bold border-b border-[#EBE7E0] pb-1">Professional Experience Ledger</h3>
              <div className="relative pl-6 space-y-6">
                <div className="absolute left-1.5 top-2 bottom-2 w-px bg-[#4A3B32]/30" />
                {experiences.map((exp, i) => (
                  <div key={i} className="relative space-y-1">
                    <div className="absolute -left-[23px] top-1 h-2.5 w-2.5 rounded-full border border-[#4A3B32] bg-white shadow-3xs" />
                    <div className="flex justify-between text-xs font-bold text-[#0B1E33]">
                      <h5>{exp.role}</h5>
                      <span className="font-mono text-neutral-500 font-normal">{exp.period}</span>
                    </div>
                    <p className="text-[11px] text-[#9A7B56] font-medium font-serif italic">{exp.company} &middot; Verified Record Node</p>
                    <ul className="list-disc pl-4 text-xs text-neutral-600 space-y-1 mt-1">
                      {exp.bullets.map((b, idx) => <li key={idx}>{b}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Certificates Section with Interactive Verification Trigger Action Link */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#4A3B32] font-bold border-b border-[#EBE7E0] pb-1">Cryptographic Credentials Vault</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {certificates.map((cert) => (
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
                          Verify Node
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Academics Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#4A3B32] font-bold border-b border-[#EBE7E0] pb-1">Academic Records</h3>
              <div className="space-y-4">
                {academics.map((acad, i) => (
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
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}