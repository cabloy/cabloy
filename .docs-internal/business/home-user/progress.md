# Home User 账户设置交付进度

## 用途和权威

本文是 [PDP/WBS](./pdp-wbs.md) 的派生执行登记：记录当前范围的工作状态、已保留证据、未关闭决定、阻塞项和下一步证明。它不重述或取代 [PRD](./prd.md)、[SRS](./srs.md)、[测试计划](./test-plan.md) 或 [ADR 0001](./decisions/0001-account-settings-boundaries.md)。

```text
PRD requirement -> SRS contract -> PDP/WBS task -> ATP scenario -> observed evidence
```

截至本文初版，只有内部规划文档被创建；账户设置产品功能、测试、生成产物或运行时证据均尚未交付。

## 状态定义

| 状态                      | 含义                                                                     |
| ------------------------- | ------------------------------------------------------------------------ |
| `not-started`             | 已定义，但尚未开始实现或验证。                                           |
| `in-progress`             | 正在实现或验证，尚未满足完成条件。                                       |
| `implementation-complete` | 实现任务已完成，但尚无全部所需 ATP 证据。                                |
| `verified`                | 对应 ATP 已通过，证据含 revision、环境、命令、结果与脱敏 artifact 位置。 |
| `blocked`                 | 存在未解决的外部依赖、决策或失败验证，不能继续关闭。                     |
| `deferred`                | 经记录后不属于本期交付；不是完成。                                       |

`verified` 不能由代码阅读、UI 手工演示、规划文件或单一浏览器截图取得。每项状态变更必须同时更新其 WBS、ATP 和证据链接。任何 waiver 均需负责人、原因与到期日期；到期 waiver 自动转为 `blocked`。

## 本期概览

| 范围                                  | 状态                      | 说明                                                                                                                                                            |
| ------------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phase 10：文档与安全决策基线          | `implementation-complete` | PRD、SRS、ADR、WBS、测试计划和本登记已创建；本次文档的本地链接、requirement-ID 追溯、根脚本存在性与 `git diff --check` 已完成。产品实现前开放决策仍登记在下表。 |
| Phase 20：Account contract 与资料边界 | `not-started`             | 尚无 Vona Account API、DTO、OpenAPI 或 profile update 实现。                                                                                                    |
| Phase 30：已有本地密码修改            | `not-started`             | 现有 `auth-simple` hash/verify 是输入，不是已交付 password-change 用例。                                                                                        |
| Phase 40：OAuth-only set-link 签发    | `not-started`             | 资格、email provenance、token、邮件和审计策略尚未实施。                                                                                                         |
| Phase 50：公开 token 消费与首个凭据   | `not-started`             | 现有 reset callback 为 `Not Implemented`，不构成本期能力。                                                                                                      |
| Phase 60：共享 UI 与 Web/Admin 入口   | `not-started`             | 当前 Admin 菜单只有 Logout；Web 尚无账户入口。                                                                                                                  |
| Phase 70：集成与发布证据              | `not-started`             | 无 ATP、构建、生成或 E2E 证据。                                                                                                                                 |
| Phase 80：未登录 password-reset       | `deferred`                | 必须以独立需求、契约和验收记录规划与交付。                                                                                                                      |

## WBS 执行登记

