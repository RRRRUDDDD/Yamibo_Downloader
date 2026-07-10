# v2.7 优化修复计划

> 状态：已确认执行
> 基线版本：v2.6（commit c80f331）
> 目标文件：`yamibo_downloader.user.js`
> 日期：2026-07-10

## 一、背景与目标

对 v2.6 全量代码审查发现 5 处正确性问题与若干健壮性、性能、保真度缺陷。
本计划按「正确性 → 健壮性/性能 → 保真度」三批实施，保持现有功能与 README 契约不被破坏，
所有改动通过仿 Discuz 页面的浏览器端到端测试验证后再提交。

## 二、问题清单与修复方案

### 第一批：正确性（必须修）

| # | 问题 | 位置（v2.6） | 根因 | 方案 |
|---|------|--------------|------|------|
| 1 | 封面选择存在并发竞态 | `generateEPUB` 中 `images[0]` | 章节以并发 2 抓取，图片注册顺序 = 网络完成顺序，`registry[0]` 不一定是第一章首图 | 新增 `pickCoverImage(chapters, images)`：按章节顺序扫描内容中第一个图片引用，且仅取下载成功（buffer 非空）的条目；`properties="cover-image"` 与 `<meta name="cover">` 均改用该结果 |
| 2 | 下载失败的 1x1 占位图可能成为封面 | 同上 `idx === 0` 分支 | 占位替换后仍保留 cover 标记 | 并入 #1：跳过 buffer 为空的条目，全部失败则不设封面 |
| 3 | `page=1` 子串误判 | `fetchOneChapter` 回退分支 `!url.includes('page=1')` | 子串匹配把 `page=10/11/12…` 误判为第 1 页 | 改用 `url.match(/[?&]page=(\d+)/)` 解析数值后比较 `> 1` |
| 4 | 全楼层模式楼主 uid 可能认错 | `collectAllOPFloors` 取当前页首帖作者 | 目录链接（findpost 跳转）可能落在第 2+ 页，该页首帖不是楼主 | 新增 `resolveOPUid`：URL 含 `authorid=` 过滤或当前页（`.pg strong`）为第 1 页时信任首帖；否则回读该 tid 第 1 页确认，失败时退回当前页首帖并告警 |
| 5 | 楼主分页中途失败静默缺楼 | `forEachOPPage` 非首页 catch 后继续 | 单页失败只 console.warn，章节不标记 failed，不进重试弹窗 | 移除页级吞错：任一页失败直接抛出，由 `fetchOneChapter` 标记章节失败并纳入既有重试流程；`fetchOPFloorsHelper` 相应变为全有或全无（按钮显示「获取失败」，可重点） |
| 6 | 章节失败后解析途中注册的插图成孤儿 | #5 引入的新边界 + 重试后跳过场景 | 图片注册发生在解析期，章节最终被占位替换后其图片仍被下载打包 | 打包前按章节内容中的 `src="../Images/…"` 引用集过滤 `registry`，只下载、打包被引用的插图（`usedImages`） |

### 第二批：健壮性与性能

| # | 问题 | 方案 |
|---|------|------|
| 7 | 插图请求无超时、无重试 | `GM_xmlhttpRequest` 增加 `timeout: 30000` + `ontimeout`；抽取 `withRetry(taskFn, retries)` 统一退避策略（与页面抓取一致：500ms×(n+1)+随机抖动），`fetchImageBuffer` 接入；下载失败数量以 error toast 汇总提示（原 console.warn 保留） |
| 8 | `fetchHtml` 无超时 | 新增 `fetchWithTimeout`（AbortController，30s），`fetchHtml` 复用 `withRetry` |
| 9 | fetch 里的 `Referer` 头是死代码 | `Referer` 属 Fetch 规范 forbidden header，浏览器静默忽略；从 fetch 调用移除，仅保留 GM 版（GM 可真正设置） |
| 10 | ZIP 全局 level 0，文本零压缩 | 全局改 `level: 6`；图片条目与占位图改 `[u8, {level: 0}]`；`mimetype` 维持既有 `{level: 0}` 且仍为首条目（fflate 按插入序写入） |
| 11 | 同一 tid 多章节勾全楼层重复全量抓取 | `startExtraction` 内建 `opContentCache: Map<tid, Promise<string>>`，缓存 `collectAllOPFloors` 的 Promise；reject 时删除缓存以便重试；图片注册按 URL 去重天然幂等 |
| 12 | `runLimitedPool` 静默吞异常 | catch 中补 `console.warn` |
| 13 | 大章节列表重建逐个 appendChild | 抽取 `renderChapterList(listDiv, links)`，用 DocumentFragment 一次插入；初次构建与「获取楼主全部楼层」重建共用 |
| 14 | 选择弹窗无 ESC/遮罩关闭 | `buildModal` 支持 Escape 键与点击遮罩空白处关闭（等价取消）；`ydConfirm`（重试询问）保持不变，避免误触跳过 |
| 15 | 退避 sleep 代码重复 | 抽取 `sleep(ms)`，替换全部 `new Promise(r => setTimeout(...))` |

### 第三批：保真度

