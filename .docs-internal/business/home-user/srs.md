# Home User 账户设置软件需求规格说明

## 目的和权威

本文将 [账户设置 PRD](./prd.md) 转化为可实现、可验证的系统契约。它拥有自助 Account API/DTO、认证与 token、会话、审计、SSR、前端状态和技术验收要求；PRD 仍拥有产品目标、范围和业务验收，[PDP/WBS](./pdp-wbs.md) 拥有交付顺序，[测试计划](./test-plan.md) 拥有可执行 `ATP-HUA-*` 场景和证据。

```text
PRD requirement -> SRS contract -> PDP/WBS task -> ATP scenario -> observed evidence
```

除非本文明确标记为已确认的当前源代码事实，本文规定的是目标契约而不是现有实现描述。

## 系统背景和现有归属

| 关注点          | 当前源代码事实                                                                  | 本规格要求                                                                                                        |
| --------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| 后端身份入口    | `home-user` 提供 Passport 导向的 current、login、register、OAuth、logout 等接口 | 自助账户须形成明确的 Account 契约，不能把内部 adapter 能力直接暴露给浏览器                                        |
| 当前身份状态    | Zova `home-passport` 拥有 Passport/JWT 状态与 locale/tz 同步                    | Account 成功资料变更后必须按明确契约刷新或替换 Passport 投影                                                      |
| Admin 入口      | `home-layoutadmin` 的身份菜单当前只提供退出登录                                 | 布局仅接入导航，不能拥有账户领域或账户 API                                                                        |
| Web 入口        | `home-layoutweb` 当前没有身份/账户入口                                          | Web 需要独立决定并实现其入口，不从 Admin 继承布局假设                                                             |
| 本地密码原语    | `auth-simple` 有哈希和密码验证能力                                              | 密码更新应复用经批准的原语，但当前尚无已交付的修改密码用例                                                        |
| token 失效      | `a-user` 有按用户移除全部认证 token 的 server-side 原语                         | 具体密码变更/设置后的当前与其他会话失效政策必须显式确定                                                           |
| 旧重置 callback | `home-user` password-reset listener 当前为 `Not Implemented`                    | 当前 recovery 使用独立 Account reset contract；旧 listener 不参与，且 `password-reset` 与 `password-set` 保持独立 |
| Home API 生成   | `home-api` 当前匹配 `HomeUserPassport` 操作                                     | 新 Account 操作必须显式选择 controller/tag/matcher 归属，避免生成漂移                                             |

## 能力与模块归属

| 责任                                          | 归属                                                                                 |
| --------------------------------------------- | ------------------------------------------------------------------------------------ |
| 当前用户的自助账户语义、DTO、服务端范围和 API | Vona `home-user`                                                                     |
| 认证凭据哈希、验证和 provider 原语            | 现有认证模块，例如 `auth-simple`；新用例的归属由实现前决策门确定                     |
| 当前 Passport/JWT 会话状态                    | Zova `home-passport`                                                                 |
| 账户资料和安全能力的异步查询/mutation 状态    | 共享 Account Model，使用 `$useStateData(...)` 建立渲染相关的模型级状态               |
| 账户设置页面、表单草稿和局部交互              | 前端 `home-user` 页面/Controller/Render 边界                                         |
| Admin/Web 导航入口和 Site 组合                | 各自布局模块；不取得 Account 领域所有权                                              |
| 邮件、一次性 token 和审计基础设施             | 复用或扩展既有通用能力，`password-set` 与 `password-reset` 契约均由 `home-user` 定义 |

共享 Account Model 不替代 `$passport`：前者拥有账户设置数据和 mutation 生命周期，后者持续拥有登录态和当前身份快照。

## 身份、授权和受众边界

### SRS-ACC-01：当前 Passport 是唯一目标身份来源

