import { useState, useEffect } from 'react'
import { useAppContext } from '../../data/AppContext'
import { DEMO_CANDIDATE } from '../../data/mockData'
import { DashboardLayout, type SidebarSection } from '../../components/DashboardLayout'

// Sibling Workspace Component Imports
import { TodayTab } from './TodayTab'
import { DiscoverTab } from './DiscoverTab'
import { ApplicationTracker } from './ApplicationTracker'
import { PortfolioTab } from './PortfolioTab'
import { CompassTab } from './CompassTab'
import { HavenTab } from './HavenTab'
import { LifeChapterDesigner } from './LifeChapterDesigner'

const SECTIONS: SidebarSection[] = [
  { id: 'today', label: 'Today' },
  { id: 'discover', label: 'Discover' },
  { id: 'tracker', label: 'Application Tracker' },
  { id: 'portfolio', label: 'Living Portfolio' },
  { id: 'compass', label: 'Compass' },
  { id: 'haven', label: 'Haven Assistant' },
  { id: 'chapters', label: 'Life Chapters' }
]

export function CandidateView({ onSwitchRole }: { onSwitchRole: () => void }) {
  const { applications, injectDockerProject, userSkills } = useAppContext()
  const c = DEMO_CANDIDATE
  const aisyahApp = applications.find((a) => a.candidateId === c.id)

  const hasSystemDesign = userSkills.includes('System Design')
  const calculatedScore = hasSystemDesign ? 94 : 78

  // State pointer separating individual tabs completely
  const [activeTab, setActiveTab] = useState('today')

  // Catches clicks on the sidebar items inside DashboardLayout and shifts state immediately
  useEffect(() => {
    const handleSidebarClick = (e: MouseEvent) => {
      let element = e.target as HTMLElement | null
      
      // Traverse up to safely inspect button wrappers or text nodes
      while (element && element !== document.body) {
        const textContent = element.textContent?.trim()
        
        // Match element text context directly with sidebar section labels
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
      {/* Container stage containing exclusively the active tab element wrapper */}
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
            {aisyahApp && (
              <ApplicationTracker 
                application={{
                  ...aisyahApp,
                  stage: hasSystemDesign ? 'Reviewing Queue' : aisyahApp.stage,
                  missingSkills: hasSystemDesign ? [] : aisyahApp.missingSkills,
                  matchScore: calculatedScore
                }} 
                onInjectDockerProject={(id) => injectDockerProject(id)} 
              />
            )}
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

        {activeTab === 'chapters' && (
          <div id="chapters" className="animate-fade-in">
            <LifeChapterDesigner />
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}