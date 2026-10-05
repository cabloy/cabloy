// Shared formal planning-record parsers. Source locations use one-based Markdown lines.
export const STATUS_ORDER = [
  'not-started',
  'in-progress',
  'implementation-complete',
  'verified',
  'blocked',
  'waived',
  'deferred',
];

function isAsciiLetter(character) {
  if (!character || character.length !== 1) return false;
  const codePoint = character.codePointAt(0);
  return (codePoint >= 0x41 && codePoint <= 0x5a) || (codePoint >= 0x61 && codePoint <= 0x7a);
}

function isAsciiDigit(character) {
  if (!character || character.length !== 1) return false;
  const codePoint = character.codePointAt(0);
  return codePoint >= 0x30 && codePoint <= 0x39;
}

function isAsciiIdentifierCharacter(character) {
  return isAsciiLetter(character) || isAsciiDigit(character);
}

function isAsciiWordCharacter(character) {
  return isAsciiIdentifierCharacter(character) || character === '_';
}

function isTokenStart(value, index) {
  return index === 0 || !isAsciiWordCharacter(value[index - 1]);
}

function readIdentifier(value, index, prefix, { wildcard = false } = {}) {
  if (!value.startsWith(prefix, index) || !isTokenStart(value, index)) return null;
  let cursor = index + prefix.length;
  let segmentStart = cursor;
  while (isAsciiIdentifierCharacter(value[cursor])) cursor++;
  if (cursor === segmentStart) return null;
  while (value[cursor] === '-') {
    if (wildcard && value[cursor + 1] === '*') {
      return { start: index, end: cursor + 2, value: value.slice(index, cursor + 2) };
    }
    const hyphen = cursor;
    segmentStart = ++cursor;
    while (isAsciiIdentifierCharacter(value[cursor])) cursor++;
    if (cursor === segmentStart) {
      return { start: index, end: hyphen, value: value.slice(index, hyphen) };
    }
  }
  return { start: index, end: cursor, value: value.slice(index, cursor) };
}

function findIdentifierMatches(value, prefix, options) {
  const identifiers = [];
  let index = 0;
  while (index < value.length) {
    const found = value.indexOf(prefix, index);
    if (found === -1) break;
    const identifier = readIdentifier(value, found, prefix, options);
    if (
      identifier &&
      !isAsciiWordCharacter(value[identifier.end]) &&
      value[identifier.end] !== '-'
    ) {
      identifiers.push(identifier);
      index = identifier.end;
    } else {
      index = found + prefix.length;
    }
  }
  return identifiers;
}

export function findIdentifiers(value, prefix, options) {
  return findIdentifierMatches(value, prefix, options).map(identifier => identifier.value);
}

