import { inflateSync, zipSync } from 'fflate';

import {
  safeRelativePath,
  sha256,
  BUNDLE_DIR,
  MAX_ENTRIES,
  MAX_FILE_BYTES,
  MAX_TOTAL_BYTES,
} from './core.mjs';

const EOCD = 0x06054b50;
const CENTRAL = 0x02014b50;
const LOCAL = 0x04034b50;
const MAX_RATIO = 200;

function u16(buffer, offset) {
  return buffer.readUInt16LE(offset);
}
function u32(buffer, offset) {
  return buffer.readUInt32LE(offset);
}

function decodeName(bytes) {
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

function findEnd(buffer) {
  const start = Math.max(0, buffer.length - 65_557);
  for (let offset = buffer.length - 22; offset >= start; offset--) {
    if (u32(buffer, offset) === EOCD) return offset;
  }
  throw new Error('ZIP end-of-central-directory record was not found');
}

export function inspectZip(buffer) {
  const end = findEnd(buffer);
  const entries = u16(buffer, end + 10);
  const directorySize = u32(buffer, end + 12);
  const directoryOffset = u32(buffer, end + 16);
  if (entries > MAX_ENTRIES) throw new Error(`ZIP contains too many entries: ${entries}`);
  if (directoryOffset + directorySize > end)
    throw new Error('ZIP central directory is outside the archive');
  if (entries === 0) throw new Error('ZIP archive is empty');

  const records = [];
  let offset = directoryOffset;
  let total = 0;
  const seen = new Set();
  for (let index = 0; index < entries; index++) {
    if (u32(buffer, offset) !== CENTRAL)
      throw new Error(`invalid ZIP central directory entry at ${index}`);
    const flags = u16(buffer, offset + 8);
    const method = u16(buffer, offset + 10);
    const compressedSize = u32(buffer, offset + 20);
    const uncompressedSize = u32(buffer, offset + 24);
    const nameLength = u16(buffer, offset + 28);
    const extraLength = u16(buffer, offset + 30);
    const commentLength = u16(buffer, offset + 32);
    const externalAttributes = u32(buffer, offset + 38);
    const localOffset = u32(buffer, offset + 42);
    if (flags & 1) throw new Error('encrypted ZIP entries are not supported');
    if (method !== 0 && method !== 8)
      throw new Error(`unsupported ZIP compression method: ${method}`);
    if (uncompressedSize > MAX_FILE_BYTES)
      throw new Error(`ZIP entry exceeds size limit: ${index}`);
    total += uncompressedSize;
    if (total > MAX_TOTAL_BYTES) throw new Error('ZIP expanded size exceeds the bundle limit');
    if (compressedSize > 0 && uncompressedSize / compressedSize > MAX_RATIO)
      throw new Error('ZIP entry expansion ratio exceeds the bundle limit');
    const nameBytes = buffer.subarray(offset + 46, offset + 46 + nameLength);
    const rawName = decodeName(nameBytes);
    const name = safeRelativePath(rawName, 'ZIP entry');
    if (name.endsWith('/')) throw new Error(`ZIP directories are not supported: ${name}`);
    if (name.includes('\\')) throw new Error(`ZIP entry must use POSIX separators: ${name}`);
    if (seen.has(name)) throw new Error(`duplicate ZIP entry: ${name}`);
    seen.add(name);
    if ((externalAttributes >>> 16) & 0xf000)
      throw new Error(`ZIP non-regular entry is not supported: ${name}`);
    if (localOffset + 30 + nameLength > buffer.length || u32(buffer, localOffset) !== LOCAL)
      throw new Error(`invalid local ZIP header: ${name}`);
    const localNameLength = u16(buffer, localOffset + 26);
    const localExtraLength = u16(buffer, localOffset + 28);
    const dataOffset = localOffset + 30 + localNameLength + localExtraLength;
    if (dataOffset + compressedSize > buffer.length)
      throw new Error(`ZIP entry data is truncated: ${name}`);
    records.push({ name, method, compressedSize, uncompressedSize, dataOffset });
    offset += 46 + nameLength + extraLength + commentLength;
  }
  return { records, totalBytes: total };
}

export function readZip(buffer) {
  const inspected = inspectZip(buffer);
  const files = new Map();
  for (const record of inspected.records) {
    const compressed = buffer.subarray(
      record.dataOffset,
      record.dataOffset + record.compressedSize,
    );
    const data = record.method === 0 ? compressed : inflateSync(compressed);
    if (data.length !== record.uncompressedSize)
      throw new Error(`ZIP size mismatch: ${record.name}`);
    files.set(record.name, Buffer.from(data));
  }
  return { ...inspected, files };
}

export function writeZip(files) {
  const ordered = {};
  for (const [name, data] of [...files.entries()].toSorted(([a], [b]) => a.localeCompare(b))) {
    const safe = safeRelativePath(name, 'ZIP output entry');
    ordered[safe] = new Uint8Array(data);
  }
  return Buffer.from(zipSync(ordered, { level: 6, mtime: new Date('1980-01-01T00:00:00Z') }));
}

export function verifyChecksums(files, checksumPath = `${BUNDLE_DIR}/checksums.json`) {
  const checksums = files.get(checksumPath);
  if (!checksums) throw new Error('bundle is missing checksums.json');
  let parsed;
  try {
    parsed = JSON.parse(checksums.toString('utf8'));
  } catch {
    throw new Error('checksums.json is not valid JSON');
  }
  if (!parsed || parsed.schemaVersion !== 1 || parsed.selfExcluded !== true || !parsed.files)
    throw new Error('checksums.json has an invalid schema');
  for (const [name, expected] of Object.entries(parsed.files)) {
    const data = files.get(name);
    if (!data) throw new Error(`checksum references a missing file: ${name}`);
    if (data.length !== expected.bytes || sha256(data) !== expected.sha256)
      throw new Error(`checksum mismatch: ${name}`);
  }
  for (const name of files.keys()) {
    if (name === checksumPath) continue;
    if (!Object.hasOwn(parsed.files, name))
      throw new Error(`archive file is not covered by checksums: ${name}`);
  }
  return parsed;
}
