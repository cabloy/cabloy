# Production B package — documentary verification only

## Attribution

Prepared on 2026-10-21 at MCP base `7cc95dab17a45e6e9a53eb1b78bed1d2b111529f`, initially clean, with attributable documentary changes. Basic main was initially clean at `94adf9942349a498adc94232847fe25f4d1f3a82` and inspected read-only. The [package](../../../../wbs-mcp-20-01-production-b-package.md) and [dossier section 22](../../../../wbs-mcp-20-01-execution-dossier.md#22-production-b-contract-and-conditional-main-package-preparation-2026-10-21) define scope. This preparation does not accept contracts or authorize production execution.

`source-inventory.json` retains original-byte hashes for 29 inspected main/worktree files, their byte equality, nine authority baseline hashes and four absent proposed-path checks. `scope-and-links.json` records 12 valid local links/anchors and confirms all 29 source hashes remained unchanged. Progress content changed only in WBS-MCP-20-01's Next action cell; Markdown alignment width changed mechanically. Charts were command-regenerated and checked, with no tracked chart delta.

At postflight, main was no longer clean: external changes appeared in `vona/packages-utils/module-glob/src/index.ts` and new `vona/packages-utils/module-glob/src/suites.ts`. This preparation neither wrote nor reverted them. They are outside the inspected 29-file baseline; future execution must recheck main attribution and command discovery impact. The source inspection is revision-scoped, not a claim of a still-clean current main.

## Actual checks

| Check                                        | Observed outcome                                                                                                          |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Exact three-author-record format write/check | Both exit 0                                                                                                               |
| `npm run spec:check -- cabloy-mcp`           | Exit 0; definition/chain/link audit only                                                                                  |
| `npm run spec:charts -- cabloy-mcp`          | Exit 0; derived generation only                                                                                           |
| `npm run spec:charts:check -- cabloy-mcp`    | Exit 0; freshness only                                                                                                    |
| `npm run docs:build`                         | Exit 0; existing chunk-size warning retained                                                                              |
| First inline scope probe                     | Exit 1: compared Markdown separator width as content; diagnostic and correction retained in `scope-and-links.json`        |
| Corrected inline scope/link/source probe     | Exit 0: excludes alignment separator rows, checks every other stripped table cell; 12 links and 29 unchanged source files |

`01` through `06` logs and `verification-results.json` retain exact commands, producer/sanitizer exits, duration and byte counts. Producers were captured in memory, each stream bounded to 2 MiB, decoded as strict UTF-8, terminal-normalized and path-sanitized before retention. No raw intermediate logs were retained. No producer failed; the separate inline scope-probe failure remains visible rather than becoming an all-green claim. No historical once-only source/runtime allocation was reused.

The first final-check sequence stopped at artifact formatting: exit 2, because default ignore rules excluded the evidence README; `final-checks.json` and `07-final-checks.log` preserve that result, not a pass. The follow-up uses the observed formatter stdin interface for this evidence record (without changing ignore rules), then checks author formatting, evidence paths and diff scope. An initial follow-up capture guard also stopped (exit 1) because the npm command banner printed the `--map ROOT=ALIAS` option literally, a semantic path form not replaced by the sanitizer; no raw or partial capture was retained. The evidence checker itself had exited 0, as confirmed by an in-memory diagnostic. The final follow-up uses silent npm and explicitly aliases the command descriptor before sanitation. Actual results and both capture limitations are retained in `final-checks-followup.json` and `08-final-checks-followup.log`. That path check covers files present at invocation, not its own subsequently created capture/manifest; those final files receive a separate in-memory recognized-path check and manual marker review before write. The path tool recognizes declared repository/main/private root forms within its documented limits. It is not universal path recognition, secret scanning, authenticity, contract acceptance or ATP proof. Remaining retained content was reviewed as documentary enums, hashes, source locations and command diagnostics; no environment contents, rows/config payloads, capability/token values or resolved database filenames are retained.

`document-fingerprints.json` records final authored-document hashes and the tracked documentary diff digest. The base revision alone does not reproduce dirty documentary results. New artifact captures do not change production source applicability and are not an apply-ready patch.

## Result and next action

Finite preparation is delivered, with P1/P2/P3 still Proposed. P2's authored-default incompatibility and P3's exact private-access/active-use attachments are explicit, not silently resolved. No typecheck, runtime test, database action, installation/generation, environment operation, main write, synchronization, commit or push was performed.

WBS-MCP-20-01 and Phase 20 remain **blocked**, full ATPs **open**, verified **0/12**, release **deferred**. The next single action is one batched contract disposition with the exact target/profile/private-access attachments, then a separately approved main implementation dossier if ready. Static checks do not supply acceptance or execution approval.
