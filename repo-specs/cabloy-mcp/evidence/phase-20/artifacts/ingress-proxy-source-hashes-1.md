# Ingress Proxy Partial Source Attribution

Observed 2026-10-18 at Basic HEAD `e7e9a13e95cb6f059e913a4f0b43faee99a4de31` plus dirty source and attributable planning/approval records. These are original source-byte hashes, not runtime qualification.

| Source                                                                           | SHA-256                                                            |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `vona/src/suite-vendor/a-test/modules/test-vona/src/bean/aop.mcpIngressProbe.ts` | `3dbfb4cd63482d2dd6417d51aba18ad708a71cdc74c4e3e86a1083af9b3a0978` |
| `vona/src/suite-vendor/a-test/modules/test-vona/src/.metadata/index.ts`          | `99d3e76a881d1490c241dd29192f4ed6c528d288eda4a1c001707b4cbcc7353d` |
| `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/ingressProxy.test.ts`         | `eb0dbfef5228ce740ef6ea077db55351515f809b1679cd4ef4c4e43b033e6be6` |

## Generated drift classification

- Baseline metadata SHA-256: `1106fd00c6868c13daf37cfb98e7e8f56c08b73c6048780c7b9757ef77df794e`.
- Generated metadata SHA-256: `99d3e76a881d1490c241dd29192f4ed6c528d288eda4a1c001707b4cbcc7353d`.
- Baseline section order (duplicates preserved): `aop, aopMethod, entity, entity, entity, model, model, model, model, bean, bean, service, service, service, broadcast, broadcast, cacheMem, cacheMem, cacheRedis, cacheRedis, event, event, event, eventListener, meta, meta static, meta asset, queue, queue, schedule, serializerTransform, summerCache, summerCache, dto, dto, controller, controller, config, locale, error, scope`.
- Generated section order (duplicates preserved): `entity, entity, entity, model, model, model, model, schedule, dto, dto, controller, controller, aop, aopMethod, bean, bean, service, service, service, broadcast, broadcast, cacheMem, cacheMem, cacheRedis, cacheRedis, event, event, event, eventListener, meta, meta static, meta asset, queue, queue, serializerTransform, summerCache, summerCache, config, locale, error, scope`.
- Section names and per-name multiplicity preserved; named blocks compared in occurrence order, not collapsed into a map. Only `aop` differs within its block. All between-block gaps compare byte-identical.
- CLI output nevertheless moves existing blocks outside the approved new-advice export/declaration-only delta. This triggers the dossier section-12 stop condition; no semantic equivalence or runtime pass is inferred.
- Tracked metadata numstat: 1006 insertions, 993 deletions. No manual metadata correction, restoration or generator/framework change was made.

## Display artifact

[Sanitized source display diff](./ingress-proxy-diff-1.patch) includes the tracked metadata diff and both new authored files. It is presentation-only, not an apply-ready patch or proof of qualification. No staged/committed result is implied.
