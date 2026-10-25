const assert = require('node:assert/strict');
const listeners = {};
globalThis.window = {
  addEventListener(type, fn) {
    (listeners[type] ||= []).push(fn);
  }
};
const {
  DEFAULT_SHORTCUT,
  isEditable,
  matchesShortcut,
  isFollowListPage,
  isFollowingPage,
  isMutualFollowerCell,
  isStatusPage,
  findConfirmationDialogButton,
  findProfileFollowButton,
  handleActionIfMatched,
  clearPendingPrefix,
  setShowUiHints,
  getFilterNonFollowers,
  setFilterNonFollowers,
  syncFollowingFilter,
  syncUiHints
} = require('./content.js');

// 1. Default single key 'f' & multilingual IME ('ㄹ' Korean, 'は' Japanese Kana, 'ㄑ' Chinese Zhuyin, 'ｆ' Full-width, 'Process'+KeyF Chinese/Japanese IME, 'а' Russian, 'ب' Arabic)
assert.equal(
  matchesShortcut({ key: 'f', code: 'KeyF', ctrlKey: false, altKey: false, shiftKey: false, metaKey: false }, DEFAULT_SHORTCUT),
  true
);
assert.equal(
  matchesShortcut({ key: 'ㄹ', code: '', isComposing: true, ctrlKey: false, altKey: false, shiftKey: false, metaKey: false }, DEFAULT_SHORTCUT),
  true
);
assert.equal(
  matchesShortcut({ key: 'は', code: '', isComposing: true, ctrlKey: false, altKey: false, shiftKey: false, metaKey: false }, DEFAULT_SHORTCUT),
  true
);
assert.equal(
  matchesShortcut({ key: 'ㄑ', code: '', isComposing: true, ctrlKey: false, altKey: false, shiftKey: false, metaKey: false }, DEFAULT_SHORTCUT),
  true
);
assert.equal(
  matchesShortcut({ key: 'ｆ', code: '', isComposing: true, ctrlKey: false, altKey: false, shiftKey: false, metaKey: false }, DEFAULT_SHORTCUT),
  true
);
assert.equal(
  matchesShortcut({ key: 'Process', code: 'KeyF', keyCode: 229, isComposing: true, ctrlKey: false, altKey: false, shiftKey: false, metaKey: false }, DEFAULT_SHORTCUT),
  true
);
assert.equal(
  matchesShortcut({ key: 'а', code: '', ctrlKey: false, altKey: false, shiftKey: false, metaKey: false }, DEFAULT_SHORTCUT),
  true
);
assert.equal(
  matchesShortcut({ key: 'ب', code: '', ctrlKey: false, altKey: false, shiftKey: false, metaKey: false }, DEFAULT_SHORTCUT),
  true
);

// 2. Follow list path detection
assert.equal(isFollowListPage('/Hanssony_/verified_followers'), true);
assert.equal(isFollowListPage('/Hanssony_/followers'), true);
assert.equal(isFollowListPage('/Hanssony_/following'), true);
assert.equal(isFollowListPage('/Hanssony_'), false);
assert.equal(isFollowListPage('/home'), false);

// 3. On follow list pages: returns null when no UserCell is focused, returns button when UserCell or cellInnerDiv is focused
const cellFollowBtn = { id: 'cell-btn' };
const focusedCell = {
  querySelector: (sel) => (sel.includes('-follow') ? cellFollowBtn : null)
};
const activeInCell = {
  closest: (sel) => (sel === '[data-testid="UserCell"]' ? focusedCell : null)
};
const activeCellInnerDiv = {
  closest: (sel) =>
    sel === '[data-testid="cellInnerDiv"]'
      ? { querySelector: (s) => (s === '[data-testid="UserCell"]' ? focusedCell : null) }
      : null
};
const primaryForList = {
  contains: (node) =>
    node === activeInCell || node === activeCellInnerDiv || node === focusedCell
};
assert.equal(
  findProfileFollowButton({ activeElement: { closest: () => null }, querySelector: () => primaryForList }, '/Hanssony_/followers'),
  null
);
assert.equal(
  findProfileFollowButton({ activeElement: activeInCell, querySelector: () => primaryForList }, '/Hanssony_/followers'),
  cellFollowBtn
);
assert.equal(
  findProfileFollowButton({ activeElement: activeCellInnerDiv, querySelector: () => primaryForList }, '/Hanssony_/followers'),
  cellFollowBtn
);

// 4. Unfollow confirmation dialog Y / N (and Korean ㅛ / ㅜ)
const confirmBtn = { id: 'confirm' };
const cancelBtn = { id: 'cancel' };
const modalRoot = {
  querySelector: (sel) => {
    if (sel === '[data-testid="confirmationSheetConfirm"]') return confirmBtn;
    if (sel === '[data-testid="confirmationSheetCancel"]') return cancelBtn;
    return null;
  }
};
assert.equal(findConfirmationDialogButton({ key: 'y', code: 'KeyY' }, modalRoot), confirmBtn);
assert.equal(findConfirmationDialogButton({ key: 'ㅛ', code: '' }, modalRoot), confirmBtn);
assert.equal(findConfirmationDialogButton({ key: 'n', code: 'KeyN' }, modalRoot), cancelBtn);
assert.equal(findConfirmationDialogButton({ key: 'ㅜ', code: '' }, modalRoot), cancelBtn);
assert.equal(findConfirmationDialogButton({ key: 'f', code: 'KeyF' }, modalRoot), null);

