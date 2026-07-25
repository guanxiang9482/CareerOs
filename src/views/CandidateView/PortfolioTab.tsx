import { useAppContext } from '../../data/AppContext'
import { DEMO_CANDIDATE } from '../../data/mockData'
import { Card, Badge, ProgressBar, SectionHeading } from '../../components/ui'

export function PortfolioTab() {
  const { userSkills, addSkill, removeSkill } = useAppContext()
  const c = DEMO_CANDIDATE

  const hasDocker = userSkills.includes('System Design')
  const hasSecurity = userSkills.includes('API Security')
  
  const calculatedScore = 78 + (hasDocker ? 16 : 0) + (hasSecurity ? 5 : 0)

  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Living Portfolio" title="Your Verified" italicWord="Credential Network" />

      <Card className="p-6 bg-white border border-[#EBE7E0] rounded-xl shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[#0B1E33]">Global Portfolio Strength Indicator</p>
            <p className="text-xs text-[#9A7B56]">Recalculated in real time using tracked algorithmic credential modules.</p>
          </div>
          <div className="text-right">
            <span className="font-mono text-3xl font-bold text-[#0B1E33]">{calculatedScore}%</span>
            <p className="text-[10px] font-mono text-emerald-700 font-bold">{calculatedScore >= 90 ? 'Top Tier Status' : 'Competitive Status'}</p>
          </div>
        </div>
        <div className="mt-4"><ProgressBar value={calculatedScore} tone="emerald" /></div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Verified Records Container */}
        <Card className="p-5 bg-white border border-[#EBE7E0] rounded-xl space-y-4 shadow-2xs">
          <h5 className="text-sm font-bold text-[#0B1E33]">Cryptographic Credentials Vault</h5>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2.5 bg-[#FAF8F5] rounded-lg">
              <span className="text-[#6B5A44] font-medium">B.CS Graduate, Universiti Malaya</span>
              <Badge tone="positive">Verified</Badge>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-[#FAF8F5] rounded-lg">
              <span className="text-[#6B5A44] font-medium">AWS Cloud Practitioner Certification</span>
              <Badge tone="positive">Verified</Badge>
            </div>
            {hasDocker && (
              <div className="flex justify-between items-center p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                <span className="text-emerald-900 font-bold">Project: Container Deployment (Docker Stack)</span>
                <Badge tone="positive">Verified</Badge>
              </div>
            )}
            {hasSecurity && (
              <div className="flex justify-between items-center p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                <span className="text-emerald-900 font-bold">Project: OAuth2 API Security Gateway</span>
                <Badge tone="positive">Verified</Badge>
              </div>
            )}
          </div>
        </Card>

        {/* Skill Gap Interactive Toggles */}
        <Card className="p-5 bg-white border border-[#EBE7E0] rounded-xl space-y-4 shadow-2xs">
          <div>
            <h5 className="text-sm font-bold text-[#0B1E33]">Live Skill Gap Optimization</h5>
            <p className="text-xs text-[#6B5A44] mt-0.5">Toggle dynamic assets below to observe target scoring shifts across dashboards.</p>
          </div>

          <div className="space-y-3.5 pt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-[#0B1E33]">System Design Architecture (Docker Containerization)</span>
              <button 
                onClick={() => hasDocker ? removeSkill('System Design') : addSkill('System Design')}
                className={`px-3 py-1 font-mono text-xs font-semibold rounded-md border cursor-pointer transition-all ${
                  hasDocker ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-[#0B1E33] border-transparent text-white'
                }`}
              >
                {hasDocker ? 'Drop Skill' : 'Inject Skill'}
              </button>
            </div>

            <div className="flex justify-between items-center text-xs border-t border-[#EBE7E0] pt-3">
              <span className="font-medium text-[#0B1E33]">API Security Layering (OAuth2 / Cryptography Keys)</span>
              <button 
                onClick={() => hasSecurity ? removeSkill('API Security') : addSkill('API Security')}
                className={`px-3 py-1 font-mono text-xs font-semibold rounded-md border cursor-pointer transition-all ${
                  hasSecurity ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-[#0B1E33] border-transparent text-white'
                }`}
              >
                {hasSecurity ? 'Drop Skill' : 'Inject Skill'}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}