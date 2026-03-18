# 百合会下载器 (Yamibo Downloader)

一个用于百合会论坛（bbs.yamibo.com）的 Tampermonkey 脚本，支持将论坛内的连载贴或特定标签下的帖子提取并打包为规范的 EPUB 或 TXT 电子书。

## 特性

- **多格式导出** — EPUB / TXT / 两者同时下载
- **智能章节识别** — 自动解析一楼超链接目录，无目录时自动抓取楼主全部楼层
- **标签合集打包** — 支持标签聚合页一键提取全部帖子
- **章节筛选** — 支持表达式语法快速筛选章节
- **图片提取** — 自动抓取帖内插图并嵌入 EPUB
- **格式记忆** — 自动记住上次选择的下载格式

## 安装说明

1. 确保浏览器已安装 [Tampermonkey](https://www.tampermonkey.net/) 扩展程序。
2. 选择以下任一来源安装脚本：

| Greasy Fork | GitHub 源 | jsDelivr 源 |
| --- | --- | --- |
| [安装](https://greasyfork.org/zh-CN/scripts/567671-%E7%99%BE%E5%90%88%E4%BC%9A%E4%B8%8B%E8%BD%BD%E5%99%A8) | [安装](https://raw.githubusercontent.com/RRRRUDDDD/yamibo_downloader/main/yamibo_downloader.user.js) | [安装](https://cdn.jsdelivr.net/gh/RRRRUDDDD/yamibo_downloader@main/yamibo_downloader.user.js) |

## 使用说明

### 提取帖子内容

1. 进入百合会任意帖子页面（脚本优先识别一楼的超链接目录；若无目录，会自动抓取楼主的全部楼层）。
2. 页面标题旁会出现 **"提取本帖内容"** 按钮，点击后弹出选择弹窗。
3. 在弹窗中选择**下载格式**（EPUB / TXT / EPUB + TXT）并勾选需要下载的**章节**。
4. 若当前显示的是超链接目录且没有所需内容，可点击底部 **"获取楼主全部楼层"** 切换为按楼层提取。
5. 点击 **"确认提取"**，等待抓取与打包完成，文件自动保存至浏览器下载目录。

### 章节筛选

在弹窗的控制栏中点击 **"筛选"** 按钮展开筛选面板，支持以下表达式语法：

| 语法 | 含义 | 示例 |
| --- | --- | --- |
| `N` | 单独第 N 章 | `99` → 第 99 章 |
| `A-B` | 第 A 到第 B 章 | `9-99` → 第 9~99 章 |
| `A-` | 第 A 章起到末尾 | `9-` → 第 9 章起 |
| `-B` | 从头到第 B 章 | `-99` → 到第 99 章 |
| 组合 | 逗号分隔多段 | `1-5, 8, 12-` |

输入表达式后点击 **"应用"** 或按 **Enter** 即可，仅匹配的章节会被勾选。

### 提取标签合集

1. 进入百合会任意标签聚合页（例如 `misc.php?mod=tag&id=xxx`）。
2. 页面标题处会出现 **"提取本标签全部帖子"** 按钮，点击后同样弹出选择弹窗，脚本将按 TID 自动去重并按序打包。

## 注意事项

- **图片下载** — 脚本会尝试抓取跨域图片。失效链接会在控制台输出警告并自动跳过，使用占位图替代，不影响打包流程。
- **权限限制** — 抓取需要阅读权限的版块或附件时，脚本使用当前浏览器登录态。请确保已登录且具有相应权限。
- **TXT 转换** — 加粗转换为 `[b]文字[/b]`，注音转换为 `[ruby=注音]文字[/ruby]`，图片占位符为 `[图片: alt信息]`。
- **EPUB CSS** — 如需自定义 EPUB 内部样式，可修改代码中 `CUSTOM_CSS` 常量

## 技术栈

- **打包引擎** — [fflate](https://github.com/101arrowz/fflate) (ZIP/DEFLATE)
- **运行环境** — Tampermonkey / Greasemonkey
- **UI 设计** — Soft UI (Neumorphism)，CSS 自定义属性系统
- **API** — `GM_xmlhttpRequest`、`GM_setValue/getValue`
