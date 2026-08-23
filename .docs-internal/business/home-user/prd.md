# Home User 账户设置产品需求文档

## 目的

`home-user` 账户设置为所有已登录 Cabloy 用户提供统一的自助账户能力：维护可安全直接修改的个人资料，并依账户是否已存在 `auth-simple` 本地凭据，完成修改密码或设置首个本地密码。

该能力必须同时服务 Web 和 Admin site，但不能将自助账户设置误建模为管理员编辑任意用户的 Resource CRUD。账户设置的目标用户始终由当前 Passport 会话决定，客户端不得指定目标 `userId`。

本文定义产品成果、范围、业务规则、验收要求和实施顺序。后续 SRS 应定义 DTO、API、认证提供方、一次性 token、会话撤销、审计、SSR 和测试等技术契约。

## 产品目标

- 让每一位已登录用户在 Web 和 Admin 中都能进入同一套账户设置能力。
- 让用户独立保存个人资料和账户安全设置，避免两个操作的加载、失败或草稿状态互相影响。
- 为已有 `auth-simple` 本地凭据的用户提供安全的修改密码路径。
- 为仅 OAuth 登录、尚无 `auth-simple` 凭据的用户提供受限“设置密码”路径：既有账户 email 保持权威；空字段只能在成功消费短时 token 时绑定显式输入的 candidate。
- 为未登录用户提供独立的“忘记密码 / 重置密码”恢复闭环，并保持其语义、授权和 token purpose 与已登录账户操作隔离。
- 在资料保存后及时同步当前 Passport 用户快照，使页面、Web/Admin 布局中的名称和头像保持一致。

## 背景与现状

当前 Cabloy Basic 的 Admin 头像菜单仅提供“退出登录”；`$passport.user` 已包含用户身份资料，但仓库尚无当前用户资料编辑页、自助账户 API、修改密码 API 或可用的密码恢复闭环。邮件密码恢复的底层能力和 callback 路由已存在，但 `home-user` 的 callback listener 仍为未实现状态，不能视为已交付的重置密码功能。

因此，本需求不是给现有资料页面增加表单，而是建立一套新的、自助账户（self-service account）产品边界。

## 用户与场景

### 已登录用户

所有已登录且通过各自站点准入的 Web 或 Admin 用户。用户可以查看并维护自身资料，并根据认证能力维护本地密码；站点可见性不替代服务端授权。

### 已有本地密码的用户

账户已有 `auth-simple` 凭据。用户在账户安全区通过“当前密码、新密码、确认新密码”修改本地密码。

### OAuth-only 用户

用户可通过 OAuth 登录，但尚无 `auth-simple` 凭据。用户在当前已认证账户的“设置密码”操作中显式输入 email，但该输入绝不选择 subject。若 `EntityUser.email` 已存在，输入必须经规范化后匹配，且只向既有字段投递；若该字段为空，服务端仅把输入作为短时 token-bound candidate 投递，随后在公开页面成功创建首个本地密码时才写入该字段。收件人不从 auth provider 记录推导。

### 无账户 email 的 OAuth-only 用户

若账户没有非空 `EntityUser.email`，用户仍可在已认证的“设置密码”操作中输入 candidate email。该值不会在签发时持久化；仅当持有该邮件链接的用户成功消费当前 token 并创建首个本地密码后，才原子写入 `EntityUser.email`。

## 范围

### 本期范围