// 5. Profile header follow button selection (ignores UserCell / tweet follow buttons on main profile page)
const cellBtn = { closest: (sel) => (sel.includes('UserCell') ? {} : null) };
const headerBtn = { closest: () => null };
const fakeRoot = {
  querySelector(sel) {
    if (sel === '[data-testid="primaryColumn"]') {
      return {
        querySelector: (s) => (s === '[data-testid="UserName"]' ? {} : null),
        querySelectorAll: () => [cellBtn, headerBtn]
      };
    }
    return null;
  }
};
assert.equal(findProfileFollowButton(fakeRoot, '/Hanssony_'), headerBtn);
assert.equal(isEditable({ nodeType: 1, tagName: 'INPUT' }), true);

// 6. Keyup fallback when keydown is swallowed by an external extension (e.g. X Korean Keyboard Shortcuts)
let clicks = 0;
const followBackBtn = {
  closest: () => null,
  getAttribute: () => '123-follow',
  click() {
    clicks++;
  }
};
globalThis.location = { pathname: '/VVCAO1983' };
globalThis.document = {
  body: {},
  querySelector(sel) {
    if (sel === '[data-testid="primaryColumn"]') {
      return {
        querySelector: (s) => (s === '[data-testid="UserName"]' ? {} : null),
        querySelectorAll: () => [followBackBtn]
      };
    }
    return null;
  }
};

// Case 6a: keydown is swallowed (only keyup reaches our listener) -> clicks once on keyup
for (const fn of listeners.keyup) {
  fn({
    key: 'ㄹ',
    code: 'KeyF',
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    target: { nodeType: 1, tagName: 'BODY' },
    preventDefault() {},
    stopPropagation() {},
    stopImmediatePropagation() {}
  });
}
assert.equal(clicks, 1);

// Case 6b: both keydown and keyup reach our listener -> clicks once on keydown, does NOT double-click on keyup
for (const fn of listeners.keydown) {
  fn({
    key: 'ㄹ',
    code: 'KeyF',
    repeat: false,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    target: { nodeType: 1, tagName: 'BODY' },
    preventDefault() {},
    stopPropagation() {},
    stopImmediatePropagation() {}
  });
}
for (const fn of listeners.keyup) {
  fn({
    key: 'ㄹ',
    code: 'KeyF',
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    target: { nodeType: 1, tagName: 'BODY' },
    preventDefault() {},
    stopPropagation() {},
    stopImmediatePropagation() {}
  });
}
assert.equal(clicks, 2);

// 7. All X.com "?" shortcuts in Korean, Japanese, Chinese, Russian, Arabic, Full-width, and IME composition
if (typeof globalThis.KeyboardEvent === 'undefined') {
  globalThis.KeyboardEvent = class KeyboardEvent {
    constructor(type, init = {}) {
      this.type = type;
      Object.assign(this, init);
    }
  };
}

const dispatchedEvents = [];
const mockBody = {
  nodeType: 1,
  tagName: 'BODY',
  dispatchEvent(ev) {
    dispatchedEvents.push({
      type: ev.type,
      key: ev.key,
      code: ev.code,
      keyCode: ev.keyCode,
      which: ev.which,
      charCode: ev.charCode,
      shiftKey: ev.shiftKey,
      ctrlKey: ev.ctrlKey,
      metaKey: ev.metaKey
    });
    return true;
  }
};
const mockDoc = {
  body: mockBody,
  activeElement: mockBody,
  querySelector(sel) {
    if (sel === '[data-testid="primaryColumn"]') {
      return {
        querySelector: (s) => (s === '[data-testid="UserName"]' ? {} : null),
        querySelectorAll: () => [followBackBtn]
      };
    }
    return null;
  }
};

function makeEv(overrides) {
  return {
    key: '',
    code: '',
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    target: mockBody,
    preventDefault() {},
    stopPropagation() {},
    stopImmediatePropagation() {},
    ...overrides
  };
}

