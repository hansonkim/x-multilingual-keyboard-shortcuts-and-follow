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

// Leaving filter pages (e.g. profile root /Hanssony_ or /home) cleans up filter bar and hidden attributes
const statsProfileRoot = syncFollowingFilter(followingDoc, '/Hanssony_');
assert.equal(statsProfileRoot.active, false);
assert.equal(filterBarEl, null);
assert.equal(followingDoc.documentElement.getAttribute('data-xfs-filter-mode'), null);
assert.equal(filterPrimary.getAttribute('data-xfs-filter-mode'), null);
assert.equal(fUser2.cell.getAttribute('data-xfs-hidden'), null);
assert.equal(filterSection.style.marginTop, '');

setFilterNonFollowers(false);

// 14c. Followers & Verified Followers (/followers, /verified_followers) unfollowed-followers filter
assert.equal(getFollowFilterMode('/Hanssony_/following'), 'following');
assert.equal(getFollowFilterMode('/Hanssony_/following/'), 'following');
assert.equal(getFollowFilterMode('/Hanssony_/followers'), 'followers');
assert.equal(getFollowFilterMode('/Hanssony_/followers/'), 'followers');
assert.equal(getFollowFilterMode('/Hanssony_/verified_followers'), 'followers');
assert.equal(getFollowFilterMode('/Hanssony_/verified_followers/'), 'followers');
assert.equal(getFollowFilterMode('/Hanssony_/followers_you_follow'), null);
assert.equal(getFollowFilterMode('/Hanssony_'), null);
assert.equal(getFollowFilterMode('/home'), null);

assert.equal(isFollowFilterPage('/Hanssony_/following'), true);
assert.equal(isFollowFilterPage('/Hanssony_/followers'), true);
assert.equal(isFollowFilterPage('/Hanssony_/verified_followers'), true);
assert.equal(isFollowFilterPage('/Hanssony_'), false);

// Verify localized labels for both 'following' and 'followers' modes
assert.equal(formatFollowingFilterLabel(false, 'ko', 'following'), '맞팔 안 한 계정만 보기: OFF');
assert.equal(formatFollowingFilterLabel(true, 'ko', 'following'), '맞팔 안 한 계정만 보기: ON');
assert.equal(formatFollowingFilterLabel(false, 'ko', 'followers'), '내가 팔로우 안 한 계정만 보기: OFF');
assert.equal(formatFollowingFilterLabel(true, 'ko', 'followers'), '내가 팔로우 안 한 계정만 보기: ON');
assert.equal(formatFollowingFilterLabel(true, 'en', 'followers'), 'Not followed back only: ON');
assert.equal(formatFollowingFilterLabel(true, 'zh', 'followers'), '仅看我未回关用户: ON');
assert.equal(formatFollowingFilterLabel(true, 'ja', 'followers'), '未フォローバックのみ表示: ON');

function createFollowerModeCell(id, state, opts = {}) {
  // state: 'follow' | 'unfollow' | 'cancel' | 'self' | 'skeleton'
  let btnState = state;
  const cellAttrs = new Map();
  const rowAttrs = new Map();
  const cellClasses = new Set();
  const rowClasses = new Set();
  const btn = makeMockFollowBtn(`${id}-btn`);
  const updateBtnTestId = (st) => {
    btnState = st;
    if (st === 'follow') btn.setAttribute('data-testid', `${id}-follow`);
    else if (st === 'unfollow') btn.setAttribute('data-testid', `${id}-unfollow`);
    else if (st === 'cancel') btn.setAttribute('data-testid', `${id}-cancel`);
    else btn.removeAttribute('data-testid');
  };
  updateBtnTestId(state);

  let row;
  const link = {
    id: `${id}-link`,
    isConnected: true,
    focus() {},
    getAttribute: (k) => (k === 'href' ? (opts.href || `/${id}`) : null),
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
      // Every follower on /followers and /verified_followers has userFollowIndicator!
      if (sel === '[data-testid="userFollowIndicator"]') {
        return opts.hasFollowsYouBadge === false ? null : {};
      }
      if (sel === '[data-testid$="-follow"]') {
        return btnState === 'follow' ? btn : null;
      }
      if (sel === '[data-testid$="-unfollow"], [data-testid$="-cancel"]') {
        return btnState === 'unfollow' || btnState === 'cancel' ? btn : null;
      }
      if (sel === '[data-testid^="UserAvatar-Container-"]') {
        return btnState === 'skeleton' ? null : {};
      }
      if (sel === 'a[role="link"][tabindex="-1"]') return link;
      if (sel.includes('-follow') || sel.includes('-unfollow')) {
        return btnState === 'follow' || btnState === 'unfollow' ? btn : null;
      }
      return null;
    },
    querySelectorAll(sel) {
      if (sel === 'a[href]') return btnState === 'skeleton' ? [] : [link];
      return [];
    }
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
  return { cell, row, link, btn, setBtnState: updateBtnTestId };
}

const flw1 = createFollowerModeCell('123', 'follow'); // unfollowed follower -> VISIBLE
const flw2 = createFollowerModeCell('456', 'unfollow'); // already followed back -> HIDDEN
const flw3 = createFollowerModeCell('789', 'cancel'); // pending protected request -> HIDDEN
const flwSelf = createFollowerModeCell('self', 'self', { href: '/Hanssony_', hasFollowsYouBadge: false }); // self-card -> HIDDEN
const flw4 = createFollowerModeCell('901', 'follow'); // unfollowed follower -> VISIBLE
const flw5 = createFollowerModeCell('902', 'follow'); // unfollowed follower -> VISIBLE
const flwSkeleton = createFollowerModeCell('skel', 'skeleton', { hasFollowsYouBadge: false }); // unrendered skeleton -> NOT hidden

let flw1Top = 161;
let flw2Top = 261;
let flw3Top = 351;
let flwSelfTop = 441;
let flw4Top = 531;
let flw5Top = 631;
let flwSkelTop = 731;
flw1.row.getBoundingClientRect = () => ({ top: flw1Top, bottom: flw1Top + 100, height: flw1.row.getAttribute('data-xfs-hidden') === 'true' ? 0 : 100 });
flw2.row.getBoundingClientRect = () => ({ top: flw2Top, bottom: flw2Top + 90, height: flw2.row.getAttribute('data-xfs-hidden') === 'true' ? 0 : 90 });
flw3.row.getBoundingClientRect = () => ({ top: flw3Top, bottom: flw3Top + 90, height: flw3.row.getAttribute('data-xfs-hidden') === 'true' ? 0 : 90 });
flwSelf.row.getBoundingClientRect = () => ({ top: flwSelfTop, bottom: flwSelfTop + 90, height: flwSelf.row.getAttribute('data-xfs-hidden') === 'true' ? 0 : 90 });
flw4.row.getBoundingClientRect = () => ({ top: flw4Top, bottom: flw4Top + 100, height: flw4.row.getAttribute('data-xfs-hidden') === 'true' ? 0 : 100 });
flw5.row.getBoundingClientRect = () => ({ top: flw5Top, bottom: flw5Top + 100, height: flw5.row.getAttribute('data-xfs-hidden') === 'true' ? 0 : 100 });
flwSkeleton.row.getBoundingClientRect = () => ({ top: flwSkelTop, bottom: flwSkelTop + 80, height: 80 });