- 在前端 `home-user` 模块提供可供 Web 与 Admin 复用的账户设置页面、账户状态 Model 和多语言文案。
- 在当前用户的 Web/Admin 登录入口提供“账户设置”导航；Admin 头像菜单保留“退出登录”，并将“账户设置”置于其前。
- 在同一页面提供两个独立区块：**个人资料** 和 **账户安全**。
- 支持用户查看并更新允许自助修改的个人资料：显示名称、头像、语言和时区。
- 通过当前 Passport 会话确定自助操作的目标用户，提供当前账户读取和资料更新能力。
- 对已有 `auth-simple` 凭据的用户支持安全修改密码。
- 对 OAuth-only 用户支持显式输入 email 签发“设置密码”链接：既有账户 email 必须匹配；空字段使用短时 candidate，并在公开的一次性 token 页面成功设置首个本地密码时绑定。
- 在 Login 提供注册入口，并复用 Passport 注册契约建立登录态。
- 提供 CAPTCHA 保护的未登录密码 reset 申请、邮件链接和公开新密码设置页面。
- 以 `password-set` 和 `password-reset` 区分设置首个密码与忘记密码恢复的 token purpose。
- 在密码变更、密码设置、链接发送和密码恢复等安全动作中提供用户可理解的成功、失败和不可用状态。

### 不在本期范围

- 以浏览器输入的地址选择账户 subject、重置目标或绕过既有账户 email；password-set 的受限 candidate 仅在当前 Passport subject、空账户 email、短时 token state 和成功消费边界内有效。
- 邮箱绑定、邮箱验证来源记录与旧数据兼容迁移；当前 reset 资格仅基于 active、activated、既有 `EntityUser.email` 和 canonical `auth-simple` 凭据。
- 通用邮箱变更、邮箱验证 provenance、手机号绑定或手机号验证流程；仅提供 password-set 成功时受限的 candidate email 绑定。
- MFA、登录设备管理、会话管理 UI、OAuth 账号管理、登录标识改名、账户注销和安全通知中心。
- 管理员以本功能编辑其他用户资料或认证方式的能力。
- 将账户设置实现为 Admin `rest-resource` 用户编辑页面。
- 未经现有受控媒体/文件归属机制支持的任意外部头像 URL。

## 信息架构与入口

### 入口

Admin 已登录用户的头像菜单应呈现：

```text
[头像] 用户名 ▼
├── 账户设置
└── 退出登录
```

Web 应在其适合的已登录用户菜单或个人中心入口中提供同一目的地。入口可以因站点布局而不同，但目标页面、账户领域和自助 API 必须共享。

### 页面

页面名称为 **账户设置**，归属前端 `home-user` 模块，而非 `home-layoutadmin` 或其他布局模块。首版采用单页两个独立 Card/区块，不要求 Tabs 或子路由：

```text
账户设置

┌─────────────────────────────────────┐
│ 个人资料                            │
│ 头像 / 显示名称 / 语言 / 时区       │
│                         [保存资料]  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 账户安全                            │
│ 有 auth-simple：                    │
│ 当前密码 / 新密码 / 确认新密码       │
│                         [修改密码]  │
│                                     │
│ 无 auth-simple：                    │
│ Email（显式输入；既有邮箱仅脱敏提示）│
│             [发送设置密码链接]      │
└─────────────────────────────────────┘
```

个人资料与账户安全必须各自拥有提交、loading、成功、失败和表单草稿状态。任一区块的失败不得阻断、回滚或污染另一区块。

## 产品需求

### 自助账户边界

- **PRD-ACC-01**：用户只能读取和修改当前 Passport 所代表的自身账户；请求与界面均不得提供用于指定其他目标用户的 `userId`。
- **PRD-ACC-02**：自助账户能力必须可由 Web 与 Admin 的已登录用户使用；两端复用同一账户领域、页面能力和安全规则，但可拥有各自的导航入口与布局呈现。
- **PRD-ACC-03**：自助账户 API、DTO、页面和状态所有权必须与管理员管理他人的通用 User Resource API/DTO/页面分离。
- **PRD-ACC-04**：页面初始化应返回面向产品的账户能力，例如是否已有本地密码、是否可发送设置密码链接和脱敏后的账户邮箱；前端不得通过暴露或推断内部认证记录来决定界面。

### 个人资料