// 7a. Single-key "?" shortcuts in Korean / Japanese / Chinese / IME Process
const singleTestCases = [
  { ev: { key: '？', code: 'Slash', shiftKey: true }, expectedKey: '?', expectedKeyCode: 191, expectedCharCode: 63 },
  { ev: { key: 'ㅓ', code: 'KeyJ' }, expectedKey: 'j', expectedKeyCode: 74, expectedCharCode: 106 },
  { ev: { key: 'ま', code: '' }, expectedKey: 'j', expectedKeyCode: 74, expectedCharCode: 106 },
  { ev: { key: 'ㄨ', code: '' }, expectedKey: 'j', expectedKeyCode: 74, expectedCharCode: 106 },
  { ev: { key: 'Process', code: 'KeyK', keyCode: 229, isComposing: true }, expectedKey: 'k', expectedKeyCode: 75, expectedCharCode: 107 },
  { ev: { key: '\u3000', code: 'Space' }, expectedKey: ' ', expectedKeyCode: 32, expectedCharCode: 32 },
  { ev: { key: '。', code: 'Period' }, expectedKey: '.', expectedKeyCode: 190, expectedCharCode: 46 },
  { ev: { key: 'ㄡ', code: '' }, expectedKey: '.', expectedKeyCode: 190, expectedCharCode: 46 },
  { ev: { key: 'ㅜ', code: 'KeyN' }, expectedKey: 'n', expectedKeyCode: 78, expectedCharCode: 110 },
  { ev: { key: '・', code: 'Slash' }, expectedKey: '/', expectedKeyCode: 191, expectedCharCode: 47 },
  { ev: { key: 'ㄥ', code: '' }, expectedKey: '/', expectedKeyCode: 191, expectedCharCode: 47 },
  { ev: { key: 'ㅣ', code: 'KeyL' }, expectedKey: 'l', expectedKeyCode: 76, expectedCharCode: 108 },
  { ev: { key: 'ㄱ', code: 'KeyR' }, expectedKey: 'r', expectedKeyCode: 82, expectedCharCode: 114 },
  { ev: { key: 'ㅅ', code: 'KeyT' }, expectedKey: 't', expectedKeyCode: 84, expectedCharCode: 116 },
  { ev: { key: 'ㄴ', code: 'KeyS' }, expectedKey: 's', expectedKeyCode: 83, expectedCharCode: 115 },
  { ev: { key: 'ㅠ', code: 'KeyB' }, expectedKey: 'b', expectedKeyCode: 66, expectedCharCode: 98 },
  { ev: { key: 'ㅕ', code: 'KeyU' }, expectedKey: 'u', expectedKeyCode: 85, expectedCharCode: 117 },
  { ev: { key: 'ㅌ', code: 'KeyX' }, expectedKey: 'x', expectedKeyCode: 88, expectedCharCode: 120 },
  { ev: { key: 'ㅐ', code: 'KeyO' }, expectedKey: 'o', expectedKeyCode: 79, expectedCharCode: 111 },
  { ev: { key: 'ㅑ', code: 'KeyI' }, expectedKey: 'i', expectedKeyCode: 73, expectedCharCode: 105 },
  { ev: { key: 'ㅡ', code: 'KeyM' }, expectedKey: 'm', expectedKeyCode: 77, expectedCharCode: 109 }
];

for (const tc of singleTestCases) {
  clearPendingPrefix();
  dispatchedEvents.length = 0;
  const handled = handleActionIfMatched(makeEv(tc.ev), mockDoc, false);
  assert.equal(handled, true, `Expected ${JSON.stringify(tc.ev)} to be handled`);
  assert.equal(dispatchedEvents.length, 2);
  assert.equal(dispatchedEvents[0].type, 'keydown');
  assert.equal(dispatchedEvents[0].key, tc.expectedKey);
  assert.equal(dispatchedEvents[0].keyCode, tc.expectedKeyCode);
  assert.equal(dispatchedEvents[1].type, 'keypress');
  assert.equal(dispatchedEvents[1].key, tc.expectedKey);
  assert.equal(dispatchedEvents[1].which, tc.expectedCharCode);
}

// 7b. "g + f" (Drafts) vs standalone "f" (Follow):
// When 'ㅎ' (KeyG) is pressed followed by 'ㄹ' (KeyF), it must dispatch 'g' then 'f' (Drafts) and NOT click followBackBtn!
clearPendingPrefix();
dispatchedEvents.length = 0;
const clicksBeforeGf = clicks;
assert.equal(handleActionIfMatched(makeEv({ key: 'ㅎ', code: 'KeyG' }), mockDoc, false), true);
assert.equal(handleActionIfMatched(makeEv({ key: 'ㄹ', code: 'KeyF' }), mockDoc, false), true);
assert.equal(clicks, clicksBeforeGf, 'g + f (Drafts) should not click the Follow button');
assert.deepEqual(
  dispatchedEvents.map((d) => `${d.type}:${d.key}`),
  ['keydown:g', 'keypress:g', 'keydown:f', 'keypress:f']
);

// Immediately after 'g + f' completes, pressing 'ㄹ' (KeyF) again as standalone MUST click the Follow button!
assert.equal(handleActionIfMatched(makeEv({ key: 'ㄹ', code: 'KeyF' }), mockDoc, false), true);
assert.equal(clicks, clicksBeforeGf + 1, 'Standalone f after g+f should click Follow button');

// 7c. All other "g + ..." sequences (e.g. g+g Grok, g+c Creator Studio, g+s Settings) and "a + ..." sequences (a+d, a+Space, a+m)
for (const [secondChar, secondCode, expectedKey] of [
  ['ㅎ', 'KeyG', 'g'],
  ['ㅊ', 'KeyC', 'c'],
  ['ㄴ', 'KeyS', 's'],
  ['ㅗ', 'KeyH', 'h'],
  ['ㅔ', 'KeyP', 'p']
]) {
  clearPendingPrefix();
  dispatchedEvents.length = 0;
  assert.equal(handleActionIfMatched(makeEv({ key: 'き', code: 'KeyG' }), mockDoc, false), true);
  assert.equal(handleActionIfMatched(makeEv({ key: secondChar, code: secondCode }), mockDoc, false), true);
  assert.deepEqual(
    dispatchedEvents.map((d) => `${d.type}:${d.key}`),
    ['keydown:g', 'keypress:g', `keydown:${expectedKey}`, `keypress:${expectedKey}`]
  );
}

