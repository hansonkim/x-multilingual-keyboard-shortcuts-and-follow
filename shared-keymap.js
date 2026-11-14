(function () {
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
    // Hebrew (SI-1452 표준 자판)
    'ק': 'KeyE', 'ר': 'KeyR', 'א': 'KeyT', 'ט': 'KeyY', 'ו': 'KeyU',
    'ן': 'KeyI', 'ם': 'KeyO', 'פ': 'KeyP',
    'ש': 'KeyA', 'ד': 'KeyS', 'ג': 'KeyD', 'כ': 'KeyF', 'ע': 'KeyG',
    'י': 'KeyH', 'ח': 'KeyJ', 'ל': 'KeyK', 'ך': 'KeyL', 'ף': 'Semicolon',
    'ז': 'KeyZ', 'ס': 'KeyX', 'ב': 'KeyC', 'ה': 'KeyV', 'נ': 'KeyB',
    'מ': 'KeyN', 'צ': 'KeyM', 'ת': 'Comma', 'ץ': 'Period',
    // Greek (표준 그리스어 QWERTY 자판)
    'ς': 'KeyW', 'ε': 'KeyE', 'ρ': 'KeyR', 'τ': 'KeyT', 'υ': 'KeyY',
    'θ': 'KeyU', 'ι': 'KeyI', 'ο': 'KeyO', 'π': 'KeyP',
    'α': 'KeyA', 'σ': 'KeyS', 'δ': 'KeyD', 'φ': 'KeyF', 'γ': 'KeyG',
    'η': 'KeyH', 'ξ': 'KeyJ', 'κ': 'KeyK', 'λ': 'KeyL',
    'ζ': 'KeyZ', 'χ': 'KeyX', 'ψ': 'KeyC', 'ω': 'KeyV', 'β': 'KeyB',
    'ν': 'KeyN', 'μ': 'KeyM', ';': 'Slash',
    // Thai (Kedmanee 표준 자판 26키 + 구두점)
    'ๆ': 'KeyQ', 'ไ': 'KeyW', 'ำ': 'KeyE', 'พ': 'KeyR', 'ะ': 'KeyT',
    'ั': 'KeyY', 'ี': 'KeyU', 'ร': 'KeyI', 'น': 'KeyO', 'ย': 'KeyP',
    'ฟ': 'KeyA', 'ห': 'KeyS', 'ก': 'KeyD', 'ด': 'KeyF', 'เ': 'KeyG',
    '้': 'KeyH', '่': 'KeyJ', 'า': 'KeyK', 'ส': 'KeyL',
    'ผ': 'KeyZ', 'ป': 'KeyX', 'แ': 'KeyC', 'อ': 'KeyV', 'ิ': 'KeyB',
    'ื': 'KeyN', 'ท': 'KeyM',
    'ใ': 'Period', 'ฝ': 'Slash',
    // macOS Option+F
    'ƒ': 'KeyF',
    // Punctuation & CJK Full-width / Half-width equivalents for '.', '/', '?', 'Space'
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
  const IME_SWITCH_CODES = new Set([
    'HangulMode', 'HanjaMode', 'KanaMode', 'KanjiMode',
    'Alphanumeric', 'CapsLock', 'Lang1', 'Lang2',
    'Convert', 'NonConvert', 'Eisuu', 'RomanCharacters'
  ]);
  const NON_PRINTABLE_IME_KEYS = new Set(['Process', 'Dead', 'Unidentified']);
  const CODE_TO_KEY_LABEL = {
    Space: 'Space',
    Period: '.',
    Comma: ',',
    Minus: '-',
    Equal: '=',
    Semicolon: ';',
    Quote: "'",
    Backquote: '`',
    BracketLeft: '[',
    BracketRight: ']',
    Backslash: '\\',
    Enter: 'Enter',
    Escape: 'Escape',
    Tab: 'Tab',
    Backspace: 'Backspace'
  };

  function normalizeFullWidthChar(ch) {
    const cp = ch.codePointAt(0);
    if (cp >= 0xff01 && cp <= 0xff5e) {
      return String.fromCharCode(cp - 0xfee0);
    }
    return ch;
  }

  function isApplePlatform(nav = typeof navigator !== 'undefined' ? navigator : null) {
    const p = String(nav?.userAgentData?.platform || nav?.platform || nav?.userAgent || '');
    return !p || /mac|iphone|ipad|ipod/i.test(p);
  }

  function resolveKeyCode(input) {
    if (!input) return null;
    const { code, key, keyCode, which } = input;
    if (IME_SWITCH_CODES.has(key) || IME_SWITCH_CODES.has(code)) {
      return null;
    }
    if (code && code !== 'Unidentified' && !MODIFIER_CODES.has(code) && !IME_SWITCH_CODES.has(code)) {
      return code;
    }
    if (key === 'Enter') return 'Enter';
    if (key === 'Escape' || key === 'Esc') return 'Escape';
    if (key === 'Tab') return 'Tab';
    if (key === ' ' || key === 'Spacebar') return 'Space';
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

  function formatShortcutLabel(sc, separator = '+') {
    const parts = [];
    if (sc.ctrl) parts.push('Ctrl');
    if (sc.alt) parts.push('Alt');
    if (sc.shift) parts.push('Shift');
    if (sc.meta) parts.push('Meta');

    const resolved = resolveKeyCode(sc) || sc.code;
    const rawKey = sc.key && !NON_PRINTABLE_IME_KEYS.has(sc.key) ? sc.key : '';
    let keyLabel = rawKey ? rawKey.toUpperCase() : '';
    if (resolved?.startsWith('Key')) keyLabel = resolved.slice(3);
    else if (resolved?.startsWith('Digit')) keyLabel = resolved.slice(5);
    else if (resolved === 'Slash') keyLabel = sc.shift ? '?' : '/';
    else if (resolved && CODE_TO_KEY_LABEL[resolved]) keyLabel = CODE_TO_KEY_LABEL[resolved];
    else if (sc.key === ' ') keyLabel = 'Space';
    else if (!keyLabel && resolved) keyLabel = resolved;

    parts.push(keyLabel || 'F');
    return parts.join(separator);
  }

  const api = {
    DEFAULT_SHORTCUT,
    LAYOUT_CHAR_TO_CODE,
    MODIFIER_KEYS,
    MODIFIER_CODES,
    IME_SWITCH_CODES,
    NON_PRINTABLE_IME_KEYS,
    CODE_TO_KEY_LABEL,
    normalizeFullWidthChar,
    isApplePlatform,
    resolveKeyCode,
    formatShortcutLabel
  };

  if (typeof globalThis !== 'undefined') {
    globalThis.XFSKeymap = api;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})();
