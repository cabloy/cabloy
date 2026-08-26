# Home User 账户设置产品交付计划和工作分解结构

## 交付目标

以安全前置、可追溯的垂直增量交付账户能力闭环：已登录 Web/Admin 用户共享的账户设置、个人资料、自助本地密码修改、OAuth-only 的首个本地密码设置，以及 Login 注册和未登录密码恢复。

本计划严格遵循 [PRD](./prd.md) 的八步顺序：先建立 Account 契约和资料边界，再完成凭据/token 安全路径，随后创建共享页面与入口，并以独立的注册/reset 契约关闭 Login 能力闭环。`password-set` 与 `password-reset` 始终保持独立。本文件拥有交付顺序和完成检查；[SRS](./srs.md) 拥有技术契约，[测试计划](./test-plan.md) 拥有可执行验收与证据。

## 交付原则

- 当前 Passport 是每项自助操作的唯一 subject authority；浏览器不能指定目标用户、认证记录、Site 或验证状态。
- Vona 先定义 DTO/controller/OpenAPI 真相，再生成 Zova 消费者；不得手改生成 REST/API 产物。
- 共享账户页面不将 Web 用户工作区误移到 Admin。Account 是已登录用户能力，使用 session SSR 的实际 Passport/Site 准入；Admin 保持其 session SSR 基线，公开 Login/注册/reset 页面保持 public 中性 SSR shell。
- `password-set` 与 `password-reset` 的目的、初始授权、token 和审计必须分离。
- 个人资料与账户安全区块各自拥有草稿、loading、success 与 error 状态。
- 每个安全断言都必须有直接后端/API 证明；菜单、Route Guard、SSR 或浏览器 UI 不能代替服务端授权证明。
- 若现有持久资源需要新增字段或修改 `meta.version.ts`，先取得 `vonaModule.fileVersion` 是否增加的决定；所有 `meta.version.ts` 变更后运行 `npm run test`。

## 工作分解结构

### Phase 10：文档与安全决策基线

依赖：无。

#### WBS-HUA-10-01：冻结规划权威和实现前决策门

主要文档：

- `.docs-internal/business/home-user/prd.md`
- `.docs-internal/business/home-user/srs.md`
- `.docs-internal/business/home-user/test-plan.md`
- `.docs-internal/business/home-user/decisions/0001-account-settings-boundaries.md`

任务：

- 保持 PRD、SRS、WBS、ATP 和 ADR 的身份、密码、token、SSR、注册与 reset 范围一致；
- 决定 Account controller/tag 与 Home API OpenAPI matcher 的归属；
- 决定可编辑资料白名单、首个密码的账户 email 来源、密码策略、会话失效精度、token 生命周期、审计/限流和是否涉及 schema/fileVersion；
- 明确 `password-reset` 不因可复用 `password-set` 基础设施而混淆目的、初始授权或 replacement/enrollment 语义。

验收检查：

- 任何开放策略问题都不会使身份目标、密码、token、会话、审计或 SSR 行为不确定；
- 每项 `PRD-*` 需求均映射到至少一个 `SRS-*`、未来 `WBS-HUA-*` 和 `ATP-HUA-*`；
- 没有文档把未实现的 reset callback 描述成已可用功能。

### Phase 20：自助 Account contract 与资料边界

依赖：`WBS-HUA-10-01`。

#### WBS-HUA-20-01：建立当前账户 capability/read contract

主要区域：

- `vona/src/suite/a-home/modules/home-user/`
- `zova/src/suite/a-home/modules/home-api/`
- `zova/src/suite/a-home/modules/home-passport/`

任务：

- 定义 Account current/capability DTO 和受保护 API，其中 subject 仅派生自当前 Passport；
- 提供必要的 profile 投影、`hasSimpleAuth`、可发 set-link 能力和脱敏邮箱，而不暴露内部 auth 数据；
- 选择并实施 Account controller/tag/OpenAPI matcher 策略；
- 检查 emitted OpenAPI，并通过正常 forward chain 生成 Zova API/schema 消费者。