for (const [secondChar, secondCode, expectedKey] of [
  ['ㅇ', 'KeyD', 'd'],
  ['\u3000', 'Space', ' '],
  ['ㅡ', 'KeyM', 'm']
]) {
  clearPendingPrefix();
  dispatchedEvents.length = 0;
  assert.equal(handleActionIfMatched(makeEv({ key: 'ㄇ', code: 'KeyA' }), mockDoc, false), true);
  assert.equal(handleActionIfMatched(makeEv({ key: secondChar, code: secondCode }), mockDoc, false), true);
  assert.deepEqual(
    dispatchedEvents.map((d) => `${d.type}:${d.key}`),
    ['keydown:a', 'keypress:a', `keydown:${expectedKey}`, `keypress:${expectedKey}`]
  );
}

// 8. Show / Hide shortcut UI hints option
let styleNode = null;
const prevDoc = globalThis.document;
globalThis.document = {
  documentElement: {
    style: { setProperty() {} }
  },
  head: {
    appendChild(el) {
      styleNode = el;
    }
  },
  getElementById(id) {
    if (id === 'xfs-styles') return styleNode;
    return null;
  },
  querySelector() {
    return null;
  },
  querySelectorAll() {
    return [];
  }
};
globalThis.document.createElement = () => ({
  id: '',
  textContent: '',
  remove() {
    styleNode = null;
  }
});

setShowUiHints(true);
assert.equal(Boolean(styleNode && styleNode.id === 'xfs-styles'), true);
setShowUiHints(false);
assert.equal(styleNode, null);
setShowUiHints(true);
assert.equal(Boolean(styleNode && styleNode.id === 'xfs-styles'), true);
globalThis.document = prevDoc;

// 9. Status page (/Buldakguy/status/2110367916348899354) follow / unfollow support
assert.equal(isStatusPage('/Buldakguy/status/2110367916348899354'), true);
assert.equal(isStatusPage('/Hanssony_'), false);

const buldakFollowBtn = {
  id: 'buldak-btn',
  getAttribute(attr) {
    if (attr === 'aria-label') return '팔로잉 @Buldakguy';
    if (attr === 'data-testid') return '1987430493542096898-unfollow';
    return null;
  },
  closest() {
    return null;
  }
};
const ramzFollowBtn = {
  id: 'ramz-btn',
  getAttribute(attr) {
    if (attr === 'aria-label') return '팔로잉 @ramztd';
    if (attr === 'data-testid') return '1937763888478789632-unfollow';
    return null;
  },
  closest() {
    return null;
  }
};
let hoveredStatusCell = null;
const statusRoot = {
  activeElement: null,
  querySelector(sel) {
    if (sel === '[data-testid="primaryColumn"]') return { querySelector() { return null; } };
    if (sel === '[data-testid="UserCell"]:hover') return hoveredStatusCell;
    return null;
  },
  querySelectorAll() {
    return [ramzFollowBtn, buldakFollowBtn];
  }
};

// Without hover, matches @Buldakguy from /Buldakguy/status/2110367916348899354
assert.equal(
  findProfileFollowButton(statusRoot, '/Buldakguy/status/2110367916348899354'),
  buldakFollowBtn
);

// When hovering @ramztd's UserCell in "관련 인물", targets @ramztd's follow/unfollow button
hoveredStatusCell = {
  querySelector() {
    return ramzFollowBtn;
  }
};
assert.equal(
  findProfileFollowButton(statusRoot, '/Buldakguy/status/2110367916348899354'),
  ramzFollowBtn
);

// 10. Continuous key repeat when holding down j / k (e.repeat === true)
globalThis.document = mockDoc;
dispatchedEvents.length = 0;
for (const fn of listeners.keydown) {
  fn(makeEv({ key: 'ㅓ', code: 'KeyJ', repeat: false }));
  fn(makeEv({ key: 'ㅓ', code: 'KeyJ', repeat: true }));
  fn(makeEv({ key: 'ㅓ', code: 'KeyJ', repeat: true }));
}
for (const fn of listeners.keyup) {
  fn(makeEv({ key: 'ㅓ', code: 'KeyJ' }));
}
assert.equal(
  dispatchedEvents.filter((d) => d.type === 'keypress' && d.key === 'j').length,
  3,
  'Holding down ㅓ (KeyJ) should dispatch j on every repeat event'
);

// 11. On /verified_followers, /followers, /following: only the j/k-selected user's button gets data-xfs-target="true"
function makeMockFollowBtn(id) {
  const attrs = new Map();
  return {
    id,
    getAttribute(k) {
      return attrs.get(k) ?? null;
    },
    setAttribute(k, v) {
      attrs.set(k, String(v));
    },
    removeAttribute(k) {
      attrs.delete(k);
    }
  };
}

