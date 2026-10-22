# Status and Evidence Update Rules

This reference defines how `cabloy-spec-execution` closes observed work without turning derived records into a second authority.

## Authority and update order

The suite’s `test-plan.md` owns ATP definitions, procedures, expected outcomes, evidence format, and release gates. The PRD, SRS, ADRs, and WBS remain authoritative for product scope, technical contracts, durable decisions, dependencies, and completion checks.

For ordinary execution that does not change authority:

1. sanitize and review actual evidence before durable retention;
2. update a dedicated phase/ATP evidence record when the suite convention supports it;
3. update a rollout or operational handoff record when it is part of the established suite flow;
4. update `progress.md` with derived status, evidence pointers, blockers, and next proof;
5. with complete supported README/WBS/ATP/progress inputs, regenerate both charts last, then run `npm run spec:charts:check -- <suite>`; otherwise report the exact lightweight/legacy omission rather than forcing definitions.

Refresh applicable charts after display-affecting status/evidence/review changes and README title/language edits. Labels, accessibility, and metadata follow README language. Charts cannot conceal authority conflicts.

Keep `spec:check` definition/reference/chain/link validation, chart model/freshness, and human approval/evidence as independent gates. A static pass is not ATP proof or ADR/execution acceptance. A legacy definition gap requires an approved authority repair, not an invented business contract or a matrix/evidence mention promoted into a definition.

Some Basic suites retain observed evidence inline in `test-plan.md`. Preserve the existing convention rather than introducing duplicate evidence stores. If the procedure, expected result, evidence requirement, release gate, or delivery scope changes, update the owning authority first and then reassess existing evidence before updating progress.

Do not use `progress.md` to add requirements, technical contracts, acceptance procedures, dependencies, or architecture decisions. Do not modify unrelated WBS rows or rewrite historical evidence for presentation.

## Evidence layout

Retain the minimum sufficient evidence required by the test plan and attribution rules below. Prefer existing test-runner reports, redacted logs, and concise ATP/progress pointers rather than duplicating their contents across receipt layers. Do not create full input snapshots, exhaustive hash manifests, custom evidence verifiers, or multilayer receipts by default; new evidence machinery needs an explicit test-plan requirement or a concrete attribution/integrity risk that existing artifacts cannot address. Preserving source hashes during sanitization does not require inventing a new all-input hashing system. Keep mandatory revision/worktree attribution, actual failures, privacy review, and historical evidence intact unless a separate approved consolidation follows the lifecycle rules below.

Prefer the scalable phase/ATP layout for newly observed proof when the suite permits extensions:

```text
evidence/
└── phase-<NN>/
    ├── index.md
    ├── ATP-<DOMAIN>-<CAPABILITY>-<NN>.md
    └── artifacts/
        └── <date>-<revision>-<scope>.md|log
```

A dedicated ATP evidence record should include:

- linked PRD, SRS, WBS, and ATP IDs;
- source revision or commit;
- clean/dirty worktree classification; for dirty proof, a patch or diff digest and clear changed-file scope;
- database, environment, flavor/site, and configuration class when relevant;
- exact command, API procedure, browser procedure, or CI job;
- synthetic fixtures and explicit concurrency interleaving where relevant;
- expected and observed result, including failures;
- durable redacted log, response, screenshot, CI job, or artifact location;
- superseded evidence and reconciliation note when newer proof replaces an older record;
- waiver owner, reason, affected IDs, expiry, and compensating control when applicable.

Do not retain credentials, raw tokens, signed callback state, secrets, live provider identifiers, or real customer/payment data. Redaction is part of the evidence record, not an informal afterthought.

Do not create an empty `evidence/` directory, placeholder `EVD-*` record, or fabricated artifact merely to satisfy a traceability table. A command written in a test plan or dossier is prospective until it is actually executed and retained.

## Machine-local paths before retention