验收检查：

- 无认证、伪造 `userId`、跨用户与不满足账户状态的调用均不能读取或改变其他账户；
- 生成消费者覆盖预期操作，无手工生成文件修改；
- `SRS-ACC-01`–`SRS-ACC-04`、`SRS-API-01`–`SRS-API-02` 与 `ATP-HUA-ACC-01`、`ATP-HUA-CTR-01` 可追溯。

#### WBS-HUA-20-02：锁定 profile update 边界与 Passport 同步

主要区域：

- Vona `home-user` Account DTO/controller/service
- 现有用户/媒体归属服务
- Zova Account Model 与 `home-passport`

任务：

- 为显示名称、受控头像、locale、tz 定义专用 update DTO、服务端白名单、校验和错误语义；
- 确定头像媒体引用的类型、大小和归属校验；
- 排除 email、mobile、登录标识、角色、账号状态和内部认证字段；
- 定义 profile 成功后的 Passport refresh/replacement 和 locale/tz 同步路径。

验收检查：

- 不允许字段和无效/外部/无归属头像不会形成部分更新；
- 保存后同一运行中的 `$passport` 身份资料和偏好一致；
- `SRS-PRO-*` 与 `ATP-HUA-PRO-01`、`ATP-HUA-PRO-02`、`ATP-HUA-PAS-01` 可追溯。

#### WBS-HUA-20-03：建立 Account contract-loop 检查

主要区域：

- `zova/src/suite/a-home/modules/home-api/cli/openapi.config.ts`
- Vona OpenAPI 输出与生成的 Zova consumers
- root `package.json`

任务：

- 记录并验证 Account forward contract chain：Vona DTO/controller/OpenAPI → emitted contract 检查 → Zova generation；
- 记录 Account 前端 route/metadata 的 reverse-chain 要求；
- 确认 Web/Admin 配对 SSR/REST 输出和 Vona dependency discovery 的产物名称/同步路径。

验收检查：

- 后端 Account contract 变更抵达生成的前端消费者；
- 前端影响 Web/Admin 的变更依次运行 `npm run build:zova:web`、`npm run build:zova:admin`、`npm run deps:vona`；
- 无 REST-only 或手改生成产物作为替代。

### Phase 30：已有本地密码的安全修改

依赖：`WBS-HUA-20-*`。

#### WBS-HUA-30-01：实现 authenticated password-change contract

主要区域：

- `vona/src/suite/a-home/modules/home-user/`
- `vona/src/suite-vendor/a-auth/modules/auth-simple/`
- `vona/src/suite-vendor/a-vona/modules/a-user/`

任务：

- 为已有 `auth-simple` 的当前账户实现 current/new/confirm 密码 DTO 与受保护 action；
- 复用经确认的 hash/verify 原语，实施密码策略、当前密码校验、账户状态校验和本地化错误；
- 定义错误不会改变 hash、会话或成功审计的失败路径；
- 记录并测试 OAuth-only 无本地凭据分支不可走此操作。

验收检查：

- 正确当前密码和合规新密码才可完成变更；错误当前密码、弱密码、确认不匹配和无本地凭据均无部分状态；
- 新凭据生效，旧凭据按政策失效；
- `SRS-PWD-*` 与 `ATP-HUA-PWD-01` 可追溯。

#### WBS-HUA-30-02：实施会话失效和审计原子结果

主要区域：

- 认证 token adapter/Passport 服务
- Account credential service
- 审计与限流基础设施

任务：

- 实现并证明 `SRS-SES-01` 所选“保留当前、撤销其他”或其批准的全 token 回退语义；
- 将 hash 变更、会话处理和安全审计组合为已定义的原子持久结果；
- 定义安全事件、红线字段、限流与并发行为；
- 对需要独立提交的数据库操作优先使用 `@Core.transaction(...)`，不对外部副作用进行无界重试。

