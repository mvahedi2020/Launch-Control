import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, ArrowUpRight, Check, ChevronRight, CircleCheck, Clock3, Download, RotateCcw, ShieldCheck, Zap } from 'lucide-react'
import { clonePlan, samplePlan } from './data'
import { appendEvent, canLaunch, checkUnlocked, ownerName, readiness, revokeGoIfBlocked } from './logic'
import type { GateState, LaunchPlan, Phase } from './types'

const STORAGE_KEY = 'northstar.launch-control.session.v1'
type View = 'command' | 'timeline' | 'about'
const now = () => new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }).format(new Date())
const viewFromHash = (): View => location.hash === '#timeline' ? 'timeline' : location.hash === '#about' ? 'about' : 'command'

function readSaved(): { plan: LaunchPlan; warning: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { plan: clonePlan(samplePlan), warning: '' }
    const parsed = JSON.parse(raw) as { version: number; plan: LaunchPlan }
    if (parsed.version !== 1 || !Array.isArray(parsed.plan?.checks) || !parsed.plan.checks.every((check) => Array.isArray(check.dependencyIds)) || !Array.isArray(parsed.plan.dependencies) || !Array.isArray(parsed.plan.owners) || !Array.isArray(parsed.plan.timeline) || !['prelaunch', 'launched', 'paused', 'rolledback'].includes(parsed.plan.phase)) throw new Error('Unsupported saved data')
    return { plan: parsed.plan, warning: '' }
  } catch {
    return { plan: clonePlan(samplePlan), warning: 'Saved launch data could not be read. This session is using the sample launch.' }
  }
}

