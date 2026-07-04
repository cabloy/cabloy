# Notice for bundled SQLite amalgamation

The upstream `better-sqlite3@12.11.1` package used for these binaries bundles SQLite source code into the native module build.

Version references identified from the upstream package contents:

- SQLite version: `3.53.2`
- SQLite source id: `2026-06-03 19:12:13 d6e03d8c777cfa2d35e3b60d8ec3e0187f3e9f99d8e2ee9cac695fd6fcdf1a24`

The bundled SQLite header in the upstream package includes the following notice:

> The author disclaims copyright to this source code. In place of a legal notice, here is a blessing:
>
> May you do good and not evil.
> May you find forgiveness for yourself and forgive others.
> May you share freely, never taking more than you give.

Local redistribution note:

- Cabloy does not claim authorship of SQLite or of the `better-sqlite3` package.
- This file is included to preserve attribution and provenance information for the bundled SQLite amalgamation used when building `better_sqlite3.node`.
