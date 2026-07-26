function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = mulberry32(19820526)
const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)]
const randInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min

export type FieldKey =
  | 'Computer Science'
  | 'Business & Finance'
  | 'Engineering'
  | 'Medicine & Health Sciences'
  | 'Arts & Design'
  | 'Marketing & Communications'

export const FIELDS: FieldKey[] = [
  'Computer Science',
  'Business & Finance',
  'Engineering',
  'Medicine & Health Sciences',
  'Arts & Design',
  'Marketing & Communications',
]

export const UNIVERSITIES = [
  'Universiti Malaya (UM)',
  'Universiti Teknologi Malaysia (UTM)',
  'Universiti Kebangsaan Malaysia (UKM)',
  'Universiti Teknologi MARA (UiTM)',
  'UCSI University',
  'Monash University Malaysia',
  'HELP University',
  'Sunway University',
  "Taylor's University",
  'Multimedia University (MMU)',
]

const BASE_COMPANIES = [
  'CIMB', 'Petronas', 'Grab', 'Maybank', 'AirAsia', 'Shopee', 'Nestlé', 'Axiata', 'Public Bank', 'RHB',
  'Hong Leong', 'Tenaga Nasional', 'Sime Darby', 'IHH Healthcare', 'Sunway', 'IOI', 'Genting', 'Digi', 'Celcom', 'U Mobile',
  'Astro', 'Media Prima', 'Lazada', 'Foodpanda', 'Touch n Go', 'Boost', 'PayNet', 'Proton', 'Perodua', 'UEM',
  'Gamuda', 'YTL', 'Top Glove', 'Hartalega', 'Petron', 'Shell', 'DHL', 'Pos Malaysia', 'J&T Express', 'Prudential'
]
const SUFFIXES = ['Group', 'Holdings', 'Technologies', 'Solutions', 'Partners', 'Ventures']

export const COMPANIES = Array.from({ length: 240 }, (_, i) => {
  if (i < BASE_COMPANIES.length) {
    const name = BASE_COMPANIES[i]
    let industry = 'Technology'
    if (['CIMB', 'Maybank', 'Public Bank', 'RHB', 'Hong Leong', 'Touch n Go', 'Boost', 'PayNet'].includes(name)) industry = 'Banking & Finance'
    if (['Petronas', 'Tenaga Nasional', 'Petron', 'Shell'].includes(name)) industry = 'Energy'
    return { name: name.includes(' ') ? name : `${name} Group`, industry }
  }
  return { 
    name: `${pick(BASE_COMPANIES)} ${pick(SUFFIXES)}`, 
    industry: pick(['Technology', 'Banking & Finance', 'Energy', 'Logistics', 'Healthcare', 'Manufacturing']) 
  }
})

export const LOCATIONS = [
  'Cheras', 'Penang', 'Kepong', 'Bangsar South', 'Petaling Jaya', 'Klang', 'Shah Alam', 'Setia Alam', 'Putrajaya', 'Cyberjaya'
]

export const ROLES: Record<FieldKey, string[]> = {
  'Computer Science': ['Backend Engineer', 'Data Analyst', 'Frontend Engineer', 'QA Engineer', 'DevOps Engineer', 'Cloud Engineer'],
  'Business & Finance': ['Financial Analyst', 'Investment Associate', 'Risk Analyst', 'Business Development Exec'],
  'Engineering': ['Process Engineer', 'Site Engineer', 'Mechanical Design Engineer'],
  'Medicine & Health Sciences': ['Clinical Research Assoc', 'Health Data Coordinator', 'Pharmacist'],
  'Arts & Design': ['UI/UX Designer', 'Brand Designer', 'Motion Graphics Artist'],
  'Marketing & Communications': ['Marketing Executive', 'Content Strategist', 'Social Media Manager'],
}

export const FIRST_NAMES = ['Aisyah', 'Danish', 'Mei Ling', 'Arjun', 'Farah', 'Wei Jian', 'Nur Iman', 'Haziq', 'Sabrina', 'Kavi']
export const LAST_NAMES = ['Yusof', 'Tan', 'Rahman', 'Lim', 'Kumar', 'Osman', 'Wong', 'Ibrahim', 'Chong', 'Aziz']

export type CurrentStatus = 'Student' | 'Recent Graduate' | 'Working Professional' | 'Career Switcher' | 'Returning to Work'

