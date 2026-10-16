const DEFAULT_SHORTCUT = {
  key: 'f',
  code: 'KeyF',
  ctrl: false,
  alt: false,
  shift: false,
  meta: false
};

const LAYOUT_CHAR_TO_CODE = {
  // Korean 2-beolsik (두벌식 26키)
  'ㅂ': 'KeyQ', 'ㅃ': 'KeyQ', 'ㅈ': 'KeyW', 'ㅉ': 'KeyW',
  'ㄷ': 'KeyE', 'ㄸ': 'KeyE', 'ㄱ': 'KeyR', 'ㄲ': 'KeyR',
  'ㅅ': 'KeyT', 'ㅆ': 'KeyT', 'ㅛ': 'KeyY', 'ㅕ': 'KeyU',
  'ㅑ': 'KeyI', 'ㅐ': 'KeyO', 'ㅒ': 'KeyO', 'ㅔ': 'KeyP', 'ㅖ': 'KeyP',
  'ㅁ': 'KeyA', 'ㄴ': 'KeyS', 'ㅇ': 'KeyD', 'ㄹ': 'KeyF',
  'ㅎ': 'KeyG', 'ㅗ': 'KeyH', 'ㅓ': 'KeyJ', 'ㅏ': 'KeyK',
  'ㅣ': 'KeyL', 'ㅋ': 'KeyZ', 'ㅌ': 'KeyX', 'ㅊ': 'KeyC',
  'ㅍ': 'KeyV', 'ㅠ': 'KeyB', 'ㅜ': 'KeyN', 'ㅡ': 'KeyM',
  // Japanese JIS Kana (かな入力 26키 + 구두점)
  'た': 'KeyQ', 'て': 'KeyW', 'い': 'KeyE', 'ぃ': 'KeyE', 'す': 'KeyR',
  'か': 'KeyT', 'ん': 'KeyY', 'な': 'KeyU', 'に': 'KeyI', 'ら': 'KeyO', 'せ': 'KeyP',
  'ち': 'KeyA', 'と': 'KeyS', 'し': 'KeyD', 'は': 'KeyF', 'き': 'KeyG',
  'く': 'KeyH', 'ま': 'KeyJ', 'の': 'KeyK', 'り': 'KeyL',
  'つ': 'KeyZ', 'っ': 'KeyZ', 'さ': 'KeyX', 'そ': 'KeyC', 'ひ': 'KeyV',
  'こ': 'KeyB', 'み': 'KeyN', 'も': 'KeyM',
  'る': 'Period', 'め': 'Slash',
  // Chinese Zhuyin / Bopomofo (注音輸入法 26키 + 구두점)
  'ㄆ': 'KeyQ', 'ㄊ': 'KeyW', 'ㄍ': 'KeyE', 'ㄐ': 'KeyR', 'ㄔ': 'KeyT',
  'ㄗ': 'KeyY', 'ㄧ': 'KeyU', 'ㄛ': 'KeyI', 'ㄟ': 'KeyO', 'ㄣ': 'KeyP',
  'ㄇ': 'KeyA', 'ㄋ': 'KeyS', 'ㄎ': 'KeyD', 'ㄑ': 'KeyF', 'ㄕ': 'KeyG',
  'ㄘ': 'KeyH', 'ㄨ': 'KeyJ', 'ㄜ': 'KeyK', 'ㄠ': 'KeyL',
  'ㄈ': 'KeyZ', 'ㄌ': 'KeyX', 'ㄏ': 'KeyC', 'ㄒ': 'KeyV', 'ㄖ': 'KeyB',
  'ㄙ': 'KeyN', 'ㄩ': 'KeyM',
  'ㄡ': 'Period', 'ㄥ': 'Slash',
  // Russian (ЙЦУКЕН 26키 + 구두점)
  'й': 'KeyQ', 'ц': 'KeyW', 'у': 'KeyE', 'к': 'KeyR', 'е': 'KeyT',
  'н': 'KeyY', 'г': 'KeyU', 'ш': 'KeyI', 'щ': 'KeyO', 'з': 'KeyP',
  'ф': 'KeyA', 'ы': 'KeyS', 'в': 'KeyD', 'а': 'KeyF', 'п': 'KeyG',
  'р': 'KeyH', 'о': 'KeyJ', 'л': 'KeyK', 'д': 'KeyL', 'я': 'KeyZ',
  'ч': 'KeyX', 'с': 'KeyC', 'м': 'KeyV', 'и': 'KeyB', 'т': 'KeyN', 'ь': 'KeyM',
  'ю': 'Period',
  // Arabic (26키 + 구두점)
  'ض': 'KeyQ', 'ص': 'KeyW', 'ث': 'KeyE', 'ق': 'KeyR', 'ف': 'KeyT',
  'غ': 'KeyY', 'ع': 'KeyU', 'ه': 'KeyI', 'خ': 'KeyO', 'ح': 'KeyP',
  'ش': 'KeyA', 'س': 'KeyS', 'ي': 'KeyD', 'ب': 'KeyF', 'ل': 'KeyG',
  'ا': 'KeyH', 'ت': 'KeyJ', 'ن': 'KeyK', 'م': 'KeyL', 'ئ': 'KeyZ',
  'ء': 'KeyX', 'ؤ': 'KeyC', 'ر': 'KeyV', 'لا': 'KeyB', 'ى': 'KeyN', 'ة': 'KeyM',
  'ز': 'Period', 'ظ': 'Slash', '؟': 'Slash',
  // Hebrew / Greek / Thai / macOS Option common mappings
  'כ': 'KeyF', 'ט': 'KeyY', 'מ': 'KeyN', 'ח': 'KeyJ', 'ל': 'KeyK',
  'φ': 'KeyF', 'υ': 'KeyY', 'ν': 'KeyN', 'ξ': 'KeyJ', 'κ': 'KeyK',
  'ด': 'KeyF', 'ั': 'KeyY', 'ื': 'KeyN', '่': 'KeyJ', 'า': 'KeyK',
  'ƒ': 'KeyF',
  // Punctuation & CJK Full-width / Half-width equivalents for '.', '/', '?', 'Space'
  '.': 'Period', '。': 'Period', '．': 'Period', '｡': 'Period',
  '/': 'Slash', '?': 'Slash', '／': 'Slash', '？': 'Slash', '・': 'Slash', '･': 'Slash',
  ' ': 'Space', '\u3000': 'Space'
};

const MODIFIER_CODES = new Set([
  'ControlLeft', 'ControlRight',
  'ShiftLeft', 'ShiftRight',
  'AltLeft', 'AltRight',
  'MetaLeft', 'MetaRight'
]);