const listBtn1 = makeMockFollowBtn('user-1-btn');
const listBtn2 = makeMockFollowBtn('user-2-btn');
const listCell1 = {
  querySelector(sel) {
    return sel.includes('-follow') ? listBtn1 : null;
  }
};
const listCell2 = {
  querySelector(sel) {
    return sel.includes('-follow') ? listBtn2 : null;
  }
};
const listLink1 = {
  isConnected: true,
  closest(sel) {
    return sel === '[data-testid="UserCell"]' ? listCell1 : null;
  }
};
const listLink2 = {
  isConnected: true,
  closest(sel) {
    return sel === '[data-testid="UserCell"]' ? listCell2 : null;
  }
};
const listPrimary = {
  contains(node) {
    return (
      node === listLink1 ||
      node === listLink2 ||
      node === listCell1 ||
      node === listCell2
    );
  }
};

globalThis.location = { pathname: '/Hanssony_/followers' };
globalThis.document = {
  activeElement: null,
  documentElement: { style: { setProperty() {} } },
  head: { appendChild() {} },
  getElementById() {
    return { id: 'xfs-styles', textContent: '', remove() {} };
  },
  createElement() {
    return { id: '', textContent: '', remove() {} };
  },
  querySelector(sel) {
    if (sel === '[data-testid="primaryColumn"]') return listPrimary;
    return null;
  },
  querySelectorAll(sel) {
    if (sel === '[data-xfs-target="true"]') {
      return [listBtn1, listBtn2].filter((b) => b.getAttribute('data-xfs-target') === 'true');
    }
    return [];
  }
};

// Before pressing j/k: neither user button has data-xfs-target="true"
syncUiHints();
assert.equal(listBtn1.getAttribute('data-xfs-target'), null);
assert.equal(listBtn2.getAttribute('data-xfs-target'), null);

// After j selects user 1: ONLY user 1's button has data-xfs-target="true"
globalThis.document.activeElement = listLink1;
syncUiHints();
assert.equal(listBtn1.getAttribute('data-xfs-target'), 'true');
assert.equal(listBtn2.getAttribute('data-xfs-target'), null);

// After j selects user 2: ONLY user 2's button has data-xfs-target="true" (user 1's is removed)
globalThis.document.activeElement = listLink2;
syncUiHints();
assert.equal(listBtn1.getAttribute('data-xfs-target'), null);
assert.equal(listBtn2.getAttribute('data-xfs-target'), 'true');

// 12. Follow list page top tabs ([role="tab"]) shortcuts: g v (/verified_followers), g w (/followers), g o (/following)
let clickedTab = null;
const verifiedTab = { click() { clickedTab = 'verified_followers'; } };
const followersTab = { click() { clickedTab = 'followers'; } };
const followingTab = { click() { clickedTab = 'following'; } };
const tabDoc = {
  body: mockBody,
  activeElement: mockBody,
  querySelector(sel) {
    if (sel.includes('/verified_followers')) return verifiedTab;
    if (sel.includes('/followers')) return followersTab;
    if (sel.includes('/following')) return followingTab;
    return null;
  }
};

globalThis.location = { pathname: '/Hanssony_/followers' };
clearPendingPrefix();
assert.equal(handleActionIfMatched(makeEv({ key: 'ㅎ', code: 'KeyG' }), tabDoc, false), true);
assert.equal(handleActionIfMatched(makeEv({ key: 'ㅍ', code: 'KeyV' }), tabDoc, false), true);
assert.equal(clickedTab, 'verified_followers');

clearPendingPrefix();
handleActionIfMatched(makeEv({ key: 'g', code: 'KeyG' }), tabDoc, false);
assert.equal(handleActionIfMatched(makeEv({ key: 'w', code: 'KeyW' }), tabDoc, false), true);
assert.equal(clickedTab, 'followers');

clearPendingPrefix();
assert.equal(handleActionIfMatched(makeEv({ key: 'き', code: 'KeyG' }), tabDoc, false), true);
assert.equal(handleActionIfMatched(makeEv({ key: 'ら', code: 'KeyO' }), tabDoc, false), true);
assert.equal(clickedTab, 'following');

// 12b. g v / g w / g o from other pages (/home -> logged-in user, /Buldakguy/status/... -> Buldakguy)
const otherPageDoc = {
  body: mockBody,
  activeElement: mockBody,
  querySelector(sel) {
    if (sel === 'header nav a[data-testid="AppTabBar_Profile_Link"]') {
      return { getAttribute: (k) => (k === 'href' ? '/Hanssony_' : null) };
    }
    return null;
  }
};

globalThis.location = { pathname: '/home' };
clearPendingPrefix();
assert.equal(handleActionIfMatched(makeEv({ key: 'ㅎ', code: 'KeyG' }), otherPageDoc, false), true);
assert.equal(handleActionIfMatched(makeEv({ key: 'ㅈ', code: 'KeyW' }), otherPageDoc, false), true);
assert.equal(globalThis.location.pathname, '/Hanssony_/followers');

globalThis.location = { pathname: '/Buldakguy/status/2110367916348899354' };
clearPendingPrefix();
assert.equal(handleActionIfMatched(makeEv({ key: 'ㅎ', code: 'KeyG' }), otherPageDoc, false), true);
assert.equal(handleActionIfMatched(makeEv({ key: 'ㅐ', code: 'KeyO' }), otherPageDoc, false), true);
assert.equal(globalThis.location.pathname, '/Buldakguy/following');

