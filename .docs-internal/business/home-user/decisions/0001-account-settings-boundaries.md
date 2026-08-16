# ADR 0001：建立 Home User 账户设置边界

## 状态

已接受。

## 背景

Cabloy Basic 现有 `home-user` 和 Passport 能够提供当前身份、注册、登录和 OAuth 认证基础，但尚无当前用户资料编辑、修改本地密码或完整密码恢复流程。Admin 头像菜单只有退出登录，Web 布局也没有对应的账户入口。

账户设置同时涉及个人资料、认证凭据、验证邮箱、一次性 token、会话失效、审计、Web public SSR 和 Admin session SSR。若把它实现成通用 User Resource、布局中的临时代码，或现有未完成 password-reset callback 的表面延伸，领域边界和安全前提都会漂移。

## 问题

需要确定一个可供 Web 和 Admin 共用、但不混淆 Site 组合、管理端资源管理和认证安全职责的自助账户边界，并防止“设置首个密码”与未来“忘记密码”恢复流程混为同一授权模型。

## 决策

### 自助账户领域

`home-user` 拥有当前用户的自助账户用例及其面向消费者的 Account 契约。当前 Passport 是所有自助操作的唯一目标身份来源；客户端不能提交或选择目标 `userId`、认证记录 ID、验证状态或收件邮箱作为授权依据。

这不是 Admin `rest-resource` 用户编辑页面。管理员编辑他人与用户编辑自身必须维持不同的 API/DTO、授权、服务端范围、前端状态所有权和页面体验。

### Web 与 Admin 组合

Web 与 Admin 共享账户领域、页面能力、Model 和安全规则，但保留各自的入口、导航、布局和 Site 组合所有权：

- `home-layoutadmin` 只在 Admin 头像菜单中接入账户设置入口；
- Web 在适当的已登录用户入口中接入同一能力；
- 不能仅因 Admin 有 session SSR，就把 Web 用户工作区迁移到 Admin；
- Site 准入和菜单可见性从不替代 Vona API 授权。

### 三条独立的凭据流程

账户设置保留以下相互独立的流程：

1. **修改密码**：已有 `auth-simple` 凭据的已登录用户通过当前会话和当前密码修改本地密码。
2. **设置密码**：OAuth-only 用户通过当前会话和账户既有、已验证且可投递 email 的控制权，使用 `password-set` 一次性链接创建首个 `auth-simple` 凭据。
3. **忘记密码**：未登录恢复流程使用独立的 `password-reset` 用途、初始授权、审计和验收记录，作为后续单独交付。

`password-set` 与 `password-reset` 不共享 token purpose，也不因可复用邮件或一次性 token 基础设施而共享产品语义。

### Verified-email 约束

OAuth-only 用户不能在账户设置中输入任意接收地址来绑定本地密码。服务端只能使用账户既有且已验证、可投递的 email，或可信 OAuth provider 已声明验证过的 email claim。页面仅显示脱敏地址。不存在合格邮箱时，流程不可用，并明确提示邮箱绑定与验证是独立前置能力。

### 凭据与会话安全

密码变更、首个密码设置、token 发送与消费的授权、字段校验、限流、审计和敏感数据脱敏都在服务端执行。前端不得持久化或记录明文密码、密码哈希、原始一次性 token 或内部认证记录。

现有 `a-user` 全 token 失效能力和 `auth-simple` 哈希/校验能力可以被评估复用，但精确的会话失效策略、事务边界和认证适配器归属必须在 SRS 决策门关闭后实现。

## 已拒绝或延后方案

- 将账户设置实现为管理员可编辑任意用户的通用 Resource 页面。
- 在 OAuth-only 流程中允许用户输入任意收件 email。
- 将 `password-set` 伪装为或合并入 `password-reset`。
- 仅凭前端 OAuth 状态、页面路由、Site ID 或菜单可见性判断账户能力或授权。
- 将 Web 用户工作区移动到 Admin，仅为了复用 cookie-aware SSR。
- 把当前仍抛出 `Not Implemented` 的 password-reset callback 当作可用的端到端恢复流程。
- 在未明确受控媒体归属和验证机制前接受任意外部头像 URL。
- 在未明确 `fileVersion` 策略前为账户/token/audit 持久化改动隐式加入迁移。

## 实施前决策门

后续 SRS 和 WBS 必须在相应代码工作开始前明确以下问题：

1. Account API 继续归入 `HomeUserPassport` 操作族，还是建立独立 controller/tag，并相应更新 Home API OpenAPI matcher；
2. 资料字段的最终可编辑白名单、头像归属证明和 Passport 同步响应；
3. 统一密码策略、当前密码校验与无本地凭据账户的处理；
4. 合格验证邮箱的可信来源和状态变化处理；
5. `password-set` token 的持久化、TTL、单次消费、竞争消费、撤销和 canonical path 绑定；
6. 修改或设置密码后保留当前会话、撤销其他会话或撤销全部会话的精确政策；
7. 安全事件审计、限流和邮件投递失败/重试策略；
8. 是否引入持久化字段或数据结构；如引入，先决定 `vonaModule.fileVersion` 和迁移路径。

## 后果

- 必须建立独立的自助 Account DTO/API 投影，而不是向浏览器暴露内部认证记录。
- 后端契约变更先在 Vona 定义并验证 OpenAPI，再生成 Zova 消费者；不得手改生成产物。
- 共用页面和 Model 必须处理 Web public-SSR 匿名 shell 与 Admin session SSR 的差异。
- 功能交付需增加直接 API 授权、token 生命周期/竞争、会话策略、SSR/hydration、Web/Admin 导航和敏感数据脱敏的证据义务。
- 未来忘记密码应以单独产品/技术记录交付；复用底层能力不改变本 ADR 的边界。

## 相关记录

- [Home User 账户设置 PRD](../prd.md)
- [Home User Account Settings SRS](../srs.md)
- [Home User Account Settings PDP/WBS](../pdp-wbs.md)
- [Home User Account Settings Test Plan](../test-plan.md)
- [User Workspace SSR Strategy](../../../architecture/user-workspace-ssr-strategy.md)
- [Anonymous Token Route Pattern](../../../architecture/anonymous-token-route-pattern.md)
- [ADR 0006：SSR Site Access and Role Model](../../../decisions/0006-ssr-site-access-and-role-model.md)
- [ADR 0010：Keep Internal Planning Documents Repository-Native](../../../decisions/0010-repository-native-planning-documents.md)
