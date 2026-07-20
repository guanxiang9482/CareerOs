import type { ReactNode } from 'react'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl bg-white border border-[#EBE7E0] shadow-sm ${className}`}>
      {children}
    </div>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#9A7B56]">
      {children}
    </p>
  )
}

export function StatBlock({
  label,
  value,
  suffix,
  tone = 'default',
}: {
  label: string
  value: string
  suffix?: string
  tone?: 'default' | 'positive' | 'warning'
}) {
  const toneClass =
    tone === 'positive' ? 'text-emerald-700' : tone === 'warning' ? 'text-amber-700' : 'text-[#0B1E33]'
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-[#9A7B56]">{label}</p>
      <p className={`mt-1 font-mono text-2xl font-semibold ${toneClass}`}>
        {value}
        {suffix && <span className="ml-1 text-sm font-normal text-[#B5A88F]">{suffix}</span>}
      </p>
    </div>
  )
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'positive' | 'warning' | 'danger' | 'indigo'
}) {
  const tones: Record<string, string> = {
    neutral: 'bg-[#F6F3EE] text-[#6B5A44] border-[#EBE7E0]',
    positive: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    indigo: 'bg-[#0B1E33]/5 text-[#0B1E33] border-[#0B1E33]/15',
  }
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium ${tones[tone]}`}>
      {children}
    </span>
  )
}

export function ProgressBar({ value, max = 100, tone = 'indigo' }: { value: number; max?: number; tone?: 'indigo' | 'emerald' | 'amber' }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  const toneClass = tone === 'emerald' ? 'bg-emerald-500' : tone === 'amber' ? 'bg-[#9A7B56]' : 'bg-[#0B1E33]'
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F1EDE5]">
      <div className={`h-full rounded-full ${toneClass} transition-all duration-500`} style={{ width: `${pct}%` }} />
    </div>
  )
}

// Premium minimalist slider used by the Fair Pay Engine — a thin track with
// a marker for the actual value and a secondary tick for the market baseline.
export function BaselineSlider({
  value,
  max,
  baseline,
  valueLabel,
  baselineLabel,
}: {
  value: number
  max: number
  baseline: number
  valueLabel: string
  baselineLabel: string
}) {
  const valuePct = Math.min(100, Math.max(0, (value / max) * 100))
  const baselinePct = Math.min(100, Math.max(0, (baseline / max) * 100))
  const aboveBaseline = value >= baseline

  return (
    <div className="pt-1">
      <div className="relative h-1.5 w-full rounded-full bg-[#F1EDE5]">
        <div
          className={`absolute inset-y-0 left-0 rounded-full ${aboveBaseline ? 'bg-[#0B1E33]' : 'bg-rose-400'}`}
          style={{ width: `${valuePct}%` }}
        />
        {/* baseline marker */}
        <div
          className="absolute -top-1.5 h-4 w-px bg-[#9A7B56]"
          style={{ left: `${baselinePct}%` }}
        />
        <div
          className="absolute -top-1.5 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#0B1E33] ring-2 ring-white"
          style={{ left: `${valuePct}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px]">
        <span className="text-[#0B1E33] font-medium">{valueLabel}</span>
        <span className="text-[#9A7B56]">{baselineLabel}</span>
      </div>
    </div>
  )
}

export function SectionHeading({ eyebrow, title, description, italicWord }: { eyebrow: string; title: string; description?: string; italicWord?: string }) {
  return (
    <div className="mb-6">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-[#0B1E33]">
        {italicWord ? (
          <>
            {title}{' '}<span className="font-serif italic font-normal">{italicWord}</span>
          </>
        ) : (
          title
        )}
      </h2>
      {description && <p className="mt-1.5 text-sm text-[#6B5A44]">{description}</p>}
    </div>
  )
}