所有受保护的 Account read、profile update、password change 和 password-set-link issue 操作必须从当前 Passport/request context 派生 subject user。请求体、查询参数、route params、cookie 外的客户端状态、`SITE_ID`、认证记录 ID 和用户输入 email 都不得指定或扩大目标账户范围。

### SRS-ACC-02：Site 准入不等于 API 授权

Zova Router Guard、菜单可见性和 Web/Admin Site role 准入只负责导航体验。所有私有 API 仍由 Vona Passport/resource guards 在服务端执行身份、账户状态和所需业务授权。拥有 Admin Site 准入不授予编辑其他用户自助账户的权限。

### SRS-ACC-03：Account capability 是消费者投影

页面初始化响应必须提供产品所需能力，例如：允许展示的 profile、`hasSimpleAuth`、`canSendSetPasswordLink` 与脱敏的账户邮箱。不得直接返回 auth row、provider profile、密码 hash、token、内部认证 ID 或可由浏览器推断安全状态的非必要字段。

### SRS-ACC-04：Web 与 Admin 使用同一账户领域、不同 Site 组合

Web 和 Admin 可以共用 Account DTO、领域规则、页面能力、Account Model 和 locale，但可拥有不同入口、布局和 SSR 呈现。若受众、响应投影、服务端授权或前端状态边界实际不同，必须拆分 API/DTO/Model/Page，不得仅以视觉分组掩盖差异。

## 资料契约

### SRS-PRO-01：自助资料白名单

Account profile update 必须使用专用 DTO 和服务端白名单。首版仅允许 PRD 明确的显示名称、受控头像引用、语言和时区；email、mobile、用户名、认证 provider 标识、账号状态、激活状态、角色和其他登录标识必须拒绝或忽略，且不得产生部分更新。

每个允许字段必须在实现前定义其必填性、可清除性、规范化、长度/枚举校验和错误码。未知字段、只读字段或特权字段不得影响持久化结果。

### SRS-PRO-02：头像受控归属

头像字段只能接受经项目媒体/文件机制验证的引用。服务端必须验证类型、大小、所有权/可用范围与引用有效性；无论浏览器如何提交，都不得把任意外部 URL 视为首版有效头像。

若现有媒体机制不足，交付项必须先选择并记录头像归属方案，而不是以弱校验 URL 取代。

### SRS-PRO-03：资料变更后的 Passport 一致性

成功 profile update 后，Account 端和 `$passport` 必须得到同一份新的可公开用户投影，或 Account Model 必须明确失效并重新获取 `current` Passport。顶部名称、头像、语言和时区不得依赖全页刷新才更新。

### SRS-PRO-04：运行时偏好同步

locale/tz 成功保存后，应复用现有 Passport 偏好同步机制，使运行时 locale/tz 与持久资料一致。更新失败时，不得把未持久化草稿当作全局偏好成功应用。

## 已有本地凭据的修改密码契约

### SRS-PWD-01：资格与输入

仅当当前账户具有有效 `auth-simple` 凭据时，页面显示“修改密码”并允许请求：`currentPassword`、`newPassword` 和 `passwordConfirm`。没有本地凭据的 OAuth-only 用户不得被要求输入当前密码，且不能通过该操作绕过 password-set 流程。

### SRS-PWD-02：服务端校验

服务端必须在当前 Passport 所属账户上验证当前密码，执行统一的新密码策略和确认一致性检查，并验证账户状态。任何失败均不得修改 hash、token、会话或审计成功状态。

密码策略的来源、错误分类和可本地化消息必须在实现前明确；不得假设注册 DTO 的当前规则自动构成密码变更规则。

### SRS-PWD-03：原子安全结果

成功修改密码必须作为一个可定义原子结果，至少涵盖：凭据 hash 替换、既定会话/token 失效动作和安全审计成功事件。若任一持久化步骤失败，操作不得报告成功，也不得留下不可解释的部分安全状态。

实现优先采用 `@Core.transaction(...)` 的既有事务语义；如果邮件、通知或其他外部副作用被引入，它们不得被无条件重试，且其重试/投递边界必须另行定义。

