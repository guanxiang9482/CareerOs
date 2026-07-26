import { CANDIDATES, JOBS, DEMO_CANDIDATE, type CandidateRecord, type JobPosting } from './mockData'

export type PipelineStage = 'Not Qualified' | 'Queueing' | 'Reviewing Queue' | 'Top Tier Pool' | 'Hired'

export interface ApplicationRecord {
  id: string
  candidateId: string
  candidateName: string
  jobId: string
  jobRole: string
  company: string
  university: string
  field: CandidateRecord['field']
  stage: PipelineStage
  matchScore: number
  missingSkills: string[]
  portfolioScore: number
  
  // MERGED: Teammate's SLA tracking and Feedback fields
  daysSinceApplied: number
  employerFeedbackReason?: string
  employerNote?: string
}

// MERGED: SLA Windows & Labels from teammate's version
export const SLA_WINDOW_DAYS = 28
export type SlaStatus = 'On Track' | 'Due Soon' | 'Breached' | 'Resolved'

export function getSlaStatus(app: Pick<ApplicationRecord, 'stage' | 'daysSinceApplied'>): SlaStatus {
  if (app.stage === 'Hired' || app.stage === 'Not Qualified') return 'Resolved'
  if (app.daysSinceApplied >= SLA_WINDOW_DAYS) return 'Breached'
  if (app.daysSinceApplied >= SLA_WINDOW_DAYS - 7) return 'Due Soon'
  return 'On Track'
}

export function stageDisplayLabel(stage: PipelineStage): string {
  return stage === 'Not Qualified' ? 'Not a match this time' : stage
}

// Deterministic PRNG for stable daysSinceApplied seeding
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const slaRand = mulberry32(20260728)

export const FEATURED_JOB: JobPosting = JOBS.find((j) => j.role === 'Backend Engineer') ?? JOBS[0]

const AISYAH_APPLICATION: ApplicationRecord = {
  id: 'APP-0001',
  candidateId: DEMO_CANDIDATE.id,
  candidateName: DEMO_CANDIDATE.name,
  jobId: FEATURED_JOB.id,
  jobRole: FEATURED_JOB.role,
  company: FEATURED_JOB.company,
  university: DEMO_CANDIDATE.university,
  field: DEMO_CANDIDATE.field,
  stage: 'Not Qualified',
  matchScore: 78,
  missingSkills: ['System Design'],
  portfolioScore: DEMO_CANDIDATE.portfolioScore,
  daysSinceApplied: 5, // Merged
}

function buildSupportingApplications(): ApplicationRecord[] {
  const pool = CANDIDATES.slice(0, 400)
  const stages: PipelineStage[] = ['Queueing', 'Reviewing Queue', 'Top Tier Pool', 'Not Qualified', 'Hired']
  return pool.map((c, i) => {
    const job = JOBS[i % JOBS.length]
    return {
      id: `APP-${2000 + i}`,
      candidateId: c.id,
      candidateName: c.name,
      jobId: job.id,
      jobRole: job.role,
      company: job.company,
      university: c.university,
      field: c.field,
      stage: stages[i % stages.length],
      matchScore: Math.min(97, 50 + c.portfolioScore * 0.5),
      missingSkills: c.portfolioScore < 55 ? ['System Design'] : [],
      portfolioScore: c.portfolioScore,
      daysSinceApplied: Math.floor(slaRand() * 40), // Merged
    }
  })
}

export const INITIAL_APPLICATIONS: ApplicationRecord[] = [AISYAH_APPLICATION, ...buildSupportingApplications()]

export const KANBAN_STAGES: PipelineStage[] = ['Top Tier Pool', 'Reviewing Queue', 'Queueing', 'Not Qualified']

// --- Living Portfolio persistence shapes (Original Base Logic preserved) ---
export interface PortfolioExperience {
  role: string
  company: string
  period: string
  bullets: string[]
}

export interface PortfolioCertificate {
  id: string
  name: string
  issuer: string
  status: 'Pending' | 'Verified'
}

export interface PortfolioAcademic {
  institution: string
  degree: string
  period: string
  bullets: string[]
}

export interface PortfolioProject {
  id: string
  title: string
  description: string
}

export interface PortfolioRecord {
  candidateEmail: string
  name: string
  headline: string
  skills: string[]
  experiences: PortfolioExperience[]
  certificates: PortfolioCertificate[]
  academics: PortfolioAcademic[]
  projects: PortfolioProject[]
}

export function calculatePortfolioScore(p: Pick<PortfolioRecord, 'skills' | 'certificates' | 'experiences' | 'projects'>): number {
  const verifiedCount = p.certificates.filter((c) => c.status === 'Verified').length
  return Math.min(
    99,
    65 + p.skills.length * 3 + verifiedCount * 6 + p.experiences.length * 4 + p.projects.length * 3
  )
}

export function createEmptyPortfolio(email: string, name: string, headline: string): PortfolioRecord {
  return {
    candidateEmail: email,
    name,
    headline,
    skills: [],
    experiences: [],
    certificates: [],
    academics: [],
    projects: [],
  }
}

export interface RegistrationPortfolioInput {
  email: string
  name: string
  headline: string
  skills: string[]
  institution?: string
  fieldOfStudy?: string
  gradYear?: string
  level?: string
  cgpa?: string
  jobTitle?: string
  company?: string
  duration?: string
  experienceDesc?: string
}

export function createPortfolioFromRegistration(input: RegistrationPortfolioInput): PortfolioRecord {
  const academics: PortfolioAcademic[] = []
  if (input.institution?.trim() || input.fieldOfStudy?.trim()) {
    const degreeParts = [input.level?.trim(), input.fieldOfStudy?.trim()].filter(Boolean)
    academics.push({
      institution: input.institution?.trim() || 'Institution',
      degree: degreeParts.length > 0 ? degreeParts.join(' in ') : 'Degree',
      period: input.gradYear?.trim() || '',
      bullets: input.cgpa?.trim() ? [`CGPA: ${input.cgpa.trim()}`] : [],
    })
  }

  const experiences: PortfolioExperience[] = []
  if (input.jobTitle?.trim() || input.company?.trim()) {
    experiences.push({
      role: input.jobTitle?.trim() || 'Role',
      company: input.company?.trim() || 'Company',
      period: input.duration?.trim() || '',
      bullets: input.experienceDesc?.trim()
        ? [input.experienceDesc.trim()]
        : ['Assigned to core software infrastructure sprint loops.'],
    })
  }

  return {
    candidateEmail: input.email.trim().toLowerCase(),
    name: input.name.trim() || 'Untitled Profile',
    headline: input.headline.trim(),
    skills: input.skills,
    experiences,
    certificates: [],
    academics,
    projects: [],
  }
}

export interface RegisteredUser {
  email: string
  name: string
  role: 'candidate' | 'employer' | 'university'
  password: string
}

export type RegisterResult = { ok: true } | { ok: false; error: string }
export type LoginResult = { ok: true; user: RegisteredUser } | { ok: false; error: string }
