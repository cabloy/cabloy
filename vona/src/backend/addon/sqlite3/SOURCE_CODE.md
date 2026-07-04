# Source code and upstream references for bundled sqlite3 native binaries

This directory redistributes unmodified native binaries from the upstream `better-sqlite3` package:

- `linux-arm64.node` from `better-sqlite3@12.11.1`
- `linux-x64.node` from `better-sqlite3@12.11.1`

Primary upstream sources:

- `better-sqlite3` source repository: <https://github.com/WiseLibs/better-sqlite3>
- `better-sqlite3` package page: <https://www.npmjs.com/package/better-sqlite3>

Bundled SQLite source references used by the upstream package:

- SQLite project website: <https://www.sqlite.org/>
- The upstream `better-sqlite3` package bundles SQLite amalgamation sources under `deps/sqlite3/` when building `better_sqlite3.node`.
- In the inspected upstream package contents, the helper script downloads SQLite source archive `sqlite-src-3530200.zip` and generates the bundled amalgamation used for the native build.

Version references used by the current Cabloy redistribution:

- `better-sqlite3` package version: `12.11.1`
- Bundled SQLite version identified from `sqlite3.h`: `3.53.2`
- SQLite source id identified from `sqlite3.h`: `2026-06-03 19:12:13 d6e03d8c777cfa2d35e3b60d8ec3e0187f3e9f99d8e2ee9cac695fd6fcdf1a24`

Local packaging note:

- Cabloy does not claim authorship of the third-party binaries in this directory.
- If a future Cabloy release updates the bundled `better-sqlite3` binary version or its bundled SQLite amalgamation, update this file and the related notice/license files to match the new upstream versions.