### SRS-SES-01：会话失效政策

本期目标政策为：成功改密或首个密码设置后，保留当前请求所在会话并撤销其他可继续认证的会话/token；若认证基础设施不支持可证明的“保留当前、撤销其他”语义，首版必须撤销该用户全部认证 token，并要求重新登录。

实现前必须验证可用 token key/adapter 是否能精确表达该政策。不得仅在前端清空本地状态而保留服务端旧 token。用户成功提示必须与实际政策一致。

### SRS-PWD-04：敏感数据禁止面

明文密码、确认密码、hash、原始 token 与未获批准的认证内部数据不得进入 Passport DTO、Account 响应、客户端持久化状态、日志、错误详情、截图或保留的测试证据。

## OAuth-only 设置首个本地密码契约

### SRS-SET-01：服务端资格判定

`password-set` link 只能由已登录、尚无 `auth-simple` 凭据的当前账户请求，且 subject 始终只由当前 Passport 派生。浏览器必须提交受验证格式的 email，但它不得选择 user、provider、认证记录或 verified 标志。若当前 scoped `EntityUser.email` 非空，提交值必须经 trim/lowercase 规范化后匹配；服务端仅向既有字段投递且不得改写它。若该字段为空，服务端可向规范化输入投递，并仅在短时 password-set token state 保存该 candidate；不得从 auth provider 记录推导收件人。

Zova 生成 token-free 的完整绝对 consumer URL；Account 仅接受 HTTP(S)、无 userinfo/query/fragment，且 origin 必须通过 `this.bean.security.checkOriginExact(...)` 严格授权：精确同源（协议、host、有效端口均匹配）或精确匹配服务端配置的 `a-security:cors` `whiteList`。`dev/test` 中 API request host 与 consumer origin 均为 loopback hostname 时允许不同端口。请求或 proxy host 只能证明精确同源，不能授权 lookalike、suffix、异协议或异端口跨源目的地。Vona 不读取 SSR Site、`publicPath` 或 `siteId`，保留前端提供的 pathname，并独自添加 `token` URL query。`SERVER_SERVE_*`、`Referer`、浏览器输入的 pathname、CORS wildcard 或 suffix 规则均不得授权该邮件目的地。已有 `auth-simple` 的账户不得以该流程重置或并行覆盖密码，应回到修改密码流程。

### SRS-SET-02：账户邮箱和脱敏呈现

Account capability 仅返回既有 `EntityUser.email` 的脱敏显示值，并以无 `auth-simple` 表示可进入 password-set issue flow；它绝不返回完整既有地址或 candidate。页面必须显式输入 email，初始值在 SSR 与 hydration 均为空，既有地址最多作为脱敏提示；输入、成功/失败反馈、API response、SSR/model/browser persistent state 和审计不得回显完整地址。

签发 state 保存 recipient snapshot；空字段签发时另保存 `pendingEmail`。消费时先重验 token/current pointer 和 scoped subject：若已存在的账户 email 与 snapshot 不再匹配则失败；若存在 `pendingEmail`，在 opaque candidate-email lock 下通过 current-instance case-insensitive lookup 拒绝另一用户已拥有的地址。只有 valid/current/one-time token 成功创建首个凭据时，才在同一事务将仍为空的 `EntityUser.email` 写为该 candidate。签发失败、过期、重放、superseded、冲突、资格失效或事务失败均不得持久化 candidate；不引入通用 email edit、pending 持久字段或数据库 unique constraint。

### SRS-SET-03：发链限制和审计

请求设置密码链接必须具有服务端限流和审计。限流维度、窗口、成功/拒绝/重试记录及对可观察错误的策略必须在实现前明确。外部邮件投递不能成为可重放的事务副作用；发送与 token 持久化的失败/重试/幂等边界必须可审计。

## 登录注册与未登录密码恢复契约

