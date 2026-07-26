import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  INITIAL_APPLICATIONS,
  FEATURED_JOB,
  type ApplicationRecord,
  type PipelineStage,
  type PortfolioRecord,
  type RegisteredUser,
  type RegisterResult,
  type LoginResult,
  createEmptyPortfolio,
} from './appState'
import { JOBS, DEMO_CANDIDATE, CANDIDATES, SEED_REGISTERED_USERS, type JobPosting } from './mockData'
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from './storage'

interface FairPayInputs {
  rentInput: number
  livingInput: number
  transportInput: number
}

const DEFAULT_FAIR_PAY: FairPayInputs = { rentInput: 1450, livingInput: 900, transportInput: 420 }

interface AppContextValue {
  applications: ApplicationRecord[]
  selectedJobId: string
  selectedJob: JobPosting
  setSelectedJobId: (jobId: string) => void
  injectDockerProject: (applicationId: string) => void

  userSkills: string[]
  addSkill: (skill: string) => void
  removeSkill: (skill: string) => void
  updateApplicationStage: (applicationId: string, newStage: PipelineStage) => void
  
  submitApplicationFeedback: (applicationId: string, reason: string, note: string) => void

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

  currentUserEmail: string | null
  currentUserRole: RegisteredUser['role'] | null
  isLoggedIn: boolean
  registerUser: (
    user: Omit<RegisteredUser, 'password'> & { password: string },
    portfolio?: PortfolioRecord
  ) => RegisterResult
  loginUser: (email: string, password: string) => LoginResult
  logoutUser: () => void
  findRegisteredUser: (email: string) => RegisteredUser | null

  portfolio: PortfolioRecord | null
  updatePortfolio: (updater: (prev: PortfolioRecord) => PortfolioRecord) => void
}

const AppContext = createContext<AppContextValue | null>(null)

function loadPortfolioForEmail(email: string): PortfolioRecord | null {
  return loadFromStorage<PortfolioRecord | null>(`${STORAGE_KEYS.portfolio}:${email}`, null)
}

