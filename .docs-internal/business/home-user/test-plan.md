# Home User 账户设置测试策略和验收计划

## 目的和权威

本文定义 Home User 账户设置的验证策略、可执行验收场景、证据格式和发布证明。它完成以下规划追溯链：

```text
PRD requirement -> SRS contract -> PDP/WBS task -> ATP scenario -> observed evidence
```

[PRD](./prd.md) 拥有产品成果和业务验收，[SRS](./srs.md) 拥有 API、安全、状态和 SSR 契约，[PDP/WBS](./pdp-wbs.md) 拥有交付顺序。本计划只规定如何证明它们，不能重定义任一决策。

所有 `ATP-HUA-*` 初始为 planned/unverified。规划文档不是实现、测试或生产证据。

## 范围和质量优先级

本计划覆盖不能依赖手工页面置信度接受的风险：

1. 当前 Passport-only 的自助身份范围和直接 API 授权；
2. 资料字段白名单、受控头像归属和 Passport/偏好同步；
3. 已有本地密码用户的当前密码校验、密码策略、原子变更和会话失效；
4. OAuth-only 用户显式 email 输入的受限 candidate 绑定、既有 email 匹配和设置首个密码资格；
5. `password-set` 的用途隔离、短时、单次、重放/过期/竞争安全；
6. 安全审计、限流和密码/token/身份数据红线；
7. Web Account session SSR、匿名 route admission 和 hydration 等价；
8. Admin session SSR、Site 准入和 Vona API 授权的分离；
9. Web/Admin 共用能力、各自导航入口和独立表单状态；
10. Vona/OpenAPI/Zova generated contract 与配对 SSR/REST artifact 同步。
11. 登录注册、匿名 reset 请求的枚举防护、URL query token transport、credential replacement、会话撤销和 reissue/consume 竞争。

email/mobile 绑定验证、地址级 email provenance 迁移、MFA、设备/会话管理 UI、OAuth 账号管理、管理员编辑他人账户和任意外部头像 URL 均不在本期 ATP 范围。

## 验证模型

### 窄范围验证

优先运行拥有变更不变量的最小 backend module-local tests。Vona 作用域测试必须拥有 `app.bean.executor.mockCtx(...)`；每个有意竞争的 caller 在独立 `mockCtx(...)` 中执行。竞争证明应显式并发操作并断言组合后的持久结果，不得依赖 node:test runner 并行度或调度。

每个测试在 `finally` 中以精确拥有身份、反向依赖顺序删除全部测试持久资源。共享 seed 只能通过 owning module 的 `meta.version.ts` `seed()` 创建，并由测试视为只读。

### Contract 验证

变更 Vona DTO、controller 或 API schema 时，先完成后端 contract truth、检查 emitted OpenAPI，再生成 Zova consumer。变更共享 Account 的 Zova route/metadata/page/resources 时，必须构建 Web 与 Admin 的 paired SSR/REST outputs，再运行 `npm run deps:vona`；单独 REST output 不足以证明同步。

### 全量关闭验证

Phase 70 前完成各能力的 focused tests、OpenAPI/生成验证、Web/Admin SSR/hydration、Playwright 浏览器验收 journey、type/lint/format 与所需 root checks。直接 API 安全验收必须独立于 Playwright 浏览器验收。

## 测试层和预期归属

| 测试层                        | 目的                                                             | 预期归属                                                               |
| ----------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Account service/action tests  | 自助范围、资料白名单、凭据状态和错误结果                         | `vona/src/suite/a-home/modules/home-user/test/`                        |
| Credential/token tests        | 密码校验、hash 更新、会话策略、token issue/consume/竞争          | 最终选定的 `home-user`、`auth-simple` 和 token 基础设施模块测试目录    |
| Transaction/integration tests | 原子变更、失败回滚、独立 context 竞争和 durable outcome          | owning Vona 模块-local `test/**/*.ts`                                  |
| Contract tests                | OpenAPI operation/schema/guard 与生成 consumer 对齐              | Vona OpenAPI 输出、`home-api` generation、paired flavor builds         |
| SSR/document tests            | Web/Admin session admission、hydration 等价和公开 token 页面安全 | matching Home/site owner tests 与 Basic Playwright HTTP/browser checks |
| Playwright browser acceptance | Web/Admin 导航、共用页面、独立区块、用户旅程和 locale            | `e2e/specs/home-user-account.spec.ts` 中的 `@account` 场景             |