### SRS-REG-01：Passport-owned registration

`home-login` 注册页必须加载生成的 Passport registration schema，并通过 `home-passport` 的 mutation 调用公开 register operation（禁用 auth token）；不得复制或另建平行的注册后端契约。若注册结果已获当前 Site 准入，可复用 Passport JWT 持久化和安全 return navigation。默认 `autoActivate: false` 且 simple registration 未声明 confirmed 时，页面不得写入该未激活 Passport/JWT 或导航到受保护 return destination；必须保留已验证的 `returnTo`，显示激活邮件待确认状态，并返回 Login 以待确认后重新登录。角色只在 activation 时分配，不能为该页面提前授予 Site 准入。

### SRS-RST-01：匿名申请与枚举防护

`POST /home/user/account/password-reset/request` 是 public operation，使用现有 CAPTCHA scene、IP enforce rate limit 和 normalized-recipient digest cooldown。CAPTCHA 成功后无论账户是否存在、是否 active/activated、是否具有 canonical local credential、是否处于 cooldown、邮件是否排队或提交的 consumer URL 是否可用，都返回 `{ accepted: true }`。无效、不受信任或不可用的 consumer URL 必须在收件人查询前中性失败：不发送邮件、不创建 reset state，仅可写入批准的脱敏审计 reason；审计不得记录完整 email、原始 token 或可用链接。

### SRS-RST-02：收件人、链接和 token 状态

服务端只在当前 instance scope 内解析 email，并仅为 active、activated、含非空 `EntityUser.email` 且已有 canonical `auth-simple` 凭据的用户签发。当前产品认可该 email 与激活状态为收件权依据；地址级验证 provenance、验证时间/来源与旧数据迁移不属于本交付。Zova 提交 token-free 的完整绝对 consumer URL；Account 只接受 HTTP(S)、无 userinfo/query/fragment 且 origin 经 `this.bean.security.checkOriginExact(...)` 严格授权：精确同源（协议、host、有效端口均匹配）或精确匹配服务端 `a-security:cors` `whiteList` 的值。Vona 不读取或校验 SSR Site、`publicPath` 或 `siteId`，保留提交的 pathname，并独自添加 `token` URL query。无效 consumer URL 必须在收件人查询前中性失败，且不得发送邮件、创建 state 或 cooldown。请求或 proxy host 只能证明精确同源，不能授权 lookalike、suffix、异协议或异端口跨源目的地；`SERVER_SERVE_*`、`Referer`、浏览器输入的 pathname、CORS wildcard 或 suffix 规则均不得授权邮件目的地。生产必须显式配置 HTTPS consumer origin；`dev/test` 中 `checkOriginExact` policy 还允许 API request host 与 consumer origin 的 hostname 都是 loopback（`localhost`、`127.0.0.1` 或 `::1`）时使用不同端口。状态使用 purpose-specific Redis cache：raw UUID v4 仅用于构造该 link，Redis 只保存 SHA-256 digest、`purpose: 'password-reset'`、user ID 和逻辑 consumer path；current pointer 覆盖旧 token，TTL 为 15 分钟。

### SRS-RST-03：公开消费、并发和会话结果

`POST /home/user/account/password-reset/consume` 是 public operation。它在 digest lock 后取得共同的 per-user password-mutation lock，并在该 lock 内重新验证 state、purpose、path、current pointer、scoped user 资格与 local credential；事务只包含 durable password replacement。事务提交后、锁仍持有时，执行 session revocation 和 token cleanup。消费只能调用 `replacePassword()`，不得调用 `createForUser()`；无效、过期、replay、superseded 或资格失效均返回同一 non-diagnostic failure。密码变更和 reset 共享 mutation lock，防止提交前释放锁导致的凭据竞态。

### SRS-RST-04：公开页面与客户端状态