export interface CandidateRecord {
  id: string
  name: string
  field: FieldKey
  currentStatus: CurrentStatus
  university: string
  age: number
  gradYear: number
  portfolioScore: number
  applicationsFiled: number
  status: 'On Track' | 'Needs a Nudge' | 'At Risk'
  targetRole: string
  currentSalary: number
  livingCity: string
  cityTier: 'Tier 1 (KL/Selangor)' | 'Tier 2 (Penang/JB)' | 'Tier 3 (Other states)'
}

export const CANDIDATES: CandidateRecord[] = Array.from({ length: 650 }, (_, i) => {
  const field = pick(FIELDS)
  const university = pick(UNIVERSITIES)
  const gradYear = pick([2024, 2025, 2026])
  const applicationsFiled = randInt(0, 14)
  const portfolioScore = randInt(38, 96)
  let status: CandidateRecord['status'] = 'On Track'
  if (gradYear === 2026 && applicationsFiled === 0) status = 'At Risk'
  else if (applicationsFiled < 3 || portfolioScore < 55) status = 'Needs a Nudge'
  
  return {
    id: `CAND-${1000 + i}`,
    name: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
    field,
    currentStatus: pick(['Student', 'Recent Graduate', 'Working Professional', 'Career Switcher']) as CurrentStatus,
    university,
    age: randInt(20, 29),
    gradYear,
    portfolioScore,
    applicationsFiled,
    status,
    targetRole: pick(ROLES[field]),
    currentSalary: randInt(2400, 6800),
    livingCity: pick(LOCATIONS),
    cityTier: pick(['Tier 1 (KL/Selangor)', 'Tier 2 (Penang/JB)', 'Tier 3 (Other states)']),
  }
})

export interface JobPosting {
  id: string
  role: string
  field: FieldKey
  company: string
  location: string
  salaryMin: number
  salaryMax: number
  cityTier: CandidateRecord['cityTier']
  applied: number
  screened: number
  interview: number
  offer: number
  hired: number
}

export const JOBS: JobPosting[] = Array.from({ length: 800 }, (_, i) => {
  const field = pick(FIELDS)
  const role = pick(ROLES[field])
  const salaryMin = randInt(2800, 5000)
  const applied = randInt(20, 220)
  const screened = Math.round(applied * (0.35 + rand() * 0.25))
  const interview = Math.round(screened * (0.3 + rand() * 0.25))
  const offer = Math.round(interview * (0.35 + rand() * 0.3))
  const hired = Math.round(offer * (0.6 + rand() * 0.3))
  return {
    id: `JOB-${2000 + i}`,
    role,
    field,
    company: pick(COMPANIES).name,
    location: pick(LOCATIONS),
    salaryMin,
    salaryMax: salaryMin + randInt(800, 3200),
    cityTier: pick(['Tier 1 (KL/Selangor)', 'Tier 2 (Penang/JB)', 'Tier 3 (Other states)']),
    applied,
    screened,
    interview,
    offer,
    hired,
  }
})

