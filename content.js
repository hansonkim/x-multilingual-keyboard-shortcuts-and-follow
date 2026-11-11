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
const FOLLOWING_PATH_RE = /^\/[^/]+\/following\/?$/i;
const FOLLOWERS_FILTER_PATH_RE = /^\/[^/]+\/(?:verified_followers|followers)\/?$/i;
const COMPACT_PILL_PATH_RE = /^\/(home|notifications(?:\/.*)?)\/?$/i;
const STATUS_PATH_RE = /^\/([^/]+)\/status\/\d+/i;
const MUTUAL_BADGE_TEXT_RE =
  /^(follows you|나를 팔로우합니다|나를 팔로우함|フォローされています|关注了你|已关注你|跟隨你|подписан\(а\) на вас|читает вас|يتابعك)$/i;
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
let filterNonFollowers = false;
let compactNewPostsPill = true;
let compactPillDesign = '3';
let uiLang = null;
let lastFocusedCellLink = null;
let lastFocusedFilteredCell = null;
let lastFocusedRowTop = null;
let lastPathname = '';
let pendingPrefix = { key: null, until: 0 };

const DIRECT_CELL_WORK_BUDGET = 80;
const BG_CELL_WORK_BUDGET = 32;
const BG_CELL_TIME_BUDGET_MS = 4;
const FILTER_CHUNK_YIELD_MS = 20;
const FILTER_INTERACTION_BACKOFF_MS = 120;
const BG_UI_SYNC_MIN_INTERVAL_MS = 90;
const BG_UI_SYNC_FILTER_INTERVAL_MS = 120;
const USER_ACTIVE_WINDOW_MS = 160;
const THEME_COLOR_CACHE_MS = 2000;

let alignTimerIds = [];
let restoreFocusTimerIds = [];
let filterChunkTimerId = null;
let filterChunkGeneration = 0;
let bgUiSyncTimerId = null;
let isApplyingDomSync = false;
let pendingSyncOnVisible = false;
let lastUiSyncFinishedAt = 0;
let lastUserScrollAt = 0;
let lastUserPointerAt = 0;
let lastHoveredContext = null;

function nowPerfMs() {
  return typeof performance !== 'undefined' && typeof performance.now === 'function'
    ? performance.now()
    : Date.now();
}

function clearAlignTimers() {
  if (alignTimerIds.length === 0) return;
  if (typeof clearTimeout === 'function') {
    for (const id of alignTimerIds) clearTimeout(id);
  }
  alignTimerIds = [];
}

function clearRestoreFocusTimers() {
  if (restoreFocusTimerIds.length === 0) return;
  if (typeof clearTimeout === 'function') {
    for (const id of restoreFocusTimerIds) clearTimeout(id);
  }
  restoreFocusTimerIds = [];
}

function clearFilterChunkTimer() {
  filterChunkGeneration++;
  if (filterChunkTimerId !== null) {
    if (typeof clearTimeout === 'function') {
      clearTimeout(filterChunkTimerId);
    }
    filterChunkTimerId = null;
  }
}

function isUserActivelyInteracting() {
  const now = Date.now();
  return (
    now - lastUserScrollAt < USER_ACTIVE_WINDOW_MS ||
    now - lastUserPointerAt < USER_ACTIVE_WINDOW_MS
  );
}

function clearBgUiSyncTimer() {
  if (bgUiSyncTimerId !== null) {
    if (typeof clearTimeout === 'function') {
      clearTimeout(bgUiSyncTimerId);
    }
    bgUiSyncTimerId = null;
  }
}

function setAttrIfChanged(el, name, value) {
  if (!el || typeof el.setAttribute !== 'function') return false;
  const next = String(value);
  if (typeof el.getAttribute === 'function' && el.getAttribute(name) === next) {
    return false;
  }
  el.setAttribute(name, next);
  return true;
}

function removeAttrIfPresent(el, name) {
  if (!el || typeof el.removeAttribute !== 'function') return false;
  if (typeof el.getAttribute === 'function') {
    const cur = el.getAttribute(name);
    if (cur === null || cur === undefined) return false;
  }
  el.removeAttribute(name);
  return true;
}

function addClassIfMissing(el, cls) {
  const cl = el?.classList;
  if (!cl || typeof cl.add !== 'function') return false;
  if (typeof cl.contains === 'function' && cl.contains(cls)) return false;
  cl.add(cls);
  return true;
}

function removeClassIfPresent(el, cls) {
  const cl = el?.classList;
  if (!cl || typeof cl.remove !== 'function') return false;
  if (typeof cl.contains === 'function' && !cl.contains(cls)) return false;
  cl.remove(cls);
  return true;
}

const rootCssVarCache = typeof WeakMap !== 'undefined' ? new WeakMap() : null;

function setRootCssVarIfChanged(docEl, prop, value) {
  if (!docEl?.style || typeof docEl.style.setProperty !== 'function') return false;
  const next = String(value);
  let map = rootCssVarCache?.get(docEl);
  if (map && map.get(prop) === next) {
    return false;
  }
  if (!map && rootCssVarCache) {
    map = new Map();
    rootCssVarCache.set(docEl, map);
  }
  map?.set(prop, next);
  docEl.style.setProperty(prop, next);
  return true;
}

function syncPathnameState(pathname) {
  if (typeof pathname === 'string' && lastPathname !== pathname) {
    lastFocusedCellLink = null;
    lastFocusedFilteredCell = null;
    lastFocusedRowTop = null;
    lastPathname = pathname;
    clearAlignTimers();
    clearRestoreFocusTimers();
    clearFilterChunkTimer();
  }
}

function setShowUiHints(visible) {
  showUiHints = Boolean(visible);
  syncUiHints();
}

function getFilterNonFollowers() {
  return filterNonFollowers;
}

function setFilterNonFollowers(enabled, persist = false) {
  const next = Boolean(enabled);
  const changed = filterNonFollowers !== next;
  filterNonFollowers = next;
  if (!filterNonFollowers) {
    lastFocusedFilteredCell = null;
  }
  if (changed) {
    clearFilterChunkTimer();
  }
  if (persist) {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.set({ filterNonFollowers });
      } else if (typeof localStorage !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_NON_FOLLOWERS_KEY, String(filterNonFollowers));
      }
    } catch (_) {}
  }
  syncUiHints();
}

function normalizeCompactPillDesign(design) {
  const s = String(design || '').trim();
  return s === '1' || s === '2' || s === '3' ? s : '3';
}

function getCompactNewPostsPill() {
  return compactNewPostsPill;
}

function setCompactNewPostsPill(enabled, persist = false) {
  compactNewPostsPill = Boolean(enabled);
  if (persist) {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.set({ compactNewPostsPill });
      } else if (typeof localStorage !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_COMPACT_PILL_KEY, String(compactNewPostsPill));
      }
    } catch (_) {}
  }
  syncUiHints();
}

function getCompactPillDesign() {
  return compactPillDesign;
}

function setCompactPillDesign(design, persist = false) {
  compactPillDesign = normalizeCompactPillDesign(design);
  if (persist) {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.set({ compactPillDesign });
      } else if (typeof localStorage !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_COMPACT_PILL_DESIGN_KEY, compactPillDesign);
      }
    } catch (_) {}
  }
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
const LOCAL_STORAGE_NON_FOLLOWERS_KEY = 'x_follow_shortcut_filter_non_followers';
const LOCAL_STORAGE_COMPACT_PILL_KEY = 'x_follow_shortcut_compact_pill';
const LOCAL_STORAGE_COMPACT_PILL_DESIGN_KEY = 'x_follow_shortcut_compact_pill_design';

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
    const rawFilter = localStorage.getItem(LOCAL_STORAGE_NON_FOLLOWERS_KEY);
    if (rawFilter !== null) {
      filterNonFollowers = rawFilter === 'true';
    }
    const rawCompactPill = localStorage.getItem(LOCAL_STORAGE_COMPACT_PILL_KEY);
    if (rawCompactPill !== null) {
      compactNewPostsPill = rawCompactPill !== 'false';
    }
    const rawCompactPillDesign = localStorage.getItem(LOCAL_STORAGE_COMPACT_PILL_DESIGN_KEY);
    if (rawCompactPillDesign !== null) {
      compactPillDesign = normalizeCompactPillDesign(rawCompactPillDesign);
    }
  } catch (_) {}
}

function detectUiLang(root = typeof document !== 'undefined' ? document : null) {
  if (uiLang && ['ko', 'en', 'zh', 'ja'].includes(uiLang)) return uiLang;
  const docLang = root?.documentElement?.lang || (typeof document !== 'undefined' && document.documentElement?.lang) || '';
  const navLang = (typeof navigator !== 'undefined' && navigator.language) || 'en';
  const lower = String(docLang || navLang).toLowerCase();
  if (lower.startsWith('ko')) return 'ko';
  if (lower.startsWith('zh')) return 'zh';
  if (lower.startsWith('ja')) return 'ja';
  return 'en';
}

function getUserscriptMenuStrings() {
  const lang = detectUiLang();
  if (lang === 'ko') {
    return {
      toggleHints: '단축키 힌트 표시/숨기기 (Toggle Shortcut Hints)',
      toggleNonFollowers: '팔로잉·팔로워 미맞팔 계정만 보기 토글 (⇧F)',
      toggleCompactPill: '"게시됨" 플로팅 버튼 최소화 토글 (Toggle Compact Pill)',
      setFollowKey: '팔로우 단축키 변경 (Set Follow Shortcut Key)',
      promptKey: (curr) => `팔로우 단축키를 입력하세요 (현재: ${curr}, 기본값: F):`
    };
  }
  if (lang === 'zh') {
    return {
      toggleHints: '显示/隐藏快捷键提示 (Toggle Shortcut Hints)',
      toggleNonFollowers: '关注/粉丝列表：切换仅看未互关用户 (⇧F)',
      toggleCompactPill: '切换精简浮动“已发帖”按钮 (Toggle Compact Pill)',
      setFollowKey: '修改关注快捷键 (Set Follow Shortcut Key)',
      promptKey: (curr) => `请输入关注快捷键（当前：${curr}，默认：F）：`
    };
  }
  if (lang === 'ja') {
    return {
      toggleHints: 'ショートカットヒント表示切替 (Toggle Shortcut Hints)',
      toggleNonFollowers: 'フォロー中・フォロワー：未相互のみ表示切替 (⇧F)',
      toggleCompactPill: '「ポスト済」フローティングボタン最小化切替 (Toggle Compact Pill)',
      setFollowKey: 'フォローショートカット変更 (Set Follow Shortcut Key)',
      promptKey: (curr) => `フォロー用ショートカットキーを入力してください（現在: ${curr}、デフォルト: F）:`
    };
  }
  return {
    toggleHints: 'Toggle Shortcut Hints',
    toggleNonFollowers: 'Following/Followers: Toggle Unreciprocated Only (⇧F)',
    toggleCompactPill: 'Toggle Compact Floating "Posted" Pill',
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
    GM_registerMenuCommand(strings.toggleNonFollowers, () => {
      setFilterNonFollowers(!filterNonFollowers, true);
    });
    GM_registerMenuCommand(strings.toggleCompactPill, () => {
      setCompactNewPostsPill(!compactNewPostsPill, true);
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

function applyConfigUpdate(data = {}) {
  if (!data || typeof data !== 'object') return;
  if (data.shortcut && typeof data.shortcut === 'object') {
    shortcut = { ...DEFAULT_SHORTCUT, ...data.shortcut };
  }
  if (typeof data.showUiHints === 'boolean') {
    showUiHints = data.showUiHints;
  }
  if (typeof data.filterNonFollowers === 'boolean') {
    filterNonFollowers = data.filterNonFollowers;
  }
  if (typeof data.compactNewPostsPill === 'boolean') {
    compactNewPostsPill = data.compactNewPostsPill;
  }
  if (typeof data.compactPillDesign === 'string') {
    compactPillDesign = normalizeCompactPillDesign(data.compactPillDesign);
  }
  if (typeof data.uiLang === 'string') {
    uiLang = data.uiLang;
  }
  syncUiHints();
  scheduleUiSync();
}

async function initShortcut() {
  try {
    const data = await chrome.storage.sync.get([
      'shortcut',
      'showUiHints',
      'filterNonFollowers',
      'compactNewPostsPill',
      'compactPillDesign',
      'uiLang'
    ]);
    applyConfigUpdate(data);
  } catch (err) {
    console.error('Failed to load shortcut:', err);
  }
}

if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
  initShortcut();
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync') {
      const patch = {};
      if (changes.shortcut?.newValue) patch.shortcut = changes.shortcut.newValue;
      if (typeof changes.showUiHints?.newValue === 'boolean') patch.showUiHints = changes.showUiHints.newValue;
      if (typeof changes.filterNonFollowers?.newValue === 'boolean') patch.filterNonFollowers = changes.filterNonFollowers.newValue;
      if (typeof changes.compactNewPostsPill?.newValue === 'boolean') patch.compactNewPostsPill = changes.compactNewPostsPill.newValue;
      if (typeof changes.compactPillDesign?.newValue === 'string') patch.compactPillDesign = changes.compactPillDesign.newValue;
      if (typeof changes.uiLang?.newValue === 'string') patch.uiLang = changes.uiLang.newValue;
      applyConfigUpdate(patch);
    }
  });
  if (chrome.runtime && chrome.runtime.onMessage && typeof chrome.runtime.onMessage.addListener === 'function') {
    chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
      if (msg && msg.type === 'xfs-config-update') {
        applyConfigUpdate(msg);
        try {
          sendResponse?.({ ok: true });
        } catch (_) {}
      }
    });
  }
} else {
  loadFromLocalStorage();
  registerUserscriptMenuCommands();
}

