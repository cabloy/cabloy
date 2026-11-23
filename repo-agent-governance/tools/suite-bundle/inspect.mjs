#!/usr/bin/env node
import { readFileSync } from 'node:fs';

import { readZip, verifyChecksums } from './archive.mjs';
import { BUNDLE_DIR, BUNDLE_VERSION, isAllowedResourcePath, suiteSegment } from './core.mjs';
import { validatePostImportTasks } from './tasks.mjs';

export function inspectBundle(buffer) {
  const archive = readZip(buffer);
  verifyChecksums(archive.files);
  const manifestData = archive.files.get(`${BUNDLE_DIR}/manifest.json`);
  if (!manifestData) throw new Error('bundle is missing manifest.json');
  let manifest;
  try {
    manifest = JSON.parse(manifestData.toString('utf8'));
  } catch {
    throw new Error('manifest.json is not valid JSON');
  }
  const legacy = manifest?.schemaVersion === 2;
  if (
    (!legacy && manifest?.schemaVersion !== BUNDLE_VERSION) ||
    manifest.kind !== 'cabloy-suite-bundle' ||
    !['basic', 'start'].includes(manifest.edition)
  ) {
    throw new Error('manifest has an unsupported bundle schema or edition');
  }
  const suite = suiteSegment(manifest.suite?.id);
  const resources = manifest.resources;
  validatePostImportTasks(manifest.postImportTasks, {
    suite,
    edition: manifest.edition,
  });
  if (!Array.isArray(resources) || resources.length === 0)
    throw new Error('manifest resources must be a non-empty array');
  const payload = new Map();
  const portablePaths = new Map();
  const declared = new Set(
    ['manifest.json', 'checksums.json', 'source.json', 'dependencies.json', 'ownership.json'].map(
      name => `${BUNDLE_DIR}/${name}`,
    ),
  );
  for (const resource of resources) {
    if (!resource || !isAllowedResourcePath(resource.path, suite, resource.ownership))
      throw new Error(`resource path or ownership is not allowed: ${resource?.path}`);
    if (resource.operation !== 'upsert')
      throw new Error(`unsupported resource operation: ${resource.path}`);
    if (payload.has(resource.path))
      throw new Error(`duplicate manifest resource: ${resource.path}`);
    const portable = resource.path.normalize('NFC').toLowerCase();
    if (portablePaths.has(portable))
      throw new Error(`manifest resource paths alias each other: ${resource.path}`);
    portablePaths.set(portable, resource.path);
    const expectedPayload = `${BUNDLE_DIR}/payload/${resource.path}`;
    if (resource.payloadPath !== expectedPayload)
      throw new Error(`resource payload mapping is invalid: ${resource.path}`);
    if (!archive.files.has(expectedPayload))
      throw new Error(`resource payload is incomplete: ${resource.path}`);
    declared.add(expectedPayload);
    payload.set(resource.path, archive.files.get(expectedPayload));
    if (legacy) {
      // Validate the old layout, but never use its embedded base as a merge ancestor.
      const expectedBase = `${BUNDLE_DIR}/base/${resource.path}`;
      if (resource.basePath !== expectedBase || !archive.files.has(expectedBase))
        throw new Error(`legacy resource base mapping is invalid: ${resource.path}`);
      declared.add(expectedBase);
    } else if (Object.hasOwn(resource, 'basePath')) {
      throw new Error(`resource must not declare an embedded base: ${resource.path}`);
    }
  }
  for (const [portable, path] of portablePaths) {
    const segments = portable.split('/');
    for (let length = 1; length < segments.length; length++) {
      if (portablePaths.has(segments.slice(0, length).join('/')))
        throw new Error(`manifest resource path crosses another file: ${path}`);
    }
  }
  for (const name of archive.files.keys()) {
    if (!declared.has(name)) throw new Error(`archive entry is not declared: ${name}`);
  }
  return { archive, manifest, suite, payload };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const input = process.argv[2];
    if (!input || input === '--help' || input === '-h') {
      process.stdout.write('Usage: npm run cabloy-suite-import -- <bundle.zip> [--inspect]\n');
      process.exit(input ? 0 : 1);
    }
    const result = inspectBundle(readFileSync(input));
    process.stdout.write(
      `${JSON.stringify(
        {
          suite: result.suite,
          resources: result.manifest.resources.length,
          bytes: result.archive.totalBytes,
        },
        null,
        2,
      )}\n`,
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