| WBS ID          | 工作项                                 | 状态                      | 依赖/阻塞                                              | 证据                                                                                       |
| --------------- | -------------------------------------- | ------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `WBS-HUA-10-01` | 冻结规划权威和实施前决策门             | `implementation-complete` | 实现前产品/技术决策仍需按 Phase 20+ 的实际开始范围关闭 | `EVD-HUA-PLAN-01`：本地链接、requirement-ID 追溯、根脚本存在性和 `git diff --check` 已通过 |
| `WBS-HUA-20-01` | 当前账户 capability/read contract      | `not-started`             | `WBS-HUA-10-01`；controller/tag/matcher 决策           | `ATP-HUA-ACC-01`、`ATP-HUA-CTR-01`：未执行                                                 |
| `WBS-HUA-20-02` | profile update 边界与 Passport 同步    | `not-started`             | `WBS-HUA-20-01`；字段/头像决策                         | `ATP-HUA-PRO-01`、`ATP-HUA-PRO-02`、`ATP-HUA-PAS-01`：未执行                               |
| `WBS-HUA-20-03` | Account contract-loop 检查             | `not-started`             | `WBS-HUA-20-01`；OpenAPI matcher 决策                  | `ATP-HUA-CTR-01`：未执行                                                                   |
| `WBS-HUA-30-01` | authenticated password-change contract | `not-started`             | Phase 20；密码策略与 auth-simple 用例归属              | `ATP-HUA-PWD-01`：未执行                                                                   |
| `WBS-HUA-30-02` | 会话失效和审计原子结果                 | `not-started`             | `WBS-HUA-30-01`；token adapter 精确语义、审计/限流设计 | `ATP-HUA-SES-01`、`ATP-HUA-AUD-01`、`ATP-HUA-RATE-01`：未执行                              |
| `WBS-HUA-40-01` | server-derived 资格与 set-link issue   | `not-started`             | Phase 20/30；可信验证 email 来源                       | `ATP-HUA-SET-01`、`ATP-HUA-SET-02`、`ATP-HUA-RATE-01`：未执行                              |
| `WBS-HUA-40-02` | password-set purpose-bound token       | `not-started`             | `WBS-HUA-40-01`；TTL、存储、撤销和并发消费决策         | `ATP-HUA-TOK-01`：未执行                                                                   |
| `WBS-HUA-50-01` | 公开 password-set 页面和消费 action    | `not-started`             | `WBS-HUA-40-02`；canonical route/token 表现            | `ATP-HUA-TOK-01`、`ATP-HUA-SSR-03`：未执行                                                 |
| `WBS-HUA-50-02` | 创建首个 auth-simple 凭据              | `not-started`             | `WBS-HUA-50-01`；事务/会话结果                         | `ATP-HUA-TOK-01`、`ATP-HUA-SES-01`、`ATP-HUA-AUD-01`：未执行                               |
| `WBS-HUA-60-01` | 共享 Account 页面、Model、locale       | `not-started`             | Phase 20/30/50 合约可用                                | `ATP-HUA-UI-01`、`ATP-HUA-PAS-01`：未执行                                                  |
| `WBS-HUA-60-02` | Web public-SSR workspace shell         | `not-started`             | `WBS-HUA-60-01`；Web admission/hydration 实现          | `ATP-HUA-SSR-01`：未执行                                                                   |
| `WBS-HUA-60-03` | Admin 与 Web 入口接入                  | `not-started`             | `WBS-HUA-60-01`；Web 入口位置决定                      | `ATP-HUA-SSR-02`、`ATP-HUA-UI-01`：未执行                                                  |
| `WBS-HUA-70-01` | 集成、证据与发布关闭                   | `not-started`             | 全部前置 WBS                                           | 全部适用 `ATP-HUA-*`：未执行                                                               |
| `WBS-HUA-80-01` | future password-reset recovery         | `deferred`                | 另行批准的产品和技术记录                               | 后续独立 ATP：未规划                                                                       |

## 开放决策登记

这些项目是实现前决策门，不是默认实现授权。关闭决策时，应先更新其权威 PRD/SRS/ADR，再更新此派生登记。