// 13. Popup i18n support (ko, en, zh, ja) and browser language detection
const { I18N, detectBrowserLang } = require('./popup.js');
assert.equal(detectBrowserLang('ko-KR'), 'ko');
assert.equal(detectBrowserLang('en-US'), 'en');
assert.equal(detectBrowserLang('zh-CN'), 'zh');
assert.equal(detectBrowserLang('zh-TW'), 'zh');
assert.equal(detectBrowserLang('ja-JP'), 'ja');
assert.equal(detectBrowserLang('fr-FR'), 'en');

const expectedKeys = Object.keys(I18N.ko);
for (const lang of ['ko', 'en', 'zh', 'ja']) {
  assert.deepEqual(Object.keys(I18N[lang]), expectedKeys, `Missing i18n keys for ${lang}`);
  for (const k of expectedKeys) {
    assert.equal(typeof I18N[lang][k], 'string');
    assert.equal(I18N[lang][k].length > 0, true);
  }
}

// 14. Following page (/following) non-follower filter: detection, DOM filtering, Shift+F toggle, and J/K skip of mutuals
assert.equal(isFollowingPage('/Hanssony_/following'), true);
assert.equal(isFollowingPage('/Hanssony_/following/'), true);
assert.equal(isFollowingPage('/Hanssony_/followers'), false);
assert.equal(isFollowingPage('/Hanssony_/verified_followers'), false);
assert.equal(isFollowingPage('/Hanssony_'), false);

// 14a. Mutual follower detection (userFollowIndicator testid, localized badge text, and bio exclusion)
assert.equal(
  isMutualFollowerCell({
    querySelector: (sel) => (sel === '[data-testid="userFollowIndicator"]' ? {} : null),
    querySelectorAll: () => []
  }),
  true
);
assert.equal(
  isMutualFollowerCell({
    querySelector: () => null,
    querySelectorAll: () => [
      { children: [], textContent: ' 나를 팔로우합니다 ', closest: () => null }
    ]
  }),
  true
);
assert.equal(
  isMutualFollowerCell({
    querySelector: () => null,
    querySelectorAll: () => [
      { children: [], textContent: 'Follows you', closest: (sel) => (sel.includes('UserDescription') ? {} : null) }
    ]
  }),
  false,
  'Bio text containing "Follows you" inside UserDescription must not mark user as mutual follower'
);
assert.equal(
  isMutualFollowerCell({
    querySelector: () => null,
    querySelectorAll: () => [{ children: [], textContent: '@user_01', closest: () => null }]
  }),
  false
);

// 14b. syncFollowingFilter, Shift+F (and Korean Shift+ㄹ) shortcut, and J/K skipping hidden mutual cells
function createFilterCell(id, isMutual) {
  const cellAttrs = new Map();
  const rowAttrs = new Map();
  const cellClasses = new Set();
  const rowClasses = new Set();
  const btn = makeMockFollowBtn(`${id}-btn`);
  let row;
  const link = {
    id: `${id}-link`,
    isConnected: true,
    focus() {},
    closest(sel) {
      if (sel === '[data-testid="UserCell"]') return cell;
      if (sel === '[data-testid="cellInnerDiv"]') return row;
      return null;
    }
  };
  const cell = {
    id,
    getAttribute: (k) => cellAttrs.get(k) ?? null,
    setAttribute: (k, v) => cellAttrs.set(k, String(v)),
    removeAttribute: (k) => cellAttrs.delete(k),
    classList: {
      add: (c) => cellClasses.add(c),
      remove: (c) => cellClasses.delete(c),
      contains: (c) => cellClasses.has(c)
    },
    closest: (sel) => (sel === '[data-testid="cellInnerDiv"]' ? row : null),
    scrollIntoView() {},
    querySelector(sel) {
      if (sel === '[data-testid="userFollowIndicator"]') return isMutual ? {} : null;
      if (sel === 'a[role="link"][tabindex="-1"]') return link;
      if (sel.includes('-follow')) return btn;
      return null;
    },
    querySelectorAll: () => []
  };
  row = {
    id: `${id}-row`,
    getAttribute: (k) => rowAttrs.get(k) ?? null,
    setAttribute: (k, v) => rowAttrs.set(k, String(v)),
    removeAttribute: (k) => rowAttrs.delete(k),
    classList: {
      add: (c) => rowClasses.add(c),
      remove: (c) => rowClasses.delete(c),
      contains: (c) => rowClasses.has(c)
    },
    querySelector: (sel) => (sel === '[data-testid="UserCell"]' ? cell : null)
  };
  return { cell, row, link, btn };
}

const fUser1 = createFilterCell('u1-nonfollower', false);
const fUser2 = createFilterCell('u2-mutual', true);
const fUser3 = createFilterCell('u3-nonfollower', false);
let fUser1Top = 161;
let fUser2Top = 271;
let fUser3Top = 361;
fUser1.row.getBoundingClientRect = () => ({ top: fUser1Top, bottom: fUser1Top + 110, height: 110 });
fUser2.row.getBoundingClientRect = () => ({ top: fUser2Top, bottom: fUser2Top + 90, height: 90 });
fUser3.row.getBoundingClientRect = () => ({ top: fUser3Top, bottom: fUser3Top + 120, height: 120 });
const allFilterCells = [fUser1.cell, fUser2.cell, fUser3.cell];
const allFilterNodes = new Set([
  fUser1.cell, fUser1.row, fUser1.link,
  fUser2.cell, fUser2.row, fUser2.link,
  fUser3.cell, fUser3.row, fUser3.link
]);

