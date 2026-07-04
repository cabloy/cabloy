# Third-party notice for bundled sharp native binaries

This directory redistributes the following unmodified upstream binaries:

- `linux-arm64.node` from `@img/sharp-linux-arm64@0.35.2`
- `linux-x64.node` from `@img/sharp-linux-x64@0.35.2`

Upstream project information:

- Package family: `sharp` / `@img/sharp-*`
- Homepage: <https://sharp.pixelplumbing.com>
- Source repository: <https://github.com/lovell/sharp>
- Declared license: `Apache-2.0`

Included compliance file:

- `LICENSE.Apache-2.0.txt`: full Apache License 2.0 text used by the upstream package

Runtime dependency notice:

- These `sharp` native binaries are designed to work with the separately distributed `sharpLibvips` addon bundle in the sibling directory.
- The sibling `sharpLibvips` bundle contains libraries distributed under `LGPL-3.0-or-later` and other third-party licenses.
- See `../sharpLibvips/NOTICE.md`, `../sharpLibvips/COPYING.LESSER-3.0.txt`, and `../sharpLibvips/THIRD_PARTY_NOTICES.md` for the corresponding notices and license text.

Local redistribution notes:

- Cabloy redistributes the binaries in this directory as third-party artifacts.
- Unless otherwise stated in a file-level notice, the binaries in this directory are unmodified copies of the upstream package contents.
- If you redistribute these binaries further, keep this notice and the upstream license text with them.