现有测试专用 activation endpoint 只能作为受控 fixture 准备辅助；它不是生产 Account Settings API、密码策略或邮件/token 流程的验收替代。

## Fixture 和数据处理规则

### 最小 fixture 集

每个相关测试组合至少准备：

- 当前账户 A：有 `auth-simple` 的可用用户；
- 当前账户 B：OAuth-only 且有非空、合成 `EntityUser.email` 的用户，用于既有地址规范化匹配/mismatch；
- 当前账户 C：OAuth-only 且无 `EntityUser.email` 的用户，用于短时 token-bound candidate 与成功消费时绑定；
- 另一个同实例用户和必要时不同实例用户，用于所有权/隔离否定测试；
- Admin Site 准入用户及 Web Site 准入用户；
- 有效、过期、已消费、错误 purpose、被覆盖和竞争消费的合成 `password-set` token 状态，以及 candidate 已被另一 current-instance 用户拥有或账户 email 在签发后变化的状态；
- 已归属、外部/无归属、类型无效和大小无效的头像引用状态（取决于已选择的媒体测试机制）。

### 证据和敏感数据

每个接受的 ATP 记录：

- PRD、SRS、WBS 和 ATP 引用；
- source revision、数据库、flavor/Site；
- 精确命令、fixture 与并发交错说明；
- pass/fail 结果和保留日志、响应、截图或 artifact 位置；
- 只含合成或脱敏数据的输出；
- 任一临时 waiver 的负责人、原因和到期日期。

不得保留明文密码、password hash、原始 token、可用邮件链接、完整敏感 email、真实身份数据、认证内部 ID 或未批准安全日志。过期 waiver 是发布阻塞项。

## 验收场景