const IME_SWITCH_CODES = new Set([
  'HangulMode', 'HanjaMode', 'KanaMode', 'KanjiMode',
  'Lang1', 'Lang2', 'CapsLock', 'Alphanumeric',
  'Convert', 'NonConvert', 'Eisuu', ' RomanCharacters'
]);

// All X.com "?" Shortcuts:
// Single-key shortcuts (no prefix): ?, j, k, Space, ., n, /, l, r, t, s, b, u, x, Enter, o, i, m (+ e for quote helper)
const SINGLE_X_SHORTCUT_CODES = new Set([
  'KeyJ', 'KeyK', 'Space', 'Period', 'KeyN', 'Slash',
  'KeyL', 'KeyR', 'KeyT', 'KeyS', 'KeyB', 'KeyU',
  'KeyX', 'Enter', 'KeyO', 'KeyI', 'KeyM', 'KeyE'
]);

// "g + ..." navigation shortcuts in "?" modal:
// g h (Home), g e (Explore), g n (Notifications), g r (Mentions), g p (Profile),
// g f (Drafts), g t (Scheduled), g l (Likes), g i (Lists), g m (Chat/Messages),
// g g (Grok), g c (Creator Studio), g s (Settings), g b (Bookmarks), g u (User), g d (Display)
const G_PREFIX_SECOND_CODES = new Set([
  'KeyH', 'KeyE', 'KeyN', 'KeyR', 'KeyP', 'KeyF', 'KeyT', 'KeyL',
  'KeyI', 'KeyM', 'KeyG', 'KeyC', 'KeyS', 'KeyB', 'KeyU', 'KeyD'
]);

// "a + ..." audio dock shortcuts in "?" modal:
// a d (Go to audio dock), a Space (Play/pause audio dock), a m (Mute/unmute audio dock)
const A_PREFIX_SECOND_CODES = new Set([
  'KeyD', 'Space', 'KeyM'
]);

const FOLLOW_LIST_PATH_RE = /^\/[^/]+\/(verified_followers|followers|following|followers_you_follow)\/?$/i;
const STATUS_PATH_RE = /^\/([^/]+)\/status\/\d+/i;
const PREFIX_TIMEOUT_MS = 1000;

function normalizeFullWidthChar(ch) {
  const cp = ch.codePointAt(0);
  // Full-width ASCII variants (！ to ～, U+FF01..U+FF5E -> U+0021..U+007E) used in Japanese/Chinese IMEs
  if (cp >= 0xff01 && cp <= 0xff5e) {
    return String.fromCharCode(cp - 0xfee0);
  }
  return ch;
}

function isQuestionMarkEvent(input) {
  if (!input) return false;
  const rawKey = typeof input.key === 'string' ? input.key : '';
  const normKey = rawKey.length === 1 ? normalizeFullWidthChar(rawKey) : rawKey;
  if (normKey === '?' || rawKey === '？' || rawKey === '؟') return true;
  if (input.shiftKey && (input.code === 'Slash' || LAYOUT_CHAR_TO_CODE[rawKey] === 'Slash' || LAYOUT_CHAR_TO_CODE[normKey] === 'Slash')) {
    return true;
  }
  return false;
}

function resolveKeyCode(input) {
  if (!input) return null;
  const { code, key, keyCode, which } = input;
  if (code && code !== 'Unidentified' && !MODIFIER_CODES.has(code) && !IME_SWITCH_CODES.has(code)) {
    return code;
  }
  if (key === 'Enter') return 'Enter';
  if (key === 'Escape') return 'Escape';
  if (key === 'Tab') return 'Tab';
  if (key === ' ') return 'Space';
  if (typeof key === 'string' && key.length >= 1) {
    if (LAYOUT_CHAR_TO_CODE[key]) return LAYOUT_CHAR_TO_CODE[key];
    if (key.length === 1) {
      const norm = normalizeFullWidthChar(key);
      const lower = norm.toLowerCase();
      if (lower >= 'a' && lower <= 'z') return 'Key' + lower.toUpperCase();
      if (lower >= '0' && lower <= '9') return 'Digit' + lower;
      if (LAYOUT_CHAR_TO_CODE[lower]) return LAYOUT_CHAR_TO_CODE[lower];
      if (LAYOUT_CHAR_TO_CODE[norm]) return LAYOUT_CHAR_TO_CODE[norm];
    }
  }
  const numCode = keyCode || which;
  if (numCode && numCode !== 229) {
    if (numCode >= 65 && numCode <= 90) return 'Key' + String.fromCharCode(numCode);
    if (numCode >= 48 && numCode <= 57) return 'Digit' + String.fromCharCode(numCode);
    if (numCode === 190) return 'Period';
    if (numCode === 191) return 'Slash';
    if (numCode === 32) return 'Space';
    if (numCode === 13) return 'Enter';
  }
  return null;
}

function codeToNativeSpec(code, shiftKey = false) {
  if (!code) return null;
  if (code.startsWith('Key') && code.length === 4) {
    const ch = shiftKey ? code.slice(3).toUpperCase() : code.slice(3).toLowerCase();
    const upperCode = code.charCodeAt(3);
    return {
      key: ch,
      code,
      keyCode: upperCode,
      charCode: ch.charCodeAt(0),
      shiftKey: Boolean(shiftKey),
      sendKeypress: true
    };
  }
  if (code === 'Period') {
    return {
      key: '.',
      code: 'Period',
      keyCode: 190,
      charCode: 46,
      shiftKey: false,
      sendKeypress: true
    };
  }
  if (code === 'Slash') {
    if (shiftKey) {
      return {
        key: '?',
        code: 'Slash',
        keyCode: 191,
        charCode: 63,
        shiftKey: true,
        sendKeypress: true
      };
    }
    return {
      key: '/',
      code: 'Slash',
      keyCode: 191,
      charCode: 47,
      shiftKey: false,
      sendKeypress: true
    };
  }
  if (code === 'Space') {
    return {
      key: ' ',
      code: 'Space',
      keyCode: 32,
      charCode: 32,
      shiftKey: Boolean(shiftKey),
      sendKeypress: true
    };
  }
  if (code === 'Enter') {
    return {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      charCode: 13,
      shiftKey: Boolean(shiftKey),
      sendKeypress: false
    };
  }
  return null;
}

function formatShortcutLabel(sc) {
  const parts = [];
  if (sc.ctrl) parts.push('Ctrl');
  if (sc.alt) parts.push('Alt');
  if (sc.shift) parts.push('Shift');
  if (sc.meta) parts.push('Meta');

  const resolved = resolveKeyCode(sc) || sc.code;
  let keyLabel = sc.key ? sc.key.toUpperCase() : 'F';
  if (resolved?.startsWith('Key')) keyLabel = resolved.slice(3);
  else if (resolved?.startsWith('Digit')) keyLabel = resolved.slice(5);
  else if (resolved === 'Space' || sc.key === ' ') keyLabel = 'Space';
  else if (resolved === 'Period') keyLabel = '.';
  else if (resolved === 'Slash') keyLabel = sc.shift ? '?' : '/';

  parts.push(keyLabel || 'F');
  return parts.join('+');
}