验收检查：

- 认证延续行为精确符合用户提示和 SRS；
- 并发改密及失败注入不会留下部分凭据/token/audit 状态；
- 日志、响应、Passport 与测试证据均不泄露密码/hash/token；
- `SRS-SES-01`、`SRS-AUD-*`、`SRS-NFR-*` 与 `ATP-HUA-SES-01`、`ATP-HUA-AUD-01`、`ATP-HUA-RATE-01` 可追溯。

### Phase 40：OAuth-only password-set 链接签发

依赖：`WBS-HUA-20-*`、`WBS-HUA-30-02`。

#### WBS-HUA-40-01：实现 Passport 资格与前端 consumer URL set-link issue

主要区域：

- Vona `home-user` Account capability/service/controller
- 邮件、token、审计与限流基础设施

任务：

- 判断当前账户是否无 `auth-simple`；浏览器显式提交 email 但 subject 始终只由 Passport 派生；
- 在 capability projection 中提供既有账户邮箱的脱敏提示和可进入 flow 的能力，不暴露 provider 内部记录或完整 email；
- 实现受保护的 set-link issue action：既有 `EntityUser.email` 必须规范化匹配且保持权威；空字段只将输入作为短时 token-bound candidate；
- 实施限流、审计、邮件投递失败/重试、candidate 冲突和资格状态变化规则。

验收检查：

- 有 `auth-simple`、无效输入、已有地址 mismatch 或客户端伪造 user/provider/verified state 均不可签发不当链接；
- 既有 `EntityUser.email` 只可在规范化匹配时接收 link；空字段可使用短时 candidate，但不得在签发时持久化，且服务端不读取 auth provider 记录推导收件人；
- `SRS-SET-01`–`SRS-SET-03` 与 `ATP-HUA-SET-01`、`ATP-HUA-SET-02`、`ATP-HUA-RATE-01` 可追溯。

#### WBS-HUA-40-02：建立 password-set purpose-bound token 生命周期

主要区域：

- Account token service/storage
- 邮件 callback/link 构造
- 审计与限流基础设施

任务：

- 设计和实现 `password-set` 的 TTL、purpose、subject 绑定、单次消费、撤销、覆盖、canonical path 与邮件链接 `token` URL query transport 规则；不得使用 fragment/hash 传递；
- 将 token issue 与可审计的邮件投递策略衔接，避免未定义的重放或外部副作用；
- 与独立的 `password-reset` 隔离；不得通过旧 reset listener 将任一流程伪装为另一流程。

验收检查：

- wrong purpose、过期、撤销、重放、覆盖和竞争消费不会得到成功资格；
- 最大一个消费者能转入首个本地凭据创建；
- `SRS-TOK-01`–`SRS-TOK-02` 与 `ATP-HUA-TOK-01` 可追溯。

### Phase 50：公开 token 消费与首个本地凭据

依赖：`WBS-HUA-40-*`。

#### WBS-HUA-50-01：实现公开 password-set 页面和消费 action

主要区域：

- 前端 `home-user` 公共页面/route
- Vona Account token consume action
- Zova router/public route 组合

任务：

- 创建明确 `requiresAuth: false` 的 token 授权公开 route；
- 以一致的 server/hydration shell 显示密码设置表单、有效/无效/过期状态；在 hydration 后从 `token` URL query 捕获 token、立即通过 router replacement 恢复 token-free canonical URL，且不支持 fragment/hash；
- 通过 token 而非浏览器会话授权消费 action，并执行新密码/确认密码校验；
- 防止 token 出现在长期状态、日志、分析、截图或保留测试证据。

验收检查：

- 无 token、malformed、expired、replayed、wrong-purpose 和错误 path token 都安全失败；
- 页面公开性不会绕过后端 token/密码/审计校验；
- `SRS-TOK-03`、`SRS-SSR-03` 与 `ATP-HUA-TOK-01`、`ATP-HUA-SSR-03` 可追溯。

