// Thin, typed wrapper around localStorage.
//
// Why this exists: the app previously held everything in useState, which
// resets on every refresh — meaning nothing a judge does in the demo
// (registering, editing a portfolio, applying to a job) actually "stuck."
// This wrapper makes reads/writes safe (private browsing, disabled storage,
// server-side render, quota errors all degrade to no-ops instead of
// crashing the app) so AppContext can persist real state without every
// call site needing its own try/catch.

const PREFIX = 'careeros:'

function isStorageAvailable(): boolean {
  try {
    const testKey = `${PREFIX}__probe__`
    window.localStorage.setItem(testKey, '1')
    window.localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

// Computed once per session rather than per call — avoids redundant probing
// on every read/write while still being safe if storage is unavailable.
const STORAGE_OK = typeof window !== 'undefined' && isStorageAvailable()

export function loadFromStorage<T>(key: string, fallback: T): T {
  if (!STORAGE_OK) return fallback
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    // Corrupted or unparsable entry — fall back rather than crash the app.
    return fallback
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  if (!STORAGE_OK) return
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // Quota exceeded or storage revoked mid-session — fail silently so the
    // in-memory app state (still correct for this session) keeps working.
  }
}

export function removeFromStorage(key: string): void {
  if (!STORAGE_OK) return
  try {
    window.localStorage.removeItem(PREFIX + key)
  } catch {
    // no-op
  }
}

export const STORAGE_KEYS = {
  applications: 'applications',
  userSkills: 'userSkills',
  fairPayInputs: 'fairPayInputs',
  authedName: 'authedName',
  portfolio: 'portfolio',
  registeredUsers: 'registeredUsers',
  currentUserEmail: 'currentUserEmail',
  currentUserRole: 'currentUserRole',
} as const

export const STORAGE_PREFIX = PREFIX

export interface StorageEntry {
  key: string
  value: unknown
}

/** Lists every careeros:* key currently in localStorage (for the debug viewer). */
export function listAllStorageEntries(): StorageEntry[] {
  if (!STORAGE_OK) return []
  const entries: StorageEntry[] = []
  for (let i = 0; i < window.localStorage.length; i++) {
    const fullKey = window.localStorage.key(i)
    if (!fullKey?.startsWith(PREFIX)) continue
    const key = fullKey.slice(PREFIX.length)
    try {
      const raw = window.localStorage.getItem(fullKey)
      entries.push({ key, value: raw === null ? null : JSON.parse(raw) })
    } catch {
      entries.push({ key, value: '(unparseable)' })
    }
  }
  return entries.sort((a, b) => a.key.localeCompare(b.key))
}
