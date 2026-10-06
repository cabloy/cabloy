#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';

import {
  isPlanningCompleteEligible,
  isPrerequisiteSatisfied,
  markdownLines,
  parseAtpIds,
  parseProgress,
  parseWbs,
} from './spec-parser.mjs';
export { parseAtpIds, parseProgress, parseWbs } from './spec-parser.mjs';

const STATUS_COLORS = {
  'not-started': 'var(--blue)',
  'in-progress': 'var(--orange)',
  'planning-complete': 'var(--teal)',
  'implementation-complete': 'var(--violet)',
  'verified': 'var(--aqua)',
  'blocked': 'var(--red)',
  'waived': 'var(--yellow)',
  'deferred': 'var(--muted)',
};

const COPY = {
  en: {
    ganttTitle: 'Implementation Roadmap',
    ganttSubtitle:
      'WBS sequencing, dependencies, derived status, and illustrative relative timeboxes',
    burndownTitle: 'WBS Scope-Count Burndown',
    burndownSubtitle:
      'Derived WBS scope snapshot — remaining-count reference, not a calendar or historical trend',
    phase: 'Phase',
    wbs: 'WBS',
    work: 'Work package',
    dependency: 'Dependencies',
    status: 'Status',
    weeks: 'Relative implementation order (illustrative)',
    current: 'Current reviewed state',
    remaining: 'WBS items remaining',
    verified: 'verified',
    approved: 'Recorded WBS scope',
    noNext: 'No dependency-ready WBS candidate is recorded.',
    noReady: 'No dependency-ready WBS candidate is recorded.',
    notRecorded: 'not recorded',
    none: 'none',
    candidateCaveat:
      'Dependency readiness is not execution approval; descriptive gates still require review.',
    ganttDescription: (count, reviewed) =>
      `${count} formal WBS tasks. Current derived status reviewed ${reviewed}.`,
    burndownDescription: (total, verified, remaining) =>
      `${total} active WBS items; ${verified} verified; ${remaining} remaining.`,
    phaseSummary: (number, verified, total) => `Phase ${number}: ${verified} / ${total} verified`,
    statuses: {
      'not-started': 'Not started',
      'in-progress': 'In progress',
      'planning-complete': 'Planning complete',
      'implementation-complete': 'Implementation complete',
      'verified': 'Verified',
      'blocked': 'Blocked',
      'waived': 'Waived',
      'deferred': 'Deferred',
    },
    source: 'Sources',
    reviewed: 'Last reviewed',
    scopeReference: 'Scope-count reference',
    notTime: 'Verified WBS items in recorded scope — not time',
    remainingAxis: 'WBS items remaining',
    logicalBaseline: 'Logical recorded-scope baseline',
    currentSnapshot: 'Current snapshot',
    remainingShort: 'remaining',
    emptyScope: 'No active WBS items remain in scope.',
    noHistory: 'No observed intermediate status points are available.',
    formula: 'remaining = active scope − verified',
    phaseScope: 'Scope by phase',
    active: 'Active WBS items',
    deferred: 'Deferred',
    completion: 'Completion',
    howRead: 'How to read this chart',
    caveat: 'Derived visualization only — not a schedule, velocity trend, or forecast',
    chartCaveat:
      'Relative positions and overlap are illustrative; they are not calendar dates, duration, staffing, or concurrency commitments.',
    metadata:
      'Derived from pdp-wbs.md, test-plan.md, and progress.md. This SVG is not planning authority.',
    next: 'Dependency-ready WBS candidate',
  },
  zh: {
    ganttTitle: '实施路线图',
    ganttSubtitle: 'WBS 顺序、依赖关系、派生状态和示意性相对时间框',
    burndownTitle: 'WBS 范围燃尽图',
    burndownSubtitle: '派生的 WBS 范围快照——剩余项参考，不是日历或历史趋势',
    phase: '阶段',
    wbs: 'WBS',
    work: '工作包',
    dependency: '依赖',
    status: '状态',
    weeks: '相对实施顺序（示意）',
    current: '当前审查状态',
    remaining: '剩余 WBS 项',
    verified: '已核验',
    approved: '已记录 WBS 范围',
    noNext: '当前没有已记录的依赖就绪 WBS 候选项。',
    noReady: '当前没有已记录的依赖就绪 WBS 候选项。',
    notRecorded: '未记录',
    none: '无',
    candidateCaveat: '依赖就绪不代表实施批准；描述性门槛仍需审查。',
    ganttDescription: (count, reviewed) =>
      `${count} 项正式 WBS 工作。当前派生状态的审查日期：${reviewed}。`,
    burndownDescription: (total, verified, remaining) =>
      `${total} 项活跃 WBS 工作；${verified} 项已核验；${remaining} 项剩余。`,
    phaseSummary: (number, verified, total) => `阶段 ${number}：${verified} / ${total} 项已核验`,
    statuses: {
      'not-started': '未开始',
      'in-progress': '进行中',
      'planning-complete': '规划完成',
      'implementation-complete': '实施完成',
      'verified': '已核验',
      'blocked': '受阻',
      'waived': '已豁免',
      'deferred': '已延期',
    },
    source: '来源',
    reviewed: '最后审查日期',
    scopeReference: '范围计数参考',
    notTime: '已核验的记录范围 WBS 项——不是时间',
    remainingAxis: '剩余 WBS 项',
    logicalBaseline: '逻辑上的记录范围基线',
    currentSnapshot: '当前快照',
    remainingShort: '剩余',
    emptyScope: '当前范围内没有活跃 WBS 项。',
    noHistory: '没有可用的中间历史状态点。',
    formula: '剩余 = 活跃范围 − 已核验',
    phaseScope: '按阶段统计范围',
    active: '活跃 WBS 项',
    deferred: '已延期',
    completion: '完成情况',
    howRead: '图表说明',
    caveat: '仅为派生可视化——不是计划、速度趋势或预测',
    chartCaveat: '相对位置和重叠仅为示意；不代表日历日期、工期、人员或并发承诺。',
    next: '依赖就绪 WBS 候选项',
    metadata: '派生自 pdp-wbs.md、test-plan.md 和 progress.md。本 SVG 不是计划权威。',
  },
};

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function isAsciiLetter(character) {
  if (!character || character.length !== 1) return false;
  const codePoint = character.codePointAt(0);
  return (codePoint >= 0x41 && codePoint <= 0x5a) || (codePoint >= 0x61 && codePoint <= 0x7a);
}