#### WBS-HUA-50-02：创建首个 auth-simple 凭据并处理会话结果

主要区域：

- `auth-simple` 与 Account credential service
- Passport/token adapter
- 审计服务

任务：

- 在成功的有效 token 消费中创建第一个 `auth-simple` 凭据；空账户 email 的 token 必须在同一事务写入 token-bound candidate；
- 对 candidate 使用 opaque email-digest lock 和 scoped business ownership lookup；不得添加 unique index 或持久 pending 字段；
- 应用 `SRS-SES-01` 会话/token 策略，记录安全审计并返回安全的成功结果；
- 证明并发消费、已创建凭据、失败和重试不会重复创建凭据、错误绑定 email 或留下模糊状态。

验收检查：

- 有效 token 仅成功一次，之后可通过新本地密码认证；
- 所有竞争/失败路径均无重复凭据或未定义 token/session 状态；
- `SRS-SET-04`–`SRS-SET-06`、`SRS-SES-01` 与 `ATP-HUA-TOK-01`、`ATP-HUA-SES-01`、`ATP-HUA-AUD-01` 可追溯。

### Phase 60：共享账户体验与 Site 入口

依赖：`WBS-HUA-20-*`、`WBS-HUA-30-*`、`WBS-HUA-50-*`。

#### WBS-HUA-60-01：创建共享 Account 页面、Model 与 locale

主要区域：

- 新建前端 `home-user` 模块
- `home-passport`
- Home API 生成消费者

任务：

- 用 Zova CLI 支持的模块/page/model 工作流建立 `home-user` 页面结构；
- 创建 Account Model，并通过 `$useStateData(...)` 所有 profile/capability 与独立 mutation 状态；
- 组合个人资料和账户安全两个独立区块，依据 `hasSimpleAuth` 呈现修改密码或设置密码；
- 加入现有支持语言的 labels、错误、显式 email 输入、既有地址脱敏提示和 session 影响文案；
- 成功 profile 保存后更新/刷新 `$passport`。

验收检查：

- 两个区块不会相互污染状态；
- OAuth-only 用户不见当前密码字段，已有本地凭据的用户不走 set-link；
- 没有生成 API/类型的手工副本；
- `SRS-UI-01` 与 `ATP-HUA-UI-01`、`ATP-HUA-PAS-01` 可追溯。

#### WBS-HUA-60-02：实现 Web Account session-SSR route

主要区域：

- Web Account route/page
- Web router guard / SSR composition
- Account Model 初始化边界

任务：

- 将静态 canonical `/home/user/account` route 标记为 `requiresAuth: true` 和 `ssrProfile: 'session'`，不为无 params route 增加 route name 或 alias；
- 让 server-side Passport/Site admission 拒绝匿名请求，并让已确认 session 的 SSR 与 hydration 初渲呈现等价的私有 Account 结构；
- 直接 API 继续独立验证 Passport/account ownership，不把 route admission 或菜单可见性视为授权。

验收检查：

- 匿名请求在 server/browser route admission 中转入 Login，并保留受验证的 canonical return destination；
- 已登录硬刷新由 session SSR 首屏渲染 Account，hydration 不出现结构不一致；
- Site deny 和 direct API deny 分别可证；
- `SRS-SSR-01` 与 `ATP-HUA-SSR-01` 可追溯。

#### WBS-HUA-60-03：接入 Admin 与 Web 的账户设置入口

主要区域：

- `home-layoutadmin`
- `home-layoutweb` 或已确认 Web 用户工作区入口
- 共享 `home-user` route

任务：

- 在 Admin 用户菜单的退出登录前插入账户设置导航并保留关闭 details 的现有行为；
- 在 Web 的已登录用户体验中选择并接入等价入口；
- 不复制账户页面、不向 Web 暴露 Admin Resource、不改变布局对领域的所有权；
- 为两端 locale、准入与失败路径完成浏览器验证。

