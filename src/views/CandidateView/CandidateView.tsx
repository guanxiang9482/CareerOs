import { useState, useEffect, useMemo } from 'react'
import { useAppContext } from '../../data/AppContext'
import { DEMO_CANDIDATE, CANDIDATES } from '../../data/mockData'
import { DashboardLayout, type SidebarSection } from '../../components/DashboardLayout'

import { TodayTab } from './TodayTab'
import { DiscoverTab } from './DiscoverTab'
import { ApplicationTracker } from './ApplicationTracker'
import { PortfolioTab } from './PortfolioTab'
import { CompassTab } from './CompassTab'
import { HavenTab } from './HavenTab'

const SECTIONS: SidebarSection[] = [
  { id: 'today', label: 'Today' },
  { id: 'discover', label: 'Discover' },
  { id: 'tracker', label: 'Application Tracker' },
  { id: 'portfolio', label: 'Living Portfolio' },
  { id: 'compass', label: 'Compass' },
  { id: 'haven', label: 'Haven Assistant' },
]

export function CandidateView({ onSwitchRole }: { onSwitchRole: () => void }) {
  const { applications, injectDockerProject, authedName } = useAppContext()
  
  // LIVE LINK: Find the actual logged-in user in the database
  const c = useMemo(() => {
    return CANDIDATES.find(cand => cand.name === authedName) || DEMO_CANDIDATE
  }, [authedName])
  
  const candidateApps = applications.filter((a) => a.candidateName === c.name)

  const [activeTab, setActiveTab] = useState('today')

  useEffect(() => {
    const handleSidebarClick = (e: MouseEvent) => {
      let element = e.target as HTMLElement | null
      while (element && element !== document.body) {
        const textContent = element.textContent?.trim()
        const match = SECTIONS.find(s => s.label.toLowerCase() === textContent?.toLowerCase())
        if (match) {
          setActiveTab(match.id)
          break
        }
        element = element.parentElement
      }
    }
    window.addEventListener('click', handleSidebarClick)
    return () => window.removeEventListener('click', handleSidebarClick)
  }, [])

  return (
    <DashboardLayout
      roleLabel="Candidate"
      personaName={c.name}
      personaSub={`${c.university} · Class of ${c.gradYear}`}
      sections={SECTIONS}
      onSwitchRole={onSwitchRole}
    >
      <div className="w-full min-h-[calc(100vh-6rem)] bg-transparent">
        
        {activeTab === 'today' && (
          <div id="today" className="animate-fade-in">
            <TodayTab onNavigate={(id) => setActiveTab(id)} />
          </div>
        )}

        {activeTab === 'discover' && (
          <div id="discover" className="animate-fade-in">
            <DiscoverTab />
          </div>
        )}

        {activeTab === 'tracker' && (
          <div id="tracker" className="animate-fade-in">
            <ApplicationTracker 
              applications={candidateApps} 
              onInjectDockerProject={(id) => injectDockerProject(id)} 
            />
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div id="portfolio" className="animate-fade-in">
            <PortfolioTab />
          </div>
        )}

        {activeTab === 'compass' && (
          <div id="compass" className="animate-fade-in">
            <CompassTab />
          </div>
        )}

        {activeTab === 'haven' && (
          <div id="haven" className="animate-fade-in">
            <HavenTab />
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}