| ATP ID            | 场景与最低证明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 主要追溯                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `ATP-HUA-ACC-01`  | 匿名 caller 被拒绝；合法 caller 只读取/修改当前 Passport 用户；伪造 `userId`、另一个 user、Site/menu/Admin 角色均不能扩大自助范围。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `PRD-ACC-01`–`PRD-ACC-04`; `SRS-ACC-*`; `WBS-HUA-20-01`                                                   |
| `ATP-HUA-PRO-01`  | 合法用户仅可更新许可 profile 字段；未知、登录标识、角色、账号状态和内部 auth 字段不会持久化或形成部分更新。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `PRD-PRO-01`–`PRD-PRO-02`; `SRS-PRO-01`; `WBS-HUA-20-02`                                                  |
| `ATP-HUA-PRO-02`  | 无效、外部、无归属或不合规头像引用失败；经批准受控引用成功。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | `PRD-PRO-03`; `SRS-PRO-02`; `WBS-HUA-20-02`                                                               |
| `ATP-HUA-PAS-01`  | 资料保存后 Account 状态、`$passport.user`、Admin 身份菜单和 Web 账户体验无需全页刷新即反映新的 name/avatar/locale/tz；失败不应用未持久化偏好。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | `PRD-PRO-04`–`PRD-PRO-05`; `SRS-PRO-03`–`SRS-PRO-04`; `WBS-HUA-20-02`, `WBS-HUA-60-01`                    |
| `ATP-HUA-PWD-01`  | 有 `auth-simple` 用户只有在正确当前密码、合规新密码和确认一致时成功；错误当前密码、弱密码、确认不一致和 OAuth-only 分支没有部分凭据变更；服务端账户状态、密码策略和本地化错误分类均符合已批准契约。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `PRD-PWD-01`, `PRD-PWD-02`, `PRD-PWD-03`; `SRS-PWD-*`; `WBS-HUA-30-01`                                    |
| `ATP-HUA-SES-01`  | 成功改密或首个密码设置后，旧/当前认证延续严格符合选定会话策略；旧密码失败，新密码成功；不能仅依靠浏览器登出伪装 server-side 失效。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `PRD-PWD-04`–`PRD-PWD-05`, `PRD-SET-06`; `SRS-SES-01`; `WBS-HUA-30-02`, `WBS-HUA-50-02`                   |
| `ATP-HUA-SET-01`  | OAuth-only 当前账户必须显式提交格式有效 email，subject 仍仅由 Passport 派生。已有 `EntityUser.email` 时，trim/case 规范化匹配才投递至该既有地址；mismatch 不发邮件、不建/覆盖 state，且已有 `auth-simple` 仍走改密而非 set-link。服务端不得从 auth provider 记录推导收件人。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | `PRD-SET-01`, `PRD-SET-02`; `SRS-SET-01`–`SRS-SET-03`; `WBS-HUA-40-01`                                    |
| `ATP-HUA-SET-02`  | 空 `EntityUser.email` 的 OAuth-only 用户可签发 token-bound candidate；签发前不得写入 email，只有有效/current/one-time token 成功创建首个凭据时才原子写入。expired/replay/superseded、地址变化、已有 owner、并发两个用户竞争同一 candidate 和事务失败均不得留下错误绑定或部分凭据。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `PRD-SET-03`–`PRD-SET-04`; `SRS-SET-02`; `WBS-HUA-40-01`, `WBS-HUA-50-02`                                 |
| `ATP-HUA-TOK-01`  | 无 token、malformed、expired、revoked、superseded、wrong-purpose、wrong-path 和 replay token 安全失败；有效 URL `?token=` 至多由一个并发 caller 成功消费并创建首个凭据，fragment/hash token 不受支持。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | `PRD-SET-04`–`PRD-SET-05`, `PRD-SEC-02`; `SRS-TOK-*`; `WBS-HUA-40-02`, `WBS-HUA-50-*`                     |
| `ATP-HUA-AUD-01`  | 改密、password-set/reset 签发、消费 token 与拒绝结果产生要求的审计；响应、日志、Passport、截图和证据不含密码/hash/raw token/未批准敏感资料。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | `PRD-SEC-03`; `SRS-AUD-*`, `SRS-PWD-04`; `WBS-HUA-30-02`, `WBS-HUA-50-02`, `WBS-HUA-80-*`                 |
| `ATP-HUA-RATE-01` | password-set/reset issue/consume 操作执行已批准的限流与滥用策略；拒绝不跨用户/实例泄露状态，也不创建意外 token/副作用。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `PRD-SEC-01`; `SRS-SET-03`, `SRS-RST-01`, `SRS-AUD-02`; `WBS-HUA-30-02`, `WBS-HUA-40-01`, `WBS-HUA-80-02` |
| `ATP-HUA-SSR-01`  | 未认证 Web 对 canonical Account route 的 server/browser admission 转 Login 并保留安全 return destination；已登录硬刷新用 session SSR 首屏渲染 Account，hydration 初树等价；Site denial 和 direct API denial 分别证明。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | `PRD-UX-03`; `SRS-SSR-01`; `WBS-HUA-60-02`                                                                |
| `ATP-HUA-SSR-02`  | Admin session SSR、Site admission、缓存/私有呈现及 direct Account API 授权彼此独立且符合规格。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | `PRD-ACC-02`, `PRD-UX-03`; `SRS-SSR-02`; `WBS-HUA-60-03`                                                  |
| `ATP-HUA-SSR-03`  | 携带 `?token=` 的公开 password-set 页在 server/hydration 首渲不泄露 token 或预填密码；公开 route 不绕过 token/密码/审计检查，hydration 后恢复 token-free canonical URL。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `PRD-SET-04`, `PRD-SEC-02`; `SRS-TOK-03`, `SRS-SSR-03`; `WBS-HUA-50-01`                                   |
| `ATP-HUA-UI-01`   | Web 和 Admin 都有批准入口并到达共享 Account 能力；profile/security 卡片保持独立 draft/loading/success/error；按 capability 显示改密或设置密码。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `PRD-ACC-02`, `PRD-UX-01`–`PRD-UX-02`; `SRS-UI-*`; `WBS-HUA-60-01`, `WBS-HUA-60-03`                       |
| `ATP-HUA-CTR-01`  | Account Vona DTO/controller/OpenAPI 真相到达预期 Home API generated consumer；Web/Admin paired SSR/REST artifacts 和 `deps:vona` 同步，没有生成文件手改。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `PRD-ACC-03`, `PRD-UX-03`; `SRS-API-*`; `WBS-HUA-20-03`, `WBS-HUA-70-01`                                  |
| `ATP-HUA-REG-01`  | Login 注册入口加载生成 schema 与 CAPTCHA 并发出真实 public register 请求；默认 activation-pending 注册保留安全 return destination、显示确认邮件提示且不导航到 403/受保护 Account。只有已获当前 Site 准入的 registration result 才建立 Passport 状态并采用正常安全 return navigation。                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `PRD-REG-01`; `SRS-REG-01`; `WBS-HUA-80-01`                                                               |
| `ATP-HUA-RST-01`  | 有效 CAPTCHA 后，eligible、unknown、disabled、unactivated/no-local-credential、cooldown、mail/config failure 具有相同外部 accepted 结果；不签发不合格 token。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | `PRD-RST-01`–`PRD-RST-02`; `SRS-RST-01`–`SRS-RST-02`; `WBS-HUA-80-02`                                     |
| `ATP-HUA-RST-02`  | Zova 生成 token-free absolute consumer URL；Vona 仅接受 HTTP(S)、无 userinfo/query/fragment，并由 `checkOriginExact(...)` 允许精确同源（协议、host、有效端口）或精确匹配既有 `a-security:cors` `whiteList` 的 origin；`dev/test` 中 API 与 consumer 都为 loopback hostname 时允许不同端口。验证 Vona 保留受信前端 pathname、仅添加 `token`，且既不读取/校验 SSR Site、`publicPath`、`siteId`，也不以 request/proxy Host 证明之外的 lookalike、suffix、异协议或异端口跨源、`SERVER_SERVE_*`、`Referer`、浏览器输入 pathname 或 CORS wildcard/suffix 授权目的地；覆盖 mounted pathname、TTL、replay、supersession、错误 payload、资格变化、同 token 并发及“读取 A 后 B 成为 current”的交错安全；无效 URL 不发信、不留 state 且保持中性结果；仅 B 可完成 replacement。 | `PRD-RST-03`; `SRS-RST-02`–`SRS-RST-03`; `WBS-HUA-80-03`                                                  |
| `ATP-HUA-RST-03`  | 携带 synthetic `?token=` 的 reset route SSR/hydration 初树不含 token/private identity；hydration 后恢复 canonical URL 且 token 不进 storage；invalid/reused token nondiagnostic，成功后显式重新登录。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `PRD-RST-03`–`PRD-RST-04`; `SRS-RST-03`–`SRS-RST-04`; `WBS-HUA-80-04`                                     |