- **PRD-PRO-01**：用户可以查看当前账户的个人资料，并独立保存显示名称、头像、语言和时区。
- **PRD-PRO-02**：个人资料中可编辑字段由服务端白名单确定；email、mobile、用户名及其他登录标识不得因本期资料保存而被自由修改。
- **PRD-PRO-03**：头像必须使用项目受控的上传、媒体引用或文件归属流程，并校验文件类型、大小和资源所有权；不得以任意外部 URL 作为默认自助更新方式。
- **PRD-PRO-04**：资料保存成功后，当前 Passport 用户快照必须被更新或重新获取，以便 Web/Admin 的顶部名称和头像无需手动刷新即可反映新值。
- **PRD-PRO-05**：语言与时区保存成功后，运行时偏好应按既有 Passport 偏好机制同步，避免账户资料与实际界面偏好长期不一致。

### 已有本地密码时的修改密码

- **PRD-PWD-01**：当账户已有 `auth-simple` 凭据时，账户安全区显示“修改密码”，并要求当前密码、新密码和确认新密码。
- **PRD-PWD-02**：服务端必须基于当前会话确认用户身份和账户状态、验证当前密码，并执行统一密码策略后才可更新密码哈希。
- **PRD-PWD-03**：修改密码必须以原子方式完成凭据更新和必要的认证状态处理，不能出现密码已变更但会话处理或安全记录处于不确定状态的成功结果。
- **PRD-PWD-04**：密码变更后必须使旧认证状态失效。优先保留当前请求所在会话并撤销其他登录会话、refresh token 或 JWT 可续期能力；若现有认证基础暂不能支持该策略，首版可撤销所有会话并引导用户重新登录，但必须清楚告知用户。
- **PRD-PWD-05**：成功后应向用户说明会话影响，例如“密码已修改，其他设备需要重新登录”。密码、密码哈希、确认密码和敏感认证材料不得出现在 Passport DTO、客户端持久化状态、日志或错误详情中。

### 登录注册与未登录密码恢复

- **PRD-REG-01**：登录页必须提供注册入口；注册表单复用 Passport 的 username、email、password、confirmation 和 CAPTCHA 契约。成功注册后遵循既有激活策略：若返回结果已获当前 Site 准入，则建立 Passport/JWT 状态并进入经验证的 return destination；默认邮件确认策略下，注册页必须保留 return destination、提示查收激活邮件且不得把未激活用户导航到受保护 Account 页面。
- **PRD-RST-01**：登录页必须提供“忘记密码”入口。申请表单仅提交 email 和 CAPTCHA；只要 CAPTCHA 有效，未知地址、禁用或未激活账户、无本地凭据、recipient cooldown、邮件失败或部署不可用均返回相同的通用接受结果，界面不得据此区分账户资格。
- **PRD-RST-02**：当前 reset 收件资格由服务端 scoped 用户的 active 状态、activated 状态、非空 `EntityUser.email` 和既有 canonical `auth-simple` 凭据共同确定。浏览器不得提交或声明 user、认证记录、验证状态或收件资格。地址级验证来源、时间和旧数据兼容策略是后续加固项。
- **PRD-RST-03**：reset 使用与 `password-set` 独立的短时、单次、digest-only `password-reset` token，并严格绑定逻辑公开 `/home/user/password-reset` leaf。Zova 生成 token-free 的完整绝对 consumer URL；Account 仅接受 HTTP(S)、无 userinfo/query/fragment 且 origin 通过 `checkOriginExact(...)` 严格授权的 URL：精确同源（协议、host、有效端口均匹配）或精确匹配服务端 `a-security:cors` `whiteList`。`dev/test` 中 API request host 和 consumer origin 都是 loopback hostname 时允许不同端口。Vona 保留前端提供的 pathname，并仅添加 `token` URL query；不读取或验证 SSR Site、`publicPath` 或 `siteId`。请求或 proxy host 只能证明精确同源，不能授权 lookalike、suffix、异协议或异端口跨源目的地；`SERVER_SERVE_*`、`Referer`、浏览器输入 pathname 或 CORS wildcard/suffix 语义也不能授权邮件目的地。原始 token 只可短暂出现在邮件链接 query 和 controller 内存中；生产部署应显式配置 HTTPS consumer origin。消费后仅替换既有本地密码，不得创建首个凭据，并撤销 server-side Passport 会话后明确返回登录。
- **PRD-RST-04**：公开 reset 页面在 SSR 和 hydration 初渲中不得包含 token、私有身份或预填密码。客户端仅在 hydration 后读取 `token` URL query、立即通过 router 恢复 token-free canonical URL，并仅在 controller 内存中短暂保留 token。