| # | 问题 | 方案 |
|---|------|------|
| 16 | 全角 `＆` 替换 hack 改变原文 | 移除三处替换（`parseToParagraphs` 文本节点、打包前标题替换、`domToBbcode` 文本节点）；EPUB 依赖 `escapeXML` 输出 `&amp;`，TXT 经 innerHTML 解析还原为原始 `&` |
| 17 | 行内样式丢失（i/em/u、`<font>` 颜色字号） | 白名单扩为映射表 `INLINE_TAG_MAP`：`b/strong/i/em/u/sub/sup/ruby/rt/span` 透传，`s/strike/del → s`，`font → span`；新增 `buildInlineAttrs`：`style` 保留，旧式 `color` 属性并入 style，`font` 的 `size(1-7)` 按传统映射转 `font-size` 关键字、`face` 转 `font-family`，保证 XHTML5/epubcheck 兼容（不再输出裸 `color` 属性与 `<font>` 元素） |
| 18 | 图片 MIME 仅靠 URL 猜测 | 新增 `sniffImageMime(buffer)`：按 PNG/JPEG/GIF/WebP 文件头校正 `img.mime`（文件名后缀不改，避免破坏已生成的内容引用；EPUB 阅读器以 manifest MIME 为准） |
| 19 | 图片 alt 丢弃原始信息 | `parseToParagraphs` IMG 分支优先使用原始 `alt`，为空时回退内部文件名；TXT 的 `[图片: …]` 随之受益 |
| 20 | 版本与文档 | `@version` 2.6 → 2.7；README 同步：插图请求自动重试、封面按章节顺序取首张成功插图、同帖全楼层缓存说明 |

## 三、不做范围（本轮明确不改）

- **CUSTOM_CSS 模板裁剪**：README 将其定位为用户可定制模板，裁剪会破坏该契约，留待单独讨论。
- **`@connect *` 收敛**：帖内外链图床域名不可枚举，收敛会造成图片抓取失败，属有意取舍。
- **`@require` 增加 SRI 哈希**：哈希写错会导致脚本整体加载失败，风险大于收益，留待发布流程完善后处理。
- **`ydConfirm` 的 ESC/遮罩关闭**：重试询问弹窗误触等价「跳过」，有副作用，不加。
- **BOTH 模式 Chrome「允许多个下载」提示**：浏览器权限行为，脚本侧无可靠规避手段。
- **楼主分页页级局部重试**：采用章节级整体重试策略（#5），实现简单且不会产生部分内容拼接的正确性风险。

## 四、实施步骤与提交拆分

1. `docs: 新增 v2.7 优化修复计划文档` —— 本文档。
2. `feat: v2.7 ...` —— 上述全部代码改动 + README + 版本号（与仓库既有「一版本一提交」风格一致），
   提交正文按「正确性修复 / 健壮性与性能 / 保真度」三段逐条列出。

不推送远端、不开 PR（推送需用户另行确认）。

## 五、验收标准

1. `node --check yamibo_downloader.user.js` 通过。
2. 浏览器端到端测试（仿 Discuz 固定页面 + stub `GM_*`/`fetch`，走完整「按钮 → 弹窗 → 确认 → 打包下载」流程）全部断言通过：
   - ESC 可关闭选择弹窗且按钮复位；
   - 产出 EPUB + TXT 两个下载，文件名保留原始 `&`；
   - ZIP 结构：`mimetype` 为首条目且 method=0，`Text/*.xhtml` method=8，`Images/*` method=0；
   - 封面：并发下第二章先完成、且第一章首图下载失败的情况下，cover 仍为第一章第一张**成功**插图（`properties="cover-image"` 唯一，`<meta name="cover">` 指向同一 id）；
   - MIME 嗅探：`.jpg` 后缀实际 PNG 内容的插图 manifest 标注 `image/png`；
   - 正文：`A&B` 在 XHTML 中为 `A&amp;B`、TXT 中为 `A&B`，全书不含全角 `＆`；`<i>` 保留，`<font color size>` 转为 `<span style="color…; font-size…">`，无 `<font>` 残留；
   - 图片 alt 使用原始 alt，TXT 占位为 `[图片: 原始alt]`；失败插图以占位图打包且不作封面；
   - 全楼层：链接落在第 2 页首帖非楼主的固定场景下，正确回读第 1 页并按真实楼主 `authorid=777` 过滤（错误 uid 999 的请求数为 0）；同 tid 两章节内容一致且楼主分页每页只抓取一次；
   - 失败章节触发重试询问，选择跳过后以占位内容打包并 toast 汇总；
   - NCX navPoint 数与章节数一致，nav.xhtml/toc.xhtml 存在。
3. 人工核对 diff：无调试代码、无遗留 `＆` 替换、无遗留 fetch Referer。

## 六、风险与回滚

- 全部改动集中于单文件用户脚本，回滚 = revert 对应提交。
- `forEachOPPage` 语义变化（页级失败上抛）使「获取楼主全部楼层」列表由部分成功变为全有或全无：
  这是有意为之（静默缺楼比整体失败更糟），已在计划与提交说明中声明。
- ZIP 压缩级别变化不影响 `mimetype` 首条目与 store 要求，端到端测试覆盖。
