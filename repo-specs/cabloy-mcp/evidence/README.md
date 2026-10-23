# MCP Evidence Handling

## Path redaction (2026-10-17)

At the user's request, retained Phase 10 and Phase 20 evidence has been sanitized to remove local machine and checkout locations:

- Paths inside an observed repository checkout are relative to that checkout's root, not to the evidence file. `.` denotes that root; recorded worktree names distinguish historical checkouts where needed.
- `<MAIN_CHECKOUT>` denotes the separately inspected main checkout without exposing its physical location.
- `<TEMP_DIR>` denotes an external temporary directory. Temporary directory identifiers and external directory traversal are omitted; relevant artifact basenames remain.

These are presentation-only substitutions. Recorded revisions, source-file SHA-256 values, compiler diagnostic codes, command flags, exit codes, failed attempts and successful results are preserved. Source hashes identify the original source bytes, not the sanitized log bytes. Redaction is not a rerun or new acceptance evidence and does not change WBS/ATP status.

The retained lockfile patch is a **path-redacted historical diff**, not a byte-for-byte original patch or an apply-ready recovery artifact. Temporary tarball paths are replaced consistently; package versions, integrity values and the rest of the delta remain intact. The actual lockfile is not modified by this redaction. Placeholder-bearing command excerpts describe historical execution and must not be copied as literal runnable commands.

For future retained evidence, normalize repository paths and redact external machine paths before writing or sharing command output, including compiler stderr and exception stacks. Runtime path resolution may still require absolute paths internally; do not persist those host-specific values. Prefer the phase summary and targeted excerpts over loading entire historical logs.

- [Phase 10 evidence](./phase-10/index.md)
- [Phase 20 evidence](./phase-20/index.md)
- [Single product-search business slice](./business-products-search.md) — partial catalog/dispatch proof, not production or full ATP closure.
- [Product search → detail business slice](./business-product-detail.md) — scoped verification history and context limits; no production or full ATP closure.
- [Usable local commerce MCP entry](./commerce-local-entry.md) — historical two-tool command/client flow, 11 passing business/HTTP regressions and retained failures; local verification only, no production or full ATP closure.
- [Categories → products → detail](./business-categories.md) — historical Commerce-backed delivery and synchronization; [independent mcp-test migration](./business-categories.md#independent-mcp-test-migration-2026-10-23) retains 41/41 Commerce-excluded managed tests, separate core qualification 1/1, native SDK returned-ID chain, normal TTL/root exit 0, source hashes and failures. No Commerce source delta or new real-Claude proof; parents blocked/0-of-12.
- [Local compatibility and AI-client boundary](./business-ai-client.md) — retained Claude failures, historical 14-test compatibility, parsing-isolation 3/3 and 18/18, native SDK journey/TTL; later user-supplied Claude Code 2.1.236 three-tool business journey and faithful answer passed, client exit 0 and server graceful shutdown observed. That real-client run's server root exit remains unknown; exact invocation/authentication flags are not attested. Parents blocked/0-of-12.
