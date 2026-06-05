# Redis Guide

This page migrates the highest-value ideas from the legacy Vona Redis documentation.

## Why Redis matters in Vona

Redis is not a niche optional integration in Vona. It underpins several distributed capabilities across the framework.

The legacy docs show that Redis supports a broad set of roles such as:

- cache
- queue and schedule
- broadcast
- redlock
- other internal distributed services

That makes Redis part of the Cabloy backend foundation rather than just an external service attachment.

## Config model

The legacy docs organize Redis configuration around:

- `base`
- `clients`

This is important because Vona treats Redis as a multi-client capability surface rather than as one undifferentiated connection.

Representative built-in client roles include:

- `default`
- `cache`
- `io`
- `summer`
- `model`
- `redlock`
- `queue`
- `broadcast`

## Key-prefix isolation

The legacy docs also highlight `keyPrefix` support.

This matters because multiple projects or components may share Redis infrastructure, and keyspace isolation is a practical requirement rather than an afterthought.

## Independent client configuration

For larger systems, different distributed components can use independent Redis client configuration.

That is important because queue, broadcast, locking, and caching may have different operational needs.

## Adding a new Redis client

The legacy docs describe a typed extension model:

1. add client type definition
2. add client config
3. retrieve the client through the Redis bean

This is valuable because Redis usage remains part of the typed application model.

## Why this matters for AI workflows

When AI touches distributed or cache-heavy backend code, it should ask:

1. which Redis client role is the right one for this behavior?
2. does the existing config already define the needed client?
3. should the change preserve key-prefix isolation?
4. does the capability belong at the cache, queue, redlock, or broadcast layer rather than as an ad hoc Redis call?

That keeps Redis usage aligned with the framework’s architecture.
