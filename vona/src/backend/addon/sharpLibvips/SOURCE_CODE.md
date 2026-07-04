# Source code and upstream references for bundled sharp-libvips binaries

This directory redistributes unmodified binaries from the upstream `@img/sharp-libvips-*` packages:

- `linux-arm64.node` from `@img/sharp-libvips-linux-arm64@1.3.1`
- `linux-x64.node` from `@img/sharp-libvips-linux-x64@1.3.1`

Primary upstream sources:

- `sharp-libvips` source repository: <https://github.com/lovell/sharp-libvips>
- `sharp` package homepage: <https://sharp.pixelplumbing.com>
- `libvips` upstream source repository: <https://github.com/libvips/libvips>

Version references used by the current Cabloy integration:

- Upstream package version: `1.3.1`
- Expected bundled `libvips` version: `8.18.3`

Replacement and relinking note:

- These binaries are redistributed as separate shared-library artifacts for use with `sharp`.
- Recipients may replace them with a compatible build obtained from the upstream package family or from upstream source projects, subject to compatibility with the surrounding `sharp` package version.

Local packaging note:

- Cabloy does not claim authorship of the third-party binaries in this directory.
- If a future Cabloy release updates the bundled `sharp-libvips` version, update this file, `NOTICE.md`, and the related notice/license files to match the new upstream package version.