`/home/user/password-reset` 使用 `public` SSR 和空布局。SSR HTML 与 hydration-time 初始树必须保持 token-free 的中性 shell；token 不进入 SSR state、local/session storage、model state 或可保留的浏览器证据。controller 仅在 hydration 后从 route query 读取 `token`，立即使用 router replacement 恢复 token-free canonical URL，并只在 controller 内存保留；成功后清除临时 token、由 Passport model 清理本地登录态并前往 Login。URL query 会到达初始请求和可能的日志或 referrer 层；Referrer-Policy 与 Vona、edge、APM 日志 redaction 不属于本次迁移范围。

## 一次性 token 和公开消费契约

### SRS-TOK-01：用途隔离

`password-set` token 必须带有不可替换的 `password-set` purpose，并与 `password-reset` 隔离。token 消费时必须验证 purpose、subject、有效期、未消费状态和必要的资格状态；不得将任一 purpose 的 token 用于另一流程。

### SRS-TOK-02：短时、单次和竞争安全

每个 `password-set` token 必须短时有效、只能成功消费一次，并支持安全处理 malformed、expired、revoked、superseded、replayed 和并发消费。并发竞争中最多一个请求创建首个 `auth-simple` 凭据并写入成功审计；其他请求得到安全失败结果，不能造成重复凭据或未定义会话状态。

TTL、存储/哈希表示、撤销/覆盖规则和原子消费实现须在实施前明确。旧 mail-confirm callback 的读取后删除 token 行为仅是历史输入，不能替代这个目的专属契约。

### SRS-TOK-03：公开 token 页面

公开设置密码页可标记 `requiresAuth: false`，因为 token 而非浏览器会话是授权证明。该路由与消费 API 必须：

- 从公开页面 URL 的 `token` query 参数读取 token；不得支持或依赖 URL fragment/hash 传递，并避免将 token 写入长期客户端状态、浏览器分析、截图或保留证据；
- 以 canonical path/用途约束 token，防止错误页面或 URL 被接受；
- 提供不泄露内部诊断的有效、过期、无效和已使用错误界面；
- 在成功设置密码后按 `SRS-SES-01` 处理认证状态；
- 不因公开路由而绕过后端 token 校验、密码策略或审计。

## API 和 contract-loop 契约

### SRS-API-01：Vona 是 Account contract truth

Account controller、DTO、validation、OpenAPI schema 和授权注解必须先在 Vona 建立。实现人员必须检查 emitted OpenAPI，随后再生成 Zova API/schema 消费者。不得手写平行 request/response 类型或手改生成的 `.zova-rest`/API 产物。

### SRS-API-02：操作族和 OpenAPI matcher 决策

在首次生成前，必须明确选择以下任一方案，并在模块 OpenAPI 配置中只包含预期操作：

1. 保持 Account 操作在 `HomeUserPassport` 族并有意扩展 matcher；
2. 建立专用 Account controller/tag，并显式更新 `home-api` `operations.match`/`ignore`；
3. 在受众或契约确实分离时建立独立操作族和消费者投影。

意外遗漏生成、过度匹配或通过手工修改生成文件补救均不符合本规格。

### SRS-API-03：反向链与双 flavor 产物

共享 Account 页面、routes、metadata 或前端资源发生变化时，必须按以下顺序刷新受影响的 Basic 产物：

```bash
npm run build:zova:web
npm run build:zova:admin
npm run deps:vona
```

只执行 REST build 不足以证明 SSR bundle 与 REST 输出同步。若 `.zova-rest` 已包含预期变更而 Vona 类型仍陈旧，应按本仓库 local dependency drift 规则处理，不得手改依赖链接。

## Zova 页面、状态、导航与 SSR 契约

### SRS-UI-01：共享页面与隔离状态

账户设置页面归入前端 `home-user`。Page Controller 只拥有页面局部草稿、交互和路由行为；Render 负责资料与账户安全区块的 TSX 组合；共享异步 Account data/mutation 状态由 Account Model 通过 `$useStateData(...)` 所有。

