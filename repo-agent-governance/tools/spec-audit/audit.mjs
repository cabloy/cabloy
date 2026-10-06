import { access, readFile, readdir } from 'node:fs/promises';
import { dirname, extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  findIdentifiers,
  isPlanningCompleteEligible,
  isPrerequisiteSatisfied,
  markdownLines,
  parseDefinitions,
  parseProgress,
  parseWbs,
} from '../spec-charts/spec-parser.mjs';

const OWNERS = new Map([
  ['PRD-', 'prd.md'],
  ['SRS-', 'srs.md'],
  ['WBS-', 'pdp-wbs.md'],
  ['ATP-', 'test-plan.md'],
]);
const CORE = ['README.md', ...OWNERS.values(), 'progress.md'];
const LIMITS =
  'Static structure only; approval, semantic sufficiency, implementation, and evidence authenticity require human review.';

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function planningFiles(directory, prefix = '') {
  const result = [];
  for (const entry of await readdir(resolve(directory, prefix), { withFileTypes: true })) {
    if (entry.name === 'evidence' || entry.name.startsWith('.')) continue;
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) result.push(...(await planningFiles(directory, path)));
    else if (entry.isFile() && entry.name.endsWith('.md')) result.push(path);
  }
  return result.sort();
}

function cells(line) {
  if (!line.trim().startsWith('|')) return null;
  return line
    .trim()
    .replace(/^\||\|$/g, '')
    .split(/(?<!\\)\|/)
    .map(value => value.trim());
}

function exactIds(value, prefix) {
  // Aggregations are summaries, not exact traceability. Do not count their endpoints.
  if (/[*–—]|\b(?:through|to)\b|`\s*-\s*`|\d\s+-\s+(?:`|PRD-|SRS-|WBS-|ATP-)/.test(value))
    return [];
  return findIdentifiers(value, prefix);
}

function mappingGroups(text) {
  return Array.from(OWNERS.keys(), prefix => exactIds(text, prefix));
}

function addMapping(groups, edges, definitions) {
  for (let index = 0; index < groups.length - 1; index++) {
    for (const from of groups[index]) {
      if (!definitions.has(from)) continue;
      for (const to of groups[index + 1]) {
        if (definitions.has(to)) edges.get(from).add(to);
      }
    }
  }
}

function traceabilityException(definition, report, annotatedLines) {
  const fields = markdownLines(definition.body ?? '').flatMap(({ text, line }) =>
    Array.from(text.matchAll(/\bTraceability\s+exception\b/gi), match => ({
      text,
      line,
      start: match.index,
    })),
  );
  if (!fields.length) return null;
  for (const field of fields) {
    const line = definition.line + field.line - (definition.kind === 'WBS' ? 0 : 1);
    annotatedLines.add(`${definition.file}:${line}`);
  }
  const field = fields[0];
  const value =
    definition.kind === 'bullet' && field.line === 1
      ? field.text.slice(field.start).trim()
      : field.text.trim();
  const match = value.match(/^Traceability exception:\s*(technical-only|authority-only)\s+—\s+/i);
  const exception = match?.[1].toLowerCase();
  const rationale = match && value.slice(match[0].length);
  const validOwner =
    (exception === 'technical-only' &&
      definition.id.startsWith('SRS-') &&
      definition.kind === 'bullet' &&
      field.line === 1) ||
    (exception === 'authority-only' && definition.id.startsWith('WBS-'));
  if (fields.length !== 1 || !validOwner || !/[\p{L}\p{N}]/u.test(rationale ?? '')) {
    report(
      'traceability-exception',
      definition.file,
      definition.line + field.line - (definition.kind === 'WBS' ? 0 : 1),
      'Invalid Traceability exception: use one declaration-local technical-only SRS or authority-only WBS field with a rationale.',
      definition.id,
    );
    return null;
  }
  return exception;
}

function collectMappings(records, definitions) {
  const edges = new Map(Array.from(definitions.keys(), id => [id, new Set()]));
  for (const definition of definitions.values()) {
    for (const { text, line } of markdownLines(definition.body ?? '')) {
      const field =
        definition.kind === 'bullet' && line === 1
          ? text.slice(text.search(/\bTraceability\s*:/i))
          : text.trim();
      const match = field.match(/^(?:-\s*)?(?:\*\*)?Traceability(?:\*\*)?\s*:(.*)$/i);
      if (!match) continue;
      const groups = mappingGroups(match[1]);
      const index = [...OWNERS.keys()].findIndex(prefix => definition.id.startsWith(prefix));
      groups[index].push(definition.id);
      addMapping(groups, edges, definitions);
    }
  }
  for (const markdown of records.values()) {
    let columns = null;
    for (const { text } of markdownLines(markdown)) {
      const row = cells(text);
      if (!row) {
        columns = null;
        continue;
      }
      if (row.every(value => /^:?-+:?$/.test(value))) continue;
      const header = Array.from(OWNERS.keys(), prefix =>
        row.findIndex(value =>
          new RegExp(
            `^${prefix.slice(0, -1)}(?:\\s+(?:IDs?|requirements?|contracts?|tasks?|scenarios?))?$`,
            'i',
          ).test(value.replace(/[`*]/g, '').trim()),
        ),
      );
      if (header.every(index => index >= 0)) {
        columns = header;
        continue;
      }
      if (columns) {
        addMapping(
          columns.map((index, kind) => exactIds(row[index] ?? '', [...OWNERS.keys()][kind])),
          edges,
          definitions,
        );
      }
    }
  }
  return edges;
}

