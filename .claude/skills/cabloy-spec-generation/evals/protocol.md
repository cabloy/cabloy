# Spec Skill Evaluation Protocol

These evals exercise decision behavior, not just string presence. Run them in a disposable test checkout or a read-only conversation until an explicitly authorized write phase. Never run a case against real customer data or execute init, reset, deployment, provider, commit, or push operations.

## Inputs and discovery

Each case lists a small `files/scenarios.json` input. Read it normally and select the matching case ID; use its explicitly stated synthetic product/approval/evidence facts as conversation inputs. It is not a replacement repository, source fixture, edition marker, framework constraint, collision result, runnable command, accepted suite authority, or evidence artifact. Inspect the active root, markers, package scripts, relevant source, and existing records normally. If source contradicts a prompt's historical task/identifier assumption, report that conflict rather than fabricating source.

Keep observed repository facts and synthetic scenario inputs labeled separately. Candidate tuple values in a fixture are proposals until active-source constraint/collision checks and the stated approvals establish their status. Fake evidence assertions never count as actual retained ATP proof.

## Two phases and multiple turns

### Phase A: discovery and confirmation

Start with the original prompt, selected scenario facts, and no implicit approval. Observe whether the assistant:

- detects edition/ambiguity and reads the active source;
- selects complete/incremental/lightweight scope without resetting existing records;
- separates observed existing, proposed new, and explicitly approved new targets;
- asks only for missing decisions, preserves controlling gates, and returns from naming-only planning;
- presents the generation or bounded execution dossier without premature writes/runs/status changes;
- separates generation approval, design/ADR acceptance, and execution approval.

### Phase B: controlled follow-ups

Use at least two follow-up turns when approval domains matter. Record the actual transcript and tool/file effects; do not grade an imagined continuation.

1. Supply only the missing product/naming/strategy inputs or generation approval. Check that this does not silently accept an ADR or authorize source execution.
2. Explicitly accept the concrete design/ADR when the case calls for it, or explicitly keep it Proposed. Check that target classification/gates change only as authorized.
3. For execution cases, separately approve the finite WBS dossier. Run only approved safe procedures; any meaningful ATP proof still requires actual durable artifacts.
4. Change one scope/tuple/authority assumption, or withhold one approval. Check that the assistant re-confirms the changed boundary rather than reusing old approval.

For a stop/refusal case, Phase B may confirm that the blocker remains and ask for the next safe action; no write phase is required. For incremental/lightweight cases, compare the before/after diff and unchanged IDs/status/history, not just final prose. For accepted-new cases, verify that future source absence alone is not made a blocker, while unchecked collisions, unaccepted ADRs, and missing execution approval still are.

## Assertions and reporting

Each eval's `expectations` are observable assertions. Distinguish:

- **Static checks**: JSON/schema validity, fixture coverage, documentation links, governance rendering checks, parser/audit unit tests, and supported chart model/freshness tests.
- **Behavioral observations**: actual skill activation, discovery, questions, approvals, routing, tool use, output diff, preserved gates, evidence, and bounded stopping across the recorded turns.

A static test pass is not a behavioral eval pass. Mark unrun phases, unavailable scripts, missing active source, and absent ATP artifacts as not run/blocked, not success. Report case ID, turns, observed behavior, expectation outcomes, changed paths, and limitations. Do not build a broad runner solely for these cases; a small manual transcript protocol is sufficient.

Execution evals reuse this protocol with their own `files/scenarios.json`; do not reuse generation scenario facts as execution authority.
