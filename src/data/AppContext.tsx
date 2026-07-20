import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { INITIAL_APPLICATIONS, FEATURED_JOB, type ApplicationRecord } from './appState'
import { JOBS, type JobPosting } from './mockData'

interface AppContextValue {
  applications: ApplicationRecord[]
  selectedJobId: string
  selectedJob: JobPosting
  setSelectedJobId: (jobId: string) => void
  injectDockerProject: (applicationId: string) => void
  authedName: string | null
  setAuthedName: (name: string | null) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<ApplicationRecord[]>(INITIAL_APPLICATIONS)
  const [selectedJobId, setSelectedJobId] = useState<string>(FEATURED_JOB.id)
  const [authedName, setAuthedName] = useState<string | null>(null)

  const selectedJob = useMemo(() => JOBS.find((j) => j.id === selectedJobId) ?? FEATURED_JOB, [selectedJobId])

  function injectDockerProject(applicationId: string) {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              stage: 'Reviewing Queue',
              missingSkills: app.missingSkills.filter((s) => s !== 'System Design'),
              matchScore: Math.min(96, app.matchScore + 18),
              portfolioScore: Math.min(96, app.portfolioScore + 8),
            }
          : app
      )
    )
  }

  const value: AppContextValue = {
    applications,
    selectedJobId,
    selectedJob,
    setSelectedJobId,
    injectDockerProject,
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