Sanitize compiler output, CLI banners, stderr, exception stacks, and path-bearing JSON/diffs before saving or sharing them. Paths inside the observed checkout should be repository-root-relative, not relative to the evidence file. Use stable aliases such as `<MAIN_CHECKOUT>` for other roots; do not collapse unrelated roots into the same identity. Avoid raw intermediate logs and `tee` before sanitization. This does not intercept tool/terminal output automatically; callers must route both producer streams through the sanitizer. Do not capture secret-bearing output merely because a path tool is present.

Verify the active root scripts first. The path-only commands are:

```bash
# Bash; use a new output filename, never overwrite an existing record.
set -o pipefail
set -o noclobber
npm run --silent test:agent-governance 2>&1 | npm run --silent evidence:sanitize > evidence.pending.txt
stage_status=( "${PIPESTATUS[@]}" )
printf 'producer_exit=%s sanitizer_exit=%s\n' "${stage_status[0]}" "${stage_status[1]}"
# Only check/retain the artifact if sanitizer_exit is 0; preserve producer failure.
if [ "${stage_status[1]}" -eq 0 ]; then
  npm run --silent evidence:check -- -- evidence.pending.txt
fi
```

The producer above is an example verification command, not authorization to run unrelated tests. Retain evidence only after evaluating **both** producer and sanitizer statuses and reviewing sensitive data. `pipefail` prevents a failed producer from appearing successful because sanitization succeeded; it does not preserve every stage's exact exit code. When exact codes matter, capture Bash's `PIPESTATUS` immediately after the pipeline (Zsh: `pipestatus`) before running another command, and record each result. Do not let `set -e` abort before capturing a known failing verification result. A failed sanitizer may already have emitted earlier sanitized lines: its partial output is not acceptable evidence.

The pipeline above is Bash-specific. For Windows/PowerShell, consult `repo-docs/reference/repo-scripts.md#windows-and-powershell`: preserve UTF-8 bytes and each native process's exit status; PowerShell's final `$LASTEXITCODE` alone does not record both stages. Do not reuse Bash/Zsh status syntax in PowerShell or retain a raw intermediate file to work around encoding.

The tool defaults to its owning checkout, not the shell's working directory. `--repo-root` changes that root; repeatable `--map 'ROOT=ALIAS'` declares other absolute roots without retaining their physical locations in output. Use the same mappings for sanitization and checking. Consult `repo-docs/reference/repo-scripts.md#evidence-path-sanitization` for supported path forms, scan limits and exit codes. Unknown roots/encodings and semantic paths need manual review; the checker must not be described as a universal privacy or secret scanner. Excluded or unsupported inputs mean incomplete coverage, not clean evidence. Keep checks explicitly scoped to the intended artifacts rather than a broad repository scan.

Preserve command flags, diagnostic codes, line/column information, failures, exit codes, and source-file hashes. Source hashes refer to original source bytes, not sanitized log bytes. A path-redacted historical patch is not byte-exact or apply-ready; label it accordingly. Redaction is presentation-only, not a rerun, new approval, ATP success, or status advancement. A passing path check proves only the declared path-recognition coverage and does not replace secret/customer-data review or the test plan's evidence gate.

## Status vocabulary

Use the suite’s canonical status meanings:

| Status                    | Meaning                                                                                                                                                                 |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `not-started`             | Defined, but implementation or acceptance evidence has not started.                                                                                                     |
| `in-progress`             | Work or verification has started, but closure checks remain.                                                                                                            |
| `planning-complete`       | An opted-in documentary/design-only WBS task has a named-reviewer, revision-scoped planning-closure disposition and retained planning proof; not source or ATP closure. |
| `implementation-complete` | Source work is reported complete, but required ATP or release evidence is incomplete.                                                                                   |
| `verified`                | Applicable WBS checks and ATPs passed, with durable traceable evidence containing revision, environment, exact procedure, result, and redacted artifact location.       |
| `blocked`                 | A dependency, unresolved decision, failed gate, attribution problem, or missing required proof prevents closure.                                                        |
| `waived`                  | A temporary exception has an owner, reason, affected scope, and expiry; expiry becomes a release blocker.                                                               |
| `deferred`                | Explicitly postponed scope; it is not complete or verified.                                                                                                             |

The normal path is:

