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
}

// The demo job Aisyah is tracked against throughout the walkthrough.
export const FEATURED_JOB: JobPosting = JOBS.find((j) => j.role === 'Backend Engineer') ?? JOBS[0]

// Aisyah's seed application: starts in "Not Qualified" because of a missing
// System Design skill. Clicking Haven's suggestion promotes her to Reviewing Queue.
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
}

// A handful of supporting applications so the kanban board and employer feed
// don't look empty with just one card in play.
function buildSupportingApplications(): ApplicationRecord[] {
  // Scale from 24 up to 400 to populate the multi-tenant metrics dashboards realistically
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
    }
  })
}

export const INITIAL_APPLICATIONS: ApplicationRecord[] = [AISYAH_APPLICATION, ...buildSupportingApplications()]

export const KANBAN_STAGES: PipelineStage[] = ['Top Tier Pool', 'Reviewing Queue', 'Queueing', 'Not Qualified']

// --- Living Portfolio persistence shapes ------------------------------------
// Created once at registration, then read/written by PortfolioTab as the
// candidate adds projects, experience, and certificates during later logins.

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

// Single scoring function shared by registration preview and the live
// Portfolio tab, so the grade never diverges depending on which screen
// computed it.
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

// Registration form → the same PortfolioRecord shape PortfolioTab reads/writes.
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

// --- Registered users (localStorage-backed auth stand-in) ------------------
// Not real auth — password stored in plaintext for demo only. Never ship
// this pattern to production; it exists so login can gate views locally.

export interface RegisteredUser {
  email: string
  name: string
  role: 'candidate' | 'employer' | 'university'
  password: string
}

export type RegisterResult = { ok: true } | { ok: false; error: string }
export type LoginResult = { ok: true; user: RegisteredUser } | { ok: false; error: string }