个人资料和账户安全必须拥有独立 query/mutation/form 状态。资料失败、password change 失败或 set-link 失败均不得污染另一个区块的草稿、loading、success 或 error。

### SRS-UI-02：导航与路由

Admin 头像菜单在退出登录前添加账户设置入口；Web 由 Web 布局或用户工作区入口添加等价入口。两端导航目标指向共享能力，但不得把 Web 入口实现为 Admin Resource 或复制第二个 Account 页面。

账户设置 route 默认受认证保护。若将来存在动态 params，route 必须定义 `route.name` 并重新生成页面 metadata；当前 Account route 不应因便捷性引入可指定他人身份的动态 params。

### SRS-SSR-01：Web Account session SSR

Account 是已登录用户能力。静态 `/home/user/account` route 必须标记 `requiresAuth: true` 和 `ssrProfile: 'session'`，且不含 dynamic params 时不得仅为类型或 alias 目的增加 route name。server-side Passport/Site admission 处理匿名访问；该 route 不提供 `/account` alias。

已确认 Account session SSR 与浏览器 hydration-time 初始树必须等价，并可呈现必要的私有 Account 界面。匿名请求必须转入 Login 并仅保留安全的 return destination；Site admission 不替代 Vona API 授权。匿名 `password-set`/`password-reset` token route 明确声明 `requiresAuth: false`，使用 public SSR 的无 token 中性 shell，并在 hydration 后捕获和 scrub token；缺少 locale params 本身不得改变其 public profile。

### SRS-SSR-02：Admin session SSR

Admin 沿用 `session` SSR profile 的实际 Passport/Site 准入行为。页面可在已确认的 session 条件下呈现必要私有界面，但不得因为 SSR 成功或 Admin 菜单可见而放松 Account API 的服务端授权、缓存控制或敏感资料禁止面。

### SRS-SSR-03：公开 password-set/reset 页面

公开 token 页面在 server 和 hydration 首渲间保持无 token 泄露的一致结构。密码字段永不 SSR 预填；token 验证和私有成功信息不得形成与 server HTML 不等价的 hydration 分支。`password-set` 与 `password-reset` 仅在 hydration 后从 `token` query 捕获 token，随即通过 router replacement scrub URL；两者不共享 token purpose 或 consumer state。

## 错误、隐私和审计契约

### SRS-AUD-01：安全审计

至少对 password change、password-set issue/consume、password-reset request/consume 和安全相关拒绝结果记录可追溯事件。事件应包含批准的 actor/subject、动作、结果、时间和必要 correlation/security context；不得包含密码、hash、原始 token、完整敏感 email 或未经批准的认证内部数据。

### SRS-AUD-02：客户端安全错误

客户端接收的错误必须可本地化并支持用户修复，同时不暴露 token 内部状态、provider 细节、其他账户存在性或诊断堆栈。内部审计/运维原因与用户可见消息必须分层。

### SRS-NFR-01：并发和失败安全

凭据、token 和会话耦合操作必须定义其事务和竞争行为。Backend 测试中的每个独立 caller 使用 `app.bean.executor.mockCtx(...)`；有意竞争的调用在分离 context 中并发启动，并断言组合后的持久结果，而不是依赖 runner 调度。

### SRS-NFR-02：测试数据和证据最小化

测试、日志、截图和保留证据只能使用合成或脱敏账户数据，不得保留明文密码、hash、原始 token、可用邮件链接或真实身份数据。每个测试拥有的持久资源必须在 `finally` 中按反向依赖顺序精确删除。

## 非功能和技术验收

