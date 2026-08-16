# Home User 账户设置内部规划

本目录记录 `home-user` 账户设置的产品、技术、交付和验收基线。它是面向维护者的内部规划材料，不是终端用户产品文档。

## 阅读顺序

1. [产品需求文档](./prd.md)定义用户成果、范围、业务规则和产品验收。
2. [软件需求规格说明](./srs.md)定义自助账户 API/DTO、认证与 token、会话、审计、SSR、前端状态和技术验收契约。
3. [产品交付计划和工作分解结构](./pdp-wbs.md)定义依赖顺序、实施任务和完成检查。
4. [测试策略和验收计划](./test-plan.md)定义 `ATP-HUA-*` 场景、证据格式和发布证明。
5. [交付进度](./progress.md)记录派生的执行状态、证据、阻塞项和下一项证明；它不重定义需求或契约。
6. [ADR 0001：建立账户设置边界](./decisions/0001-account-settings-boundaries.md)记录本功能的持久领域与安全边界。

## 已确认产品基线

| 关注点       | 已确认基线                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| 仓库版本     | Cabloy Basic                                                                                                                   |
| 领域归属     | `home-user` 拥有当前用户的自助账户用例；它不是 Admin 通用 User Resource CRUD                                                   |
| 消费端       | 已登录 Web 与 Admin 用户共享账户领域、页面能力、Model 和安全规则；各 Site 仍拥有各自的入口、布局和组合                         |
| 当前账户身份 | 所有自助操作从当前 Passport 派生目标用户；客户端不能指定 `userId`                                                              |
| 个人资料     | 首版覆盖显示名称、受控头像、语言和时区；email、mobile、用户名及其他登录标识不在自由自助更新范围                                |
| 已有本地密码 | 存在 `auth-simple` 凭据时，使用当前密码、新密码和确认密码完成修改密码                                                          |
| OAuth-only   | 不存在 `auth-simple` 时，只有账户既有、已验证且可投递的 email 才可接收 `password-set` 链接                                     |
| token 用途   | 首个本地密码使用 `password-set`；未来未登录恢复使用独立的 `password-reset`，两者不得混用                                       |
| SSR          | Web 账户页默认保持 public-SSR 的匿名安全 shell，并在浏览器完成 Passport/Site 准入后加载私有资料；Admin 遵循其 session SSR 行为 |
| 明确延后     | 未登录忘记密码闭环、邮箱/手机号绑定与验证、MFA、设备/会话管理 UI、OAuth 账号管理和管理员编辑他人账户                           |

当前源代码中，`auth-simple` 已具备哈希和校验基础但没有已交付的修改密码用例；现有密码重置 callback listener 仍为 `Not Implemented`。这些是 SRS 和交付计划中的设计输入，不是已交付能力。

## 当前归属与运行时拓扑

- Vona `home-user` 当前拥有 Passport 导向的注册、登录、OAuth 和当前身份接口；账户设置需要建立明确的自助 Account 契约。
- Zova `home-passport` 拥有当前 Passport/JWT 状态和运行时偏好同步；账户资料更新后应由明确的刷新或替换契约同步该状态。
- `home-layoutadmin` 仅拥有 Admin 头像菜单呈现，当前只有退出登录；`home-layoutweb` 仅拥有 Web 布局，当前没有账户入口。二者不拥有账户领域或自助 API。
- Cabloy Basic Web 使用 `public` SSR profile，Admin 使用 `session` SSR profile。Site 准入、SSR 渲染和 Vona API 授权是不同层的责任。

## 文档权威

- PRD 拥有产品目标、范围、业务规则和产品验收。
- SRS 拥有 API/DTO、认证、token、会话、审计、状态、SSR、前端归属和技术验收契约。
- PDP/WBS 拥有交付顺序、依赖与实现完成检查。
- 测试计划拥有可执行验收场景、证据格式和发布证明。
- 进度登记只拥有状态和证据索引；它不重写 PRD、SRS、WBS 或测试程序。
- ADR 拥有跨阶段仍应保持的架构、范围和取舍决策。

文档冲突时，先更新拥有该类事实的权威文档，再更新所有下游引用和派生状态。

## 追溯链与状态规则

```text
PRD requirement -> SRS contract -> PDP/WBS task -> ATP scenario -> observed evidence
```

每一项 `verified` 状态必须有可追溯的 `ATP-HUA-*` 证据。规划文档存在不等同于功能已实现或已验证。任何临时豁免都必须包含负责人、原因和到期时间；到期豁免是发布阻塞项。

## 相关框架记录

- [ADR 0010：保持内部规划文档以仓库为原生权威](../../decisions/0010-repository-native-planning-documents.md)
- [ADR 0006：SSR Site Access and Role Model](../../decisions/0006-ssr-site-access-and-role-model.md)
- [User Workspace SSR Strategy](../../architecture/user-workspace-ssr-strategy.md)
- [SSR Request-Local Profiles](../../architecture/ssr-request-local-profiles.md)
- [Anonymous Token Route Pattern](../../architecture/anonymous-token-route-pattern.md)
- [Zova SSR Payment Return and Passport Recovery](../../architecture/zova-ssr-payment-return-passport-recovery.md)
- [Backend Test Resource Lifecycle](../../architecture/backend-test-resource-lifecycle.md)
- [Backend Auth Guide](../../../cabloy-docs/backend/auth-guide.md)
- [Backend Rate Limit Guide](../../../cabloy-docs/backend/rate-limit-guide.md)