### OAuth-only 用户设置首个本地密码

- **PRD-SET-01**：当账户没有 `auth-simple` 凭据时，账户安全区显示“设置密码”，而不是“修改密码”，并且不得显示当前密码输入框。
- **PRD-SET-02**：用户发起设置密码时必须显式输入 email，且 subject 始终仅由当前 Passport 派生。若当前 scoped `EntityUser.email` 非空，输入经 trim/lowercase 规范化后必须匹配，服务端仅向既有字段投递且不得改写它；不得从 auth provider 记录读取或推导收件人。
- **PRD-SET-03**：若当前 `EntityUser.email` 为空，服务端可向规范化后的输入 candidate 投递，但只将其绑定至短时 password-set token state；签发、过期、失败、重放或 superseded token 均不得持久化该值。页面字段初始为空，既有地址最多仅脱敏提示，成功/失败反馈不得回显完整地址。
- **PRD-SET-04**：用户通过链接进入公开页面，使用仍有效且未消费的一次性 token 设置新密码和确认密码；成功后为该用户创建首个 `auth-simple` 凭据。若 token 带有空字段签发的 candidate，创建凭据与将该 candidate 写入 `EntityUser.email` 必须在同一事务中完成。
- **PRD-SET-05**：设置首个密码的 token 必须具有 `password-set` 用途，不得与未登录恢复密码的 `password-reset` token 混用。
- **PRD-SET-06**：设置密码成功后的会话刷新或撤销策略必须明确、可审计，并不得降低 OAuth-only 账户原有的认证安全性。

### 文案与体验

- **PRD-UX-01**：已登录用户的密码操作统一称为“修改密码”或“设置密码”；“重置密码 / 忘记密码”仅用于未登录恢复场景。
- **PRD-UX-02**：账户设置页面和入口必须提供现有支持语言的本地化文案，包括加载、保存成功、密码错误、密码策略失败、显式 email 输入、链接已发送及链接无效或过期等状态。
- **PRD-UX-03**：账户设置是认证保护页面。SSR 与客户端 hydration 的初始 UI 必须一致，密码字段绝不预填，且私有账户信息不得因为 SSR、cookie 不可用或 hydration 差异而泄露或错误渲染。

### 安全与审计

- **PRD-SEC-01**：资料更新、修改密码、发送设置密码链接和消费设置密码 token 的授权、字段校验、限流和敏感操作审计均由服务端执行；前端站点准入和隐藏按钮不构成授权。
- **PRD-SEC-02**：一次性链接必须短时有效、仅可消费一次，并在过期、重复使用、无效或用途不匹配时给出安全且可理解的失败结果。
- **PRD-SEC-03**：密码相关安全事件至少应记录能够支持审计和问题追踪的事件类型、用户身份、结果及必要上下文，且不得记录明文密码或 token。

## 关键业务规则

