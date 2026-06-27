import { spawnSync } from 'node:child_process';

const NO_TARGETS_MESSAGE =
  'Expected at least one target file. All matched files may have been excluded by ignore rules.';

function stripNoTargetsMessage(output) {
  return output
    .split('\n')
    .filter(line => !line.includes(NO_TARGETS_MESSAGE))
    .join('\n')
    .trimEnd();
}

function writeOutput(stream, output) {
  if (output) {
    stream.write(output);
  }
}

const filenames = process.argv.slice(2);
if (filenames.length === 0) {
  process.exit(0);
}

const result = spawnSync('pnpm', ['exec', 'oxfmt', '--write', ...filenames], {
  encoding: 'utf8',
  stdio: 'pipe',
});

if (result.error) {
  throw result.error;
}

const stdout = result.stdout ?? '';
const stderr = result.stderr ?? '';
if (result.status === 0) {
  writeOutput(process.stdout, stdout);
  writeOutput(process.stderr, stderr);
  process.exit(0);
}

const combinedOutput = `${stdout}\n${stderr}`;
if (combinedOutput.includes(NO_TARGETS_MESSAGE)) {
  const cleanStdout = stripNoTargetsMessage(stdout);
  const cleanStderr = stripNoTargetsMessage(stderr);
  writeOutput(process.stdout, cleanStdout ? `${cleanStdout}\n` : '');
  writeOutput(process.stderr, cleanStderr ? `${cleanStderr}\n` : '');
  process.exit(0);
}

writeOutput(process.stdout, stdout);
writeOutput(process.stderr, stderr);
process.exit(result.status ?? 1);
