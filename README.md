# X Multilingual Keyboard Shortcuts & Follow

**Languages**: [English](README.md) | [한국어](README.ko.md) | [中文](README.zh.md) | [日本語](README.ja.md)

[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-v1.0.9-1d9bf0?logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/helbbdgikebbpbjjejmkkappejlhaglf)

Use all **X.com (Twitter)** keyboard shortcuts plus **Follow / Unfollow (`F`)**, **Non-Follower Filter (`Shift + F`)**, **Confirmation Dialog (`Y` / `N`)**, and **Follower / Following Tab Navigation (`G` `V` / `G` `W` / `G` `O`)** seamlessly in **any input language (IME)** — including Korean, Japanese, Chinese, Russian, Arabic, and full-width layouts — without switching your keyboard back to English.

---

## Demo Video

[![Watch Demo Video (MP4)](store-assets/demo-video.gif)](store-assets/demo-video.mp4)

> **[Download / Watch Full Resolution MP4 (`store-assets/demo-video.mp4`)](store-assets/demo-video.mp4)** — Includes real-time on-screen key event HUD (`G + V`, `J / K`, `F`, `Y / N`, `G + W`, `G + O`).

---

## Key Features

1. **Follow / Unfollow / Follow Back Shortcut (Default: `F`)**
   - **Profile & Post Status Pages**: Press `F` on any user profile page or post status page to instantly click the user's **Follow**, **Following**, or **Follow Back** button.
   - **Follower & Following Lists (`/verified_followers`, `/followers`, `/following`)**: Navigate accounts with `J` / `K` (supports continuous scroll when holding `J` or `K`) and press `F` to **Follow**, **Follow Back**, or **Unfollow** the highlighted user.
   - **Hover Cards**: When a profile hover card is open, pressing `F` targets the hover card's Follow/Unfollow button.
2. **Confirmation Dialog Shortcuts (`Y` / `N`)**
   - When an Unfollow, Mute, or Block confirmation modal appears, press `Y` to confirm or `N` to cancel without reaching for your mouse.
3. **Follower & Following Tab Navigation (`G` `V` / `G` `W` / `G` `O`) & Non-Follower Filter (`Shift + F`)**
   - Press `G` `V` (**Verified Followers**), `G` `W` (**Followers**), or `G` `O` (**Following**) from any page on X.com to jump directly to that tab.
   - On the **Following** (`/following`) page, click the sticky filter toggle bar below the tabs or press `Shift + F` (`⇧F`) in any IME to show only accounts that do not follow you back. While active, `J` / `K` automatically skips mutual followers and keeps the selected account aligned directly below the sticky header.
4. **Full Multilingual Support for All Built-in X.com (`?`) Shortcuts**
   - Every native X.com shortcut works directly while typing in Korean (한글), Japanese (かな), Chinese (中文), Russian, Arabic, or full-width IME modes (`?`, `J`, `K`, `Space`, `.`, `N`, `/`, `L`, `R`, `T`, `S`, `B`, `U`, `X`, `Enter`, `O`, `I`, `M`, `E` for Quote, `G + H/E/N/R/P/F/T/L/I/M/G/C/S/B/U/D`, and `A + D/Space/M`).
5. **On-Screen Shortcut Hints (Show / Hide Toggle)**
   - Displays subtle inline shortcut labels matching each button or menu item's native text color. On follower/following lists, the `F` badge appears exclusively on the user selected via `J` / `K`. Toggle hints on or off anytime from the extension popup.
6. **Customizable Follow Key & Smart Input Detection**
   - Change the Follow shortcut to any key or modifier combination in the popup. Shortcuts are automatically ignored when typing in text fields, replies, search bars, or direct messages.

---

## Screenshots

| Home & Multilingual Shortcut Hints | Verified Followers (`G + V`, `J / K`, `F`) |
| --- | --- |
| ![Home Shortcuts](store-assets/screenshot-0-home-shortcuts.png) | ![Verified Followers](store-assets/screenshot-1-verified-followers-jk.png) |

