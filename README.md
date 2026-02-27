# 百合会下载器 (Yamibo Downloader)

一个用于百合会论坛（bbs.yamibo.com）的 Tampermonkey 脚本，支持将论坛内的连载贴或特定标签下的帖子提取并打包为规范的 EPUB 或 TXT 电子书。

## 安装说明

1. 首先，请确保您的浏览器已安装 [Tampermonkey](https://www.tampermonkey.net/) 扩展程序。
2. 点击此处安装脚本：

| Greasy Fork | GitHub 源 | jsDelivr 源 |
| --- | --- | --- |
| [安装](https://greasyfork.org/zh-CN/scripts/567671-%E7%99%BE%E5%90%88%E4%BC%9A%E4%B8%8B%E8%BD%BD%E5%99%A8) | [安装](https://raw.githubusercontent.com/RRRRUDDDD/yamibo_downloader/main/yamibo_downloader.user.js) | [安装](https://cdn.jsdelivr.net/gh/RRRRUDDDD/yamibo_downloader@main/yamibo_downloader.user.js) |

## 使用说明

### 提取帖子内容

1. 进入百合会任意帖子页面（脚本优先识别一楼的超链接目录；若无目录，会自动准备抓取楼主的全部楼层）。
2. 页面标题旁会出现 **“📚 提取本帖内容”** 按钮，点击后会弹出**筛选页面**。
3. 在弹窗中选择您的**下载格式**（仅 EPUB / 仅 TXT / EPUB + TXT）并勾选需要下载的**章节**。
4. 若当前界面显示的是超链接目录，并且没有您需要的，您可以点击左下角的 **“获取楼主全部楼层”**，强制切换为按楼主楼层提取。
5. 点击“确认提取”，等待脚本抓取与打包完成即可，默认保存于您浏览器的下载目录中。

### 提取标签合集

1. 进入百合会任意标签聚合页（例如 `misc.php?mod=tag&id=xxx`）。
2. 页面标题处会出现 **“📚 提取本标签全部帖子”** 按钮，点击后同样会弹出筛选页面，确认后脚本将根据帖子 TID 自动去重并按序打包该标签下的所有帖子。

## 注意事项

* **图片下载超时**：脚本会尝试抓取跨域图片。如果遇到图床链接失效或网络限制，控制台会输出警告，脚本会自动跳过死链图并使用透明占位图替代，以保证打包过程不被中断。
* **权限限制**：抓取需要阅读权限的版块或附件时，脚本会使用您当前浏览器的登录态。请确保您在操作时处于已登录状态且具有相应的阅读权限。
* **TXT 转换**：将加粗与注音分别转换为 `[b]文字[/b]` 与 `[ruby=注音]文字[/ruby]`。提取图片占位符为 `[图片: alt信息]`。
* **CSS 编辑**：如有css修改需求可以于代码[第27行处](https://github.com/RRRRUDDDD/Yamibo_Downloader/blob/0afc793a2a5b941905cbf4aa813c6640eb52a21e/yamibo_downloader.user.js#L27)修改