| 账户能力状态                         | 页面动作 | 必要授权依据                                            | 结果                                                                |
| ------------------------------------ | -------- | ------------------------------------------------------- | ------------------------------------------------------------------- |
| 存在 `auth-simple`                   | 修改密码 | 当前会话 + 当前密码                                     | 更新本地凭据并按策略撤销旧认证状态                                  |
| 不存在 `auth-simple`，但有账户 email | 设置密码 | 当前会话 + 显式输入与既有 `EntityUser.email` 规范化匹配 | 向既有 email 发送 `password-set` 链接，公开页面创建首个本地凭据     |
| 不存在 `auth-simple`，无账户 email   | 设置密码 | 当前会话 + 显式输入 candidate                           | 发送短时 token-bound candidate 链接；成功消费时创建凭据并写入 email |
| 同时存在 OAuth 与 `auth-simple`      | 修改密码 | 当前会话 + 当前密码                                     | OAuth 绑定不改变本地密码修改路径                                    |
| 未登录且忘记密码                     | 重置密码 | CAPTCHA + 当前认可的 email/激活状态依据                 | 通过独立的 `password-reset` 流程替换既有本地密码                    |

## 分阶段实施顺序

以下顺序是本需求的交付依赖，后续实施计划、SRS 和任务拆解不得倒置其安全前提。

1. **建立 Account 自助契约**：在 `home-user` 定义当前账户、资料更新、密码能力读取等自助 API 与 DTO；明确当前 Passport 是唯一目标身份来源。
2. **锁定资料边界**：确定资料可编辑字段以及头像的受控上传/媒体归属方案，完成资料更新后的 Passport 同步要求。
3. **完成已有本地密码的修改路径**：在 `auth-simple` 及相关认证层实现当前密码校验、密码策略、原子更新、会话撤销和审计。
4. **完成 OAuth-only 的设置链接路径**：由当前 Passport subject 显式输入 email；既有字段必须规范化匹配并保持权威，空字段仅使用短时 token-bound candidate，成功消费时才原子写入；不得从 auth provider 记录推导收件人。
5. **完成公开设置密码页面与 token 消费**：实现设置首个本地密码、一次性 token 校验/消费及成功后的认证状态处理。
6. **实现共享账户设置体验**：在 `home-user` 创建 Web/Admin 共用的账户设置页面、Account Model 和本地化文案；实现资料与账户安全两个独立区块。
7. **接入站点入口**：分别为 Admin 头像菜单和 Web 已登录用户入口增加“账户设置”导航，不改变各自布局所有权。
8. **完成未登录忘记密码**：在登录页提供注册入口、公开的 `password-reset` 申请、链接和新密码设置流程；必须保持与 `password-set` 的用途、初始授权和审计语义分离。

## 验收标准

本期在满足以下条件时可接受：

- 已登录 Web 与 Admin 用户均可从适合各自站点的入口进入账户设置；Admin 头像菜单同时保留账户设置和退出登录。
- 页面以两个相互隔离的区块呈现个人资料和账户安全，任一操作的加载或失败不影响另一个区块。
- 用户只能读取和更新自身允许修改的资料；资料保存成功后，同一运行中的 Passport 名称、头像和偏好同步更新。
- 已有 `auth-simple` 的用户必须提供正确当前密码才能修改密码；密码策略、确认密码、认证状态失效和安全审计均生效。
- OAuth-only 用户不会看到错误的当前密码表单；既有账户 email 时输入必须规范化匹配且只向既有地址投递，空账户 email 时只能使用短时 token-bound candidate，并仅在成功消费时绑定。
- `password-set` 链接只能在有效期内被消费一次，成功后创建首个本地密码；过期、无效、重复或用途不匹配的链接均安全失败。
- Login 提供 Passport 注册入口；成功注册沿用正常登录状态和安全 return navigation。
- CAPTCHA 成功后的 reset 申请始终提供相同通用反馈；有效 reset 只能替换既有 local password，公开页面不泄露 token，成功后必须重新登录。
- 资料更新、修改密码、设置密码和 reset 流程都不暴露明文密码、密码哈希、一次性 token 或内部认证记录。
- 支持语言中均具备完整的关键页面和错误状态文案，认证保护下的 SSR 与 hydration 不产生私有信息泄露或明显不一致。