let currentFlwCells = [flw1.cell, flw2.cell, flw3.cell, flwSelf.cell, flw4.cell, flw5.cell, flwSkeleton.cell];
const allFlwNodes = new Set([
  flw1.cell, flw1.row, flw1.link,
  flw2.cell, flw2.row, flw2.link,
  flw3.cell, flw3.row, flw3.link,
  flwSelf.cell, flwSelf.row, flwSelf.link,
  flw4.cell, flw4.row, flw4.link,
  flw5.cell, flw5.row, flw5.link,
  flwSkeleton.cell, flwSkeleton.row, flwSkeleton.link
]);

let flwStyleEl = null;
let flwBarEl = null;
let flwBtnEl = null;
const flwNavWrapper = { id: 'flw-nav-wrapper', nextSibling: null };
const flwNavParent = {
  insertBefore(el) {
    flwBarEl = el;
    el.parentNode = flwNavParent;
    el.previousSibling = flwNavWrapper;
  }
};
flwNavWrapper.parentNode = flwNavParent;
const flwNav = { parentNode: flwNavWrapper };
const flwTablist = {
  closest: (sel) => (sel.includes('nav') ? flwNav : null)
};
const flwPrimaryAttrs = new Map();
const flwPrimaryClasses = new Set();
const flwPrimary = {
  contains: (node) => allFlwNodes.has(node),
  getAttribute: (k) => flwPrimaryAttrs.get(k) ?? null,
  setAttribute: (k, v) => flwPrimaryAttrs.set(k, String(v)),
  removeAttribute: (k) => flwPrimaryAttrs.delete(k),
  classList: {
    add: (c) => flwPrimaryClasses.add(c),
    remove: (c) => flwPrimaryClasses.delete(c),
    contains: (c) => flwPrimaryClasses.has(c)
  },
  insertBefore(el) { flwBarEl = el; },
  appendChild(el) { flwBarEl = el; },
  querySelector(sel) {
    if (sel === '#xfs-following-filter-bar') return flwBarEl;
    if (sel === '[role="tablist"]') return flwTablist;
    return null;
  },
  querySelectorAll(sel) {
    if (sel === '[data-testid="UserCell"]') return currentFlwCells;
    return [];
  }
};

const flwDocAttrs = new Map();
const followersDoc = {
  body: mockBody,
  activeElement: null,
  documentElement: {
    lang: 'ko',
    style: { setProperty() {} },
    getAttribute: (k) => flwDocAttrs.get(k) ?? null,
    setAttribute: (k, v) => flwDocAttrs.set(k, String(v)),
    removeAttribute: (k) => flwDocAttrs.delete(k)
  },
  head: {
    appendChild(el) {
      if (el.id === 'xfs-filter-styles') flwStyleEl = el;
    }
  },
  getElementById(id) {
    if (id === 'xfs-filter-styles') return flwStyleEl;
    if (id === 'xfs-following-filter-bar') return flwBarEl;
    if (id === 'xfs-non-follower-toggle') return flwBtnEl;
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
        if (child.id === 'xfs-non-follower-toggle') flwBtnEl = child;
      },
      getBoundingClientRect() {
        return { top: 107, bottom: 161, height: 54 };
      },
      remove() {
        if (el === flwBarEl) flwBarEl = null;
        if (el === flwStyleEl) flwStyleEl = null;
      }
    };
    return el;
  },
  querySelector(sel) {
    if (sel === '[data-testid="primaryColumn"]') return flwPrimary;
    if (sel === 'header nav a[data-testid="AppTabBar_Profile_Link"]') {
      return { getAttribute: (k) => (k === 'href' ? '/Hanssony_' : null) };
    }
    return null;
  },
  querySelectorAll(sel) {
    if (sel.includes('data-xfs-hidden')) {
      return [
        flw1.cell, flw1.row, flw2.cell, flw2.row, flw3.cell, flw3.row,
        flwSelf.cell, flwSelf.row, flw4.cell, flw4.row, flw5.cell, flw5.row
      ].filter((n) => n.getAttribute('data-xfs-hidden') === 'true' || n.getAttribute('data-xfs-focused') === 'true');
    }
    return [];
  }
};

globalThis.window = {
  scrollBy(x, y) {
    flw1Top -= y;
    flw2Top -= y;
    flw3Top -= y;
    flwSelfTop -= y;
    flw4Top -= y;
    flw5Top -= y;
    flwSkelTop -= y;
  }
};

// 1) Seamless SPA tab switch (/following -> /followers -> /verified_followers) updates mode & label in-place without tearing down bar
globalThis.document = followersDoc;
globalThis.location = { pathname: '/Hanssony_/following' };
setFilterNonFollowers(false);
syncFollowingFilter(followersDoc, '/Hanssony_/following');
const mountedBarRef = flwBarEl;
assert.ok(mountedBarRef, 'Filter bar mounts on /following');
assert.equal(followersDoc.documentElement.getAttribute('data-xfs-filter-mode'), 'following');
assert.equal(flwPrimary.getAttribute('data-xfs-filter-mode'), 'following');
assert.equal(flwBtnEl.textContent, '맞팔 안 한 계정만 보기: OFF');

// Verify mode-scoped CSS rules: userFollowIndicator is strictly scoped to [data-xfs-filter-mode="following"] and :focus-visible is present
assert.ok(flwStyleEl && flwStyleEl.textContent.includes('.xfs-filter-non-followers[data-xfs-filter-mode="following"] [data-testid="cellInnerDiv"]:has([data-testid="userFollowIndicator"]'));
assert.ok(!flwStyleEl.textContent.includes('.xfs-filter-non-followers [data-testid="cellInnerDiv"]:has([data-testid="userFollowIndicator"]'));
assert.ok(flwStyleEl.textContent.includes('.xfs-filter-non-followers[data-xfs-filter-mode="followers"] [data-testid="cellInnerDiv"]:has([data-testid$="-unfollow"], [data-testid$="-cancel"], [data-xfs-hidden="true"])'));
assert.ok(flwStyleEl.textContent.includes('#xfs-non-follower-toggle:focus-visible'));

globalThis.location = { pathname: '/Hanssony_/followers' };
const statsFlwOff = syncFollowingFilter(followersDoc, '/Hanssony_/followers');
assert.equal(flwBarEl, mountedBarRef, 'Sticky filter bar must stay mounted across SPA switch to /followers');
assert.equal(followersDoc.documentElement.getAttribute('data-xfs-filter-mode'), 'followers');
assert.equal(flwPrimary.getAttribute('data-xfs-filter-mode'), 'followers');
assert.equal(flwBtnEl.textContent, '내가 팔로우 안 한 계정만 보기: OFF');
assert.deepEqual(statsFlwOff, { total: 7, nonFollowers: 4, mutuals: 3, active: false });

