# Chrome Web Store Listing — X Profile Follow Shortcut

> Last Updated: 2026-10-14

## Store Listing

**Extension Name** [REQUIRED]
X Profile Follow Shortcut

**Short Description** [REQUIRED]
Press a customizable keyboard shortcut (default: F) to instantly click the Follow button on X.com user profile pages.

**Detailed Description** [REQUIRED]
X Profile Follow Shortcut lets you follow or unfollow accounts on X.com user profile pages with a single keyboard shortcut instead of reaching for your mouse.

Key Features:
Instant profile follow shortcut: Press F (default) on any X.com user profile page to trigger the profile's Follow or Unfollow button.
Follower & Following list support: On /verified_followers, /followers, and /following pages, navigate users with J / K and press F to trigger Follow, Follow back (서로 팔로우하기), or Unfollow on the selected user.
Unfollow confirmation with Y / N: When the unfollow confirmation dialog appears, press Y to confirm or N to cancel without touching the mouse.
On-screen shortcut badges & HUD: Displays key badges (F, Y, N) directly on active Follow/Unfollow buttons and a compact on-screen shortcut bar alongside official X shortcuts (J/K, L, T, R, ?).
Works in Korean (ㄹ) and any language layout: Press the same physical key (such as 'ㄹ' on a Korean keyboard, or 'ㅛ'/'ㅜ' for Y/N) without switching your input language (한/영).
Custom single keys or key combinations: Change the shortcut to any key or modifier combination (Ctrl, Alt, Shift, Meta/Cmd) from the extension popup.
Smart input detection: Automatically ignores key presses while you are typing a post, reply, direct message, or search query.
Cross-device settings: Your custom shortcut preference stays saved in your browser profile.

How to Use:
1. Open any user profile page on x.com and press F (or your configured shortcut) to click the profile's Follow/Unfollow button.
2. On /verified_followers, /followers, or /following pages, press J or K to select a user row, then press F to Follow, Follow back, or Unfollow.
3. In the Unfollow confirmation dialog, press Y to confirm or N to cancel.
4. Click the extension icon in the toolbar at any time to view all X & extension shortcuts, record a new key combination, or reset to the default F key.

Privacy & Permissions:
This extension only runs on x.com and twitter.com and uses storage solely to save your chosen keyboard shortcut. No personal data, browsing history, or account information is collected or transmitted.

**Category** [REQUIRED]
Social & Communication

**Single Purpose** [REQUIRED]
Triggers the Follow/Unfollow button on X.com user profile pages and J/K-selected follower/following lists using a customizable keyboard shortcut.

**Primary Language** [REQUIRED]
Korean

## Graphics & Assets

| Asset | Dimensions | Status | Filename |
|-------|-----------|--------|----------|
| Store Icon [REQUIRED] | 128×128 PNG | ✅ Ready | `icons/icon-128.png` |
| Screenshot 1 [REQUIRED] | 1280×800 | ✅ Ready | `store-assets/screenshot-1280x800.png` |
| Small Promo Tile [RECOMMENDED] | 440×280 | ✅ Ready | `store-assets/promo-440x280.png` |

## Permissions Justification

| Permission | Type | Justification |
|------------|------|---------------|
| `storage` | permissions | Saves the user's customized keyboard shortcut preference so it persists across browser sessions. |
| `https://x.com/*`, `https://twitter.com/*` | content_scripts | Listens for the user's configured keyboard shortcut on X profile and follower/following pages and clicks the corresponding Follow/Unfollow button when pressed. |

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
| 1.0.3 | 2026-10-14 | Display on-screen key badges (F, Y, N) on buttons, floating shortcut HUD, and X shortcut reference in popup. | Submitted |
| 1.0.2 | 2026-10-14 | Support J/K-selected UserCell follow/unfollow/follow-back on verified_followers, followers, following pages and Y/N unfollow confirmation. | Superseded |
| 1.0.1 | 2026-10-14 | Support physical key matching across Korean (ㄹ) and non-Latin IME layouts. | Superseded |
| 1.0.0 | 2026-10-14 | Initial release with default F shortcut and custom key/combination recorder. | Superseded |