```text
not-started -> in-progress -> implementation-complete -> verified
```

A genuinely documentary/design-only task can instead follow `not-started -> in-progress -> planning-complete`, but only when its formal WBS declaration contains `Completion mode: planning-only.`, its own checks have revision-scoped documentary evidence, and a named reviewer explicitly records the planning-closure disposition. `authority-only` traceability is not this opt-in. `planning-complete` satisfies a predecessor dependency edge but never grants successor execution approval, accepts another ADR, completes source, or passes a linked prospective runtime ATP. The Gantt shows its status separately; verified totals and the burndown's active-minus-verified remainder still count only `verified`. `implementation-complete`, `waived` and `deferred` are not completed prerequisites. `blocked`, `waived`, and `deferred` are explicit states, not shortcuts to completion. Mark an implementation task `in-progress` only after approved implementation or verification actually begins. A generated file, successful scaffold, passing typecheck, code review, manual walkthrough, screenshot, or unrelated broad test pass cannot by itself produce `verified`.

A task may be `implementation-complete` when source work is complete but an ATP, browser check, paired build, release gate, redaction decision, or durable artifact remains. A phase can be verified without implying that a separately defined integration or release phase is verified.

## Evidence lifecycle and consolidation

Retain artifacts for a named ongoing development need, an applicable acceptance/retention requirement, or unique information still needed to explain a result. Creation alone and hypothetical future usefulness are not reasons for permanent retention. Maintained source-controlled business tests provide ongoing regression protection; historical run artifacts record only what happened for their attributed revision and do not prove changed code remains correct.

Keep current delivery state, coverage gaps, and blockers concise in the existing progress/phase records. Retain key acceptance results and only the supporting primary evidence and revision/dirty-worktree attribution they still require. Move durable discoveries needed for further development into the owning source tests, design record, or issue/handoff instead of depending on an artifact chain. Retired one-shot runners, resolved diagnostic detail, repeated inventories/snapshots, and documentary receipts need not remain permanently when they have no such purpose or unique information.

Inspect before deleting or overwriting historical material and obtain explicit approval for the consolidation/deletion scope, including replacement of any earlier unchanged-retention commitment. Preserve meaningful successes, failures, waivers, and gaps truthfully; retain primary proof required by continuing acceptance claims. Update incoming links and state when old hash-based verifiers are retired or no longer applicable rather than recreating their dependency chains. Do not delete by extension or Git status, replace the clutter with a giant archive or a new manifest/checker system, or promote acceptance status. Reorganizing existing evidence alone does not require rerunning business tests; verify affected references and records with existing tools. This guidance does not itself authorize cleanup or override a controlling retention requirement.

## Historical evidence and supersession

Evidence is revision- and authority-scoped. When source paths, generated artifacts, contracts, scope, or security assumptions change:

1. identify affected prior evidence;
2. retain it for history;
3. mark it superseded, invalidated, or requiring rerun with the reason and replacement condition;
4. run the applicable ATP again;
5. update the phase index and progress only after the new result is observed.

Do not trust a later progress summary over a contradictory, more recent ATP/artifact record without reconciling chronology and authority. Do not erase failures, expired waivers, or evidence gaps.

## Progress update contract

Locate `WBS ID` and `Status` by header names in the execution register, not fixed cell positions; preserve other/reordered columns and require unique selected rows. Update only the selected task/phase’s derived fields unless an authority change was explicitly approved:

- current status;
- last reviewed revision/date;
- concise evidence pointer;
- blocker or waiver details;
- exact next proof/action;
- supersession note when prior proof no longer applies.

When the worktree is dirty, record that the result is not reproducible from the base SHA alone and retain an appropriate patch/diff digest. Do not attribute unrelated local changes to the selected task.

A resumable handoff should state:

```text
WBS / phase:
Status:
Revision and worktree:
Scope and exclusions:
Authority and ownership:
Completed gates/evidence:
Commands/procedures actually run:
Commands/procedures still required:
Blocker or decision needed:
Next single action:
```

The “next single action” is a handoff, not authorization to execute the next WBS item automatically.
