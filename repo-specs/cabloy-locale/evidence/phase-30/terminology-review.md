# Terminology Review Handoff

## AccountUserName Supplement — 2026-10-27

Current review boundary: the user approved “同意，请执行下一步” for the bounded two-dictionary supplement, focused inventory/placeholder verification and readiness reconciliation. That execution approval did not supply language acceptance. On 2026-10-27, reviewer `zhennann` subsequently supplied the explicit supplemental declaration:

> 这两个新增译文均 accept，无 correct/query

The declaration covers exactly the two displayed translations below at base `398f2e270aac823a6feb0da5eac534e5867798e8` plus the retained two-file source diff SHA-256 `e81c82b47b8c00a2e18fb18da7f14d98e55e39592523b5aaa298950e6b12b8e0`. Both source hashes still match the tested candidate; no correction or source change followed acceptance. Base `398f2e270aac823a6feb0da5eac534e5867798e8`, dirty with the preceding approved documentary closeout; exact two-file diff/hash and successful checks are retained in [supplement checks](./artifacts/account-username-398f2e-checks.txt).

| Locale | Target / key | Added text | Source meaning / context | Human disposition |
| --- | --- | --- | --- | --- |
| ja-jp | home-user / AccountUserName | `ユーザー名` | `User name` / `用户名`; account user name, distinct from display name | accept; no correct/query; reviewer `zhennann` |
| zh-tw | home-user / AccountUserName | `使用者名稱` | Same account label, distinct from `AccountDisplayName` | accept; no correct/query; reviewer `zhennann` |

Both values reuse the corresponding already accepted `home-login/YourUsername` wording. Claude Code checked source meaning and consistency; the human acceptance comes from the subsequent explicit declaration above, not that automated review. The original 1,548-entry acceptance remains valid for unchanged entries, and the new declaration accepts the two additions. Current delivered total is 1,550 accepted entries, with zero corrections and zero unresolved queries; no repeated all-entry review was required.

The existing inventory test passes for both stacks/packs, including exact target/key parity, nonempty text, message kind, placeholders/format tokens, plural variants and the callable email entry. Source inventory SHA-256 is `2708abc5da3821fca7e78c0553579276caecadb9b0d12ef28821da7ba3899333`: Vona remains 28 targets / 320 module + 68 core keys per language; Zova is 23 targets / 387 keys per language. Source format/lint and diff checks pass. No test code, generator, metadata, imports, route, API, policy, Zod adapter, runtime state or SSR behavior changed. No application build, consumer/runtime integration verification, dependency sync or publication was performed.

