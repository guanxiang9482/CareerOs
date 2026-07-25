import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { INITIAL_APPLICATIONS, FEATURED_JOB, type ApplicationRecord, type PipelineStage } from './appState'
import { JOBS, DEMO_CANDIDATE, type JobPosting } from './mockData'

interface AppContextValue {
  applications: ApplicationRecord[]
  selectedJobId: string
  selectedJob: JobPosting
  setSelectedJobId: (jobId: string) => void
  injectDockerProject: (applicationId: string) => void
  
  // Real-time interactive state modifiers
  userSkills: string[]
  addSkill: (skill: string) => void
  removeSkill: (skill: string) => void
  updateApplicationStage: (applicationId: string, newStage: PipelineStage) => void
  
  // Dynamic Cost of Living parameters for the Fair Pay Engine worksheet
  rentInput: number
  setRentInput: (val: number) => void
  livingInput: number
  setLivingInput: (val: number) => void
  transportInput: number
  setTransportInput: (val: number) => void
  
  authedName: string | null
  setAuthedName: (name: string | null) => void
  applyToJob: (jobId: string) => void
  hasApplied: (jobId: string) => boolean
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<ApplicationRecord[]>(INITIAL_APPLICATIONS)
  const [selectedJobId, setSelectedJobId] = useState<string>(FEATURED_JOB.id)
  const [authedName, setAuthedName] = useState<string | null>(null)

  // Manage baseline portfolio skills responsively
  const [userSkills, setUserSkills] = useState<string[]>(['SQL', 'Python', 'AWS'])
  
  // Custom user calculation adjustments for the Fair Pay Engine worksheet
  const [rentInput, setRentInput] = useState<number>(1450)
  const [livingInput, setLivingInput] = useState<number>(900)
  const [transportInput, setTransportInput] = useState<number>(420)

  const selectedJob = useMemo(() => JOBS.find((j) => j.id === selectedJobId) ?? FEATURED_JOB, [selectedJobId])

  // Adds a skill and dynamically recalibrates the candidate pipeline parameters
  function addSkill(skill: string) {
    setUserSkills(prev => prev.includes(skill) ? prev : [...prev, skill])
    setApplications(prev => prev.map(app => {
      if (app.candidateId === DEMO_CANDIDATE.id) {
        const remainingSkills = app.missingSkills.filter(s => s !== skill)
        return {
          ...app,
          missingSkills: remainingSkills,
          stage: remainingSkills.length === 0 ? 'Reviewing Queue' : app.stage,
          portfolioScore: Math.min(98, app.portfolioScore + 12),
          matchScore: remainingSkills.length === 0 ? 94 : app.matchScore
        }
      }
      return app
    }))
  }

  // Removes a skill and dynamically drops the candidate alignment indexes
  function removeSkill(skill: string) {
    setUserSkills(prev => prev.filter(s => s !== skill))
    setApplications(prev => prev.map(app => {
      if (app.candidateId === DEMO_CANDIDATE.id) {
        return {
          ...app,
          missingSkills: [...app.missingSkills, skill],
          stage: 'Not Qualified',
          portfolioScore: Math.max(50, app.portfolioScore - 12),
          matchScore: 78
        }
      }
      return app
    }))
  }

  // Links your existing tracker button trigger directly into the skill pipeline
  function injectDockerProject(applicationId: string) {
    addSkill('System Design')
  }

  // Allows employer dashboard roles to drop or advance cards on the Kanban board live
  function updateApplicationStage(applicationId: string, newStage: PipelineStage) {
    setApplications(prev => prev.map(app => 
      app.id === applicationId ? { ...app, stage: newStage } : app
    ))
  }

  function applyToJob(jobId: string) {
  // Locate the target job listing from the dataset pool
  const job = JOBS.find((j) => j.id === jobId)
  if (!job) return

  // Prevent duplicate submissions for the same candidate session
  if (applications.some((app) => app.jobId === jobId && app.candidateId === DEMO_CANDIDATE.id)) return

  // Dynamically calculate qualification gaps based on active user portfolio assets
  const isBackend = job.role === 'Backend Engineer'
  const isMissingSystemDesign = isBackend && !userSkills.includes('System Design')
  const missing = isMissingSystemDesign ? ['System Design'] : []

  const newApplication: ApplicationRecord = {
    id: `APP-${Date.now()}`,
    candidateId: DEMO_CANDIDATE.id,
    candidateName: DEMO_CANDIDATE.name,
    jobId: job.id,
    jobRole: job.role,
    company: job.company,
    university: DEMO_CANDIDATE.university,
    field: DEMO_CANDIDATE.field,
    // Assign Kanban tracking column depending on live capability assets
    stage: missing.length > 0 ? 'Not Qualified' : 'Queueing',
    matchScore: missing.length > 0 ? 78 : 94,
    missingSkills: missing,
    portfolioScore: DEMO_CANDIDATE.portfolioScore
  }

  // Prepend new record into active global state so tracker views update instantly
  setApplications((prev) => [newApplication, ...prev])
}

function hasApplied(jobId: string): boolean {
  return applications.some((app) => app.jobId === jobId && app.candidateId === DEMO_CANDIDATE.id)
}

  const value: AppContextValue = {
    applications,
    selectedJobId,
    selectedJob,
    setSelectedJobId,
    injectDockerProject,
    userSkills,
    addSkill,
    removeSkill,
    updateApplicationStage,
    rentInput,
    setRentInput,
    livingInput,
    setLivingInput,
    transportInput,
    setTransportInput,
    authedName,
    setAuthedName,
    applyToJob,
    hasApplied,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}

