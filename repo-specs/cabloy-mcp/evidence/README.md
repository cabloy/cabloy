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
