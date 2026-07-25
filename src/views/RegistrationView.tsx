import { useState } from 'react'

export function RegistrationView({ onComplete }: { onComplete: () => void }) {
  // 1. Unified Real-Time Form State Manager
  const [form, setForm] = useState({
    name: 'Aisyah Yusof',
    headline: 'Fresh CS graduate aiming for data & analytics roles',
    status: 'Working professional',
    age: '23',
    gender: 'Female',
    email: 'aisyah.yusof@email.com',
    phone: '+60 12-345 6789',
    location: 'Kuala Lumpur',
    institution: 'University of Malaya',
    fieldOfStudy: 'Computer Science',
    gradYear: '2025',
    level: "Bachelor's degree",
    cgpa: '3.72',
    jobTitle: 'Software Engineering Intern',
    company: 'Maybank',
    duration: 'Jun 2024 — Aug 2024',
    experienceDesc: 'Built internal dashboards used by 40+ staff and automated a weekly report with Python and SQL.',
    expectedSalary: '3,800 — 5,000',
    preferredRole: 'Data Analyst',
    linkedin: 'linkedin.com/in/aisyah-yusof',
    github: 'github.com/aisyah-yusof'
  })

  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Python', 'SQL', 'JavaScript', 'Data analysis', 'Communication'])
  const availableSkills = ['Python', 'SQL', 'JavaScript', 'Data analysis', 'Excel', 'Communication', 'Project management', 'Design', 'Marketing', 'Leadership']

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    )
  }

  const updateField = (field: string, val: string) => {
    setForm(prev => ({ ...prev, [field]: val }))
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-12 bg-[#FDFBF9]">
      
      {/* Editorial Header Banner */}
      <div className="mb-10 border-b border-[#EBE7E0] pb-6">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#9A7B56]">
          Join Career OS for Talent
        </span>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0B1E33] sm:text-4xl">
          Create your Career OS <span className="font-serif italic font-normal text-[#9A7B56]">profile.</span>
        </h1>
        <p className="mt-2 text-sm text-[#6B5A44]">
          One page, a few minutes. The more you share, the sharper Haven matches you to real roles.
        </p>
      </div>

      {/* Two-Column Split Engine Workspace Layout */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
        
        {/* LEFT COLUMN: 6-Step Dynamic Form Entry */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Section 1: About You */}
          <div className="rounded-xl border border-[#EBE7E0] bg-white p-7 shadow-2xs">
            <div className="flex items-center gap-2 mb-6 border-b border-[#FAF8F5] pb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0B1E33] text-xs font-mono text-white">1</span>
              <h3 className="text-base font-bold text-[#0B1E33]">About you</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-mono uppercase text-[#9A7B56] mb-1.5">Full Name</label>
                <input type="text" value={form.name} onChange={(e) => updateField('name', e.target.value)} className="w-full rounded-lg border border-[#EBE7E0] bg-[#FDFBF9] px-4 py-2.5 text-sm outline-none focus:border-[#9A7B56]" />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-[#9A7B56] mb-1.5">Headline</label>
                <input type="text" value={form.headline} onChange={(e) => updateField('headline', e.target.value)} className="w-full rounded-lg border border-[#EBE7E0] bg-[#FDFBF9] px-4 py-2.5 text-sm outline-none focus:border-[#9A7B56]" />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-[#9A7B56] mb-1.5">Current Status</label>
                <select value={form.status} onChange={(e) => updateField('status', e.target.value)} className="w-full rounded-lg border border-[#EBE7E0] bg-[#FDFBF9] px-4 py-2.5 text-sm outline-none focus:border-[#9A7B56]">
                  <option>Working professional</option>
                  <option>Fresh CS Graduate</option>
                  <option>Career Switcher</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#9A7B56] mb-1.5">Age</label>
                  <input type="number" value={form.age} onChange={(e) => updateField('age', e.target.value)} className="w-full rounded-lg border border-[#EBE7E0] bg-[#FDFBF9] px-4 py-2.5 text-sm outline-none focus:border-[#9A7B56]" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#9A7B56] mb-1.5">Gender</label>
                  <input type="text" value={form.gender} onChange={(e) => updateField('gender', e.target.value)} className="w-full rounded-lg border border-[#EBE7E0] bg-[#FDFBF9] px-4 py-2.5 text-sm outline-none focus:border-[#9A7B56]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-[#9A7B56] mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} className="w-full rounded-lg border border-[#EBE7E0] bg-[#FDFBF9] px-4 py-2.5 text-sm outline-none focus:border-[#9A7B56]" />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-[#9A7B56] mb-1.5">Location</label>
                <input type="text" value={form.location} onChange={(e) => updateField('location', e.target.value)} className="w-full rounded-lg border border-[#EBE7E0] bg-[#FDFBF9] px-4 py-2.5 text-sm outline-none focus:border-[#9A7B56]" />
              </div>
            </div>
          </div>

          {/* Section 2: Education */}
          <div className="rounded-xl border border-[#EBE7E0] bg-white p-7 shadow-2xs">
            <div className="flex items-center gap-2 mb-6 border-b border-[#FAF8F5] pb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0B1E33] text-xs font-mono text-white">2</span>
              <h3 className="text-base font-bold text-[#0B1E33]">Education</h3>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-mono uppercase text-[#9A7B56] mb-1.5">Institution</label>
                <input type="text" value={form.institution} onChange={(e) => updateField('institution', e.target.value)} className="w-full rounded-lg border border-[#EBE7E0] bg-[#FDFBF9] px-4 py-2.5 text-sm outline-none focus:border-[#9A7B56]" />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-[#9A7B56] mb-1.5">Field of study</label>
                <input type="text" value={form.fieldOfStudy} onChange={(e) => updateField('fieldOfStudy', e.target.value)} className="w-full rounded-lg border border-[#EBE7E0] bg-[#FDFBF9] px-4 py-2.5 text-sm outline-none focus:border-[#9A7B56]" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#9A7B56] mb-1.5">Grad Year</label>
                  <input type="text" value={form.gradYear} onChange={(e) => updateField('gradYear', e.target.value)} className="w-full rounded-lg border border-[#EBE7E0] bg-[#FDFBF9] px-4 py-2.5 text-sm outline-none focus:border-[#9A7B56]" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#9A7B56] mb-1.5">CGPA</label>
                  <input type="text" value={form.cgpa} onChange={(e) => updateField('cgpa', e.target.value)} className="w-full rounded-lg border border-[#EBE7E0] bg-[#FDFBF9] px-4 py-2.5 text-sm outline-none focus:border-[#9A7B56]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-[#9A7B56] mb-1.5">Level</label>
                <input type="text" value={form.level} onChange={(e) => updateField('level', e.target.value)} className="w-full rounded-lg border border-[#EBE7E0] bg-[#FDFBF9] px-4 py-2.5 text-sm outline-none focus:border-[#9A7B56]" />
              </div>
            </div>
          </div>

          {/* Section 3: Experience */}
          <div className="rounded-xl border border-[#EBE7E0] bg-white p-7 shadow-2xs">
            <div className="flex items-center gap-2 mb-6 border-b border-[#FAF8F5] pb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0B1E33] text-xs font-mono text-white">3</span>
              <h3 className="text-base font-bold text-[#0B1E33]">Experience</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#9A7B56] mb-1.5">Job Title</label>
                  <input type="text" value={form.jobTitle} onChange={(e) => updateField('jobTitle', e.target.value)} className="w-full rounded-lg border border-[#EBE7E0] bg-[#FDFBF9] px-4 py-2.5 text-sm outline-none focus:border-[#9A7B56]" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#9A7B56] mb-1.5">Company</label>
                  <input type="text" value={form.company} onChange={(e) => updateField('company', e.target.value)} className="w-full rounded-lg border border-[#EBE7E0] bg-[#FDFBF9] px-4 py-2.5 text-sm outline-none focus:border-[#9A7B56]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-[#9A7B56] mb-1.5">What you did</label>
                <textarea rows={3} value={form.experienceDesc} onChange={(e) => updateField('experienceDesc', e.target.value)} className="w-full rounded-lg border border-[#EBE7E0] bg-[#FDFBF9] px-4 py-2.5 text-sm outline-none focus:border-[#9A7B56] resize-none" />
              </div>
            </div>
          </div>

          {/* Section 4: Skills & Preferences */}
          <div className="rounded-xl border border-[#EBE7E0] bg-white p-7 shadow-2xs">
            <div className="flex items-center gap-2 mb-6 border-b border-[#FAF8F5] pb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0B1E33] text-xs font-mono text-white">4</span>
              <h3 className="text-base font-bold text-[#0B1E33]">Skills & interests</h3>
            </div>
            
            <label className="block text-xs font-mono uppercase text-[#9A7B56] mb-2">Top skills (tap to select)</label>
            <div className="flex flex-wrap gap-2 mb-6">
              {availableSkills.map(skill => {
                const hasSkill = selectedSkills.includes(skill)
                return (
                  <button key={skill} onClick={() => toggleSkill(skill)} className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                    hasSkill ? 'bg-[#0B1E33] text-white' : 'border border-[#EBE7E0] text-[#6B5A44] hover:bg-[#FDFBF9]'
                  }`}>
                    {skill}
                  </button>
                )
              })}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-mono uppercase text-[#9A7B56] mb-1.5">Preferred Role</label>
                <input type="text" value={form.preferredRole} onChange={(e) => updateField('preferredRole', e.target.value)} className="w-full rounded-lg border border-[#EBE7E0] bg-[#FDFBF9] px-4 py-2.5 text-sm outline-none focus:border-[#9A7B56]" />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-[#9A7B56] mb-1.5">Expected Salary (RM/month)</label>
                <input type="text" value={form.expectedSalary} onChange={(e) => updateField('expectedSalary', e.target.value)} className="w-full rounded-lg border border-[#EBE7E0] bg-[#FDFBF9] px-4 py-2.5 text-sm outline-none focus:border-[#9A7B56]" />
              </div>
            </div>
          </div>

          {/* Final Launch Confirmation */}
          <div className="pt-4">
            <button onClick={onComplete} className="w-full rounded-full bg-[#9A7B56] py-4 text-sm font-mono uppercase tracking-[0.14em] text-white hover:bg-[#836847] shadow-sm transition-all cursor-pointer">
              Create my profile &middot; Sync Workspace &rarr;
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: Real-Time Living Portfolio Preview Card */}
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <div className="rounded-xl border border-[#9A7B56]/40 bg-[#FAF8F5] p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b border-[#EBE7E0] pb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#9A7B56]">
                Living Portfolio Preview
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-700 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Live Sync Active
              </span>
            </div>

            {/* Simulated Candidate Identity Banner */}
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-[#0B1E33] tracking-tight">{form.name || 'Untitled Profile'}</h2>
              <p className="text-xs text-[#9A7B56] font-medium">{form.headline || 'No headline set'}</p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1 text-[11px] text-[#6B5A44]/80 font-mono">
                <span>📍 {form.location}</span>
                <span>•</span>
                <span>💼 {form.status}</span>
              </div>
            </div>

            {/* Simulated Experience Card Layer */}
            <div className="mt-6 border-t border-[#EBE7E0] pt-4">
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#9A7B56] mb-2">Experience</p>
              <div className="rounded-lg bg-white p-4 border border-[#EBE7E0] shadow-2xs">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="text-sm font-bold text-[#0B1E33]">{form.jobTitle || 'Role Title'}</h4>
                  <span className="text-[10px] font-mono text-[#9A7B56] shrink-0">{form.duration}</span>
                </div>
                <p className="text-xs text-[#6B5A44] font-medium mt-0.5">{form.company || 'Company Name'}</p>
                <p className="text-xs text-[#6B5A44]/90 mt-2 leading-relaxed font-sans">{form.experienceDesc || 'No summary parsed.'}</p>
              </div>
            </div>

            {/* Simulated Academic Record Card Layer */}
            <div className="mt-6 border-t border-[#EBE7E0] pt-4">
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#9A7B56] mb-2">Education</p>
              <div className="rounded-lg bg-white p-4 border border-[#EBE7E0] shadow-2xs">
                <div className="flex justify-between items-baseline">
                  <h4 className="text-sm font-bold text-[#0B1E33]">{form.fieldOfStudy || 'Course Major'}</h4>
                  <span className="text-[10px] font-mono text-[#9A7B56]">{form.gradYear}</span>
                </div>
                <p className="text-xs text-[#6B5A44] mt-0.5">{form.institution || 'University Name'} &middot; {form.level}</p>
                {form.cgpa && (
                  <div className="mt-2.5 inline-block bg-emerald-50 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded-sm font-bold">
                    CGPA: {form.cgpa} Verified
                  </div>
                )}
              </div>
            </div>

            {/* Simulated Skill Verification Chips */}
            <div className="mt-6 border-t border-[#EBE7E0] pt-4">
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#9A7B56] mb-2">Top Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedSkills.map(skill => (
                  <span key={skill} className="bg-[#0B1E33] text-white text-[10px] font-medium px-3 py-1 rounded-full">
                    {skill} ✓
                  </span>
                ))}
                {selectedSkills.length === 0 && <span className="text-xs italic text-[#6B5A44]/60">No skills selected</span>}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}