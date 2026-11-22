# Cabloy AI

Provider-neutral AI SDK v7 integration for Vona, with code-configured provider factories, instance-local provider/model overrides, code-owned `AiScene` beans, an AI facade and persisted private text chat. The companion Zova module provides the authenticated chat page.

- [AI Guide: configuration, scene calls and private chat](../../../../repo-docs/backend/ai-guide.md)
- [Frontend suite](../../../../zova/src/suite/cabloy-ai/README.md)
- [MVP scope and acceptance](../../../../repo-specs/cabloy-ai/README.md)

The MVP has no management UI, tools, external MCP, workflow engine or resumable/background streaming. Credentials remain server-side. Test-mode model mocks do not establish live-provider interoperability.
