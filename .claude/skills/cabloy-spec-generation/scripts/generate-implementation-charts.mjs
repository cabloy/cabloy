#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';

const STATUS_ORDER = ['not-started', 'in-progress', 'implementation-complete', 'verified', 'blocked', 'waived', 'deferred'];
const STATUS_COLORS = {
  'not-started': 'var(--blue)',
  'in-progress': 'var(--orange)',
  'implementation-complete': 'var(--violet)',
  verified: 'var(--aqua)',
  blocked: 'var(--red)',
  waived: 'var(--yellow)',
  deferred: 'var(--muted)',
};

const COPY = {
  en: {
    ganttTitle: 'Implementation Roadmap',
    ganttSubtitle: 'WBS sequencing, dependencies, derived status, and illustrative relative timeboxes',
    burndownTitle: 'WBS Scope-Count Burndown',
    burndownSubtitle: 'Derived WBS scope snapshot — remaining-count reference, not a calendar or historical trend',
    phase: 'Phase', wbs: 'WBS', work: 'Work package', dependency: 'Dependencies', status: 'Status',
    weeks: 'Relative implementation order (illustrative)', current: 'Current reviewed state',
    remaining: 'WBS items remaining', verified: 'verified', approved: 'Approved WBS scope',
    noNext: 'No WBS item is ready to execute after the current scope.',
    noReady: 'No next WBS item is ready to execute.',
    source: 'Sources', reviewed: 'Last reviewed', scopeReference: 'Scope-count reference',
    notTime: 'Verified WBS items in approved scope — not time', remainingAxis: 'WBS items remaining',
    logicalBaseline: 'Logical approved-scope baseline', currentSnapshot: 'Current snapshot',
    remainingShort: 'remaining', emptyScope: 'No active WBS items remain in scope.',
    noHistory: 'No observed intermediate status points are available.',
    formula: 'remaining = active scope − verified',
    phaseScope: 'Scope by phase', active: 'Active WBS items', deferred: 'Deferred',
    completion: 'Completion', howRead: 'How to read this chart',
    caveat: 'Derived visualization only — not a schedule, velocity trend, or forecast',
    chartCaveat: 'Relative positions and overlap are illustrative; they are not calendar dates, duration, staffing, or concurrency commitments.',
    metadata: 'Derived from pdp-wbs.md, test-plan.md, and progress.md. This SVG is not planning authority.',
    next: 'Next executable WBS item',
  },
  zh: {
    ganttTitle: '实施路线图',
    ganttSubtitle: 'WBS 顺序、依赖关系、派生状态和示意性相对时间框',
    burndownTitle: 'WBS 范围燃尽图',
    burndownSubtitle: '派生的 WBS 范围快照——剩余项参考，不是日历或历史趋势',
    phase: '阶段', wbs: 'WBS', work: '工作包', dependency: '依赖', status: '状态',
    weeks: '相对实施顺序（示意）', current: '当前审查状态',
    remaining: '剩余 WBS 项', verified: '已核验', approved: '已批准 WBS 范围',
    noNext: '选择其依赖均已满足的最早未核验 WBS 项。',
    noReady: '当前没有可执行的下一项 WBS 工作。',
    source: '来源', reviewed: '最后审查日期', scopeReference: '范围计数参考',
    notTime: '已核验的批准范围 WBS 项——不是时间', remainingAxis: '剩余 WBS 项',
    logicalBaseline: '逻辑上的批准范围基线', currentSnapshot: '当前快照',
    remainingShort: '剩余', emptyScope: '当前范围内没有活跃 WBS 项。',
    noHistory: '没有可用的中间历史状态点。',
    formula: '剩余 = 活跃范围 − 已核验',
    phaseScope: '按阶段统计范围', active: '活跃 WBS 项', deferred: '已延期',
    completion: '完成情况', howRead: '图表说明',
    caveat: '仅为派生可视化——不是计划、速度趋势或预测',
    chartCaveat: '相对位置和重叠仅为示意；不代表日历日期、工期、人员或并发承诺。',
    next: '下一项 WBS 工作',
    metadata: '派生自 pdp-wbs.md、test-plan.md 和 progress.md。本 SVG 不是计划权威。',
  },
};