export function markdownLines(markdown) {
  const lines = [];
  let fence = null;
  let comment = false;
  for (const [index, raw] of markdown.split(/\r?\n/).entries()) {
    if (fence) {
      const close = raw.match(/^ {0,3}(`+|~+)\s*$/);
      if (close && close[1][0] === fence.character && close[1].length >= fence.length) fence = null;
      continue;
    }
    let text = '';
    let cursor = 0;
    while (cursor < raw.length) {
      if (comment) {
        const end = raw.indexOf('-->', cursor);
        if (end === -1) break;
        cursor = end + 3;
        comment = false;
      } else {
        const start = raw.indexOf('<!--', cursor);
        if (start === -1) {
          text += raw.slice(cursor);
          break;
        }
        text += `${raw.slice(cursor, start)} `;
        cursor = start + 4;
        comment = true;
      }
    }
    const open = text.match(/^ {0,3}(`{3,}|~{3,})/);
    if (open && !(open[1][0] === '`' && text.slice(open[0].length).includes('`'))) {
      fence = { character: open[1][0], length: open[1].length };
      continue;
    }
    const heading = text.match(/^ {0,3}(#{1,6})[ \t]/);
    let headingText = heading ? text.slice(heading[0].length).trim() : '';
    if (headingText.endsWith('#')) headingText = headingText.replace(/#+$/, '').trimEnd();
    lines.push({
      text,
      line: index + 1,
      heading: heading && headingText ? { level: heading[1].length, text: headingText } : null,
    });
  }
  return lines;
}

function location(record, file) {
  return { line: record.line, ...(file ? { file } : {}) };
}

function atLocation(record, file) {
  return `${file ?? 'Markdown'}:${record.line}`;
}

function parseTableRow(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith('|') || !trimmed.endsWith('|')) return null;
  const cells = trimmed
    .split('|')
    .slice(1, -1)
    .map(cell => cell.trim());
  return cells;
}

function isTableDivider(cells) {
  return cells.length > 0 && cells.every(cell => /^:?-+:?$/.test(cell.replace(/\s/g, '')));
}

function strictIdentifier(value, prefix) {
  const unwrapped = value.trim().replace(/^(`|\*\*)(.*?)\1$/, '$2');
  const identifier = readIdentifier(unwrapped, 0, prefix);
  return identifier?.end === unwrapped.length ? identifier.value : null;
}

function leadingDefinition(value, prefix) {
  let token;
  let end;
  const delimiter = value.startsWith('**') ? '**' : value.startsWith('`') ? '`' : null;
  if (delimiter) {
    const close = value.indexOf(delimiter, delimiter.length);
    if (close === -1) return null;
    token = value.slice(delimiter.length, close);
    end = close + delimiter.length;
  } else {
    token = value.match(/^[^\s:：]+/)?.[0];
    if (!token) return null;
    end = token.length;
  }
  const id = strictIdentifier(token, prefix);
  const tail = value.slice(end);
  if (!id || (tail && !/^[\s:：]/.test(tail))) return null;
  return { id, tail };
}

function scenarioSection(title) {
  return (
    /^(?:acceptance\s+)?scenarios?(?:\s+(?:catalogue|catalog))?$/i.test(title) ||
    /^(?:验收|接受)?(?:测试)?场景(?:目录|清单)?$/.test(title)
  );
}

function catalogueColumns(cells) {
  const labels = cells.map(cell => cell.replace(/[`*]/g, '').toLowerCase().trim());
  const id = labels.findIndex(
    label => /^(?:atp\s+)?id$/.test(label) || /^(?:atp\s*)?编号$/.test(label),
  );
  const scenario = labels.findIndex(
    label =>
      /^(?:acceptance\s+)?(?:scenario|procedure)\b/.test(label) || /^(?:验收)?场景/.test(label),
  );
  return id !== -1 && scenario !== -1 && id !== scenario ? { id, scenario } : null;
}

export function parseDefinitions(markdown, prefix, { file } = {}) {
  const definitions = new Map();
  const atp = prefix === 'ATP-';
  let scenarioLevel = null;
  let columns = null;
  const add = (id, record, kind) => {
    if (definitions.has(id)) {
      throw new Error(
        `Duplicate ${id} definition at ${atLocation(record, file)} (first at line ${definitions.get(id).line}).`,
      );
    }
    definitions.set(id, { id, ...location(record, file), kind });
  };
  for (const record of markdownLines(markdown)) {
    const { text, heading } = record;
    if (heading) {
      columns = null;
      if (scenarioLevel !== null && heading.level <= scenarioLevel) scenarioLevel = null;
      if (scenarioSection(heading.text)) scenarioLevel = heading.level;
      const definition = leadingDefinition(heading.text, prefix);
      if (definition) {
        const beforeTitle = definition.tail.split(/[:：]/, 1)[0];
        const additionalDefinitions = [
          ...definition.tail.matchAll(/(?:^|\s)(`?[^\s:：`]+`?)\s*[:：]/g),
        ].some(match => strictIdentifier(match[1], prefix));
        if (findIdentifiers(beforeTitle, prefix).length || additionalDefinitions) {
          throw new Error(
            `Multiple ${prefix} IDs in one definition at ${atLocation(record, file)}.`,
          );
        }
        add(definition.id, record, 'heading');
      }
      continue;
    }
    const bullet = text.match(/^\s*[-+*]\s+\*\*([^*]*)\*\*(.*)$/);
    if (bullet && (!atp || scenarioLevel !== null)) {
      const id = strictIdentifier(bullet[1], prefix);
      const ids = findIdentifiers(bullet[1], prefix);
      const otherBoldDefinitions = [...bullet[2].matchAll(/\*\*(.*?)\*\*\s*[:：]/g)].some(match =>
        strictIdentifier(match[1], prefix),
      );
      if (
        ids.length > 1 ||
        (id &&
          (otherBoldDefinitions || /\*\*`?(?:PRD-|SRS-|ATP-)/.test(bullet[2].split(/[:：]/, 1)[0])))
      ) {
        throw new Error(`Multiple ${prefix} IDs in one definition at ${atLocation(record, file)}.`);
      }
      if (id) add(id, record, 'bullet');
    }
    if (!atp) continue;
    const cells = parseTableRow(text);
    if (!cells) {
      if (text.trim()) columns = null;
      continue;
    }
    if (isTableDivider(cells)) continue;
    const header = catalogueColumns(cells);
    if (header) {
      columns = scenarioLevel !== null ? header : null;
      continue;
    }
    if (!columns || scenarioLevel === null) continue;
    const cell = cells[columns.id] ?? '';
    const ids = findIdentifiers(cell, prefix);
    if (ids.length > 1)
      throw new Error(`Multiple ATP IDs in one catalogue row at ${atLocation(record, file)}.`);
    const id = strictIdentifier(cell, prefix);
    if (id) add(id, record, 'catalogue');
  }
  const records = markdownLines(markdown);
  const definitionLines = new Set(Array.from(definitions.values(), definition => definition.line));
  for (const definition of definitions.values()) {
    const start = records.findIndex(record => record.line === definition.line);
    const ownHeading = records[start].heading;
    let end = start + 1;
    if (definition.kind !== 'catalogue') {
      while (end < records.length) {
        const record = records[end];
        const formalBullet = record.text.match(/^\s*[-+*]\s+\*\*(.*?)\*\*/);
        const anotherDefinition = ['PRD-', 'SRS-', 'ATP-'].some(
          otherPrefix =>
            (record.heading && leadingDefinition(record.heading.text, otherPrefix)) ||
            (formalBullet && strictIdentifier(formalBullet[1], otherPrefix)),
        );
        if (
          definitionLines.has(record.line) ||
          anotherDefinition ||
          (record.heading && (!ownHeading || record.heading.level <= ownHeading.level))
        ) {
          break;
        }
        end++;
      }
    }
    definition.body = records
      .slice(start, end)
      .map(record => record.text)
      .join('\n');
    definition.endLine = records[end - 1]?.line ?? definition.line;
  }
  return definitions;
}

export function parseAtpIds(markdown, options) {
  return new Set(parseDefinitions(markdown, 'ATP-', options).keys());
}

function normalizeStatus(value) {
  const normalized = value.trim().replace(/`/g, '').replace(/\.$/, '').toLowerCase();
  if (!STATUS_ORDER.includes(normalized))
    throw new Error(`Unsupported progress status: ${value.trim()}`);
  return normalized;
}

function reviewDateFromLine(line) {
  return (
    line.match(/(?:last reviewed|最后审查日期)\s*(?:[:：]\s*)?(\d{4}-\d{2}-\d{2})/i)?.[1] ?? null
  );
}

export function parseProgress(markdown, { file } = {}) {
  const rows = new Map();
  const locations = new Map();
  let reviewed;
  let reviewedLocation;
  let columns = null;
  for (const record of markdownLines(markdown)) {
    const date = reviewDateFromLine(record.text);
    if (date && !reviewed) {
      reviewed = date;
      reviewedLocation = location(record, file);
    }
    const cells = parseTableRow(record.text);
    if (!cells) {
      if (record.text.trim()) columns = null;
      continue;
    }
    if (isTableDivider(cells)) continue;
    const labels = cells.map(cell => cell.replace(/[`*]/g, '').toLowerCase().trim());
    const idColumn = labels.indexOf('wbs id');
    const statusColumn = labels.indexOf('status');
    if (idColumn !== -1 && statusColumn !== -1) {
      columns = { id: idColumn, status: statusColumn };
      continue;
    }
    if (!columns) continue;
    const cell = cells[columns.id] ?? '';
    const ids = findIdentifiers(cell, 'WBS-');
    if (ids.length > 1)
      throw new Error(`Multiple WBS IDs in one progress row at ${atLocation(record, file)}.`);
    const id = strictIdentifier(cell, 'WBS-');
    if (!id) {
      if (cell.includes('WBS-'))
        throw new Error(`Unparseable WBS ID in progress row at ${atLocation(record, file)}.`);
      continue;
    }
    if (rows.has(id)) {
      throw new Error(
        `Duplicate ${id} progress row at ${atLocation(record, file)} (first at line ${locations.get(id).line}).`,
      );
    }
    rows.set(id, normalizeStatus(cells[columns.status] ?? ''));
    locations.set(id, location(record, file));
  }
  return { rows, reviewed: reviewed ?? 'not recorded', locations, reviewedLocation };
}

