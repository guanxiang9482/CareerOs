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
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}