function escapeXml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function languageFromReadme(readme) {
  const cjk = (readme.match(/[㐀-鿿]/g) ?? []).length;
  const latin = (readme.match(/[A-Za-z]/g) ?? []).length;
  return cjk > latin / 3 ? 'zh' : 'en';
}

function normalizeStatus(value) {
  const normalized = value.trim().replace(/`/g, '').toLowerCase();
  if (!STATUS_ORDER.includes(normalized)) {
    throw new Error(`Unsupported progress status: ${value.trim()}`);
  }
  return normalized;
}

function parseTableRow(line) {
  if (!line.trim().startsWith('|') || /^\|\s*[-: ]+\|/.test(line)) return null;
  return line.split('|').slice(1, -1).map(cell => cell.trim());
}

export function parseProgress(markdown) {
  const rows = new Map();
  let reviewed = markdown.match(/(?:Last reviewed|最后审查日期)\s*[:：]?\s*(\d{4}-\d{2}-\d{2})/i)?.[1];
  for (const line of markdown.split('\n')) {
    const cells = parseTableRow(line);
    if (!cells || cells.length < 2) continue;
    const id = cells[0].replace(/`/g, '').match(/\bWBS-[A-Za-z0-9-]+\b/)?.[0];
    if (!id) continue;
    rows.set(id, normalizeStatus(cells[1]));
  }
  if (!reviewed) reviewed = 'not recorded';
  return { rows, reviewed };
}

