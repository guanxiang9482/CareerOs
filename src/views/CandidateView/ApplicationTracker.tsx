import { KANBAN_STAGES, type ApplicationRecord, type PipelineStage, stageDisplayLabel } from '../../data/appState'
import { Card, Badge, SectionHeading, Eyebrow } from '../../components/ui'

interface ApplicationTrackerProps {
  applications: ApplicationRecord[]
  onInjectDockerProject: (applicationId: string) => void
}

export function ApplicationTracker({ applications, onInjectDockerProject }: ApplicationTrackerProps) {
  // Map ALL candidate applications dynamically into Kanban grouping
  const grouped: Record<PipelineStage, ApplicationRecord[]> = {
    'Top Tier Pool': [],
    'Reviewing Queue': [],
    'Queueing': [],
    'Not Qualified': [],
    'Hired': [],
  }
  
  applications.forEach(app => {
    if (grouped[app.stage]) grouped[app.stage].push(app)
  })

  // Check if any application is currently gated behind the specific System Design gap
  const injectTarget = applications.find(a => a.stage === 'Not Qualified' && a.missingSkills.includes('System Design'))

  return (
    <div className="space-y-6">
      <SectionHeading 
        eyebrow="Application Tracker" 
        title="Live Application" 
        italicWord="Pipelines" 
        description="Track the status of all your applications in real-time. When an employer updates your status, it reflects here instantly." 
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KANBAN_STAGES.map((stage) => (
          <div key={stage} className="rounded-xl border border-[#EBE7E0] bg-[#F9F7F3] p-4">
            <div className="mb-3 flex justify-between items-center text-xs font-semibold uppercase tracking-wide text-[#9A7B56]">
              <span>{stageDisplayLabel(stage)}</span>
              <span className="bg-[#EBE7E0] text-[#6B5A44] px-1.5 py-0.5 rounded-md">{grouped[stage].length}</span>
            </div>
            
            <div className="min-h-[88px] space-y-2">
              {grouped[stage].map((app) => (
                <div key={app.id} className="rounded-lg border border-[#EBE7E0] bg-white p-3 shadow-sm transition-all hover:border-[#9A7B56]">
                  <p className="text-sm font-semibold text-[#0B1E33]">{app.jobRole}</p>
                  <p className="text-xs text-[#9A7B56]">{app.company}</p>
                  
                  {app.stage === 'Not Qualified' && app.employerFeedbackReason && (
                    <div className="mt-2 text-[10px] text-rose-600 bg-rose-50 p-1.5 rounded border border-rose-100 leading-tight">
                      <strong>Feedback:</strong> {app.employerFeedbackReason}
                    </div>
                  )}

                  {app.missingSkills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {app.missingSkills.map(skill => (
                        <Badge key={skill} tone="warning">Missing: {skill}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {grouped[stage].length === 0 && (
                 <div className="text-[10px] text-center text-[#9A7B56]/50 italic py-4 border border-dashed border-[#EBE7E0] rounded-lg">No applications here</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {injectTarget && (
        <Card className="mt-6 p-6">
          <Eyebrow>Haven AI Suggestion</Eyebrow>
          <p className="mt-1.5 text-sm font-semibold text-[#0B1E33]">
            Inject verified <span className="font-serif italic font-normal">Docker Project</span>
          </p>
          <p className="mt-1 text-sm text-[#6B5A44]">
            Your portfolio is missing a System Design credential for the {injectTarget.company} pipeline. Adding a verified Docker deployment project closes this gap and advances your application automatically.
          </p>
          <button
            onClick={() => onInjectDockerProject(injectTarget.id)}
            className="mt-4 rounded-full bg-[#0B1E33] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#132A47] cursor-pointer border-none shadow-xs"
          >
            Haven AI Suggestion: Inject verified Docker Project
          </button>
        </Card>
      )}
    </div>
  )
}