const EDITABLE_ROLES = new Set(['textbox', 'searchbox', 'combobox', 'spinbutton']);
const EDITABLE_SELECTOR =
  '[contenteditable="true"], [contenteditable=""], [contenteditable="plaintext-only"], [role="textbox"], [role="searchbox"], [role="combobox"], [role="spinbutton"], input, textarea, select';
const XCHAT_HOST_SELECTOR =
  '[data-testid="xchatEmbedRoute"], [data-testid="xchatEmbedDrawer"], [data-testid="xchatEmbedOverlays"], [data-testid="chat-drawer-root"]';
const XCHAT_OVERLAY_SELECTOR =
  '[data-testid="xchatEmbedDrawer"], [data-testid="xchatEmbedOverlays"], [data-testid="chat-drawer-root"]';
const MODAL_DIALOG_SELECTOR = '[role="dialog"], [aria-modal="true"]';
const CHAT_PATH_RE = /^\/(?:i\/chat|messages)(?:\/|$)/i;

function getShadowRoot(el) {
  if (!el || el.nodeType !== 1) return null;
  if (el.shadowRoot) return el.shadowRoot;
  if (typeof chrome !== 'undefined' && typeof chrome?.dom?.openOrClosedShadowRoot === 'function') {
    try {
      return chrome.dom.openOrClosedShadowRoot(el);
    } catch (_) {}
  }
  return null;
}

function isEmbeddedFrameElement(el) {
  if (!el || el.nodeType !== 1) return false;
  const tag = el.tagName;
  return tag === 'IFRAME' || tag === 'OBJECT' || tag === 'EMBED';
}

function getDeepActiveElement(root = typeof document !== 'undefined' ? document : null) {
  let active = root?.activeElement || null;
  const visited = typeof Set !== 'undefined' ? new Set() : null;
  while (active && (!visited || !visited.has(active))) {
    visited?.add(active);
    const sr = getShadowRoot(active);
    if (sr?.activeElement && sr.activeElement !== active) {
      active = sr.activeElement;
      continue;
    }
    if (active.tagName === 'IFRAME') {
      try {
        const innerActive = active.contentDocument?.activeElement;
        if (innerActive && innerActive !== active) {
          active = innerActive;
          continue;
        }
      } catch (_) {}
    }
    break;
  }
  return active;
}

function isDirectEditableElement(el) {
  if (!el || el.nodeType !== 1) return false;
  const tag = el.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable || Boolean(el.editContext)) {
    return true;
  }
  const ce = el.getAttribute?.('contenteditable');
  if (ce === '' || ce === 'true' || ce === 'plaintext-only') {
    return true;
  }
  const role = (el.getAttribute?.('role') || '').toLowerCase();
  if (role && EDITABLE_ROLES.has(role)) {
    return true;
  }
  return false;
}

function isEditableNode(el) {
  if (!el || el.nodeType !== 1) return false;
  let cur = el;
  const visited = typeof Set !== 'undefined' ? new Set() : null;
  while (cur && cur.nodeType === 1 && (!visited || !visited.has(cur))) {
    visited?.add(cur);
    if (isDirectEditableElement(cur)) return true;
    if (cur.parentElement) {
      cur = cur.parentElement;
      continue;
    }
    const rootNode = cur.getRootNode?.();
    if (rootNode?.host && rootNode.host.nodeType === 1) {
      cur = rootNode.host;
      continue;
    }
    break;
  }
  return Boolean(el.closest?.(EDITABLE_SELECTOR));
}

function isEditable(el) {
  let cur = el;
  const visited = typeof Set !== 'undefined' ? new Set() : null;
  while (cur && cur.nodeType === 1 && (!visited || !visited.has(cur))) {
    visited?.add(cur);
    if (isEditableNode(cur)) return true;
    const sr = getShadowRoot(cur);
    if (sr?.activeElement && sr.activeElement !== cur) {
      cur = sr.activeElement;
      continue;
    }
    if (cur.tagName === 'IFRAME') {
      try {
        const innerActive = cur.contentDocument?.activeElement;
        if (innerActive && innerActive !== cur) {
          cur = innerActive;
          continue;
        }
      } catch (_) {}
      return true;
    }
    if (isEmbeddedFrameElement(cur)) return true;
    break;
  }
  return false;
}

function getEventTarget(e, root = typeof document !== 'undefined' ? document : null) {
  if (typeof e?.composedPath === 'function') {
    const path = e.composedPath();
    if (path && path.length > 0) {
      const first = path[0];
      if (first?.nodeType === 1) return first;
      if (first?.parentElement?.nodeType === 1) return first.parentElement;
    }
  }
  let target = e?.target || null;
  const visited = typeof Set !== 'undefined' ? new Set() : null;
  while (target && (!visited || !visited.has(target))) {
    visited?.add(target);
    const sr = getShadowRoot(target);
    if (sr?.activeElement && sr.activeElement !== target) {
      target = sr.activeElement;
      continue;
    }
    break;
  }
  return target || getDeepActiveElement(root);
}

function isEditableEvent(e, root = typeof document !== 'undefined' ? document : null) {
  if (e) {
    if (typeof e.composedPath === 'function') {
      for (const node of e.composedPath()) {
        if (node && node.nodeType === 1 && (isEditableNode(node) || isEmbeddedFrameElement(node))) {
          return true;
        }
      }
    }
    if (isEditable(e.target)) return true;
  }
  if (isEmbeddedFrameElement(root?.activeElement)) return true;
  const deepActive = getDeepActiveElement(root);
  return Boolean(deepActive && (isEditableNode(deepActive) || isEmbeddedFrameElement(deepActive)));
}

function matchesElementTestId(el, testIds) {
  const tid = el?.getAttribute?.('data-testid');
  return Boolean(tid && testIds.has(tid));
}

const XCHAT_HOST_TESTIDS = new Set([
  'xchatEmbedRoute',
  'xchatEmbedDrawer',
  'xchatEmbedOverlays',
  'chat-drawer-root'
]);
const XCHAT_OVERLAY_TESTIDS = new Set([
  'xchatEmbedDrawer',
  'xchatEmbedOverlays',
  'chat-drawer-root'
]);

function nodeTouchesTestIdsOrSelector(node, testIds, selector) {
  let cur = node;
  const visited = typeof Set !== 'undefined' ? new Set() : null;
  while (cur && (!visited || !visited.has(cur))) {
    visited?.add(cur);
    if (cur.nodeType === 1) {
      if (testIds && matchesElementTestId(cur, testIds)) return true;
      if (selector && (cur.matches?.(selector) || cur.closest?.(selector))) return true;
      if (cur.parentElement) {
        cur = cur.parentElement;
        continue;
      }
    }
    const rootNode = cur.getRootNode?.();
    if (rootNode?.host) {
      cur = rootNode.host;
      continue;
    }
    break;
  }
  return false;
}

function eventTouchesContext(e, root, testIds, selector) {
  if (e) {
    if (typeof e.composedPath === 'function') {
      for (const node of e.composedPath()) {
        if (nodeTouchesTestIdsOrSelector(node, testIds, selector)) return true;
      }
    }
    if (nodeTouchesTestIdsOrSelector(e.target, testIds, selector)) return true;
  }
  if (nodeTouchesTestIdsOrSelector(root?.activeElement, testIds, selector)) return true;
  const deepActive = getDeepActiveElement(root);
  if (deepActive && deepActive !== root?.activeElement && nodeTouchesTestIdsOrSelector(deepActive, testIds, selector)) {
    return true;
  }
  return false;
}

function isInsideXChatOverlay(e, root = typeof document !== 'undefined' ? document : null) {
  return eventTouchesContext(e, root, XCHAT_OVERLAY_TESTIDS, XCHAT_OVERLAY_SELECTOR);
}

function isInsideXChatContext(
  e,
  root = typeof document !== 'undefined' ? document : null,
  pathname = typeof location !== 'undefined' ? location.pathname : ''
) {
  if (typeof pathname === 'string' && CHAT_PATH_RE.test(pathname)) return true;
  return eventTouchesContext(e, root, XCHAT_HOST_TESTIDS, XCHAT_HOST_SELECTOR);
}

function isInsideModalDialog(e, root = typeof document !== 'undefined' ? document : null) {
  return eventTouchesContext(e, root, null, MODAL_DIALOG_SELECTOR);
}

function isNodeInsideShadowTree(node, shadowRoot) {
  if (!node || !shadowRoot) return false;
  let cur = node;
  const visited = typeof Set !== 'undefined' ? new Set() : null;
  while (cur && (!visited || !visited.has(cur))) {
    visited?.add(cur);
    if (cur === shadowRoot) return true;
    if (shadowRoot.contains?.(cur)) return true;
    const rootNode = cur.getRootNode?.();
    if (rootNode === shadowRoot) return true;
    if (rootNode?.host) {
      cur = rootNode.host;
      continue;
    }
    cur = cur.parentNode || null;
  }
  return false;
}

