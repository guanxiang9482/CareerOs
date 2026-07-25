import { KANBAN_STAGES, type ApplicationRecord, type PipelineStage } from '../../data/appState'
import { Card, Badge, SectionHeading, Eyebrow } from '../../components/ui'

interface ApplicationTrackerProps {
  application: ApplicationRecord
  onInjectDockerProject: (applicationId: string) => void
}

export function ApplicationTracker({ application, onInjectDockerProject }: ApplicationTrackerProps) {
  const grouped: Record<PipelineStage, ApplicationRecord[]> = {
    'Top Tier Pool': [],
    'Reviewing Queue': [],
    'Queueing': [],
    'Not Qualified': [],
    'Hired': [],
  }
  grouped[application.stage] = [application]

  const canInject = application.stage === 'Not Qualified' && application.missingSkills.includes('System Design')

  return (
    <div className="space-y-6">
      <SectionHeading 
        eyebrow="Application Tracker" 
        title="Your pipeline," 
        italicWord="split by pool" 
        description="Aisyah's live application status for the Backend Engineer role at CIMB Group." 
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KANBAN_STAGES.map((stage) => (
          <div key={stage} className="rounded-xl border border-[#EBE7E0] bg-[#F9F7F3] p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#9A7B56]">{stage}</p>
            <div className="min-h-[88px] space-y-2">
              {grouped[stage].map((app) => (
                <div key={app.id} className="rounded-lg border border-[#EBE7E0] bg-white p-3 shadow-sm">
                  <p className="text-sm font-semibold text-[#0B1E33]">{app.candidateName}</p>
                  <p className="text-xs text-[#9A7B56]">{app.jobRole} · {app.company}</p>
                  {app.missingSkills.length > 0 && (
                    <div className="mt-2">
                      <Badge tone="warning">Missing: {app.missingSkills.join(', ')}</Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {canInject && (
        <Card className="mt-6 p-6">
          <Eyebrow>Haven AI Suggestion</Eyebrow>
          <p className="mt-1.5 text-sm font-semibold text-[#0B1E33]">
            Inject verified <span className="font-serif italic font-normal">Docker Project</span>
          </p>
          <p className="mt-1 text-sm text-[#6B5A44]">
            Your portfolio is missing a System Design credential. Adding a verified Docker deployment project closes this gap and should move your application into the Reviewing Queue.
          </p>
          <button
            onClick={() => onInjectDockerProject(application.id)}
            className="mt-4 rounded-full bg-[#0B1E33] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#132A47] cursor-pointer border-none shadow-xs"
          >
            Haven AI Suggestion: Inject verified Docker Project
          </button>
        </Card>
      )}

      {!canInject && application.stage !== 'Not Qualified' && (
        <Card className="mt-6 p-6">
          <Badge tone="positive">Update applied</Badge>
          <p className="mt-2 text-sm text-[#6B5A44]">
            Your Docker project was added and verified. Match score is now {Math.round(application.matchScore)}% and your application moved to {application.stage}.
          </p>
        </Card>
      )}
    </div>
  )
}