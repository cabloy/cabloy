#!/usr/bin/env python3
import json
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path('/Volumes/my-data/cabloy-multirepo/cabloy-basic')
STATE_FILE = Path('/tmp/cabloy-contract-loop-gate-state.json')
AUTO_SYNC_WINDOW_SECONDS = 300

TARGET_PATTERNS = [
    ('zova/src/module/', '.ts'),
    ('zova/src/module/', '.tsx'),
    ('zova/src/module/', '.jsx'),
    ('zova/src/suite/', '.ts'),
    ('zova/src/suite/', '.tsx'),
    ('zova/src/suite/', '.jsx'),
    ('vona/src/', '.ts'),
    ('vona/src/', '.tsx'),
    ('vona/src/', '.jsx'),
]

FORWARD_PATH_MARKERS = [
    '/controller/',
    '/dto/',
    '/entity/',
]

FORWARD_CONTENT_MARKERS = [
    '@Web.',
    '@Api.field',
    '@Api.body',
    'v.openapi(',
    '@Dto<',
]

REVERSE_VONA_CONTENT_MARKERS = [
    'zova-rest-cabloy-basic-admin',
    'ZovaRender.',
    'tableActionRow(',
    'tableActionBulk(',
    'ZovaRender.field(',
    'ZovaRender.cell(',
]

REVERSE_ZOVA_PATH_MARKERS = [
    '/src/bean/',
    '/src/component/',
    '/src/.metadata/',
]

REVERSE_ZOVA_CONTENT_MARKERS = [
    "declare module 'zova-module-a-openapi'",
    'IResourceTableActionRowRecord',
    '@TableCell<',
    '@Component(',
    '@Component<',
]


def _normalize_path(value):
    if not value:
        return None
    try:
        path = Path(value)
        if not path.is_absolute():
            path = ROOT / path
        return path.resolve()
    except Exception:
        return None


def _is_code_file(path: Path):
    path_text = path.as_posix()
    for prefix, suffix in TARGET_PATTERNS:
        if prefix in path_text and path_text.endswith(suffix):
            return True
    return False


def _contains_any(text, needles):
    return any(needle in text for needle in needles)


def _path_contains_any(path_text, needles):
    return any(needle in path_text for needle in needles)


def _detect_forward(path_text, content):
    if '/vona/src/' not in path_text:
        return None
    if _path_contains_any(path_text, FORWARD_PATH_MARKERS) or _contains_any(content, FORWARD_CONTENT_MARKERS):
        return 'Backend contract source may have changed.'
    return None


def _detect_reverse(path_text, content):
    if '/vona/src/' in path_text and _contains_any(content, REVERSE_VONA_CONTENT_MARKERS):
        return 'Vona code is consuming frontend metadata or render resources.'
    if '/zova/src/' in path_text and (
        _path_contains_any(path_text, REVERSE_ZOVA_PATH_MARKERS)
        or _contains_any(content, REVERSE_ZOVA_CONTENT_MARKERS)
    ):
        return 'Frontend-owned resources or metadata may affect backend consumers.'
    return None


def _analyze(path_text, content):
    return {
        'forward_reason': _detect_forward(path_text, content),
        'reverse_reason': _detect_reverse(path_text, content),
    }


def _has_signal(result):
    return bool(result['forward_reason'] or result['reverse_reason'])


def _is_high_confidence_reverse_source(path_text):
    return '/zova/src/' in path_text and _path_contains_any(path_text, REVERSE_ZOVA_PATH_MARKERS)


def _read_text(path: Path):
    try:
        return path.read_text(encoding='utf-8')
    except Exception:
        return None


def _load_state():
    if not STATE_FILE.exists():
        return {}
    try:
        return json.loads(STATE_FILE.read_text(encoding='utf-8'))
    except Exception:
        return {}


def _save_state(state):
    try:
        STATE_FILE.write_text(json.dumps(state), encoding='utf-8')
    except Exception:
        pass


def _sync_fingerprint(path: Path):
    try:
        stat = path.stat()
        return f'{path.as_posix()}:{stat.st_mtime_ns}'
    except FileNotFoundError:
        return path.as_posix()