| ID           | 决策                                                                         | 当前状态 | 关闭所需信息                                                  | 影响范围                         |
| ------------ | ---------------------------------------------------------------------------- | -------- | ------------------------------------------------------------- | -------------------------------- |
| `DEC-HUA-01` | Account controller/tag 与 Home API `operations.match`/`ignore` 归属          | `open`   | 确认可生成的 operation family，检查 emitted OpenAPI           | `WBS-HUA-20-01`、`WBS-HUA-20-03` |
| `DEC-HUA-02` | profile 白名单、清除/规范化规则与头像归属证明                                | `open`   | 确认现有媒体/文件能力和 DTO 语义                              | `WBS-HUA-20-02`                  |
| `DEC-HUA-03` | 新密码统一策略和错误分类                                                     | `open`   | 明确 policy 来源与本地化错误约定                              | `WBS-HUA-30-01`、`WBS-HUA-50-01` |
| `DEC-HUA-04` | 合格验证 email 的可信来源、允许 provider 和资格失效                          | `open`   | 确认 provider claim 与已有 verified-email 数据语义            | `WBS-HUA-40-01`                  |
| `DEC-HUA-05` | password-set token 的持久化/哈希、TTL、覆盖、撤销、canonical path 和原子消费 | `open`   | 选择 purpose-bound 机制并定义竞争结果                         | `WBS-HUA-40-02`、`WBS-HUA-50-*`  |
| `DEC-HUA-06` | 改密/首个设置后的精确会话处理                                                | `open`   | 验证 token adapter 能否保留当前而撤销其他；否则批准全撤销回退 | `WBS-HUA-30-02`、`WBS-HUA-50-02` |
| `DEC-HUA-07` | 审计事件、限流维度和邮件投递失败/重试边界                                    | `open`   | 确认可用基础设施及不可泄露字段                                | `WBS-HUA-30-02`、`WBS-HUA-40-*`  |
| `DEC-HUA-08` | 持久化字段/表与 `vonaModule.fileVersion` 策略                                | `open`   | 若需要 schema 变更，先征得 fileVersion 决定                   | 所有可能触及 schema 的 WBS       |
| `DEC-HUA-09` | Web 已登录账户入口的准确位置                                                 | `open`   | 与 Web 布局/用户工作区现有体验对齐                            | `WBS-HUA-60-03`                  |

## 当前证据索引

| 证据 ID           | 类型          | 状态          | 内容                                                                                                                                                 |
| ----------------- | ------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `EVD-HUA-PLAN-01` | 文档基线      | `passed`      | PRD、SRS、ADR、WBS、测试计划、进度登记之间的本地链接、requirement-ID 追溯、引用 root script 存在性与 `git diff --check` 已通过；仅内部规划文档变化。 |
| `EVD-HUA-API-01`  | 后端/API      | `not-started` | 直接 API self-service scope、profile/update、password 和 capability ATP 结果。                                                                       |
| `EVD-HUA-TOK-01`  | 安全/并发     | `not-started` | set-link issue/consume、purpose、expiry、replay、竞争、审计和会话策略结果。                                                                          |
| `EVD-HUA-SSR-01`  | SSR/hydration | `not-started` | Web anonymous shell、Admin session SSR、public token page 和 direct API 边界结果。                                                                   |
| `EVD-HUA-CTR-01`  | contract-loop | `not-started` | emitted OpenAPI、generated consumer、Web/Admin paired build 和 `deps:vona` 结果。                                                                    |
| `EVD-HUA-E2E-01`  | 浏览器验收    | `not-started` | `@account`、`@web`、`@admin` 场景的合成/脱敏证据。                                                                                                   |

## 更新规则和下一步

1. 先关闭 `DEC-HUA-01` 至 `DEC-HUA-08` 中每一项与即将开始 WBS 直接相关的决定；若引入持久化 schema 变更，先询问 `vonaModule.fileVersion` 是否提升。
2. 从 `WBS-HUA-20-01` 开始，以 Vona contract truth、emitted OpenAPI、生成消费者和直接 API ATP 形成第一批可保留证据。
3. 对每个安全状态变更补充独立 `mockCtx(...)` 竞争测试、`finally` 清理和脱敏 artifact，之后才可标为 `verified`。
4. 前端共享体验完成后，按 reverse chain 构建 Web 与 Admin，再同步 Vona；Web public SSR 和 Admin session SSR 必须分别验收。
5. 忘记密码在独立批准前始终保持 `deferred`，不得因复用 `password-set` 基础设施改写其状态。

## 相关记录

- [Home User 账户设置 PRD](./prd.md)
- [Home User Account Settings SRS](./srs.md)
- [Home User Account Settings PDP/WBS](./pdp-wbs.md)
- [Home User Account Settings Test Plan](./test-plan.md)
- [ADR 0001：建立 Home User 账户设置边界](./decisions/0001-account-settings-boundaries.md)
