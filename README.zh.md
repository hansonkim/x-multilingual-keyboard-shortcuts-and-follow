# X Multilingual Keyboard Shortcuts & Follow (中文)

**语言 (Languages)**: [English](README.md) | [한국어](README.ko.md) | [中文](README.zh.md) | [日本語](README.ja.md)

[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-v1.0.9-1d9bf0?logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/helbbdgikebbpbjjejmkkappejlhaglf)

无需切换到英文输入法，即可在**中文、韩语、日语、俄语、阿拉伯语及全角输入法（IME）**下直接使用 **X.com (Twitter) 的所有原生快捷键（`?`）**，并新增**关注/取消关注（`F`）**、**未回关用户筛选（`Shift+F`）**、**确认弹窗（`Y`/`N`）**以及**关注者/正在关注标签页跳转（`G` `V` / `G` `W` / `G` `O`）**快捷键。

---

## 演示视频 (Demo Video)

[![观看演示视频 (MP4)](store-assets/demo-video.gif)](store-assets/demo-video.mp4)

> **[查看 / 下载高清 MP4 视频 (`store-assets/demo-video.mp4`)](store-assets/demo-video.mp4)** — 视频右下角带有实时按键事件 HUD 显示（`G + V`、`J / K`、`F`、`Y / N`、`G + W`、`G + O`）。

---

## 核心功能

1. **关注 / 取消关注 / 回关快捷键（默认：`F`）**
   - **个人资料页与帖子详情页（status）**：在任意用户主页或帖子详情页按下 `F`，即可立即点击该用户的**关注**、**正在关注（取消关注）**或**回关**按钮。
   - **关注者与正在关注列表（`/verified_followers`、`/followers`、`/following`）**：使用 `J` / `K` 上下切换用户（支持长按连续滚动），按 `F` 即可对当前选中用户执行关注、回关或取消关注。
   - **资料悬浮卡片（Hover Card）**：当用户资料预览卡片打开时，按 `F` 会优先触发卡片内的关注/取消关注按钮。
2. **确认弹窗快捷键（`Y` / `N`）**
   - 当出现取消关注、静音或屏蔽确认弹窗时，无需鼠标，直接按 `Y` 确认或按 `N` 取消。
3. **关注者 / 正在关注标签页快速跳转（`G` `V` / `G` `W` / `G` `O`）与未回关用户筛选（`Shift + F`）**
   - 在 X.com 任意页面按下 `G` `V`（**认证关注者**）、`G` `W`（**关注者**）或 `G` `O`（**正在关注**），即可直接跳转到对应标签页。
   - 在**正在关注**（`/following`）页面点击标签栏下方的固定筛选按钮或按下 `Shift + F`（`⇧F`），即可仅显示未回关你的账号；开启后按 `J` / `K` 会自动跳过互相关注的账号，并将选中卡片对齐在固定标签栏正下方。
4. **全多语言输入法支持所有 X.com（`?`）原生快捷键**
   - 在中文、韩文、日文、俄文、阿拉伯文或全角输入模式下，直接按下物理按键即可触发所有 X.com 原生快捷键（`?`、`J`、`K`、`Space`、`.`、`N`、`/`、`L`、`R`、`T`、`S`、`B`、`U`、`X`、`Enter`、`O`、`I`、`M`、引用 `E`、`G + H/E/N/R/P/F/T/L/I/M/G/C/S/B/U/D`、`A + D/Space/M`）。
5. **界面快捷键提示标签（可随时显示 / 隐藏）**
   - 在按钮与菜单旁显示与原生文字颜色一致的快捷键提示。在关注列表中，仅在 `J`/`K` 选中的用户行显示 `F` 提示。可在扩展弹出窗口中随时开启或关闭。
6. **自定义关注快捷键与智能输入检测**
   - 支持在扩展弹窗中将关注快捷键修改为任意单键或组合键。在发帖框、回复框、搜索栏或私信输入框打字时会自动忽略快捷键。
7. **浮动“已发帖”按钮精简（默认：开启）**
   - 将 `/home` 和 `/notifications*` 页面中遮挡正文的蓝色浮动新帖按钮缩小为右上角半透明迷你图标（`↑ .`，鼠标悬停时展开文字），可在扩展弹窗中随时开启或关闭。

---

## 界面截图

| 首页与多语言快捷键提示 | 认证关注者列表 (`G + V`, `J / K`, `F`) |
| --- | --- |
| ![首页快捷键提示](store-assets/screenshot-0-home-shortcuts.png) | ![认证关注者列表](store-assets/screenshot-1-verified-followers-jk.png) |