export default function App() {
  const initial = useMemo(readSaved, [])
  const [plan, setPlan] = useState(initial.plan)
  const [warning, setWarning] = useState(initial.warning)
  const [view, setView] = useState<View>(viewFromHash)
  const [decisionChoice, setDecisionChoice] = useState<'go' | 'no-go' | ''>('')
  const [decisionNote, setDecisionNote] = useState('')
  const status = readiness(plan)

  useEffect(() => {
    const onHash = () => setView(viewFromHash())
    addEventListener('hashchange', onHash)
    return () => removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, savedAt: new Date().toISOString(), plan }))
    } catch {
      setWarning('Browser storage is unavailable. Progress remains in this tab, but it cannot be saved for later.')
    }
  }, [plan])

  useEffect(() => {
    if (status.blockers.length && decisionChoice === 'go') setDecisionChoice('')
  }, [decisionChoice, status.blockers.length])

  const reset = () => {
    setPlan(clonePlan(samplePlan)); setDecisionChoice(''); setDecisionNote('')
    try { localStorage.removeItem(STORAGE_KEY); setWarning('') } catch { setWarning('Browser storage is unavailable. The sample launch is restored for this tab.') }
  }
  const updateDependency = (id: string, field: 'ownerId' | 'state', value: string) => setPlan((current) => {
    const item = current.dependencies.find((dependency) => dependency.id === id)
    if (!item || item[field] === value) return current
    const next = { ...current, dependencies: current.dependencies.map((dependency) => dependency.id === id ? { ...dependency, [field]: value } as typeof dependency : dependency) }
    const detail = field === 'state' ? `${item.name} changed to ${value}.` : `${item.name} assigned to ${ownerName(current, value)}.`
    const at = now()
    return revokeGoIfBlocked(appendEvent(next, { id: `dependency-${Date.now()}`, at, title: field === 'state' ? 'Dependency state updated' : 'Dependency owner updated', detail, kind: value === 'blocked' || !value ? 'warning' : 'info' }), at)
  })
  const updateCheck = (id: string, patch: Partial<LaunchPlan['checks'][number]>) => setPlan((current) => {
    const item = current.checks.find((check) => check.id === id)
    if (!item) return current
    const next = { ...current, checks: current.checks.map((check) => check.id === id ? { ...check, ...patch } : check) }
    const at = now()
    if ('complete' in patch && patch.complete !== item.complete) return revokeGoIfBlocked(appendEvent(next, { id: `check-${Date.now()}`, at, title: patch.complete ? 'Readiness check completed' : 'Readiness check reopened', detail: item.name, kind: patch.complete ? 'success' : 'warning' }), at)
    if ('ownerId' in patch && patch.ownerId !== item.ownerId) return revokeGoIfBlocked(appendEvent(next, { id: `check-owner-${Date.now()}`, at, title: 'Check owner updated', detail: `${item.name} assigned to ${ownerName(current, patch.ownerId ?? '')}.`, kind: patch.ownerId ? 'info' : 'warning' }), at)
    return next
  })
  const recordEvidence = (id: string) => setPlan((current) => {
    const item = current.checks.find((check) => check.id === id)
    if (!item?.evidence.trim()) return current
    return appendEvent(current, { id: `evidence-${Date.now()}`, at: now(), title: 'Readiness evidence recorded', detail: `${item.name}: ${item.evidence.trim()}`, kind: 'info' })
  })
  const exportSummary = () => {
    const payload = { product: 'Launch Control sample', exportedAt: new Date().toISOString(), readiness: readiness(plan), launch: plan }
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }))
    const link = document.createElement('a'); link.href = url; link.download = 'launch-control-summary.json'; link.click(); URL.revokeObjectURL(url)
  }

  const recordDecision = () => {
    if (!decisionChoice || decisionNote.trim().length < 4 || (decisionChoice === 'go' && status.blockers.length > 0)) return
    const recordedAt = now()
    setPlan((current) => appendEvent({ ...current, decision: { value: decisionChoice, note: decisionNote.trim(), recordedAt } }, { id: `decision-${Date.now()}`, at: recordedAt, title: `${decisionChoice === 'go' ? 'Go' : 'No-go'} decision recorded`, detail: decisionNote.trim(), kind: decisionChoice === 'go' ? 'success' : 'warning' }))
  }
  const launch = () => {
    if (!canLaunch(plan)) return
    const at = now()
    setPlan((current) => appendEvent({ ...current, phase: 'launched' }, { id: `launch-${Date.now()}`, at, title: 'Launch completed', detail: `${current.name} simulated launch completed.`, kind: 'success' }))
  }
  const openIncident = () => {
    if (plan.phase !== 'launched' || plan.incident?.active) return
    const at = now()
    setPlan((current) => appendEvent({ ...current, incident: { active: true, openedAt: at } }, { id: `incident-${Date.now()}`, at, title: 'Sample issue detected', detail: 'Export jobs are delayed for a sample customer segment.', kind: 'critical' }))
  }
  const decideIncident = (decision: 'pause' | 'rollback') => {
    const at = now(); const phase: Phase = decision === 'pause' ? 'paused' : 'rolledback'
    setPlan((current) => appendEvent({ ...current, phase, incident: current.incident ? { ...current.incident, active: false, decision } : null }, { id: `${decision}-${Date.now()}`, at, title: decision === 'pause' ? 'Rollout paused' : 'Release rolled back', detail: decision === 'pause' ? 'Further sample exposure is paused for investigation.' : 'Sample traffic returned to the prior release.', kind: 'warning' }))
  }

  const phaseLabel = plan.phase === 'prelaunch' ? 'Pre-launch review' : plan.phase === 'launched' ? 'Launch complete' : plan.phase === 'paused' ? 'Rollout paused' : 'Rolled back'

  return <div className="shell">
    <header className="topbar">
      <a className="brand" href="#command"><span className="mark"><Zap size={17} /></span><span><b>Launch Control</b><small>Northstar · sample workspace</small></span></a>
      <span className="demo-chip">Fictional product demo</span>
      <nav aria-label="Primary navigation">{([['command','Command'],['timeline','Timeline'],['about','About']] as const).map(([id,label]) => <a key={id} href={`#${id}`} className={view === id ? 'active' : ''}>{label}</a>)}</nav>
    </header>
    <main>
      {warning && <div className="warning" role="alert"><AlertTriangle size={18} />{warning}</div>}
      {view === 'command' && <>
        <section className="command-head"><div><p className="eyebrow">Release command · {plan.window}</p><h1>{plan.name}</h1><p>Resolve every required gate, record the decision, then run a simulated launch.</p></div><div className={`phase ${plan.phase}`}><span /><div><small>Current state</small><b>{phaseLabel}</b></div></div></section>
        <section className="scorebar" aria-label="Launch readiness summary"><div className="score"><strong>{status.passed}<small> / {status.total}</small></strong><span>Required gates ready</span></div><div className="progress"><span style={{ width: `${status.total ? status.passed / status.total * 100 : 0}%` }} /></div><div className="score-note">{status.blockers.length ? <><AlertTriangle size={17} /><b>{status.blockers.length} blocker{status.blockers.length === 1 ? '' : 's'} before launch</b></> : <><CircleCheck size={17} /><b>All required gates cleared</b></>}</div></section>

        <div className="command-grid"><section className="gate-stack">
          <div className="section-title"><div><p className="eyebrow">01 · Dependencies</p><h2>Resolve upstream work</h2></div><span>{plan.dependencies.filter((item) => item.state === 'ready' && item.ownerId).length} of {plan.dependencies.length}</span></div>
          <div className="gate-card">{plan.dependencies.map((dependency) => <article className="dependency" key={dependency.id}>
            <span className={`status-dot ${dependency.state}`} aria-hidden="true" /><div className="gate-copy"><b>{dependency.name}</b><small>{dependency.note}</small></div>
            <label><span>Owner</span><select aria-label={`${dependency.name} owner`} value={dependency.ownerId} onChange={(event) => updateDependency(dependency.id, 'ownerId', event.target.value)}><option value="">Unassigned</option>{plan.owners.map((owner) => <option key={owner.id} value={owner.id}>{owner.name}</option>)}</select></label>
            <label><span>State</span><select aria-label={`${dependency.name} state`} value={dependency.state} onChange={(event) => updateDependency(dependency.id, 'state', event.target.value as GateState)}><option value="ready">Ready</option><option value="watching">Watching</option><option value="blocked">Blocked</option></select></label>
          </article>)}</div>

          <div className="section-title checks-title"><div><p className="eyebrow">02 · Checks</p><h2>Capture readiness evidence</h2></div><span>{plan.checks.filter((item) => item.complete).length} of {plan.checks.length}</span></div>
          <div className="gate-card">{plan.checks.map((check) => { const unlocked = checkUnlocked(plan, check.id); const waitingOn = check.dependencyIds.map((id) => plan.dependencies.find((item) => item.id === id)).filter((item) => item && (item.state !== 'ready' || !item.ownerId)).map((item) => item!.name); return <article className={`check-row ${check.complete ? 'complete' : ''} ${unlocked ? '' : 'locked'}`} key={check.id}>
            <label className="check-control"><input type="checkbox" checked={check.complete} disabled={!unlocked} onChange={(event) => updateCheck(check.id, { complete: event.target.checked })} /><span><Check size={15} /></span><div><b>{check.name}</b><small>{unlocked ? `${check.mandatory ? 'Required gate' : 'Optional check'} · ${ownerName(plan, check.ownerId)}` : `Waiting on ${waitingOn.join(', ')}`}</small></div></label>
            <select disabled={!unlocked} aria-label={`${check.name} owner`} value={check.ownerId} onChange={(event) => updateCheck(check.id, { ownerId: event.target.value })}><option value="">Unassigned</option>{plan.owners.map((owner) => <option key={owner.id} value={owner.id}>{owner.name}</option>)}</select>
            <input disabled={!unlocked} className="evidence" aria-label={`${check.name} evidence`} value={check.evidence} placeholder={unlocked ? 'Add evidence or reference' : 'Resolve dependency first'} onChange={(event) => updateCheck(check.id, { evidence: event.target.value })} onBlur={() => recordEvidence(check.id)} />
          </article>})}</div>
        </section>

        <aside className="decision-panel">
          <p className="eyebrow">03 · Decision</p><h2>Record the call</h2><p>A launch decision needs a clear choice and rationale. Any later gate change is still enforced.</p>
          <div className="decision-options" role="radiogroup" aria-label="Launch decision"><label className={`${decisionChoice === 'go' ? 'selected' : ''} ${status.blockers.length ? 'locked-choice' : ''}`}><input type="radio" name="decision" value="go" checked={decisionChoice === 'go'} disabled={status.blockers.length > 0} onChange={() => setDecisionChoice('go')} /><CircleCheck size={20} /><span><b>Go</b><small>{status.blockers.length ? 'Clear every required gate first' : 'Proceed when all gates clear'}</small></span></label><label className={decisionChoice === 'no-go' ? 'selected no-go' : ''}><input type="radio" name="decision" value="no-go" checked={decisionChoice === 'no-go'} onChange={() => setDecisionChoice('no-go')} /><AlertTriangle size={20} /><span><b>No-go</b><small>Hold this launch window</small></span></label></div>
          <label className="rationale"><span>Decision rationale</span><textarea aria-label="Decision rationale" value={decisionNote} onChange={(event) => setDecisionNote(event.target.value)} placeholder="What supports this decision?" rows={3} /></label>
          <button className="button secondary full" onClick={recordDecision} disabled={!decisionChoice || decisionNote.trim().length < 4}>Record decision</button>
          {plan.decision && <div className={`recorded ${plan.decision.value}`}><ShieldCheck size={18} /><div><b>{plan.decision.value === 'go' ? 'Go recorded' : 'No-go recorded'}</b><small>{plan.decision.recordedAt}</small></div></div>}
          <div className="launch-rule"><p>{status.blockers.length ? `${status.blockers[0]}. Any recorded Go is withdrawn until this is resolved.` : plan.decision?.value !== 'go' ? 'Record a go decision to unlock launch.' : 'Required gates and decision are ready.'}</p><button className="button primary full" onClick={launch} disabled={!canLaunch(plan)}><Zap size={17} />Simulate launch</button></div>
          {plan.phase === 'launched' && !plan.incident?.active && <button className="incident-trigger" onClick={openIncident}><AlertTriangle size={16} />Run sample post-launch issue</button>}
          {plan.incident?.active && <div className="incident-card" role="alert"><span>Sample incident · SEV 2</span><h3>Exports delayed</h3><p>Choose how the simulated rollout should respond.</p><button onClick={() => decideIncident('pause')}>Pause rollout</button><button className="danger" onClick={() => decideIncident('rollback')}>Roll back release</button></div>}
        </aside></div>
      </>}

      {view === 'timeline' && <section className="timeline-page"><p className="eyebrow">Recorded locally</p><h1>Launch timeline</h1><p className="lede">Every decision and simulated state change gets a timestamp. This record stays in this browser.</p>{plan.timeline.length ? <ol className="timeline">{[...plan.timeline].reverse().map((event) => <li key={event.id}><span className={event.kind} /><time>{event.at}</time><div><h2>{event.title}</h2><p>{event.detail}</p></div></li>)}</ol> : <div className="empty"><Clock3 size={28} /><h2>No activity yet</h2><p>Launch events will appear here.</p></div>}</section>}

      {view === 'about' && <section className="about-page"><p className="eyebrow">Independent sample</p><h1>Governance you can inspect.</h1><p className="lede">Launch Control is a fictional product artifact for Northstar, a fictional B2B SaaS company. It simulates readiness and launch decisions entirely in the browser. It has no authentication, production integrations, notifications, or paid services.</p><div className="about-grid"><article><h2>Designed for accountability</h2><p>Owners, dependency state, evidence, decisions, and response actions are explicit and timestamped.</p></article><article><h2>Boundaries</h2><p>No button here deploys software, contacts a person, changes traffic, or rolls back a real release. All names and records are sample data.</p></article></div><a className="case-link" href="https://github.com/mvahedi2020/Launch-Control/blob/main/docs/product/Case_Study.md">Read the product case study <ArrowUpRight size={18} /></a></section>}
    </main>
    <footer><span>Northstar sample · No real systems connected</span><button onClick={reset}><RotateCcw size={15} />Reset sample</button><button onClick={exportSummary}><Download size={15} />Export summary</button><a href="#timeline">View timeline <ChevronRight size={15} /></a></footer>
  </div>
}