followersDoc.documentElement.lang = 'en';
globalThis.location = { pathname: '/Hanssony_/verified_followers' };
syncFollowingFilter(followersDoc, '/Hanssony_/verified_followers');
assert.equal(flwBarEl, mountedBarRef, 'Sticky filter bar must stay mounted across SPA switch to /verified_followers');
assert.equal(followersDoc.documentElement.getAttribute('data-xfs-filter-mode'), 'followers');
assert.equal(flwBtnEl.textContent, 'Not followed back only: OFF');
followersDoc.documentElement.lang = 'ko';

// 2 & 3) Shift+F toggles filter ON on /verified_followers and /followers; -follow cells (with userFollowIndicator) stay VISIBLE while -unfollow, -cancel, and self-card are HIDDEN
assert.equal(
  handleActionIfMatched(makeEv({ key: 'F', code: 'KeyF', shiftKey: true }), followersDoc, false),
  true
);
assert.equal(getFilterNonFollowers(), true);
assert.equal(isFollowingFilterActive('/Hanssony_/verified_followers'), true);
assert.equal(isFollowingFilterActive('/Hanssony_/followers'), true);
assert.equal(flwBtnEl.getAttribute('aria-pressed'), 'true');
assert.equal(flwBtnEl.textContent, '내가 팔로우 안 한 계정만 보기: ON');

globalThis.location = { pathname: '/Hanssony_/followers' };
syncFollowingFilter(followersDoc, '/Hanssony_/followers');
assert.equal(flw1.cell.getAttribute('data-xfs-hidden'), null, 'Unfollowed follower (123-follow + userFollowIndicator) must remain VISIBLE');
assert.equal(flw1.cell.getAttribute('data-xfs-mutual'), null, 'userFollowIndicator must NOT mark follower cell as mutual in followers mode');
assert.equal(flw2.cell.getAttribute('data-xfs-hidden'), 'true', 'Followed-back follower (456-unfollow) must be HIDDEN');
assert.equal(flw2.row.getAttribute('data-xfs-hidden'), 'true');
assert.equal(flw3.cell.getAttribute('data-xfs-hidden'), 'true', 'Pending request follower (789-cancel) must be HIDDEN');
assert.equal(flwSelf.cell.getAttribute('data-xfs-hidden'), 'true', 'Logged-in user self-card must be HIDDEN');
assert.equal(flw4.cell.getAttribute('data-xfs-hidden'), null, 'Unfollowed follower flw4 must remain VISIBLE');
assert.equal(flw5.cell.getAttribute('data-xfs-hidden'), null, 'Unfollowed follower flw5 must remain VISIBLE');
assert.equal(flwSkeleton.cell.getAttribute('data-xfs-hidden'), null, 'Unrendered skeleton cell must not be falsely hidden');

// Remove skeleton cell before J/K navigation test
currentFlwCells = [flw1.cell, flw2.cell, flw3.cell, flwSelf.cell, flw4.cell, flw5.cell];

// 4) J/K skips hidden (-unfollow / -cancel / self) follower cells, aligns below sticky bar (161px), and preserves scroll continuity after pressing F to follow back!
followersDoc.activeElement = null;
assert.equal(handleActionIfMatched(makeEv({ key: 'j', code: 'KeyJ' }), followersDoc, false), true);
assert.equal(followersDoc.activeElement, flw1.link, 'First J focuses flw1');
assert.equal(flw1.row.getBoundingClientRect().top, 161);

// Next J skips flw2 (-unfollow), flw3 (-cancel), and flwSelf, landing directly on flw4!
assert.equal(handleActionIfMatched(makeEv({ key: 'ㅓ', code: 'KeyJ' }), followersDoc, false), true);
assert.equal(followersDoc.activeElement, flw4.link, 'Second J skips hidden cells and focuses flw4');
assert.equal(flw4.row.getBoundingClientRect().top, 161, 'flw4 aligns flush below sticky filter bar (161px)');
assert.equal(flw4.cell.getAttribute('data-xfs-focused'), 'true');
assert.equal(findProfileFollowButton(followersDoc, '/Hanssony_/followers'), flw4.btn);

// Simulate pressing F on flw4 to follow back: button mutates in-place from 901-follow -> 901-unfollow (and flw5 shifts up in layout)
flw4.setBtnState('unfollow');
flw5Top = 161; // layout collapses flw4 to height 0 so flw5 shifts up to 161px while flw1 is scrolled above at -209px
assert.equal(shouldFilterOutUserCell(flw4.cell, 'followers', followersDoc), true, 'Follower cell state must not be cached in WeakMap after -follow -> -unfollow mutation');
syncFollowingFilter(followersDoc, '/Hanssony_/followers');
assert.equal(flw4.cell.getAttribute('data-xfs-hidden'), 'true', 'Newly followed flw4 immediately hides on re-sync');
assert.equal(flw4.cell.getAttribute('data-xfs-focused'), null);

// Pressing J now MUST continue forward to flw5 (whose top >= lastFocusedRowTop - 2) instead of resetting to index 0 (flw1 above viewport)!
assert.equal(handleActionIfMatched(makeEv({ key: 'j', code: 'KeyJ' }), followersDoc, false), true);
assert.equal(followersDoc.activeElement, flw5.link, 'After following flw4, pressing J must continue to flw5 instead of jumping back to index 0 (flw1)');
assert.equal(flw5.row.getBoundingClientRect().top, 161);

// Pressing K from flw5 skips hidden flw4/flwSelf/flw3/flw2 and returns to flw1
assert.equal(handleActionIfMatched(makeEv({ key: 'k', code: 'KeyK' }), followersDoc, false), true);
assert.equal(followersDoc.activeElement, flw1.link, 'Pressing K from flw5 skips hidden cells back to flw1');
assert.equal(flw1.row.getBoundingClientRect().top, 161);

// Shift+ㄹ toggles filter OFF on /followers and cleans up data-xfs-hidden while keeping bar mounted
assert.equal(
  handleActionIfMatched(makeEv({ key: 'ㄹ', code: 'KeyF', shiftKey: true }), followersDoc, false),
  true
);
assert.equal(getFilterNonFollowers(), false);
assert.equal(flwBtnEl.getAttribute('aria-pressed'), 'false');
assert.equal(flwBtnEl.textContent, '내가 팔로우 안 한 계정만 보기: OFF');
assert.equal(flw2.cell.getAttribute('data-xfs-hidden'), null);
assert.equal(flw4.cell.getAttribute('data-xfs-hidden'), null);
assert.ok(flwBarEl, 'Filter bar stays mounted when toggled OFF on /followers');

// Navigating to /home removes filter bar and styles
globalThis.location = { pathname: '/home' };
syncFollowingFilter(followersDoc, '/home');
assert.equal(flwBarEl, null);
assert.equal(flwStyleEl, null);
assert.equal(followersDoc.documentElement.getAttribute('data-xfs-filter-mode'), null);

