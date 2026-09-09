import { Component, type ErrorInfo, type ReactNode } from 'react'

const STORAGE_KEY = 'northstar.launch-control.session.v1'

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Launch Control failed to render', error, info)
  }

  private reset = () => {
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* Reload still restores in-memory sample state. */ }
    location.hash = '#command'
    location.reload()
  }

  render() {
    if (!this.state.failed) return this.props.children
    return <main className="fatal-error" role="alert"><p>Fictional product demo</p><h1>Launch Control couldn’t load.</h1><p>Reset the local sample to return to the readiness review.</p><button onClick={this.reset}>Reset sample and reload</button></main>
  }
}
