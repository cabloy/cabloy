# Cabloy AI frontend

The `cabloy-ai` module provides the authenticated private chat page at
`/cabloy/ai/chat`. Create a conversation, send a text message, and revisit saved
history. Stop cancels the browser transport and checks the authoritative saved
run/history; it does not promise resumable or background generation.

- [AI usage, configuration, and streaming contract](../../../../repo-docs/backend/ai-guide.md)
- [Backend suite entry point](../../../../vona/src/suite/cabloy-ai/README.md)

The page uses session SSR for authorized saved conversation/history data. Live
responses start only on interaction. The owning Model manages private queries
without browser persistence and aborts obsolete streams on conversation,
account, or page changes.
