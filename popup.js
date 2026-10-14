const DEFAULT_SHORTCUT = {
  key: 'f',
  code: 'KeyF',
  ctrl: false,
  alt: false,
  shift: false,
  meta: false
};

const LAYOUT_CHAR_TO_CODE = {
  // Korean 2-beolsik
  'ㅂ': 'KeyQ', 'ㅃ': 'KeyQ', 'ㅈ': 'KeyW', 'ㅉ': 'KeyW',
  'ㄷ': 'KeyE', 'ㄸ': 'KeyE', 'ㄱ': 'KeyR', 'ㄲ': 'KeyR',
  'ㅅ': 'KeyT', 'ㅆ': 'KeyT', 'ㅛ': 'KeyY', 'ㅕ': 'KeyU',
  'ㅑ': 'KeyI', 'ㅐ': 'KeyO', 'ㅒ': 'KeyO', 'ㅔ': 'KeyP', 'ㅖ': 'KeyP',
  'ㅁ': 'KeyA', 'ㄴ': 'KeyS', 'ㅇ': 'KeyD', 'ㄹ': 'KeyF',
  'ㅎ': 'KeyG', 'ㅗ': 'KeyH', 'ㅓ': 'KeyJ', 'ㅏ': 'KeyK',
  'ㅣ': 'KeyL', 'ㅋ': 'KeyZ', 'ㅌ': 'KeyX', 'ㅊ': 'KeyC',
  'ㅍ': 'KeyV', 'ㅠ': 'KeyB', 'ㅜ': 'KeyN', 'ㅡ': 'KeyM',
  // Japanese JIS Kana
  'た': 'KeyQ', 'て': 'KeyW', 'い': 'KeyE', 'ぃ': 'KeyE', 'す': 'KeyR',
  'か': 'KeyT', 'ん': 'KeyY', 'な': 'KeyU', 'に': 'KeyI', 'ら': 'KeyO', 'せ': 'KeyP',
  'ち': 'KeyA', 'と': 'KeyS', 'し': 'KeyD', 'は': 'KeyF', 'き': 'KeyG',
  'く': 'KeyH', 'ま': 'KeyJ', 'の': 'KeyK', 'り': 'KeyL',
  'つ': 'KeyZ', 'っ': 'KeyZ', 'さ': 'KeyX', 'そ': 'KeyC', 'ひ': 'KeyV',
  'こ': 'KeyB', 'み': 'KeyN', 'も': 'KeyM',
  'る': 'Period', 'め': 'Slash',
  // Chinese Zhuyin / Bopomofo
  'ㄆ': 'KeyQ', 'ㄊ': 'KeyW', 'ㄍ': 'KeyE', 'ㄐ': 'KeyR', 'ㄔ': 'KeyT',
  'ㄗ': 'KeyY', 'ㄧ': 'KeyU', 'ㄛ': 'KeyI', 'ㄟ': 'KeyO', 'ㄣ': 'KeyP',
  'ㄇ': 'KeyA', 'ㄋ': 'KeyS', 'ㄎ': 'KeyD', 'ㄑ': 'KeyF', 'ㄕ': 'KeyG',
  'ㄘ': 'KeyH', 'ㄨ': 'KeyJ', 'ㄜ': 'KeyK', 'ㄠ': 'KeyL',
  'ㄈ': 'KeyZ', 'ㄌ': 'KeyX', 'ㄏ': 'KeyC', 'ㄒ': 'KeyV', 'ㄖ': 'KeyB',
  'ㄙ': 'KeyN', 'ㄩ': 'KeyM',
  'ㄡ': 'Period', 'ㄥ': 'Slash',
  // Russian (ЙЦУКЕН)
  'й': 'KeyQ', 'ц': 'KeyW', 'у': 'KeyE', 'к': 'KeyR', 'е': 'KeyT',
  'н': 'KeyY', 'г': 'KeyU', 'ш': 'KeyI', 'щ': 'KeyO', 'з': 'KeyP',
  'ф': 'KeyA', 'ы': 'KeyS', 'в': 'KeyD', 'а': 'KeyF', 'п': 'KeyG',
  'р': 'KeyH', 'о': 'KeyJ', 'л': 'KeyK', 'д': 'KeyL', 'я': 'KeyZ',
  'ч': 'KeyX', 'с': 'KeyC', 'м': 'KeyV', 'и': 'KeyB', 'т': 'KeyN', 'ь': 'KeyM',
  'ю': 'Period',
  // Arabic (26 keys + punctuation)
  'ض': 'KeyQ', 'ص': 'KeyW', 'ث': 'KeyE', 'ق': 'KeyR', 'ف': 'KeyT',
  'غ': 'KeyY', 'ع': 'KeyU', 'ه': 'KeyI', 'خ': 'KeyO', 'ح': 'KeyP',
  'ش': 'KeyA', 'س': 'KeyS', 'ي': 'KeyD', 'ب': 'KeyF', 'ل': 'KeyG',
  'ا': 'KeyH', 'ت': 'KeyJ', 'ن': 'KeyK', 'م': 'KeyL', 'ئ': 'KeyZ',
  'ء': 'KeyX', 'ؤ': 'KeyC', 'ر': 'KeyV', 'لا': 'KeyB', 'ى': 'KeyN', 'ة': 'KeyM',
  'ز': 'Period', 'ظ': 'Slash', '؟': 'Slash',
  // Hebrew / Greek / Thai / macOS Option
  'כ': 'KeyF', 'ט': 'KeyY', 'מ': 'KeyN', 'ח': 'KeyJ', 'ל': 'KeyK',
  'φ': 'KeyF', 'υ': 'KeyY', 'ν': 'KeyN', 'ξ': 'KeyJ', 'κ': 'KeyK',
  'ด': 'KeyF', 'ั': 'KeyY', 'ื': 'KeyN', '่': 'KeyJ', 'า': 'KeyK',
  'ƒ': 'KeyF',
  '.': 'Period', '。': 'Period', '．': 'Period', '｡': 'Period',
  '/': 'Slash', '?': 'Slash', '／': 'Slash', '？': 'Slash', '・': 'Slash', '･': 'Slash',
  ' ': 'Space', '\u3000': 'Space'
};