| Unfollow Confirmation Modal (`Y / N`) | Followers (`G + W`) & Following (`G + O`) |
| --- | --- |
| ![Unfollow Confirm](store-assets/screenshot-2-unfollow-confirm-yn.png) | ![Followers Tab](store-assets/screenshot-3-followers-tab-gw.png) |

---

## Shortcut Reference

### Extension Shortcuts

| Shortcut | Action |
| --- | --- |
| `F` *(customizable)* | Follow / Unfollow / Follow Back on Profile, Post Status, Hover Card, or `J`/`K`-selected UserCell |
| `⇧F` (`Shift + F`) | Toggle filtering only users who do not follow you back on **Following** (`/following`) |
| `Y` / `N` | Confirm (`Y`) or Cancel (`N`) in Unfollow, Mute, and Block confirmation modals |
| `G` then `V` | Open **Verified Followers** (`/verified_followers`) |
| `G` then `W` | Open **Followers** (`/followers`) |
| `G` then `O` | Open **Following** (`/following`) |
| `E` | Open Repost menu and immediately select **Quote** |

### Built-in X.com Shortcuts (Multilingual IME Auto-Converted)

| Shortcut | Action |
| --- | --- |
| `?` / `.` | Open shortcut help (`?`) / Load new posts (`.`) |
| `J` / `K` *(hold supported)* | Next / Previous post or user item |
| `Space` / `Enter` | Page down (`Space`) / Open selected post (`Enter`) |
| `N` / `⌘+Enter` | New post (`N`) / Send post (`⌘+Enter`) |
| `/` | Focus search bar |
| `L` / `R` / `T` | Like (`L`) / Reply (`R`) / Repost (`T`) |
| `S` / `B` | Share (`S`) / Bookmark (`B`) |
| `U` / `X` | Mute account (`U`) / Block account (`X`) |
| `O` / `I` / `M` | Expand photo (`O`) / Messages dock (`I`) / Mute video (`M`) |
| `G` + `H/E/N/R/P/F/T/L/I/M/G/C/S/B/U/D` | Navigate to Home, Explore, Notifications, Mentions, Profile, Drafts, Scheduled, Likes, Lists, Messages, Grok, Creator Studio, Settings, Bookmarks, Profile prompt, Display |

---

## Installation

### Chrome / Edge / Brave / Arc
1. **Chrome Web Store**: Install directly from the [Chrome Web Store](https://chromewebstore.google.com/detail/helbbdgikebbpbjjejmkkappejlhaglf).
2. **Manual (Unpacked)**:
   - Download `x-multilingual-keyboard-shortcuts-and-follow-chrome.zip` from [GitHub Releases](https://github.com/hansonkim/x-multilingual-keyboard-shortcuts-and-follow/releases/latest) (or clone this repository).
   - Open `chrome://extensions/` in Chrome and enable **Developer mode**.
   - Click **Load unpacked** and select the extracted folder.

### Safari (macOS / iOS) — Userscript
1. Install a Userscript manager for Safari such as [Userscripts](https://apps.apple.com/app/userscripts/id1463298887) (free, open-source) or [Stay](https://apps.apple.com/app/stay-for-safari/id1591620171) / Tampermonkey.
2. Download **[`x-multilingual-keyboard-shortcuts-and-follow.user.js`](https://github.com/hansonkim/x-multilingual-keyboard-shortcuts-and-follow/releases/latest/download/x-multilingual-keyboard-shortcuts-and-follow.user.js)** (or `x-multilingual-keyboard-shortcuts-and-follow-safari-userscript.zip`) from [GitHub Releases](https://github.com/hansonkim/x-multilingual-keyboard-shortcuts-and-follow/releases/latest) and add it to your Userscripts directory.
3. Open `https://x.com` in Safari — all multilingual shortcuts (`?`), `F` Follow/Unfollow, `Y`/`N` confirmation modals, and `G V/W/O` tab navigation work immediately. You can also toggle UI hints or customize the Follow key from the Userscript manager menu (`GM_registerMenuCommand`).

---

## Privacy

This extension only runs on `https://x.com/*` and `https://twitter.com/*` and uses `chrome.storage` solely to store your local shortcut preferences. No personal data, browsing history, or account information is collected or transmitted.
