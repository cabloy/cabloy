import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import minimist from 'minimist';

// --- Constants ---
const TAG_PREFIX = 'cabloy@';
const GITHUB_REPO = 'cabloy/cabloy';
const PACKAGE_JSON_PATH = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'package.json');
const CHANGELOG_PATH = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'CHANGELOG.md');
const COMMIT_CAP = 5;

// --- Utility functions ---
function exec(cmd: string, dryRun?: boolean): string {
  if (dryRun) {
    console.log(`  [dry-run] ${cmd}`);
    return '';
  }
  return execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
}

function readPackageJson(): Record<string, any> {
  return JSON.parse(readFileSync(PACKAGE_JSON_PATH, 'utf-8'));
}

function writePackageJson(pkg: Record<string, any>): void {
  writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(pkg, null, 2) + '\n');
}

function getLastTag(): string | null {
  try {
    const result = execSync(`git tag -l '${TAG_PREFIX}*' --sort=-v:refname`, { encoding: 'utf-8' }).trim();
    const tags = result.split('\n').filter(Boolean);
    return tags.length > 0 ? tags[0] : null;
  } catch {
    return null;
  }
}

interface CommitInfo {
  hash: string;
  subject: string;
}

function getCommitsSinceTag(tag: string | null): CommitInfo[] {
  const range = tag ? `${tag}..HEAD` : 'HEAD';
  const logCmd = `git log ${range} --pretty=format:"%h|||%s" --no-merges -${COMMIT_CAP}`;
  const result = execSync(logCmd, { encoding: 'utf-8' }).trim();
  if (!result) return [];
  return result.split('\n').map(line => {
    const [hash, subject] = line.split('|||');
    return { hash: hash.trim(), subject: subject.trim() };
  });
}