const MODIFIER_KEYS = new Set(['Control', 'Shift', 'Alt', 'Meta']);
const MODIFIER_CODES = new Set([
  'ControlLeft', 'ControlRight',
  'ShiftLeft', 'ShiftRight',
  'AltLeft', 'AltRight',
  'MetaLeft', 'MetaRight'
]);
const IME_SWITCH_KEYS = new Set([
  'HangulMode', 'HanjaMode', 'KanaMode', 'KanjiMode',
  'Alphanumeric', 'CapsLock', 'Lang1', 'Lang2',
  'Convert', 'NonConvert', 'Eisuu'
]);

function normalizeFullWidthChar(ch) {
  const cp = ch.codePointAt(0);
  if (cp >= 0xff01 && cp <= 0xff5e) {
    return String.fromCharCode(cp - 0xfee0);
  }
  return ch;
}

function resolveKeyCode(e) {
  if (!e) return null;
  const { code, key, keyCode, which } = e;
  if (code && code !== 'Unidentified' && !MODIFIER_CODES.has(code) && !IME_SWITCH_KEYS.has(code)) {
    return code;
  }
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
  }
  return null;
}

function formatShortcut(sc) {
  const parts = [];
  if (sc.ctrl) parts.push('Ctrl');
  if (sc.alt) parts.push('Alt');
  if (sc.shift) parts.push('Shift');
  if (sc.meta) parts.push('Meta');

  const resolved = resolveKeyCode(sc) || sc.code;
  let keyLabel = sc.key ? sc.key.toUpperCase() : '';
  if (resolved?.startsWith('Key')) keyLabel = resolved.slice(3);
  else if (resolved?.startsWith('Digit')) keyLabel = resolved.slice(5);
  else if (resolved === 'Space' || sc.key === ' ') keyLabel = 'Space';
  else if (resolved === 'Period') keyLabel = '.';
  else if (resolved === 'Slash') keyLabel = sc.shift ? '?' : '/';

  parts.push(keyLabel || 'F');
  return parts.join(' + ');
}