function shouldSwallowUntrustedShadowEvent(e, root = typeof document !== 'undefined' ? document : null) {
  if (!e || e.isTrusted !== false || syntheticEvents.has(e)) return false;
  const topActive = root?.activeElement || null;
  if (!topActive) return false;
  const topShadow = getShadowRoot(topActive);
  if (!topShadow) return false;
  const deepActive = getDeepActiveElement(root);
  if (!deepActive || deepActive === topActive || (!isEditableNode(deepActive) && !isEmbeddedFrameElement(deepActive))) {
    return false;
  }
  const path = typeof e.composedPath === 'function' ? e.composedPath() : null;
  const originNode = path && path.length > 0 ? path[0] : e.target;
  if (originNode && originNode !== topActive && isNodeInsideShadowTree(originNode, topShadow)) {
    return false;
  }
  return true;
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

function getFollowFilterMode(
  pathname = typeof location !== 'undefined'
    ? location.pathname
    : typeof window !== 'undefined' && window.location
      ? window.location.pathname
      : ''
) {
  if (FOLLOWING_PATH_RE.test(pathname)) return 'following';
  if (FOLLOWERS_FILTER_PATH_RE.test(pathname)) return 'followers';
  return null;
}

function isFollowFilterPage(pathname = typeof location !== 'undefined' ? location.pathname : '') {
  return Boolean(getFollowFilterMode(pathname));
}

function isFollowingPage(pathname = typeof location !== 'undefined' ? location.pathname : '') {
  return FOLLOWING_PATH_RE.test(pathname);
}

function isFollowingFilterActive(pathname = typeof location !== 'undefined' ? location.pathname : '') {
  return Boolean(filterNonFollowers && isFollowFilterPage(pathname));
}

function isCompactPillPage(pathname = typeof location !== 'undefined' ? location.pathname : '') {
  return COMPACT_PILL_PATH_RE.test(pathname);
}

function isCompactPillActive(pathname = typeof location !== 'undefined' ? location.pathname : '') {
  return Boolean(compactNewPostsPill && isCompactPillPage(pathname));
}

const mutualCellCache = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
const followerCellCache = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
const cellRowCache = typeof WeakMap !== 'undefined' ? new WeakMap() : null;

function getCellRow(cell) {
  if (!cell) return null;
  const cached = cellRowCache?.get(cell);
  if (cached && cached.isConnected !== false) {
    return cached;
  }
  const row = cell.closest?.('[data-testid="cellInnerDiv"]') || null;
  if (row) {
    cellRowCache?.set(cell, row);
  }
  return row;
}

function isMutualFollowerCell(cell) {
  if (!cell) return false;
  if (mutualCellCache?.has(cell)) {
    return mutualCellCache.get(cell);
  }
  let result = false;
  let canCache = true;
  if (cell.querySelector?.('[data-testid="userFollowIndicator"]')) {
    result = true;
  } else if (!cell.querySelector?.('[data-testid="UserName"]')) {
    const candidates = cell.querySelectorAll?.('span, div') || [];
    for (const el of candidates) {
      if (el.children && el.children.length > 0) continue;
      if (el.closest?.('[data-testid="UserDescription"], button, [role="button"]')) continue;
      const text = (el.textContent || '').trim();
      if (text && MUTUAL_BADGE_TEXT_RE.test(text)) {
        result = true;
        break;
      }
    }
    if (!result) {
      canCache = false;
    }
  }
  if (canCache) {
    mutualCellCache?.set(cell, result);
  }
  return result;
}

function resolveNormalizedProfileHref(root = typeof document !== 'undefined' ? document : null) {
  const profileHref = root
    ?.querySelector?.('header nav a[data-testid="AppTabBar_Profile_Link"]')
    ?.getAttribute?.('href');
  return profileHref ? profileHref.replace(/\/+$/, '').toLowerCase() : '';
}

function isFollowerCellFilteredOut(
  cell,
  root = typeof document !== 'undefined' ? document : null,
  normProfileOverride = undefined
) {
  if (!cell) return false;
  const cached = followerCellCache?.get(cell);
  if (cached?.btn) {
    if (
      cached.btn.isConnected !== false &&
      (typeof cell.contains !== 'function' || cell.contains(cached.btn))
    ) {
      const curTid = cached.btn.getAttribute?.('data-testid') || '';
      if (curTid && curTid === cached.lastTestId) {
        return cached.result;
      }
    } else {
      followerCellCache?.delete(cell);
    }
  }

  const followBtn = cell.querySelector?.('[data-testid$="-follow"]');
  if (followBtn) {
    const tid = followBtn.getAttribute?.('data-testid') || '';
    if (tid) {
      followerCellCache?.set(cell, { btn: followBtn, lastTestId: tid, result: false, stateKey: `b:${tid}` });
    }
    return false;
  }
  const unfollowOrCancelBtn = cell.querySelector?.('[data-testid$="-unfollow"], [data-testid$="-cancel"]');
  if (unfollowOrCancelBtn) {
    const tid = unfollowOrCancelBtn.getAttribute?.('data-testid') || '';
    if (tid) {
      followerCellCache?.set(cell, { btn: unfollowOrCancelBtn, lastTestId: tid, result: true, stateKey: `b:${tid}` });
    }
    return true;
  }

  const normProfile =
    typeof normProfileOverride === 'string' ? normProfileOverride : resolveNormalizedProfileHref(root);
  if (cached?.isSelf && cached.normProfile === normProfile) {
    return true;
  }
  if (normProfile) {
    const hasHydratedName = Boolean(cell.querySelector?.('[data-testid="UserName"]'));
    const links = cell.querySelectorAll?.('a[href]') || [];
    for (const link of links) {
      const href = (link.getAttribute?.('href') || '').replace(/\/+$/, '').toLowerCase();
      if (href && href === normProfile) {
        if (hasHydratedName) {
          followerCellCache?.set(cell, { isSelf: true, normProfile, result: true, stateKey: `self:${normProfile}` });
        }
        return true;
      }
    }
  }
  if (cell.querySelector?.('[data-testid^="UserAvatar-Container-"]')) {
    return true;
  }
  return false;
}

function shouldFilterOutUserCell(
  cell,
  mode = 'following',
  root = typeof document !== 'undefined' ? document : null,
  normProfileOverride = undefined
) {
  if (!cell || !mode) return false;
  if (mode === 'following') return isMutualFollowerCell(cell);
  if (mode === 'followers') return isFollowerCellFilteredOut(cell, root, normProfileOverride);
  return false;
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

const HOME_TAB_INDEX_BY_CODE = {
  Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, Digit5: 4,
  Digit6: 5, Digit7: 6, Digit8: 7, Digit9: 8, Digit0: 9
};

function findHomeTabLink(
  code,
  root = document,
  pathname = typeof location !== 'undefined' ? location.pathname : ''
) {
  const index = HOME_TAB_INDEX_BY_CODE[code];
  if (index === undefined || !/^\/home\/?$/.test(pathname)) return null;
  const tablist = root.querySelector?.('[data-testid="primaryColumn"] [role="tablist"]');
  const tabs = tablist?.querySelectorAll?.('[role="tab"]');
  return (tabs && tabs[index]) || null;
}

const FOLLOW_BTN_SELECTOR =
  '[data-testid$="-follow"], [data-testid$="-unfollow"], button[aria-label*="팔로우"], [role="button"][aria-label*="팔로우"]';

function findTargetUserCell(
  primary,
  root = document,
  pathname = typeof location !== 'undefined' ? location.pathname : '',
  normProfileOverride = undefined,
  measureTop = true
) {
  const filterMode = getFollowFilterMode(pathname);
  const filterActive = Boolean(filterNonFollowers && filterMode);
  const normProfile =
    filterActive && filterMode === 'followers'
      ? typeof normProfileOverride === 'string'
        ? normProfileOverride
        : resolveNormalizedProfileHref(root)
      : '';
  const active = root.activeElement;
  if (active && primary.contains(active)) {
    const closestCell = active.closest?.('[data-testid="UserCell"]');
    if (closestCell && primary.contains(closestCell)) {
      if (filterActive && shouldFilterOutUserCell(closestCell, filterMode, root, normProfile)) return null;
      const cellChanged = lastFocusedFilteredCell !== closestCell;
      lastFocusedFilteredCell = closestCell;
      lastFocusedCellLink = closestCell.querySelector?.('a[role="link"][tabindex="-1"]') || closestCell;
      if (measureTop && (cellChanged || lastFocusedRowTop === null)) {
        const top = getRowVisualTop(closestCell);
        if (top !== null) lastFocusedRowTop = top;
      }
      return closestCell;
    }

    const innerDiv = active.closest?.('[data-testid="cellInnerDiv"]');
    const innerCell = innerDiv?.querySelector?.('[data-testid="UserCell"]');
    if (innerCell && primary.contains(innerCell)) {
      if (filterActive && shouldFilterOutUserCell(innerCell, filterMode, root, normProfile)) return null;
      const cellChanged = lastFocusedFilteredCell !== innerCell;
      lastFocusedFilteredCell = innerCell;
      lastFocusedCellLink = innerCell.querySelector?.('a[role="link"][tabindex="-1"]') || innerCell;
      if (measureTop && (cellChanged || lastFocusedRowTop === null)) {
        const top = getRowVisualTop(innerCell);
        if (top !== null) lastFocusedRowTop = top;
      }
      return innerCell;
    }
  }

  if (
    lastFocusedFilteredCell &&
    primary.contains(lastFocusedFilteredCell) &&
    (!filterActive || !shouldFilterOutUserCell(lastFocusedFilteredCell, filterMode, root, normProfile))
  ) {
    return lastFocusedFilteredCell;
  }

  if (lastFocusedCellLink?.isConnected && primary.contains(lastFocusedCellLink)) {
    const rememberedCell =
      lastFocusedCellLink.closest?.('[data-testid="UserCell"]') ||
      lastFocusedCellLink
        .closest?.('[data-testid="cellInnerDiv"]')
        ?.querySelector?.('[data-testid="UserCell"]');
    if (rememberedCell && primary.contains(rememberedCell)) {
      if (filterActive && shouldFilterOutUserCell(rememberedCell, filterMode, root, normProfile)) return null;
      return rememberedCell;
    }
  }

  return null;
}

function getFollowingCells(primary, filterActive, filterMode = 'following', root = document) {
  const normProfile =
    filterActive && filterMode === 'followers' ? resolveNormalizedProfileHref(root) : '';
  const all = Array.from(primary?.querySelectorAll?.('[data-testid="UserCell"]') || []);
  return filterActive ? all.filter((cell) => !shouldFilterOutUserCell(cell, filterMode, root, normProfile)) : all;
}

function getStickyHeaderBottom(primary, root = document) {
  const bar = root.getElementById?.('xfs-following-filter-bar') || primary?.querySelector?.('#xfs-following-filter-bar');
  if (bar && typeof bar.getBoundingClientRect === 'function') {
    const r = bar.getBoundingClientRect();
    if (r && r.bottom > 0) return Math.ceil(r.bottom);
  }
  const tablist = primary?.querySelector?.('[role="tablist"]');
  if (tablist && typeof tablist.getBoundingClientRect === 'function') {
    const r = tablist.getBoundingClientRect();
    if (r && r.bottom > 0) return Math.ceil(r.bottom);
  }
  return 160;
}

function alignFollowingCellBelowHeader(targetCell, primary, root = document) {
  clearAlignTimers();
  if (!targetCell || typeof window === 'undefined' || typeof window.scrollBy !== 'function') return;
  const row = getCellRow(targetCell) || targetCell;
  if (typeof row.getBoundingClientRect !== 'function') return;
  const applyAlign = () => {
    if (row.isConnected === false) return false;
    const rect = row.getBoundingClientRect();
    if (!rect || (rect.top === 0 && rect.bottom === 0 && rect.height === 0)) return false;
    const headerBottom = getStickyHeaderBottom(primary, root);
    const delta = rect.top - headerBottom;
    if (Math.abs(delta) > 1) {
      window.scrollBy(0, delta);
      return true;
    }
    return false;
  };
  applyAlign();
  if (typeof setTimeout === 'function') {
    for (const ms of [35, 90, 160, 240]) {
      const timerId = setTimeout(() => {
        alignTimerIds = alignTimerIds.filter((id) => id !== timerId);
        const scrolled = applyAlign();
        if ((scrolled || ms === 240) && typeof document !== 'undefined' && root === document) {
          scheduleUiSync();
        }
      }, ms);
      alignTimerIds.push(timerId);
    }
  }
}

function getRowVisualTop(cell) {
  const row = getCellRow(cell) || cell;
  if (typeof row?.getBoundingClientRect === 'function') {
    const r = row.getBoundingClientRect();
    if (r && !(r.top === 0 && r.bottom === 0 && r.height === 0)) {
      return r.top;
    }
  }
  return null;
}

function stepFollowingCell(
  code,
  root = document,
  pathname = typeof location !== 'undefined' ? location.pathname : ''
) {
  syncPathnameState(pathname);
  const primary = root.querySelector?.('[data-testid="primaryColumn"]');
  if (!primary) return false;
  const filterMode = getFollowFilterMode(pathname);
  const filterActive = Boolean(filterNonFollowers && filterMode);
  const rawCells = getFollowingCells(primary, filterActive, filterMode || 'following', root);
  const topByCell = new Map();
  const cells = rawCells
    .map((cell, domIdx) => {
      const top = getRowVisualTop(cell);
      topByCell.set(cell, top);
      return { cell, domIdx, top };
    })
    .sort((a, b) => {
      if (a.top !== null && b.top !== null && Math.abs(a.top - b.top) > 0.5) {
        return a.top - b.top;
      }
      return a.domIdx - b.domIdx;
    })
    .map((item) => item.cell);
  if (cells.length === 0) {
    if (code === 'KeyJ' && typeof window !== 'undefined' && typeof window.scrollBy === 'function') {
      window.scrollBy(0, 480);
    }
    return true;
  }

  const getCachedTop = (cell) => (topByCell.has(cell) ? topByCell.get(cell) : getRowVisualTop(cell));
  const currentCell =
    lastFocusedFilteredCell && cells.includes(lastFocusedFilteredCell)
      ? lastFocusedFilteredCell
      : findTargetUserCell(primary, root, pathname);
  const currentIdx = currentCell ? cells.indexOf(currentCell) : -1;
  const currentTop = currentCell ? getCachedTop(currentCell) : null;
  let nextIdx = 0;
  if (code === 'KeyJ') {
    if (currentIdx < 0) {
      if (lastFocusedRowTop !== null) {
        const byTop = cells.findIndex((c) => {
          const t = getCachedTop(c);
          return t !== null && t >= lastFocusedRowTop - 2;
        });
        if (byTop >= 0) {
          nextIdx = byTop;
        } else if (cells.some((c) => getCachedTop(c) !== null)) {
          nextIdx = cells.length - 1;
          if (typeof window !== 'undefined' && typeof window.scrollBy === 'function') {
            window.scrollBy(0, 480);
          }
        } else {
          nextIdx = 0;
        }
      } else {
        nextIdx = 0;
      }
    } else if (currentIdx < cells.length - 1) {
      nextIdx = currentIdx + 1;
      if (currentTop !== null) {
        const byPos = cells.findIndex((c, idx) => {
          if (idx <= currentIdx) return false;
          const t = getCachedTop(c);
          return t !== null && t > currentTop + 2;
        });
        if (byPos >= 0) nextIdx = byPos;
      }
    } else {
      nextIdx = cells.length - 1;
      if (typeof window !== 'undefined' && typeof window.scrollBy === 'function') {
        window.scrollBy(0, 480);
      }
    }
  } else if (code === 'KeyK') {
    if (currentIdx > 0) {
      nextIdx = currentIdx - 1;
      if (currentTop !== null) {
        for (let idx = currentIdx - 1; idx >= 0; idx--) {
          const t = getCachedTop(cells[idx]);
          if (t !== null && t < currentTop - 2) {
            nextIdx = idx;
            break;
          }
        }
      }
    } else if (currentIdx < 0 && lastFocusedRowTop !== null) {
      nextIdx = 0;
      for (let idx = cells.length - 1; idx >= 0; idx--) {
        const t = getCachedTop(cells[idx]);
        if (t !== null && t < lastFocusedRowTop - 2) {
          nextIdx = idx;
          break;
        }
      }
    } else {
      nextIdx = 0;
      if (typeof window !== 'undefined' && typeof window.scrollBy === 'function') {
        window.scrollBy(0, -320);
      }
    }
  } else {
    return false;
  }

  const targetCell = cells[nextIdx];
  if (!targetCell) return false;
  const row = getCellRow(targetCell);
  const focusTarget =
    targetCell.querySelector?.('a[role="link"][tabindex="-1"]') ||
    (row && row !== targetCell ? row.querySelector?.('[tabindex="0"], [tabindex="-1"]') : null) ||
    targetCell.querySelector?.('a[href]') ||
    targetCell;
  if (focusTarget === targetCell && !targetCell.getAttribute?.('tabindex')) {
    targetCell.setAttribute?.('tabindex', '-1');
  }
  lastFocusedFilteredCell = targetCell;
  lastFocusedCellLink = focusTarget;
  focusTarget.focus?.({ preventScroll: true });
  alignFollowingCellBelowHeader(targetCell, primary, root);
  const alignedTop = getRowVisualTop(targetCell);
  if (alignedTop !== null) {
    lastFocusedRowTop = alignedTop;
  }
  try {
    const desc = Object.getOwnPropertyDescriptor(root, 'activeElement');
    if (desc?.writable) {
      root.activeElement = focusTarget;
    }
  } catch (_) {}
  if (typeof document !== 'undefined' && root === document) {
    syncUiHints();
  } else {
    syncFollowingFilter(root, pathname);
    scheduleUiSync();
  }
  return true;
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
  pathname = typeof location !== 'undefined' ? location.pathname : '',
  precomputedTargetCell = undefined
) {
  syncPathnameState(pathname);

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
    const cell =
      precomputedTargetCell !== undefined
        ? precomputedTargetCell
        : findTargetUserCell(primary, root, pathname);
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
  const active = getDeepActiveElement(root);
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

const BASE_UI_HINTS_CSS = `
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
    [data-xfs-home-idx]::after { content: attr(data-xfs-home-idx); align-self: center; font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif; font-size: 12px; font-weight: 600; color: currentColor; margin-left: 6px; pointer-events: none; user-select: none; }
  `;

function ensureStyles() {
  if (typeof document === 'undefined' || !document.head) return;
  let style = document.getElementById('xfs-styles');
  if (!style) {
    style = document.createElement('style');
    style.id = 'xfs-styles';
    document.head.appendChild(style);
  }
  if (style.textContent !== BASE_UI_HINTS_CSS) {
    style.textContent = BASE_UI_HINTS_CSS;
  }
}

const FILTER_STYLES_CSS = `
    .xfs-filter-non-followers[data-xfs-filter-mode="following"] [data-testid="cellInnerDiv"]:has([data-testid="userFollowIndicator"], [data-xfs-mutual="true"]),
    .xfs-filter-non-followers[data-xfs-filter-mode="followers"] [data-testid="cellInnerDiv"]:has([data-testid$="-unfollow"], [data-testid$="-cancel"], [data-xfs-hidden="true"]),
    .xfs-filter-non-followers [data-testid="cellInnerDiv"][data-xfs-hidden="true"] {
      height: 0 !important;
      min-height: 0 !important;
      padding: 0 !important;
      margin: 0 !important;
      border: 0 !important;
      overflow: hidden !important;
      content-visibility: hidden !important;
      contain: layout style paint !important;
      pointer-events: none !important;
    }
    .xfs-filter-non-followers[data-xfs-filter-mode="following"] [data-testid="cellInnerDiv"]:has([data-testid="userFollowIndicator"], [data-xfs-mutual="true"]) > *,
    .xfs-filter-non-followers[data-xfs-filter-mode="following"] [data-testid="UserCell"]:has([data-testid="userFollowIndicator"]),
    .xfs-filter-non-followers[data-xfs-filter-mode="following"] [data-testid="UserCell"][data-xfs-mutual="true"],
    .xfs-filter-non-followers[data-xfs-filter-mode="followers"] [data-testid="cellInnerDiv"]:has([data-testid$="-unfollow"], [data-testid$="-cancel"], [data-xfs-hidden="true"]) > *,
    .xfs-filter-non-followers[data-xfs-filter-mode="followers"] [data-testid="UserCell"]:has([data-testid$="-unfollow"], [data-testid$="-cancel"]),
    .xfs-filter-non-followers [data-testid="cellInnerDiv"][data-xfs-hidden="true"] > *,
    .xfs-filter-non-followers [data-testid="UserCell"][data-xfs-hidden="true"] {
      display: none !important;
    }
    @supports not selector(:has(*)) {
      .xfs-filter-non-followers[data-xfs-filter-mode="following"] [data-testid="cellInnerDiv"].xfs-mutual-row,
      .xfs-filter-non-followers [data-testid="cellInnerDiv"][data-xfs-hidden="true"] {
        height: 0 !important;
        min-height: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
        border: 0 !important;
        overflow: hidden !important;
        content-visibility: hidden !important;
        contain: layout style paint !important;
        pointer-events: none !important;
      }
      .xfs-filter-non-followers[data-xfs-filter-mode="following"] [data-testid="cellInnerDiv"].xfs-mutual-row > *,
      .xfs-filter-non-followers[data-xfs-filter-mode="following"] [data-testid="UserCell"].xfs-mutual-cell,
      .xfs-filter-non-followers [data-testid="cellInnerDiv"][data-xfs-hidden="true"] > *,
      .xfs-filter-non-followers [data-testid="UserCell"][data-xfs-hidden="true"] {
        display: none !important;
      }
    }
    [data-testid="cellInnerDiv"][data-xfs-focused="true"],
    [data-testid="cellInnerDiv"][data-xfs-focused="true"] [data-testid="UserCell"],
    [data-testid="UserCell"][data-xfs-focused="true"] {
      background-color: rgba(29, 155, 240, 0.14) !important;
      box-shadow: inset 4px 0 0 #1d9bf0, inset 0 0 0 1px rgba(29, 155, 240, 0.5) !important;
      transition: background-color 0.12s ease, box-shadow 0.12s ease;
    }
    #xfs-following-filter-bar {
      display: flex;
      align-items: center;
      padding: 8px 16px;
      border-bottom: 1px solid rgba(128, 128, 128, 0.25);
    }
    #xfs-following-filter-bar[data-xfs-active="true"] {
      border-bottom: 2px solid #1d9bf0;
    }
    #xfs-non-follower-toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      gap: 10px;
      padding: 8px 14px;
      border-radius: 10px;
      border: 1px solid rgba(128, 128, 128, 0.4);
      background: rgba(128, 128, 128, 0.08);
      color: inherit;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 13px;
      font-weight: 700;
      line-height: 1.3;
      cursor: pointer;
      user-select: none;
      transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
    }
    #xfs-non-follower-toggle:focus-visible {
      outline: 2px solid #1d9bf0;
      outline-offset: 2px;
    }
    #xfs-non-follower-toggle::before {
      content: "OFF";
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 36px;
      padding: 2px 8px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.03em;
      background: rgba(128, 128, 128, 0.28);
      color: inherit;
      margin-right: 4px;
    }
    #xfs-non-follower-toggle[aria-pressed="true"] {
      border-color: #1d9bf0 !important;
      background: #1d9bf0 !important;
      color: #ffffff !important;
      box-shadow: 0 2px 10px rgba(29, 155, 240, 0.4);
    }
    #xfs-non-follower-toggle[aria-pressed="true"]::before {
      content: "ON";
      background: #ffffff;
      color: #1d9bf0;
    }
    #xfs-non-follower-toggle[data-xfs-hint="true"]::after {
      content: "⇧F";
      margin-left: auto;
      padding: 2px 7px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      background: rgba(128, 128, 128, 0.2);
      opacity: 0.95;
    }
    #xfs-non-follower-toggle[aria-pressed="true"][data-xfs-hint="true"]::after {
      background: rgba(255, 255, 255, 0.24);
      color: #ffffff;
    }
  `;

function ensureFilterStyles(root = document) {
  if (!root || !root.head || typeof root.createElement !== 'function') return;
  let style = root.getElementById?.('xfs-filter-styles');
  if (!style) {
    style = root.createElement('style');
    style.id = 'xfs-filter-styles';
    root.head.appendChild(style);
  }
  if (style.textContent !== FILTER_STYLES_CSS) {
    style.textContent = FILTER_STYLES_CSS;
  }
}

function formatFollowingFilterLabel(active, lang = detectUiLang(), mode = 'following') {
  const stateText = active ? 'ON' : 'OFF';
  if (mode === 'followers') {
    if (lang === 'ko') return `내가 팔로우 안 한 계정만 보기: ${stateText}`;
    if (lang === 'zh') return `仅看我未回关用户: ${stateText}`;
    if (lang === 'ja') return `未フォローバックのみ表示: ${stateText}`;
    return `Not followed back only: ${stateText}`;
  }
  if (lang === 'ko') return `맞팔 안 한 계정만 보기: ${stateText}`;
  if (lang === 'zh') return `仅看未回关用户: ${stateText}`;
  if (lang === 'ja') return `片思いのみ表示: ${stateText}`;
  return `Non-followers only: ${stateText}`;
}

const rootsWithFilterState = typeof WeakSet !== 'undefined' ? new WeakSet() : null;
const rootFilterEpochMap = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
const focusedCellByRoot = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
const cellAppliedFilterCache = typeof WeakMap !== 'undefined' ? new WeakMap() : null;

function peekCachedCellFilterState(cell, filterMode, normProfile) {
  if (!cell) return null;
  if (filterMode === 'following') {
    if (mutualCellCache?.has(cell)) {
      const res = Boolean(mutualCellCache.get(cell));
      return { filteredOut: res, stateKey: res ? 'm:1' : 'm:0' };
    }
    return null;
  }
  if (filterMode === 'followers') {
    const fc = followerCellCache?.get(cell);
    if (!fc) return null;
    if (
      fc.btn &&
      fc.btn.isConnected !== false &&
      (typeof cell.contains !== 'function' || cell.contains(fc.btn))
    ) {
      const curTid = fc.btn.getAttribute?.('data-testid') || '';
      if (curTid && curTid === fc.lastTestId) {
        return { filteredOut: Boolean(fc.result), stateKey: fc.stateKey };
      }
      return null;
    }
    if (fc.isSelf && fc.normProfile === normProfile) {
      return { filteredOut: true, stateKey: fc.stateKey };
    }
  }
  return null;
}

function scheduleFilterChunkContinuation(root, pathname, nextStartIndex) {
  if (typeof setTimeout !== 'function') return;
  if (typeof document !== 'undefined' && root === document && document.hidden) {
    pendingSyncOnVisible = true;
    return;
  }
  if (filterChunkTimerId !== null && typeof clearTimeout === 'function') {
    clearTimeout(filterChunkTimerId);
    filterChunkTimerId = null;
  }
  const gen = ++filterChunkGeneration;
  const delay = isUserActivelyInteracting() ? FILTER_INTERACTION_BACKOFF_MS : FILTER_CHUNK_YIELD_MS;
  filterChunkTimerId = setTimeout(() => {
    filterChunkTimerId = null;
    if (gen !== filterChunkGeneration) return;
    if (typeof document !== 'undefined' && root === document) {
      if (document.hidden) {
        pendingSyncOnVisible = true;
        return;
      }
      const curPath = typeof location !== 'undefined' ? location.pathname : pathname;
      if (curPath !== pathname || !getFollowFilterMode(curPath)) {
        return;
      }
      isApplyingDomSync = true;
      try {
        syncFollowingFilter(root, curPath, { background: true, startIndex: nextStartIndex });
      } finally {
        isApplyingDomSync = false;
        lastUiSyncFinishedAt = Date.now();
      }
    } else {
      syncFollowingFilter(root, pathname, {
        background: true,
        startIndex: nextStartIndex,
        allowChunk: true
      });
    }
  }, delay);
}

function syncFollowingFilter(
  root = document,
  pathname = typeof location !== 'undefined' ? location.pathname : '',
  options = null
) {
  syncPathnameState(pathname);
  if (!root || !root.documentElement) {
    return { total: 0, nonFollowers: 0, mutuals: 0, active: false };
  }
  const filterMode = getFollowFilterMode(pathname);
  const active = Boolean(filterMode && filterNonFollowers);
  const primary = root.querySelector?.('[data-testid="primaryColumn"]');

  if (!filterMode) {
    if (typeof document !== 'undefined' && root === document) {
      clearFilterChunkTimer();
    }
    const hasFilterAttrs =
      rootsWithFilterState?.has(root) ||
      root.documentElement.getAttribute?.('data-xfs-filter-mode') != null ||
      root.documentElement.getAttribute?.('data-xfs-filter-non-followers') != null ||
      primary?.getAttribute?.('data-xfs-filter-mode') != null ||
      primary?.getAttribute?.('data-xfs-filter-non-followers') != null;
    if (!hasFilterAttrs) {
      return { total: 0, nonFollowers: 0, mutuals: 0, active: false };
    }
    rootsWithFilterState?.delete(root);
    focusedCellByRoot?.delete(root);
    if (rootFilterEpochMap) {
      rootFilterEpochMap.set(root, (rootFilterEpochMap.get(root) || 0) + 1);
    }
    const barEl = root.getElementById?.('xfs-following-filter-bar');
    if (!barEl?.id || barEl.id === 'xfs-following-filter-bar') {
      barEl?.remove?.();
    }
    const filterStyleEl = root.getElementById?.('xfs-filter-styles');
    if (!filterStyleEl?.id || filterStyleEl.id === 'xfs-filter-styles') {
      filterStyleEl?.remove?.();
    }
    removeAttrIfPresent(root.documentElement, 'data-xfs-filter-non-followers');
    removeAttrIfPresent(root.documentElement, 'data-xfs-filter-mode');
    removeClassIfPresent(primary, 'xfs-filter-non-followers');
    removeAttrIfPresent(primary, 'data-xfs-filter-non-followers');
    removeAttrIfPresent(primary, 'data-xfs-filter-mode');
    for (const el of root.querySelectorAll?.('[data-xfs-mutual="true"], [data-xfs-hidden="true"], [data-xfs-focused="true"]') || []) {
      removeAttrIfPresent(el, 'data-xfs-mutual');
      removeAttrIfPresent(el, 'data-xfs-hidden');
      removeAttrIfPresent(el, 'data-xfs-focused');
      removeClassIfPresent(el, 'xfs-mutual-cell');
      removeClassIfPresent(el, 'xfs-mutual-row');
    }
    return { total: 0, nonFollowers: 0, mutuals: 0, active: false };
  }

  rootsWithFilterState?.add(root);
  const epoch = rootFilterEpochMap?.get(root) || 0;

  ensureFilterStyles(root);
  setAttrIfChanged(root.documentElement, 'data-xfs-filter-mode', filterMode);
  setAttrIfChanged(primary, 'data-xfs-filter-mode', filterMode);
  if (active) {
    setAttrIfChanged(root.documentElement, 'data-xfs-filter-non-followers', 'true');
    addClassIfMissing(primary, 'xfs-filter-non-followers');
    setAttrIfChanged(primary, 'data-xfs-filter-non-followers', 'true');
  } else {
    removeAttrIfPresent(root.documentElement, 'data-xfs-filter-non-followers');
    removeClassIfPresent(primary, 'xfs-filter-non-followers');
    removeAttrIfPresent(primary, 'data-xfs-filter-non-followers');
  }

  if (!primary) {
    if (typeof document !== 'undefined' && root === document) {
      clearFilterChunkTimer();
    }
    return { total: 0, nonFollowers: 0, mutuals: 0, active };
  }

  const normProfile =
    filterMode === 'followers'
      ? typeof options?.normProfile === 'string'
        ? options.normProfile
        : resolveNormalizedProfileHref(root)
      : '';

  if (active && lastFocusedCellLink) {
    const focusedCell =
      lastFocusedCellLink.closest?.('[data-testid="UserCell"]') ||
      lastFocusedCellLink.closest?.('[data-testid="cellInnerDiv"]')?.querySelector?.('[data-testid="UserCell"]');
    if (focusedCell && shouldFilterOutUserCell(focusedCell, filterMode, root, normProfile)) {
      if (lastFocusedRowTop === null) {
        const prevTop = getRowVisualTop(focusedCell);
        if (prevTop !== null) lastFocusedRowTop = prevTop;
      }
      lastFocusedCellLink = null;
    }
  }
  if (active && lastFocusedFilteredCell && shouldFilterOutUserCell(lastFocusedFilteredCell, filterMode, root, normProfile)) {
    if (lastFocusedRowTop === null) {
      const prevTop = getRowVisualTop(lastFocusedFilteredCell);
      if (prevTop !== null) lastFocusedRowTop = prevTop;
    }
    lastFocusedFilteredCell = null;
  }

  const activeCell =
    options && 'activeCell' in options
      ? options.activeCell
      : findTargetUserCell(primary, root, pathname, normProfile);

  const nextFocusedCell =
    activeCell && (!active || !shouldFilterOutUserCell(activeCell, filterMode, root, normProfile))
      ? activeCell
      : null;
  const nextFocusedRow = nextFocusedCell ? getCellRow(nextFocusedCell) : null;
  const prevFocused = focusedCellByRoot?.get(root) || null;
  if (prevFocused) {
    if (prevFocused.cell && prevFocused.cell !== nextFocusedCell) {
      removeAttrIfPresent(prevFocused.cell, 'data-xfs-focused');
    }
    if (prevFocused.row && prevFocused.row !== nextFocusedRow) {
      removeAttrIfPresent(prevFocused.row, 'data-xfs-focused');
    }
  }
  if (nextFocusedCell) {
    setAttrIfChanged(nextFocusedCell, 'data-xfs-focused', 'true');
    if (nextFocusedRow) {
      setAttrIfChanged(nextFocusedRow, 'data-xfs-focused', 'true');
    }
    focusedCellByRoot?.set(root, { cell: nextFocusedCell, row: nextFocusedRow });
  } else {
    focusedCellByRoot?.delete(root);
  }

  const cells = Array.from(primary.querySelectorAll?.('[data-testid="UserCell"]') || []);
  const isBackground = Boolean(options?.background);
  const canChunk = Boolean(
    (typeof document !== 'undefined' && root === document && typeof setTimeout === 'function') ||
      options?.allowChunk
  );
  const workBudget = isBackground ? BG_CELL_WORK_BUDGET : DIRECT_CELL_WORK_BUDGET;
  const startIndex = typeof options?.startIndex === 'number' ? options.startIndex : 0;
  const sliceStartMs = canChunk && isBackground ? nowPerfMs() : 0;

  let mutuals = 0;
  let dirtyProcessed = 0;
  let nextChunkStartIndex = -1;

  for (let idx = 0; idx < cells.length; idx++) {
    const cell = cells[idx];
    const applied = cellAppliedFilterCache?.get(cell);
    const peek = peekCachedCellFilterState(cell, filterMode, normProfile);

    if (
      peek &&
      applied &&
      applied.epoch === epoch &&
      applied.mode === filterMode &&
      applied.active === active &&
      applied.stateKey === peek.stateKey
    ) {
      if (peek.filteredOut) mutuals++;
      continue;
    }

    if (idx < startIndex) {
      if ((peek ? peek.filteredOut : applied?.filteredOut) === true) {
        mutuals++;
      }
      continue;
    }

    if (canChunk && nextChunkStartIndex !== -1) {
      if ((peek ? peek.filteredOut : applied?.filteredOut) === true) {
        mutuals++;
      }
      continue;
    }

    if (
      canChunk &&
      (dirtyProcessed >= workBudget ||
        (isBackground && dirtyProcessed >= 8 && nowPerfMs() - sliceStartMs >= BG_CELL_TIME_BUDGET_MS))
    ) {
      nextChunkStartIndex = idx;
      if ((peek ? peek.filteredOut : applied?.filteredOut) === true) {
        mutuals++;
      }
      continue;
    }

    dirtyProcessed++;
    const filteredOut = peek
      ? peek.filteredOut
      : shouldFilterOutUserCell(cell, filterMode, root, normProfile);
    const afterPeek = peek || peekCachedCellFilterState(cell, filterMode, normProfile);
    const row = getCellRow(cell);

    if (!applied && cell !== nextFocusedCell) {
      removeAttrIfPresent(cell, 'data-xfs-focused');
      removeAttrIfPresent(row, 'data-xfs-focused');
    }

    if (filterMode === 'following' && filteredOut) {
      setAttrIfChanged(cell, 'data-xfs-mutual', 'true');
      addClassIfMissing(cell, 'xfs-mutual-cell');
      addClassIfMissing(row, 'xfs-mutual-row');
    } else {
      removeAttrIfPresent(cell, 'data-xfs-mutual');
      removeClassIfPresent(cell, 'xfs-mutual-cell');
      removeClassIfPresent(row, 'xfs-mutual-row');
    }

    if (filteredOut) {
      mutuals++;
      if (active) {
        setAttrIfChanged(cell, 'data-xfs-hidden', 'true');
        setAttrIfChanged(row, 'data-xfs-hidden', 'true');
      } else {
        removeAttrIfPresent(cell, 'data-xfs-hidden');
        removeAttrIfPresent(row, 'data-xfs-hidden');
      }
    } else {
      removeAttrIfPresent(cell, 'data-xfs-hidden');
      removeAttrIfPresent(row, 'data-xfs-hidden');
    }

    if (afterPeek?.stateKey) {
      cellAppliedFilterCache?.set(cell, {
        epoch,
        mode: filterMode,
        active,
        stateKey: afterPeek.stateKey,
        filteredOut
      });
    } else {
      cellAppliedFilterCache?.delete(cell);
    }
  }

  if (canChunk) {
    if (nextChunkStartIndex >= 0) {
      scheduleFilterChunkContinuation(root, pathname, nextChunkStartIndex);
    } else {
      clearFilterChunkTimer();
    }
  }

  const total = cells.length;
  const nonFollowers = total - mutuals;
  const labelText = formatFollowingFilterLabel(active, detectUiLang(root), filterMode);

  if (typeof root.createElement === 'function' && (primary.appendChild || primary.insertBefore)) {
    let bar = root.getElementById?.('xfs-following-filter-bar') || primary.querySelector?.('#xfs-following-filter-bar');
    if (bar && bar.id && bar.id !== 'xfs-following-filter-bar') {
      bar = primary.querySelector?.('#xfs-following-filter-bar') || null;
    }
    let btn = root.getElementById?.('xfs-non-follower-toggle') || bar?.querySelector?.('#xfs-non-follower-toggle');
    if (btn && btn.id && btn.id !== 'xfs-non-follower-toggle') {
      btn = bar?.querySelector?.('#xfs-non-follower-toggle') || null;
    }
    if (!bar) {
      bar = root.createElement('div');
      bar.id = 'xfs-following-filter-bar';
      btn = root.createElement('button');
      btn.id = 'xfs-non-follower-toggle';
      btn.type = 'button';
      btn.addEventListener?.('click', () => {
        setFilterNonFollowers(!filterNonFollowers, true);
      });
      bar.appendChild?.(btn);
    }
    const tablist = primary.querySelector?.('[role="tablist"]');
    const navAnchor = tablist?.closest?.('nav[role="navigation"], nav')?.parentNode || tablist;
    if (navAnchor?.parentNode?.insertBefore) {
      if (bar.parentNode !== navAnchor.parentNode || bar.previousSibling !== navAnchor) {
        navAnchor.parentNode.insertBefore(bar, navAnchor.nextSibling || null);
      }
    } else if (!bar.parentNode) {
      if (primary.insertBefore) {
        primary.insertBefore(bar, primary.firstChild || null);
      } else {
        primary.appendChild?.(bar);
      }
    }
    const activeStr = String(active);
    setAttrIfChanged(bar, 'data-xfs-active', activeStr);
    setAttrIfChanged(bar, 'data-xfs-filter-mode', filterMode);
    if (btn) {
      const hintStr = String(Boolean(showUiHints));
      setAttrIfChanged(btn, 'aria-pressed', activeStr);
      setAttrIfChanged(btn, 'data-xfs-hint', hintStr);
      if (btn.textContent !== labelText) {
        btn.textContent = labelText;
      }
    }
  }

  return { total, nonFollowers, mutuals, active };
}

const COMPACT_PILL_STYLES_CSS = `
    /* Shared: hide the 3 overlapping profile avatars inside the floating "게시됨" pill */
    [data-xfs-pill-avatars="true"],
    html[data-xfs-compact-pill] button:has([data-testid="pillLabel"]) > div > div:not([data-testid="pillLabel"]),
    html[data-xfs-compact-pill] [role="button"]:has([data-testid="pillLabel"]) > div > div:not([data-testid="pillLabel"]) {
      display: none !important;
    }
    /* Shared: render the localized label via CSS so React-owned text nodes stay untouched */
    [data-testid="pillLabel"][data-xfs-label] > span {
      display: none !important;
    }
    [data-testid="pillLabel"][data-xfs-label]::before {
      content: attr(data-xfs-label);
    }

    /* Design 1: Top-right translucent glass mini-capsule */
    [data-xfs-pill-align="1"],
    html[data-xfs-compact-pill="1"] div:has(> [role="status"] [data-testid="pillLabel"]) {
      align-items: flex-end !important;
      padding-right: 68px !important;
    }
    [data-xfs-pill-status="1"],
    html[data-xfs-compact-pill="1"] [role="status"]:has([data-testid="pillLabel"]) {
      margin-top: 6px !important;
      margin-bottom: 0 !important;
    }
    [data-xfs-pill-btn="1"],
    html[data-xfs-compact-pill="1"] button:has([data-testid="pillLabel"]),
    html[data-xfs-compact-pill="1"] [role="button"]:has([data-testid="pillLabel"]) {
      background-color: rgba(15, 20, 25, 0.72) !important;
      backdrop-filter: blur(8px) !important;
      -webkit-backdrop-filter: blur(8px) !important;
      border: 1px solid rgba(29, 155, 240, 0.55) !important;
      border-radius: 9999px !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35) !important;
      padding: 2px 10px !important;
      min-height: 22px !important;
      height: 22px !important;
    }
    [data-xfs-pill-btn="1"]:hover,
    html[data-xfs-compact-pill="1"] button:has([data-testid="pillLabel"]):hover,
    html[data-xfs-compact-pill="1"] [role="button"]:has([data-testid="pillLabel"]):hover {
      background-color: rgba(29, 155, 240, 0.88) !important;
    }
    [data-xfs-pill-btn="1"] svg,
    html[data-xfs-compact-pill="1"] button:has([data-testid="pillLabel"]) svg,
    html[data-xfs-compact-pill="1"] [role="button"]:has([data-testid="pillLabel"]) svg {
      width: 12px !important;
      height: 12px !important;
      color: #1d9bf0 !important;
      fill: currentColor !important;
      margin-right: 3px !important;
    }
    [data-xfs-pill-btn="1"]:hover svg,
    [data-xfs-pill-btn="1"]:hover [data-testid="pillLabel"]::after,
    html[data-xfs-compact-pill="1"] button:has([data-testid="pillLabel"]):hover svg,
    html[data-xfs-compact-pill="1"] button:has([data-testid="pillLabel"]):hover [data-testid="pillLabel"]::after {
      color: #ffffff !important;
    }
    [data-xfs-pill-btn="1"] [data-testid="pillLabel"],
    html[data-xfs-compact-pill="1"] button:has([data-testid="pillLabel"]) [data-testid="pillLabel"] {
      font-size: 11.5px !important;
      line-height: 15px !important;
      color: #e7e9ea !important;
    }
    [data-xfs-pill-btn="1"] [data-testid="pillLabel"]::after,
    html[data-xfs-compact-pill="1"] button:has([data-testid="pillLabel"]) [data-testid="pillLabel"]::after {
      font-size: 11.5px !important;
      margin-left: 4px !important;
      color: #1d9bf0 !important;
    }

    /* Design 2: Ultra-slim top-docked tab flush beneath sticky tab bar */
    [data-xfs-pill-align="2"],
    html[data-xfs-compact-pill="2"] div:has(> [role="status"] [data-testid="pillLabel"]) {
      align-items: center !important;
      padding-right: 0 !important;
    }
    [data-xfs-pill-status="2"],
    html[data-xfs-compact-pill="2"] [role="status"]:has([data-testid="pillLabel"]) {
      margin-top: 0px !important;
      margin-bottom: 0 !important;
    }
    [data-xfs-pill-btn="2"],
    html[data-xfs-compact-pill="2"] button:has([data-testid="pillLabel"]),
    html[data-xfs-compact-pill="2"] [role="button"]:has([data-testid="pillLabel"]) {
      background-color: rgba(29, 155, 240, 0.18) !important;
      backdrop-filter: blur(6px) !important;
      -webkit-backdrop-filter: blur(6px) !important;
      border: 1px solid rgba(29, 155, 240, 0.45) !important;
      border-top: none !important;
      border-radius: 0 0 10px 10px !important;
      box-shadow: none !important;
      padding: 1px 12px 2px !important;
      min-height: 19px !important;
      height: 19px !important;
    }
    [data-xfs-pill-btn="2"]:hover,
    html[data-xfs-compact-pill="2"] button:has([data-testid="pillLabel"]):hover,
    html[data-xfs-compact-pill="2"] [role="button"]:has([data-testid="pillLabel"]):hover {
      background-color: rgba(29, 155, 240, 0.35) !important;
    }
    [data-xfs-pill-btn="2"] svg,
    html[data-xfs-compact-pill="2"] button:has([data-testid="pillLabel"]) svg,
    html[data-xfs-compact-pill="2"] [role="button"]:has([data-testid="pillLabel"]) svg {
      width: 11px !important;
      height: 11px !important;
      color: #1d9bf0 !important;
      fill: currentColor !important;
      margin-right: 3px !important;
    }
    [data-xfs-pill-btn="2"] [data-testid="pillLabel"],
    html[data-xfs-compact-pill="2"] button:has([data-testid="pillLabel"]) [data-testid="pillLabel"] {
      font-size: 11px !important;
      line-height: 14px !important;
      color: #1d9bf0 !important;
      font-weight: 600 !important;
    }
    [data-xfs-pill-btn="2"] [data-testid="pillLabel"]::after,
    html[data-xfs-compact-pill="2"] button:has([data-testid="pillLabel"]) [data-testid="pillLabel"]::after {
      font-size: 11px !important;
      margin-left: 3px !important;
      color: #1d9bf0 !important;
    }

    /* Design 3: Top-right micro icon badge ("↑ .") expanding label on hover */
    [data-xfs-pill-align="3"],
    html[data-xfs-compact-pill="3"] div:has(> [role="status"] [data-testid="pillLabel"]) {
      align-items: flex-end !important;
      padding-right: 68px !important;
    }
    [data-xfs-pill-status="3"],
    html[data-xfs-compact-pill="3"] [role="status"]:has([data-testid="pillLabel"]) {
      margin-top: 6px !important;
      margin-bottom: 0 !important;
    }
    [data-xfs-pill-btn="3"],
    html[data-xfs-compact-pill="3"] button:has([data-testid="pillLabel"]),
    html[data-xfs-compact-pill="3"] [role="button"]:has([data-testid="pillLabel"]) {
      background-color: rgba(29, 155, 240, 0.20) !important;
      backdrop-filter: blur(8px) !important;
      -webkit-backdrop-filter: blur(8px) !important;
      border: 1px solid rgba(29, 155, 240, 0.55) !important;
      border-radius: 9999px !important;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25) !important;
      padding: 2px 8px !important;
      min-height: 22px !important;
      height: 22px !important;
      min-width: 0 !important;
    }
    [data-xfs-pill-btn="3"] svg,
    html[data-xfs-compact-pill="3"] button:has([data-testid="pillLabel"]) svg,
    html[data-xfs-compact-pill="3"] [role="button"]:has([data-testid="pillLabel"]) svg {
      width: 12px !important;
      height: 12px !important;
      color: #1d9bf0 !important;
      fill: currentColor !important;
      margin: 0 !important;
    }
    [data-xfs-pill-btn="3"]:hover svg,
    html[data-xfs-compact-pill="3"] button:has([data-testid="pillLabel"]):hover svg,
    html[data-xfs-compact-pill="3"] [role="button"]:has([data-testid="pillLabel"]):hover svg {
      margin-right: 3px !important;
    }
    [data-xfs-pill-btn="3"] [data-testid="pillLabel"],
    html[data-xfs-compact-pill="3"] button:has([data-testid="pillLabel"]) [data-testid="pillLabel"] {
      font-size: 11.5px !important;
      line-height: 15px !important;
      color: #1d9bf0 !important;
    }
    [data-xfs-pill-btn="3"]:not(:hover) [data-testid="pillLabel"]::before,
    html[data-xfs-compact-pill="3"] button:has([data-testid="pillLabel"]):not(:hover) [data-testid="pillLabel"]::before,
    html[data-xfs-compact-pill="3"] [role="button"]:has([data-testid="pillLabel"]):not(:hover) [data-testid="pillLabel"]::before {
      display: none !important;
    }
    [data-xfs-pill-btn="3"] [data-testid="pillLabel"]::after,
    html[data-xfs-compact-pill="3"] button:has([data-testid="pillLabel"]) [data-testid="pillLabel"]::after {
      content: ".";
      font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 11.5px !important;
      font-weight: 700 !important;
      margin-left: 3px !important;
      color: #1d9bf0 !important;
      pointer-events: none;
      user-select: none;
    }
  `;

function ensureCompactPillStyles(root = document) {
  if (!root || !root.head || typeof root.createElement !== 'function') return;
  let style = root.getElementById?.('xfs-pill-styles');
  if (style && style.id && style.id !== 'xfs-pill-styles') {
    style = null;
  }
  if (!style) {
    style = root.createElement('style');
    style.id = 'xfs-pill-styles';
    root.head.appendChild(style);
  }
  if (style.textContent !== COMPACT_PILL_STYLES_CSS) {
    style.textContent = COMPACT_PILL_STYLES_CSS;
  }
}

function formatCompactPillLabel(lang = detectUiLang()) {
  if (lang === 'ko') return '게시됨';
  if (lang === 'zh') return '已发帖';
  if (lang === 'ja') return 'ポスト済';
  return 'Posted';
}

function clearCompactPillNodeAttributes(root) {
  for (const el of root.querySelectorAll?.(
    '[data-xfs-pill-align], [data-xfs-pill-status], [data-xfs-pill-btn], [data-xfs-pill-avatars], [data-xfs-label]'
  ) || []) {
    removeAttrIfPresent(el, 'data-xfs-pill-align');
    removeAttrIfPresent(el, 'data-xfs-pill-status');
    removeAttrIfPresent(el, 'data-xfs-pill-btn');
    removeAttrIfPresent(el, 'data-xfs-pill-avatars');
    removeAttrIfPresent(el, 'data-xfs-label');
  }
}

const rootsWithPillState = typeof WeakSet !== 'undefined' ? new WeakSet() : null;

function syncCompactPill(
  root = document,
  pathname = typeof location !== 'undefined' ? location.pathname : ''
) {
  if (!root || !root.documentElement) {
    return { active: false, design: compactPillDesign };
  }
  const active = isCompactPillActive(pathname);
  if (!active) {
    const hasPillState =
      rootsWithPillState?.has(root) ||
      root.documentElement.getAttribute?.('data-xfs-compact-pill') != null;
    if (!hasPillState) {
      return { active: false, design: compactPillDesign };
    }
    rootsWithPillState?.delete(root);
    const pillStyleEl = root.getElementById?.('xfs-pill-styles');
    if (!pillStyleEl?.id || pillStyleEl.id === 'xfs-pill-styles') {
      pillStyleEl?.remove?.();
    }
    removeAttrIfPresent(root.documentElement, 'data-xfs-compact-pill');
    clearCompactPillNodeAttributes(root);
    return { active: false, design: compactPillDesign };
  }
  rootsWithPillState?.add(root);
  const pills = Array.from(root.querySelectorAll?.('[data-testid="pillLabel"]') || []);
  ensureCompactPillStyles(root);
  const design = normalizeCompactPillDesign(compactPillDesign);
  setAttrIfChanged(root.documentElement, 'data-xfs-compact-pill', design);
  const localized = formatCompactPillLabel(detectUiLang(root));
  for (const pill of pills) {
    const btn = pill.closest?.('button, [role="button"]');
    const statusDiv = pill.closest?.('[role="status"]') || btn?.parentElement;
    const alignWrap = statusDiv?.parentElement;
    setAttrIfChanged(btn, 'data-xfs-pill-btn', design);
    setAttrIfChanged(statusDiv, 'data-xfs-pill-status', design);
    setAttrIfChanged(alignWrap, 'data-xfs-pill-align', design);
    const innerRow = pill.parentElement;
    if (innerRow?.children) {
      for (const sibling of Array.from(innerRow.children)) {
        if (sibling !== pill && sibling.tagName?.toLowerCase?.() !== 'svg') {
          setAttrIfChanged(sibling, 'data-xfs-pill-avatars', 'true');
        }
      }
    }
    setAttrIfChanged(pill, 'data-xfs-label', localized);
  }
  return { active: true, design };
}

let homeTabHintEls = [];

function syncHomeTabHints() {
  const onHome = showUiHints && /^\/home\/?$/.test(location.pathname);
  if (!onHome) {
    if (homeTabHintEls.length > 0) {
      for (const el of homeTabHintEls) {
        removeAttrIfPresent(el, 'data-xfs-home-idx');
      }
      homeTabHintEls = [];
    }
    return;
  }
  const tabs = document.querySelectorAll?.('[data-testid="primaryColumn"] [role="tablist"] [role="tab"]') || [];
  const nextEls = [];
  for (let i = 0; i < Math.min(tabs.length, 9); i++) {
    const walker = document.createTreeWalker(tabs[i], NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.nodeValue || '').trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
    });
    const label = walker.nextNode()?.parentElement;
    if (label) {
      setAttrIfChanged(label, 'data-xfs-home-idx', String(i + 1));
      nextEls.push(label);
    }
  }
  for (const prev of homeTabHintEls) {
    if (!nextEls.includes(prev)) {
      removeAttrIfPresent(prev, 'data-xfs-home-idx');
    }
  }
  homeTabHintEls = nextEls;
}

const docTargetBtnMap = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
const legacyCleanedDocs = typeof WeakSet !== 'undefined' ? new WeakSet() : null;
let lastThemeSampleDoc = null;
let lastThemeSampleAt = 0;
let cachedNavColor = '';
let cachedMutedColor = '';

function syncUiHints(options = null) {
  if (typeof document === 'undefined' || !document.documentElement) return;
  const pathname = typeof location !== 'undefined' ? location.pathname : '';
  syncPathnameState(pathname);

  // Phase 1: Read layout & computed styles BEFORE mutating any DOM attributes/styles
  const primary =
    typeof document.querySelector === 'function'
      ? document.querySelector('[data-testid="primaryColumn"]')
      : null;
  const filterMode = getFollowFilterMode(pathname);
  const filterActive = Boolean(filterMode && filterNonFollowers);
  const normProfile =
    filterMode === 'followers' ? resolveNormalizedProfileHref(document) : '';

  if (filterActive && primary) {
    if (lastFocusedCellLink) {
      const focusedCell =
        lastFocusedCellLink.closest?.('[data-testid="UserCell"]') ||
        lastFocusedCellLink.closest?.('[data-testid="cellInnerDiv"]')?.querySelector?.('[data-testid="UserCell"]');
      if (focusedCell && shouldFilterOutUserCell(focusedCell, filterMode, document, normProfile)) {
        if (lastFocusedRowTop === null) {
          const prevTop = getRowVisualTop(focusedCell);
          if (prevTop !== null) lastFocusedRowTop = prevTop;
        }
        lastFocusedCellLink = null;
      }
    }
    if (
      lastFocusedFilteredCell &&
      shouldFilterOutUserCell(lastFocusedFilteredCell, filterMode, document, normProfile)
    ) {
      if (lastFocusedRowTop === null) {
        const prevTop = getRowVisualTop(lastFocusedFilteredCell);
        if (prevTop !== null) lastFocusedRowTop = prevTop;
      }
      lastFocusedFilteredCell = null;
    }
  }

  let precomputedActiveCell;
  let activeFollowBtn = null;
  if (isFollowListPage(pathname) && primary) {
    precomputedActiveCell = findTargetUserCell(primary, document, pathname, normProfile);
    if (showUiHints && typeof document.querySelector === 'function') {
      activeFollowBtn = findProfileFollowButton(document, pathname, precomputedActiveCell);
    }
  } else if (showUiHints && typeof document.querySelector === 'function') {
    activeFollowBtn = findProfileFollowButton(document, pathname);
  }

  const now = Date.now();
  if (
    showUiHints &&
    typeof getComputedStyle === 'function' &&
    typeof document.querySelector === 'function' &&
    (lastThemeSampleDoc !== document ||
      !cachedNavColor ||
      !cachedMutedColor ||
      now - lastThemeSampleAt >= THEME_COLOR_CACHE_MS)
  ) {
    lastThemeSampleDoc = document;
    lastThemeSampleAt = now;
    const navSample = document.querySelector('header nav a span, header nav a svg');
    if (navSample) {
      const navColor = getComputedStyle(navSample).color;
      if (navColor) cachedNavColor = navColor;
    }
    const mutedSample = document.querySelector(
      '[data-testid="SearchBox_Search_Input_label"] svg, article [role="group"] button svg'
    );
    if (mutedSample) {
      const mutedColor = getComputedStyle(mutedSample).color;
      if (mutedColor) cachedMutedColor = mutedColor;
    }
  }

  // Phase 2: Write DOM attributes & CSS variables (guarded so steady-state performs 0 mutations)
  isApplyingDomSync = true;
  try {
    if (!legacyCleanedDocs?.has(document)) {
      legacyCleanedDocs?.add(document);
      const hudEl = document.getElementById?.('xfs-hud');
      if (hudEl && (!hudEl.id || hudEl.id === 'xfs-hud')) {
        hudEl.remove?.();
      }
      for (const badge of document.querySelectorAll?.('.xfs-key-badge') || []) {
        badge.remove?.();
      }
    }

    const filterOpts = {
      background: Boolean(options?.background),
      normProfile
    };
    if (precomputedActiveCell !== undefined) {
      filterOpts.activeCell = precomputedActiveCell;
    }
    syncFollowingFilter(document, pathname, filterOpts);
    syncCompactPill(document, pathname);
    syncHomeTabHints();

    if (!showUiHints) {
      if (docTargetBtnMap?.has(document)) {
        const prevBtn = docTargetBtnMap.get(document);
        if (prevBtn) removeAttrIfPresent(prevBtn, 'data-xfs-target');
        docTargetBtnMap.set(document, null);
      } else {
        for (const prev of document.querySelectorAll?.('[data-xfs-target="true"]') || []) {
          removeAttrIfPresent(prev, 'data-xfs-target');
        }
        docTargetBtnMap?.set(document, null);
      }
      const stylesEl = document.getElementById?.('xfs-styles');
      if (!stylesEl?.id || stylesEl.id === 'xfs-styles') {
        stylesEl?.remove?.();
      }
      return;
    }

    ensureStyles();
    const keyText = formatShortcutLabel(shortcut).toLowerCase();
    setRootCssVarIfChanged(document.documentElement, '--xfs-follow-key', JSON.stringify(keyText));

    if (docTargetBtnMap?.has(document)) {
      const prevBtn = docTargetBtnMap.get(document);
      if (prevBtn && prevBtn !== activeFollowBtn) {
        removeAttrIfPresent(prevBtn, 'data-xfs-target');
      }
    } else {
      for (const prev of document.querySelectorAll?.('[data-xfs-target="true"]') || []) {
        if (prev !== activeFollowBtn) {
          removeAttrIfPresent(prev, 'data-xfs-target');
        }
      }
    }
    if (activeFollowBtn) {
      setAttrIfChanged(activeFollowBtn, 'data-xfs-target', 'true');
    }
    docTargetBtnMap?.set(document, activeFollowBtn || null);

    if (cachedNavColor) {
      setRootCssVarIfChanged(document.documentElement, '--xfs-nav-color', cachedNavColor);
    }
    if (cachedMutedColor) {
      setRootCssVarIfChanged(document.documentElement, '--xfs-muted-color', cachedMutedColor);
    }
  } finally {
    isApplyingDomSync = false;
    lastUiSyncFinishedAt = Date.now();
  }
}

let uiSyncScheduled = false;
let uiSyncRafId = null;
let uiSyncTimerId = null;
function scheduleUiSync() {
  if (typeof requestAnimationFrame !== 'function' || uiSyncScheduled) return;
  clearBgUiSyncTimer();
  uiSyncScheduled = true;
  const runSync = () => {
    if (!uiSyncScheduled) return;
    uiSyncScheduled = false;
    if (uiSyncRafId !== null && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(uiSyncRafId);
    }
    if (uiSyncTimerId !== null && typeof clearTimeout === 'function') {
      clearTimeout(uiSyncTimerId);
    }
    uiSyncRafId = null;
    uiSyncTimerId = null;
    syncUiHints();
  };
  uiSyncRafId = requestAnimationFrame(runSync);
  if (typeof setTimeout === 'function') {
    uiSyncTimerId = setTimeout(runSync, 32);
  }
}

function scheduleBackgroundUiSync() {
  if (uiSyncScheduled || bgUiSyncTimerId !== null) return;
  if (typeof document !== 'undefined' && document.hidden) {
    pendingSyncOnVisible = true;
    return;
  }
  if (typeof setTimeout !== 'function') return;
  const now = Date.now();
  const minInterval = isFollowingFilterActive()
    ? BG_UI_SYNC_FILTER_INTERVAL_MS
    : BG_UI_SYNC_MIN_INTERVAL_MS;
  const elapsed = now - lastUiSyncFinishedAt;
  let delay = elapsed >= minInterval ? 24 : Math.max(24, minInterval - elapsed);
  if (isUserActivelyInteracting()) {
    delay = Math.max(delay, FILTER_INTERACTION_BACKOFF_MS);
  }
  bgUiSyncTimerId = setTimeout(() => {
    bgUiSyncTimerId = null;
    if (typeof document !== 'undefined' && document.hidden) {
      pendingSyncOnVisible = true;
      return;
    }
    if (uiSyncScheduled) return;
    syncUiHints({ background: true });
  }, delay);
}

function restoreCellFocusIfNeeded() {
  clearRestoreFocusTimers();
  if (!lastFocusedCellLink || !isFollowListPage()) return;
  if (typeof setTimeout !== 'function') return;
  for (const delay of [50, 150]) {
    const timerId = setTimeout(() => {
      restoreFocusTimerIds = restoreFocusTimerIds.filter((id) => id !== timerId);
      if (Date.now() - lastUserPointerAt < 300) {
        return;
      }
      const active = document.activeElement;
      if (
        isEditable(active) ||
        nodeTouchesTestIdsOrSelector(active, XCHAT_HOST_TESTIDS, XCHAT_HOST_SELECTOR) ||
        isInsideXChatContext(null, document) ||
        isInsideModalDialog(null, document) ||
        document.querySelector?.(
          '[data-testid="Dropdown"], [data-testid="HoverCard"], [data-testid="confirmationSheetConfirm"], [data-testid="confirmationSheetCancel"]'
        )
      ) {
        scheduleUiSync();
        return;
      }
      const inCell =
        active?.closest?.('[data-testid="UserCell"]') ||
        active?.closest?.('[data-testid="cellInnerDiv"]')?.querySelector?.('[data-testid="UserCell"]');
      if (!active || active === document.body || !inCell) {
        if (lastFocusedCellLink?.isConnected) {
          const mode = getFollowFilterMode();
          const cell =
            lastFocusedCellLink.closest?.('[data-testid="UserCell"]') ||
            lastFocusedCellLink.closest?.('[data-testid="cellInnerDiv"]')?.querySelector?.('[data-testid="UserCell"]');
          if (!isFollowingFilterActive() || !cell || !shouldFilterOutUserCell(cell, mode, document)) {
            lastFocusedCellLink.focus?.({ preventScroll: true });
          }
        }
      }
      scheduleUiSync();
    }, delay);
    restoreFocusTimerIds.push(timerId);
  }
}

let lastModalDismissAt = 0;
let pendingComposingEnterSend = null;

function handleXNativeShortcutIfMatched(e, root = document, forceDispatch = false) {
  const code = resolveKeyCode(e);
  if (!code) return false;

  // 1. Inside editable fields: only support Cmd+Enter / Ctrl+Enter (Send post) when IME is composing
  if (isEditableEvent(e, root)) {
    clearPendingPrefix();
    if ((e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && code === 'Enter') {
      const spec = codeToNativeSpec('Enter', false);
      if (pendingComposingEnterSend) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return true;
      }
      if (!forceDispatch && isAlreadyNativeAsciiEvent(e, spec)) {
        return false;
      }
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const modifiers = { ctrlKey: e.ctrlKey, metaKey: e.metaKey };
      const composing = e.isComposing || e.key === 'Process' || e.keyCode === 229 || e.which === 229;
      const target = getEventTarget(e, root);
      if (composing && typeof target?.addEventListener === 'function') {
        // Windows IMEs commit the last composed syllable only after this keydown (on compositionend),
        // and Chromium on Windows also fires a follow-up native keydown(Enter, keyCode: 13) right after
        // compositionend before Draft.js (20ms timer) + React useEffect (TextChangeEffect) sync the text.
        // Swallow any follow-up Enter keydowns while pending, and dispatch once 50ms after compositionend.
        let sent = false;
        let fallbackTimer = null;
        const send = () => {
          if (sent) return;
          sent = true;
          pendingComposingEnterSend = null;
          clearTimeout(fallbackTimer);
          target.removeEventListener?.('compositionend', onEnd, true);
          dispatchNativeSpec(spec, modifiers, root);
        };
        const onEnd = () => {
          clearTimeout(fallbackTimer);
          fallbackTimer = setTimeout(send, 50);
        };
        pendingComposingEnterSend = send;
        target.addEventListener('compositionend', onEnd, true);
        fallbackTimer = setTimeout(send, 300);
        return true;
      }
      dispatchNativeSpec(spec, modifiers, root);
      return true;
    }
    return false;
  }

  // 1b. Inside floating Chat drawer / Chat modal overlays (e.g. XChat 4-digit PIN screen, chat messages):
  // never hijack keys for background timeline or navigation shortcuts.
  if (isInsideXChatOverlay(e, root)) {
    clearPendingPrefix();
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
    const tabLink = findFollowListTabLink(code, root) || findHomeTabLink(code, root);
    if (tabLink) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      tabLink.click();
      scheduleUiSync();
      if (typeof requestAnimationFrame === 'function' && typeof setTimeout === 'function') {
        setTimeout(scheduleUiSync, 80);
      }
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

  // On /i/chat, /messages, or inside XChat embeds: never synthesize single-key tweet/compose shortcuts
  // (such as Korean 'ㅜ' -> 'n' opening Compose Post when chat message history or PIN UI is focused).
  if (isInsideXChatContext(e, root)) {
    return false;
  }

  const inModalDialog = isInsideModalDialog(e, root);

  // 7b. Plain digits 1-9 on /home switch top tabs (unless a modal dialog is focused)
  if (!inModalDialog && /^Digit[1-9]$/.test(code || '')) {
    const homeTab = findHomeTabLink(code, root);
    if (homeTab) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      homeTab.click();
      scheduleUiSync();
      return true;
    }
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

  // 8b. On /following, /followers, /verified_followers: step between cells on J / K and align selected cell directly below sticky header + filter bar
  if (!inModalDialog && (code === 'KeyJ' || code === 'KeyK') && isFollowFilterPage()) {
    if (stepFollowingCell(code, root)) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return true;
    }
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
  if (!isEditableEvent(e, root)) {
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

    const inChat = isInsideXChatContext(e, root);
    const inModal = isInsideModalDialog(e, root);

    // 2. Check the Follow / Unfollow / Follow back shortcut (unless 'g' prefix is active for 'g f' = Drafts!)
    const activePrefix = getActivePrefix();
    const isGfDraftsSequence = activePrefix === 'g' && resolveKeyCode(e) === 'KeyF' && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey;
    if (!isGfDraftsSequence && matchesShortcut(e, shortcut)) {
      const hoverCardOpen = Boolean(root?.querySelector?.('[data-testid="HoverCard"]'));
      if (hoverCardOpen || (!inChat && !inModal)) {
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

    // 2b. On /following, /followers, /verified_followers: Shift + F toggles the follow filter in any input language
    if (
      !inChat &&
      !inModal &&
      isFollowFilterPage() &&
      !activePrefix &&
      e.shiftKey &&
      !e.ctrlKey &&
      !e.altKey &&
      !e.metaKey &&
      resolveKeyCode(e) === 'KeyF'
    ) {
      clearPendingPrefix();
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      setFilterNonFollowers(!filterNonFollowers, true);
      return true;
    }
  }

  // 3. Otherwise handle X.com "?" shortcuts across all input languages / IMEs
  return handleXNativeShortcutIfMatched(e, root, forceDispatch);
}

const REPEATABLE_CODES = new Set(['KeyJ', 'KeyK', 'Space']);
const handledKeysDown = new Set();
const seenKeysDown = new Set();
const ignoredModifierKeysDown = new Set();
let pendingUnresolvedEditableKeydown = false;
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
      if (isEditableEvent(null, document) || isInsideXChatContext(null, document) || isInsideModalDialog(null, document)) {
        clearRepeatTimer();
        return;
      }
      if (isFollowFilterPage()) {
        stepFollowingCell(code, document);
      } else {
        dispatchNativeSpec(spec, {}, document);
      }
    }, 85);
  }, 400);
}

