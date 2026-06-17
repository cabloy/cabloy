#!/usr/bin/env python3
import json
import sys
from pathlib import Path

ROOT = Path('/Volumes/my-data/cabloy-multirepo/cabloy-basic')


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


payload = json.load(sys.stdin)
file_path = _normalize_path(payload.get('tool_input', {}).get('file_path'))
if not file_path or not _is_code_file(file_path):
    sys.exit(0)

try:
    content = file_path.read_text(encoding='utf-8')
except Exception:
    sys.exit(0)

needs_reverse_sync = False
reason = None
path_text = file_path.as_posix()

if '/vona/src/' in path_text and _contains_any(content, [
    'zova-rest-cabloy-basic-admin',
    ':actionSummary',
    ':actionDeleteForce',
    'tableActionRow(',
]):
    needs_reverse_sync = True
    reason = 'Vona file consumes Zova Admin render/action metadata.'
elif '/zova/src/' in path_text and _contains_any(content, [
    "declare module 'zova-module-a-openapi'",
    'IResourceTableActionRowRecord',
    '@TableCell<',
    'actionSummary',
    'actionDeleteForce',
]):
    needs_reverse_sync = True
    reason = 'Zova Admin action/render metadata changed.'

if not needs_reverse_sync:
    sys.exit(0)

message = (
    'Reverse-sync gate: this change touches the Vona↔Zova Admin metadata handoff. '
    'Before considering the task done, run `npm run build:zova:admin` and then '
    '`npm run deps:vona`. Do not treat `build:rest:cabloyBasicAdmin` alone as sufficient. '
    f'{reason}'
)
print(json.dumps({
    'hookSpecificOutput': {
        'hookEventName': 'PostToolUse',
        'additionalContext': message,
    },
    'systemMessage': message,
}))