const recorder = document.getElementById('recorder');
const extFollowKey = document.getElementById('ext-follow-key');
const statusEl = document.getElementById('status');
const resetBtn = document.getElementById('reset');
const showUiHintsInput = document.getElementById('show-ui-hints');
let recording = false;

function renderShortcutLabel(sc) {
  const formatted = formatShortcut(sc);
  recorder.textContent = formatted;
  if (extFollowKey) extFollowKey.textContent = formatted;
}

async function saveShortcut(sc) {
  try {
    await chrome.storage.sync.set({ shortcut: sc });
    renderShortcutLabel(sc);
    statusEl.textContent = '저장됨';
  } catch (err) {
    statusEl.textContent = '저장 실패';
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const { shortcut = DEFAULT_SHORTCUT, showUiHints = true } = await chrome.storage.sync.get([
      'shortcut',
      'showUiHints'
    ]);
    renderShortcutLabel({ ...DEFAULT_SHORTCUT, ...shortcut });
    if (showUiHintsInput) {
      showUiHintsInput.checked = Boolean(showUiHints);
    }
  } catch (err) {
    console.error(err);
  }
});

if (showUiHintsInput) {
  showUiHintsInput.addEventListener('change', async () => {
    try {
      const checked = Boolean(showUiHintsInput.checked);
      await chrome.storage.sync.set({ showUiHints: checked });
      statusEl.textContent = checked ? '단축키 UI 표시 켜짐' : '단축키 UI 표시 꺼짐';
    } catch (err) {
      statusEl.textContent = '저장 실패';
      console.error(err);
    }
  });
}

recorder.addEventListener('click', () => {
  recording = true;
  recorder.classList.add('recording');
  recorder.textContent = '키 조합을 누르세요...';
  statusEl.textContent = '입력 대기 중';
  recorder.focus();
});

recorder.addEventListener('blur', async () => {
  if (!recording) return;
  recording = false;
  recorder.classList.remove('recording');
  const { shortcut = DEFAULT_SHORTCUT } = await chrome.storage.sync.get('shortcut');
  renderShortcutLabel({ ...DEFAULT_SHORTCUT, ...shortcut });
  statusEl.textContent = '클릭 후 새 단축키 입력';
});

async function handleRecordEvent(e) {
  if (!recording) return;
  e.preventDefault();
  e.stopPropagation();

  if (MODIFIER_KEYS.has(e.key) || MODIFIER_CODES.has(e.code) || IME_SWITCH_KEYS.has(e.key) || IME_SWITCH_KEYS.has(e.code)) {
    return;
  }

  const resolvedCode = resolveKeyCode(e);
  if (!resolvedCode && (e.key === 'Process' || e.key === 'Dead' || e.key === 'Unidentified')) {
    return;
  }

  recording = false;
  recorder.classList.remove('recording');

  let canonicalKey = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if (resolvedCode?.startsWith('Key')) canonicalKey = resolvedCode.slice(3).toLowerCase();
  else if (resolvedCode?.startsWith('Digit')) canonicalKey = resolvedCode.slice(5);

  const next = {
    key: canonicalKey,
    code: resolvedCode || e.code,
    ctrl: e.ctrlKey,
    alt: e.altKey,
    shift: e.shiftKey,
    meta: e.metaKey
  };
  await saveShortcut(next);
}

recorder.addEventListener('keydown', handleRecordEvent);
recorder.addEventListener('keyup', handleRecordEvent);

resetBtn.addEventListener('click', async () => {
  recording = false;
  recorder.classList.remove('recording');
  await saveShortcut({ ...DEFAULT_SHORTCUT });
});