// 15. Compact floating "게시됨" pill on /home and /notifications* (default On, toggle On/Off, 3 designs)
assert.equal(getCompactNewPostsPill(), true, 'Compact floating pill must default to On (true)');
assert.equal(getCompactPillDesign(), '3', 'Compact floating pill design must default to "3"');
assert.equal(isCompactPillPage('/home'), true);
assert.equal(isCompactPillPage('/home/'), true);
assert.equal(isCompactPillPage('/notifications'), true);
assert.equal(isCompactPillPage('/notifications/'), true);
assert.equal(isCompactPillPage('/notifications/verified'), true);
assert.equal(isCompactPillPage('/notifications/mentions'), true);
assert.equal(isCompactPillPage('/explore'), false);
assert.equal(isCompactPillPage('/Hanssony_'), false);
assert.equal(isCompactPillPage('/Hanssony_/following'), false);

let pillStyleEl = null;
const pillDocAttrs = new Map();
const pillElemAttrs = new Map();
const pillBtnAttrs = new Map();
const pillStatusAttrs = new Map();
const pillAlignAttrs = new Map();
const pillAvatarAttrs = new Map();
const pillSpan = { textContent: '새 게시물 보기' };
const pillAvatarWrap = {
  tagName: 'DIV',
  getAttribute: (k) => pillAvatarAttrs.get(k) ?? null,
  setAttribute: (k, v) => pillAvatarAttrs.set(k, String(v)),
  removeAttribute: (k) => pillAvatarAttrs.delete(k)
};
const pillAlignWrap = {
  getAttribute: (k) => pillAlignAttrs.get(k) ?? null,
  setAttribute: (k, v) => pillAlignAttrs.set(k, String(v)),
  removeAttribute: (k) => pillAlignAttrs.delete(k)
};
const pillStatusDiv = {
  parentElement: pillAlignWrap,
  getAttribute: (k) => pillStatusAttrs.get(k) ?? null,
  setAttribute: (k, v) => pillStatusAttrs.set(k, String(v)),
  removeAttribute: (k) => pillStatusAttrs.delete(k)
};
const pillBtn = {
  parentElement: pillStatusDiv,
  getAttribute: (k) => pillBtnAttrs.get(k) ?? null,
  setAttribute: (k, v) => pillBtnAttrs.set(k, String(v)),
  removeAttribute: (k) => pillBtnAttrs.delete(k)
};
const pillElem = {
  parentElement: { children: [{ tagName: 'svg' }, pillAvatarWrap] },
  getAttribute: (k) => pillElemAttrs.get(k) ?? null,
  setAttribute: (k, v) => pillElemAttrs.set(k, String(v)),
  removeAttribute: (k) => pillElemAttrs.delete(k),
  querySelector: (sel) => (sel === 'span' ? pillSpan : null),
  closest: (sel) => {
    if (sel.includes('button')) return pillBtn;
    if (sel.includes('[role="status"]')) return pillStatusDiv;
    return null;
  }
};
pillElem.parentElement.children.push(pillElem);
const pillDoc = {
  documentElement: {
    lang: 'ko',
    getAttribute: (k) => pillDocAttrs.get(k) ?? null,
    setAttribute: (k, v) => pillDocAttrs.set(k, String(v)),
    removeAttribute: (k) => pillDocAttrs.delete(k)
  },
  head: {
    appendChild(el) {
      if (el.id === 'xfs-pill-styles') pillStyleEl = el;
    }
  },
  getElementById(id) {
    if (id === 'xfs-pill-styles') return pillStyleEl;
    return null;
  },
  querySelectorAll(sel) {
    if (sel === '[data-testid="pillLabel"]') return [pillElem];
    if (sel.includes('data-xfs-pill-')) {
      return [pillAlignWrap, pillStatusDiv, pillBtn, pillAvatarWrap, pillElem];
    }
    return [];
  },
  createElement(tag) {
    const el = {
      tagName: tag.toUpperCase(),
      id: '',
      textContent: '',
      remove() {
        if (el === pillStyleEl) pillStyleEl = null;
      }
    };
    return el;
  }
};

// Verify formatCompactPillLabel localization across ko, en, zh, ja
assert.equal(formatCompactPillLabel('ko'), '게시됨');
assert.equal(formatCompactPillLabel('en'), 'Posted');
assert.equal(formatCompactPillLabel('zh'), '已发帖');
assert.equal(formatCompactPillLabel('ja'), 'ポスト済');

// Default ON (Design 3) on /home and /notifications* and dynamic pillLabel localization
assert.deepEqual(syncCompactPill(pillDoc, '/home'), { active: true, design: '3' });
assert.equal(pillDoc.documentElement.getAttribute('data-xfs-compact-pill'), '3');
assert.ok(pillStyleEl && pillStyleEl.textContent.includes('data-xfs-compact-pill="3"'));
assert.ok(pillStyleEl.textContent.includes('content: attr(data-xfs-label)'));
assert.equal(pillElem.getAttribute('data-xfs-label'), '게시됨');
assert.equal(pillSpan.textContent, '새 게시물 보기', 'React-owned pill text must never be mutated');

pillDoc.documentElement.lang = 'en';
syncCompactPill(pillDoc, '/home');
assert.equal(pillElem.getAttribute('data-xfs-label'), 'Posted');

pillDoc.documentElement.lang = 'ja';
syncCompactPill(pillDoc, '/home');
assert.equal(pillElem.getAttribute('data-xfs-label'), 'ポスト済');

pillDoc.documentElement.lang = 'zh';
syncCompactPill(pillDoc, '/home');
assert.equal(pillElem.getAttribute('data-xfs-label'), '已发帖');

pillDoc.documentElement.lang = 'ko';
syncCompactPill(pillDoc, '/home');
assert.equal(pillElem.getAttribute('data-xfs-label'), '게시됨');

// Switch across designs ('1', '2', '3') on /notifications/mentions
setCompactPillDesign('2');
assert.deepEqual(syncCompactPill(pillDoc, '/notifications/mentions'), { active: true, design: '2' });
assert.equal(pillDoc.documentElement.getAttribute('data-xfs-compact-pill'), '2');
assert.equal(pillBtn.getAttribute('data-xfs-pill-btn'), '2');
assert.equal(pillStatusDiv.getAttribute('data-xfs-pill-status'), '2');
assert.equal(pillAlignWrap.getAttribute('data-xfs-pill-align'), '2');
assert.equal(pillAvatarWrap.getAttribute('data-xfs-pill-avatars'), 'true');

setCompactPillDesign('3');
assert.deepEqual(syncCompactPill(pillDoc, '/notifications'), { active: true, design: '3' });
assert.equal(pillDoc.documentElement.getAttribute('data-xfs-compact-pill'), '3');
assert.equal(pillBtn.getAttribute('data-xfs-pill-btn'), '3');

// Immediate live config update via applyConfigUpdate (from popup sendMessage / storage.onChanged)
applyConfigUpdate({ compactNewPostsPill: false, compactPillDesign: '1' });
assert.equal(getCompactNewPostsPill(), false);
assert.equal(getCompactPillDesign(), '1');
assert.deepEqual(syncCompactPill(pillDoc, '/home'), { active: false, design: '1' });
assert.equal(pillBtn.getAttribute('data-xfs-pill-btn'), null);
assert.equal(pillStatusDiv.getAttribute('data-xfs-pill-status'), null);
assert.equal(pillAlignWrap.getAttribute('data-xfs-pill-align'), null);
assert.equal(pillAvatarWrap.getAttribute('data-xfs-pill-avatars'), null);
assert.equal(pillElem.getAttribute('data-xfs-label'), null);
assert.equal(pillSpan.textContent, '새 게시물 보기');