| 取消关注确认弹窗 (`Y / N`) | 关注者 (`G + W`) 与正在关注 (`G + O`) 导航 |
| --- | --- |
| ![取消关注确认弹窗](store-assets/screenshot-2-unfollow-confirm-yn.png) | ![关注者标签页](store-assets/screenshot-3-followers-tab-gw.png) |

---

## 快捷键一览

### 扩展新增快捷键

| 快捷键 | 功能说明 |
| --- | --- |
| `F` *(可自定义)* | 在个人主页、帖子详情页、悬浮卡片或 `J`/`K` 选中的列表项上关注 / 取消关注 / 回关 |
| `⇧F` (`Shift + F`) | 在**正在关注**（`/following`）页面切换仅显示未回关你的用户 |
| `Y` / `N` | 在取消关注、静音、屏蔽确认弹窗中确认（`Y`）或取消（`N`） |
| `G` 然后 `V` | 跳转到**认证关注者**（`/verified_followers`） |
| `G` 然后 `W` | 跳转到**关注者**（`/followers`） |
| `G` 然后 `O` | 跳转到**正在关注**（`/following`） |
| `E` | 打开转发菜单并直接选择**引用（Quote）** |

### X.com 原生快捷键（支持中·韩·日多语言输入法自动转换）

| 快捷键 | 功能说明 |
| --- | --- |
| `?` / `.` | 快捷键帮助（`?`） / 加载新帖子（`.`） |
| `J` / `K` *(支持长按)* | 下一条 / 上一条帖子或用户 |
| `Space` / `Enter` | 向下翻页（`Space`） / 打开选中帖子详情（`Enter`） |
| `N` / `⌘+Enter` | 发布新帖子（`N`） / 发送帖子（`⌘+Enter`） |
| `/` | 聚焦搜索框 |
| `L` / `R` / `T` | 喜欢（`L`） / 回复（`R`） / 转发（`T`） |
| `S` / `B` | 分享（`S`） / 书签（`B`） |
| `U` / `X` | 静音账号（`U`） / 屏蔽账号（`X`） |
| `O` / `I` / `M` | 展开图片（`O`） / 私信栏（`I`） / 视频静音（`M`） |
| `G` + `H/E/N/R/P/F/T/L/I/M/G/C/S/B/U/D` | 跳转到主页、探索、通知、提及、个人资料、草稿、定时、喜欢、列表、私信、Grok、创作者工作室、设置、书签、切换账号、显示设置 |

---

## 安装方式

### Chrome / Edge / Brave / Arc
1. **Chrome 应用商店安装**：直接前往 [Chrome Web Store](https://chromewebstore.google.com/detail/helbbdgikebbpbjjejmkkappejlhaglf) 安装。
2. **手动加载（开发者模式）**：
   - 从 [GitHub Releases](https://github.com/hansonkim/x-multilingual-keyboard-shortcuts-and-follow/releases/latest) 下载 `x-multilingual-keyboard-shortcuts-and-follow-chrome.zip`（或克隆本仓库）。
   - 在 Chrome 浏览器打开 `chrome://extensions/` 并开启右上角的**开发者模式**。
   - 点击**加载已解压的扩展程序**，选择解压后的目录。

### Safari (macOS / iOS) — Userscript 脚本方式
1. 在 Safari 中安装免费开源的脚本管理器扩展，例如 [Userscripts](https://apps.apple.com/app/userscripts/id1463298887) 或 [Stay](https://apps.apple.com/app/stay-for-safari/id1591620171) / Tampermonkey。
2. 从 [GitHub Releases](https://github.com/hansonkim/x-multilingual-keyboard-shortcuts-and-follow/releases/latest) 下载 **[`x-multilingual-keyboard-shortcuts-and-follow.user.js`](https://github.com/hansonkim/x-multilingual-keyboard-shortcuts-and-follow/releases/latest/download/x-multilingual-keyboard-shortcuts-and-follow.user.js)**（或 `x-multilingual-keyboard-shortcuts-and-follow-safari-userscript.zip`）并添加到 Userscripts 脚本目录。
3. 在 Safari 打开 `https://x.com` 即可直接使用所有多语言快捷键（`?`）、`F` 关注/取消关注、`Y`/`N` 确认弹窗以及 `G V/W/O` 标签页跳转，并可通过脚本菜单切换提示标签或修改关注键。

---

## 隐私说明

本扩展仅在 `https://x.com/*` 与 `https://twitter.com/*` 上运行，仅使用 `chrome.storage` 在本地保存您的快捷键设置，不会收集或传输任何个人数据、浏览记录或账号信息。
