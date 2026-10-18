# Ingress Proxy Runtime Projection

Read-only projection from both sanitized managed logs on 2026-10-18. Each command exited 0 with one selected test passed, zero failed, normal graceful app shutdown and unchanged source hashes. The existing runner fails a successful test command if its cleanup result is not `cleaned`; producer 0 therefore reports runner-managed cleanup completion, not an independent Redis forensic audit. Both exact run-owned data/generated directories are absent after exit. No manual cleanup ran.

```json
[
  {
    "branch": "included",
    "runId": "20261018051038-f896b894",
    "event": {
      "alias": "included",
      "proof": "startup-proxy",
      "outcome": "observed",
      "seq": 1,
      "matched": true,
      "wrapped": true,
      "transparent": true,
      "calls": 2,
      "closed": true,
      "listenerRestored": true
    },
    "logSha256": "e42a2c1d3a8ec2d7a5406691e3180d78c90d71ad76e4ef79a78dd0ab8267899c",
    "ownedDataRootAbsent": true,
    "ownedGeneratedRootAbsent": true
  },
  {
    "branch": "excluded",
    "runId": "20261018051146-a4f976b2",
    "event": {
      "alias": "excluded",
      "proof": "startup-proxy",
      "outcome": "observed",
      "seq": 1,
      "matched": false,
      "wrapped": false,
      "transparent": false,
      "calls": 0,
      "closed": true,
      "listenerRestored": true
    },
    "logSha256": "f87c0d4803f5cd20d781482809c986cad603dc3cf4e954063863ecc2f0dfc093",
    "ownedDataRootAbsent": true,
    "ownedGeneratedRootAbsent": true
  }
]
```

Events retain only fixed enums, booleans and finite counters. Each run has one event, under 512 UTF-8 bytes and 16 KiB total; sequence starts at 1. Two fresh run identities are distinct. Owner exclusion is not MCP disablement or hot-uninstall proof. Ignored full logs remain local only; this projection does not make them remotely durable.