WBS-LOC-30-01 / ATP-LOC-05 are `verified` for the supplemented inventory. The explicit two-entry declaration closes the remaining language gate for WBS-LOC-50-01 / ATP-LOC-08; see [current readiness reconciliation](../phase-50/index.md#accountusername-supplement-disposition--2026-10-27). ATP-LOC-07 guidance review remains satisfied; excluded phase-40 verification is not reinstated. No further terminology decision, implementation approval or broad rerun is pending. Publication remains separate.

## Historical Review State

**WBS-LOC-30-01: verified.** On 2026-10-26, reviewer `zhennann` explicitly declared all current Japanese/Taiwan Traditional Chinese entries accepted, with no corrections or queries, including the added language name. The [current all-entry disposition](#current-all-entry-acceptance-2026-10-26) supersedes the earlier missing-disposition gate. The earlier execution approval alone was not language acceptance. No dictionary source was changed during this reconciliation.

Current candidate: `36756a972a7f5c72627ecdfa5bc0173252cbc73e`, clean at execution start; only evidence/derived records are dirty afterward. Compared with the reviewed revision, four Zova dictionary lines add `LanguageTraditionalChinese`: source `Traditional Chinese` / `繁体中文`, Japanese `繁体字中国語`, Taiwan Traditional Chinese `繁體中文`. The original review and no-change assertions below remain historical; they do not cover this added entry. Current automatic checks and paired build/sync evidence are recorded in [the current-candidate reconciliation](./dictionaries.md#current-candidate-reconciliation-36756a972a).

- Suite: `cabloy-locale`
- Edition: Cabloy Basic
- Task: [WBS-LOC-30-01](../../pdp-wbs.md#wbs-loc-30-01-complete-both-language-packs-against-the-release-inventory)
- Acceptance procedure: [ATP-LOC-05](../../test-plan.md#atp-loc-05-close-inventory-placeholder-and-terminology-coverage)
- Historical reviewed candidate revision: `35b0b6b9871a0d4679ea230ccdfc4b0a871e673c`
- Implementation base: `6ca3c1d6fc59e7f5c744f2ddc15dbffe9364885e`
- Retained dirty-worktree implementation digest: `5b5b697a7bd4a1b05eb08b7c556bd19ba559a3849f8d270bf6c4cdcc70943fb6`
- Current committed-tree diff digest: `bfc50b9ae976c47a4d5fa977aa46db3690fd73b6aca3a8cdc1722d238764f157`
- Authored source inventory hash: `01e0e5768bff061466bc0a8b2a8c05d0786a7772d26c67a8277b85db29414e4b`

The two implementation digests use different patch serialization boundaries. The retained `5b5b...` value was calculated from the original dirty worktree, combining the tracked diff with sorted untracked source files. The `bfc50...` value is calculated from the committed tree diff from the same base to the current revision. The source path set and authored bytes are unchanged by the commit; the committed-tree digest is recorded so a reviewer can identify the exact current revision without treating the historical dirty digest as a reproducible commit hash.

## Current All-Entry Acceptance: 2026-10-26

Reviewer `zhennann` subsequently supplied this explicit declaration in the conversation:

> 明确声明当前全部日语/台湾繁中词条均为 accept、无 correct/query，并包含新增语言名称

The declaration covers current reviewed revision `6d6d9401f7a5614f7d77ae858c2a53f5b7dc2188`, clean before documentary closure. `git diff --quiet 36756a972a -- vona zova` returned 0: all authored runtime, dictionaries, tests and lockfiles are identical to the tested candidate. Only evidence/derived records changed between those revisions. No correction was requested or made, so existing automatic/build/style proof remains applicable; business checks were not redundantly rerun.

[Complete expanded dispositions](./artifacts/terminology-6d6d94-dispositions.txt) retain the exact declaration and revision followed by one JSON record per delivered entry: stack, locale, target/core, repository-relative path, key, current text, value kind, owning source text/path, `accept`, no correction, no unresolved query, and reviewer attribution. This is **mechanical expansion of the human blanket declaration**, not a new independent AI terminology review or a claim that the reviewer authored the expanded file. Source context uses the inventory's English-preferred union with Chinese-only entries retained. The sole callable key uses synthetic `{inventory-email}` and retains function kind; no real email is retained.

| Stack | Japanese accepted | Taiwan Traditional Chinese accepted | Corrections | Queries |
| --- | ---: | ---: | ---: | ---: |
| Vona (320 module + 68 core keys) | 388 | 388 | 0 | 0 |
| Zova (386 module keys) | 386 | 386 | 0 | 0 |
| Total | 774 | 774 | 0 | 0 |

All **1,548** entries are accepted. This includes `LanguageTraditionalChinese`: Japanese `繁体字中国語` and Taiwan `繁體中文`, source `Traditional Chinese`. The declaration resolves all historical candidate questions below; their original `OPEN` cells are retained as historical preparation, not current unresolved queries. Earlier revision/hash/no-change statements below remain historical. The existing language competence and domain-context declarations remain the reviewer attribution; no new qualification is invented.

ATP-LOC-05 is closed with this human disposition and the retained current automatic evidence. WBS-LOC-30-01 is verified for dictionary delivery. Full browser/schema/validation/SSR-hydration and release acceptance are not inferred. WBS-LOC-40-01 and WBS-LOC-50-01 remain not-started and require their own execution approval.

## Historical Reviewer Assignment and Declaration

### Japanese review

- Reviewer identity: `zhennann`
- Japanese competence/context: `有`
- Cabloy UI/framework, validation, Commerce, and Training context: `熟悉`
- Review completion: `2026-10-26` (user-provided declaration)
- Reviewed revision: `35b0b6b9871a0d4679ea230ccdfc4b0a871e673c`
- Reviewer-reported disposition state: `COMPLETE`

### Taiwan Traditional Chinese review

- Reviewer identity: `zhennann`
- Taiwan Traditional Chinese competence/context: `有`
- Cabloy UI/framework, validation, Commerce, and Training context: `熟悉`
- Review completion: `2026-10-26` (user-provided declaration)
- Reviewed revision: `35b0b6b9871a0d4679ea230ccdfc4b0a871e673c`
- Reviewer-reported disposition state: `COMPLETE`

The reviewer declared that per-entry dispositions, correction rationale/unresolved-question handling, affected automatic reruns, and evidence updates were completed. The current worktree contains no post-review dictionary source edits, and the focused inventory, Zova runtime, Vona runtime, and native typecheck reruns at the reviewed revision passed; their independently retained summary is [terminology-review-reruns.txt](./artifacts/terminology-review-reruns.txt). However, the declaration does not itself reproduce the per-entry disposition artifact or reviewer-produced format/lint/build outputs. The tables below therefore remain the candidate register requiring disposition evidence; ATP-LOC-05 is not closed from this declaration alone. Machine-generated candidates and automatic parity do not count as language approval.

## Required Review Scope

Review all delivered text in both provider packs, not only the highlighted candidates:

- `vona/src/suite/cabloy-locale/modules/locale-jajp/src/lib/locales/`
- `vona/src/suite/cabloy-locale/modules/locale-zhtw/src/lib/locales/`
- `zova/src/suite/cabloy-locale/modules/locale-jajp/src/lib/locales/`
- `zova/src/suite/cabloy-locale/modules/locale-zhtw/src/lib/locales/`
- composed resources in each provider's `src/locales/ja-jp.ts`, `src/locales/zh-tw.ts`, and `src/locales/index.ts`
- core global status/error text, especially keys `226` and `506`

The historical inventory covers 28 Vona targets and 23 Zova targets per language, with 320 Vona module keys and 385 Zova module keys per language, plus 68 Vona core keys per language. At current candidate `36756a972a`, Zova has **386** keys per language; other counts are unchanged. Current source inventory SHA-256: `ce33bb93c3bc3a8c1fcdf9195c2d677502e6a0ff9c0d467a0c57a0b67c9cf2c5`. Review every delivered entry, including the new language name, and record every exclusion or unresolved question. The current automatic reruns do not replace per-entry human dispositions.

For each reviewed entry, record:

```text
path:
key:
current value:
source meaning/context:
disposition: accept | correct | query
proposed correction:
reviewer note:
```

## Japanese Review Prompts

These are prompts from the implementation handoff, not a completed Japanese scan and not approved corrections. The complete Japanese inventory remains in scope.

| Semantic area | Current term | Review question |
| --- | --- | --- |
| Instance | `インスタンス` | Does this match the product's established Japanese terminology? |
| Training Student | `受講生` | Is this the correct term for the training-domain subject? |
| Stock reservation | `引当` | Does this accurately express stock reservation/allocation in context? |
| Coupon redemption | `利用` | Is this the intended coupon-use term? |
| Refund recovery | `返金リカバリー` | Is this natural and stable product wording? |
| Upload scene | `シーン` | Is a clearer business expression required? |
| Cents | `セント` | Does this preserve the source amount-unit semantics? |
| Core status/error | keys `226`, `506` | Are tone, framework terminology, and user comprehension correct? |

No complete Japanese candidate scan was produced in the preparation step; do not represent this prompt table as exhaustive Japanese review evidence.

## Taiwan Traditional Chinese Candidate Dispositions

The following machine-assisted candidates were extracted from authored dictionaries. They require human accept/correct/query dispositions and are not recommendations to change text automatically.

### Core, validation, and authorization

| Path | Key | Current value | Source meaning/context | Disposition |
| --- | --- | --- | --- | --- |
| `vona/.../locale-zhtw/src/lib/locales/a-orm.ts` | `TableIdentity` | `識別碼` | ID | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/a-orm.ts` | `InstanceId` | `執行個體識別碼` | Instance ID | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/a-orm.ts` | `ShouldSpecifyTable` | `請指定資料表名稱` | Table name is required | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/a-openapiutils.ts` | `ZodErrorRequired` | `必填欄位` | Required field | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/a-validation.ts` | `ValidationFailedPipeValidationInvalidContent` | `驗證失敗（內容無效）` | Validation failed: invalid content | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/a-rbac.ts` | `ResourceBulkIdsEmpty` | `批次操作必須提供資源 ID` | Bulk operation requires resource IDs | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/a-rbac.ts` | `ResourceBulkEntriesMissing` | `一個或多個批次操作的資源項目不存在` | One or more bulk resource entries are absent | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/a-zod.ts` | `ZodErrorRequired` | `必填` | Required | `OPEN` |

### Navigation and tables

| Path | Key | Current value | Source meaning/context | Disposition |
| --- | --- | --- | --- | --- |
| `zova/.../locale-zhtw/src/lib/locales/basic-page.ts` | `Search` | `搜尋` | Search | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/basic-page.ts` | `PagedTotalItems` | `總筆數` | Total item count | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/basic-page.ts` | `PagedTotalPages` | `總頁數` | Total page count | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/basic-page.ts` | `Select` | `選取` | Select | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/basic-page.ts` | `BulkActions` | `批次操作` | Bulk actions | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/basic-page.ts` | `SelectionActionUnavailable` | `請選取一筆以上有權限的資料，以啟用此操作` | Select one or more permitted rows to enable this action | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/basic-page.ts` | `SelectionActionMaxExceeded` | `最多可選取 %d 項以啟用此操作` | Select no more than `%d` items to enable this action | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/basic-table.ts` | `Create` | `新增` | Create | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/basic-table.ts` | `SelectAllPageRows` | `選取本頁所有資料` | Select all rows on this page | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/basic-table.ts` | `SelectRow` | `選取第 %s 筆資料` | Select row `%s` | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/basic-table.ts` | `Refresh` | `重新整理` | Refresh | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/basic-table.ts` | `ColumnConfiguration` | `欄位設定` | Column configuration | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/basic-table.ts` | `Columns` | `欄位` | Columns | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/basic-table.ts` | `Save` | `儲存` | Save | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/basic-table.ts` | `Reset` | `重設` | Reset | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/basic-resource.ts` | `SelectedItems` | `已選取 %d 項` | Selected item count | `OPEN` |

Review question: confirm whether row-selection strings should use `資料` or the more explicit `資料列`, and whether `總筆數`, `選取`, and related UI terms match the product's Taiwan conventions.

### Layout, catalog, member, promotion, and commerce

| Path | Key | Current value | Source meaning/context | Disposition |
| --- | --- | --- | --- | --- |
| `zova/.../locale-zhtw/src/lib/locales/home-layoutadmin.ts` | `Route Query` | `路由查詢參數` | Route query parameters | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/home-layoutadmin.ts` | `Route Params` | `路由路徑參數` | Route path parameters | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/home-layoutadmin.ts` | `Locale` | `本地化` | Localization | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/home-layoutadmin.ts` | `Todo: CRUD` | `待辦事項：新增、查詢、修改、刪除` | CRUD task label | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/commerce-catalog.ts` | `Available` | `可用庫存` | Available inventory | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/commerce-catalog.ts` | `ParentCategory` | `上層分類` | Parent category | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/commerce-catalog.ts` | `ProductContent` | `商品詳情` | Product content/details | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/commerce-catalog.ts` | `Published` | `已發布` | Published | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/commerce-catalog.ts` | `SkuLifecycle` | `SKU 生命週期` | SKU lifecycle | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/commerce-member.ts` | `CountryCode` | `國家／地區代碼` | Country/region code | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/commerce-member.ts` | `Region` | `縣市／州／地區` | Region | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/commerce-member.ts` | `PostalCode` | `郵遞區號` | Postal code | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/commerce-member.ts` | `Phone` | `聯絡電話` | Phone | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/commerce-promotion.ts` | `CouponAudit` | `優惠券稽核` | Coupon audit | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/commerce-promotion.ts` | `CouponGrant` | `優惠券發放` | Coupon grant | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/commerce-promotion.ts` | `DiscountPolicy` | `折扣規則` | Discount policy | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/commerce-promotion.ts` | `ReservationCorrelationId` | `保留作業關聯 ID` | Reservation operation correlation ID | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/commerce-promotion.ts` | `TemplateNameSnapshot` | `範本名稱快照` | Template-name snapshot | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/commerce-trade.ts` | `OrderFulfillment` | `訂單履約資訊` | Order fulfillment information | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/commerce-trade.ts` | `OrderReservation` | `庫存保留` | Inventory reservation | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/commerce-trade.ts` | `OrderMoney` | `金額彙總` | Money summary | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/commerce-trade.ts` | `ReservationExpiresAt` | `保留截止時間` | Reservation expiry time | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/commerce-trade.ts` | `StockAudit` | `庫存稽核` | Stock audit | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/commerce-trade.ts` | `StockBalance` | `庫存餘額` | Stock balance | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/commerce-trade.ts` | `PriorOnHand` | `異動前現有庫存` | On-hand stock before the movement | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/commerce-trade.ts` | `Carrier` | `物流業者` | Carrier | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/commerce-trade.ts` | `TrackingNumber` | `物流追蹤號碼` | Tracking number | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/commerce-trade.ts` | `UnitPriceCents` | `單價（分）` | Unit price in cents | `OPEN` |

Review questions: confirm `稽核` versus `審計`, the domain use of `履約`, technical use of `快照`, the meaning of `庫存餘額`, and that `分` is a currency subunit rather than a currency-name change.

### Payment, account, file, image, Markdown, and training

| Path | Key | Current value | Source meaning/context | Disposition |
| --- | --- | --- | --- | --- |
| `zova/.../locale-zhtw/src/lib/locales/commerce-trade.ts` | `PaymentStatusVerification` | `商城更新訂單前，會先驗證付款狀態。` | Payment status is verified before Commerce updates an order | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/commerce-trade.ts` | `PaymentSessionUnavailable` | `目前無法使用付款工作階段，您可以開啟訂單。` | Payment session is unavailable; the order may be opened | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/commerce-trade.ts` | `PaymentProviderReturnCanResume` | `您尚未完成付款就從金流服務商返回。付款狀態已更新，您可以繼續付款或開啟訂單。` | Return from payment provider before completing payment | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/commerce-trade.ts` | `WaitingForPaymentSettlement` | `正在等待金流服務商的確認通過驗證，以及訂單結算完成…` | Waiting for provider confirmation and order settlement | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/commerce-trade.ts` | `ReconcileProviderRefund` | `核對金流服務商退款` | Reconcile provider refund | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/commerce-trade.ts` | `RefundRecoveryState` | `金流服務商操作：{state}；嘗試次數：{attemptCount}` | Provider operation state and attempt count | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/commerce-trade.ts` | `ShipOrderConfirm` | `確定要使用填寫的物流資訊為這筆訂單出貨嗎？` | Confirm shipment using entered shipping information | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/home-user.ts` | `UserActivated` | `身分已啟用` | User/account activated | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/home-user.ts` | `RoleLocales` | `角色多語系文字` | Role-localized text | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/home-user.ts` | `AccountLocale` | `語言與地區` | Account language and region | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/home-user.ts` | `AccountSecurity` | `帳號安全性` | Account security | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/home-user.ts` | `AccountSetPasswordHelp` | `設定本站密碼，供日後登入使用。` | Set the site's password for later sign-in | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/basic-file.ts` | `ReplaceFile` | `替換檔案` | Replace file | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/basic-file.ts` | `SelectFile` | `選取檔案` | Select file | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/basic-file.ts` | `UploadedAt` | `上傳時間` | Upload time | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/basic-image.ts` | `ApplyCrop` | `套用裁切` | Apply crop | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/basic-image.ts` | `AdjustImage` | `請拖曳或調整裁切範圍的大小，以調整圖片。` | Adjust the image crop area | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/basic-markdown.ts` | `OrderedList` | `編號清單` | Ordered list | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/basic-markdown.ts` | `TableSizeStatus` | `已選取的表格大小` | Selected table size | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/basic-markdown.ts` | `AddRowBefore` | `在上方新增列` | Add row before | `OPEN` |
| `zova/.../locale-zhtw/src/lib/locales/basic-markdown.ts` | `AddColumnBefore` | `在左側新增欄` | Add column before | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/training-student.ts` | `Level` | `培訓階段` | Training stage | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/training-student.ts` | `LevelAdvanced` | `進階研修班` | Advanced stage | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/training-student.ts` | `LevelIntermediate` | `提升班` | Intermediate stage | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/training-student.ts` | `StudentContent` | `學生詳細資料` | Student details | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/training-student.ts` | `DossierFiles` | `培訓檔案附件` | Training dossier attachments | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/training-student.ts` | `StudentSelect` | `查詢學生清單` | List/search students | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/training-student.ts` | `TrainingRecords` | `學生培訓紀錄` | Student training records | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/training-student.ts` | `TrainingRecordSubjects` | `學生培訓紀錄明細` | Training-record subjects/details | `OPEN` |
| `vona/.../locale-zhtw/src/lib/locales/training-record.ts` | `TrainingTime` | `培訓時間` | Training time | `OPEN` |

Review questions: confirm `金流服務商` versus `支付服務商`, `結算` versus `清算`, `工作階段` audience suitability, `身分` versus account terminology, `本站` site-password context, `培訓` versus `訓練`, stage-name semantics, and `明細` versus `詳細資料`.

## Review Output and Correction Gate

The reviewer must add one disposition for every delivered entry, not only the candidate tables. Use `accept` when the current value is approved, `correct` when a replacement is required, and `query` when product or domain clarification is needed. Preserve the source key and interpolation/plural/format-token contract in every correction.

If any entry is corrected, update the current source revision and inventory/diff attribution, then rerun the focused inventory and placeholder/plural/token checks plus affected runtime, typecheck, format/lint, and required build/sync checks. Retain the reviewer record and corrected results together. If unresolved `query` entries remain in required release text, ATP-LOC-05 remains open.

Do not start WBS-LOC-40-01 or WBS-LOC-50-01 from this handoff. No commit, push, publication, deployment, reset, initialization, environment change, dependency deletion/reinstallation, or module recreation is authorized by this record.