验收检查：

- Web/Admin 均到达共享账户能力，同时保留自身布局；
- Admin 与 Web 的 session SSR 和公开 token/reset 页的中性 SSR 各自符合规定；
- `SRS-UI-02`、`SRS-SSR-02` 与 `ATP-HUA-SSR-02`、`ATP-HUA-UI-01` 可追溯。

### Phase 70：集成、证据与发布关闭

依赖：`WBS-HUA-60-*`。

#### WBS-HUA-70-01：完成 contract、security、SSR 与 Playwright 浏览器验收 验收

主要区域：

- Home User/backend/auth module-local tests
- Basic Web/Admin Playwright 浏览器验收
- OpenAPI/生成 consumer 与配对产物

任务：

- 执行已定义的 service/action/transaction/token 竞争测试；
- 验证 emitted OpenAPI 和 Home API generation；
- 依次运行 `npm run build:zova:web`、`npm run build:zova:admin`、`npm run deps:vona`；
- 完成 Web/Admin SSR、hydration、导航、直接 API、locale 和 Playwright 浏览器验收 journey 验收；
- 按测试计划记录每项 `ATP-HUA-*` 的命令、环境、结果和脱敏证据。

验收检查：

- 所有本期 PRD/SRS 需求都有 `ATP-HUA-*` 证据；
- 无临时豁免过期；
- 所有生成、SSR、token、会话和直接授权路径符合规格；
- WBS 状态只有在证据完整时才能标记 `verified`。

### Phase 80：Login 注册与未登录 password-reset 闭环

依赖：`WBS-HUA-20-03`、`WBS-HUA-30-02`、`WBS-HUA-40-02`、`WBS-HUA-50-*`。

#### WBS-HUA-80-01：接入 Passport 注册入口

主要区域：

- 前端 `home-login`
- Zova `home-passport`
- 已有 Passport registration contract

任务：

- 在 Login 页面提供注册入口和独立公开注册页面；
- 加载生成的 registration schema，复用 username、email、password、confirmation 和 CAPTCHA 契约；
- 在 Passport Model 中复用 generated register mutation；仅当返回 Passport 已获当前 Site 准入时复用正常 JWT 写入和 return navigation。默认 activation-pending 结果保留安全 return destination、显示确认邮件提示并返回 Login，不能复制平行注册 API 或状态，也不得提前赋予 `registeredUser`。

验收检查：

- 注册页使用 generated contract，并以禁用 bearer token 的公开调用完成；
- 成功注册后，已获当前 Site 准入的结果建立 Passport 状态并仅导航到经验证的 return destination；默认 activation-pending 结果保持公开确认状态，不出现 Access denied 页面，并带回安全 return destination 供确认后的重新登录使用；
- `SRS-REG-01`、`PRD-REG-01` 与 `ATP-HUA-REG-01` 可追溯。

#### WBS-HUA-80-02：实现匿名 reset 申请与中性反馈

主要区域：

- Vona `home-user` Account DTO/controller/service
- `home-login` reset-request 页面
- CAPTCHA、rate-limit、mail 与 Redis cooldown 基础设施

任务：

- 建立公开的 email + CAPTCHA reset request contract；
- 以 active、activated、非空 `EntityUser.email` 和 canonical `auth-simple` 作为当前服务端收件资格；
- 实施 IP enforce rate limit、normalized-recipient digest cooldown、脱敏审计和邮件失败清理；
- 对 CAPTCHA 已成功的所有 eligible/suppressed/unavailable 结果返回同一 `{ accepted: true }`，页面只显示通用反馈。

验收检查：

- 浏览器不得提交 user、auth record、provider、verified state 或收件资格；
- 不合格账户、未知地址、cooldown、邮件/配置失败不会签发有效 reset state，也不会改变外部响应；
- `SRS-RST-01`–`SRS-RST-02`、`PRD-RST-01`–`PRD-RST-02` 与 `ATP-HUA-RST-01` 可追溯。

