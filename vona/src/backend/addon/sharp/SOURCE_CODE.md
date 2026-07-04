# Source code and upstream references for bundled sharp native binaries

This directory redistributes unmodified native binaries from the upstream `sharp` packages:

- `linux-arm64.node` from `@img/sharp-linux-arm64@0.35.2`
- `linux-x64.node` from `@img/sharp-linux-x64@0.35.2`

Primary upstream sources:

- `sharp` source repository: <https://github.com/lovell/sharp>
- `sharp` package homepage: <https://sharp.pixelplumbing.com>
- Repository for the npm package family: <https://github.com/lovell/sharp/tree/main/npm>

Related dependency note:

- These native `sharp` binaries are intended to be used together with the separately redistributed `sharpLibvips` bundle.
- The sibling `../sharpLibvips` directory contains the `libvips` shared-library bundle and its LGPL-related notices.

Local packaging note:

- Cabloy does not claim authorship of the third-party binaries in this directory.
- If a future Cabloy release updates the bundled `sharp` binary version, update this file and `NOTICE.md` to match the new upstream package version.