applyConfigUpdate({ compactNewPostsPill: true, compactPillDesign: '3' });
assert.equal(getCompactNewPostsPill(), true);
assert.equal(getCompactPillDesign(), '3');
assert.deepEqual(syncCompactPill(pillDoc, '/home'), { active: true, design: '3' });
assert.equal(pillBtn.getAttribute('data-xfs-pill-btn'), '3');

// Inactive on non-pill pages (e.g. /explore)
assert.deepEqual(syncCompactPill(pillDoc, '/explore'), { active: false, design: '3' });
assert.equal(pillDoc.documentElement.getAttribute('data-xfs-compact-pill'), null);
assert.equal(pillStyleEl, null);

// Toggle OFF disables compact pill even on /home
setCompactNewPostsPill(false);
assert.equal(isCompactPillActive('/home'), false);
assert.deepEqual(syncCompactPill(pillDoc, '/home'), { active: false, design: '3' });
assert.equal(pillDoc.documentElement.getAttribute('data-xfs-compact-pill'), null);

// Restore default ON & design '3'
setCompactPillDesign('3');
setCompactNewPostsPill(true);
assert.equal(isCompactPillActive('/home'), true);
assert.equal(isCompactPillActive('/notifications/verified'), true);

// Verify popup.html option order for #compact-pill-design is [1, 2, 3] with 3 selected by default
const fs = require('node:fs');
const popupHtml = fs.readFileSync(require('node:path').join(__dirname, 'popup.html'), 'utf8');
const designSelectMatch = popupHtml.match(/<select id="compact-pill-design"[^>]*>([\s\S]*?)<\/select>/);
assert.ok(designSelectMatch, 'popup.html must contain #compact-pill-design select');
const optionValues = Array.from(designSelectMatch[1].matchAll(/<option value="(\d+)"/g)).map((m) => m[1]);
assert.deepEqual(optionValues, ['1', '2', '3'], 'Compact pill design options must be ordered [1, 2, 3]');
assert.match(designSelectMatch[1], /<option value="1"[^>]*>1\. 우측 상단 글래스 캡슐<\/option>/);
assert.match(designSelectMatch[1], /<option value="2"[^>]*>2\. 상단 탭바 밀착 슬림 바<\/option>/);
assert.match(designSelectMatch[1], /<option value="3"[^>]*selected>3\. 우측 상단 초소형 아이콘 \(↑ \.\)<\/option>/);

// Manifest description length gate (Chrome Web Store enforces <= 132 characters)
const manifest = require('./manifest.json');
assert.ok(
  manifest.description.length <= 132,
  `manifest.json description length (${manifest.description.length}) exceeds Chrome Web Store 132-char limit`
);