function bumpVersion(current: string, bumpType: 'patch' | 'minor' | 'major'): string {
  const parts = current.split('.').map(Number);
  if (parts.length !== 3) throw new Error(`Invalid version: ${current}`);
  if (bumpType === 'major') {
    parts[0]++;
    parts[1] = 0;
    parts[2] = 0;
  } else if (bumpType === 'minor') {
    parts[1]++;
    parts[2] = 0;
  } else {
    parts[2]++;
  }
  return parts.join('.');
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

// --- Step 1: Version Bump ---
async function versionBump(bumpType: 'patch' | 'minor' | 'major', dryRun?: boolean): Promise<string> {
  const pkg = readPackageJson();
  const currentVersion = pkg.version;
  const lastTag = getLastTag();

  // Check for changes since last tag
  if (lastTag) {
    const diffCmd = `git -c diff.renameLimit=10000 diff --name-only ${lastTag}..HEAD`;
    const changedFiles = execSync(diffCmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
    if (!changedFiles) {
      console.log('No changes since last release. Skipping version bump.');
      return currentVersion;
    }
  }

  const newVersion = bumpVersion(currentVersion, bumpType);
  console.log(`\n📦 Version bump: ${currentVersion} → ${newVersion}`);

  pkg.version = newVersion;
  if (!dryRun) {
    writePackageJson(pkg);
  }

  const tag = `${TAG_PREFIX}${newVersion}`;
  exec(`git add package.json`, dryRun);
  exec(`git commit -m "chore: release v${newVersion}"`, dryRun);
  exec(`git tag ${tag}`, dryRun);
  exec(`git push`, dryRun);
  exec(`git push origin ${tag}`, dryRun);

  return newVersion;
}

// --- Step 2: AI Changelog ---
async function callAnthropic(commits: CommitInfo[], version: string): Promise<string> {
  const token = process.env.ANTHROPIC_AUTH_TOKEN;
  const baseUrl = process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com';
  const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514';

  if (!token) throw new Error('ANTHROPIC_AUTH_TOKEN environment variable is not set');

  const commitList = commits.map(c => `- ${c.subject}`).join('\n');

  const prompt = `You are a changelog generator. Given the following git commit messages since the last release, generate a concise, well-organized changelog in markdown format for version ${version}.

Group changes into these categories (only include categories that have entries):
- **Features**: New features or capabilities
- **Bug Fixes**: Bug fixes and corrections
- **Improvements**: Performance improvements, refactoring, DX improvements
- **Breaking Changes**: Any breaking changes

For each entry, write a clear description in imperative mood. Do not include commit hashes.

Commits:
${commitList}

Respond with ONLY the changelog content in markdown, starting with ## ${version}`;

  const response = await fetch(`${baseUrl}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': token,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic API error: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as { content?: Array<{ type: string; text?: string }>; error?: { message: string } };
  if (data.error) {
    throw new Error(`Anthropic API error: ${data.error.message}`);
  }
  const textBlock = data.content?.find(c => c.type === 'text');
  const text = textBlock?.text;
  if (!text) {
    throw new Error(`Unexpected Anthropic API response: ${JSON.stringify(data)}`);
  }
  return text;
}

async function generateChangelog(version: string, dryRun?: boolean, noAi?: boolean): Promise<void> {
  console.log(`\n📝 Generating changelog for v${version}...`);

  // Use the tag for the current version to find the previous tag
  // After version bump, the current tag (e.g. cabloy@5.1.4) points to HEAD,
  // so we need the tag BEFORE that to get the commit range
  const currentTag = `${TAG_PREFIX}${version}`;
  const allTags = execSync(`git tag -l '${TAG_PREFIX}*' --sort=-v:refname`, { encoding: 'utf-8' }).trim().split('\n').filter(Boolean);
  const currentTagIndex = allTags.indexOf(currentTag);
  const previousTag = currentTagIndex >= 0 && currentTagIndex < allTags.length - 1 ? allTags[currentTagIndex + 1] : null;
  const commits = getCommitsSinceTag(previousTag);

  if (commits.length === 0) {
    console.log('No commits found. Skipping changelog generation.');
    return;
  }

  let newSection: string;

  if (noAi || dryRun) {
    const commitList = commits.map(c => `- ${c.subject}`).join('\n');
    newSection = `## ${version} (${getToday()})\n\n${commitList}`;
  } else {
    newSection = await callAnthropic(commits, version);
    // Ensure the section starts with the version header if AI didn't include it
    if (!newSection.startsWith(`## ${version}`)) {
      newSection = `## ${version} (${getToday()})\n\n${newSection}`;
    }
  }

  // Read existing changelog or create new one
  let existingContent = '';
  if (existsSync(CHANGELOG_PATH)) {
    existingContent = readFileSync(CHANGELOG_PATH, 'utf-8');
  }

  // Prepend new section
  const header = '# Changelog\n\n';
  let changelog: string;
  if (existingContent.startsWith('# Changelog')) {
    changelog = existingContent.replace('# Changelog\n\n', header + newSection + '\n\n');
  } else {
    changelog = header + newSection + '\n\n' + existingContent;
  }

  if (dryRun) {
    console.log(`  [dry-run] Write to CHANGELOG.md:\n${newSection}\n`);
  } else {
    writeFileSync(CHANGELOG_PATH, changelog);
  }

  exec(`git add CHANGELOG.md`, dryRun);
  exec(`git commit -m "chore: update CHANGELOG.md for v${version}"`, dryRun);
  exec(`git push`, dryRun);
}

// --- Step 3: npm Publish ---
async function npmPublish(dryRun?: boolean): Promise<void> {
  console.log('\n🚀 Publishing to npm...');

  if (dryRun) {
    console.log('  [dry-run] npm publish');
    return;
  }

  execSync('npm publish', { encoding: 'utf-8', stdio: 'inherit' });
}

// --- Step 4: GitHub Release ---
async function githubRelease(version: string, dryRun?: boolean): Promise<void> {
  console.log(`\n🏷️  Creating GitHub release for v${version}...`);

  // Extract changelog section for this version
  let notes = '';
  if (existsSync(CHANGELOG_PATH)) {
    const content = readFileSync(CHANGELOG_PATH, 'utf-8');
    const versionHeader = `## ${version}`;
    const startIdx = content.indexOf(versionHeader);
    if (startIdx !== -1) {
      const nextSectionIdx = content.indexOf('\n## ', startIdx + versionHeader.length);
      notes = nextSectionIdx !== -1
        ? content.substring(startIdx, nextSectionIdx).trim()
        : content.substring(startIdx).trim();
    }
  }

  const tag = `${TAG_PREFIX}${version}`;

  if (dryRun) {
    console.log(`  [dry-run] gh release create ${tag} --repo ${GITHUB_REPO} --title "v${version}" --notes-file <changelog-section>`);
    return;
  }

  // Use gh CLI with a temp file for notes to avoid shell escaping issues
  const tmpFile = resolve(dirname(fileURLToPath(import.meta.url)), '..', '.release-notes.tmp.md');
  writeFileSync(tmpFile, notes);
  try {
    execSync(`gh release create ${tag} --repo ${GITHUB_REPO} --title "v${version}" --notes-file "${tmpFile}"`, {
      encoding: 'utf-8',
      stdio: 'inherit',
    });
  } finally {
    if (existsSync(tmpFile)) {
      execSync(`rm -f "${tmpFile}"`);
    }
  }
}

// --- Main ---
interface ReleaseOptions {
  bumpType: 'patch' | 'minor' | 'major';
  dryRun?: boolean;
  changelogOnly?: boolean;
  publishOnly?: boolean;
  releaseOnly?: boolean;
  skipChangelog?: boolean;
  skipPublish?: boolean;
  skipRelease?: boolean;
  noAi?: boolean;
}

async function release(options: ReleaseOptions): Promise<void> {
  console.log('🔧 Cabloy Release\n');

  // Pre-flight checks
  try {
    execSync('git rev-parse --is-inside-work-tree', { encoding: 'utf-8', stdio: 'pipe' });
  } catch {
    console.error('Error: Not in a git repository');
    process.exit(1);
  }

  const status = execSync('git status --porcelain', { encoding: 'utf-8' }).trim();
  if (status && !options.dryRun) {
    console.error('Error: Working tree is not clean. Commit or stash your changes first.');
    process.exit(1);
  }

  // Determine the version to use
  let version: string;

  if (options.changelogOnly || options.publishOnly || options.releaseOnly) {
    const pkg = readPackageJson();
    version = pkg.version;
    console.log(`Using current version: ${version}`);
  } else {
    version = await versionBump(options.bumpType, options.dryRun);
  }

  // Changelog
  if (!options.skipChangelog && !options.publishOnly && !options.releaseOnly) {
    await generateChangelog(version, options.dryRun, options.noAi);
  }

  // npm publish
  if (!options.skipPublish && !options.changelogOnly && !options.releaseOnly) {
    await npmPublish(options.dryRun);
  }

  // GitHub release
  if (!options.skipRelease && !options.changelogOnly && !options.publishOnly) {
    await githubRelease(version, options.dryRun);
  }

  console.log('\n✅ Release complete!');
}

// --- Entry point ---
const args = minimist(process.argv.slice(2), {
  boolean: ['dry-run', 'changelog-only', 'publish-only', 'release-only', 'skip-changelog', 'skip-publish', 'skip-release', 'no-ai'],
  default: {
    'dry-run': false,
    'changelog-only': false,
    'publish-only': false,
    'release-only': false,
    'skip-changelog': false,
    'skip-publish': false,
    'skip-release': false,
    'no-ai': false,
  },
});

const bumpType = (args._[0] || 'patch') as 'patch' | 'minor' | 'major';
if (!['patch', 'minor', 'major'].includes(bumpType)) {
  console.error(`Invalid bump type: ${bumpType}. Use patch, minor, or major.`);
  process.exit(1);
}

release({
  bumpType,
  dryRun: args['dry-run'],
  changelogOnly: args['changelog-only'],
  publishOnly: args['publish-only'],
  releaseOnly: args['release-only'],
  skipChangelog: args['skip-changelog'],
  skipPublish: args['skip-publish'],
  skipRelease: args['skip-release'],
  noAi: args['no-ai'],
}).catch(err => {
  console.error(`\n❌ Release failed: ${err.message}`);
  process.exit(1);
});