let shortcut = { ...DEFAULT_SHORTCUT };
let showUiHints = true;
let lastFocusedCellLink = null;
let lastPathname = '';
let pendingPrefix = { key: null, until: 0 };

function setShowUiHints(visible) {
  showUiHints = Boolean(visible);
  syncUiHints();
}

function getActivePrefix(now = Date.now()) {
  if (pendingPrefix.key && now < pendingPrefix.until) {
    return pendingPrefix.key;
  }
  pendingPrefix.key = null;
  pendingPrefix.until = 0;
  return null;
}

function setPendingPrefix(prefixKey, now = Date.now()) {
  pendingPrefix = { key: prefixKey, until: now + PREFIX_TIMEOUT_MS };
}

function clearPendingPrefix() {
  pendingPrefix = { key: null, until: 0 };
}

const LOCAL_STORAGE_SHORTCUT_KEY = 'x_follow_shortcut_config';
const LOCAL_STORAGE_HINTS_KEY = 'x_follow_shortcut_show_hints';

function loadFromLocalStorage() {
  try {
    if (typeof localStorage === 'undefined') return;
    const rawShortcut = localStorage.getItem(LOCAL_STORAGE_SHORTCUT_KEY);
    if (rawShortcut) {
      const parsed = JSON.parse(rawShortcut);
      if (parsed && typeof parsed === 'object') {
        shortcut = { ...DEFAULT_SHORTCUT, ...parsed };
      }
    }
    const rawHints = localStorage.getItem(LOCAL_STORAGE_HINTS_KEY);
    if (rawHints !== null) {
      showUiHints = rawHints !== 'false';
    }
  } catch (_) {}
}

function getUserscriptMenuStrings() {
  const navLang = (typeof navigator !== 'undefined' && navigator.language) || 'en';
  const lower = String(navLang).toLowerCase();
  if (lower.startsWith('ko')) {
    return {
      toggleHints: '단축키 힌트 표시/숨기기 (Toggle Shortcut Hints)',
      setFollowKey: '팔로우 단축키 변경 (Set Follow Shortcut Key)',
      promptKey: (curr) => `팔로우 단축키를 입력하세요 (현재: ${curr}, 기본값: F):`
    };
  }
  if (lower.startsWith('zh')) {
    return {
      toggleHints: '显示/隐藏快捷键提示 (Toggle Shortcut Hints)',
      setFollowKey: '修改关注快捷键 (Set Follow Shortcut Key)',
      promptKey: (curr) => `请输入关注快捷键（当前：${curr}，默认：F）：`
    };
  }
  if (lower.startsWith('ja')) {
    return {
      toggleHints: 'ショートカットヒント表示切替 (Toggle Shortcut Hints)',
      setFollowKey: 'フォローショートカット変更 (Set Follow Shortcut Key)',
      promptKey: (curr) => `フォロー用ショートカットキーを入力してください（現在: ${curr}、デフォルト: F）:`
    };
  }
  return {
    toggleHints: 'Toggle Shortcut Hints',
    setFollowKey: 'Set Follow Shortcut Key',
    promptKey: (curr) => `Enter Follow shortcut key (current: ${curr}, default: F):`
  };
}

function registerUserscriptMenuCommands() {
  if (typeof GM_registerMenuCommand !== 'function') return;
  try {
    const strings = getUserscriptMenuStrings();
    GM_registerMenuCommand(strings.toggleHints, () => {
      const next = !showUiHints;
      try {
        localStorage.setItem(LOCAL_STORAGE_HINTS_KEY, String(next));
      } catch (_) {}
      setShowUiHints(next);
    });
    GM_registerMenuCommand(strings.setFollowKey, () => {
      const currentLabel = formatShortcutLabel(shortcut);
      const input = typeof window !== 'undefined' && typeof window.prompt === 'function'
        ? window.prompt(strings.promptKey(currentLabel), shortcut.key || 'f')
        : null;
      if (!input) return;
      const k = input.trim().slice(0, 1).toLowerCase();
      if (!k) return;
      const code = resolveKeyCode({ key: k, code: '' }) || DEFAULT_SHORTCUT.code;
      shortcut = { ...DEFAULT_SHORTCUT, key: k, code };
      try {
        localStorage.setItem(LOCAL_STORAGE_SHORTCUT_KEY, JSON.stringify(shortcut));
      } catch (_) {}
      scheduleUiSync();
    });
  } catch (_) {}
}

async function initShortcut() {
  try {
    const data = await chrome.storage.sync.get(['shortcut', 'showUiHints']);
    if (data.shortcut) shortcut = { ...DEFAULT_SHORTCUT, ...data.shortcut };
    if (typeof data.showUiHints === 'boolean') showUiHints = data.showUiHints;
    scheduleUiSync();
  } catch (err) {
    console.error('Failed to load shortcut:', err);
  }
}

if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
  initShortcut();
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync') {
      if (changes.shortcut?.newValue) {
        shortcut = { ...DEFAULT_SHORTCUT, ...changes.shortcut.newValue };
      }
      if (typeof changes.showUiHints?.newValue === 'boolean') {
        showUiHints = changes.showUiHints.newValue;
      }
      scheduleUiSync();
    }
  });
} else {
  loadFromLocalStorage();
  registerUserscriptMenuCommands();
}

function isEditable(el) {
  if (!el || el.nodeType !== 1) return false;
  const tag = el.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable) {
    return true;
  }
  return Boolean(el.closest?.('[contenteditable="true"], [role="textbox"], input, textarea'));
}

function matchesShortcut(e, sc) {
  if (Boolean(e.ctrlKey) !== Boolean(sc.ctrl)) return false;
  if (Boolean(e.altKey) !== Boolean(sc.alt)) return false;
  if (Boolean(e.shiftKey) !== Boolean(sc.shift)) return false;
  if (Boolean(e.metaKey) !== Boolean(sc.meta)) return false;

  const eventCode = resolveKeyCode(e);
  const targetCode = resolveKeyCode(sc);
  if (eventCode && targetCode) {
    return eventCode === targetCode;
  }
  return Boolean(sc.key && e.key && e.key.toLowerCase() === sc.key.toLowerCase());
}

function isFollowListPage(pathname = typeof location !== 'undefined' ? location.pathname : '') {
  return FOLLOW_LIST_PATH_RE.test(pathname);
}

function isStatusPage(pathname = typeof location !== 'undefined' ? location.pathname : '') {
  return STATUS_PATH_RE.test(pathname);
}