let filterBarEl = null;
let filterBtnEl = null;
const filterSection = {
  id: 'timeline-section',
  style: { marginTop: '' }
};
const filterNavWrapper = { id: 'nav-wrapper', nextSibling: null };
const filterNavParent = {
  insertBefore(el) {
    filterBarEl = el;
    el.parentNode = filterNavParent;
    el.previousSibling = filterNavWrapper;
  }
};
filterNavWrapper.parentNode = filterNavParent;
const filterNav = { parentNode: filterNavWrapper };
const filterSwipeableList = {
  insertBefore() {
    throw new Error('Filter bar must not be inserted inside ScrollSnap-SwipeableList');
  }
};
const filterTablist = {
  parentNode: filterSwipeableList,
  closest(sel) {
    if (sel.includes('nav')) return filterNav;
    return null;
  }
};
const filterPrimaryAttrs = new Map();
const filterPrimaryClasses = new Set();
const filterPrimary = {
  contains: (node) => allFilterNodes.has(node),
  getAttribute: (k) => filterPrimaryAttrs.get(k) ?? null,
  setAttribute: (k, v) => filterPrimaryAttrs.set(k, String(v)),
  removeAttribute: (k) => filterPrimaryAttrs.delete(k),
  classList: {
    add: (c) => filterPrimaryClasses.add(c),
    remove: (c) => filterPrimaryClasses.delete(c),
    contains: (c) => filterPrimaryClasses.has(c)
  },
  insertBefore(el) {
    filterBarEl = el;
  },
  appendChild(el) {
    filterBarEl = el;
  },
  querySelector(sel) {
    if (sel === '#xfs-following-filter-bar') return filterBarEl;
    if (sel.includes('section')) return filterSection;
    if (sel === '[role="tablist"]') return filterTablist;
    return null;
  },
  querySelectorAll(sel) {
    if (sel === '[data-testid="UserCell"]') return allFilterCells;
    return [];
  }
};

const docAttrs = new Map();
const followingDoc = {
  body: mockBody,
  activeElement: null,
  documentElement: {
    lang: 'ko',
    style: { setProperty() {} },
    getAttribute: (k) => docAttrs.get(k) ?? null,
    setAttribute: (k, v) => docAttrs.set(k, String(v)),
    removeAttribute: (k) => docAttrs.delete(k)
  },
  head: { appendChild() {} },
  getElementById(id) {
    if (id === 'xfs-following-filter-bar') return filterBarEl;
    if (id === 'xfs-non-follower-toggle') return filterBtnEl;
    return null;
  },
  createElement(tag) {
    const attrs = new Map();
    const el = {
      tagName: tag.toUpperCase(),
      id: '',
      textContent: '',
      getAttribute: (k) => attrs.get(k) ?? null,
      setAttribute: (k, v) => attrs.set(k, String(v)),
      removeAttribute: (k) => attrs.delete(k),
      addEventListener(type, fn) {
        if (type === 'click') el.onClick = fn;
      },
      appendChild(child) {
        if (child.id === 'xfs-non-follower-toggle') filterBtnEl = child;
      },
      getBoundingClientRect() {
        return { top: 107, bottom: 161, height: 54 };
      },
      remove() {
        if (el === filterBarEl) filterBarEl = null;
      }
    };
    return el;
  },
  querySelector(sel) {
    if (sel === '[data-testid="primaryColumn"]') return filterPrimary;
    return null;
  },
  querySelectorAll(sel) {
    if (sel.includes('data-xfs-mutual')) {
      return [
        ...allFilterCells,
        fUser1.row, fUser2.row, fUser3.row
      ].filter((n) => n.getAttribute('data-xfs-mutual') === 'true' || n.getAttribute('data-xfs-hidden') === 'true');
    }
    return [];
  }
};

globalThis.location = { pathname: '/Hanssony_/following' };
globalThis.document = followingDoc;
let totalScrolledY = 0;
globalThis.window = {
  scrollBy(x, y) {
    totalScrolledY += y;
    fUser1Top -= y;
    fUser2Top -= y;
    fUser3Top -= y;
  }
};

setFilterNonFollowers(false);
const statsOff = syncFollowingFilter(followingDoc, '/Hanssony_/following');
assert.deepEqual(statsOff, { total: 3, nonFollowers: 2, mutuals: 1, active: false });
assert.equal(fUser2.cell.getAttribute('data-xfs-mutual'), 'true');
assert.equal(fUser2.cell.getAttribute('data-xfs-hidden'), null);
assert.equal(filterBarEl.getAttribute('data-xfs-active'), 'false');
assert.equal(filterBtnEl.getAttribute('aria-pressed'), 'false');
assert.equal(filterBtnEl.textContent.includes('OFF'), true);
assert.equal(filterSection.style.marginTop, '');
assert.equal(fUser1.row.getBoundingClientRect().top, filterBarEl.getBoundingClientRect().bottom, 'On initial load before J/K, first row must sit flush below filter bar without extra gap');

