import { type ReactNode } from 'react'

export interface SidebarSection {
  id: string
  label: string
}

interface DashboardLayoutProps {
  roleLabel: string
  personaName: string
  personaSub: string
  sections: SidebarSection[]
  children: ReactNode
  onSwitchRole: () => void
}

export function DashboardLayout({ roleLabel, personaName, personaSub, sections, children, onSwitchRole }: DashboardLayoutProps) {
  function scrollToSection(id: string) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleSwitchRole() {
    onSwitchRole()
  }

  return (
    <div className="min-h-screen bg-[#FDFBF9] font-sans text-[#0B1E33]">
      <header className="sticky top-[37px] z-40 border-b border-[#EBE7E0] bg-[#FDFBF9]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-6 py-3">
          <button onClick={handleSwitchRole} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B1E33] font-mono text-xs font-bold text-white">OS</div>
            <span className="text-sm font-semibold tracking-tight">Career OS</span>
          </button>

          <span className="rounded-full border border-[#9A7B56]/30 bg-[#9A7B56]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#8A6C48]">
            {roleLabel} view
          </span>

          <div className="ml-auto flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-medium leading-tight text-[#0B1E33]">{personaName}</p>
              <p className="text-[11px] leading-tight text-[#9A7B56]">{personaSub}</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B1E33] text-xs font-semibold text-white">
              {personaName.split(' ').map((s) => s[0]).slice(0, 2).join('')}
            </div>
            <button
              onClick={handleSwitchRole}
              className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition-colors border-none cursor-pointer"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px] gap-8 px-6 py-8">
        <aside className="sticky top-[110px] h-fit w-56 shrink-0">
          <nav className="space-y-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollToSection(s.id)}
                className="block w-full rounded-full px-4 py-2 text-left text-sm font-medium text-[#6B5A44] transition-colors hover:bg-[#F6F3EE] hover:text-[#0B1E33]"
              >
                {s.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 space-y-16 pb-24">{children}</main>
      </div>
    </div>
  )
}