## 后续记录

- SRS 必须将每项 `PRD-ACC-*`、`PRD-PRO-*`、`PRD-PWD-*`、`PRD-SET-*`、`PRD-REG-*`、`PRD-RST-*`、`PRD-UX-*` 和 `PRD-SEC-*` 映射到具体 DTO、API、认证适配器、token 生命周期、事务与会话策略、SSR 约束和自动化测试。
- 后续实施计划应从本 PRD 的“分阶段实施顺序”衍生依赖和完成检查，而不是将入口页面提前到安全契约之前。
- 忘记密码维持独立的 product/security contract；即使复用邮件与一次性 token 基础设施，也不得与已登录设置密码或修改密码共享授权语义。

## 追溯与配套记录

```text
PRD requirement -> SRS contract -> PDP/WBS task -> ATP scenario -> observed evidence
```

| PRD 需求族   | 主要 SRS 契约                          | 主要 WBS                                          | ATP                                                                    |
| ------------ | -------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------- |
| `PRD-ACC-*`  | `SRS-ACC-*`, `SRS-API-*`               | `WBS-HUA-20-01`, `WBS-HUA-20-03`                  | `ATP-HUA-ACC-01`, `ATP-HUA-CTR-01`                                     |
| `PRD-PRO-*`  | `SRS-PRO-*`                            | `WBS-HUA-20-02`, `WBS-HUA-60-01`                  | `ATP-HUA-PRO-01`, `ATP-HUA-PRO-02`, `ATP-HUA-PAS-01`                   |
| `PRD-PWD-*`  | `SRS-PWD-*`, `SRS-SES-01`, `SRS-AUD-*` | `WBS-HUA-30-01`, `WBS-HUA-30-02`                  | `ATP-HUA-PWD-01`, `ATP-HUA-SES-01`, `ATP-HUA-AUD-01`                   |
| `PRD-SET-*`  | `SRS-SET-*`, `SRS-TOK-*`, `SRS-SES-01` | `WBS-HUA-40-01`–`WBS-HUA-50-02`                   | `ATP-HUA-SET-01`, `ATP-HUA-SET-02`, `ATP-HUA-TOK-01`, `ATP-HUA-SSR-03` |
| `PRD-UX-*`   | `SRS-UI-*`, `SRS-SSR-*`                | `WBS-HUA-60-01`–`WBS-HUA-60-03`                   | `ATP-HUA-UI-01`, `ATP-HUA-SSR-01`, `ATP-HUA-SSR-02`                    |
| `PRD-SEC-*`  | `SRS-AUD-*`, `SRS-NFR-*`, `SRS-TOK-*`  | `WBS-HUA-30-02`, `WBS-HUA-40-02`, `WBS-HUA-70-01` | `ATP-HUA-AUD-01`, `ATP-HUA-RATE-01`, `ATP-HUA-TOK-01`                  |
| `PRD-REG-01` | `SRS-REG-01`                           | `WBS-HUA-80-01`                                   | `ATP-HUA-REG-01`                                                       |
| `PRD-RST-*`  | `SRS-RST-*`, `SRS-AUD-*`, `SRS-NFR-*`  | `WBS-HUA-80-02`–`WBS-HUA-80-04`                   | `ATP-HUA-RST-01`, `ATP-HUA-RST-02`, `ATP-HUA-RST-03`                   |

- [Home User 账户设置内部规划索引](./README.md)
- [Home User Account Settings SRS](./srs.md)
- [Home User Account Settings PDP/WBS](./pdp-wbs.md)
- [Home User Account Settings Test Plan](./test-plan.md)
- [Home User Account Settings Delivery Progress](./progress.md)
- [ADR 0001：建立 Home User 账户设置边界](./decisions/0001-account-settings-boundaries.md)
