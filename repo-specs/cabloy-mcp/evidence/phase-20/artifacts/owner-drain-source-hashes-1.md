# Inert admitted-run drain source attribution

Observed on 2026-10-18, Cabloy Basic, Node v24.8.0 / pnpm 11.5.2. Approval preflight HEAD `e7e9a13e95cb6f059e913a4f0b43faee99a4de31`; tested HEAD `1bccbeb743a70b075319661b17bb58c49d3a30c7` plus the three dirty source files below. The external commit contains exactly the sixteen carried preflight files, each matching its preflight SHA-256; none is a drain source target. No assistant commit/staging occurred. HEAD alone does not reproduce this test.

| Original source bytes                                                                    | SHA-256                                                            |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/productionRequestOwner.ts`         | `e16df84ecbcc159c5cfebeaffdbdf5c5c66b75f06a295fa55bb74520ff7189e4` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/productionBoundary.test.ts`           | `dfcc64db7fa52658846a5f611da2a057e346c8baf39c396909da2e95714db508` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/support/productionBoundaryFixture.ts` | `783c4bd297a46f3ad91b7fdc3c421f7beb8f4fab9daeb0a6d55e09da37c71c67` |

The runtime log embeds these same hashes. [Display diff](./owner-drain-diff-1.patch) SHA-256: `b8086397d6b0fa8d8dfaf164f83da60414bab60269fa67030b60c79552de4516`; presentation-sanitized, not apply-ready. Twelve unrelated carried files are byte-identical; only README/index/progress/dossier are permitted carried-record updates. Probe, ingress test and test-vona metadata are preserved. Staging index empty. No generated metadata/manifests/lockfiles changed.
