#!/usr/bin/env python3
import json
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path('/Volumes/my-data/cabloy-multirepo/cabloy-basic')
BYPASS_ENV = 'CABLOY_CONTRACT_LOOP_BYPASS'

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

FORWARD_PROOF_PATH_MARKERS = [
    '/src/api/',
]

REVERSE_PROOF_PATH_MARKERS = [
    '/src/.metadata/',
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


def _build_messages(result):
    messages = [
        'Contract-loop gate: this change may affect Cabloy\'s bidirectional contract loop.',
    ]
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
        messages.append(
            'If generated artifacts already contain the expected changes but consumers still behave stale, suspect local dependency drift before making more source edits.'
        )
        messages.append(
            'For Cabloy Start, apply the same reverse-chain logic but resolve the Start-specific flavor names and generated-output paths from the active Start repo before executing edition-specific steps.'
        )
    return ' '.join(messages)


def _read_text(path: Path):
    try:
        return path.read_text(encoding='utf-8')
    except Exception:
        return None


def _read_staged_text(rel_path: str):
    result = subprocess.run(
        ['git', 'show', f':{rel_path}'],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode != 0:
        return None
    return result.stdout


def _iter_staged_paths():
    result = subprocess.run(
        ['git', 'diff', '--cached', '--name-only', '--diff-filter=ACMR'],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode != 0:
        return []
    return [line.strip() for line in result.stdout.splitlines() if line.strip()]


def _has_forward_proof(rel_paths):
    return any('/zova/' in f'/{rel_path}' and _path_contains_any(f'/{rel_path}', FORWARD_PROOF_PATH_MARKERS) for rel_path in rel_paths)


def _has_reverse_proof(rel_paths):
    return any('/zova/' in f'/{rel_path}' and '/src/.metadata/' in f'/{rel_path}' for rel_path in rel_paths)


def _proof_summary(findings, rel_paths):
    needs_forward = any(result['forward_reason'] for _, result in findings)
    needs_reverse = any(result['reverse_reason'] for _, result in findings)
    return {
        'needs_forward': needs_forward,
        'needs_reverse': needs_reverse,
        'has_forward_proof': _has_forward_proof(rel_paths),
        'has_reverse_proof': _has_reverse_proof(rel_paths),
    }


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

    message = _build_messages(result)
    print(json.dumps({
        'hookSpecificOutput': {
            'hookEventName': 'PostToolUse',
            'additionalContext': message,
        },
        'systemMessage': message,
    }))
    return 0


def run_pre_commit():
    rel_paths = _iter_staged_paths()
    findings = []
    for rel_path in rel_paths:
        abs_path = ROOT / rel_path
        if not _is_code_file(abs_path):
            continue
        content = _read_staged_text(rel_path)
        if content is None:
            continue
        result = _analyze(abs_path.as_posix(), content)
        if _has_signal(result):
            findings.append((rel_path, result))

    if not findings:
        return 0

    proof = _proof_summary(findings, rel_paths)
    missing_proofs = []
    if proof['needs_forward'] and not proof['has_forward_proof']:
        missing_proofs.append('forward proof')
    if proof['needs_reverse'] and not proof['has_reverse_proof']:
        missing_proofs.append('reverse proof')

    lines = [
        'Contract-loop pre-commit gate: staged changes may affect Cabloy\'s bidirectional contract loop.',
        '',
        'Review these staged files:',
    ]
    for rel_path, result in findings:
        branches = []
        if result['forward_reason']:
            branches.append('forward chain')
        if result['reverse_reason']:
            branches.append('reverse chain')
        lines.append(f"- {rel_path} ({', '.join(branches)})")

    lines.extend([
        '',
        'Artifact-proof status:',
        f"- forward proof present: {'yes' if proof['has_forward_proof'] else 'no'}",
        f"- reverse proof present: {'yes' if proof['has_reverse_proof'] else 'no'}",
        '',
        'Required review before commit:',
        '- if backend contract truth changed, verify the emitted OpenAPI/contract output and regenerate the frontend consumer path',
        '- keep forward follow-up thin: prefer semantic model facades and reuse the existing resource-owner when the custom API still belongs to the same resource',
        '- if backend metadata/tooling consumes changed frontend resources in Cabloy Basic Admin, run `npm run build:zova:admin` and then `npm run deps:vona`',
        '- if generated artifacts already contain the expected changes but consumers still behave stale, suspect local dependency drift before more source edits',
        '- for Cabloy Start, keep the same contract-loop model but resolve Start-specific flavor names and output paths from the active Start repo',
    ])

    if missing_proofs:
        lines.extend([
            '',
            'Missing artifact proofs:',
        ])
        if 'forward proof' in missing_proofs:
            lines.extend([
                '- forward proof is missing: stage the regenerated frontend consumer artifacts, typically under `zova/src/**/api/**`',
            ])
        if 'reverse proof' in missing_proofs:
            lines.extend([
                '- reverse proof is missing: stage refreshed frontend metadata under `zova/src/**/.metadata/**` when it is available. If the real handoff only appears in `.zova-rest`, treat this gate result as a conservative reminder and use deliberate review or the bypass after you verify the reverse sync flow manually.',
            ])
        lines.extend([
            '- if the proof exists outside git-tracked files and you still want to proceed, use the bypass explicitly after review',
        ])

    if os.environ.get(BYPASS_ENV) == '1':
        lines.extend([
            '',
            f'Bypass detected via {BYPASS_ENV}=1; continuing commit after surfacing the contract-loop reminder.',
        ])
        print('\n'.join(lines))
        return 0

    if missing_proofs:
        detail = ', '.join(missing_proofs)
        if missing_proofs == ['reverse proof']:
            lines.extend([
                '',
                f'Commit blocked conservatively: missing {detail}. If reverse proof only exists through `.zova-rest`, verify the reverse sync flow manually and then re-run with {BYPASS_ENV}=1.',
            ])
        else:
            lines.extend([
                '',
                f'Commit blocked: missing {detail}. Stage the corresponding regenerated artifacts or re-run with {BYPASS_ENV}=1 after deliberate review.',
            ])
        print('\n'.join(lines), file=sys.stderr)
        return 1

    lines.extend([
        '',
        f'Artifact proofs are present. Commit still requires deliberate review; re-run with {BYPASS_ENV}=1 if you want to proceed.',
    ])
    print('\n'.join(lines), file=sys.stderr)
    return 1


if __name__ == '__main__':
    if '--pre-commit' in sys.argv:
        raise SystemExit(run_pre_commit())
    raise SystemExit(run_claude_hook())
