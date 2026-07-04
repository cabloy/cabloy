# Third-party notice for bundled sharp-libvips binaries

This directory redistributes the following unmodified upstream binaries:

- `linux-arm64.node` from `@img/sharp-libvips-linux-arm64@1.3.1`
- `linux-x64.node` from `@img/sharp-libvips-linux-x64@1.3.1`

Upstream package information:

- Package family: `@img/sharp-libvips-*`
- Homepage: <https://sharp.pixelplumbing.com>
- Source repository: <https://github.com/lovell/sharp-libvips>
- Declared package license: `LGPL-3.0-or-later`

Related upstream project:

- `libvips`: <https://github.com/libvips/libvips>

Included compliance files:

- `COPYING.LESSER-3.0.txt`: GNU Lesser General Public License version 3 text
- `THIRD_PARTY_NOTICES.md`: upstream third-party notices for bundled libraries

Local redistribution notes:

- Cabloy redistributes the binaries in this directory as separate shared-library artifacts for use with `sharp`.
- Unless otherwise stated in a file-level notice, the binaries in this directory are unmodified copies of the upstream package contents.
- No additional Cabloy license term in this directory is intended to restrict rights granted by the LGPL for covered libraries.

Source and replacement information:

- The upstream package version used for this redistribution is `1.3.1`.
- The bundled library version expected by the current Cabloy integration is `libvips 8.18.3`.
- Recipients may replace these binaries with a compatible build obtained from the upstream package or upstream source projects.
- For additional component-level license references, see `THIRD_PARTY_NOTICES.md`.
