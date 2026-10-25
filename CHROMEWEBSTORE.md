# Chrome Web Store Listing — X Multilingual Keyboard Shortcuts & Follow

> Last Updated: 2026-10-25

## Store Listing

**Extension Name** [REQUIRED]
X Multilingual Keyboard Shortcuts & Follow

**Short Description** [REQUIRED]
Use all X.com keyboard shortcuts plus Follow/Unfollow (F), Non-Follower Filter (Shift+F), Modal (Y/N), and Tab nav (g v/w/o) in any IME.

**Detailed Description** [REQUIRED]
X Multilingual Keyboard Shortcuts & Follow adds fast keyboard shortcuts for following/unfollowing accounts on X.com and makes every X.com keyboard shortcut work seamlessly across Korean, Japanese, Chinese, Russian, Arabic, and other input languages (IME) without switching your keyboard layout to English.

Key Features:
1. Follow / Unfollow / Follow Back Shortcut (Default: F):
   - Profile & Status Pages: Press F on any user profile page or post status page to instantly click the user's Follow, Following, or Follow Back button.
   - Follower & Following Lists (/verified_followers, /followers, /following): Navigate users with J / K (including continuous scroll when holding J or K) and press F to Follow, Follow Back, or Unfollow the selected user.
   - Hover Cards: When a user profile hover card is open, pressing F targets the hover card's Follow/Unfollow button.
2. Quick Confirmation Dialog Shortcuts (Y / N):
   - When an Unfollow, Mute, or Block confirmation dialog appears, press Y to confirm or N to cancel without using your mouse.
3. Follower & Following List Navigation (g v / g w / g o) & Non-Follower Filter (Shift+F):
   - Press g v (Verified Followers), g w (Followers), or g o (Following) from any page on X.com to jump directly to the corresponding tab.
   - On the Following (/following) page, click the filter pill or press Shift+F to show only accounts that do not follow you back, while J / K skips hidden mutual followers automatically.
4. Full Multilingual Support for All X.com (?) Shortcuts:
   - Use every built-in X.com shortcut (?, j, k, Space, ., n, /, l, r, t, s, b, u, x, Enter, o, i, m, e for Quote, g + h/e/n/r/p/f/t/l/i/m/g/c/s/b/u/d, and a + d/Space/m) directly while typing in Korean, Japanese, Chinese, Russian, Arabic, or full-width IME modes.
5. On-Screen Shortcut Hints (Show / Hide Option):
   - Displays subtle inline shortcut labels matching each button or menu item's native text color. On follower/following lists, the F hint appears exclusively on the user selected via J / K. You can toggle these hints on or off anytime from the extension popup.
6. Customizable Follow Shortcut & Smart Input Detection:
   - Customize the Follow shortcut to any key or modifier combination in the popup. Key presses are automatically ignored while typing inside text fields, replies, search bars, or direct messages.

Privacy & Permissions:
This extension only runs on x.com and twitter.com and uses Chrome storage solely to save your shortcut preferences. No personal data, browsing history, or account information is collected or transmitted.

Source Code & Documentation (GitHub):
https://github.com/hansonkim/x-multilingual-keyboard-shortcuts-and-follow

**Category** [REQUIRED]
Social & Communication

**Single Purpose** [REQUIRED]
Provides keyboard shortcuts for Follow/Unfollow actions, confirmation dialogs, and multilingual X.com navigation on X.com.

**Primary Language** [REQUIRED]
English

**Homepage URL**
https://github.com/hansonkim/x-multilingual-keyboard-shortcuts-and-follow

**Support URL**
https://github.com/hansonkim/x-multilingual-keyboard-shortcuts-and-follow/issues

## Graphics & Assets

| Asset | Dimensions | Status | Filename |
|-------|-----------|--------|----------|
| Store Icon [REQUIRED] | 128×128 PNG | ✅ Ready | `icons/icon-128.png` |
| Screenshot 1 (Home / Shortcuts HUD) [REQUIRED] | 1280×800 | ✅ Ready | `store-assets/screenshot-0-home-shortcuts.png` |
| Screenshot 2 (Verified Followers / J·K) | 1280×800 | ✅ Ready | `store-assets/screenshot-1-verified-followers-jk.png` |
| Screenshot 3 (Unfollow Confirm / Y·N) | 1280×800 | ✅ Ready | `store-assets/screenshot-2-unfollow-confirm-yn.png` |
| Screenshot 4 (Followers Tab / G W) | 1280×800 | ✅ Ready | `store-assets/screenshot-3-followers-tab-gw.png` |
| Screenshot 5 (Following Tab / G O) | 1280×800 | ✅ Ready | `store-assets/screenshot-4-following-tab-go.png` |
| Screenshot (Default Alias) | 1280×800 | ✅ Ready | `store-assets/screenshot-1280x800.png` |
| Demo Video (Key Event HUD + Privacy Masked) | 1280×800 MP4 | ✅ Ready | `store-assets/demo-video.mp4` |
| Small Promo Tile [RECOMMENDED] | 440×280 | ✅ Ready | `store-assets/promo-440x280.png` |

## Permissions Justification

| Permission | Type | Justification |
|------------|------|---------------|
| `storage` | permissions | Saves the user's customized keyboard shortcut preference and UI hint visibility setting so they persist across browser sessions. |
| `https://x.com/*`, `https://twitter.com/*` | content_scripts | Listens for keyboard shortcuts on X.com pages, displays optional shortcut hints on buttons, and triggers Follow/Unfollow or navigation actions when pressed. |

## Privacy & Data Use

### Data Collection

**Does the extension collect user data?** No

### Data Use Certification
- [x] Data is NOT sold to third parties
- [x] Data is NOT used for purposes unrelated to the extension's core functionality
- [x] Data is NOT used for creditworthiness or lending purposes

## Distribution

**Publisher**: Hanssony (`0ad8e2f8-f351-4bef-ae4c-32635ae702cb`)
**Extension ID**: `helbbdgikebbpbjjejmkkappejlhaglf`
**Visibility**: Public
**Regions**: All regions

## Version History

| Version | Date | Changes | Status |
|---------|------|---------|--------|
| 1.0.9 | 2026-10-25 | Add Non-Follower Filter (`Shift+F` / sticky toggle bar) on `/following` to show only accounts that do not follow back, skip hidden mutuals on `J`/`K`, and align selected rows below the sticky header. | Submitted |
| 1.0.8 | 2026-10-16 | Add 4-language UI support (Korean, English, Chinese, Japanese) with auto-detection and language selector in the extension popup panel, plus Safari Userscript support. | Published |
| 1.0.7 | 2026-10-15 | Rename extension to "X Multilingual Keyboard Shortcuts & Follow" to reflect full multilingual shortcut and follow capabilities. | Published |
| 1.0.6 | 2026-10-15 | Support all X.com (?) shortcuts across multilingual IMEs, continuous J/K hold repeat, status page follow, selected-row-only F hint on follow lists, g v/w/o follow tab shortcuts from any page, and show/hide UI hint toggle. | Superseded |
| 1.0.3 | 2026-10-14 | Display on-screen key badges (F, Y, N) on buttons, floating shortcut HUD, and X shortcut reference in popup. | Superseded |
| 1.0.2 | 2026-10-14 | Support J/K-selected UserCell follow/unfollow/follow-back on verified_followers, followers, following pages and Y/N unfollow confirmation. | Superseded |
| 1.0.1 | 2026-10-14 | Support physical key matching across Korean (ㄹ) and non-Latin IME layouts. | Superseded |
| 1.0.0 | 2026-10-14 | Initial release with default F shortcut and custom key/combination recorder. | Superseded |