- 所有 Account API 都必须在无认证、跨用户伪造目标、禁用/不满足账户状态和普通合法调用下表现符合其明确定义的服务端边界。
- 所有 password/token 操作都必须覆盖错误输入、过期/重放、并发与不产生部分持久状态的失败路径。
- Web、Admin、公开 token 页必须独立验证 SSR、hydration、导航准入与直接 API 授权；任一 UI 准入测试不能替代 API 测试。
- 所有涉及 DTO/controller 的改动须验证 OpenAPI 与生成消费者；所有涉及 Web/Admin 前端反向输入的改动须验证配对 SSR/REST 构建与依赖同步。
- 若实现需要改变 `meta.version.ts` 或新增已有持久模块字段，必须先询问是否提升 `vonaModule.fileVersion`；任一 `meta.version.ts` 改动后必须运行 `npm run test`。

## 验收映射

| SRS 契约                  | PRD 需求                  | WBS                                               | ATP                                                  |
| ------------------------- | ------------------------- | ------------------------------------------------- | ---------------------------------------------------- |
| `SRS-ACC-*`               | `PRD-ACC-*`               | `WBS-HUA-20-01`                                   | `ATP-HUA-ACC-01`, `ATP-HUA-CTR-01`                   |
| `SRS-PRO-*`               | `PRD-PRO-*`               | `WBS-HUA-20-02`                                   | `ATP-HUA-PRO-01`, `ATP-HUA-PRO-02`, `ATP-HUA-PAS-01` |
| `SRS-PWD-*`, `SRS-SES-01` | `PRD-PWD-*`               | `WBS-HUA-30-01`, `WBS-HUA-30-02`                  | `ATP-HUA-PWD-01`, `ATP-HUA-SES-01`                   |
| `SRS-SET-*`, `SRS-TOK-*`  | `PRD-SET-*`, `PRD-SEC-02` | `WBS-HUA-40-01`–`WBS-HUA-50-02`                   | `ATP-HUA-SET-01`, `ATP-HUA-SET-02`, `ATP-HUA-TOK-01` |
| `SRS-UI-*`, `SRS-SSR-*`   | `PRD-ACC-02`, `PRD-UX-*`  | `WBS-HUA-60-01`–`WBS-HUA-60-03`                   | `ATP-HUA-SSR-01`, `ATP-HUA-SSR-02`, `ATP-HUA-UI-01`  |
| `SRS-AUD-*`, `SRS-NFR-*`  | `PRD-SEC-*`               | `WBS-HUA-30-02`, `WBS-HUA-40-02`, `WBS-HUA-70-01` | `ATP-HUA-AUD-01`, `ATP-HUA-RATE-01`                  |
| `SRS-API-*`               | `PRD-ACC-03`, `PRD-UX-03` | `WBS-HUA-20-03`, `WBS-HUA-70-01`                  | `ATP-HUA-CTR-01`                                     |
| `SRS-REG-01`              | `PRD-REG-01`              | `WBS-HUA-80-01`                                   | `ATP-HUA-REG-01`                                     |
| `SRS-RST-01`–`SRS-RST-02` | `PRD-RST-01`–`PRD-RST-02` | `WBS-HUA-80-02`, `WBS-HUA-80-03`                  | `ATP-HUA-RST-01`, `ATP-HUA-RST-02`                   |
| `SRS-RST-03`–`SRS-RST-04` | `PRD-RST-03`–`PRD-RST-04` | `WBS-HUA-80-03`, `WBS-HUA-80-04`                  | `ATP-HUA-RST-02`, `ATP-HUA-RST-03`                   |

## 相关记录

- [Home User 账户设置 PRD](./prd.md)
- [Home User Account Settings PDP/WBS](./pdp-wbs.md)
- [Home User Account Settings Test Plan](./test-plan.md)
- [ADR 0001：建立 Home User 账户设置边界](./decisions/0001-account-settings-boundaries.md)
- [User Workspace SSR Strategy](../../architecture/user-workspace-ssr-strategy.md)
- [Anonymous Token Route Pattern](../../architecture/anonymous-token-route-pattern.md)
- [Backend Test Resource Lifecycle](../../architecture/backend-test-resource-lifecycle.md)
