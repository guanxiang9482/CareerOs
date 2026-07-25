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