function labeledValue(record, labels) {
  const match = record.text.trim().match(/^([A-Z]+)\s*:(.*)$/i);
  return match && labels.includes(match[1].toLowerCase()) ? match[2].trim() : null;
}

function dependencyFromLines(lines, file) {
  let dependency;
  for (const record of lines) {
    const value = labeledValue(record, ['dependency', 'dependencies']);
    if (value === null) continue;
    if (!value) throw new Error(`Unparseable empty WBS dependency at ${atLocation(record, file)}.`);
    if (dependency)
      throw new Error(`Multiple WBS dependency fields at ${atLocation(record, file)}.`);
    dependency = { value, ...location(record, file) };
  }
  return dependency;
}

function expandDependencies(task, tasks) {
  const dependency = task.dependency;
  if (/^`?none`?\.?$/i.test(dependency.trim())) return { ids: [], gate: '' };
  const matches = findIdentifierMatches(dependency, 'WBS-', { wildcard: true });
  // Every written WBS token must parse, including malformed wildcard/range endpoints.
  if (
    !matches.length ||
    dependency.split('WBS-').length - 1 !== matches.length ||
    matches.some(match => dependency[match.end] === '*')
  ) {
    throw new Error(`${task.id} has an unparseable WBS dependency: ${dependency}`);
  }
  const expand = value => {
    const ids = value.endsWith('-*')
      ? tasks
          .filter(candidate => candidate.id.startsWith(value.slice(0, -1)))
          .map(candidate => candidate.id)
      : tasks.filter(candidate => candidate.id === value).map(candidate => candidate.id);
    if (!ids.length) {
      throw new Error(
        `${task.id} depends on unknown WBS task${value.endsWith('-*') ? ' group' : ''} ${value}.`,
      );
    }
    return ids;
  };
  const ids = new Set();
  const rangeSpans = [];
  for (let index = 0; index < matches.length; index++) {
    const match = matches[index];
    const next = matches[index + 1];
    const between = next ? dependency.slice(match.end, next.start).replace(/[`*]/g, '').trim() : '';
    if (next && /^(?:through|to|[至到\-–—…]|\.\.)$/i.test(between)) {
      const first = expand(match.value);
      const last = expand(next.value);
      const start = tasks.findIndex(candidate => candidate.id === first[0]);
      const end = tasks.findIndex(candidate => candidate.id === last.at(-1));
      if (start > end) {
        throw new Error(
          `${task.id} has an unparseable reversed WBS dependency range: ${match.value} through ${next.value}.`,
        );
      }
      tasks.slice(start, end + 1).forEach(candidate => ids.add(candidate.id));
      rangeSpans.push({ start: match.end, end: next.start });
      index++;
    } else {
      const remainder = dependency.slice(match.end, next?.start).replace(/`/g, '').trim();
      if (/^(?:through|to)\b/i.test(remainder) || /^(?:[至到\-–—…]|\.\.)\s*$/.test(remainder)) {
        throw new Error(`${task.id} has an unparseable WBS dependency range: ${dependency}`);
      }
      expand(match.value).forEach(id => ids.add(id));
    }
  }
  let gate = '';
  let cursor = 0;
  const spans = [...matches, ...rangeSpans].sort((a, b) => a.start - b.start);
  for (const span of spans) {
    if (span.start >= cursor) gate += dependency.slice(cursor, span.start);
    cursor = Math.max(cursor, span.end);
  }
  gate += dependency.slice(cursor);
  gate = gate
    .replace(/[`*,;./()[\]，；、]/g, ' ')
    .replace(/\b(?:and|or)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (/^through$/i.test(gate) || (gate && !/[A-Z\p{Script=Han}]/iu.test(gate))) {
    throw new Error(`${task.id} has an unparseable WBS dependency range: ${dependency}`);
  }
  return { ids: [...ids], gate };
}

export function parseWbs(markdown, { file } = {}) {
  const records = markdownLines(markdown);
  const phases = [];
  let phase;
  let task;
  let inPhase = false;
  const seen = new Map();
  for (const record of records) {
    const heading = record.heading;
    const phaseMatch = heading?.level === 3 ? heading.text.match(/^Phase\s+(\d+)\s*:(.*\S)/) : null;
    if (phaseMatch) {
      phase = {
        number: phaseMatch[1],
        title: phaseMatch[2].trim(),
        line: record.line,
        tasks: [],
        preamble: [],
      };
      phases.push(phase);
      task = null;
      inPhase = true;
      continue;
    }
    const taskMatch = heading?.level === 4 ? leadingDefinition(heading.text, 'WBS-') : null;
    if (taskMatch && /^\s*[:：]\s*\S/.test(taskMatch.tail) && inPhase) {
      if (
        [...taskMatch.tail.matchAll(/(?:^|\s)(`?[^\s:：`]+`?)\s*[:：]/g)].some(match =>
          strictIdentifier(match[1], 'WBS-'),
        )
      ) {
        throw new Error(`Multiple WBS IDs in one definition at ${atLocation(record, file)}.`);
      }
      if (seen.has(taskMatch.id)) {
        throw new Error(
          `Duplicate ${taskMatch.id} definition at ${atLocation(record, file)} (first at line ${seen.get(taskMatch.id)}).`,
        );
      }
      seen.set(taskMatch.id, record.line);
      task = {
        id: taskMatch.id,
        title: taskMatch.tail.replace(/^\s*[:：]\s*/, ''),
        ...location(record, file),
        body: [],
      };
      phase.tasks.push(task);
      continue;
    }
    if (heading && heading.level <= 4) {
      if (inPhase && heading.level === 4 && findIdentifiers(heading.text, 'WBS-').length > 1) {
        throw new Error(`Multiple WBS IDs in one definition at ${atLocation(record, file)}.`);
      }
      task = null;
      inPhase = false;
    }
    if (!inPhase) continue;
    if (task) task.body.push(record);
    else if (!phase.tasks.length) phase.preamble.push(record);
  }
  if (!phases.length)
    throw new Error('No formal `### Phase <number>:` headings were found in pdp-wbs.md.');
  const tasks = phases.flatMap(phase => {
    const defaultDependency = dependencyFromLines(phase.preamble, file);
    phase.dependency = defaultDependency?.value ?? 'none';
    delete phase.preamble;
    return phase.tasks.map(task => {
      const dependency = dependencyFromLines(task.body, file) ?? defaultDependency;
      task.dependency = dependency?.value ?? 'none';
      task.dependencyLocation = dependency
        ? { line: dependency.line, ...(file ? { file } : {}) }
        : undefined;
      task.phase = { number: phase.number, title: phase.title };
      const statusRecords = task.body.filter(record => labeledValue(record, ['status']) !== null);
      if (statusRecords.length > 1) {
        throw new Error(
          `Multiple ${task.id} Status fields at ${atLocation(statusRecords[1], file)}.`,
        );
      }
      task.status = statusRecords.length
        ? normalizeStatus(labeledValue(statusRecords[0], ['status']))
        : undefined;
      task.statusLocation = statusRecords.length ? location(statusRecords[0], file) : undefined;
      task.deferred =
        task.status === 'deferred' ||
        task.body.some(record => /^deferred scope\.?$/i.test(record.text.trim().replace(/`/g, '')));
      task.atps = [...new Set(task.body.flatMap(record => findIdentifiers(record.text, 'ATP-')))];
      task.endLine = task.body.at(-1)?.line ?? task.line;
      task.body = task.body.map(record => record.text).join('\n');
      return task;
    });
  });
  if (!tasks.length) throw new Error('No formal `#### WBS-…:` tasks were found in pdp-wbs.md.');
  const expandedEdges = new Map();
  for (const task of tasks) {
    const expanded = expandDependencies(task, tasks);
    task.dependencyIds = expanded.ids;
    task.dependencyGate = expanded.gate;
    if (task.dependencyIds.includes(task.id)) throw new Error(`${task.id} has a self dependency.`);
    expandedEdges.set(task.id, task.dependencyIds);
  }
  const visiting = new Set();
  const visited = new Set();
  function visit(id, path) {
    if (visiting.has(id)) throw new Error(`WBS dependency cycle: ${[...path, id].join(' -> ')}.`);
    if (visited.has(id)) return;
    visiting.add(id);
    for (const dependency of expandedEdges.get(id)) visit(dependency, [...path, id]);
    visiting.delete(id);
    visited.add(id);
  }
  for (const task of tasks) visit(task.id, []);
  return { phases, tasks, expandedEdges };
}