#### WBS-HUA-80-03：实现 purpose-isolated reset token 和 replacement

主要区域：

- Vona `home-user` Account service/cache beans
- `auth-simple`、Passport token adapter、mail 基础设施

任务：

- 使用独立 `password-reset` digest-only state、15 分钟 TTL、current pointer 和 recipient cooldown；Zova 提交 token-free 的完整绝对 consumer URL，Vona 仅接受 HTTP(S)、无 userinfo/query/fragment，且由 `checkOriginExact(...)` 允许精确同源（协议、host、有效端口）或精确匹配既有 `a-security:cors` `whiteList`；Vona 保留前端提供的 pathname，不读取或校验 SSR Site、`publicPath` 或 `siteId`，并仅添加 `token` URL query。请求/proxy host 不能授权 lookalike、suffix、异协议或异端口跨源目的地；生产部署显式配置 HTTPS consumer origin；`dev/test` 仅在 API 与 consumer 都为 loopback hostname 时允许不同端口；
- 将 raw UUID 仅放入由 Vona 添加的邮件 `token` URL query，严格绑定逻辑 `/home/user/password-reset` leaf；请求/proxy header 仅可参与精确同源（协议、host、有效端口）判断，不得以其授权 lookalike、suffix、异协议或异端口跨源，也不得以 `SERVER_SERVE_*`、`Referer`、客户端输入的 mount path 或 CORS wildcard/suffix 语义授权 consumer URL；不持久化 raw token；query 到达请求、日志或 referrer 层的防护由后续 Referrer-Policy 和日志 redaction 工作处理；
- 在 digest lock 后取得共同 per-user password-mutation lock，在 lock 内重验 state/current pointer/资格，在事务中仅调用 `replacePassword()`；
- 事务提交后、lock 仍持有时撤销 server-side session 并清理 reset state；reset 不得创建 OAuth-only 用户的首个 local credential。

验收检查：

- supersession、过期、replay、错误 payload、资格变化、同 token 并发和 reissue/consume 交错安全失败；
- 只有成功 token replacement 后的新密码可用，旧会话被撤销；
- `SRS-RST-02`–`SRS-RST-03`、`PRD-RST-03` 与 `ATP-HUA-RST-02` 可追溯。

#### WBS-HUA-80-04：实现公开 reset 页面和 Login 闭环验收

主要区域：

- 前端 `home-user` public reset page/route
- canonical route 与 Playwright 浏览器验收

任务：

- 提供 public、empty-layout `/home/user/password-reset` 页面；
- 在 hydration 后从 route query 读取 `token`，立即通过 router replacement 恢复 token-free canonical URL，并仅在 controller 内存保留临时 token；
- 成功后清除浏览器 Passport 状态并明确回到 Login；
- 覆盖 Login 导航、注册、neutral request、SSR/hydration、query scrub、invalid/reused 以及强制重新登录的脱敏 browser evidence。

验收检查：

- SSR 与 hydration 初树均不包含 token、私有身份或预填密码；
- reset 页面只短暂从 route query 捕获 token，随即 router-scrub；不得写入 storage、Model state 或可保留 artifact；
- `SRS-RST-04`、`PRD-RST-03`–`PRD-RST-04` 与 `ATP-HUA-RST-03` 可追溯。

## 依赖与 contract-loop 规则

### Vona forward chain

新增或变更 Account DTO/controller 时：

1. 在 Vona 修改 contract truth；
2. 检查 emitted OpenAPI 的 operation、schema、授权和响应；
3. 通过 Home API 的已决定 matcher 生成 Zova consumer；
4. 由薄的 Account Model 消费生成 `$api`/`$apiSchema`；
5. 不手改生成文件。

### Zova reverse chain

共享 Account route、metadata、页面或资源影响 Web/Admin 时：