## Contract、SSR 和浏览器验证程序

实施时按 WBS 选择最窄有意义的检查，然后在 Phase 70 扩展：

```bash
# 发现/运行最终拥有 Account 不变量的 Vona module-local tests
npm run vona -- :bin:test -- <selected-home-user-and-auth-tests> --flavor=normal

# Vona Account DTO/controller 变更后：检查 emitted OpenAPI，再生成预期 Home API consumers
npm run zova :openapi:generate home-api

# Shared Web/Admin frontend route, metadata, page or resource 变更后：双 flavor 配对产物，再同步 Vona
npm run build:zova:web
npm run build:zova:admin
npm run deps:vona

# Closure checks，按变更和环境适用性执行
npm run tsc
npm run lint
npm run format
npm run test
npm run test:e2e home-user-account -- --grep @account
```

任何 `meta.version.ts` 修改均要求 `npm run test`。测试标签至少应包括 `@account`，并分别带 `@web` 或 `@admin`；tagged E2E 只有在对应产品实现存在后才创建和执行。

本次只是内部规划文档变更，不运行生成、构建、依赖同步、E2E 或广泛代码测试。它们是未来 WBS 实施门的命令，而非本次文档的证据。

## 发布关闭门

本期只有在以下条件全部满足后可以交付：

- 所有适用 `PRD-*`、`SRS-*` 与 `WBS-HUA-*` 都有一个或多个通过的 `ATP-HUA-*` 证据；
- 所有直接 API、token 竞争、会话策略、审计/红线、Web SSR/hydration、Admin SSR、Web/Admin 导航和生成 contract 路径均分别证明；
- 未存在到期 waiver 或未解释的生成/类型/SSR 产物漂移；
- retained evidence 只使用合成/脱敏数据，并包含 revision、环境、命令和结果；
- 注册与 password-reset 的公开契约、后端竞争测试和前端/浏览器 ATP 均按其各自 requirement-ID 保留证据；地址级 email provenance 仍是后续加固范围。

## 相关记录

- [Home User 账户设置 PRD](./prd.md)
- [Home User Account Settings SRS](./srs.md)
- [Home User Account Settings PDP/WBS](./pdp-wbs.md)
- [Home User Account Settings Delivery Progress](./progress.md)
- [ADR 0001：建立 Home User 账户设置边界](./decisions/0001-account-settings-boundaries.md)
