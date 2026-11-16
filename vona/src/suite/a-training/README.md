# Training suite

This is the Cabloy Basic training example suite. Use this README as the entry point for its backend and frontend usage.

- Backend: [`training-student`](modules/training-student/), [`training-record`](modules/training-record/) and [`training-recordsubject`](modules/training-recordsubject/).
- Frontend: [Zova `training-student`](../../../../zova/src/suite/a-training/modules/training-student/), using the backend resource/DTO contracts for Admin forms, tables and image presentation.
- Shared capabilities: [Backend Image Guide](../../../../repo-docs/backend/image-guide.md), [Frontend Image Guide](../../../../repo-docs/frontend/image-guide.md), [MCP Controller Tools](../../../../repo-docs/mcp/mcp-controller-tools.md) and [MCP authorization](../../../../repo-docs/mcp/mcp-browser-authorization.md).

The modules must be present in the active application composition. The Student MCP Actions target the ordinary Admin Site (`basic-siteadmin:admin`, external resource `/mcp/admin`), not Web. A menu entry or known tool name is not an authorization grant.

## Student images through MCP

Use the generic [Cabloy MCP image skill](../../../../repo-client-governance/skills/cabloy-mcp-image/SKILL.md) with an already connected, authorized client. It describes contract discovery, scene-policy lookup, local-copy preparation, upload and complete resource binding; there is no Student-specific photo command.

For Student, the stored image field is `imageId`, paired with the `image` preview relation. Resolve its `rest.form.options.imageScene` from the current resource contract and read that scene's upload policy before preparing a copy. Do not infer the scene or hardcode processing settings from this example. The current Student scene publishes public images, so confirm that publishing the selected photo is appropriate; public visibility does not authorize upload or Student updates.

Browser forms and Agents share one complete `DtoStudentUpdate`. Read the Student under independent view authority, project its editable values and existing nested identities onto the current update input, change `imageId`, and submit the complete body under update authority. An image-only body is rejected. A mobile matching the serialized masked format is accepted but omitted from the database mutation, preserving the stored value; an unmasked value follows normal validation and writing. There is no concurrency/version check, so a full submission can overwrite intervening edits.

Image upload and Student binding remain separate writes. Follow the skill's recovery boundary: do not automatically retry uncertain mutations or re-upload after acknowledged image creation; preserve the returned image identity and inspect current resource state before explicitly completing a failed binding. For API and authorization details, see [MCP image upload](../../../../repo-docs/mcp/mcp-controller-tools.md#json-image-upload).