function findConfirmationDialogButton(e, root = document) {
  if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return null;
  const confirmBtn = root.querySelector('[data-testid="confirmationSheetConfirm"]');
  const cancelBtn = root.querySelector('[data-testid="confirmationSheetCancel"]');
  if (!confirmBtn && !cancelBtn) return null;

  const code = resolveKeyCode(e);
  if (code === 'KeyY') return confirmBtn;
  if (code === 'KeyN') return cancelBtn;
  return null;
}

function findDropdownActionButton(code, root = document) {
  const dropdown = root.querySelector?.('[data-testid="Dropdown"]');
  if (!dropdown) return null;
  if (code === 'KeyT') {
    return dropdown.querySelector?.('[data-testid="retweetConfirm"], [data-testid="unretweetConfirm"]') || null;
  }
  if (code === 'KeyE') {
    const quoteLink = dropdown.querySelector?.('a[href="/compose/post"]');
    if (quoteLink) return quoteLink;
    const items = dropdown.querySelectorAll?.('[role="menuitem"], [role="button"]') || [];
    for (const item of items) {
      if (/(^|\s)(quote|인용|引用)(\s|$)|quote post|인용하기|게시물 인용/i.test(item.textContent || '')) {
        return item;
      }
    }
  }
  if (code === 'KeyX') {
    return dropdown.querySelector?.('[data-testid="block"]') || null;
  }
  return null;
}

const FOLLOW_TAB_SUFFIX_BY_CODE = {
  KeyV: '/verified_followers',
  KeyW: '/followers',
  KeyO: '/following'
};

const RESERVED_TOP_PATHS = new Set([
  'home',
  'explore',
  'notifications',
  'messages',
  'i',
  'search',
  'settings',
  'compose',
  'intent',
  'tos',
  'privacy',
  'jobs',
  'lists',
  'login',
  'logout',
  'signup'
]);