function acceptedDecision(markdown) {
  if (!markdown) return false;
  const lines = markdownLines(markdown);
  const statuses = [];
  let section = null;
  for (const [index, { text, heading }] of lines.entries()) {
    if (heading?.level === 2) section = heading.text;
    const field = text.match(/^\s*-\s*\*\*Status:\*\*/i);
    if (field && (section === null || /^Status$/i.test(section)))
      statuses.push(text.slice(field[0].length).trim());
    if (!heading || !/^Status$/i.test(heading.text)) continue;
    const value = lines.slice(index + 1).find(record => {
      if (record.heading && record.heading.level <= heading.level) return true;
      return record.text.trim();
    });
    if (value && !(value.heading && value.heading.level <= heading.level))
      statuses.push(value.text.trim());
  }
  return statuses.length > 0 && statuses.every(status => /^Accepted\.?$/i.test(status));
}

function planningBaselineGates(records, wbs, edges, exceptions, report) {
  const gates = new Set();
  const field = /^\s*(?:-\s*)?(?:\*\*)?Traceability mode(?:\*\*)?\s*:/i;
  const declarations = new Map();
  for (const [file, markdown] of records) {
    for (const { text, line } of markdownLines(markdown)) {
      if (!field.test(text)) continue;
      const task =
        file === 'pdp-wbs.md'
          ? wbs?.tasks.find(candidate => candidate.line < line && candidate.endLine >= line)
          : null;
      if (!task) {
        report(
          'traceability-mode',
          file,
          line,
          'Traceability mode must be declared inside a WBS task.',
        );
        continue;
      }
      if (!declarations.has(task.id)) declarations.set(task.id, []);
      declarations.get(task.id).push({ text, line });
    }
  }
  for (const task of wbs?.tasks ?? []) {
    const declared = declarations.get(task.id);
    if (!declared) continue;
    const [{ text, line }] = declared;
    const mode = text.replace(field, '').trim().replace(/`/g, '');
    const body = markdownLines(task.body).map(record => record.text);
    const deliveryAction =
      /(?:^|[,;]\s*|\b(?:and|then|to)\s+)(?:implement|deploy|migrate|release|regenerate|develop|ship|code|build\b(?!\s+risks?\b)|create|run\s+(?:an?\s+)?(?:migrations?|tests?|ATP-|scenarios?)|execute\s+(?:an?\s+)?(?:ATP-|tests?|scenarios?))\b/i;
    const mixedScope =
      deliveryAction.test(task.title) ||
      body.some(value => {
        const bullet = value.match(/^\s*[-*]\s+(.*)/);
        return bullet && deliveryAction.test(bullet[1].replace(/^\*\*[^*]+\*\*\s*/, ''));
      });
    const hasItems = label =>
      body.some((value, index) => {
        if (value.trim().toLowerCase() !== `${label}:`) return false;
        const next = body.slice(index + 1).find(line => line.trim());
        return Boolean(next?.trim().match(/^[-*] \S/));
      });
    const authorities = body.flatMap(value => {
      const match = value.match(/^\s*(?:-\s*)?(?:\*\*)?Review authority(?:\*\*)?\s*:/i);
      return match ? [value.replace(match[0], '').trim()] : [];
    });
    const authority = authorities[0]?.match(
      /^\[([^\]]+)\]\((\.\/decisions\/[^/()]+\.md)\)(?:\s*\([^\n]*\))?\s*\.?$/,
    );
    const adr = authority?.[2].slice(2);
    const decision = adr && records.get(adr);
    const mappedIncoming = [...edges].some(
      ([id, targets]) => id.startsWith('SRS-') && targets.has(task.id),
    );
    const valid =
      declared.length === 1 &&
      mode === 'planning-baseline-review' &&
      task.phase.number === '10' &&
      /\b(?:review|freeze)\b/i.test(task.title) &&
      /\bbaseline\b/i.test(task.title) &&
      hasItems('tasks') &&
      hasItems('acceptance checks') &&
      !mixedScope &&
      !findIdentifiers(task.title, 'SRS-').length &&
      !findIdentifiers(task.title, 'ATP-').length &&
      !findIdentifiers(task.body, 'SRS-').length &&
      !findIdentifiers(task.body, 'ATP-').length &&
      !mappedIncoming &&
      !edges.get(task.id)?.size &&
      !exceptions.has(task.id) &&
      authorities.length === 1 &&
      acceptedDecision(decision);
    if (!valid) {
      report(
        'traceability-mode',
        'pdp-wbs.md',
        line,
        'Planning-baseline review requires one valid mode, Phase 10 baseline review, substantive review-only Tasks and Acceptance checks, no individual SRS/ATP mapping or other traceability exception, and one accepted local ADR review authority.',
        task.id,
      );
      continue;
    }
    gates.add(task.id);
  }
  return gates;
}

function headingIds(markdown) {
  const slugs = new Set();
  const counts = new Map();
  for (const { heading } of markdownLines(markdown)) {
    if (!heading) continue;
    const explicit = heading.text.match(/\{#([^}]+)\}\s*$/);
    if (explicit) {
      slugs.add(explicit[1]);
      continue;
    }
    const slug = heading.text
      .toLowerCase()
      .replace(/<[^>]*>/g, '')
      .replace(/[^\p{L}\p{N}_\-\s]/gu, '')
      .replace(/\s/g, '-');
    const count = counts.get(slug) ?? 0;
    slugs.add(count ? `${slug}-${count}` : slug);
    counts.set(slug, count + 1);
  }
  return slugs;
}

const LINK_DEFINITION = /^(\s*\[([^\]]+)\]:\s*)(<[^>]+>|\S+)/;
const INLINE_LINK = /(!?\[[^\]]*\]\(\s*)(<[^>]+>|[^\s)]+)((?:\s+["'][^\n]*["'])?\s*\))/g;

function referenceText(text) {
  return text
    .replace(
      LINK_DEFINITION,
      (_, start, _label, destination) => `${start}${' '.repeat(destination.length)}`,
    )
    .replace(
      INLINE_LINK,
      (_, start, destination, end) => `${start}${' '.repeat(destination.length)}${end}`,
    );
}

function markdownLinks(markdown) {
  const lines = markdownLines(markdown);
  const references = new Map();
  const links = [];
  for (const { text, line } of lines) {
    const declaration = text.match(LINK_DEFINITION);
    if (declaration)
      references.set(declaration[2].trim().toLowerCase(), declaration[3].replace(/^<|>$/g, ''));
    for (const match of text.matchAll(INLINE_LINK))
      links.push({ destination: match[2].replace(/^<|>$/g, ''), line });
    const referenced = /!?\[([^\]]+)\]\[([^\]]*)\]/g;
    for (const match of text.matchAll(referenced))
      links.push({ reference: (match[2] || match[1]).trim().toLowerCase(), line });
  }
  return links.map(link =>
    link.reference ? { ...link, destination: references.get(link.reference) } : link,
  );
}

async function checkLinks(directory, records, root, report) {
  const targets = new Map();
  for (const [file, markdown] of records) {
    for (const link of markdownLinks(markdown)) {
      if (link.reference && !link.destination) {
        report(
          'link-reference',
          file,
          link.line,
          `Undefined Markdown link reference: ${link.reference}.`,
        );
        continue;
      }
      const destination = link.destination;
      if (!destination || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(destination)) continue;
      let path;
      let fragment;
      try {
        const hash = destination.indexOf('#');
        path = decodeURIComponent(
          (hash < 0 ? destination : destination.slice(0, hash)).split('?')[0],
        );
        fragment = hash < 0 ? '' : decodeURIComponent(destination.slice(hash + 1));
      } catch {
        report('link-format', file, link.line, `Invalid encoded local link: ${destination}.`);
        continue;
      }
      const target = path
        ? resolve(
            path.startsWith('/') ? root : dirname(resolve(directory, file)),
            path.replace(/^\//, ''),
          )
        : resolve(directory, file);
      if (!(await exists(target))) {
        report('link-target', file, link.line, `Missing local link target: ${destination}.`);
        continue;
      }
      if (!fragment || extname(target) !== '.md') continue;
      if (!targets.has(target)) targets.set(target, headingIds(await readFile(target, 'utf8')));
      if (!targets.get(target).has(fragment)) {
        report(
          'link-fragment',
          file,
          link.line,
          `Missing Markdown heading fragment: ${destination}.`,
        );
      }
    }
  }
}

export async function auditPlanning(
  directory,
  { lightweight = false, root = resolve(directory, '../..') } = {},
) {
  directory = resolve(directory);
  const diagnostics = [];
  const report = (code, file, line, message, id) =>
    diagnostics.push({ code, file, line, ...(id ? { id } : {}), message });
  const records = new Map();
  for (const file of await planningFiles(directory))
    records.set(file, await readFile(resolve(directory, file), 'utf8'));
  if (!lightweight) {
    for (const file of CORE) {
      if (!records.has(file))
        report('missing-record', file, 1, 'Required complete-baseline record is missing.');
    }
    if (![...records.keys()].some(file => /^decisions\/[^/]+\.md$/.test(file)))
      report('missing-adr', 'decisions/', 1, 'A complete baseline requires a suite boundary ADR.');
  }
  const definitions = new Map();
  let wbs;
  for (const [prefix, file] of OWNERS) {
    if (!records.has(file)) continue;
    try {
      let declared;
      if (prefix === 'WBS-') {
        wbs = parseWbs(records.get(file), { file });
        declared = new Map(wbs.tasks.map(task => [task.id, { ...task, file, kind: 'WBS' }]));
      } else {
        declared = parseDefinitions(records.get(file), prefix, { file });
      }
      for (const [id, definition] of declared) definitions.set(id, { ...definition, file });
      if (!lightweight && !declared.size) {
        report(
          'missing-definition',
          file,
          1,
          `No formal ${prefix.slice(0, -1)} definitions found.`,
        );
      }
    } catch (error) {
      report('declaration', file, 1, error.message);
    }
  }
  const exceptions = new Map();
  const annotatedLines = new Set();
  for (const definition of definitions.values()) {
    const exception = traceabilityException(definition, report, annotatedLines);
    if (exception) exceptions.set(definition.id, exception);
  }
  for (const [file, markdown] of records) {
    for (const { text, line } of markdownLines(markdown)) {
      if (/\bTraceability\s+exception\b/i.test(text) && !annotatedLines.has(`${file}:${line}`)) {
        report(
          'traceability-exception',
          file,
          line,
          'Traceability exception must be in its own formal declaration.',
        );
      }
      for (const prefix of OWNERS.keys()) {
        for (const id of findIdentifiers(referenceText(text), prefix)) {
          if (!definitions.has(id)) {
            report(
              'undefined-reference',
              file,
              line,
              `No unique formal definition in ${OWNERS.get(prefix)}.`,
              id,
            );
          }
        }
      }
    }
  }
  if (wbs) {
    const progress = records.get('progress.md');
    if (progress !== undefined) {
      try {
        const { rows, locations } = parseProgress(progress, { file: 'progress.md' });
        for (const task of wbs.tasks) {
          if (!rows.has(task.id)) {
            report('missing-progress', 'progress.md', 1, 'WBS task has no progress row.', task.id);
          } else if (
            (task.status || task.deferred) &&
            rows.get(task.id) !== (task.status ?? 'deferred')
          ) {
            report(
              'status-conflict',
              'progress.md',
              locations?.get(task.id)?.line ?? 1,
              `Progress contradicts explicit WBS status ${task.status ?? 'deferred'}.`,
              task.id,
            );
          }
          if (rows.get(task.id) === 'planning-complete' && !isPlanningCompleteEligible(task)) {
            report(
              'completion-mode',
              'progress.md',
              locations?.get(task.id)?.line ?? 1,
              'Planning-complete requires a declaration-local Completion mode: planning-only field.',
              task.id,
            );
          }
          if (
            ['planning-complete', 'implementation-complete', 'verified'].includes(rows.get(task.id))
          ) {
            for (const dependency of task.dependencyIds) {
              const predecessor = wbs.tasks.find(item => item.id === dependency);
              if (
                rows.has(dependency) &&
                !isPrerequisiteSatisfied(predecessor, rows.get(dependency))
              ) {
                report(
                  'dependency-state',
                  'progress.md',
                  locations?.get(task.id)?.line ?? 1,
                  `Completed task still has an unfinished recorded prerequisite: ${dependency}.`,
                  task.id,
                );
              }
            }
          }
        }
        for (const id of rows.keys()) {
          if (!definitions.has(id)) {
            report(
              'unknown-progress',
              'progress.md',
              locations?.get(id)?.line ?? 1,
              'Progress row has no WBS definition.',
              id,
            );
          }
        }
      } catch (error) {
        report('progress', 'progress.md', 1, error.message);
      }
    }
  } else if (records.has('progress.md') && !records.has('pdp-wbs.md')) {
    report('missing-owner', 'progress.md', 1, 'A progress register requires pdp-wbs.md.');
  }
  if (!lightweight) {
    const edges = collectMappings(records, definitions);
    const gates = planningBaselineGates(records, wbs, edges, exceptions, report);
    const incoming = new Set([...edges.values()].flatMap(values => [...values]));
    for (const [id, definition] of definitions) {
      if (definition.status === 'deferred' || definition.deferred || gates.has(id)) continue;
      if (!id.startsWith('PRD-') && !incoming.has(id) && exceptions.get(id) !== 'technical-only') {
        report(
          'traceability-incoming',
          definition.file,
          definition.line,
          'No explicit exact-ID mapping from the preceding authority kind.',
          id,
        );
      }
      if (
        !id.startsWith('ATP-') &&
        !edges.get(id).size &&
        exceptions.get(id) !== 'authority-only'
      ) {
        report(
          'traceability-outgoing',
          definition.file,
          definition.line,
          'No explicit exact-ID mapping to the next authority kind.',
          id,
        );
      }
    }
  }
  await checkLinks(directory, records, resolve(root), report);
  diagnostics.sort(
    (a, b) =>
      a.file.localeCompare(b.file, 'en') ||
      a.line - b.line ||
      a.code.localeCompare(b.code, 'en') ||
      (a.id ?? '').localeCompare(b.id ?? '', 'en'),
  );
  return {
    mode: lightweight ? 'lightweight' : 'complete',
    ok: diagnostics.length === 0,
    files: records.size,
    definitions: definitions.size,
    coverage: lightweight
      ? 'Present owners, exact references, progress, and local links; full-chain coverage not checked.'
      : 'Complete-baseline structure and explicit exact-ID chain.',
    omittedRecords: CORE.filter(file => !records.has(file)),
    diagnostics,
    limitations: LIMITS,
  };
}

async function main(args) {
  let target;
  let lightweight = false;
  let format = 'text';
  for (let index = 0; index < args.length; index++) {
    const value = args[index];
    if (value === '--lightweight') {
      lightweight = true;
    } else if (value === '--format' && ['text', 'json'].includes(args[index + 1])) {
      format = args[++index];
    } else if (!value.startsWith('-') && !target) {
      target = value;
    } else {
      throw new Error(
        `Unknown argument: ${value}. Usage: spec:check <suite-or-directory> [--lightweight] [--format text|json]`,
      );
    }
  }
  if (!target)
    throw new Error('Usage: spec:check <suite-or-directory> [--lightweight] [--format text|json]');
  const root = process.cwd();
  const directory = (await exists(resolve(root, target)))
    ? resolve(root, target)
    : resolve(root, 'repo-specs', target);
  const result = await auditPlanning(directory, { lightweight, root });
  if (format === 'json') {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } else {
    process.stdout.write(
      `${relative(root, directory)}: ${result.mode} planning structure ${result.ok ? 'passed' : 'failed'} (${result.definitions} definitions).\n`,
    );
    for (const diagnostic of result.diagnostics) {
      process.stdout.write(
        `${diagnostic.file}:${diagnostic.line} [${diagnostic.code}]${diagnostic.id ? ` ${diagnostic.id}` : ''} ${diagnostic.message}\n`,
      );
    }
    process.stdout.write(`${result.coverage}\n`);
    if (result.omittedRecords.length)
      process.stdout.write(`Absent core records: ${result.omittedRecords.join(', ')}.\n`);
    process.stdout.write(`${result.limitations}\n`);
  }
  if (!result.ok) process.exitCode = 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch(error => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
