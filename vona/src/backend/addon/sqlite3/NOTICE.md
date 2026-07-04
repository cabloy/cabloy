# Third-party notice for bundled sqlite3 native binaries

This directory redistributes the following unmodified upstream binaries:

- `linux-arm64.node` from `better-sqlite3@12.11.1`
- `linux-x64.node` from `better-sqlite3@12.11.1`

Upstream package information:

- Package: `better-sqlite3`
- Homepage: <https://github.com/WiseLibs/better-sqlite3>
- Source repository: <https://github.com/WiseLibs/better-sqlite3>
- Declared package license: `MIT`

Bundled upstream component notice:

- The `better-sqlite3` native binary is built together with a bundled SQLite amalgamation.
- The bundled SQLite source included by the upstream package identifies itself as public-domain source code and includes the standard SQLite blessing notice.
- See `SQLITE_NOTICE.md` and `SOURCE_CODE.md` in this directory for the bundled SQLite version and upstream source references.

Included compliance files:

- `LICENSE.MIT.txt`: full MIT license text used by the upstream `better-sqlite3` package
- `SQLITE_NOTICE.md`: notice for the bundled SQLite amalgamation included in the native module build
- `SOURCE_CODE.md`: upstream source and version references for both `better-sqlite3` and SQLite

Local redistribution notes:

- Cabloy redistributes the binaries in this directory as third-party artifacts.
- Unless otherwise stated in a file-level notice, the binaries in this directory are unmodified copies of the upstream package contents.
- If you redistribute these binaries further, keep this notice and the accompanying license/notice files with them.