function resolveFollowListUsername(
  root = document,
  pathname = typeof location !== 'undefined' ? location.pathname : ''
) {
  const segMatch = pathname.match(/^\/([^/?#]+)/);
  const firstSeg = segMatch ? segMatch[1] : '';
  const isUserScoped =
    firstSeg &&
    !RESERVED_TOP_PATHS.has(firstSeg.toLowerCase()) &&
    (isFollowListPage(pathname) ||
      isStatusPage(pathname) ||
      Boolean(root.querySelector?.('[data-testid="primaryColumn"] [data-testid="UserName"]')));

  if (isUserScoped) {
    return firstSeg;
  }

  const profileLink = root.querySelector?.('header nav a[data-testid="AppTabBar_Profile_Link"]');
  const profileHref = profileLink?.getAttribute?.('href') || '';
  const profileMatch = profileHref.match(/^\/([^/?#]+)/);
  if (profileMatch && !RESERVED_TOP_PATHS.has(profileMatch[1].toLowerCase())) {
    return profileMatch[1];
  }

  if (firstSeg && !RESERVED_TOP_PATHS.has(firstSeg.toLowerCase())) {
    return firstSeg;
  }
  return null;
}

function findFollowListTabLink(
  code,
  root = document,
  pathname = typeof location !== 'undefined' ? location.pathname : ''
) {
  const suffix = FOLLOW_TAB_SUFFIX_BY_CODE[code];
  if (!suffix) return null;
  if (isFollowListPage(pathname)) {
    const tab = root.querySelector?.(`a[role="tab"][href$="${suffix}"]`);
    if (tab) return tab;
  }
  const username = resolveFollowListUsername(root, pathname);
  if (!username) return null;
  const targetPath = `/${username}${suffix}`;
  const exactLink = root.querySelector?.(`a[href="${targetPath}"]`);
  if (exactLink) return exactLink;
  return {
    href: targetPath,
    click() {
      if (
        typeof history !== 'undefined' &&
        typeof history.pushState === 'function' &&
        typeof window !== 'undefined' &&
        typeof window.dispatchEvent === 'function'
      ) {
        history.pushState({}, '', targetPath);
        const ev =
          typeof PopStateEvent === 'function' ? new PopStateEvent('popstate') : { type: 'popstate' };
        window.dispatchEvent(ev);
      } else if (typeof location !== 'undefined') {
        location.pathname = targetPath;
      }
    }
  };
}

const FOLLOW_BTN_SELECTOR =
  '[data-testid$="-follow"], [data-testid$="-unfollow"], button[aria-label*="팔로우"], [role="button"][aria-label*="팔로우"]';

function findTargetUserCell(primary, root = document) {
  const active = root.activeElement;
  if (active && primary.contains(active)) {
    const closestCell = active.closest?.('[data-testid="UserCell"]');
    if (closestCell && primary.contains(closestCell)) {
      lastFocusedCellLink = closestCell.querySelector?.('a[role="link"][tabindex="-1"]') || closestCell;
      return closestCell;
    }

    const innerDiv = active.closest?.('[data-testid="cellInnerDiv"]');
    const innerCell = innerDiv?.querySelector?.('[data-testid="UserCell"]');
    if (innerCell && primary.contains(innerCell)) {
      lastFocusedCellLink = innerCell.querySelector?.('a[role="link"][tabindex="-1"]') || innerCell;
      return innerCell;
    }
  }

  if (lastFocusedCellLink?.isConnected && primary.contains(lastFocusedCellLink)) {
    const rememberedCell =
      lastFocusedCellLink.closest?.('[data-testid="UserCell"]') ||
      lastFocusedCellLink
        .closest?.('[data-testid="cellInnerDiv"]')
        ?.querySelector?.('[data-testid="UserCell"]');
    if (rememberedCell && primary.contains(rememberedCell)) return rememberedCell;
  }

  return null;
}

function findStatusFollowButton(root, primary, statusUsername) {
  const handleLower = '@' + statusUsername.toLowerCase();
  const pathLower = '/' + statusUsername.toLowerCase();

  // a) Hovered or focused UserCell (e.g. in sidebarColumn "관련 인물" / Relevant people)
  const hoveredCell = root.querySelector?.('[data-testid="UserCell"]:hover');
  if (hoveredCell) {
    const btn = hoveredCell.querySelector?.(FOLLOW_BTN_SELECTOR);
    if (btn) return btn;
  }
  const activeCell = root.activeElement?.closest?.('[data-testid="UserCell"]');
  if (activeCell) {
    const btn = activeCell.querySelector?.(FOLLOW_BTN_SELECTOR);
    if (btn) return btn;
  }

  // b) Focused tweet article in primaryColumn if it has its own Follow/Unfollow button
  const activeArticle = root.activeElement?.closest?.('article[data-testid="tweet"]');
  if (activeArticle && primary?.contains?.(activeArticle)) {
    const btn = activeArticle.querySelector?.(FOLLOW_BTN_SELECTOR);
    if (btn) return btn;
  }

  // c) Search primaryColumn and sidebarColumn for Follow/Unfollow button matching @statusUsername
  const allBtns = Array.from(root.querySelectorAll?.(FOLLOW_BTN_SELECTOR) || []);
  for (const btn of allBtns) {
    const aria = (btn.getAttribute?.('aria-label') || '').toLowerCase();
    if (aria.includes(handleLower)) {
      return btn;
    }
    const container = btn.closest?.('[data-testid="UserCell"], article[data-testid="tweet"]');
    if (container?.querySelectorAll) {
      for (const a of container.querySelectorAll('a[href]')) {
        if ((a.getAttribute('href') || '').toLowerCase() === pathLower) {
          return btn;
        }
      }
    }
  }

  // d) Fallback to first Follow/Unfollow button inside primaryColumn or sidebarColumn
  const primaryBtn = primary?.querySelector?.(FOLLOW_BTN_SELECTOR);
  if (primaryBtn) return primaryBtn;
  const sidebar = root.querySelector?.('[data-testid="sidebarColumn"]');
  return sidebar?.querySelector?.(FOLLOW_BTN_SELECTOR) || allBtns[0] || null;
}

function findProfileFollowButton(
  root = document,
  pathname = typeof location !== 'undefined' ? location.pathname : ''
) {
  if (lastPathname !== pathname) {
    lastFocusedCellLink = null;
    lastPathname = pathname;
  }

  // 0. If a profile HoverCard is currently open, prioritize its Follow / Following button
  const hoverCard = root.querySelector?.('[data-testid="HoverCard"]');
  if (hoverCard) {
    const hoverBtn = hoverCard.querySelector?.(FOLLOW_BTN_SELECTOR);
    if (hoverBtn) return hoverBtn;
  }

  const primary = root.querySelector('[data-testid="primaryColumn"]');
  if (!primary) return null;

  // 1. On /verified_followers, /followers, /following: target the focused/hovered/remembered UserCell
  if (isFollowListPage(pathname)) {
    const cell = findTargetUserCell(primary, root);
    if (!cell) return null;
    const link = cell.querySelector?.('a[role="link"][tabindex="-1"]') || cell;
    lastFocusedCellLink = link;
    return cell.querySelector(FOLLOW_BTN_SELECTOR);
  }

  // 2. On a status page (/<username>/status/<id>): target the status author's Follow/Unfollow button
  //    (in the status tweet header or in sidebar "관련 인물" / Relevant people) or hovered UserCell
  const statusMatch = pathname.match(STATUS_PATH_RE);
  if (statusMatch) {
    return findStatusFollowButton(root, primary, statusMatch[1]);
  }

  // 3. On a user profile page: target the profile header's Follow / Following / Follow Back button
  if (!primary.querySelector('[data-testid="UserName"]')) return null;

  const candidates = primary.querySelectorAll(FOLLOW_BTN_SELECTOR);
  for (const btn of candidates) {
    if (!btn.closest('[data-testid="UserCell"], article, [data-testid="HoverCard"]')) {
      return btn;
    }
  }
  return null;
}

const syntheticEvents = typeof WeakSet !== 'undefined' ? new WeakSet() : new Set();

function createSyntheticKeyboardEvent(type, spec, modifiers = {}) {
  const init = {
    key: spec.key,
    // Leave code empty so legacy extensions checking KEY_BY_CODE[e.code] ignore our synthetic event,
    // while X.com's Mousetrap (e.which / e.keyCode) and React handlers (e.key) process it natively.
    code: '',
    keyCode: type === 'keypress' ? spec.charCode : spec.keyCode,
    which: type === 'keypress' ? spec.charCode : spec.keyCode,
    charCode: type === 'keypress' ? spec.charCode : 0,
    shiftKey: Boolean(spec.shiftKey ?? modifiers.shiftKey),
    ctrlKey: Boolean(modifiers.ctrlKey),
    altKey: Boolean(modifiers.altKey),
    metaKey: Boolean(modifiers.metaKey),
    bubbles: true,
    cancelable: true,
    composed: true
  };
  const ev = new KeyboardEvent(type, init);
  if (ev.which !== init.which) {
    try {
      Object.defineProperty(ev, 'which', { value: init.which });
    } catch (_) {}
  }
  if (ev.keyCode !== init.keyCode) {
    try {
      Object.defineProperty(ev, 'keyCode', { value: init.keyCode });
    } catch (_) {}
  }
  if (type === 'keypress' && ev.charCode !== init.charCode) {
    try {
      Object.defineProperty(ev, 'charCode', { value: init.charCode });
    } catch (_) {}
  }
  syntheticEvents.add(ev);
  return ev;
}

function getDispatchTarget(root = document) {
  const active = root.activeElement;
  if (active && active !== root.documentElement) {
    return active;
  }
  return root.body || root;
}

function dispatchNativeSpec(spec, modifiers = {}, root = document) {
  const target1 = getDispatchTarget(root);
  if (!target1?.dispatchEvent) return false;
  const kd = createSyntheticKeyboardEvent('keydown', spec, modifiers);
  target1.dispatchEvent(kd);
  if (spec.sendKeypress) {
    const target2 = getDispatchTarget(root);
    const kp = createSyntheticKeyboardEvent('keypress', spec, modifiers);
    target2.dispatchEvent(kp);
  }
  scheduleUiSync();
  return true;
}

function isAlreadyNativeAsciiEvent(e, spec) {
  if (!e || !spec) return false;
  if (e.isComposing || e.key === 'Process' || e.keyCode === 229 || e.which === 229) {
    return false;
  }
  if (e.key !== spec.key) {
    return false;
  }
  if (typeof e.keyCode === 'number' && e.keyCode !== 0 && e.keyCode !== spec.keyCode) {
    return false;
  }
  return true;
}

function ensureStyles() {
  if (typeof document === 'undefined' || !document.head) return;
  let style = document.getElementById('xfs-styles');
  if (!style) {
    style = document.createElement('style');
    style.id = 'xfs-styles';
    document.head.appendChild(style);
  }
  const css = `
    /* 1. Tweet action bar buttons (r, t, l, b, s) matching each button's icon & count color */
    article [role="group"] button[data-testid="reply"] > div::before,
    article [role="group"] button[data-testid="retweet"] > div::before,
    article [role="group"] button[data-testid="unretweet"] > div::before,
    article [role="group"] button[data-testid="like"] > div::before,
    article [role="group"] button[data-testid="unlike"] > div::before,
    article [role="group"] button[data-testid="bookmark"] > div::before,
    article [role="group"] button[data-testid="removeBookmark"] > div::before,
    article [role="group"] button[aria-label*="공유"] > div::before,
    article [role="group"] button[aria-label*="Share"] > div::before,
    article [role="group"] button[aria-label*="共有"] > div::before,
    article [role="group"] button[aria-label*="分享"] > div::before {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 13px;
      font-weight: 600;
      color: currentColor;
      margin-right: 2px;
      line-height: 1;
      align-self: center;
      pointer-events: none;
      user-select: none;
    }
    article [role="group"] button[data-testid="reply"] > div::before { content: "r"; }
    article [role="group"] button[data-testid="retweet"] > div::before,
    article [role="group"] button[data-testid="unretweet"] > div::before { content: "t"; }
    article [role="group"] button[data-testid="like"] > div::before,
    article [role="group"] button[data-testid="unlike"] > div::before { content: "l"; }
    article [role="group"] button[data-testid="bookmark"] > div::before,
    article [role="group"] button[data-testid="removeBookmark"] > div::before { content: "b"; }
    article [role="group"] button[aria-label*="공유"] > div::before,
    article [role="group"] button[aria-label*="Share"] > div::before,
    article [role="group"] button[aria-label*="共有"] > div::before,
    article [role="group"] button[aria-label*="分享"] > div::before { content: "s"; }

    /* 2. Follow / Unfollow / Follow back buttons (f) & Confirmation Modal buttons (y / n) */
    [data-xfs-target="true"] > div::after,
    [data-testid="confirmationSheetConfirm"] > div::after,
    [data-testid="confirmationSheetCancel"] > div::after {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 13px;
      font-weight: 700;
      color: currentColor;
      margin-left: 5px;
      line-height: 1;
      align-self: center;
      pointer-events: none;
      user-select: none;
    }
    [data-xfs-target="true"] > div::after {
      content: var(--xfs-follow-key, "f");
    }
    [data-testid="confirmationSheetConfirm"] > div::after { content: "y"; }
    [data-testid="confirmationSheetCancel"] > div::after { content: "n"; }

    /* 3. Left sidebar navigation, Compose button, Search input, New posts pill, Dropdown items */
    header nav a[data-testid="AppTabBar_Home_Link"] > div::after,
    header nav a[data-testid="AppTabBar_Explore_Link"] > div::after,
    header nav a[data-testid="AppTabBar_Notifications_Link"] > div::after,
    header nav a[data-testid="AppTabBar_DirectMessage_Link"] > div::after,
    header nav a[data-testid="AppTabBar_Profile_Link"] > div::after,
    header nav a[href="/i/grok"] > div::after,
    header nav a[href="/i/bookmarks"] > div::after,
    header nav a[href$="/lists"] > div::after,
    header nav a[href*="/creators/studio"] > div::after,
    header nav a[href="/settings"] > div::after,
    header nav a[href="/i/display"] > div::after {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 12px;
      font-weight: 600;
      color: var(--xfs-nav-color, currentColor);
      margin-left: 8px;
      align-self: center;
      pointer-events: none;
      user-select: none;
    }
    header nav a[data-testid="AppTabBar_Home_Link"] > div::after { content: "g h"; }
    header nav a[data-testid="AppTabBar_Explore_Link"] > div::after { content: "g e"; }
    header nav a[data-testid="AppTabBar_Notifications_Link"] > div::after { content: "g n"; }
    header nav a[data-testid="AppTabBar_DirectMessage_Link"] > div::after { content: "g m"; }
    header nav a[data-testid="AppTabBar_Profile_Link"] > div::after { content: "g p"; }
    header nav a[href="/i/grok"] > div::after { content: "g g"; }
    header nav a[href="/i/bookmarks"] > div::after { content: "g b"; }
    header nav a[href$="/lists"] > div::after { content: "g i"; }
    header nav a[href*="/creators/studio"] > div::after { content: "g c"; }
    header nav a[href="/settings"] > div::after { content: "g s"; }
    header nav a[href="/i/display"] > div::after { content: "g d"; }

    [data-testid="SideNav_NewTweet_Button"] > div::after {
      content: "n";
      font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 13px;
      font-weight: 700;
      color: currentColor;
      margin-left: 6px;
      pointer-events: none;
      user-select: none;
    }
    [data-testid="tweetButton"] > div::after,
    [data-testid="tweetButtonInline"] > div::after {
      content: "⌘↵";
      font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 12px;
      font-weight: 700;
      color: currentColor;
      margin-left: 5px;
      align-self: center;
      pointer-events: none;
      user-select: none;
    }
    [data-testid="SearchBox_Search_Input_label"]::after {
      content: "/";
      font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 13px;
      font-weight: 700;
      color: var(--xfs-muted-color, rgb(113, 118, 123));
      margin-right: 12px;
      align-self: center;
      pointer-events: none;
      user-select: none;
    }
    [data-testid="pillLabel"]::after {
      content: ".";
      font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 13px;
      font-weight: 700;
      color: currentColor;
      margin-left: 6px;
      pointer-events: none;
      user-select: none;
    }
    [data-testid="Dropdown"] [data-testid="retweetConfirm"] > div::after,
    [data-testid="Dropdown"] [data-testid="unretweetConfirm"] > div::after {
      content: "t";
      font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 12px;
      font-weight: 700;
      color: currentColor;
      margin-left: 6px;
    }
    [data-testid="Dropdown"] a[href="/compose/post"] > div::after {
      content: "e";
      font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 12px;
      font-weight: 700;
      color: var(--xfs-nav-color, currentColor);
      margin-left: 6px;
    }
    [data-testid="Dropdown"] [data-testid="mute"] > div::after {
      content: "u";
      font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 12px;
      font-weight: 700;
      color: currentColor;
      margin-left: 6px;
    }
    [data-testid="Dropdown"] [data-testid="block"] > div::after {
      content: "x";
      font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 12px;
      font-weight: 700;
      color: currentColor;
      margin-left: 6px;
    }
    a[role="tab"][href$="/verified_followers"] div[dir="ltr"] > span:first-of-type::after,
    a[role="tab"][href$="/followers"] div[dir="ltr"] > span:first-of-type::after,
    a[role="tab"][href$="/following"] div[dir="ltr"] > span:first-of-type::after {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 12px;
      font-weight: 600;
      color: currentColor;
      margin-left: 6px;
      pointer-events: none;
      user-select: none;
    }
    a[role="tab"][href$="/verified_followers"] div[dir="ltr"] > span:first-of-type::after { content: "g v"; }
    a[role="tab"][href$="/followers"] div[dir="ltr"] > span:first-of-type::after { content: "g w"; }
    a[role="tab"][href$="/following"] div[dir="ltr"] > span:first-of-type::after { content: "g o"; }
  `;
  if (style.textContent !== css) {
    style.textContent = css;
  }
}

function syncUiHints() {
  if (typeof document === 'undefined' || !document.documentElement) return;
  document.getElementById('xfs-hud')?.remove();
  for (const badge of document.querySelectorAll?.('.xfs-key-badge') || []) {
    badge.remove();
  }
  if (!showUiHints) {
    for (const prev of document.querySelectorAll?.('[data-xfs-target="true"]') || []) {
      prev.removeAttribute?.('data-xfs-target');
    }
    document.getElementById('xfs-styles')?.remove();
    return;
  }
  ensureStyles();
  const keyText = formatShortcutLabel(shortcut).toLowerCase();
  document.documentElement.style.setProperty('--xfs-follow-key', JSON.stringify(keyText));

  const activeFollowBtn =
    typeof document.querySelector === 'function' ? findProfileFollowButton(document) : null;
  for (const prev of document.querySelectorAll?.('[data-xfs-target="true"]') || []) {
    if (prev !== activeFollowBtn) {
      prev.removeAttribute?.('data-xfs-target');
    }
  }
  if (activeFollowBtn && activeFollowBtn.getAttribute?.('data-xfs-target') !== 'true') {
    activeFollowBtn.setAttribute?.('data-xfs-target', 'true');
  }

  if (typeof getComputedStyle === 'function' && typeof document.querySelector === 'function') {
    const navSample = document.querySelector('header nav a span, header nav a svg');
    if (navSample) {
      const navColor = getComputedStyle(navSample).color;
      if (navColor) {
        document.documentElement.style.setProperty('--xfs-nav-color', navColor);
      }
    }
    const mutedSample = document.querySelector(
      '[data-testid="SearchBox_Search_Input_label"] svg, article [role="group"] button svg'
    );
    if (mutedSample) {
      const mutedColor = getComputedStyle(mutedSample).color;
      if (mutedColor) {
        document.documentElement.style.setProperty('--xfs-muted-color', mutedColor);
      }
    }
  }
}

let uiSyncScheduled = false;
function scheduleUiSync() {
  if (typeof requestAnimationFrame === 'undefined' || uiSyncScheduled) return;
  uiSyncScheduled = true;
  requestAnimationFrame(() => {
    uiSyncScheduled = false;
    syncUiHints();
  });
}

function restoreCellFocusIfNeeded() {
  if (!lastFocusedCellLink || !isFollowListPage()) return;
  for (const delay of [50, 150]) {
    setTimeout(() => {
      const active = document.activeElement;
      const inCell =
        active?.closest?.('[data-testid="UserCell"]') ||
        active?.closest?.('[data-testid="cellInnerDiv"]')?.querySelector?.('[data-testid="UserCell"]');
      if (!active || active === document.body || !inCell) {
        if (lastFocusedCellLink?.isConnected) {
          lastFocusedCellLink.focus?.({ preventScroll: true });
        }
      }
      scheduleUiSync();
    }, delay);
  }
}

let lastModalDismissAt = 0;

function handleXNativeShortcutIfMatched(e, root = document, forceDispatch = false) {
  const code = resolveKeyCode(e);
  if (!code) return false;

  // 1. Inside editable fields: only support Cmd+Enter / Ctrl+Enter (Send post) when IME is composing
  if (isEditable(e.target)) {
    if ((e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && code === 'Enter') {
      const spec = codeToNativeSpec('Enter', false);
      if (!forceDispatch && isAlreadyNativeAsciiEvent(e, spec)) {
        return false;
      }
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      dispatchNativeSpec(spec, { ctrlKey: e.ctrlKey, metaKey: e.metaKey }, root);
      return true;
    }
    return false;
  }

  // 2. Ignore Alt combinations; allow Cmd+G -> g g (Grok) for compatibility with X Korean Keyboard Shortcuts
  if (e.altKey) return false;
  if (e.ctrlKey || e.metaKey) {
    if (e.metaKey && !e.ctrlKey && !e.shiftKey && code === 'KeyG') {
      clearPendingPrefix();
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const gSpec = codeToNativeSpec('KeyG', false);
      dispatchNativeSpec(gSpec, {}, root);
      dispatchNativeSpec(gSpec, {}, root);
      return true;
    }
    return false;
  }

  // 3. Question mark (?) shortcut help modal
  if (isQuestionMarkEvent(e)) {
    clearPendingPrefix();
    const qSpec = codeToNativeSpec('Slash', true);
    if (!forceDispatch && isAlreadyNativeAsciiEvent(e, qSpec)) {
      return false;
    }
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    dispatchNativeSpec(qSpec, { shiftKey: true }, root);
    return true;
  }

  // Ignore other Shift combinations for native X single/sequence shortcuts
  if (e.shiftKey) return false;

  const activePrefix = getActivePrefix();

  // 4. Dropdown menu shortcuts when open (t = confirm repost, e = quote post, x = block)
  if (!activePrefix) {
    const dropdownBtn = findDropdownActionButton(code, root);
    if (dropdownBtn) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      dropdownBtn.click();
      scheduleUiSync();
      return true;
    }
  }

  // 5. "g + ..." sequence second key
  if (activePrefix === 'g') {
    clearPendingPrefix();
    const tabLink = findFollowListTabLink(code, root);
    if (tabLink) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      tabLink.click();
      scheduleUiSync();
      return true;
    }
    if (!G_PREFIX_SECOND_CODES.has(code)) return false;
    const spec = codeToNativeSpec(code, false);
    if (!spec) return false;
    if (!forceDispatch && isAlreadyNativeAsciiEvent(e, spec)) {
      return false;
    }
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    // If prefix 'g' was pressed in a non-ASCII mode where Mousetrap already received synthetic 'g',
    // dispatching the second key completes the sequence.
    dispatchNativeSpec(spec, {}, root);
    return true;
  }

  // 6. "a + ..." sequence second key
  if (activePrefix === 'a') {
    clearPendingPrefix();
    if (!A_PREFIX_SECOND_CODES.has(code)) return false;
    const spec = codeToNativeSpec(code, false);
    if (!spec) return false;
    if (!forceDispatch && isAlreadyNativeAsciiEvent(e, spec)) {
      return false;
    }
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    dispatchNativeSpec(spec, {}, root);
    return true;
  }

  // 7. Prefix starters ('g' or 'a')
  if (code === 'KeyG' || code === 'KeyA') {
    const prefixChar = code === 'KeyG' ? 'g' : 'a';
    setPendingPrefix(prefixChar);
    const spec = codeToNativeSpec(code, false);
    if (!forceDispatch && isAlreadyNativeAsciiEvent(e, spec)) {
      return false;
    }
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    dispatchNativeSpec(spec, {}, root);
    return true;
  }

  // 8. Standalone 'e' (Quote helper: opens repost menu via 't' so pressing 'e' again selects Quote)
  if (code === 'KeyE') {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    const tSpec = codeToNativeSpec('KeyT', false);
    dispatchNativeSpec(tSpec, {}, root);
    return true;
  }

  // 9. All other X.com "?" single-key shortcuts: j, k, Space, ., n, /, l, r, t, s, b, u, x, Enter, o, i, m
  if (SINGLE_X_SHORTCUT_CODES.has(code)) {
    const spec = codeToNativeSpec(code, false);
    if (!spec) return false;
    if (!forceDispatch && isAlreadyNativeAsciiEvent(e, spec)) {
      return false;
    }
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    dispatchNativeSpec(spec, {}, root);
    return true;
  }

  return false;
}

function handleActionIfMatched(e, root = document, forceDispatch = false) {
  if (!isEditable(e.target)) {
    // 1. If confirmation modal is open (unfollow / mute / block), allow Y / N in any language to confirm / cancel
    const modalBtn = findConfirmationDialogButton(e, root);
    if (modalBtn) {
      clearPendingPrefix();
      lastModalDismissAt = Date.now();
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      modalBtn.click();
      restoreCellFocusIfNeeded();
      scheduleUiSync();
      return true;
    }

    // 2. Check the Follow / Unfollow / Follow back shortcut (unless 'g' prefix is active for 'g f' = Drafts!)
    const activePrefix = getActivePrefix();
    const isGfDraftsSequence = activePrefix === 'g' && resolveKeyCode(e) === 'KeyF' && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey;
    if (!isGfDraftsSequence && matchesShortcut(e, shortcut)) {
      const btn = findProfileFollowButton(root);
      if (btn) {
        clearPendingPrefix();
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        btn.click();
        if (btn.getAttribute('data-testid')?.endsWith('-follow')) {
          restoreCellFocusIfNeeded();
        }
        scheduleUiSync();
        return true;
      }
    }
  }

  // 3. Otherwise handle X.com "?" shortcuts across all input languages / IMEs
  return handleXNativeShortcutIfMatched(e, root, forceDispatch);
}

const REPEATABLE_CODES = new Set(['KeyJ', 'KeyK', 'Space']);
const handledKeysDown = new Set();
const seenKeysDown = new Set();
const ignoredModifierKeysDown = new Set();
let repeatDelayTimer = null;
let repeatIntervalTimer = null;
let repeatingCode = null;

function clearRepeatTimer() {
  if (repeatDelayTimer !== null) {
    clearTimeout(repeatDelayTimer);
    repeatDelayTimer = null;
  }
  if (repeatIntervalTimer !== null) {
    clearInterval(repeatIntervalTimer);
    repeatIntervalTimer = null;
  }
  repeatingCode = null;
}

function startRepeatTimer(code) {
  clearRepeatTimer();
  if (!code || (code !== 'KeyJ' && code !== 'KeyK')) return;
  repeatingCode = code;
  repeatDelayTimer = setTimeout(() => {
    repeatDelayTimer = null;
    if (repeatingCode !== code || !handledKeysDown.has(code)) return;
    const spec = codeToNativeSpec(code, false);
    if (!spec) return;
    repeatIntervalTimer = setInterval(() => {
      if (repeatingCode !== code || !handledKeysDown.has(code)) {
        clearRepeatTimer();
        return;
      }
      dispatchNativeSpec(spec, {}, document);
    }, 85);
  }, 400);
}

window.addEventListener(
  'keydown',
  (e) => {
    if (syntheticEvents.has(e)) return;

    const code = resolveKeyCode(e);
    if (code) seenKeysDown.add(code);

    // Swallow delayed synthetic Y/N dispatches from external Korean shortcut extensions right after modal close
    if (Date.now() - lastModalDismissAt < 600 && (code === 'KeyN' || code === 'KeyY')) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return;
    }

    if (e.repeat) {
      if (code && REPEATABLE_CODES.has(code)) {
        clearRepeatTimer();
        if (handleActionIfMatched(e, document, false)) {
          handledKeysDown.add(code);
        }
        return;
      }
      if (code && handledKeysDown.has(code)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
      return;
    }

    clearRepeatTimer();

    if (handleActionIfMatched(e, document, false)) {
      if (code) {
        handledKeysDown.add(code);
        if (!e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey && !getActivePrefix()) {
          startRepeatTimer(code);
        }
      }
      return;
    }

    if (code && (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey)) {
      ignoredModifierKeysDown.add(code);
    }
    scheduleUiSync();
  },
  true
);

window.addEventListener(
  'keyup',
  (e) => {
    if (syntheticEvents.has(e)) return;

    scheduleUiSync();
    const code = resolveKeyCode(e);
    if (!code || code === repeatingCode) {
      clearRepeatTimer();
    }
    const wasSeenOnKeydown = code ? seenKeysDown.has(code) : false;
    if (code) seenKeysDown.delete(code);

    if (Date.now() - lastModalDismissAt < 600 && (code === 'KeyN' || code === 'KeyY')) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return;
    }

    if (code && ignoredModifierKeysDown.has(code)) {
      ignoredModifierKeysDown.delete(code);
      return;
    }

    if (code && handledKeysDown.has(code)) {
      handledKeysDown.delete(code);
      e.stopPropagation();
      e.stopImmediatePropagation();
      return;
    }

    // If keydown WAS seen by our listener and wasn't handled (e.g. native English key handled by X.com directly),
    // do not re-trigger on keyup.
    if (wasSeenOnKeydown) {
      return;
    }

    handleActionIfMatched(e, document, true);
  },
  true
);

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  window.addEventListener('blur', () => {
    clearRepeatTimer();
    handledKeysDown.clear();
    seenKeysDown.clear();
    ignoredModifierKeysDown.clear();
    clearPendingPrefix();
  });
  window.addEventListener('focusin', scheduleUiSync, true);
  window.addEventListener('mouseover', scheduleUiSync, true);
  window.addEventListener('popstate', scheduleUiSync);

  const attachObserver = () => {
    if (typeof MutationObserver !== 'undefined' && document.documentElement) {
      const observer = new MutationObserver(scheduleUiSync);
      observer.observe(document.documentElement, { childList: true, subtree: true });
    }
    scheduleUiSync();
  };

  if (document.documentElement) {
    attachObserver();
  } else {
    window.addEventListener('DOMContentLoaded', attachObserver, { once: true });
  }
}

if (typeof module !== 'undefined') {
  module.exports = {
    DEFAULT_SHORTCUT,
    resolveKeyCode,
    codeToNativeSpec,
    formatShortcutLabel,
    isEditable,
    matchesShortcut,
    isFollowListPage,
    isStatusPage,
    findConfirmationDialogButton,
    findFollowListTabLink,
    findProfileFollowButton,
    handleActionIfMatched,
    clearPendingPrefix,
    setShowUiHints,
    syncUiHints
  };
}