export function parseWbs(markdown) {
  const phaseMatches = [...markdown.matchAll(/^###\s+Phase\s+(\d+)\s*:\s*(.+)$/gim)];
  if (!phaseMatches.length) throw new Error('No formal `### Phase <number>:` headings were found in pdp-wbs.md.');
  const phases = [];
  for (let phaseIndex = 0; phaseIndex < phaseMatches.length; phaseIndex++) {
    const match = phaseMatches[phaseIndex];
    const bodyStart = match.index + match[0].length;
    const bodyEnd = phaseMatches[phaseIndex + 1]?.index ?? markdown.length;
    const body = markdown.slice(bodyStart, bodyEnd);
    const phaseDependency = body.match(/^Dependencies:\s*(.+)$/im)?.[1]?.trim() ?? 'none';
    const taskMatches = [...body.matchAll(/^####\s+(WBS-[A-Za-z0-9-]+)\s*:\s*(.+)$/gim)];
    const tasks = taskMatches.map((taskMatch, taskIndex) => {
      const taskBodyStart = taskMatch.index + taskMatch[0].length;
      const taskBodyEnd = taskMatches[taskIndex + 1]?.index ?? body.length;
      const taskBody = body.slice(taskBodyStart, taskBodyEnd);
      const dependency = taskBody.match(/^Dependencies:\s*(.+)$/im)?.[1]?.trim() ?? phaseDependency;
      const deferred = /\b(?:status\s*:\s*`?deferred`?|deferred scope)\b/i.test(taskBody);
      return {
        id: taskMatch[1],
        title: taskMatch[2].trim(),
        dependency,
        deferred,
        atps: [...new Set([...taskBody.matchAll(/\bATP-[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*\b/g)].map(value => value[0]))],
      };
    });
    phases.push({ number: match[1], title: match[2].trim(), dependency: phaseDependency, tasks });
  }
  const tasks = phases.flatMap(phase => phase.tasks.map(task => {
    task.phase = { number: phase.number, title: phase.title };
    return task;
  }));
  if (!tasks.length) throw new Error('No formal `#### WBS-…:` tasks were found in pdp-wbs.md.');
  const ids = new Set(tasks.map(task => task.id));
  for (const task of tasks) {
    for (const dependency of task.dependency.match(/\bWBS-(?:[A-Za-z0-9]+-)*[A-Za-z0-9]+(?:-\*)?/g) ?? []) {
      if (dependency.endsWith('-*')) {
        const prefix = dependency.slice(0, -1);
        if (![...ids].some(id => id.startsWith(prefix))) throw new Error(`${task.id} depends on unknown WBS task group ${dependency}.`);
      } else if (!ids.has(dependency)) {
        throw new Error(`${task.id} depends on unknown WBS task ${dependency}.`);
      }
    }
  }
  return { phases, tasks };
}

export function parseAtpIds(markdown) {
  const ids = new Set();
  for (const line of markdown.split('\n')) {
    const cells = parseTableRow(line);
    if (cells?.[0]) {
      const id = cells[0].match(/^`?(ATP-[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)`?$/)?.[1];
      if (id) ids.add(id);
      continue;
    }
    const heading = line.match(/^#{2,}\s+`?(ATP-[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)`?(?=\s|$)/);
    if (heading) ids.add(heading[1]);
  }
  return ids;
}

export function createChartModel({ readme, wbs, progress, testPlan }) {
  const language = languageFromReadme(readme);
  const atpIds = parseAtpIds(testPlan);
  const { phases, tasks } = parseWbs(wbs);
  const { rows: statusRows, reviewed } = parseProgress(progress);
  const unknownProgress = [...statusRows.keys()].filter(id => !tasks.some(task => task.id === id));
  if (unknownProgress.length) throw new Error(`progress.md contains WBS rows not defined in pdp-wbs.md: ${unknownProgress.join(', ')}.`);
  for (const task of tasks) {
    if (!statusRows.has(task.id)) throw new Error(`${task.id} has no corresponding progress.md status row.`);
    task.status = statusRows.get(task.id);
    if (task.deferred && task.status !== 'deferred') {
      throw new Error(`${task.id} is marked deferred in pdp-wbs.md but has progress status ${task.status}.`);
    }
    for (const atp of task.atps) {
      if (!atpIds.has(atp)) throw new Error(`${task.id} references undefined ${atp} in test-plan.md.`);
    }
  }
  const activeTasks = tasks.filter(task => !task.deferred && task.status !== 'deferred');
  const deferredTasks = tasks.filter(task => !activeTasks.includes(task));
  const verified = activeTasks.filter(task => task.status === 'verified').length;
  return { language, copy: COPY[language], phases, tasks, activeTasks, deferredTasks, verified, reviewed };
}

function style() {
  return `<style>
    :root { --surface:#fcfcfb;--page:#f9f9f7;--ink:#0b0b0b;--secondary:#52514e;--muted:#898781;--grid:#e1e0d9;--axis:#c3c2b7;--blue:#2a78d6;--orange:#eb6834;--aqua:#1baf7a;--violet:#4a3aa7;--red:#e34948;--yellow:#eda100;--blue-wash:#eaf3fd;--aqua-wash:#e7f7f0; }
    @media (prefers-color-scheme:dark) { :root { --surface:#1a1a19;--page:#0d0d0d;--ink:#fff;--secondary:#c3c2b7;--muted:#a09f99;--grid:#2c2c2a;--axis:#383835;--blue:#3987e5;--orange:#d95926;--aqua:#199e70;--violet:#9085e9;--red:#e66767;--yellow:#c98500;--blue-wash:#172435;--aqua-wash:#122b23; } }
    .canvas{fill:var(--page)}.card{fill:var(--surface);stroke:var(--grid);stroke-width:1}.title{fill:var(--ink);font-family:Arial,Helvetica,sans-serif;font-size:27px;font-weight:700}.subtitle{fill:var(--secondary);font-family:Arial,Helvetica,sans-serif;font-size:14px}.heading{fill:var(--ink);font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700}.task{fill:var(--ink);font-family:Arial,Helvetica,sans-serif;font-size:10px}.small{fill:var(--muted);font-family:Arial,Helvetica,sans-serif;font-size:9px}.caption{fill:var(--secondary);font-family:Arial,Helvetica,sans-serif;font-size:11px}.num{fill:var(--ink);font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;font-variant-numeric:tabular-nums}.grid{stroke:var(--grid);stroke-width:1;shape-rendering:crispEdges}.axis{stroke:var(--axis);stroke-width:1;shape-rendering:crispEdges}.row:focus{outline:2px solid var(--ink);outline-offset:2px}
  </style>`;
}

function statusLabel(status, language) {
  const labels = { en: { 'not-started': 'Not started', 'in-progress': 'In progress', 'implementation-complete': 'Implementation complete', verified: 'Verified', blocked: 'Blocked', waived: 'Waived', deferred: 'Deferred' }, zh: { 'not-started': '未开始', 'in-progress': '进行中', 'implementation-complete': '实施完成', verified: '已核验', blocked: '受阻', waived: '已豁免', deferred: '已延期' } };
  return labels[language][status];
}

function statusIcon(x, y, status) {
  if (status === 'verified') return `<circle cx="${x}" cy="${y}" r="6" fill="var(--surface)" stroke="var(--axis)"/><path d="M${x - 3} ${y} L${x - 1} ${y + 2} L${x + 4} ${y - 3}" fill="none" stroke="var(--ink)" stroke-width="1.1" stroke-linecap="round"/>`;
  return `<circle cx="${x}" cy="${y}" r="5" fill="${STATUS_COLORS[status]}"/>`;
}

function svgDocument(title, desc, body, height, metadata) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="${height}" viewBox="0 0 1600 ${height}" role="img" aria-labelledby="chart-title chart-desc">
  <title id="chart-title">${escapeXml(title)}</title>
  <desc id="chart-desc">${escapeXml(desc)}</desc>
  <metadata>${escapeXml(metadata)}</metadata>
  ${style()}
  ${body}
</svg>
`;
}

export function renderGantt(model, suiteName) {
  const { copy: t, tasks, phases, reviewed, language } = model;
  const height = Math.max(850, 390 + tasks.length * 34 + 170);
  const plotX = 890; const plotW = 610; const rowY = 270; const rowH = 34;
  const rows = tasks.map((task, index) => {
    const y = rowY + index * rowH;
    const barX = plotX + (index / Math.max(tasks.length, 1)) * (plotW - 90);
    const barW = task.status === 'verified' ? 58 : 42;
    const phaseLabel = index === 0 || tasks[index - 1].phase.number !== task.phase.number ? `${t.phase} ${task.phase.number}` : '';
    return `<g class="row" tabindex="0" aria-label="${escapeXml(`${task.id}: ${task.title}; ${statusLabel(task.status, language)}`)}"><title>${escapeXml(`${task.id}: ${task.title}; dependencies: ${task.dependency}; ${statusLabel(task.status, language)}`)}</title><line class="grid" x1="72" y1="${y + 14}" x2="1500" y2="${y + 14}"/><text class="small" x="72" y="${y}">${escapeXml(phaseLabel)}</text><text class="num" x="185" y="${y}">${escapeXml(task.id)}</text><text class="task" x="325" y="${y}">${escapeXml(task.title)}</text><text class="small" x="625" y="${y}">${escapeXml(task.dependency)}</text>${statusIcon(795, y - 4, task.status)}<text class="small" x="807" y="${y}">${escapeXml(statusLabel(task.status, language))}</text><rect x="${barX.toFixed(1)}" y="${y - 15}" width="${barW}" height="18" rx="4" fill="${STATUS_COLORS[task.status]}"/></g>`;
  }).join('\n');
  const completed = new Set(tasks.filter(task => task.status === 'verified').map(task => task.id));
  const dependencyIds = task => [...task.dependency.matchAll(/\bWBS-(?:[A-Za-z0-9]+-)*[A-Za-z0-9]+(?:-\*)?/g)].flatMap(match => {
    const value = match[0];
    if (!value.endsWith('-*')) return [value];
    const prefix = value.slice(0, -1);
    return tasks.filter(candidate => candidate.id.startsWith(prefix)).map(candidate => candidate.id);
  });
  const nextTask = tasks.find(task =>
    task.status !== 'verified' && task.status !== 'deferred' && task.status !== 'waived' && task.status !== 'blocked' &&
    dependencyIds(task).every(id => completed.has(id))
  );
  const nextLabel = nextTask ? `${nextTask.id}: ${nextTask.title}` : (model.verified === model.activeTasks.length ? t.noReady : t.noNext);
  const body = `<rect class="canvas" width="1600" height="${height}"/><rect class="card" x="32" y="28" width="1536" height="${height - 56}" rx="14"/>
  <text class="title" x="72" y="84">${escapeXml(`${suiteName} ${t.ganttTitle}`)}</text><text class="subtitle" x="72" y="110">${escapeXml(t.ganttSubtitle)}</text><text class="small" x="1500" y="84" text-anchor="end">${escapeXml(`${t.reviewed}: ${reviewed}`)}</text>
  <rect x="72" y="142" width="1428" height="78" rx="8" fill="var(--aqua-wash)"/><text class="heading" x="96" y="171">${escapeXml(t.current)}</text><text class="caption" x="96" y="195">${escapeXml(nextLabel)}</text><text class="heading" x="1320" y="171" text-anchor="end">${escapeXml(t.next)}</text><text class="heading" x="1320" y="195" text-anchor="end">${model.verified} / ${model.activeTasks.length} ${escapeXml(t.verified)}</text>
  <text class="small" x="72" y="246">${escapeXml(t.phase)}</text><text class="small" x="185" y="246">${escapeXml(t.wbs)}</text><text class="small" x="325" y="246">${escapeXml(t.work)}</text><text class="small" x="625" y="246">${escapeXml(t.dependency)}</text><text class="small" x="790" y="246">${escapeXml(t.status)}</text><text class="small" x="890" y="246">${escapeXml(t.weeks)}</text><line class="axis" x1="890" y1="254" x2="1500" y2="254"/>
  ${rows}
  <line class="grid" x1="72" y1="${height - 78}" x2="1500" y2="${height - 78}"/><text class="small" x="72" y="${height - 50}">${escapeXml(`${t.source}: pdp-wbs.md · test-plan.md · progress.md (${t.reviewed}: ${reviewed})`)}</text><text class="small" x="1500" y="${height - 50}" text-anchor="end">${escapeXml(t.chartCaveat)}</text>`;
  return svgDocument(`${suiteName} ${t.ganttTitle}`, `${t.ganttTitle}. ${tasks.length} formal WBS tasks. Current derived status reviewed ${reviewed}. ${t.chartCaveat}`, body, height, t.metadata);
}

export function renderBurndown(model, suiteName) {
  const { copy: t, phases, activeTasks, deferredTasks, verified, reviewed, language } = model;
  const total = activeTasks.length; const remaining = total - verified;
  const height = 1050; const x0 = 190; const x1 = 910; const y0 = 410; const y1 = 650;
  const completion = total ? verified / total : 0;
  const currentX = x0 + completion * (x1 - x0);
  const currentY = y0 + completion * (y1 - y0);
  const currentMarker = remaining === 0 && total > 0
    ? `<circle cx="${currentX.toFixed(1)}" cy="${currentY.toFixed(1)}" r="14" fill="var(--aqua)" stroke="var(--surface)" stroke-width="3"/><path d="M${(currentX - 6).toFixed(1)} ${currentY.toFixed(1)} L${(currentX - 2).toFixed(1)} ${(currentY + 4).toFixed(1)} L${(currentX + 6).toFixed(1)} ${(currentY - 5).toFixed(1)}" fill="none" stroke="var(--surface)" stroke-width="1.8" stroke-linecap="round"/>`
    : `<circle cx="${currentX.toFixed(1)}" cy="${currentY.toFixed(1)}" r="8" fill="var(--orange)" stroke="var(--surface)" stroke-width="2"/>`;
  const phaseRows = phases.map((phase, index) => {
    const phaseTasks = phase.tasks.filter(task => !task.deferred && task.status !== 'deferred');
    const phaseVerified = phaseTasks.filter(task => task.status === 'verified').length;
    const y = 805 + index * 28;
    const width = phaseTasks.length ? (phaseVerified / phaseTasks.length) * 210 : 0;
    return `<g class="row" tabindex="0" aria-label="${escapeXml(`${t.phase} ${phase.number}: ${phaseVerified} of ${phaseTasks.length} ${t.verified}`)}"><title>${escapeXml(`${t.phase} ${phase.number} ${phase.title}: ${phaseVerified} of ${phaseTasks.length} ${t.verified}`)}</title><text class="task" x="96" y="${y}">${escapeXml(`${t.phase} ${phase.number} · ${phase.title}`)}</text><text class="num" x="730" y="${y}" text-anchor="end">${phaseVerified} / ${phaseTasks.length}</text><text class="num" x="850" y="${y}" text-anchor="end">${phaseTasks.length - phaseVerified}</text><rect x="930" y="${y - 11}" width="210" height="12" rx="6" fill="var(--blue-wash)"/><rect x="930" y="${y - 11}" width="${width}" height="12" rx="6" fill="var(--aqua)"/>${statusIcon(1215, y - 5, phaseVerified === phaseTasks.length ? 'verified' : 'in-progress')}<text class="small" x="1228" y="${y}">${escapeXml(phaseVerified === phaseTasks.length ? statusLabel('verified', language) : `${phaseVerified}/${phaseTasks.length}`)}</text></g>`;
  }).join('\n');
  const body = `<rect class="canvas" width="1600" height="${height}"/><rect class="card" x="32" y="28" width="1536" height="${height - 56}" rx="14"/>
  <text class="title" x="72" y="84">${escapeXml(`${suiteName} ${t.burndownTitle}`)}</text><text class="subtitle" x="72" y="110">${escapeXml(t.burndownSubtitle)}</text><text class="small" x="1500" y="84" text-anchor="end">${escapeXml(`${t.reviewed}: ${reviewed}`)}</text>
  <rect x="72" y="142" width="1428" height="116" rx="8" fill="var(--aqua-wash)"/><text class="heading" x="96" y="170">${escapeXml(t.current)}</text><text x="96" y="231" class="title" style="font-size:52px">${remaining}</text><text class="heading" x="155" y="215">${escapeXml(t.remaining)}</text><text class="caption" x="155" y="237">${escapeXml(`${verified} / ${total} ${t.verified}`)}</text><text class="caption" x="700" y="205">${escapeXml(t.approved)}</text><text class="heading" x="700" y="230">${total}</text><text class="caption" x="1030" y="205">${escapeXml(t.deferred)}</text><text class="heading" x="1030" y="230">${deferredTasks.length}</text>
  <text class="heading" x="72" y="300">${escapeXml(t.scopeReference)}</text><text class="caption" x="72" y="321">${escapeXml(t.noHistory)}</text><rect class="card" x="72" y="340" width="940" height="390" rx="9"/><text class="small" x="116" y="372">${escapeXml(t.remainingAxis)}</text><text class="small" x="550" y="704" text-anchor="middle">${escapeXml(t.notTime)}</text>
  <g class="grid"><line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}"/><line x1="${x0}" y1="${y0 + 80}" x2="${x1}" y2="${y0 + 80}"/><line x1="${x0}" y1="${y0 + 160}" x2="${x1}" y2="${y0 + 160}"/><line x1="${x0}" y1="${y1}" x2="${x1}" y2="${y1}"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1}"/><line x1="${x1}" y1="${y0}" x2="${x1}" y2="${y1}"/></g><line class="axis" x1="${x0}" y1="${y1}" x2="${x1}" y2="${y1}"/><line class="axis" x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1}"/>
  <line x1="${x0}" y1="${y0}" x2="${currentX.toFixed(1)}" y2="${currentY.toFixed(1)}" stroke="var(--blue)" stroke-width="2"/><line x1="${currentX.toFixed(1)}" y1="${currentY.toFixed(1)}" x2="${x1}" y2="${y1}" stroke="var(--blue)" stroke-width="2" stroke-dasharray="6 5"/><circle cx="${x0}" cy="${y0}" r="7" fill="var(--blue)" stroke="var(--surface)" stroke-width="2"/><text class="heading" x="${x0 + 22}" y="${y0 + 18}">${escapeXml(t.logicalBaseline)}</text><text class="caption" x="${x0 + 22}" y="${y0 + 37}">${total} ${escapeXml(t.remainingShort)}</text>${currentMarker}<text class="heading" x="${Math.max(x0 + 150, currentX - 22)}" y="${Math.max(y0 + 60, currentY - 49)}" text-anchor="end">${escapeXml(t.currentSnapshot)}</text><text class="caption" x="${Math.max(x0 + 150, currentX - 22)}" y="${Math.max(y0 + 79, currentY - 30)}" text-anchor="end">${escapeXml(`${remaining} ${t.remainingShort} · ${verified} ${t.verified}`)}</text>
  <rect x="1040" y="340" width="460" height="390" rx="9" fill="var(--blue-wash)"/><text class="heading" x="1070" y="378">${escapeXml(t.howRead)}</text><text class="caption" x="1070" y="412">${escapeXml(t.formula)}</text><text class="caption" x="1070" y="448">${escapeXml(t.noHistory)}</text><text class="caption" x="1070" y="474">${escapeXml(t.caveat)}</text><text class="caption" x="1070" y="510">${escapeXml(t.chartCaveat)}</text>
  <rect class="card" x="72" y="758" width="1428" height="${height - 846}" rx="9"/><text class="heading" x="96" y="786">${escapeXml(t.phaseScope)}</text><text class="small" x="96" y="800">${escapeXml(`${t.active}: ${total}; ${t.verified}: ${verified}; ${t.remaining}: ${remaining}`)}</text><text class="small" x="730" y="786" text-anchor="end">${escapeXml(t.verified)}</text><text class="small" x="850" y="786" text-anchor="end">${escapeXml(t.remaining)}</text><text class="small" x="930" y="786">${escapeXml(t.completion)}</text>${phaseRows}
  <line class="grid" x1="72" y1="${height - 74}" x2="1500" y2="${height - 74}"/><text class="small" x="72" y="${height - 48}">${escapeXml(`${t.source}: pdp-wbs.md · progress.md (${t.reviewed}: ${reviewed})`)}</text><text class="small" x="1500" y="${height - 48}" text-anchor="end">${escapeXml(t.caveat)}</text>`;
  return svgDocument(`${suiteName} ${t.burndownTitle}`, `${t.burndownTitle}. ${total} active WBS items; ${verified} verified; ${remaining} remaining. ${t.noHistory}`, body, height, t.metadata);
}

export async function generateCharts(directory, { check = false } = {}) {
  const root = resolve(directory);
  const [readme, wbs, progress, testPlan] = await Promise.all(['README.md', 'pdp-wbs.md', 'progress.md', 'test-plan.md'].map(name => readFile(resolve(root, name), 'utf8')));
  const model = createChartModel({ readme, wbs, progress, testPlan });
  const suiteName = readme.match(/^#\s+(.+?)(?:\s+(?:Internal Planning|内部规划))?\s*$/m)?.[1]?.trim() ?? basename(root);
  const artifacts = new Map([
    ['implementation-gantt.svg', renderGantt(model, suiteName)],
    ['implementation-burndown.svg', renderBurndown(model, suiteName)],
  ]);
  const stale = [];
  for (const [name, content] of artifacts) {
    const path = resolve(root, name);
    let current;
    try { current = await readFile(path, 'utf8'); } catch { current = undefined; }
    if (current !== content) stale.push(name);
    if (!check && current !== content) await writeFile(path, content);
  }
  if (check && stale.length) throw new Error(`Derived implementation charts are stale: ${stale.join(', ')}. Run \`npm run spec:charts -- ${basename(root)}\`.`);
  return { model, artifacts, stale };
}

async function main() {
  const args = process.argv.slice(2);
  const check = args.includes('--check');
  const target = args.find(arg => !arg.startsWith('--'));
  if (!target) throw new Error('Usage: generate-implementation-charts.mjs [--check] <repo-specs/<suite>|<suite>.');
  const directory = target.includes('/') ? target : `repo-specs/${target}`;
  const result = await generateCharts(directory, { check });
  const mode = check ? 'checked' : 'generated';
  console.log(`${mode} implementation-gantt.svg and implementation-burndown.svg for ${directory} (${result.model.language}; ${result.model.verified}/${result.model.activeTasks.length} verified).`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => { console.error(`spec chart generation failed: ${error.message}`); process.exitCode = 1; });
}