def _should_skip_auto_sync(path: Path):
    state = _load_state()
    fingerprint = _sync_fingerprint(path)
    entry = state.get(str(ROOT))
    if not entry:
        return False
    if entry.get('fingerprint') != fingerprint:
        return False
    if time.time() - entry.get('timestamp', 0) > AUTO_SYNC_WINDOW_SECONDS:
        return False
    return True


def _mark_auto_sync(path: Path):
    state = _load_state()
    state[str(ROOT)] = {
        'fingerprint': _sync_fingerprint(path),
        'timestamp': time.time(),
    }
    _save_state(state)


def _run_command(command):
    return subprocess.run(
        command,
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=False,
    )


def _summarize_process(result):
    combined = '\n'.join(part for part in [result.stdout.strip(), result.stderr.strip()] if part)
    if not combined:
        return f'command exited with code {result.returncode}'
    lines = [line.strip() for line in combined.splitlines() if line.strip()]
    tail = ' | '.join(lines[-3:])
    return f'exit {result.returncode}: {tail}'


def _auto_sync_reverse(path: Path):
    build_result = _run_command(['npm', 'run', 'build:zova:admin'])
    if build_result.returncode != 0:
        return False, f'Auto-sync failed during `npm run build:zova:admin`: {_summarize_process(build_result)}'

    deps_result = _run_command(['npm', 'run', 'deps:vona'])
    if deps_result.returncode != 0:
        return False, f'Auto-sync failed during `npm run deps:vona`: {_summarize_process(deps_result)}'

    _mark_auto_sync(path)
    return True, 'Auto-sync ran `npm run build:zova:admin` and `npm run deps:vona` for this reverse-chain edit.'


def _build_messages(path: Path, result):
    messages = [
        "Contract-loop gate: this change may affect Cabloy's bidirectional contract loop.",
    ]
    path_text = path.as_posix()

    if result['forward_reason']:
        messages.append(
            f"Forward chain: {result['forward_reason']} If backend contract truth changed, verify the emitted OpenAPI/contract output and regenerate the frontend consumer path before considering the task done."
        )
        messages.append(
            'After forward regeneration, keep frontend follow-up thin: prefer semantic model facades and reuse the existing resource-owner when the custom API still belongs to the same resource.'
        )

    if result['reverse_reason']:
        messages.append(
            f"Reverse chain: {result['reverse_reason']} If backend tooling or backend metadata will consume this handoff, refresh generated metadata when applicable, then run `npm run build:zova:admin` and `npm run deps:vona` for the Cabloy Basic Admin path."
        )
        if _is_high_confidence_reverse_source(path_text):
            if _should_skip_auto_sync(path):
                messages.append(
                    'Auto-sync skipped because the same reverse-source edit was already synced recently in this repo.'
                )
            else:
                ok, detail = _auto_sync_reverse(path)
                messages.append(detail)
                if not ok:
                    messages.append(
                        'Please review the failure before continuing. If generated artifacts already contain the expected changes but consumers still behave stale, suspect local dependency drift before making more source edits.'
                    )
                    return ' '.join(messages)
        else:
            messages.append(
                'Auto-sync did not run because this reverse-chain signal came from the consumer side rather than a high-confidence frontend source edit.'
            )
        messages.append(
            'For Cabloy Start, apply the same reverse-chain logic but resolve the Start-specific flavor names and generated-output paths from the active Start repo before executing edition-specific steps.'
        )

    return ' '.join(messages)


def run_claude_hook():
    payload = json.load(sys.stdin)
    file_path = _normalize_path(payload.get('tool_input', {}).get('file_path'))
    if not file_path or not _is_code_file(file_path):
        return 0

    content = _read_text(file_path)
    if content is None:
        return 0

    result = _analyze(file_path.as_posix(), content)
    if not _has_signal(result):
        return 0

    message = _build_messages(file_path, result)
    print(json.dumps({
        'hookSpecificOutput': {
            'hookEventName': 'PostToolUse',
            'additionalContext': message,
        },
        'systemMessage': message,
    }))
    return 0


if __name__ == '__main__':
    raise SystemExit(run_claude_hook())
