// CareerOS deterministic mock dataset
// Seeded PRNG so every reload / judge session sees identical numbers.

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

// FIXED: Cleaned up raw unicode character escapes for presentation text
export const UNIVERSITIES = [
  'Universiti Malaya (UM)',
  'Universiti Teknologi Malaysia (UTM)',
  'Universiti Kebangsaan Malaysia (UKM)',
  'Universiti Teknologi MARA (UiTM)',
  'UCSI University',
  'Monash University Malaysia',
  'HELP University',
  'Sunway University',
  'Taylor\'s University',
  'Multimedia University (MMU)',
]

// FIXED: Cleaned up raw unicode escapes in company naming
export const COMPANIES = [
  { name: 'CIMB Group', industry: 'Banking & Finance' },
  { name: 'Petronas', industry: 'Energy' },
  { name: 'Grab Malaysia', industry: 'Technology' },
  { name: 'Maybank', industry: 'Banking & Finance' },
  { name: 'AirAsia', industry: 'Aviation & Travel' },
  { name: 'Shopee Malaysia', industry: 'E-commerce' },
  { name: 'Nestlé Malaysia', industry: 'FMCG' },
  { name: 'Axiata Group', industry: 'Telecommunications' },
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

// FIXED: Converted numerical enum to clean string literal types to match your Form Select menus
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
  cityTier: 'Tier 1 (KL/Selangor)' | 'Tier 2 (Penang/JB)' | 'Tier 3 (Other states)'
}

export const CANDIDATES: CandidateRecord[] = Array.from({ length: 2000 }, (_, i) => {
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
    // FIXED: Hydrated missing state element using correct type literals
    currentStatus: pick(['Student', 'Recent Graduate', 'Working Professional', 'Career Switcher']) as CurrentStatus,
    university,
    age: randInt(20, 29),
    gradYear,
    portfolioScore,
    applicationsFiled,
    status,
    targetRole: pick(ROLES[field]),
    currentSalary: randInt(2400, 6800),
    cityTier: pick(['Tier 1 (KL/Selangor)', 'Tier 2 (Penang/JB)', 'Tier 3 (Other states)']),
  }
})

export interface JobPosting {
  id: string
  role: string
  field: FieldKey
  company: string
  salaryMin: number
  salaryMax: number
  cityTier: CandidateRecord['cityTier']
  applied: number
  screened: number
  interview: number
  offer: number
  hired: number
}

export const JOBS: JobPosting[] = Array.from({ length: 500 }, (_, i) => {
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

// FIXED: Fully hydrated Aisyah's core testing persona with matching string configuration
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
  cityTier: 'Tier 1 (KL/Selangor)',
}

export const CAREER_PATH_STEPS = [
  { role: 'Marketing Exec', medianMonths: 0, medianSalary: 2800 },
  { role: 'Business Analyst', medianMonths: 14, medianSalary: 3600 },
  { role: 'Backend Engineer', medianMonths: 30, medianSalary: 4500 },
  { role: 'Senior Backend Engineer', medianMonths: 54, medianSalary: 6800 },
  { role: 'Engineering Lead', medianMonths: 84, medianSalary: 9800 },
]