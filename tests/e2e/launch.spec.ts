import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('./')
  await page.getByRole('button', { name: 'Reset sample' }).click()
})

test('preserves incompatible saved launch data until explicit reset', async ({ page }) => {
  const original = '{"version":2,"plan":{"old":"data"}}'
  await page.addInitScript((raw) => localStorage.setItem('northstar.launch-control.session.v1', raw), original)
  await page.reload()
  await expect(page.getByRole('alert')).toContainText('existing browser data is preserved')
  expect(await page.evaluate(() => localStorage.getItem('northstar.launch-control.session.v1'))).toBe(original)
  await page.getByRole('button', { name: 'Reset sample' }).click()
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('northstar.launch-control.session.v1')!).version)).toBe(1)
})

test('enforces gates, records go, and completes a simulated launch', async ({ page }) => {
  const launch = page.getByRole('button', { name: 'Simulate launch' })
  await expect(launch).toBeDisabled()
  await page.getByLabel('Support enablement state').selectOption('ready')
  await page.getByLabel('Support runbook rehearsed evidence').fill('Sample rehearsal notes')
  await page.getByText('Support runbook rehearsed', { exact: true }).click()
  await page.getByLabel('Launch decision').getByText('Go', { exact: true }).click()
  await page.getByLabel('Decision rationale').fill('All required sample evidence reviewed.')
  await page.getByRole('button', { name: 'Record decision' }).click()
  await expect(launch).toBeEnabled()
  await launch.click()
  await expect(page.getByText('Launch complete', { exact: true })).toBeVisible()
  await page.getByRole('link', { name: 'Timeline', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Launch completed' })).toBeVisible()
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export summary' }).click()
  const file = await download
  expect(file.suggestedFilename()).toBe('launch-control-summary.json')
  const stream = await file.createReadStream()
  if (!stream) throw new Error('The launch summary was not readable')
  let json = ''
  for await (const chunk of stream) json += chunk.toString()
  const payload = JSON.parse(json)
  expect(payload.boundary).toBe('Fictional simulation; no production action')
  expect(payload.summary).toEqual({ phase: 'launched', recordedDecision: 'go', blockers: [] })
  await expect(page.getByRole('status')).toContainText('Launch complete exported as a fictional simulation with 0 readiness blockers')
})

test('requires an explicit incident response after launch', async ({ page }) => {
  await page.getByLabel('Support enablement state').selectOption('ready')
  await page.getByLabel('Support runbook rehearsed evidence').fill('Sample rehearsal notes')
  await page.getByText('Support runbook rehearsed', { exact: true }).click()
  await page.getByLabel('Launch decision').getByText('Go', { exact: true }).click()
  await page.getByLabel('Decision rationale').fill('All required sample evidence reviewed.')
  await page.getByRole('button', { name: 'Record decision' }).click()
  await page.getByRole('button', { name: 'Simulate launch' }).click()
  await page.getByRole('button', { name: 'Run sample post-launch issue' }).click()
  await expect(page.getByText('Exports delayed')).toBeVisible()
  await page.getByRole('button', { name: 'Pause rollout' }).click()
  await expect(page.getByText('Rollout paused', { exact: true })).toBeVisible()
})

test('locks pre-launch gates after launch while retaining the sample response path', async ({ page }) => {
  await page.getByLabel('Support enablement state').selectOption('ready')
  await page.getByLabel('Support runbook rehearsed evidence').fill('Sample rehearsal notes')
  await page.getByText('Support runbook rehearsed', { exact: true }).click()
  await page.getByLabel('Launch decision').getByText('Go', { exact: true }).click()
  await page.getByLabel('Decision rationale').fill('All required sample evidence reviewed.')
  await page.getByRole('button', { name: 'Record decision' }).click()
  await page.getByRole('button', { name: 'Simulate launch' }).click()

  await expect(page.getByLabel('Support enablement state')).toBeDisabled()
  await expect(page.getByLabel('Regression suite reviewed evidence')).toBeDisabled()
  await page.getByRole('button', { name: 'Run sample post-launch issue' }).click()
  await page.getByRole('button', { name: 'Pause rollout' }).click()
  await expect(page.getByText('Rollout paused', { exact: true })).toBeVisible()
})

test('withdraws a recorded go if required evidence is removed', async ({ page }) => {
  await page.getByLabel('Support enablement state').selectOption('ready')
  await page.getByLabel('Support runbook rehearsed evidence').fill('Sample rehearsal notes')
  await page.getByText('Support runbook rehearsed', { exact: true }).click()
  await page.getByLabel('Launch decision').getByText('Go', { exact: true }).click()
  await page.getByLabel('Decision rationale').fill('All required sample evidence reviewed.')
  await page.getByRole('button', { name: 'Record decision' }).click()
  await expect(page.getByRole('button', { name: 'Simulate launch' })).toBeEnabled()
  await page.getByLabel('Regression suite reviewed evidence').fill('')
  await expect(page.getByRole('button', { name: 'Simulate launch' })).toBeDisabled()
  await page.getByRole('link', { name: 'Timeline', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Go decision withdrawn' })).toBeVisible()
})

test('requires a new go after required evidence is restored', async ({ page }) => {
  await page.getByLabel('Support enablement state').selectOption('ready')
  await page.getByLabel('Support runbook rehearsed evidence').fill('Sample rehearsal notes')
  await page.getByText('Support runbook rehearsed', { exact: true }).click()
  await page.getByLabel('Launch decision').getByText('Go', { exact: true }).click()
  await page.getByLabel('Decision rationale').fill('All required sample evidence reviewed.')
  await page.getByRole('button', { name: 'Record decision' }).click()

  await page.getByLabel('Regression suite reviewed evidence').fill('')
  await page.getByLabel('Regression suite reviewed evidence').fill('Sample QA report #184')
  await expect(page.getByRole('button', { name: 'Simulate launch' })).toBeDisabled()

  await page.getByLabel('Launch decision').getByText('Go', { exact: true }).click()
  await page.getByRole('button', { name: 'Record decision' }).click()
  await expect(page.getByRole('button', { name: 'Simulate launch' })).toBeEnabled()
})

test('records one local evidence snapshot for a completed edit', async ({ page }) => {
  const evidence = page.getByLabel('Support runbook rehearsed evidence')
  await page.getByLabel('Support enablement state').selectOption('ready')
  await evidence.fill('Sample rehearsal notes')
  await evidence.press('Tab')
  await page.getByRole('link', { name: 'Timeline', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Readiness evidence recorded' })).toHaveCount(1)

  await page.getByRole('link', { name: 'Command', exact: true }).click()
  await evidence.focus()
  await evidence.press('Tab')
  await page.getByRole('link', { name: 'Timeline', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Readiness evidence recorded' })).toHaveCount(1)
})

test('does not duplicate an unchanged recorded decision', async ({ page }) => {
  await page.getByLabel('Launch decision').getByText('No-go', { exact: true }).click()
  await page.getByLabel('Decision rationale').fill('Need more sample review.')
  const record = page.getByRole('button', { name: 'Record decision' })
  await record.click()
  await expect(record).toBeDisabled()
  await page.getByRole('link', { name: 'Timeline', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'No-go decision recorded' })).toHaveCount(1)
})