```bash
npm run build:zova:web
npm run build:zova:admin
npm run deps:vona
```

必须先构建相应 SSR bundle 和 REST output；`build:rest:*` 单独运行不是充分验证。若产物已正确但 Vona 仍看见旧类型，按 local dependency drift 规则重装 `vona/node_modules`，而非修改依赖链接。

## 追溯矩阵

| WBS 范围                       | PRD                                                 | SRS                                    | ATP                                                                                      |
| ------------------------------ | --------------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------- |
| `WBS-HUA-10-01`                | 全部本期 `PRD-*`                                    | 全部本期 `SRS-*`                       | 全部规划 `ATP-HUA-*`                                                                     |
| `WBS-HUA-20-*`                 | `PRD-ACC-*`, `PRD-PRO-*`                            | `SRS-ACC-*`, `SRS-PRO-*`, `SRS-API-*`  | `ATP-HUA-ACC-01`, `ATP-HUA-PRO-01`, `ATP-HUA-PRO-02`, `ATP-HUA-PAS-01`, `ATP-HUA-CTR-01` |
| `WBS-HUA-30-*`                 | `PRD-PWD-*`, `PRD-SEC-*`                            | `SRS-PWD-*`, `SRS-SES-01`, `SRS-AUD-*` | `ATP-HUA-PWD-01`, `ATP-HUA-SES-01`, `ATP-HUA-AUD-01`, `ATP-HUA-RATE-01`                  |
| `WBS-HUA-40-*`, `WBS-HUA-50-*` | `PRD-SET-*`, `PRD-SEC-02`–`PRD-SEC-03`              | `SRS-SET-*`, `SRS-TOK-*`, `SRS-SES-01` | `ATP-HUA-SET-01`, `ATP-HUA-SET-02`, `ATP-HUA-TOK-01`, `ATP-HUA-SSR-03`                   |
| `WBS-HUA-60-*`                 | `PRD-ACC-02`, `PRD-PRO-04`–`PRD-PRO-05`, `PRD-UX-*` | `SRS-UI-*`, `SRS-SSR-*`                | `ATP-HUA-UI-01`, `ATP-HUA-SSR-01`, `ATP-HUA-SSR-02`, `ATP-HUA-PAS-01`                    |
| `WBS-HUA-70-01`                | 全部本期 `PRD-*`                                    | 全部本期 `SRS-*`                       | 全部适用 `ATP-HUA-*`                                                                     |
| `WBS-HUA-80-01`                | `PRD-REG-01`                                        | `SRS-REG-01`                           | `ATP-HUA-REG-01`                                                                         |
| `WBS-HUA-80-02`                | `PRD-RST-01`–`PRD-RST-02`                           | `SRS-RST-01`–`SRS-RST-02`              | `ATP-HUA-RST-01`                                                                         |
| `WBS-HUA-80-03`                | `PRD-RST-03`                                        | `SRS-RST-02`–`SRS-RST-03`              | `ATP-HUA-RST-02`                                                                         |
| `WBS-HUA-80-04`                | `PRD-RST-03`–`PRD-RST-04`                           | `SRS-RST-04`                           | `ATP-HUA-RST-03`                                                                         |

## 完成和证据规则

- `implementation-complete` 表示代码任务完成，不表示已通过验收。
- `verified` 需要测试计划定义的 ATP、命令、环境、结果和脱敏证据。
- 任何 waiver 需写明负责人、原因和到期时间；到期后自动成为阻塞项。
- 需求变更先修改 PRD 或 SRS 的权威记录，再更新 WBS、测试计划、ADR 和进度登记。

## 相关记录

- [Home User 账户设置 PRD](./prd.md)
- [Home User Account Settings SRS](./srs.md)
- [Home User Account Settings Test Plan](./test-plan.md)
- [Home User Account Settings Delivery Progress](./progress.md)
- [ADR 0001：建立 Home User 账户设置边界](./decisions/0001-account-settings-boundaries.md)
