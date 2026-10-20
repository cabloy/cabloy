# B foundation — Basic-main bounded qualification

Main revision: 5901a258220a2a9885ec540cce6a6b2ef244c2b4. Current fourteen-path SHA256 set is in freeze.json and handoff.json. Only two test import-expression layouts changed in this correction; canonical URL targets and private issuance/provisioning boundaries remain unchanged.

## Observed checks

- B3: exit 0; 11758 ms; valid bounded capture, no tracked/source drift.
- B4: exit 0; 10727 ms; valid bounded capture, no tracked/source drift.
- B5: exit 0; 4514 ms; valid bounded capture, no tracked/source drift.
- B14: exit 0; 183 ms; valid bounded capture, no tracked/source drift.
- B15: exit 0; 1311 ms; valid bounded capture, no tracked/source drift.
- B6: exit 0; 465 ms; 7 tests, all passed, no skipped/cancelled/todo; valid bounded capture, no tracked/source drift.
- B7: exit 0; 89 ms; 4 tests, all passed, no skipped/cancelled/todo; valid bounded capture, no tracked/source drift.
- B8: exit 0; 16558 ms; 4 tests, all passed, no skipped/cancelled/todo; valid bounded capture, no tracked/source drift.
- B9: exit 0; 16027 ms; 4 tests, all passed, no skipped/cancelled/todo; valid bounded capture, no tracked/source drift.
- B10: exit 0; 16014 ms; 16 tests, all passed, no skipped/cancelled/todo; valid bounded capture, no tracked/source drift.
- B11: exit 0; 23951 ms; 2 tests, all passed, no skipped/cancelled/todo; valid bounded capture, no tracked/source drift.
- B2: retained earlier applicable pass; not re-executed. Only module tests changed; core/production dependency source unchanged.
- Total actual tests this correction: 37, all passed.

## Counts and custody

Cumulative actual producer invocations: 42; managed: 10; deps/preruns: 15. Historical wrong-checkout calls remain counted and are not qualification. Exact counts are in handoff.json.

Four new managed runs exited successfully through the isolated runner's mandatory cleanup-success path. Exact claim, cleanup-lock, data and generated roots are absent; source-backed cleanup attestation is not an independently retained DB/Redis receipt. See custody entries. Earlier wrong-checkout custody gaps remain unresolved. No manual cleanup or signals were used.

## Boundaries

- B12/B13 absent in main and not executed; require separately approved return synchronization and MCP-worktree compatibility checks
- Suite evidence/progress/charts publication not performed in this source-only main increment
- Earlier failures and wrong-checkout custody limitations remain retained; not erased or converted to passes
- No production provisioning/admission/activation, full ATP, parent WBS or release closure

No commit, push, return synchronization, production integration, configuration/schema changes or suite-status promotion. Authority audit/charts/docs were not rerun because no suite records changed. Path sanitation is not secret scanning or acceptance proof.

## Next action

Approve return synchronization of the exact main-owned fourteen-path source increment and bounded MCP compatibility/evidence handoff; do not copy MCP source/spec/tests into main.