window.addEventListener(
  'keydown',
  (e) => {
    if (syntheticEvents.has(e)) return;

    if (shouldSwallowUntrustedShadowEvent(e, document)) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return;
    }

    const code = resolveKeyCode(e);
    const editable = isEditableEvent(e, document);
    if (editable) {
      clearPendingPrefix();
      if (!code) pendingUnresolvedEditableKeydown = true;
    } else {
      pendingUnresolvedEditableKeydown = false;
    }
    if (code) seenKeysDown.add(code);

    // Swallow delayed synthetic Y/N dispatches from external Korean shortcut extensions right after modal close
    if (Date.now() - lastModalDismissAt < 600 && (code === 'KeyN' || code === 'KeyY') && !editable) {
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
    if (!editable) {
      scheduleUiSync();
    }
  },
  true
);

window.addEventListener(
  'keypress',
  (e) => {
    if (syntheticEvents.has(e)) return;
    if (shouldSwallowUntrustedShadowEvent(e, document)) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  },
  true
);

window.addEventListener(
  'keyup',
  (e) => {
    if (syntheticEvents.has(e)) return;

    if (shouldSwallowUntrustedShadowEvent(e, document)) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return;
    }

    const editable = isEditableEvent(e, document);
    if (!editable) {
      scheduleUiSync();
    }
    const code = resolveKeyCode(e);
    if (!code || code === repeatingCode) {
      clearRepeatTimer();
    }
    const wasSeenOnKeydown = code ? seenKeysDown.has(code) : false;
    if (code) seenKeysDown.delete(code);

    if (Date.now() - lastModalDismissAt < 600 && (code === 'KeyN' || code === 'KeyY') && !editable) {
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

    if (pendingUnresolvedEditableKeydown) {
      pendingUnresolvedEditableKeydown = false;
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

function isIgnoredMutationTarget(node) {
  if (!node) return true;
  const el = node.nodeType === 1 ? node : node.parentElement;
  if (!el) return true;
  const tag = typeof el.tagName === 'string' ? el.tagName.toUpperCase() : '';
  if (
    tag === 'STYLE' ||
    tag === 'SCRIPT' ||
    tag === 'LINK' ||
    tag === 'META' ||
    tag === 'HEAD' ||
    tag === 'TITLE'
  ) {
    return true;
  }
  const id = typeof el.id === 'string' ? el.id : '';
  if (id && id.startsWith('xfs-')) {
    return true;
  }
  if (typeof el.closest === 'function' && el.closest('#xfs-following-filter-bar, head')) {
    return true;
  }
  return false;
}

function shouldScheduleSyncForMutations(records) {
  if (isApplyingDomSync) return false;
  if (!records || records.length === 0) return false;
  for (let i = 0; i < records.length; i++) {
    const rec = records[i];
    if (!rec) continue;
    if (rec.type === 'attributes') {
      if (!isIgnoredMutationTarget(rec.target)) return true;
      continue;
    }
    if (rec.type === 'childList') {
      if (isIgnoredMutationTarget(rec.target)) continue;
      const added = rec.addedNodes;
      const removed = rec.removedNodes;
      const addedLen = added ? added.length : 0;
      const removedLen = removed ? removed.length : 0;
      if (addedLen === 0 && removedLen === 0) continue;
      for (let j = 0; j < addedLen; j++) {
        const n = added[j];
        if (n && n.nodeType === 1 && !isIgnoredMutationTarget(n)) {
          return true;
        }
      }
      for (let j = 0; j < removedLen; j++) {
        const n = removed[j];
        if (n && n.nodeType === 1 && !isIgnoredMutationTarget(n)) {
          return true;
        }
      }
    }
  }
  return false;
}

function handleMutationRecords(records) {
  if (typeof document !== 'undefined' && document.hidden) {
    if (shouldScheduleSyncForMutations(records)) {
      pendingSyncOnVisible = true;
    }
    return;
  }
  if (shouldScheduleSyncForMutations(records)) {
    scheduleBackgroundUiSync();
  }
}

function handleMouseOver(e) {
  const t = e?.target;
  if (
    !t ||
    (typeof window !== 'undefined' && t === window) ||
    (typeof document !== 'undefined' &&
      (t === document || t === document.body || t === document.documentElement))
  ) {
    lastHoveredContext = null;
    scheduleUiSync();
    return;
  }
  const el = t.nodeType === 1 ? t : t.parentElement;
  const ctx =
    typeof el?.closest === 'function'
      ? el.closest('[data-testid="UserCell"], [data-testid="HoverCard"], [data-testid="Dropdown"]')
      : null;
  if (ctx === lastHoveredContext) return;
  lastHoveredContext = ctx;
  scheduleBackgroundUiSync();
}

if (typeof window !== 'undefined') {
  const onManualScrollInput = () => {
    lastUserScrollAt = Date.now();
    clearAlignTimers();
  };
  const onUserPointerDown = () => {
    lastUserPointerAt = Date.now();
    clearAlignTimers();
    clearRestoreFocusTimers();
  };
  window.addEventListener('wheel', onManualScrollInput, { capture: true, passive: true });
  window.addEventListener('touchstart', onManualScrollInput, { capture: true, passive: true });
  window.addEventListener('touchmove', onManualScrollInput, { capture: true, passive: true });
  window.addEventListener('pointerdown', onUserPointerDown, { capture: true, passive: true });
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  window.addEventListener('blur', () => {
    clearRepeatTimer();
    handledKeysDown.clear();
    seenKeysDown.clear();
    ignoredModifierKeysDown.clear();
    pendingUnresolvedEditableKeydown = false;
    clearPendingPrefix();
  });
  window.addEventListener('focusin', scheduleUiSync, true);
  window.addEventListener('mouseover', handleMouseOver, true);
  window.addEventListener(
    'click',
    () => {
      scheduleUiSync();
      if (typeof setTimeout === 'function') {
        setTimeout(scheduleUiSync, 80);
      }
    },
    true
  );
  window.addEventListener('popstate', scheduleUiSync);
  document.addEventListener?.('visibilitychange', () => {
    if (!document.hidden && pendingSyncOnVisible) {
      pendingSyncOnVisible = false;
      scheduleBackgroundUiSync();
    }
  });

  const attachObserver = () => {
    if (typeof MutationObserver !== 'undefined' && document.documentElement) {
      const observer = new MutationObserver(handleMutationRecords);
      observer.observe?.(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-testid']
      });
    }
    syncUiHints();
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
    isEditableEvent,
    shouldSwallowUntrustedShadowEvent,
    isInsideXChatOverlay,
    isInsideXChatContext,
    matchesShortcut,
    isFollowListPage,
    getFollowFilterMode,
    isFollowFilterPage,
    isFollowingPage,
    isFollowingFilterActive,
    isMutualFollowerCell,
    shouldFilterOutUserCell,
    formatFollowingFilterLabel,
    isStatusPage,
    findConfirmationDialogButton,
    findFollowListTabLink,
    findHomeTabLink,
    findProfileFollowButton,
    handleActionIfMatched,
    clearPendingPrefix,
    setShowUiHints,
    getFilterNonFollowers,
    setFilterNonFollowers,
    isCompactPillPage,
    isCompactPillActive,
    getCompactNewPostsPill,
    setCompactNewPostsPill,
    getCompactPillDesign,
    setCompactPillDesign,
    formatCompactPillLabel,
    applyConfigUpdate,
    syncCompactPill,
    syncFollowingFilter,
    scheduleUiSync,
    scheduleBackgroundUiSync,
    shouldScheduleSyncForMutations,
    syncUiHints
  };
}
