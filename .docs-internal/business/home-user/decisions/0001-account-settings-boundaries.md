# ADR 0001：建立 Home User 账户设置边界

## 状态

已接受。

## 背景

Cabloy Basic 的 `home-user` 和 Passport 提供当前身份、注册、登录和 OAuth 认证基础；本 ADR 确立当前用户资料编辑、修改本地密码、OAuth-only 首个本地密码设置和未登录密码恢复的独立边界。Admin 头像菜单只有退出登录，Web 布局也没有对应的账户入口。

账户设置同时涉及个人资料、认证凭据、账户 email、一次性 token、会话失效、审计、认证保护的 session SSR Account route，以及公开 token 页的中性 SSR。若把它实现成通用 User Resource、布局中的临时代码，或现有未完成 password-reset callback 的表面延伸，领域边界和安全前提都会漂移。

## 问题

需要确定一个可供 Web 和 Admin 共用、但不混淆 Site 组合、管理端资源管理和认证安全职责的自助账户边界，并防止“设置首个密码”与未来“忘记密码”恢复流程混为同一授权模型。

## 决策

### 自助账户领域

`home-user` 拥有当前用户的自助账户用例及其面向消费者的 Account 契约。当前 Passport 是所有自助操作的唯一目标身份来源；客户端不能提交或选择目标 `userId`、认证记录 ID 或验证状态作为授权依据。password-set 的显式 email 仅是受限收件/candidate 输入，永不选择 subject。

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
2. **设置密码**：OAuth-only 用户通过当前会话显式输入 email。既有 `EntityUser.email` 必须规范化匹配并保持权威；空字段仅将输入作为短时 token-bound candidate。有效一次性 `password-set` token 成功创建首个 `auth-simple` 凭据时才原子写入该 candidate。
3. **忘记密码**：未登录恢复流程使用独立的 `password-reset` 用途、CAPTCHA 申请、枚举防护、审计和验收记录。当前收件资格是 scoped active/activated user 的既有 `EntityUser.email` 加 canonical `auth-simple` 凭据；地址级验证 provenance 是后续加固项。

`password-set` 与 `password-reset` 不共享 token purpose，也不因可复用邮件或一次性 token 基础设施而共享产品语义。reset 只能 replacement 既有本地凭据；不得成为 OAuth-only 用户创建首个密码的路径。两个一次性 token 都必须使用公开页面 URL 的 `token` query 参数传递，不支持或依赖 fragment/hash。

### Password-set 收件人约束

OAuth-only 用户在账户设置中必须显式输入接收地址，但输入不能选择账户 subject 或成为通用 email-edit 权限。若服务端当前 scoped `EntityUser.email` 非空，输入必须 trim/lowercase 规范化匹配，投递只使用既有字段且不得改写；若字段为空，规范化输入仅保存在短时 password-set digest state，且只在 valid/current/one-time token 成功创建首个凭据时于同一事务写入。candidate 不进入 API response、audit/log payload、SSR/model/browser persistent state；过期、重放、superseded、冲突、资格失效和事务失败均不写入。以 opaque candidate digest lock 加 scoped business lookup 防止跨用户竞争，不添加数据库 unique index 或持久 pending 字段。服务端不得从 auth provider 记录或 provider config 获取、验证或推导收件人。Zova 生成 token-free 的完整绝对 password-set consumer URL；Account 仅接受 HTTP(S)、无 userinfo/query/fragment 且 origin 通过 `checkOriginExact(...)` 严格授权：精确同源（协议、host、有效端口均匹配）或精确匹配服务端 `a-security:cors` `whiteList`。Vona 保留前端提供的 pathname，并只由 Vona 添加 `token` URL query；不读取或校验 SSR Site、`publicPath` 或 `siteId`，也不提供模块 consumer URL 配置。请求/proxy host 只可证明精确同源，不能授权 lookalike、suffix、异协议或异端口跨源目的地；`SERVER_SERVE_*`、`Referer`、浏览器输入 pathname 以及 CORS wildcard/suffix 规则不能授权邮件目的地。`dev/test` 中仅当 API 与 consumer 都是 loopback hostname 时允许不同端口。页面字段初始为空，既有地址最多显示脱敏提示。

### 注册激活与 Site 准入

默认 simple self-registration 遵循既有邮件确认策略：注册生成的未激活 Passport 不具备 `registeredUser`，而该角色只在 activation event 时赋予。注册页不得将这种结果视为可进入受保护 return destination 的登录成功，不得为消除 403 而提前赋予角色或改变 activation policy。它保留安全 return destination、显示邮件确认待处理状态并返回 Login；只有已获当前 Site 准入的 registration result 才写入 Passport/JWT 后执行正常 return navigation。

### 凭据与会话安全

密码变更、首个密码设置、token 发送与消费的授权、字段校验、限流、审计和敏感数据脱敏都在服务端执行。前端不得持久化或记录明文密码、密码哈希、原始一次性 token 或内部认证记录。

现有 `a-user` 全 token 失效能力和 `auth-simple` 哈希/校验能力可以被评估复用，但精确的会话失效策略、事务边界和认证适配器归属必须在 SRS 决策门关闭后实现。

## 已拒绝或延后方案

- 将账户设置实现为管理员可编辑任意用户的通用 Resource 页面。
- 让 OAuth-only 流程的 email 输入选择 subject、绕过既有 email、在签发时持久化，或演化为通用 email-edit 功能。
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
4. `password-set` 显式 email 输入、既有 `EntityUser.email` 规范化匹配、空字段 candidate 的 token-bound/成功时持久化边界，以及该字段变化后的资格失效处理；
5. `password-set` token 的持久化、TTL、单次消费、竞争消费、撤销和 canonical path 绑定；token transport 已确定为 URL query `token`，不使用 fragment/hash；
6. 修改或设置密码后保留当前会话、撤销其他会话或撤销全部会话的精确政策；
7. 安全事件审计、限流和邮件投递失败/重试策略；
8. 是否引入持久化字段或数据结构；如引入，先决定 `vonaModule.fileVersion` 和迁移路径。

## 后果

- 必须建立独立的自助 Account DTO/API 投影，而不是向浏览器暴露内部认证记录。
- 后端契约变更先在 Vona 定义并验证 OpenAPI，再生成 Zova 消费者；不得手改生成产物。
- 共用 Account 页面和 Model 必须处理已登录 Web/Admin session SSR 与公开 password-set/reset token 页中性 SSR 的差异。
- 功能交付需增加直接 API 授权、token 生命周期/竞争、会话策略、SSR/hydration、Web/Admin 导航和敏感数据脱敏的证据义务。
- 忘记密码以独立的 product/security contract 交付；可复用底层能力不改变其与 password-set 的授权和凭据语义边界。

## 相关记录

- [Home User 账户设置 PRD](../prd.md)
- [Home User Account Settings SRS](../srs.md)
- [Home User Account Settings PDP/WBS](../pdp-wbs.md)
- [Home User Account Settings Test Plan](../test-plan.md)
- [User Workspace SSR Strategy](../../../architecture/user-workspace-ssr-strategy.md)
- [Anonymous Token Route Pattern](../../../architecture/anonymous-token-route-pattern.md)
- [ADR 0006：SSR Site Access and Role Model](../../../decisions/0006-ssr-site-access-and-role-model.md)
- [ADR 0010：Keep Internal Planning Documents Repository-Native](../../../decisions/0010-repository-native-planning-documents.md)
