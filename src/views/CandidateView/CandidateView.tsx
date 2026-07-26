import { useState, useEffect } from 'react'
import { useAppContext } from '../../data/AppContext'
import { DEMO_CANDIDATE } from '../../data/mockData'
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
  // FIXED: Removed the unused 'userSkills' reference
  const { applications, injectDockerProject, authedName } = useAppContext()
  
  const c = DEMO_CANDIDATE
  
  // LIVE LINK LOGIC: Filter applications specifically for this logged in candidate name
  const candidateApps = applications.filter((a) => a.candidateName === (authedName || c.name))

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
      roleLabel="Candidate View"
      personaName={authedName || c.name}
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

        {/* Passing the full array of candidate applications here */}
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