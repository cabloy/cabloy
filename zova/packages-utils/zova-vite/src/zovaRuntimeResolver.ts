import type { Plugin } from 'vite';

import { lstatSync } from 'node:fs';
import path from 'node:path';

import type { ZovaViteConfigOptions, ZovaViteContext } from './types.ts';

export const ZOVA_RUNTIME_DIR_ENV = 'ZOVA_RUNTIME_DIR';
export const ZOVA_ISOLATED_ENV = 'ZOVA_ISOLATED';
export const ZOVA_DEFAULT_RUNTIME_DIR = '.zova';

/**
 * Resolve the generated-runtime directory without allowing it to escape the
 * application directory. The returned path always uses `/`, which is also the
 * separator used by Vite module ids.
 */
export function resolveZovaRuntimeDir(runtimeDir?: string): string {
  const value = process.env[ZOVA_RUNTIME_DIR_ENV] ?? runtimeDir ?? ZOVA_DEFAULT_RUNTIME_DIR;
  if (process.env[ZOVA_ISOLATED_ENV] === 'true' && !/^\.zova-build-[a-z0-9][\w-]*$/i.test(value)) {
    throw new Error('Isolated Zova builds require an explicit .zova-build-<ID> runtime directory');
  }
  if (!value || value === '.' || value === '..') {
    throw new Error('Zova runtime directory must be a non-empty relative path');
  }
  // path.isAbsolute only recognizes the host platform. Reject foreign Win32
  // absolute/drive-relative forms as well so the same input is safe on either
  // platform.
  if (
    path.isAbsolute(value) ||
    path.posix.isAbsolute(value) ||
    path.win32.isAbsolute(value) ||
    /^[a-z]:/i.test(value) ||
    value.startsWith('\\\\')
  ) {
    throw new Error('Zova runtime directory must be relative to the application directory');
  }
  const normalized = value.replaceAll('\\', '/');
  const parts = normalized.split('/');
  if (parts.some(part => part === '..')) {
    throw new Error('Zova runtime directory must remain inside the application directory');
  }
  const cleaned = parts.filter(part => part !== '.').join('/');
  // Generated config/app imports use ../src and ../../src. Keep the runtime
  // beside src rather than accepting nested paths whose imports would be wrong.
  if (!/^[\w.-]+$/.test(cleaned) || cleaned === '.' || cleaned === '..') {
    throw new Error('Zova runtime directory must be one local directory name beside src');
  }
  return cleaned;
}

/** Validate a runner-owned sibling directory before creating or removing it. */
export function resolveZovaLocalPath(appDir: string, dirName: string, prefix?: string): string {
  if (
    !/^[\w.-]+$/.test(dirName) ||
    dirName === '.' ||
    dirName === '..' ||
    (prefix !== undefined &&
      (!dirName.startsWith(prefix) || !/^[a-z0-9][\w-]*$/i.test(dirName.slice(prefix.length))))
  ) {
    throw new Error('Zova local directory must be a validated sibling directory name');
  }
  const localPath = path.resolve(appDir, dirName);
  try {
    const stat = lstatSync(localPath);
    if (stat.isSymbolicLink() || !stat.isDirectory()) {
      throw new Error('Zova local directory must not be a symlink or non-directory');
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
  return localPath;
}

export function resolveZovaViteContext(options: ZovaViteConfigOptions): ZovaViteContext {
  const appDir = path.resolve(options.appDir);
  const runtimeDir = resolveZovaRuntimeDir(options.runtimeDir);
  const runtimePath = resolveZovaLocalPath(appDir, runtimeDir);
  return {
    appDir,
    runtimeDir,
    runtimePath,
    isolated: process.env[ZOVA_ISOLATED_ENV] === 'true',
  };
}

function stripIdQuery(id: string): string {
  return id.split(/[?#]/, 1)[0]!;
}

function slash(value: string): string {
  return value.replaceAll('\\', '/');
}

function isWithin(root: string, target: string): boolean {
  const relative = path.relative(root, target);
  return (
    relative === '' ||
    (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative))
  );
}

/**
 * Create the resolver used by isolated builds. Existing source imports point at
 * `.zova`; isolated builds generate the same files under ZOVA_RUNTIME_DIR.
 * Delegating the mapped absolute id back to Vite preserves Vite's normal
 * extension handling (including its `.js` to `.ts` fallback).
 */
export function createZovaRuntimeResolverPlugin(
  configOptions: ZovaViteConfigOptions,
): Plugin | undefined {
  if (process.env[ZOVA_ISOLATED_ENV] !== 'true') return undefined;
  const context = resolveZovaViteContext(configOptions);
  const legacyRuntimePath = path.join(context.appDir, ZOVA_DEFAULT_RUNTIME_DIR);
  const legacyRuntimePrefix = `${slash(legacyRuntimePath)}/`;

  return {
    name: 'zova-runtime-resolver',
    enforce: 'pre',
    async resolveId(source, importer, resolveOptions) {
      const sourceFile = stripIdQuery(source);
      let sourcePath: string;
      if (sourceFile.startsWith('app/.zova/')) {
        sourcePath = path.join(context.appDir, sourceFile.slice('app/'.length));
      } else if (path.isAbsolute(sourceFile)) {
        sourcePath = path.resolve(sourceFile);
      } else if (sourceFile.startsWith('.')) {
        if (!importer || importer.startsWith('\0')) return null;
        const importerPath = path.resolve(stripIdQuery(importer));
        if (!isWithin(context.appDir, importerPath)) return null;
        sourcePath = path.resolve(path.dirname(importerPath), sourceFile);
      } else {
        return null;
      }
      const normalizedSourcePath = slash(sourcePath);
      if (!normalizedSourcePath.startsWith(legacyRuntimePrefix)) return null;
      const relative = path.relative(legacyRuntimePath, sourcePath);
      const mapped =
        slash(path.join(context.runtimePath, relative)) + source.slice(sourceFile.length);
      const resolved = await this.resolve(mapped, importer, { ...resolveOptions, skipSelf: true });
      if (!resolved) {
        this.error(`Unable to resolve isolated Zova runtime import: ${source}`);
      }
      return resolved;
    },
  };
}
