# Status and Evidence Update Rules

This reference defines how `cabloy-spec-execution` closes observed work without turning derived records into a second authority.

## Authority and update order

The suite’s `test-plan.md` owns ATP definitions, procedures, expected outcomes, evidence format, and release gates. The PRD, SRS, ADRs, and WBS remain authoritative for product scope, technical contracts, durable decisions, dependencies, and completion checks.

For ordinary execution that does not change authority:

1. retain actual evidence;
2. update a dedicated phase/ATP evidence record when the suite convention supports it;
3. update a rollout or operational handoff record when it is part of the established suite flow;
4. update `progress.md` last with derived status, evidence pointers, blockers, and next proof.

Some Basic suites retain observed evidence inline in `test-plan.md`. Preserve the existing convention rather than introducing duplicate evidence stores. If the procedure, expected result, evidence requirement, release gate, or delivery scope changes, update the owning authority first and then reassess existing evidence before updating progress.

Do not use `progress.md` to add requirements, technical contracts, acceptance procedures, dependencies, or architecture decisions. Do not modify unrelated WBS rows or rewrite historical evidence for presentation.

## Evidence layout

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

## Status vocabulary

Use the suite’s canonical status meanings:

| Status | Meaning |
| --- | --- |
| `not-started` | Defined, but implementation or acceptance evidence has not started. |
| `in-progress` | Work or verification has started, but closure checks remain. |
| `implementation-complete` | Source work is reported complete, but required ATP or release evidence is incomplete. |
| `verified` | Applicable WBS checks and ATPs passed, with durable traceable evidence containing revision, environment, exact procedure, result, and redacted artifact location. |
| `blocked` | A dependency, unresolved decision, failed gate, attribution problem, or missing required proof prevents closure. |
| `waived` | A temporary exception has an owner, reason, affected scope, and expiry; expiry becomes a release blocker. |
| `deferred` | Explicitly postponed scope; it is not complete or verified. |

The normal path is:

```text
not-started -> in-progress -> implementation-complete -> verified
```

`blocked`, `waived`, and `deferred` are explicit states, not shortcuts to completion. Mark a task `in-progress` only after approved implementation or verification actually begins. A generated file, successful scaffold, passing typecheck, code review, manual walkthrough, screenshot, or unrelated broad test pass cannot by itself produce `verified`.

A task may be `implementation-complete` when source work is complete but an ATP, browser check, paired build, release gate, redaction decision, or durable artifact remains. A phase can be verified without implying that a separately defined integration or release phase is verified.

## Historical evidence and supersession

Evidence is revision- and authority-scoped. When source paths, generated artifacts, contracts, scope, or security assumptions change:

1. identify affected prior evidence;
2. retain it for history;
3. mark it superseded, invalidated, or requiring rerun with the reason and replacement condition;
4. run the applicable ATP again;
5. update the phase index and progress only after the new result is observed.

Do not trust a later progress summary over a contradictory, more recent ATP/artifact record without reconciling chronology and authority. Do not erase failures, expired waivers, or evidence gaps.

## Progress update contract

Update only the selected task/phase’s derived fields unless an authority change was explicitly approved:

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