export const SEED_REGISTERED_USERS = [
  { email: 'aisyah.yusof@email.com', name: 'Aisyah Yusof', role: 'candidate', password: 'password123' },
  { email: 'admin@cimb.com', name: 'CIMB Group', role: 'employer', password: 'password123' },
  { email: 'admin@um.edu.my', name: 'Universiti Malaya', role: 'university', password: 'password123' },
  ...CANDIDATES.map(c => ({
    email: `${c.name.split(' ')[0].toLowerCase()}${c.id.split('-')[1]}@candidate.com`,
    name: c.name,
    role: 'candidate' as const,
    password: 'password123'
  })),
  ...COMPANIES.map(c => ({
    email: `admin@${c.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    name: c.name,
    role: 'employer' as const,
    password: 'password123'
  }))
]

export const COST_OF_LIVING: Record<CandidateRecord['cityTier'], { rent: number; transport: number; living: number; taxRate: number }> = {
  'Tier 1 (KL/Selangor)': { rent: 1450, transport: 420, living: 900, taxRate: 0.08 },
  'Tier 2 (Penang/JB)': { rent: 950, transport: 320, living: 720, taxRate: 0.06 },
  'Tier 3 (Other states)': { rent: 620, transport: 260, living: 560, taxRate: 0.04 },
}

export const MARKET_MIN_SALARY: Record<FieldKey, number> = {
  'Computer Science': 3800,
  'Business & Finance': 3500,
  'Engineering': 3600,
  'Medicine & Health Sciences': 3400,
  'Arts & Design': 3000,
  'Marketing & Communications': 3100,
}

export const INFLATION_RATE = 0.032

export interface UniversityStat {
  university: string
  employabilityRate: number
  medianSalary: number
  medianTimeToJobDays: number
}

export const UNIVERSITY_STATS: UniversityStat[] = UNIVERSITIES.map((u) => ({
  university: u,
  employabilityRate: Math.round((70 + rand() * 25) * 10) / 10,
  medianSalary: randInt(3200, 4600),
  medianTimeToJobDays: randInt(45, 150),
}))

export interface FacultyBenchmark {
  faculty: FieldKey
  employabilityRate: number
  medianSalary: number
}

export const FACULTY_BENCHMARKS: FacultyBenchmark[] = FIELDS.map((f) => ({
  faculty: f,
  employabilityRate: Math.round((60 + rand() * 35) * 10) / 10,
  medianSalary: MARKET_MIN_SALARY[f] + randInt(-200, 900),
}))

export const DEMO_CANDIDATE: CandidateRecord = {
  id: 'CAND-0001',
  name: 'Aisyah Yusof',
  field: 'Computer Science',
  currentStatus: 'Working Professional',
  university: 'Universiti Malaya (UM)',
  age: 23,
  gradYear: 2025,
  portfolioScore: 78,
  applicationsFiled: 6,
  status: 'On Track',
  targetRole: 'Backend Engineer',
  currentSalary: 3400,
  livingCity: 'Kepong',
  cityTier: 'Tier 1 (KL/Selangor)',
}

export const CAREER_PATH_STEPS = [
  { role: 'Marketing Exec', medianMonths: 0, medianSalary: 2800 },
  { role: 'Business Analyst', medianMonths: 14, medianSalary: 3600 },
  { role: 'Backend Engineer', medianMonths: 30, medianSalary: 4500 },
  { role: 'Senior Backend Engineer', medianMonths: 54, medianSalary: 6800 },
  { role: 'Engineering Lead', medianMonths: 84, medianSalary: 9800 },
]

export const TEAMS = [
  'Retail Banking Operations',
  'Technology & Digital',
  'Risk & Compliance',
  'Corporate Banking',
  'Customer Experience',
  'Human Resources',
  'Finance & Treasury',
]

const TEAM_PROMOTION_CYCLE: Record<string, number> = {
  'Retail Banking Operations': 26,
  'Technology & Digital': 20,
  'Risk & Compliance': 30,
  'Corporate Banking': 28,
  'Customer Experience': 22,
  'Human Resources': 27,
  'Finance & Treasury': 29,
}

const TEAM_ROLE_TITLES: Record<string, string[]> = {
  'Retail Banking Operations': ['Branch Officer', 'Operations Executive', 'Teller Supervisor'],
  'Technology & Digital': ['Software Engineer', 'Product Analyst', 'IT Support Specialist'],
  'Risk & Compliance': ['Compliance Analyst', 'Risk Officer', 'AML Investigator'],
  'Corporate Banking': ['Relationship Manager', 'Credit Analyst', 'Corporate Banking Associate'],
  'Customer Experience': ['Customer Service Executive', 'Contact Centre Agent', 'CX Specialist'],
  'Human Resources': ['HR Executive', 'Talent Acquisition Partner', 'People Ops Analyst'],
  'Finance & Treasury': ['Finance Executive', 'Treasury Analyst', 'Financial Reporting Associate'],
}

const TEAM_MANAGERS: Record<string, string[]> = {}
TEAMS.forEach((team, i) => {
  TEAM_MANAGERS[team] = [pick(FIRST_NAMES) + ' ' + pick(LAST_NAMES), pick(FIRST_NAMES) + ' ' + pick(LAST_NAMES)]
  void i
})

export interface WorkforceRecord {
  id: string
  name: string
  team: string
  role: string
  managerName: string
  tenureMonths: number
  typicalPromotionCycleMonths: number
  lastPortfolioUpdateDaysAgo: number
  recentCredentialUpdate: boolean
  riskLevel: 'Stable' | 'Watch' | 'Elevated'
  riskSignals: string[]
}

export const WORKFORCE: WorkforceRecord[] = Array.from({ length: 240 }, (_, i) => {
  const team = TEAMS[i % TEAMS.length]
  const typicalPromotionCycleMonths = TEAM_PROMOTION_CYCLE[team]
  const tenureMonths = randInt(3, 96)
  const lastPortfolioUpdateDaysAgo = randInt(1, 160)
  const recentCredentialUpdate = rand() < 0.22

  const signals: string[] = []
  let score = 0
  if (lastPortfolioUpdateDaysAgo > 90) {
    score += 1
    signals.push(`${lastPortfolioUpdateDaysAgo}+ days without a portfolio update`)
  }
  if (recentCredentialUpdate) {
    score += 1
    signals.push('New certificate/experience logged in the last 30 days')
  }
  if (tenureMonths > typicalPromotionCycleMonths * 1.25) {
    score += 1
    signals.push(`${tenureMonths} months in role vs. a ${typicalPromotionCycleMonths}-month typical promotion cycle`)
  }
  const riskLevel: WorkforceRecord['riskLevel'] = score >= 2 ? 'Elevated' : score === 1 ? 'Watch' : 'Stable'

  return {
    id: `EMP-${5000 + i}`,
    name: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
    team,
    role: pick(TEAM_ROLE_TITLES[team]),
    managerName: pick(TEAM_MANAGERS[team]),
    tenureMonths,
    typicalPromotionCycleMonths,
    lastPortfolioUpdateDaysAgo,
    recentCredentialUpdate,
    riskLevel,
    riskSignals: signals,
  }
})

export interface ExitSurveyRollup {
  team: string
  quarter: string
  respondentCount: number
  thresholdMet: boolean
  themes: { management: number; workload: number; pay: number; growth: number; other: number }
  topThemeNote: string
}

const ANONYMITY_THRESHOLD = 3

export const EXIT_SURVEYS: ExitSurveyRollup[] = TEAMS.map((team) => {
  const respondentCount = randInt(1, 7)
  const thresholdMet = respondentCount >= ANONYMITY_THRESHOLD
  const rawWeights = { management: rand(), workload: rand(), pay: rand(), growth: rand(), other: rand() * 0.4 }
  const totalWeight = Object.values(rawWeights).reduce((a, b) => a + b, 0)
  const themes = {
    management: Math.round((rawWeights.management / totalWeight) * 100),
    workload: Math.round((rawWeights.workload / totalWeight) * 100),
    pay: Math.round((rawWeights.pay / totalWeight) * 100),
    growth: Math.round((rawWeights.growth / totalWeight) * 100),
    other: Math.round((rawWeights.other / totalWeight) * 100),
  }
  const topKey = (Object.keys(themes) as (keyof typeof themes)[]).reduce((a, b) => (themes[a] >= themes[b] ? a : b))
  const noteByTheme: Record<string, string> = {
    management: '"What would have kept you?" responses most often pointed to manager support and feedback.',
    workload: 'Sustained workload and coverage gaps came up most often in the open-text response.',
    pay: 'Compensation relative to role scope was the most cited factor.',
    growth: 'Limited visibility into the next promotion step was the most cited factor.',
    other: 'Reasons were spread across factors outside the standard tag set.',
  }
  return {
    team,
    quarter: 'Q2 2026',
    respondentCount,
    thresholdMet,
    themes,
    topThemeNote: noteByTheme[topKey],
  }
})

export interface FairPayAggregate {
  jobId: string
  role: string
  company: string
  respondentCount: number
  pctComfortable: number
  pctTight: number
  pctNotSustainable: number
  avgDisposable: number
}

// FAIRPAY_FEEDBACK expanded to map dynamically to all jobs so it renders for any logged-in employer
export const FAIRPAY_FEEDBACK: FairPayAggregate[] = JOBS.map((j) => {
  const respondentCount = randInt(8, 64)
  const a = rand()
  const b = rand()
  const pctComfortable = Math.round(35 + a * 40)
  const pctNotSustainable = Math.round(5 + b * 20)
  const pctTight = 100 - pctComfortable - pctNotSustainable
  return {
    jobId: j.id,
    role: j.role,
    company: j.company,
    respondentCount,
    pctComfortable,
    pctTight: Math.max(0, pctTight),
    pctNotSustainable,
    avgDisposable: randInt(-300, 1800),
  }
})

export const REJECTION_REASONS = [
  'Role filled internally',
  'Missing required certification',
  'Insufficient relevant experience',
  'Skills mismatch for this role',
  'Position paused / on hold',
]

export const SLA_WINDOW_DAYS = 28