// Ctrl+Enter during IME composition (Windows): wait for compositionend so the last syllable is not dropped
(async () => {
  const sent = [];
  const compListeners = {};
  const editor = {
    nodeType: 1,
    tagName: 'DIV',
    isContentEditable: true,
    addEventListener(type, fn) { (compListeners[type] ||= []).push(fn); },
    removeEventListener(type, fn) { compListeners[type] = (compListeners[type] || []).filter((f) => f !== fn); },
    dispatchEvent(ev) { sent.push({ type: ev.type, key: ev.key, ctrlKey: ev.ctrlKey }); return true; }
  };
  const editorDoc = { body: editor, activeElement: editor, querySelector: () => null, querySelectorAll: () => [] };
  const composingEv = makeEv({ key: 'Process', code: 'Enter', keyCode: 229, isComposing: true, ctrlKey: true, target: editor });
  assert.equal(handleActionIfMatched(composingEv, editorDoc, false), true);
  assert.equal(sent.length, 0, 'must not send Ctrl+Enter before the composition commits');
  for (const fn of compListeners.compositionend || []) fn({ type: 'compositionend' });
  // Windows Chromium fires a follow-up native keydown(Enter, keyCode: 13) right after compositionend;
  // it must be swallowed while the 50ms post-compositionend timer is pending.
  let followUpPrevented = false;
  const followUpNativeEnter = makeEv({
    key: 'Enter',
    code: 'Enter',
    keyCode: 13,
    which: 13,
    isComposing: false,
    ctrlKey: true,
    target: editor,
    preventDefault() { followUpPrevented = true; }
  });
  assert.equal(handleActionIfMatched(followUpNativeEnter, editorDoc, false), true);
  assert.equal(followUpPrevented, true, 'must swallow premature follow-up native Enter keydown right after compositionend');
  assert.equal(sent.length, 0, 'must not dispatch during follow-up native Enter before 50ms timer');
  await new Promise((r) => setTimeout(r, 10));
  assert.equal(sent.length, 0, 'must wait for Draft.js to apply the commit after compositionend');
  await new Promise((r) => setTimeout(r, 60));
  assert.equal(sent.filter((ev) => ev.type === 'keydown').length, 1, 'Ctrl+Enter sent exactly once after compositionend');
  assert.ok(sent.some((ev) => ev.type === 'keydown' && ev.key === 'Enter' && ev.ctrlKey), 'Ctrl+Enter sent after compositionend');
  const count = sent.length;
  await new Promise((r) => setTimeout(r, 350));
  assert.equal(sent.length, count, 'fallback timer must not send a second time');

  // Fallback: no compositionend -> still sends after timeout
  sent.length = 0;
  compListeners.compositionend = [];
  assert.equal(handleActionIfMatched(makeEv({ key: 'Process', code: 'Enter', keyCode: 229, isComposing: true, ctrlKey: true, target: editor }), editorDoc, false), true);
  await new Promise((r) => setTimeout(r, 350));
  assert.ok(sent.some((ev) => ev.type === 'keydown' && ev.key === 'Enter'), 'fallback sends Ctrl+Enter');

  // Late compositionend (280ms) cancels the 300ms fallback and still waits 50ms for Draft.js
  sent.length = 0;
  compListeners.compositionend = [];
  assert.equal(handleActionIfMatched(makeEv({ key: 'Process', code: 'Enter', keyCode: 229, isComposing: true, ctrlKey: true, target: editor }), editorDoc, false), true);
  await new Promise((r) => setTimeout(r, 280));
  for (const fn of compListeners.compositionend || []) fn({ type: 'compositionend' });
  await new Promise((r) => setTimeout(r, 35));
  assert.equal(sent.length, 0, 'fallback must be cancelled once compositionend arrives');
  await new Promise((r) => setTimeout(r, 40));
  assert.equal(sent.filter((ev) => ev.type === 'keydown').length, 1, 'sent exactly once after late compositionend');

  // scheduleUiSync setTimeout fallback when requestAnimationFrame is paused/throttled (occluded/background tab)
  let cancelledRafId = null;
  globalThis.requestAnimationFrame = () => 777; // stalled rAF that never invokes its callback
  globalThis.cancelAnimationFrame = (id) => { cancelledRafId = id; };
  try {
    globalThis.document = followersDoc;
    globalThis.location = { pathname: '/Hanssony_/following' };
    syncFollowingFilter(followersDoc, '/Hanssony_/following');
    assert.equal(followersDoc.documentElement.getAttribute('data-xfs-filter-mode'), 'following');

    // Simulate SPA route switch to /Hanssony_/followers while rAF is stalled
    globalThis.location = { pathname: '/Hanssony_/followers' };
    scheduleUiSync();
    await new Promise((r) => setTimeout(r, 55));
    assert.equal(cancelledRafId, 777, 'setTimeout fallback must cancel stalled rAF id');
    assert.equal(followersDoc.documentElement.getAttribute('data-xfs-filter-mode'), 'followers', 'setTimeout fallback must update filter mode when rAF is throttled');
    assert.equal(flwBtnEl.textContent, '내가 팔로우 안 한 계정만 보기: OFF');
  } finally {
    delete globalThis.requestAnimationFrame;
    delete globalThis.cancelAnimationFrame;
  }

  // 17. XChat (/i/chat, xchatEmbedRoute, xchatEmbedDrawer) Shadow DOM editable detection & IME regression tests
  {
    const hostDispatched = [];
    const textareaDispatched = [];
    const listboxDispatched = [];
    const chatCompListeners = {};

    const dmComposerTextarea = {
      nodeType: 1,
      tagName: 'TEXTAREA',
      isContentEditable: false,
      getAttribute: (k) => (k === 'data-testid' ? 'dm-composer-textarea' : null),
      closest: () => null,
      addEventListener(type, fn) {
        (chatCompListeners[type] ||= []).push(fn);
      },
      removeEventListener(type, fn) {
        chatCompListeners[type] = (chatCompListeners[type] || []).filter((f) => f !== fn);
      },
      dispatchEvent(ev) {
        textareaDispatched.push({ type: ev.type, key: ev.key, code: ev.code, ctrlKey: ev.ctrlKey, metaKey: ev.metaKey });
        return true;
      }
    };

    const dmSearchInput = {
      nodeType: 1,
      tagName: 'INPUT',
      isContentEditable: false,
      getAttribute: (k) => (k === 'data-testid' ? 'dm-search-input' : null),
      closest: () => null,
      dispatchEvent() {
        return true;
      }
    };

    const plaintextShadowEditor = {
      nodeType: 1,
      tagName: 'DIV',
      isContentEditable: false,
      getAttribute: (k) => (k === 'contenteditable' ? 'plaintext-only' : null),
      closest: () => null
    };

    const chatListbox = {
      nodeType: 1,
      tagName: 'DIV',
      isContentEditable: false,
      getAttribute: (k) => (k === 'role' ? 'listbox' : null),
      closest: () => null,
      dispatchEvent(ev) {
        listboxDispatched.push({ type: ev.type, key: ev.key, keyCode: ev.keyCode });
        return true;
      }
    };

    const chatFilterBtn = {
      nodeType: 1,
      tagName: 'BUTTON',
      isContentEditable: false,
      getAttribute: () => null,
      closest: () => null,
      dispatchEvent(ev) {
        listboxDispatched.push({ type: ev.type, key: ev.key, keyCode: ev.keyCode });
        return true;
      }
    };

    const xchatShadowRoot = {
      nodeType: 11,
      activeElement: dmComposerTextarea
    };

    // Outer Shadow Host (<div data-testid="xchatEmbedRoute">): e.target at window capture phase is retargeted to this DIV
    const xchatEmbedHost = {
      nodeType: 1,
      tagName: 'DIV',
      isContentEditable: false,
      shadowRoot: xchatShadowRoot,
      getAttribute: (k) => (k === 'data-testid' ? 'xchatEmbedRoute' : null),
      closest: () => null,
      dispatchEvent(ev) {
        hostDispatched.push({ type: ev.type, key: ev.key, keyCode: ev.keyCode });
        return true;
      }
    };

    const xchatDoc = {
      body: mockBody,
      documentElement: { nodeType: 1, tagName: 'HTML' },
      activeElement: xchatEmbedHost,
      querySelector: () => null,
      querySelectorAll: () => []
    };

    assert.equal(isEditable(xchatEmbedHost), true, 'Shadow host whose shadowRoot.activeElement is TEXTAREA must be editable');
    assert.equal(isEditable(plaintextShadowEditor), true, 'contenteditable="plaintext-only" must be editable');

    // 17a. Typing Korean 'ㅜ' (KeyN) and all other IME keys in /i/chat composer or search input NEVER triggers shortcuts
    const chatImeKeys = [
      { key: 'ㅜ', code: 'KeyN', keyCode: 229, isComposing: true },
      { key: 'Process', code: 'KeyN', keyCode: 229, isComposing: true },
      { key: 'ㅜ', code: '' },
      { key: 'み', code: 'KeyN' },
      { key: 'ㄙ', code: 'KeyN' },
      { key: 'ㅓ', code: 'KeyJ', keyCode: 229, isComposing: true },
      { key: 'ㅏ', code: 'KeyK', keyCode: 229, isComposing: true },
      { key: 'ㄹ', code: 'KeyF', keyCode: 229, isComposing: true },
      { key: 'ㄹ', code: 'KeyF', shiftKey: true },
      { key: 'ㅎ', code: 'KeyG', keyCode: 229, isComposing: true },
      { key: 'ㄷ', code: 'KeyE', keyCode: 229, isComposing: true },
      { key: '？', code: 'Slash', shiftKey: true },
      { key: '1', code: 'Digit1' }
    ];

    for (const activeInner of [dmComposerTextarea, dmSearchInput]) {
      xchatShadowRoot.activeElement = activeInner;
      for (const k of chatImeKeys) {
        clearPendingPrefix();
        let prevented = false;
        const ev = makeEv({
          ...k,
          target: xchatEmbedHost,
          composedPath: () => [activeInner, { nodeType: 1, tagName: 'DIV', getAttribute: () => null, closest: () => null }, xchatShadowRoot, xchatEmbedHost, mockBody, xchatDoc],
          preventDefault() {
            prevented = true;
          }
        });
        assert.equal(isEditableEvent(ev, xchatDoc), true);
        assert.equal(
          handleActionIfMatched(ev, xchatDoc, false),
          false,
          `Typing ${JSON.stringify(k)} inside Shadow DOM ${activeInner.tagName} must never trigger global shortcut`
        );
        assert.equal(prevented, false, 'Must not preventDefault on chat text input');
      }
    }
    assert.equal(hostDispatched.length, 0);
    assert.equal(textareaDispatched.length, 0);

    // 17b. Also test real window keydown + keyup listeners (including keyCode 229 keydown -> Korean keyup fallback)
    globalThis.document = xchatDoc;
    globalThis.location = { pathname: '/i/chat/bots/936b9958-8d19-4b8c-9013-f652a2ccc727' };
    xchatShadowRoot.activeElement = dmComposerTextarea;
    dispatchedEvents.length = 0;
    let windowKdPrevented = false;
    const realCaptureKd = makeEv({
      key: 'Process',
      code: '',
      keyCode: 229,
      which: 229,
      isComposing: true,
      target: xchatEmbedHost,
      composedPath: () => [dmComposerTextarea, xchatShadowRoot, xchatEmbedHost, mockBody, xchatDoc],
      preventDefault() {
        windowKdPrevented = true;
      }
    });
    const realCaptureKu = makeEv({
      key: 'ㅜ',
      code: 'KeyN',
      keyCode: 78,
      which: 78,
      isComposing: false,
      target: xchatEmbedHost,
      composedPath: () => [dmComposerTextarea, xchatShadowRoot, xchatEmbedHost, mockBody, xchatDoc]
    });
    for (const fn of listeners.keydown) fn(realCaptureKd);
    for (const fn of listeners.keyup) fn(realCaptureKu);
    assert.equal(windowKdPrevented, false);
    assert.equal(hostDispatched.length, 0);
    assert.equal(textareaDispatched.length, 0);
    assert.equal(dispatchedEvents.length, 0);

    // 17c. Even when NO input is focused inside /i/chat (e.g. user clicked chat message log, conversation listbox, or PIN pad),
    // pressing Korean 'ㅜ' (KeyN) or single-key tweet shortcuts MUST NOT open Compose Post ('n'), while 'g + h' / '?' navigation still works!
    for (const nonEditableInner of [chatListbox, chatFilterBtn]) {
      xchatShadowRoot.activeElement = nonEditableInner;
      listboxDispatched.length = 0;
      clearPendingPrefix();
      const nonEditEv = makeEv({
        key: 'ㅜ',
        code: 'KeyN',
        target: xchatEmbedHost,
        composedPath: () => [nonEditableInner, xchatShadowRoot, xchatEmbedHost, mockBody, xchatDoc]
      });
      assert.equal(isEditable(xchatEmbedHost), false);
      assert.equal(isEditableEvent(nonEditEv, xchatDoc), false);
      assert.equal(isInsideXChatContext(nonEditEv, xchatDoc), true);
      assert.equal(
        handleActionIfMatched(nonEditEv, xchatDoc, false),
        false,
        'Korean ㅜ inside XChat must never open Compose Post even when textarea lost focus'
      );
      assert.equal(listboxDispatched.length, 0);

      // Global 'g h' navigation still works on /i/chat when no input is focused
      const gPrefixEv = makeEv({
        key: 'ㅎ',
        code: 'KeyG',
        target: xchatEmbedHost,
        composedPath: () => [nonEditableInner, xchatShadowRoot, xchatEmbedHost, mockBody, xchatDoc]
      });
      const gHomeEv = makeEv({
        key: 'ㅗ',
        code: 'KeyH',
        target: xchatEmbedHost,
        composedPath: () => [nonEditableInner, xchatShadowRoot, xchatEmbedHost, mockBody, xchatDoc]
      });
      assert.equal(handleActionIfMatched(gPrefixEv, xchatDoc, false), true);
      assert.equal(handleActionIfMatched(gHomeEv, xchatDoc, false), true);
      assert.deepEqual(
        listboxDispatched.map((d) => `${d.type}:${d.key}`),
        ['keydown:g', 'keypress:g', 'keydown:h', 'keypress:h']
      );
    }

    // 17d. Cmd+Enter / Ctrl+Enter during Korean IME composition inside Shadow DOM dm-composer-textarea
    // binds compositionend to the inner TEXTAREA and dispatches Enter onto the inner TEXTAREA (not outer shadow host)
    xchatShadowRoot.activeElement = dmComposerTextarea;
    textareaDispatched.length = 0;
    hostDispatched.length = 0;
    chatCompListeners.compositionend = [];
    const shadowCtrlEnter = makeEv({
      key: 'Process',
      code: 'Enter',
      keyCode: 229,
      isComposing: true,
      metaKey: true,
      target: xchatEmbedHost,
      composedPath: () => [dmComposerTextarea, xchatShadowRoot, xchatEmbedHost, mockBody, xchatDoc]
    });
    assert.equal(handleActionIfMatched(shadowCtrlEnter, xchatDoc, false), true);
    assert.equal(textareaDispatched.length, 0);
    for (const fn of chatCompListeners.compositionend || []) fn({ type: 'compositionend' });
    await new Promise((r) => setTimeout(r, 65));
    assert.equal(hostDispatched.length, 0, 'Must dispatch inside shadowRoot on TEXTAREA, not outer host DIV');
    assert.equal(
      textareaDispatched.filter((d) => d.type === 'keydown' && d.key === 'Enter' && d.metaKey).length,
      1,
      'Cmd+Enter after compositionend must dispatch directly on Shadow DOM TEXTAREA'
    );

    // 17e. Untrusted synthetic shortcut events (isTrusted: false) dispatched onto outer Shadow Host by legacy / co-installed
    // extensions while a Shadow DOM editable is active MUST be swallowed on keydown, keypress, and keyup,
    // while synthetic events originating inside the Shadow DOM itself are allowed.
    xchatShadowRoot.activeElement = dmComposerTextarea;
    xchatShadowRoot.contains = (node) => node === dmComposerTextarea || node === dmSearchInput;
    for (const type of ['keydown', 'keypress', 'keyup']) {
      let prevented = false;
      let stopped = false;
      const externalSyntheticEv = {
        type,
        key: 'n',
        code: '',
        keyCode: type === 'keypress' ? 110 : 78,
        isTrusted: false,
        target: xchatEmbedHost,
        composedPath: () => [xchatEmbedHost, mockBody, xchatDoc],
        preventDefault() {
          prevented = true;
        },
        stopPropagation() {},
        stopImmediatePropagation() {
          stopped = true;
        }
      };
      assert.equal(shouldSwallowUntrustedShadowEvent(externalSyntheticEv, xchatDoc), true);
      for (const fn of listeners[type] || []) fn(externalSyntheticEv);
      assert.equal(prevented, true, `External synthetic ${type} on shadow host must preventDefault`);
      assert.equal(stopped, true, `External synthetic ${type} on shadow host must stopImmediatePropagation`);

      let internalStopped = false;
      const internalSyntheticEv = {
        type,
        key: 'n',
        code: 'KeyN',
        keyCode: 78,
        isTrusted: false,
        target: xchatEmbedHost,
        composedPath: () => [dmComposerTextarea, xchatShadowRoot, xchatEmbedHost, mockBody, xchatDoc],
        preventDefault() {},
        stopPropagation() {},
        stopImmediatePropagation() {
          internalStopped = true;
        }
      };
      assert.equal(shouldSwallowUntrustedShadowEvent(internalSyntheticEv, xchatDoc), false);
      for (const fn of listeners[type] || []) fn(internalSyntheticEv);
      assert.equal(internalStopped, false, `Internal shadow DOM ${type} event must not be swallowed`);
    }

    // 17f. Closed Shadow DOM (chrome.dom.openOrClosedShadowRoot), cross-shadow-boundary [role="combobox"]/[role="textbox"],
    // EditContext, and <iframe> focus must all be detected as editable / embedded contexts.
    {
      const closedInput = {
        nodeType: 1,
        tagName: 'DIV',
        isContentEditable: false,
        editContext: {},
        getAttribute: () => null,
        closest: () => null
      };
      const closedShadow = { nodeType: 11, activeElement: closedInput };
      const closedHost = {
        nodeType: 1,
        tagName: 'DIV',
        shadowRoot: null,
        getAttribute: () => null,
        closest: () => null
      };
      const prevChrome = globalThis.chrome;
      globalThis.chrome = {
        ...(prevChrome || {}),
        dom: {
          openOrClosedShadowRoot: (el) => (el === closedHost ? closedShadow : null)
        }
      };
      try {
        const closedDoc = { body: mockBody, activeElement: closedHost, querySelector: () => null, querySelectorAll: () => [] };
        const ev = makeEv({ key: 'ㅜ', code: 'KeyN', target: closedHost, composedPath: () => [closedHost, mockBody, closedDoc] });
        assert.equal(isEditable(closedHost), true, 'Closed shadow host with EditContext activeElement must be editable');
        assert.equal(isEditableEvent(ev, closedDoc), true);
        assert.equal(handleActionIfMatched(ev, closedDoc, false), false);
      } finally {
        globalThis.chrome = prevChrome;
      }

      // Cross-shadow-boundary: inner custom element inside outer [role="combobox"] host
      const comboboxHost = {
        nodeType: 1,
        tagName: 'DIV',
        isContentEditable: false,
        getAttribute: (k) => (k === 'role' ? 'combobox' : null),
        closest: () => null
      };
      const innerShadow = { nodeType: 11, host: comboboxHost };
      const innerSpan = {
        nodeType: 1,
        tagName: 'SPAN',
        isContentEditable: false,
        getAttribute: () => null,
        closest: () => null,
        getRootNode: () => innerShadow
      };
      innerShadow.activeElement = innerSpan;
      comboboxHost.shadowRoot = innerShadow;
      const comboDoc = { body: mockBody, activeElement: comboboxHost, querySelector: () => null, querySelectorAll: () => [] };
      const comboEv = makeEv({ key: 'ㅜ', code: 'KeyN', target: comboboxHost, composedPath: () => [innerSpan, innerShadow, comboboxHost] });
      assert.equal(isEditableEvent(comboEv, comboDoc), true, 'Element inside shadow child of [role="combobox"] must be editable');

      // Cross-origin <iframe> focus
      const crossOriginIframe = {
        nodeType: 1,
        tagName: 'IFRAME',
        get contentDocument() {
          throw new Error('SecurityError: cross-origin iframe');
        },
        getAttribute: () => null,
        closest: () => null
      };
      const iframeDoc = { body: mockBody, activeElement: crossOriginIframe, querySelector: () => null, querySelectorAll: () => [] };
      const iframeEv = makeEv({ key: 'ㅜ', code: 'KeyN', target: mockBody, composedPath: () => [mockBody, iframeDoc] });
      assert.equal(isEditableEvent(iframeEv, iframeDoc), true, 'Focused cross-origin IFRAME must suppress parent shortcuts');
      assert.equal(handleActionIfMatched(iframeEv, iframeDoc, false), false);
    }

    // 17g. Floating Chat Drawer (xchatEmbedDrawer) & Chat Overlays (xchatEmbedOverlays) on /home and /following:
    // even when a non-editable element (e.g. 4-digit PIN pad or chat message bubble) is focused inside the drawer,
    // 1-9 tab switching, J/K cell stepping, F follow, Shift+F filter, ㅜ -> n, and g + h navigation must all be suppressed.
    {
      let homeTabClicked = 0;
      const pinBox = {
        nodeType: 1,
        tagName: 'DIV',
        isContentEditable: false,
        getAttribute: () => null,
        closest: () => null
      };
      const drawerShadow = { nodeType: 11, activeElement: pinBox };
      const drawerHost = {
        nodeType: 1,
        tagName: 'DIV',
        shadowRoot: drawerShadow,
        getAttribute: (k) => (k === 'data-testid' ? 'xchatEmbedDrawer' : null),
        closest: () => null
      };
      const mockHomeTab = { click() { homeTabClicked++; } };
      const homeWithDrawerDoc = {
        body: mockBody,
        documentElement: { nodeType: 1, tagName: 'HTML' },
        activeElement: drawerHost,
        querySelector: (sel) =>
          sel === '[data-testid="primaryColumn"] [role="tablist"]'
            ? { querySelectorAll: () => [mockHomeTab] }
            : null,
        querySelectorAll: () => []
      };
      globalThis.location = { pathname: '/home' };
      assert.equal(isInsideXChatOverlay(null, homeWithDrawerDoc), true);
      for (const k of [
        { key: '1', code: 'Digit1' },
        { key: 'ㅜ', code: 'KeyN' },
        { key: 'ㅓ', code: 'KeyJ' },
        { key: 'ㅎ', code: 'KeyG' }
      ]) {
        const ev = makeEv({
          ...k,
          target: drawerHost,
          composedPath: () => [pinBox, drawerShadow, drawerHost, mockBody, homeWithDrawerDoc]
        });
        assert.equal(handleActionIfMatched(ev, homeWithDrawerDoc, false), false);
      }
      assert.equal(homeTabClicked, 0, 'Digits 1-9 inside xchatEmbedDrawer PIN/chat UI must not switch /home tabs');
    }

    // 17h. Unresolved editable keydown (code: '', key: 'Process', keyCode: 229) where popup input closes before keyup
    // must NOT trigger the keyup fallback shortcut!
    {
      const transientInput = {
        nodeType: 1,
        tagName: 'INPUT',
        isContentEditable: false,
        getAttribute: () => null,
        closest: () => null
      };
      const transientDoc = {
        body: mockBody,
        documentElement: { nodeType: 1, tagName: 'HTML' },
        activeElement: transientInput,
        querySelector: () => null,
        querySelectorAll: () => []
      };
      globalThis.document = transientDoc;
      globalThis.location = { pathname: '/home' };
      dispatchedEvents.length = 0;

      const kdInPopup = makeEv({
        key: 'Process',
        code: '',
        keyCode: 229,
        which: 229,
        isComposing: true,
        target: transientInput,
        composedPath: () => [transientInput, mockBody, transientDoc]
      });
      for (const fn of listeners.keydown) fn(kdInPopup);

      // Popup closes before keyup arrives -> activeElement becomes document.body!
      transientDoc.activeElement = mockBody;
      const kuAfterClose = makeEv({
        key: 'ㅜ',
        code: '',
        keyCode: 78,
        which: 78,
        isComposing: false,
        target: mockBody,
        composedPath: () => [mockBody, transientDoc]
      });
      for (const fn of listeners.keyup) fn(kuAfterClose);
      assert.equal(dispatchedEvents.length, 0, 'keyup after unresolved editable keydown must not fire shortcut');
    }
  }

  console.log('All assertions passed.');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