export function AppProvider({ children }: { children: ReactNode }) {
  // FORCE OVERRIDE: If the user has fewer than 10 apps saved, force the master seed data
  const [applications, setApplications] = useState<ApplicationRecord[]>(() => {
    const saved = loadFromStorage(STORAGE_KEYS.applications, [] as ApplicationRecord[])
    if (!saved || saved.length < 10) {
      return INITIAL_APPLICATIONS
    }
    return saved
  })

  const [selectedJobId, setSelectedJobId] = useState<string>(FEATURED_JOB.id)
  
  const [authedName, setAuthedName] = useState<string | null>(() =>
    loadFromStorage(STORAGE_KEYS.authedName, null as string | null)
  )
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(() =>
    loadFromStorage(STORAGE_KEYS.currentUserEmail, null as string | null)
  )
  const [currentUserRole, setCurrentUserRole] = useState<RegisteredUser['role'] | null>(() =>
    loadFromStorage(STORAGE_KEYS.currentUserRole, null as RegisteredUser['role'] | null)
  )

  const [userSkills, setUserSkills] = useState<string[]>(() =>
    loadFromStorage(STORAGE_KEYS.userSkills, ['SQL', 'Python', 'AWS'])
  )

  const [fairPay, setFairPay] = useState<FairPayInputs>(() =>
    loadFromStorage(STORAGE_KEYS.fairPayInputs, DEFAULT_FAIR_PAY)
  )

  // FORCE OVERRIDE: If the user has fewer than 10 users saved, force the master seed data
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() => {
    const saved = loadFromStorage(STORAGE_KEYS.registeredUsers, [] as RegisteredUser[])
    if (!saved || saved.length < 10) {
      return SEED_REGISTERED_USERS as RegisteredUser[]
    }
    return saved
  })

  const [portfolio, setPortfolio] = useState<PortfolioRecord | null>(() => {
    const email = loadFromStorage<string | null>(STORAGE_KEYS.currentUserEmail, null)
    const role = loadFromStorage<RegisteredUser['role'] | null>(STORAGE_KEYS.currentUserRole, null)
    if (email && role === 'candidate') {
      return loadPortfolioForEmail(email)
    }
    return null
  })

  useEffect(() => { saveToStorage(STORAGE_KEYS.applications, applications) }, [applications])
  useEffect(() => { saveToStorage(STORAGE_KEYS.userSkills, userSkills) }, [userSkills])
  useEffect(() => { saveToStorage(STORAGE_KEYS.fairPayInputs, fairPay) }, [fairPay])
  useEffect(() => { saveToStorage(STORAGE_KEYS.authedName, authedName) }, [authedName])
  useEffect(() => { saveToStorage(STORAGE_KEYS.registeredUsers, registeredUsers) }, [registeredUsers])
  useEffect(() => { saveToStorage(STORAGE_KEYS.currentUserEmail, currentUserEmail) }, [currentUserEmail])
  useEffect(() => { saveToStorage(STORAGE_KEYS.currentUserRole, currentUserRole) }, [currentUserRole])
  useEffect(() => {
    if (portfolio) saveToStorage(`${STORAGE_KEYS.portfolio}:${portfolio.candidateEmail}`, portfolio)
  }, [portfolio])

  const selectedJob = useMemo(() => JOBS.find((j) => j.id === selectedJobId) ?? FEATURED_JOB, [selectedJobId])

  function setRentInput(val: number) { setFairPay((prev) => ({ ...prev, rentInput: val })) }
  function setLivingInput(val: number) { setFairPay((prev) => ({ ...prev, livingInput: val })) }
  function setTransportInput(val: number) { setFairPay((prev) => ({ ...prev, transportInput: val })) }

  function addSkill(skill: string) {
    setUserSkills(prev => prev.includes(skill) ? prev : [...prev, skill])
    setApplications(prev => prev.map(app => {
      if (app.candidateName === authedName || app.candidateId === DEMO_CANDIDATE.id) {
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

  function removeSkill(skill: string) {
    setUserSkills(prev => prev.filter(s => s !== skill))
    setApplications(prev => prev.map(app => {
      if (app.candidateName === authedName || app.candidateId === DEMO_CANDIDATE.id) {
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

  function injectDockerProject(_applicationId: string) {
    addSkill('System Design')
  }

  function updateApplicationStage(applicationId: string, newStage: PipelineStage) {
    setApplications(prev => prev.map(app =>
      app.id === applicationId ? { ...app, stage: newStage } : app
    ))
  }

  function submitApplicationFeedback(applicationId: string, reason: string, note: string) {
    setApplications(prev => prev.map(app =>
      app.id === applicationId
        ? { ...app, stage: 'Not Qualified', employerFeedbackReason: reason, employerNote: note }
        : app
    ))
  }

  function getActiveCandidateId(): string {
    const candidateName = authedName || DEMO_CANDIDATE.name
    const matchedRecord = CANDIDATES.find(c => c.name === candidateName)
    return matchedRecord ? matchedRecord.id : DEMO_CANDIDATE.id
  }

  function applyToJob(jobId: string) {
    const job = JOBS.find((j) => j.id === jobId)
    if (!job) return

    const activeCandidateId = getActiveCandidateId()

    if (applications.some((app) => app.jobId === jobId && app.candidateId === activeCandidateId)) return

    const isBackend = job.role === 'Backend Engineer'
    const isMissingSystemDesign = isBackend && !userSkills.includes('System Design')
    const missing = isMissingSystemDesign ? ['System Design'] : []

    const newApplication: ApplicationRecord = {
      id: `APP-${Date.now()}`,
      candidateId: activeCandidateId,
      candidateName: authedName || DEMO_CANDIDATE.name,
      jobId: job.id,
      jobRole: job.role,
      company: job.company,
      university: DEMO_CANDIDATE.university,
      field: DEMO_CANDIDATE.field,
      stage: missing.length > 0 ? 'Not Qualified' : 'Queueing',
      matchScore: missing.length > 0 ? 78 : 94,
      missingSkills: missing,
      portfolioScore: DEMO_CANDIDATE.portfolioScore,
      daysSinceApplied: 0 
    }

    setApplications((prev) => [newApplication, ...prev])
  }

  function hasApplied(jobId: string): boolean {
    const activeCandidateId = getActiveCandidateId()
    return applications.some((app) => app.jobId === jobId && app.candidateId === activeCandidateId)
  }

  function findRegisteredUser(email: string): RegisteredUser | null {
    const clean = email.trim().toLowerCase()
    return registeredUsers.find((u) => u.email.toLowerCase() === clean) ?? null
  }

  function establishSession(user: RegisteredUser) {
    setCurrentUserEmail(user.email)
    setCurrentUserRole(user.role)
    setAuthedName(user.name)

    if (user.role === 'candidate') {
      const existing = loadPortfolioForEmail(user.email)
      setPortfolio(existing ?? createEmptyPortfolio(user.email, user.name, ''))
    } else {
      setPortfolio(null)
    }
  }

  function registerUser(
    user: Omit<RegisteredUser, 'password'> & { password: string },
    portfolio?: PortfolioRecord
  ): RegisterResult {
    const cleanEmail = user.email.trim().toLowerCase()
    const cleanPassword = user.password.trim()

    if (!cleanEmail) return { ok: false, error: 'Email is required.' }
    if (cleanPassword.length < 4) return { ok: false, error: 'Password must be at least 4 characters.' }
    if (findRegisteredUser(cleanEmail)) {
      return { ok: false, error: 'An account with this email already exists — try logging in instead.' }
    }

    const record: RegisteredUser = {
      email: cleanEmail,
      name: user.name.trim() || 'Untitled Profile',
      role: user.role,
      password: cleanPassword,
    }

    setRegisteredUsers((prev) => [...prev, record])

    if (user.role === 'candidate') {
      const newPortfolio = portfolio ?? createEmptyPortfolio(cleanEmail, record.name, '')
      setPortfolio(newPortfolio)
      saveToStorage(`${STORAGE_KEYS.portfolio}:${cleanEmail}`, newPortfolio)
    }

    establishSession(record)
    return { ok: true }
  }

  function loginUser(email: string, password: string): LoginResult {
    const cleanEmail = email.trim().toLowerCase()
    const cleanPassword = password.trim()

    if (!cleanEmail || !cleanPassword) {
      return { ok: false, error: 'Email and password are required.' }
    }

    const user = findRegisteredUser(cleanEmail)
    if (!user) {
      return { ok: false, error: 'No account found for this email. Register first or check your spelling.' }
    }
    if (user.password !== cleanPassword) {
      return { ok: false, error: 'Incorrect password.' }
    }

    establishSession(user)
    return { ok: true, user }
  }

  function logoutUser() {
    setCurrentUserEmail(null)
    setCurrentUserRole(null)
    setAuthedName(null)
    setPortfolio(null)
  }

  function updatePortfolio(updater: (prev: PortfolioRecord) => PortfolioRecord) {
    setPortfolio((prev) => {
      if (!prev) return prev
      return updater(prev)
    })
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
    submitApplicationFeedback,
    rentInput: fairPay.rentInput,
    setRentInput,
    livingInput: fairPay.livingInput,
    setLivingInput,
    transportInput: fairPay.transportInput,
    setTransportInput,
    authedName,
    setAuthedName,
    applyToJob,
    hasApplied,
    currentUserEmail,
    currentUserRole,
    isLoggedIn: currentUserEmail !== null,
    registerUser,
    loginUser,
    logoutUser,
    findRegisteredUser,
    portfolio,
    updatePortfolio,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}