// When filter is OFF on /following, J / K steps across all cells (u1 -> u2 -> u3) and aligns each cell directly below the sticky filter bar (y = 161)
followingDoc.activeElement = null;
assert.equal(handleActionIfMatched(makeEv({ key: 'j', code: 'KeyJ' }), followingDoc, false), true);
assert.equal(followingDoc.activeElement, fUser1.link);
assert.equal(fUser1.row.getBoundingClientRect().top, 161);
assert.equal(handleActionIfMatched(makeEv({ key: 'j', code: 'KeyJ' }), followingDoc, false), true);
assert.equal(followingDoc.activeElement, fUser2.link, 'When filter is OFF, J visits mutual user u2');
assert.equal(fUser2.row.getBoundingClientRect().top, 161, 'Selected row u2 must align flush with sticky filter bar bottom (161px) without being covered');
assert.equal(fUser2.cell.getAttribute('data-xfs-focused'), 'true');
assert.equal(handleActionIfMatched(makeEv({ key: 'k', code: 'KeyK' }), followingDoc, false), true);
assert.equal(followingDoc.activeElement, fUser1.link);
assert.equal(fUser1.row.getBoundingClientRect().top, 161);

// Toggle ON via Shift+ㄹ (Korean IME Shift+F) on /following
assert.equal(
  handleActionIfMatched(makeEv({ key: 'ㄹ', code: 'KeyF', shiftKey: true }), followingDoc, false),
  true
);
assert.equal(getFilterNonFollowers(), true);
assert.equal(fUser1.cell.getAttribute('data-xfs-hidden'), null);
assert.equal(fUser2.cell.getAttribute('data-xfs-hidden'), 'true');
assert.equal(fUser2.row.getAttribute('data-xfs-hidden'), 'true');
assert.equal(fUser3.cell.getAttribute('data-xfs-hidden'), null);
assert.equal(filterBarEl.getAttribute('data-xfs-active'), 'true');
assert.equal(filterBtnEl.getAttribute('aria-pressed'), 'true');
assert.equal(filterBtnEl.textContent.includes('ON'), true);

// When filter is ON, J / K steps across visible non-followers only (u1 -> u3, skipping mutual u2) and updates data-xfs-focused
followingDoc.activeElement = null;
setFilterNonFollowers(false);
setFilterNonFollowers(true);
// Because u1 was already remembered as focused before toggling ON, pressing J steps directly to the next visible non-follower (u3), skipping mutual u2!
assert.equal(handleActionIfMatched(makeEv({ key: 'ㅓ', code: 'KeyJ' }), followingDoc, false), true);
assert.equal(followingDoc.activeElement, fUser3.link, 'Pressing J from u1 must skip hidden mutual user u2 and focus u3');
assert.equal(fUser3.row.getBoundingClientRect().top, 161, 'Selected non-follower u3 must align flush below sticky filter bar (161px)');
assert.equal(fUser1.cell.getAttribute('data-xfs-focused'), null);
assert.equal(fUser1.row.getAttribute('data-xfs-focused'), null);
assert.equal(fUser3.cell.getAttribute('data-xfs-focused'), 'true');
assert.equal(fUser3.row.getAttribute('data-xfs-focused'), 'true');
assert.equal(findProfileFollowButton(followingDoc, '/Hanssony_/following'), fUser3.btn);

assert.equal(handleActionIfMatched(makeEv({ key: 'ㅏ', code: 'KeyK' }), followingDoc, false), true);
assert.equal(followingDoc.activeElement, fUser1.link, 'Pressing K must skip hidden mutual user u2 and return to u1');
assert.equal(fUser1.row.getBoundingClientRect().top, 161);
assert.equal(fUser1.cell.getAttribute('data-xfs-focused'), 'true');
assert.equal(fUser3.cell.getAttribute('data-xfs-focused'), null);
assert.equal(findProfileFollowButton(followingDoc, '/Hanssony_/following'), fUser1.btn);

assert.equal(handleActionIfMatched(makeEv({ key: 'j', code: 'KeyJ' }), followingDoc, false), true);
assert.equal(followingDoc.activeElement, fUser3.link, 'Pressing J again steps to u3');
assert.equal(fUser3.row.getBoundingClientRect().top, 161);
assert.equal(fUser3.cell.getAttribute('data-xfs-focused'), 'true');

// If focus is somehow on mutual user u2 while filter is active (and no prior filtered cell is remembered), findProfileFollowButton returns null
setFilterNonFollowers(false);
setFilterNonFollowers(true);
followingDoc.activeElement = fUser2.link;
assert.equal(findProfileFollowButton(followingDoc, '/Hanssony_/following'), null);

// Leaving /following cleans up filter bar and hidden attributes
const statsFollowers = syncFollowingFilter(followingDoc, '/Hanssony_/followers');
assert.equal(statsFollowers.active, false);
assert.equal(filterBarEl, null);
assert.equal(fUser2.cell.getAttribute('data-xfs-hidden'), null);
assert.equal(filterSection.style.marginTop, '');

setFilterNonFollowers(false);

console.log('All assertions passed.');