function isWideChartCharacter(character) {
  const codePoint = character.codePointAt(0);
  return (
    codePoint > 0xffff ||
    (codePoint >= 0x2e80 && codePoint <= 0x9fff) ||
    (codePoint >= 0xac00 && codePoint <= 0xd7af) ||
    (codePoint >= 0xf900 && codePoint <= 0xfaff)
  );
}

function isCjkUnifiedIdeograph(character) {
  const codePoint = character.codePointAt(0);
  return codePoint >= 0x3400 && codePoint <= 0x9fff;
}

function chartTextWidth(value, fontSize) {
  return [...String(value)].reduce((width, character) => {
    const characterWidth = isWideChartCharacter(character)
      ? 1
      : /[MW@#%&]/.test(character)
        ? 0.9
        : /[A-Z0-9]/.test(character)
          ? 0.62
          : /[ilI.,:;!'` ]/.test(character)
            ? 0.28
            : 0.5;
    return width + characterWidth * fontSize;
  }, 0);
}

function wrapChartText(value, maxWidth, measure = value => [...String(value)].length) {
  const words = String(value).trim().replace(/\s+/g, ' ').split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const characters = [...word];
    if (measure(word) > maxWidth) {
      if (line) {
        lines.push(line);
        line = '';
      }
      let chunk = '';
      let chunkWidth = 0;
      for (const character of characters) {
        const characterWidth = measure(character);
        if (chunk && chunkWidth + characterWidth > maxWidth) {
          lines.push(chunk);
          chunk = '';
          chunkWidth = 0;
        }
        chunk += character;
        chunkWidth += characterWidth;
      }
      if (chunk) lines.push(chunk);
      continue;
    }
    const candidate = line ? `${line} ${word}` : word;
    if (measure(candidate) > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function languageFromReadme(readme) {
  let cjk = 0;
  let latin = 0;
  for (const character of readme) {
    if (isCjkUnifiedIdeograph(character)) cjk++;
    if (isAsciiLetter(character)) latin++;
  }
  return cjk > latin / 3 ? 'zh' : 'en';
}

export function createChartModel({ readme, wbs, progress, testPlan }) {
  const language = languageFromReadme(readme);
  const atpIds = parseAtpIds(testPlan);
  const { phases, tasks, expandedEdges } = parseWbs(wbs);
  const { rows: statusRows, reviewed } = parseProgress(progress);
  const unknownProgress = [...statusRows.keys()].filter(id => !tasks.some(task => task.id === id));
  if (unknownProgress.length) {
    throw new Error(
      `progress.md contains WBS rows not defined in pdp-wbs.md: ${unknownProgress.join(', ')}.`,
    );
  }
  for (const task of tasks) {
    if (!statusRows.has(task.id))
      throw new Error(`${task.id} has no corresponding progress.md status row.`);
    const progressStatus = statusRows.get(task.id);
    if (task.status !== undefined && task.status !== progressStatus) {
      throw new Error(
        `${task.id} has explicit pdp-wbs.md Status ${task.status} but progress status ${progressStatus}.`,
      );
    }
    task.recordedStatus = task.status;
    task.status = progressStatus;
    if (task.status === 'planning-complete' && !isPlanningCompleteEligible(task)) {
      throw new Error(
        `${task.id} has planning-complete status without Completion mode: planning-only.`,
      );
    }
    if (task.deferred && task.status !== 'deferred') {
      throw new Error(
        `${task.id} is marked deferred in pdp-wbs.md but has progress status ${task.status}.`,
      );
    }
    for (const atp of task.atps) {
      if (!atpIds.has(atp))
        throw new Error(`${task.id} references undefined ${atp} in test-plan.md.`);
    }
  }
  const activeTasks = tasks.filter(task => !task.deferred && task.status !== 'deferred');
  const deferredTasks = tasks.filter(task => !activeTasks.includes(task));
  const verified = activeTasks.filter(task => task.status === 'verified').length;
  return {
    language,
    copy: COPY[language],
    phases,
    tasks,
    activeTasks,
    deferredTasks,
    expandedEdges,
    verified,
    reviewed: reviewed === 'not recorded' ? COPY[language].notRecorded : reviewed,
  };
}

function style(planningComplete) {
  return `<style>
    :root { --surface:#fcfcfb;--page:#f9f9f7;--ink:#0b0b0b;--secondary:#52514e;--muted:#898781;--grid:#e1e0d9;--axis:#c3c2b7;--blue:#2a78d6;--orange:#eb6834;${planningComplete ? '--teal:#087f83;' : ''}--aqua:#1baf7a;--violet:#4a3aa7;--red:#e34948;--yellow:#eda100;--blue-wash:#eaf3fd;--aqua-wash:#e7f7f0; }
    @media (prefers-color-scheme:dark) { :root { --surface:#1a1a19;--page:#0d0d0d;--ink:#fff;--secondary:#c3c2b7;--muted:#a09f99;--grid:#2c2c2a;--axis:#383835;--blue:#3987e5;--orange:#d95926;${planningComplete ? '--teal:#29aeb0;' : ''}--aqua:#199e70;--violet:#9085e9;--red:#e66767;--yellow:#c98500;--blue-wash:#172435;--aqua-wash:#122b23; } }
    .canvas{fill:var(--page)}.card{fill:var(--surface);stroke:var(--grid);stroke-width:1}.title{fill:var(--ink);font-family:Arial,Helvetica,sans-serif;font-size:27px;font-weight:700}.subtitle{fill:var(--secondary);font-family:Arial,Helvetica,sans-serif;font-size:14px}.heading{fill:var(--ink);font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700}.phase{fill:var(--ink);font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700}.task{fill:var(--ink);font-family:Arial,Helvetica,sans-serif;font-size:10px}.small{fill:var(--muted);font-family:Arial,Helvetica,sans-serif;font-size:9px}.caption{fill:var(--secondary);font-family:Arial,Helvetica,sans-serif;font-size:11px}.num{fill:var(--ink);font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;font-variant-numeric:tabular-nums}.grid{stroke:var(--grid);stroke-width:1;shape-rendering:crispEdges}.axis{stroke:var(--axis);stroke-width:1;shape-rendering:crispEdges}.row:focus{outline:2px solid var(--ink);outline-offset:2px}
  </style>`;
}

function statusLabel(status, language) {
  return COPY[language].statuses[status];
}

function dependencyLabel(task, copy) {
  return /^`?none`?\.?$/i.test(task.dependency.trim()) ? copy.none : task.dependency;
}

function statusIcon(x, y, status) {
  if (status === 'verified')
    return `<circle cx="${x}" cy="${y}" r="6" fill="var(--surface)" stroke="var(--axis)"/><path d="M${x - 3} ${y} L${x - 1} ${y + 2} L${x + 4} ${y - 3}" fill="none" stroke="var(--ink)" stroke-width="1.1" stroke-linecap="round"/>`;
  return `<circle cx="${x}" cy="${y}" r="5" fill="${STATUS_COLORS[status]}"/>`;
}

function renderChartTextLines(className, x, y, lines, lineHeight) {
  if (lines.length === 1)
    return `<text class="${className}" x="${x}" y="${y}">${escapeXml(lines[0])}</text>`;
  return `<text class="${className}" x="${x}" y="${y}">${lines.map((line, lineIndex) => `<tspan x="${x}" dy="${lineIndex ? lineHeight : 0}">${escapeXml(line)}</tspan>`).join('')}</text>`;
}

function svgDocument(title, desc, body, height, metadata, planningComplete = false) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="${height}" viewBox="0 0 1600 ${height}" role="img" aria-labelledby="chart-title chart-desc">
  <title id="chart-title">${escapeXml(title)}</title>
  <desc id="chart-desc">${escapeXml(desc)}</desc>
  <metadata>${escapeXml(metadata)}</metadata>
  ${style(planningComplete)}
  ${body}
</svg>
`;
}

export function renderGantt(model, suiteName) {
  const { copy: t, tasks, reviewed, language } = model;
  const phaseX = 72;
  const wbsX = 265;
  const workX = 405;
  const dependencyX = 680;
  const statusX = 900;
  const plotX = 980;
  const plotW = 520;
  const rowY = 270;
  const rowH = 34;
  const phaseLineH = 12;
  const workMaxWidth = dependencyX - workX - 10;
  const dependencyMaxWidth = statusX - dependencyX - 12;
  let nextY = rowY;
  const layout = tasks.map((task, index) => {
    const phaseStart = index === 0 || tasks[index - 1].phase.number !== task.phase.number;
    const descriptionLines = phaseStart ? wrapChartText(task.phase.title, 30) : [];
    const workLines = wrapChartText(task.title, workMaxWidth, value => chartTextWidth(value, 10));
    const dependencyLines = wrapChartText(dependencyLabel(task, t), dependencyMaxWidth, value =>
      chartTextWidth(value, 9),
    );
    const statusLines = wrapChartText(
      statusLabel(task.status, language),
      plotX - statusX - 27,
      value => chartTextWidth(value, 9),
    );
    const contentLines = Math.max(workLines.length, dependencyLines.length, statusLines.length);
    const taskRowH = Math.max(rowH, contentLines * phaseLineH + 22);
    const phaseLabelY = phaseStart ? nextY : undefined;
    const y = phaseStart ? nextY + 23 + descriptionLines.length * phaseLineH : nextY;
    const separatorY = y + Math.max(14, contentLines * phaseLineH + 2);
    nextY = y + taskRowH;
    return {
      task,
      index,
      y,
      separatorY,
      phaseLabelY,
      descriptionLines,
      workLines,
      dependencyLines,
      statusLines,
    };
  });
  const contentBottom = layout.at(-1)?.separatorY ?? rowY;
  const footerY = Math.max(772, contentBottom + 80);
  const height = Math.max(850, footerY + 78);
  const rows = layout
    .map(
      ({
        task,
        index,
        y,
        separatorY,
        phaseLabelY,
        descriptionLines,
        workLines,
        dependencyLines,
        statusLines,
      }) => {
        const barX = plotX + (index / Math.max(tasks.length, 1)) * (plotW - 90);
        const barW = task.status === 'verified' ? 58 : 42;
        const phaseHeader =
          phaseLabelY === undefined
            ? ''
            : `<text class="phase" x="${phaseX}" y="${phaseLabelY}">${escapeXml(`${t.phase} ${task.phase.number}`)}</text>${descriptionLines.map((line, lineIndex) => `<text class="small" x="${phaseX}" y="${phaseLabelY + 13 + lineIndex * phaseLineH}">${escapeXml(line)}</text>`).join('')}`;
        const dependencyText = renderChartTextLines(
          'small',
          dependencyX,
          y,
          dependencyLines,
          phaseLineH,
        );
        return `<g class="row" tabindex="0" aria-label="${escapeXml(`${task.id}: ${task.title}; ${t.dependency}: ${dependencyLabel(task, t)}; ${statusLabel(task.status, language)}`)}"><title>${escapeXml(`${task.id}: ${task.title}; ${t.dependency}: ${dependencyLabel(task, t)}; ${statusLabel(task.status, language)}`)}</title><line class="grid" x1="72" y1="${separatorY}" x2="1500" y2="${separatorY}"/>${phaseHeader}<text class="num" x="${wbsX}" y="${y}">${escapeXml(task.id)}</text>${renderChartTextLines('task', workX, y, workLines, phaseLineH)}${dependencyText}${statusIcon(statusX + 5, y - 4, task.status)}${renderChartTextLines('small', statusX + 17, y, statusLines, phaseLineH)}<rect x="${barX.toFixed(1)}" y="${y - 15}" width="${barW}" height="18" rx="4" fill="${STATUS_COLORS[task.status]}"/></g>`;
      },
    )
    .join('\n');
  const completed = new Set(
    tasks.filter(task => isPrerequisiteSatisfied(task, task.status)).map(task => task.id),
  );
  const nextTask = tasks.find(
    task =>
      task.status !== 'planning-complete' &&
      task.status !== 'verified' &&
      task.status !== 'deferred' &&
      task.status !== 'waived' &&
      task.status !== 'blocked' &&
      model.expandedEdges.get(task.id).every(id => completed.has(id)),
  );
  const nextLabel = nextTask
    ? `${nextTask.id}: ${nextTask.title}`
    : model.verified === model.activeTasks.length
      ? t.noReady
      : t.noNext;
  const body = `<rect class="canvas" width="1600" height="${height}"/><rect class="card" x="32" y="28" width="1536" height="${height - 56}" rx="14"/>
  <text class="title" x="72" y="84">${escapeXml(`${suiteName} ${t.ganttTitle}`)}</text><text class="subtitle" x="72" y="110">${escapeXml(t.ganttSubtitle)}</text><text class="small" x="1500" y="84" text-anchor="end">${escapeXml(`${t.reviewed}: ${reviewed}`)}</text>
  <rect x="72" y="142" width="1428" height="78" rx="8" fill="var(--aqua-wash)"/><text class="heading" x="96" y="171">${escapeXml(t.current)}</text><text class="caption" x="96" y="195">${escapeXml(nextLabel)}</text><text class="heading" x="1320" y="171" text-anchor="end">${escapeXml(t.next)}</text><text class="heading" x="1320" y="195" text-anchor="end">${model.verified} / ${model.activeTasks.length} ${escapeXml(t.verified)}</text>
  <text class="small" x="${phaseX}" y="246">${escapeXml(t.phase)}</text><text class="small" x="${wbsX}" y="246">${escapeXml(t.wbs)}</text><text class="small" x="${workX}" y="246">${escapeXml(t.work)}</text><text class="small" x="${dependencyX}" y="246">${escapeXml(t.dependency)}</text><text class="small" x="${statusX}" y="246">${escapeXml(t.status)}</text><text class="small" x="${plotX}" y="246">${escapeXml(t.weeks)}</text><line class="axis" x1="${plotX}" y1="254" x2="1500" y2="254"/>
  ${rows}
  <line class="grid" x1="72" y1="${footerY}" x2="1500" y2="${footerY}"/><text class="small" x="72" y="${footerY + 28}">${escapeXml(`${t.source}: pdp-wbs.md · test-plan.md · progress.md (${t.reviewed}: ${reviewed})`)}</text><text class="small" x="1500" y="${footerY + 28}" text-anchor="end">${escapeXml(t.chartCaveat)}</text><text class="small" x="72" y="${footerY + 48}">${escapeXml(t.candidateCaveat)}</text>`;
  return svgDocument(
    `${suiteName} ${t.ganttTitle}`,
    `${t.ganttTitle}. ${t.ganttDescription(tasks.length, reviewed)} ${t.chartCaveat} ${t.candidateCaveat}`,
    body,
    height,
    t.metadata,
    tasks.some(task => task.status === 'planning-complete'),
  );
}

export function renderBurndown(model, suiteName) {
  const { copy: t, phases, activeTasks, deferredTasks, verified, reviewed, language } = model;
  const total = activeTasks.length;
  const remaining = total - verified;
  const phaseBottom = 836 + Math.max(0, phases.length - 1) * 28;
  const footerY = Math.max(976, phaseBottom + 50);
  const height = footerY + 74;
  const x0 = 190;
  const x1 = 910;
  const y0 = 410;
  const y1 = 650;
  const completion = total ? verified / total : 0;
  const currentX = x0 + completion * (x1 - x0);
  const currentY = y0 + completion * (y1 - y0);
  const currentMarker =
    remaining === 0 && total > 0
      ? `<circle cx="${currentX.toFixed(1)}" cy="${currentY.toFixed(1)}" r="14" fill="var(--aqua)" stroke="var(--surface)" stroke-width="3"/><path d="M${(currentX - 6).toFixed(1)} ${currentY.toFixed(1)} L${(currentX - 2).toFixed(1)} ${(currentY + 4).toFixed(1)} L${(currentX + 6).toFixed(1)} ${(currentY - 5).toFixed(1)}" fill="none" stroke="var(--surface)" stroke-width="1.8" stroke-linecap="round"/>`
      : `<circle cx="${currentX.toFixed(1)}" cy="${currentY.toFixed(1)}" r="8" fill="var(--orange)" stroke="var(--surface)" stroke-width="2"/>`;
  const phaseRows = phases
    .map((phase, index) => {
      const phaseTasks = phase.tasks.filter(task => !task.deferred && task.status !== 'deferred');
      const phaseVerified = phaseTasks.filter(task => task.status === 'verified').length;
      const y = 832 + index * 28;
      const width = phaseTasks.length ? (phaseVerified / phaseTasks.length) * 210 : 0;
      return `<g class="row" tabindex="0" aria-label="${escapeXml(t.phaseSummary(phase.number, phaseVerified, phaseTasks.length))}"><title>${escapeXml(`${t.phaseSummary(phase.number, phaseVerified, phaseTasks.length)} · ${phase.title}`)}</title><text class="task" x="96" y="${y}">${escapeXml(`${t.phase} ${phase.number} · ${phase.title}`)}</text><text class="num" x="730" y="${y}" text-anchor="end">${phaseVerified} / ${phaseTasks.length}</text><text class="num" x="850" y="${y}" text-anchor="end">${phaseTasks.length - phaseVerified}</text><rect x="930" y="${y - 11}" width="210" height="12" rx="6" fill="var(--blue-wash)"/><rect x="930" y="${y - 11}" width="${width}" height="12" rx="6" fill="var(--aqua)"/>${statusIcon(1215, y - 5, phaseVerified === phaseTasks.length ? 'verified' : 'in-progress')}<text class="small" x="1228" y="${y}">${escapeXml(phaseVerified === phaseTasks.length ? statusLabel('verified', language) : `${phaseVerified}/${phaseTasks.length}`)}</text></g>`;
    })
    .join('\n');
  let explanationY = 412;
  const explanation = [t.formula, t.noHistory, t.caveat, t.chartCaveat]
    .map(value => {
      const lines = wrapChartText(value, 370, text => chartTextWidth(text, 11));
      const text = renderChartTextLines('caption', 1070, explanationY, lines, 18);
      explanationY += lines.length * 18 + 18;
      return text;
    })
    .join('');
  const body = `<rect class="canvas" width="1600" height="${height}"/><rect class="card" x="32" y="28" width="1536" height="${height - 56}" rx="14"/>
  <text class="title" x="72" y="84">${escapeXml(`${suiteName} ${t.burndownTitle}`)}</text><text class="subtitle" x="72" y="110">${escapeXml(t.burndownSubtitle)}</text><text class="small" x="1500" y="84" text-anchor="end">${escapeXml(`${t.reviewed}: ${reviewed}`)}</text>
  <rect x="72" y="142" width="1428" height="116" rx="8" fill="var(--aqua-wash)"/><text class="heading" x="96" y="170">${escapeXml(t.current)}</text><text x="96" y="231" class="title" style="font-size:52px">${remaining}</text><text class="heading" x="155" y="215">${escapeXml(t.remaining)}</text><text class="caption" x="155" y="237">${escapeXml(`${verified} / ${total} ${t.verified}`)}</text><text class="caption" x="700" y="205">${escapeXml(t.approved)}</text><text class="heading" x="700" y="230">${total}</text><text class="caption" x="1030" y="205">${escapeXml(t.deferred)}</text><text class="heading" x="1030" y="230">${deferredTasks.length}</text>
  <text class="heading" x="72" y="300">${escapeXml(t.scopeReference)}</text><text class="caption" x="72" y="321">${escapeXml(t.noHistory)}</text><rect class="card" x="72" y="340" width="940" height="390" rx="9"/><text class="small" x="116" y="372">${escapeXml(t.remainingAxis)}</text><text class="small" x="550" y="704" text-anchor="middle">${escapeXml(t.notTime)}</text>
  <g class="grid"><line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}"/><line x1="${x0}" y1="${y0 + 80}" x2="${x1}" y2="${y0 + 80}"/><line x1="${x0}" y1="${y0 + 160}" x2="${x1}" y2="${y0 + 160}"/><line x1="${x0}" y1="${y1}" x2="${x1}" y2="${y1}"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1}"/><line x1="${x1}" y1="${y0}" x2="${x1}" y2="${y1}"/></g><line class="axis" x1="${x0}" y1="${y1}" x2="${x1}" y2="${y1}"/><line class="axis" x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1}"/>
  <line x1="${x0}" y1="${y0}" x2="${currentX.toFixed(1)}" y2="${currentY.toFixed(1)}" stroke="var(--blue)" stroke-width="2"/><line x1="${currentX.toFixed(1)}" y1="${currentY.toFixed(1)}" x2="${x1}" y2="${y1}" stroke="var(--blue)" stroke-width="2" stroke-dasharray="6 5"/><circle cx="${x0}" cy="${y0}" r="7" fill="var(--blue)" stroke="var(--surface)" stroke-width="2"/><text class="heading" x="${x0 + 22}" y="${y0 + 18}">${escapeXml(t.logicalBaseline)}</text><text class="caption" x="${x0 + 22}" y="${y0 + 37}">${total} ${escapeXml(t.remainingShort)}</text>${currentMarker}<text class="heading" x="${Math.max(x0 + 150, currentX - 22)}" y="${Math.max(y0 + 60, currentY - 49)}" text-anchor="end">${escapeXml(t.currentSnapshot)}</text><text class="caption" x="${Math.max(x0 + 150, currentX - 22)}" y="${Math.max(y0 + 79, currentY - 30)}" text-anchor="end">${escapeXml(`${remaining} ${t.remainingShort} · ${verified} ${t.verified}`)}</text>
  <rect x="1040" y="340" width="460" height="390" rx="9" fill="var(--blue-wash)"/><text class="heading" x="1070" y="378">${escapeXml(t.howRead)}</text>${explanation}
  <rect class="card" x="72" y="758" width="1428" height="${phaseBottom + 24 - 758}" rx="9"/><text class="heading" x="96" y="786">${escapeXml(t.phaseScope)}</text><text class="small" x="96" y="800">${escapeXml(`${t.active}: ${total}; ${t.verified}: ${verified}; ${t.remaining}: ${remaining}`)}</text><text class="small" x="730" y="786" text-anchor="end">${escapeXml(t.verified)}</text><text class="small" x="850" y="786" text-anchor="end">${escapeXml(t.remaining)}</text><text class="small" x="930" y="786">${escapeXml(t.completion)}</text>${phaseRows}
  <line class="grid" x1="72" y1="${height - 74}" x2="1500" y2="${height - 74}"/><text class="small" x="72" y="${height - 48}">${escapeXml(`${t.source}: pdp-wbs.md · progress.md (${t.reviewed}: ${reviewed})`)}</text><text class="small" x="1500" y="${height - 48}" text-anchor="end">${escapeXml(t.caveat)}</text>`;
  return svgDocument(
    `${suiteName} ${t.burndownTitle}`,
    `${t.burndownTitle}. ${t.burndownDescription(total, verified, remaining)} ${t.noHistory}`,
    body,
    height,
    t.metadata,
  );
}

function suiteNameFromReadme(readme, fallback) {
  for (const { text: line } of markdownLines(readme)) {
    if (!line.startsWith('# ') || line.startsWith('## ')) continue;
    let title = line.slice(2).trim();
    for (const suffix of ['Internal Planning', '内部规划']) {
      if (title.endsWith(suffix)) {
        title = title.slice(0, -suffix.length).trimEnd();
      }
    }
    return title || fallback;
  }
  return fallback;
}

export async function generateCharts(directory, { check = false } = {}) {
  const root = resolve(directory);
  const [readme, wbs, progress, testPlan] = await Promise.all(
    ['README.md', 'pdp-wbs.md', 'progress.md', 'test-plan.md'].map(name =>
      readFile(resolve(root, name), 'utf8'),
    ),
  );
  const model = createChartModel({ readme, wbs, progress, testPlan });
  const suiteName = suiteNameFromReadme(readme, basename(root));
  const artifacts = new Map([
    ['implementation-gantt.svg', renderGantt(model, suiteName)],
    ['implementation-burndown.svg', renderBurndown(model, suiteName)],
  ]);
  const stale = [];
  for (const [name, content] of artifacts) {
    const path = resolve(root, name);
    let current;
    try {
      current = await readFile(path, 'utf8');
    } catch {
      current = undefined;
    }
    if (current !== content) stale.push(name);
    if (!check && current !== content) await writeFile(path, content);
  }
  if (check && stale.length) {
    throw new Error(
      `Derived implementation charts are stale: ${stale.join(', ')}. Run \`npm run spec:charts -- ${basename(root)}\`.`,
    );
  }
  return { model, artifacts, stale };
}

async function main() {
  const args = process.argv.slice(2);
  const check = args.includes('--check');
  const target = args.find(arg => !arg.startsWith('--'));
  if (!target) {
    throw new Error(
      'Usage: generate-implementation-charts.mjs [--check] <repo-specs/<suite>|<suite>.',
    );
  }
  const directory = target.includes('/') ? target : `repo-specs/${target}`;
  const result = await generateCharts(directory, { check });
  const mode = check ? 'checked' : 'generated';
  process.stdout.write(
    `${mode} implementation-gantt.svg and implementation-burndown.svg for ${directory} (${result.model.language}; ${result.model.verified}/${result.model.activeTasks.length} verified).\n`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error(`spec chart generation failed: ${error.message}`);
    process.exitCode = 1;
  });
}
