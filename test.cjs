const assert = require('node:assert/strict');
const listeners = {};
globalThis.window = {
  addEventListener(type, fn) {
    (listeners[type] ||= []).push(fn);
  }
};
const storageOnChangedListeners = [];
globalThis.chrome = {
  storage: {
    sync: {
      get(keys, cb) {
        const res = {};
        if (typeof cb === 'function') cb(res);
        return Promise.resolve(res);
      },
      set(obj, cb) {
        if (typeof cb === 'function') cb();
        return Promise.resolve();
      }
    },
    onChanged: {
      addListener(fn) {
        storageOnChangedListeners.push(fn);
      }
    }
  }
};
globalThis.document = {
  documentElement: {
    style: {
      setProperty() {},
      getPropertyValue() { return ''; }
    }
  },
  body: {},
  querySelector: () => null,
  querySelectorAll: () => [],
  getElementById: () => null
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
  getLoggedInUsername,
  findStatusFollowButton,
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
  normalizeUiLang,
  getUiLang,
  setUiLang,
  LOCAL_STORAGE_UI_LANG_KEY,
  LOCAL_STORAGE_COMPACT_PILL_DESIGN_KEY,
  getUserscriptMenuStrings,
  registerUserscriptMenuCommands,
  isImeKey,
  isPotentialImeKey,
  isPureAsciiOrphanKeyup,
  handleMouseOver,
  isApplePlatform,
  resolveKeyCode,
  formatShortcutLabel,
  applyConfigUpdate,
  syncCompactPill,
  syncFollowingFilter,
  scheduleUiSync,
  scheduleBackgroundUiSync,
  shouldScheduleSyncForMutations,
  syncUiHints
} = require('./content.js');
delete globalThis.chrome;

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
        if (prevChrome !== undefined) {
          globalThis.chrome = prevChrome;
        } else {
          delete globalThis.chrome;
        }
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

    // 18. Audit regression tests (IME switch keys, Process punctuation labels, prefix vs custom shortcut, reserved routes, dropdown KeyU & CJK Quote)
    {
      const contentMod = require('./content.js');
      const popupMod = require('./popup.js');

      // 18a. RomanCharacters ignored as IME switch key in both content.js and popup.js; popup resolveKeyCode special-key parity
      assert.equal(contentMod.resolveKeyCode({ key: 'RomanCharacters', code: 'RomanCharacters' }), null);
      assert.equal(popupMod.resolveKeyCode({ key: 'RomanCharacters', code: 'RomanCharacters' }), null);
      assert.equal(popupMod.resolveKeyCode({ key: 'Enter', code: '' }), 'Enter');
      assert.equal(popupMod.resolveKeyCode({ key: 'Escape', code: '' }), 'Escape');
      assert.equal(popupMod.resolveKeyCode({ key: 'Tab', code: '' }), 'Tab');
      assert.equal(popupMod.resolveKeyCode({ key: 'Spacebar', code: '' }), 'Space');
      assert.equal(popupMod.resolveKeyCode({ key: '', code: '', keyCode: 13 }), 'Enter');

      // 18b. CJK IME Process key with punctuation code formats as ';' rather than 'PROCESS'
      const semiImeShortcut = { key: 'Process', code: 'Semicolon', ctrl: false, alt: false, shift: false, meta: false };
      assert.equal(contentMod.formatShortcutLabel(semiImeShortcut), ';');
      assert.equal(popupMod.formatShortcut(semiImeShortcut), ';');

      // 18c. Custom Follow shortcut (e.g. KeyP / KeyM) must never hijack 'g + p' or 'a + m' prefix sequences
      let followBtnClicked = 0;
      const customSeqBtn = {
        click() { followBtnClicked++; },
        getAttribute: (k) => (k === 'data-testid' ? '123-follow' : null),
        closest: () => null
      };
      const customSeqPrimary = {
        querySelector: (sel) => (sel === '[data-testid="UserName"]' ? {} : null),
        querySelectorAll: () => [customSeqBtn]
      };
      const customSeqDoc = {
        body: mockBody,
        activeElement: mockBody,
        querySelector: (sel) => (sel === '[data-testid="primaryColumn"]' ? customSeqPrimary : null),
        querySelectorAll: () => []
      };
      try {
        globalThis.location = { pathname: '/DonMacKR' };
        dispatchedEvents.length = 0;
        globalThis.document = customSeqDoc;
        applyConfigUpdate({ shortcut: { ...DEFAULT_SHORTCUT, key: 'p', code: 'KeyP' } });
        clearPendingPrefix();
        assert.equal(handleActionIfMatched(makeEv({ key: 'ㅎ', code: 'KeyG' }), customSeqDoc, false), true);
        assert.equal(handleActionIfMatched(makeEv({ key: 'ㅔ', code: 'KeyP' }), customSeqDoc, false), true);
        assert.equal(followBtnClicked, 0, 'Custom Follow key P must not hijack g + p (Profile)');

        applyConfigUpdate({ shortcut: { ...DEFAULT_SHORTCUT, key: 'm', code: 'KeyM' } });
        clearPendingPrefix();
        assert.equal(handleActionIfMatched(makeEv({ key: 'ㅁ', code: 'KeyA' }), customSeqDoc, false), true);
        assert.equal(handleActionIfMatched(makeEv({ key: 'ㅡ', code: 'KeyM' }), customSeqDoc, false), true);
        assert.equal(followBtnClicked, 0, 'Custom Follow key M must not hijack a + m (Audio mute)');

        // Standalone M still triggers custom Follow shortcut when no prefix is active
        clearPendingPrefix();
        assert.equal(handleActionIfMatched(makeEv({ key: 'ㅡ', code: 'KeyM' }), customSeqDoc, false), true);
        assert.equal(followBtnClicked, 1, 'Standalone custom Follow key M clicks Follow button');
      } finally {
        applyConfigUpdate({ shortcut: { ...DEFAULT_SHORTCUT } });
      }

      // 18d. Reserved top-level routes (/hashtag/AI, /grok, /communities, /spaces, /account) with tweet UserName resolve g+w to logged-in user
      const hashtagDoc = {
        body: mockBody,
        activeElement: mockBody,
        querySelector(sel) {
          if (sel === '[data-testid="primaryColumn"] [data-testid="UserName"]') return {};
          if (sel === 'header nav a[data-testid="AppTabBar_Profile_Link"]') {
            return { getAttribute: (k) => (k === 'href' ? '/Hanssony_' : null) };
          }
          return null;
        },
        querySelectorAll: () => []
      };
      for (const route of ['/hashtag/AI', '/grok', '/communities', '/spaces', '/account']) {
        globalThis.location = { pathname: route };
        clearPendingPrefix();
        assert.equal(handleActionIfMatched(makeEv({ key: 'ㅎ', code: 'KeyG' }), hashtagDoc, false), true);
        assert.equal(handleActionIfMatched(makeEv({ key: 'ㅈ', code: 'KeyW' }), hashtagDoc, false), true);
        assert.equal(globalThis.location.pathname, '/Hanssony_/followers', `Route ${route} must not navigate to ${route.split('/')[1]}/followers`);
      }

      // 18e. Open Dropdown menu supports KeyU ([data-testid="mute"]) and KeyE spaceless Japanese/Chinese Quote fallback
      let mutedClicked = 0;
      let jaQuoteClicked = 0;
      const muteItem = { click() { mutedClicked++; } };
      const jaQuoteItem = { textContent: 'ポストを引用', click() { jaQuoteClicked++; } };
      const dropdownEl = {
        querySelector(sel) {
          if (sel === '[data-testid="mute"]') return muteItem;
          return null;
        },
        querySelectorAll(sel) {
          if (sel.includes('[role="menuitem"]')) return [jaQuoteItem];
          return [];
        }
      };
      const dropdownDoc = {
        body: mockBody,
        activeElement: mockBody,
        querySelector: (sel) => (sel === '[data-testid="Dropdown"]' ? dropdownEl : null),
        querySelectorAll: () => []
      };
      clearPendingPrefix();
      assert.equal(handleActionIfMatched(makeEv({ key: 'ㅕ', code: 'KeyU' }), dropdownDoc, false), true);
      assert.equal(mutedClicked, 1, 'KeyU must click [data-testid="mute"] when Dropdown is open');
      assert.equal(handleActionIfMatched(makeEv({ key: 'い', code: 'KeyE' }), dropdownDoc, false), true);
      assert.equal(jaQuoteClicked, 1, 'KeyE must match Japanese ポストを引用 menu item when Dropdown is open');

      // 18f. Plain 1-9 switches /home tabs, while G + 1-9/0 and Digit0 do NOT switch tabs
      let switchedTabIdx = -1;
      const mockHomeTabs = Array.from({ length: 10 }, (_, idx) => ({ click() { switchedTabIdx = idx; } }));
      const homeTabDoc = {
        body: mockBody,
        activeElement: mockBody,
        querySelector: (sel) =>
          sel === '[data-testid="primaryColumn"] [role="tablist"]'
            ? { querySelectorAll: () => mockHomeTabs }
            : null,
        querySelectorAll: () => []
      };
      globalThis.location = { pathname: '/home' };
      clearPendingPrefix();
      assert.equal(contentMod.findHomeTabLink('Digit0', homeTabDoc, '/home'), null);
      assert.equal(handleActionIfMatched(makeEv({ key: '0', code: 'Digit0' }), homeTabDoc, false), false);
      assert.equal(switchedTabIdx, -1);

      assert.equal(handleActionIfMatched(makeEv({ key: 'ㅎ', code: 'KeyG' }), homeTabDoc, false), true);
      assert.equal(handleActionIfMatched(makeEv({ key: '1', code: 'Digit1' }), homeTabDoc, false), false);
      assert.equal(switchedTabIdx, -1, 'G + 1 must not switch /home tabs');

      assert.equal(handleActionIfMatched(makeEv({ key: '2', code: 'Digit2' }), homeTabDoc, false), true);
      assert.equal(switchedTabIdx, 1, 'Plain Digit2 switches to 2nd /home tab');
      clearPendingPrefix();
    }
  }

    // ---------------------------------------------------------------------------
    // 19. Category A.1: Window Focus Guard & Orphan Keyup Filter
    // ---------------------------------------------------------------------------
    {
      const contentMod = require('./content.js');

      // 19a. Window Focus Guard Timing (<180ms dropped, >=180ms processed)
      {
        clearPendingPrefix();
        const origDateNow = Date.now;
        let mockNow = 5000000;
        Date.now = () => mockNow;

        let followBtnClicked = 0;
        const testFollowBtn = {
          click() { followBtnClicked++; },
          getAttribute(attr) {
            if (attr === 'data-testid') return 'test-user-follow';
            return null;
          },
          closest() { return null; }
        };

        const focusDoc = {
          body: mockBody,
          activeElement: mockBody,
          querySelector(sel) {
            if (sel === '[data-testid="primaryColumn"]') {
              return {
                querySelector: (s) => (s === '[data-testid="UserName"]' ? {} : null),
                querySelectorAll: () => [testFollowBtn]
              };
            }
            return null;
          },
          querySelectorAll: () => []
        };

        const prevDoc = globalThis.document;
        const prevLoc = globalThis.location;
        globalThis.document = focusDoc;
        globalThis.location = { pathname: '/TargetUser' };

        try {
          const focusTime = 5000000;
          mockNow = focusTime;
          for (const fn of listeners.focus || []) {
            fn({ target: globalThis.window });
          }

          const timingDelays = [
            { delay: 0, shouldDiscard: true },
            { delay: 50, shouldDiscard: true },
            { delay: 100, shouldDiscard: true },
            { delay: 179, shouldDiscard: true },
            { delay: 180, shouldDiscard: false }, // boundary: 180 < 180 is false -> allowed
            { delay: 181, shouldDiscard: false },
            { delay: 300, shouldDiscard: false }
          ];

          for (const tt of timingDelays) {
            clearPendingPrefix();
            mockNow = focusTime;
            for (const fn of listeners.focus || []) {
              fn({ target: globalThis.window });
            }

            followBtnClicked = 0;
            mockNow = focusTime + tt.delay;

            const imeKeyupEv = makeEv({
              key: 'ㄹ',
              code: 'KeyF',
              isComposing: false,
              target: mockBody
            });

            for (const fn of listeners.keyup || []) {
              fn(imeKeyupEv);
            }

            if (tt.shouldDiscard) {
              assert.equal(
                followBtnClicked,
                0,
                `Focus guard delay ${tt.delay}ms must discard orphan keyup without triggering action`
              );
            } else {
              assert.equal(
                followBtnClicked,
                1,
                `Focus guard delay ${tt.delay}ms must allow valid keyup to proceed and execute action`
              );
            }
          }
        } finally {
          clearPendingPrefix();
          Date.now = origDateNow;
          globalThis.document = prevDoc;
          globalThis.location = prevLoc;
        }
      }

      // 19b. Orphan ASCII / Enter / Space Keyup Suppressed, Korean & CJK IME Keyup Recovery Preserved
      {
        const pureAsciiKeys = [
          { key: 'f', code: 'KeyF' },
          { key: 'j', code: 'KeyJ' },
          { key: 'k', code: 'KeyK' },
          { key: '1', code: 'Digit1' },
          { key: '2', code: 'Digit2' },
          { key: '9', code: 'Digit9' },
          { key: 'Enter', code: 'Enter' },
          { key: 'Enter', code: '' },
          { key: '', code: 'Enter' },
          { key: ' ', code: 'Space' },
          { key: 'Spacebar', code: 'Space' },
          { key: '', code: 'Space' },
          { key: '.', code: 'Period' },
          { key: '/', code: 'Slash' }
        ];

        for (const tc of pureAsciiKeys) {
          assert.equal(
            contentMod.isPureAsciiOrphanKeyup(tc),
            true,
            `isPureAsciiOrphanKeyup must return true for ${tc.key || tc.code}`
          );
        }

        const imeRecoveryKeys = [
          { name: "Korean consonant 'ㄹ'", ev: { key: 'ㄹ', code: 'KeyF' } },
          { name: "Hangul syllable '가'", ev: { key: '가', code: 'KeyR' } },
          { name: "Hangul syllable '한'", ev: { key: '한', code: 'KeyG' } },
          { name: "IME Process key", ev: { key: 'Process', code: 'KeyF', keyCode: 229 } },
          { name: "isComposing flag", ev: { key: 'f', code: 'KeyF', isComposing: true } },
          { name: "keyCode 229", ev: { key: 'f', code: 'KeyF', keyCode: 229 } },
          { name: "which 229", ev: { key: 'f', code: 'KeyF', which: 229 } },
          { name: "Japanese Kana 'は'", ev: { key: 'は', code: 'KeyF' } },
          { name: "Chinese Zhuyin 'ㄑ'", ev: { key: 'ㄑ', code: 'KeyF' } },
          { name: "Hebrew 'כ'", ev: { key: 'כ', code: 'KeyF' } },
          { name: "Greek 'φ'", ev: { key: 'φ', code: 'KeyF' } },
          { name: "Thai 'ด'", ev: { key: 'ด', code: 'KeyF' } },
          { name: "Full-width 'ｆ'", ev: { key: 'ｆ', code: '' } }
        ];

        for (const tc of imeRecoveryKeys) {
          assert.equal(
            contentMod.isPureAsciiOrphanKeyup(tc.ev),
            false,
            `isPureAsciiOrphanKeyup must return false for ${tc.name}`
          );
        }

        clearPendingPrefix();
        const origDateNow = Date.now;
        let mockNow = 6000000;
        Date.now = () => mockNow;

        let actionClicked = 0;
        const testBtn = {
          click() { actionClicked++; },
          getAttribute: (attr) => (attr === 'data-testid' ? 'action-btn-follow' : null),
          closest: () => null
        };
        const testDoc = {
          body: mockBody,
          activeElement: mockBody,
          querySelector(sel) {
            if (sel === '[data-testid="primaryColumn"]') {
              return {
                querySelector: (s) => (s === '[data-testid="UserName"]' ? {} : null),
                querySelectorAll: () => [testBtn]
              };
            }
            return null;
          },
          querySelectorAll: () => []
        };

        const prevDoc = globalThis.document;
        const prevLoc = globalThis.location;
        globalThis.document = testDoc;
        globalThis.location = { pathname: '/TargetUser' };

        try {
          mockNow = 6000000;
          for (const fn of listeners.focus || []) fn({ target: globalThis.window });

          mockNow = 6000300;
          actionClicked = 0;
          for (const fn of listeners.keyup || []) {
            fn(makeEv({ key: 'f', code: 'KeyF', target: mockBody }));
          }
          assert.equal(actionClicked, 0, 'Pure ASCII orphan keyup "f" must be suppressed even after 180ms focus guard');

          mockNow = 6000350;
          actionClicked = 0;
          for (const fn of listeners.keyup || []) {
            fn(makeEv({ key: '2', code: 'Digit2', target: mockBody }));
          }
          assert.equal(actionClicked, 0, 'Simulated Cmd+2 orphan Digit2 keyup must be suppressed without action');

          mockNow = 6000400;
          actionClicked = 0;
          for (const fn of listeners.keyup || []) {
            fn(makeEv({ key: 'ㄹ', code: 'KeyF', target: mockBody }));
          }
          assert.equal(actionClicked, 1, 'Swallowed Korean IME "ㄹ" keyup at 400ms must trigger follow recovery click');
        } finally {
          clearPendingPrefix();
          Date.now = origDateNow;
          globalThis.document = prevDoc;
          globalThis.location = prevLoc;
        }
      }
    }

    // ---------------------------------------------------------------------------
    // 20. Category A.2: findStatusFollowButton Safe Matching & Sidebar Isolation
    // ---------------------------------------------------------------------------
    {
      const contentMod = require('./content.js');

      const authorBtn = { id: 'primary-author-btn', getAttribute: () => 'author-follow', closest: () => null };
      const sidebarBtn = {
        id: 'sidebar-rec-btn',
        getAttribute: (a) => (a === 'aria-label' ? '@recommended_user 님 팔로우' : 'rec-follow'),
        closest: (s) => (s === '[data-testid="sidebarColumn"]' ? { id: 'sidebar' } : null)
      };

      const selfRoot = {
        querySelector(sel) {
          if (sel === 'header nav a[data-testid="AppTabBar_Profile_Link"]') {
            return { getAttribute: (a) => (a === 'href' ? '/Hanssony_' : null) };
          }
          return null;
        },
        querySelectorAll: () => [sidebarBtn]
      };
      const primaryWithBtn = {
        querySelector: () => authorBtn,
        querySelectorAll: () => [authorBtn],
        contains: () => true
      };

      // 1) Self-post detection: returns null immediately
      assert.equal(
        contentMod.findStatusFollowButton(selfRoot, primaryWithBtn, 'Hanssony_'),
        null,
        'findStatusFollowButton must return null on exact self-post'
      );
      assert.equal(
        contentMod.findStatusFollowButton(selfRoot, primaryWithBtn, 'hanssony_'),
        null,
        'findStatusFollowButton must return null on lowercase self-post'
      );
      assert.equal(
        contentMod.findStatusFollowButton(selfRoot, primaryWithBtn, 'HANSSONY_'),
        null,
        'findStatusFollowButton must return null on uppercase self-post'
      );

      const queryRoot = {
        querySelector(sel) {
          if (sel === 'header nav a[data-testid="AppTabBar_Profile_Link"]') {
            return { getAttribute: (a) => (a === 'href' ? '/Hanssony_?lang=ko#top' : null) };
          }
          return null;
        }
      };
      assert.equal(
        contentMod.getLoggedInUsername(queryRoot),
        'Hanssony_',
        'getLoggedInUsername must extract handle ignoring query parameters and hash'
      );
      assert.equal(
        contentMod.findStatusFollowButton(queryRoot, primaryWithBtn, 'Hanssony_'),
        null,
        'findStatusFollowButton must return null on self-post with query params in profile link'
      );

      const selfDoc = {
        querySelector(sel) {
          if (sel === 'header nav a[data-testid="AppTabBar_Profile_Link"]') {
            return { getAttribute: (a) => (a === 'href' ? '/Hanssony_' : null) };
          }
          if (sel === '[data-testid="primaryColumn"]') {
            return primaryWithBtn;
          }
          return null;
        },
        querySelectorAll: () => []
      };
      assert.equal(
        contentMod.findProfileFollowButton(selfDoc, '/Hanssony_/status/188829102948201'),
        null,
        'findProfileFollowButton must return null on self-post status page'
      );

      // 2) Author matching failure: primaryColumn has NO follow button, sidebar has buttons
      const emptyPrimary = {
        querySelector: () => null,
        querySelectorAll: () => [],
        contains: () => false
      };
      const rootWithSidebar = {
        querySelector(sel) {
          if (sel === 'header nav a[data-testid="AppTabBar_Profile_Link"]') {
            return { getAttribute: (a) => (a === 'href' ? '/Hanssony_' : null) };
          }
          return null;
        },
        querySelectorAll() {
          return [sidebarBtn];
        }
      };

      const resultSidebarIsolated = contentMod.findStatusFollowButton(rootWithSidebar, emptyPrimary, 'ExternalAuthor');
      assert.equal(
        resultSidebarIsolated,
        null,
        'Author matching failure must NEVER click sidebar recommendations; must return null'
      );

      // Sidebar impostor button
      const sidebarImpostorBtn = {
        id: 'sidebar-impostor-btn',
        getAttribute: (a) => (a === 'aria-label' ? '@externalauthor 님 팔로우 (추천)' : 'rec-follow'),
        closest: (s) => (s === '[data-testid="sidebarColumn"]' ? { id: 'sidebar' } : null)
      };
      const rootWithImpostor = {
        querySelector(sel) {
          if (sel === 'header nav a[data-testid="AppTabBar_Profile_Link"]') {
            return { getAttribute: (a) => (a === 'href' ? '/Hanssony_' : null) };
          }
          return null;
        },
        querySelectorAll: () => [sidebarImpostorBtn]
      };
      assert.equal(
        contentMod.findStatusFollowButton(rootWithImpostor, emptyPrimary, 'ExternalAuthor'),
        null,
        'Sidebar button mentioning author handle must still be excluded by sidebar isolation guard'
      );

      // 3) Fallback inside primaryColumn when author button has no aria-label match
      const genericPrimaryBtn = {
        id: 'generic-primary-follow',
        getAttribute: (a) => (a === 'data-testid' ? 'author-follow' : null),
        closest: () => null
      };
      const primaryWithGenericBtn = {
        querySelector: (sel) => (sel.includes('-follow') ? genericPrimaryBtn : null),
        querySelectorAll: (sel) => (sel.includes('-follow') ? [genericPrimaryBtn] : []),
        contains: () => true
      };
      assert.equal(
        contentMod.findStatusFollowButton(rootWithSidebar, primaryWithGenericBtn, 'ExternalAuthor'),
        genericPrimaryBtn,
        'findStatusFollowButton falls back strictly to primaryColumn button when author aria-label is unstated'
      );
    }

    // ---------------------------------------------------------------------------
    // 21. Category A.3: Pending Follow Request Button Selector ([data-testid$="-cancel"])
    // ---------------------------------------------------------------------------
    {
      const contentMod = require('./content.js');

      const cancelBtnProfile = {
        id: 'profile-cancel-btn',
        getAttribute: (k) => (k === 'data-testid' ? '987654-cancel' : null),
        closest: () => null
      };

      // 1) On a protected profile page (/SecretUser) with pending request
      const protectedProfileDoc = {
        querySelector(sel) {
          if (sel === '[data-testid="primaryColumn"]') {
            return {
              querySelector: (s) => (s === '[data-testid="UserName"]' ? {} : null),
              querySelectorAll: (s) => (s.includes('-cancel') ? [cancelBtnProfile] : [])
            };
          }
          return null;
        }
      };
      assert.equal(
        contentMod.findProfileFollowButton(protectedProfileDoc, '/SecretUser'),
        cancelBtnProfile,
        'findProfileFollowButton must match [data-testid$="-cancel"] on protected user profile header'
      );

      // 2) On follow list page with pending request cell
      const cancelBtnList = {
        id: 'list-cancel-btn',
        getAttribute: (k) => (k === 'data-testid' ? '445566-cancel' : null),
        closest: () => null
      };
      const cancelListCell = {
        querySelector: (sel) => (sel.includes('-cancel') ? cancelBtnList : null)
      };
      const activeCancelLink = {
        isConnected: true,
        closest: (sel) => (sel === '[data-testid="UserCell"]' ? cancelListCell : null)
      };
      const listPrimaryCancel = {
        contains: (node) => node === activeCancelLink || node === cancelListCell
      };
      const listDocCancel = {
        activeElement: activeCancelLink,
        querySelector: (sel) => (sel === '[data-testid="primaryColumn"]' ? listPrimaryCancel : null)
      };
      assert.equal(
        contentMod.findProfileFollowButton(listDocCancel, '/Hanssony_/following'),
        cancelBtnList,
        'findProfileFollowButton must match [data-testid$="-cancel"] inside focused cell on follow list page'
      );

      // 3) On status page (/SecretUser/status/12345) where tweet author has pending cancel button
      const cancelBtnStatus = {
        id: 'status-cancel-btn',
        getAttribute: (k) => {
          if (k === 'data-testid') return '778899-cancel';
          if (k === 'aria-label') return '요청 취소 @SecretUser';
          return null;
        },
        closest: () => null
      };
      const statusPrimaryCancel = {
        querySelector: (s) => (s.includes('-cancel') ? cancelBtnStatus : null),
        querySelectorAll: (s) => (s.includes('-cancel') ? [cancelBtnStatus] : []),
        contains: () => true
      };
      const statusRootCancel = {
        querySelector(sel) {
          if (sel === 'header nav a[data-testid="AppTabBar_Profile_Link"]') {
            return { getAttribute: (a) => (a === 'href' ? '/Hanssony_' : null) };
          }
          return null;
        },
        querySelectorAll: () => [cancelBtnStatus]
      };
      assert.equal(
        contentMod.findStatusFollowButton(statusRootCancel, statusPrimaryCancel, 'SecretUser'),
        cancelBtnStatus,
        'findStatusFollowButton must match pending request button with [data-testid$="-cancel"]'
      );

      // 4) Pressing 'F' shortcut clicks the cancel button on a protected profile
      let cancelClicked = 0;
      cancelBtnProfile.click = () => { cancelClicked++; };
      const prevDoc = globalThis.document;
      const prevLoc = globalThis.location;
      globalThis.document = protectedProfileDoc;
      globalThis.location = { pathname: '/SecretUser' };
      try {
        clearPendingPrefix();
        const followEv = makeEv({ key: 'f', code: 'KeyF', target: mockBody });
        assert.equal(
          contentMod.handleActionIfMatched(followEv, protectedProfileDoc, false),
          true,
          'handleActionIfMatched must handle follow shortcut on protected profile'
        );
        assert.equal(cancelClicked, 1, 'Pressing F shortcut on protected profile must click pending request cancel button');
      } finally {
        globalThis.document = prevDoc;
        globalThis.location = prevLoc;
      }
    }

    // ---------------------------------------------------------------------------
    // 22. Category A.4: CI Change Detection (diff_check in release.yml)
    // ---------------------------------------------------------------------------
    {
      const fs = require('node:fs');
      const path = require('node:path');

      const releaseYmlPath = path.join(__dirname, '.github/workflows/release.yml');
      assert.ok(fs.existsSync(releaseYmlPath), 'release.yml workflow file must exist');
      const releaseYmlContent = fs.readFileSync(releaseYmlPath, 'utf8');

      assert.ok(
        releaseYmlContent.includes('id: diff_check'),
        'release.yml must contain diff_check step'
      );

      const diffBlockMatch = releaseYmlContent.match(
        /CHANGED_FILES=\$\(git diff --name-only "\$BASE" HEAD --\s*([\s\S]*?)\)/
      );
      assert.ok(diffBlockMatch, 'release.yml must contain git diff pathspec block in diff_check');

      const parsedPathspecs = diffBlockMatch[1]
        .split(/\s+/)
        .map((s) => s.replace(/^'|'$/g, '').replace(/^"|"$/g, ''))
        .filter((s) => s && s !== '\\');

      const expectedCodePathspecs = [
        'manifest.json',
        'content.js',
        'shared-keymap.js',
        'popup.html',
        'popup.js',
        'icons/**',
        'scripts/build-release.cjs'
      ];
      assert.deepEqual(
        parsedPathspecs,
        expectedCodePathspecs,
        'diff_check pathspecs in release.yml must exactly match expected extension code files'
      );

      assert.ok(
        releaseYmlContent.includes("steps.diff_check.outputs.has_code_changes == 'true'"),
        'release.yml must gate release creation and Chrome Web Store upload on has_code_changes'
      );

      function matchesPathspec(filePath, spec) {
        if (spec.endsWith('/**')) {
          const prefix = spec.slice(0, -3);
          return filePath.startsWith(prefix + '/');
        }
        return filePath === spec;
      }

      function evaluateDiffCheck(changedFiles, specs = parsedPathspecs) {
        return changedFiles.some((file) => specs.some((spec) => matchesPathspec(file, spec)));
      }

      // Pure documentation changes -> has_code_changes === false
      assert.equal(evaluateDiffCheck(['README.md']), false);
      assert.equal(evaluateDiffCheck(['README.ko.md', 'README.ja.md', 'README.zh.md']), false);
      assert.equal(evaluateDiffCheck(['CHROMEWEBSTORE.md']), false);
      assert.equal(evaluateDiffCheck(['PROJECT.md', 'AGENTS.md']), false);

      // Pure test / CI / asset changes -> has_code_changes === false
      assert.equal(evaluateDiffCheck(['test.cjs']), false);
      assert.equal(evaluateDiffCheck(['test-adversarial-m1.cjs']), false);
      assert.equal(evaluateDiffCheck(['scripts/test-e2e-ego.cjs']), false);
      assert.equal(evaluateDiffCheck(['store-assets/screenshot-4-following-tab-go.png']), false);
      assert.equal(evaluateDiffCheck(['store-assets/demo-video.mp4']), false);
      assert.equal(evaluateDiffCheck(['.github/workflows/release.yml']), false);
      assert.equal(
        evaluateDiffCheck([
          'README.md',
          'test.cjs',
          'CHROMEWEBSTORE.md',
          'store-assets/demo-video.mp4'
        ]),
        false,
        'Combination of doc, test, and asset changes must evaluate to has_code_changes=false'
      );

      // Extension code changes -> has_code_changes === true
      assert.equal(evaluateDiffCheck(['content.js']), true);
      assert.equal(evaluateDiffCheck(['shared-keymap.js']), true);
      assert.equal(evaluateDiffCheck(['manifest.json']), true);
      assert.equal(evaluateDiffCheck(['popup.html']), true);
      assert.equal(evaluateDiffCheck(['popup.js']), true);
      assert.equal(evaluateDiffCheck(['scripts/build-release.cjs']), true);
      assert.equal(evaluateDiffCheck(['icons/icon16.png']), true);
      assert.equal(evaluateDiffCheck(['icons/icon48.png']), true);
      assert.equal(evaluateDiffCheck(['icons/icon128.png']), true);

      // Mixed changes (code + doc/test) -> has_code_changes === true
      assert.equal(evaluateDiffCheck(['README.md', 'content.js']), true);
      assert.equal(evaluateDiffCheck(['test.cjs', 'shared-keymap.js']), true);
      assert.equal(evaluateDiffCheck(['CHROMEWEBSTORE.md', 'manifest.json']), true);
    }

    // ---------------------------------------------------------------------------
    // 23. Category B.1: Platform Detection & Dynamic Send Shortcut Badge
    // ---------------------------------------------------------------------------
    {
      const keymapMod = require('./shared-keymap.js');
      const popupMod = require('./popup.js');
      const contentMod = require('./content.js');

      // 23a. isApplePlatform detection matrix
      assert.equal(keymapMod.isApplePlatform(null), true, 'null navigator defaults to Apple');
      assert.equal(keymapMod.isApplePlatform(undefined), true, 'undefined navigator defaults to Apple');
      assert.equal(keymapMod.isApplePlatform({}), true, 'empty navigator defaults to Apple');

      // Apple platforms
      assert.equal(keymapMod.isApplePlatform({ platform: 'MacIntel' }), true);
      assert.equal(keymapMod.isApplePlatform({ platform: 'Macintosh' }), true);
      assert.equal(keymapMod.isApplePlatform({ platform: 'MacPPC' }), true);
      assert.equal(keymapMod.isApplePlatform({ platform: 'iPhone' }), true);
      assert.equal(keymapMod.isApplePlatform({ platform: 'iPad' }), true);
      assert.equal(keymapMod.isApplePlatform({ platform: 'iPod' }), true);
      assert.equal(keymapMod.isApplePlatform({ userAgentData: { platform: 'macOS' } }), true);
      assert.equal(
        keymapMod.isApplePlatform({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' }),
        true
      );
      assert.equal(
        keymapMod.isApplePlatform({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)' }),
        true
      );
      assert.equal(
        keymapMod.isApplePlatform({ userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)' }),
        true
      );

      // Non-Apple platforms
      assert.equal(keymapMod.isApplePlatform({ platform: 'Win32' }), false);
      assert.equal(keymapMod.isApplePlatform({ platform: 'Win64' }), false);
      assert.equal(keymapMod.isApplePlatform({ userAgentData: { platform: 'Windows' } }), false);
      assert.equal(
        keymapMod.isApplePlatform({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }),
        false
      );
      assert.equal(keymapMod.isApplePlatform({ platform: 'Linux x86_64' }), false);
      assert.equal(keymapMod.isApplePlatform({ userAgentData: { platform: 'Linux' } }), false);
      assert.equal(
        keymapMod.isApplePlatform({ platform: 'Linux armv8l', userAgent: 'Mozilla/5.0 (Linux; Android 14)' }),
        false
      );
      assert.equal(keymapMod.isApplePlatform({ userAgentData: { platform: 'Android' } }), false);
      assert.equal(keymapMod.isApplePlatform({ userAgentData: { platform: 'Chrome OS' } }), false);

      // Re-export parity in popup.js and content.js
      assert.equal(popupMod.isApplePlatform({ platform: 'Win32' }), false);
      assert.equal(popupMod.isApplePlatform({ platform: 'MacIntel' }), true);
      assert.equal(contentMod.isApplePlatform({ platform: 'Win32' }), false);
      assert.equal(contentMod.isApplePlatform({ platform: 'MacIntel' }), true);

      // 23b. adaptPlatformText string transformations
      const macSample = '새 게시물 작성(N) / 게시물 전송(⌘+Enter)';
      const winSample = '새 게시물 작성(N) / 게시물 전송(Ctrl+Enter)';
      assert.equal(popupMod.adaptPlatformText(macSample, true), macSample, 'Apple platform leaves ⌘+Enter intact');
      assert.equal(popupMod.adaptPlatformText(macSample, false), winSample, 'Non-Apple platform converts ⌘+Enter to Ctrl+Enter');

      // Arrow badge symbol conversion (⌘↵ -> Ctrl↵)
      assert.equal(popupMod.adaptPlatformText('전송 ⌘↵', true), '전송 ⌘↵');
      assert.equal(popupMod.adaptPlatformText('전송 ⌘↵', false), '전송 Ctrl↵');

      // Multiple occurrences in one string
      assert.equal(
        popupMod.adaptPlatformText('1차: ⌘+Enter, 2차: ⌘+Enter, 배지: ⌘↵', false),
        '1차: Ctrl+Enter, 2차: Ctrl+Enter, 배지: Ctrl↵'
      );

      // Multilingual dictionary texts conversion across ko, en, zh, ja
      assert.equal(
        popupMod.adaptPlatformText(popupMod.I18N.en.xNewPostDesc, false),
        'New post (N) / Send post (Ctrl+Enter)'
      );
      assert.equal(
        popupMod.adaptPlatformText(popupMod.I18N.zh.xNewPostDesc, false),
        '发新帖子(N) / 发送帖子(Ctrl+Enter)'
      );
      assert.equal(
        popupMod.adaptPlatformText(popupMod.I18N.ja.xNewPostDesc, false),
        popupMod.I18N.ja.xNewPostDesc.replace('⌘+Enter', 'Ctrl+Enter')
      );

      // Default argument fallback using globalThis.navigator with Object.defineProperty (Node.js 22 accessor-safe)
      const origNavDesc = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
      try {
        Object.defineProperty(globalThis, 'navigator', {
          value: { userAgentData: { platform: 'Windows' }, platform: 'Win32' },
          configurable: true,
          writable: true
        });
        assert.equal(popupMod.adaptPlatformText('⌘+Enter'), 'Ctrl+Enter');
        assert.equal(popupMod.adaptPlatformText('⌘↵'), 'Ctrl↵');

        Object.defineProperty(globalThis, 'navigator', {
          value: { platform: 'MacIntel' },
          configurable: true,
          writable: true
        });
        assert.equal(popupMod.adaptPlatformText('⌘+Enter'), '⌘+Enter');
        assert.equal(popupMod.adaptPlatformText('⌘↵'), '⌘↵');
      } finally {
        if (origNavDesc) Object.defineProperty(globalThis, 'navigator', origNavDesc);
      }

      // 23c. Dynamic CSS variable --xfs-send-badge in syncUiHints()
      const cssVars = new Map();
      const mockStyleDoc = {
        documentElement: {
          style: {
            setProperty(k, v) { cssVars.set(k, v); },
            getPropertyValue(k) { return cssVars.get(k) || ''; }
          },
          getAttribute: () => null,
          setAttribute: () => null,
          removeAttribute: () => null
        },
        createElement: () => ({ id: '', textContent: '', remove() {} }),
        head: { appendChild: () => null },
        getElementById: () => null,
        querySelector: () => null,
        querySelectorAll: () => []
      };

      const prevGlobalDoc = globalThis.document;
      try {
        globalThis.document = mockStyleDoc;

        Object.defineProperty(globalThis, 'navigator', {
          value: { platform: 'MacIntel' },
          configurable: true,
          writable: true
        });
        cssVars.clear();
        contentMod.syncUiHints();
        assert.equal(cssVars.get('--xfs-send-badge'), '"⌘↵"', 'Mac must set --xfs-send-badge to "⌘↵"');
        assert.equal(cssVars.get('--xfs-follow-key'), '"f"');

        Object.defineProperty(globalThis, 'navigator', {
          value: { userAgentData: { platform: 'Windows' }, platform: 'Win32' },
          configurable: true,
          writable: true
        });
        cssVars.clear();
        contentMod.syncUiHints();
        assert.equal(cssVars.get('--xfs-send-badge'), '"Ctrl↵"', 'Windows must set --xfs-send-badge to "Ctrl↵"');
      } finally {
        globalThis.document = prevGlobalDoc;
        if (origNavDesc) Object.defineProperty(globalThis, 'navigator', origNavDesc);
      }
    }

    // ---------------------------------------------------------------------------
    // 24. Category B.2: shared-keymap.js Module Architecture & Helpers
    // ---------------------------------------------------------------------------
    {
      const keymap = require('./shared-keymap.js');

      // 24a. Module exports & globalThis.XFSKeymap parity
      assert.ok(keymap, 'shared-keymap.js must export an object');
      assert.equal(globalThis.XFSKeymap, keymap, 'globalThis.XFSKeymap must reference the shared-keymap API');

      const expectedExportKeys = [
        'DEFAULT_SHORTCUT',
        'LAYOUT_CHAR_TO_CODE',
        'MODIFIER_KEYS',
        'MODIFIER_CODES',
        'IME_SWITCH_CODES',
        'NON_PRINTABLE_IME_KEYS',
        'CODE_TO_KEY_LABEL',
        'normalizeFullWidthChar',
        'isApplePlatform',
        'resolveKeyCode',
        'formatShortcutLabel'
      ];
      for (const k of expectedExportKeys) {
        assert.ok(k in keymap, `shared-keymap must export ${k}`);
      }

      assert.deepEqual(keymap.DEFAULT_SHORTCUT, {
        key: 'f',
        code: 'KeyF',
        ctrl: false,
        alt: false,
        shift: false,
        meta: false
      });

      // 24b. normalizeFullWidthChar full-width ASCII normalization
      assert.equal(keymap.normalizeFullWidthChar('！'), '!');
      assert.equal(keymap.normalizeFullWidthChar('０'), '0');
      assert.equal(keymap.normalizeFullWidthChar('９'), '9');
      assert.equal(keymap.normalizeFullWidthChar('Ａ'), 'A');
      assert.equal(keymap.normalizeFullWidthChar('Ｚ'), 'Z');
      assert.equal(keymap.normalizeFullWidthChar('ａ'), 'a');
      assert.equal(keymap.normalizeFullWidthChar('ｆ'), 'f');
      assert.equal(keymap.normalizeFullWidthChar('ｚ'), 'z');
      assert.equal(keymap.normalizeFullWidthChar('～'), '~');
      assert.equal(keymap.normalizeFullWidthChar('／'), '/');
      assert.equal(keymap.normalizeFullWidthChar('？'), '?');
      assert.equal(keymap.normalizeFullWidthChar('．'), '.');

      // Untouched non-full-width characters
      assert.equal(keymap.normalizeFullWidthChar('f'), 'f');
      assert.equal(keymap.normalizeFullWidthChar('1'), '1');
      assert.equal(keymap.normalizeFullWidthChar('?'), '?');
      assert.equal(keymap.normalizeFullWidthChar('한'), '한');
      assert.equal(keymap.normalizeFullWidthChar('あ'), 'あ');
      assert.equal(keymap.normalizeFullWidthChar('中'), '中');
      assert.equal(keymap.normalizeFullWidthChar(' '), ' ');

      // 24c. resolveKeyCode edge cases & corner inputs
      assert.equal(keymap.resolveKeyCode(null), null);
      assert.equal(keymap.resolveKeyCode(undefined), null);
      assert.equal(keymap.resolveKeyCode({}), null);

      // Modifier codes alone return null
      for (const modCode of [
        'ControlLeft', 'ControlRight', 'ShiftLeft', 'ShiftRight',
        'AltLeft', 'AltRight', 'MetaLeft', 'MetaRight'
      ]) {
        assert.equal(keymap.resolveKeyCode({ code: modCode }), null, `Modifier code ${modCode} must resolve to null`);
      }

      // IME switch codes alone return null
      for (const imeCode of [
        'HangulMode', 'HanjaMode', 'KanaMode', 'KanjiMode',
        'Alphanumeric', 'CapsLock', 'Lang1', 'Lang2',
        'Convert', 'NonConvert', 'Eisuu', 'RomanCharacters'
      ]) {
        assert.equal(keymap.resolveKeyCode({ key: imeCode, code: imeCode }), null);
      }

      // Special key string fallbacks
      assert.equal(keymap.resolveKeyCode({ key: 'Enter', code: '' }), 'Enter');
      assert.equal(keymap.resolveKeyCode({ key: 'Escape', code: '' }), 'Escape');
      assert.equal(keymap.resolveKeyCode({ key: 'Esc', code: '' }), 'Escape');
      assert.equal(keymap.resolveKeyCode({ key: 'Tab', code: '' }), 'Tab');
      assert.equal(keymap.resolveKeyCode({ key: ' ', code: '' }), 'Space');
      assert.equal(keymap.resolveKeyCode({ key: 'Spacebar', code: '' }), 'Space');

      // Single letter/digit normalization
      assert.equal(keymap.resolveKeyCode({ key: 'k', code: '' }), 'KeyK');
      assert.equal(keymap.resolveKeyCode({ key: 'K', code: '' }), 'KeyK');
      assert.equal(keymap.resolveKeyCode({ key: '3', code: '' }), 'Digit3');
      assert.equal(keymap.resolveKeyCode({ key: 'ｆ', code: '' }), 'KeyF');
      assert.equal(keymap.resolveKeyCode({ key: '８', code: '' }), 'Digit8');

      // Numeric keyCode / which fallbacks
      assert.equal(keymap.resolveKeyCode({ keyCode: 65 }), 'KeyA');
      assert.equal(keymap.resolveKeyCode({ which: 90 }), 'KeyZ');
      assert.equal(keymap.resolveKeyCode({ keyCode: 48 }), 'Digit0');
      assert.equal(keymap.resolveKeyCode({ keyCode: 57 }), 'Digit9');
      assert.equal(keymap.resolveKeyCode({ keyCode: 190 }), 'Period');
      assert.equal(keymap.resolveKeyCode({ keyCode: 191 }), 'Slash');
      assert.equal(keymap.resolveKeyCode({ keyCode: 32 }), 'Space');
      assert.equal(keymap.resolveKeyCode({ keyCode: 13 }), 'Enter');
      assert.equal(keymap.resolveKeyCode({ keyCode: 229 }), null, 'keyCode 229 (IME Process) must not resolve to number');

      // 24d. formatShortcutLabel custom separators & modifier combinations
      assert.equal(keymap.formatShortcutLabel({ key: 'f', code: 'KeyF' }), 'F');
      assert.equal(keymap.formatShortcutLabel({ key: 'f', code: 'KeyF', ctrl: true }), 'Ctrl+F');
      assert.equal(keymap.formatShortcutLabel({ key: 'f', code: 'KeyF', ctrl: true, alt: true }), 'Ctrl+Alt+F');
      assert.equal(keymap.formatShortcutLabel({ key: 'f', code: 'KeyF', ctrl: true, alt: true, shift: true }), 'Ctrl+Alt+Shift+F');
      assert.equal(
        keymap.formatShortcutLabel({ key: 'f', code: 'KeyF', ctrl: true, alt: true, shift: true, meta: true }),
        'Ctrl+Alt+Shift+Meta+F'
      );

      // Custom separator ' + '
      assert.equal(
        keymap.formatShortcutLabel({ key: 'f', code: 'KeyF', ctrl: true, shift: true }, ' + '),
        'Ctrl + Shift + F'
      );
      assert.equal(
        keymap.formatShortcutLabel({ key: 'f', code: 'KeyF', alt: true }, ' - '),
        'Alt - F'
      );

      // Special code label formatting (CODE_TO_KEY_LABEL)
      assert.equal(keymap.formatShortcutLabel({ key: ' ', code: 'Space' }), 'Space');
      assert.equal(keymap.formatShortcutLabel({ key: '.', code: 'Period' }), '.');
      assert.equal(keymap.formatShortcutLabel({ key: ';', code: 'Semicolon' }), ';');
      assert.equal(keymap.formatShortcutLabel({ key: "'", code: 'Quote' }), "'");
      assert.equal(keymap.formatShortcutLabel({ key: '-', code: 'Minus' }), '-');
      assert.equal(keymap.formatShortcutLabel({ key: '=', code: 'Equal' }), '=');
      assert.equal(keymap.formatShortcutLabel({ key: '[', code: 'BracketLeft' }), '[');
      assert.equal(keymap.formatShortcutLabel({ key: ']', code: 'BracketRight' }), ']');
      assert.equal(keymap.formatShortcutLabel({ key: '\\', code: 'Backslash' }), '\\');
      assert.equal(keymap.formatShortcutLabel({ key: 'Enter', code: 'Enter' }), 'Enter');
      assert.equal(keymap.formatShortcutLabel({ key: 'Escape', code: 'Escape' }), 'Escape');
      assert.equal(keymap.formatShortcutLabel({ key: 'Tab', code: 'Tab' }), 'Tab');
      assert.equal(keymap.formatShortcutLabel({ key: 'Backspace', code: 'Backspace' }), 'Backspace');

      // Slash vs Shift+Slash ('?')
      assert.equal(keymap.formatShortcutLabel({ code: 'Slash', shift: false }), '/');
      assert.equal(keymap.formatShortcutLabel({ code: 'Slash', shift: true }), 'Shift+?');
    }

    // ---------------------------------------------------------------------------
    // 25. Category B.3: Full 26-Letter Keyboard Mappings (Hebrew, Greek, Thai)
    // ---------------------------------------------------------------------------
    {
      const keymap = require('./shared-keymap.js');
      const content = require('./content.js');

      // 25a. Hebrew SI-1452 (Full 27 keys including final forms and ת)
      const hebrewExpected = {
        'ק': 'KeyE', 'ר': 'KeyR', 'א': 'KeyT', 'ט': 'KeyY', 'ו': 'KeyU',
        'ן': 'KeyI', 'ם': 'KeyO', 'פ': 'KeyP',
        'ש': 'KeyA', 'ד': 'KeyS', 'ג': 'KeyD', 'כ': 'KeyF', 'ע': 'KeyG',
        'י': 'KeyH', 'ח': 'KeyJ', 'ל': 'KeyK', 'ך': 'KeyL', 'ף': 'Semicolon',
        'ז': 'KeyZ', 'ס': 'KeyX', 'ב': 'KeyC', 'ה': 'KeyV', 'נ': 'KeyB',
        'מ': 'KeyN', 'צ': 'KeyM', 'ת': 'Comma', 'ץ': 'Period'
      };
      const hebrewKeys = Object.keys(hebrewExpected);
      assert.equal(hebrewKeys.length, 27, 'Hebrew SI-1452 layout must map exactly 27 keys');

      for (const [ch, code] of Object.entries(hebrewExpected)) {
        assert.equal(
          keymap.resolveKeyCode({ key: ch, code: '' }),
          code,
          `Hebrew '${ch}' must resolve to ${code}`
        );
      }

      // Hebrew follow shortcut match: 'כ' maps to KeyF (DEFAULT_SHORTCUT)
      assert.equal(
        content.matchesShortcut({ key: 'כ', code: '', ctrlKey: false, altKey: false, shiftKey: false, metaKey: false }, content.DEFAULT_SHORTCUT),
        true,
        "Hebrew 'כ' must match default follow shortcut F"
      );

      // 25b. Greek QWERTY (Full 26 keys including ς and ;)
      const greekExpected = {
        'ς': 'KeyW', 'ε': 'KeyE', 'ρ': 'KeyR', 'τ': 'KeyT', 'υ': 'KeyY',
        'θ': 'KeyU', 'ι': 'KeyI', 'ο': 'KeyO', 'π': 'KeyP',
        'α': 'KeyA', 'σ': 'KeyS', 'δ': 'KeyD', 'φ': 'KeyF', 'γ': 'KeyG',
        'η': 'KeyH', 'ξ': 'KeyJ', 'κ': 'KeyK', 'λ': 'KeyL',
        'ζ': 'KeyZ', 'χ': 'KeyX', 'ψ': 'KeyC', 'ω': 'KeyV', 'β': 'KeyB',
        'ν': 'KeyN', 'μ': 'KeyM', ';': 'Slash'
      };
      const greekKeys = Object.keys(greekExpected);
      assert.equal(greekKeys.length, 26, 'Greek QWERTY layout must map exactly 26 keys');

      for (const [ch, code] of Object.entries(greekExpected)) {
        assert.equal(
          keymap.resolveKeyCode({ key: ch, code: '' }),
          code,
          `Greek '${ch}' must resolve to ${code}`
        );
      }

      // Greek uppercase normalization (e.g. 'Φ' -> 'KeyF', 'Σ' -> 'KeyS')
      const greekUpper = {
        'Φ': 'KeyF', 'Σ': 'KeyS', 'Ω': 'KeyV', 'Ψ': 'KeyC', 'Δ': 'KeyD',
        'Ξ': 'KeyJ', 'Κ': 'KeyK', 'Ν': 'KeyN', 'Γ': 'KeyG'
      };
      for (const [ch, code] of Object.entries(greekUpper)) {
        assert.equal(
          keymap.resolveKeyCode({ key: ch, code: '' }),
          code,
          `Greek uppercase '${ch}' must resolve to ${code}`
        );
      }

      // Greek question mark (U+037E ';') on Slash key
      assert.equal(keymap.resolveKeyCode({ key: ';', code: '' }), 'Slash');
      assert.equal(
        content.matchesShortcut({ key: 'φ', code: '', ctrlKey: false, altKey: false, shiftKey: false, metaKey: false }, content.DEFAULT_SHORTCUT),
        true,
        "Greek 'φ' must match default follow shortcut F"
      );

      // 25c. Thai Kedmanee (Full 28 keys including punctuation ใ and ฝ)
      const thaiExpected = {
        'ๆ': 'KeyQ', 'ไ': 'KeyW', 'ำ': 'KeyE', 'พ': 'KeyR', 'ะ': 'KeyT',
        'ั': 'KeyY', 'ี': 'KeyU', 'ร': 'KeyI', 'น': 'KeyO', 'ย': 'KeyP',
        'ฟ': 'KeyA', 'ห': 'KeyS', 'ก': 'KeyD', 'ด': 'KeyF', 'เ': 'KeyG',
        '้': 'KeyH', '่': 'KeyJ', 'า': 'KeyK', 'ส': 'KeyL',
        'ผ': 'KeyZ', 'ป': 'KeyX', 'แ': 'KeyC', 'อ': 'KeyV', 'ิ': 'KeyB',
        'ื': 'KeyN', 'ท': 'KeyM',
        'ใ': 'Period', 'ฝ': 'Slash'
      };
      const thaiKeys = Object.keys(thaiExpected);
      assert.equal(thaiKeys.length, 28, 'Thai Kedmanee layout must map exactly 28 keys');

      for (const [ch, code] of Object.entries(thaiExpected)) {
        assert.equal(
          keymap.resolveKeyCode({ key: ch, code: '' }),
          code,
          `Thai '${ch}' must resolve to ${code}`
        );
      }

      // Thai follow shortcut match: 'ด' maps to KeyF (DEFAULT_SHORTCUT)
      assert.equal(
        content.matchesShortcut({ key: 'ด', code: '', ctrlKey: false, altKey: false, shiftKey: false, metaKey: false }, content.DEFAULT_SHORTCUT),
        true,
        "Thai 'ด' must match default follow shortcut F"
      );

      // 25d. Action dispatch verification with Hebrew, Greek, Thai keys
      let followClicks = 0;
      const testFollowBtn = {
        click() { followClicks++; },
        getAttribute: (k) => (k === 'data-testid' ? 'user-follow' : null),
        closest: () => null
      };
      const mockActionDoc = {
        body: mockBody,
        activeElement: mockBody,
        querySelector(sel) {
          if (sel === '[data-testid="primaryColumn"]') {
            return {
              querySelector: (s) => (s.includes('UserName') ? {} : (s.includes('follow') ? testFollowBtn : null)),
              querySelectorAll: () => [testFollowBtn]
            };
          }
          return null;
        },
        querySelectorAll: () => []
      };

      const prevActionDoc = globalThis.document;
      const prevActionLoc = globalThis.location;
      try {
        globalThis.document = mockActionDoc;
        globalThis.location = { pathname: '/Hanssony_' };

        // Hebrew follow key 'כ'
        followClicks = 0;
        assert.equal(content.handleActionIfMatched(makeEv({ key: 'כ', code: 'KeyF' }), mockActionDoc, false), true);
        assert.equal(followClicks, 1, "Hebrew 'כ' keydown must click Follow button");

        // Greek follow key 'φ'
        followClicks = 0;
        assert.equal(content.handleActionIfMatched(makeEv({ key: 'φ', code: 'KeyF' }), mockActionDoc, false), true);
        assert.equal(followClicks, 1, "Greek 'φ' keydown must click Follow button");

        // Thai follow key 'ด'
        followClicks = 0;
        assert.equal(content.handleActionIfMatched(makeEv({ key: 'ด', code: 'KeyF' }), mockActionDoc, false), true);
        assert.equal(followClicks, 1, "Thai 'ด' keydown must click Follow button");
      } finally {
        globalThis.document = prevActionDoc;
        globalThis.location = prevActionLoc;
      }
    }

    // ---------------------------------------------------------------------------
    // 26. Category B.4: Safari Userscript Persistence, Compact Pills, and UI Language
    // ---------------------------------------------------------------------------
    {
      const content = require('./content.js');

      // 26a. normalizeCompactPillDesign validation & fallback via setCompactPillDesign
      assert.equal(content.getCompactPillDesign(), '3', 'Default pill design must be 3');
      assert.equal(content.isCompactPillActive('/home'), true);
      assert.equal(content.isCompactPillActive('/explore'), false);

      content.setCompactPillDesign('1');
      assert.equal(content.getCompactPillDesign(), '1');
      content.setCompactPillDesign('2');
      assert.equal(content.getCompactPillDesign(), '2');
      content.setCompactPillDesign('3');
      assert.equal(content.getCompactPillDesign(), '3');

      // Invalid values fall back to '3'
      content.setCompactPillDesign('0');
      assert.equal(content.getCompactPillDesign(), '3', "Invalid design '0' must default to '3'");
      content.setCompactPillDesign('4');
      assert.equal(content.getCompactPillDesign(), '3', "Invalid design '4' must default to '3'");
      content.setCompactPillDesign('xyz');
      assert.equal(content.getCompactPillDesign(), '3', "Invalid string must default to '3'");
      content.setCompactPillDesign(null);
      assert.equal(content.getCompactPillDesign(), '3', 'null design must default to 3');

      // 26b. UI Language normalization, getters/setters, and detection
      assert.equal(content.normalizeUiLang('ko'), 'ko');
      assert.equal(content.normalizeUiLang('KO'), 'ko');
      assert.equal(content.normalizeUiLang('  en  '), 'en');
      assert.equal(content.normalizeUiLang('zh'), 'zh');
      assert.equal(content.normalizeUiLang('ja'), 'ja');
      assert.equal(content.normalizeUiLang('auto'), 'auto');
      assert.equal(content.normalizeUiLang('AUTO'), 'auto');
      assert.equal(content.normalizeUiLang('fr'), 'auto', 'Unsupported language fr must normalize to auto');
      assert.equal(content.normalizeUiLang(''), 'auto', 'Empty language must normalize to auto');
      assert.equal(content.normalizeUiLang(null), 'auto', 'null language must normalize to auto');

      content.setUiLang('ko');
      assert.equal(content.getUiLang(), 'ko');
      content.setUiLang('zh');
      assert.equal(content.getUiLang(), 'zh');
      content.setUiLang('ja');
      assert.equal(content.getUiLang(), 'ja');
      content.setUiLang('en');
      assert.equal(content.getUiLang(), 'en');
      content.setUiLang('auto');
      assert.equal(content.getUiLang(), 'auto');

      // 26c. Dual storage persistence (localStorage and chrome.storage.sync)
      const mockStorage = new Map();
      const prevLocalStorage = globalThis.localStorage;
      const prevChrome = globalThis.chrome;

      globalThis.localStorage = {
        getItem(k) { return mockStorage.get(k) ?? null; },
        setItem(k, v) { mockStorage.set(k, String(v)); },
        removeItem(k) { mockStorage.delete(k); },
        clear() { mockStorage.clear(); }
      };

      let syncedStorageData = {};
      globalThis.chrome = {
        storage: {
          sync: {
            set(obj) { Object.assign(syncedStorageData, obj); },
            get(keys) { return Promise.resolve(syncedStorageData); }
          }
        }
      };

      try {
        content.setCompactPillDesign('1', true);
        assert.equal(mockStorage.get(content.LOCAL_STORAGE_COMPACT_PILL_DESIGN_KEY), '1');
        assert.equal(syncedStorageData.compactPillDesign, '1');

        content.setUiLang('ja', true);
        assert.equal(mockStorage.get(content.LOCAL_STORAGE_UI_LANG_KEY), 'ja');
        assert.equal(syncedStorageData.uiLang, 'ja');

        content.setFilterNonFollowers(true, true);
        assert.equal(syncedStorageData.filterNonFollowers, true);

        content.setCompactNewPostsPill(false, true);
        assert.equal(syncedStorageData.compactNewPostsPill, false);
      } finally {
        if (prevLocalStorage !== undefined) globalThis.localStorage = prevLocalStorage;
        else delete globalThis.localStorage;

        if (prevChrome !== undefined) globalThis.chrome = prevChrome;
        else delete globalThis.chrome;

        content.setCompactPillDesign('3');
        content.setUiLang('auto');
        content.setFilterNonFollowers(false);
        content.setCompactNewPostsPill(true);
      }

      // 26d. Userscript Menu Strings & Command Registration (GM_registerMenuCommand)
      content.setUiLang('ko');
      const koStrings = content.getUserscriptMenuStrings();
      assert.ok(koStrings.toggleHints.includes('단축키 힌트'));
      assert.ok(koStrings.setPillDesign.includes('플로팅 버튼 디자인'));
      assert.ok(koStrings.promptPillDesign('3').includes('현재: 3'));
      assert.ok(koStrings.promptLanguage('ko').includes('현재: ko'));

      content.setUiLang('en');
      const enStrings = content.getUserscriptMenuStrings();
      assert.ok(enStrings.toggleHints.includes('Toggle Shortcut Hints'));
      assert.ok(enStrings.setPillDesign.includes('Select Floating Pill Design'));

      content.setUiLang('zh');
      const zhStrings = content.getUserscriptMenuStrings();
      assert.ok(zhStrings.toggleHints.includes('快捷键提示'));
      assert.ok(zhStrings.setPillDesign.includes('浮动按钮样式'));

      content.setUiLang('ja');
      const jaStrings = content.getUserscriptMenuStrings();
      assert.ok(jaStrings.toggleHints.includes('ショートカットヒント'));
      assert.ok(jaStrings.setPillDesign.includes('フローティングボタンデザイン'));

      const registeredMenuCommands = [];
      globalThis.GM_registerMenuCommand = (caption, fn) => {
        registeredMenuCommands.push({ caption, fn });
      };

      try {
        content.registerUserscriptMenuCommands();
        assert.equal(registeredMenuCommands.length, 6, 'Must register exactly 6 Userscript menu commands');
        assert.ok(registeredMenuCommands.some((c) => c.caption.includes('Shortcut') || c.caption.includes('ショートカット')));

        const prevPrompt = globalThis.window ? globalThis.window.prompt : undefined;
        try {
          registeredMenuCommands[0].fn();
          registeredMenuCommands[1].fn();
          registeredMenuCommands[2].fn();

          globalThis.window.prompt = () => '2';
          registeredMenuCommands[3].fn();
          assert.equal(content.getCompactPillDesign(), '2');

          globalThis.window.prompt = () => 'zh';
          registeredMenuCommands[4].fn();
          assert.equal(content.getUiLang(), 'zh');

          globalThis.window.prompt = () => 'f';
          registeredMenuCommands[5].fn();
        } finally {
          if (prevPrompt !== undefined) globalThis.window.prompt = prevPrompt;
          else delete globalThis.window.prompt;
        }
      } finally {
        delete globalThis.GM_registerMenuCommand;
        content.setUiLang('auto');
        content.setCompactPillDesign('3');
        content.setFilterNonFollowers(false);
        content.setCompactNewPostsPill(true);
      }
    }

    // ---------------------------------------------------------------------------
    // 27. Category C: Performance, Event Scoping & Build Decoupling (C.1, C.2, C.3)
    // ---------------------------------------------------------------------------
    {
      const fs = require('node:fs');
      const path = require('node:path');
      const content = require('./content.js');
      const {
        handleMouseOver,
        setShowUiHints,
        isStatusPage,
        applyConfigUpdate,
        getFilterNonFollowers,
        getCompactNewPostsPill,
        getCompactPillDesign,
        getUiLang,
        DEFAULT_SHORTCUT
      } = content;

      // 27a. C.1 Scoped mouseover listener in content.js
      const prevLoc = globalThis.location;
      try {
        // 1. Synthetic events (!e || e.isTrusted === false) must ALWAYS trigger sync
        assert.equal(handleMouseOver(null), true, 'handleMouseOver(null) must return true');
        assert.equal(handleMouseOver(undefined), true, 'handleMouseOver(undefined) must return true');
        assert.equal(handleMouseOver({ isTrusted: false }), true, 'handleMouseOver({ isTrusted: false }) must return true');

        // 2. Trusted events (e.isTrusted === true) on non-status pages must NEVER trigger sync
        setShowUiHints(true);
        const nonStatusRoutes = ['/home', '/Hanssony_/followers', '/Hanssony_/following', '/explore', '/notifications', '/messages'];
        for (const route of nonStatusRoutes) {
          globalThis.location = { pathname: route };
          assert.equal(isStatusPage(route), false);
          assert.equal(
            handleMouseOver({ isTrusted: true }),
            false,
            `Trusted mouseover on non-status route ${route} must not trigger sync`
          );
        }

        // 3. Trusted events on status pages:
        const statusRoute = '/Buldakguy/status/2110367916348899354';
        globalThis.location = { pathname: statusRoute };
        assert.equal(isStatusPage(statusRoute), true);

        // 3a. When showUiHints is false: skip sync
        setShowUiHints(false);
        assert.equal(
          handleMouseOver({ isTrusted: true }),
          false,
          'Trusted mouseover on status page when showUiHints=false must return false'
        );

        // 3b. When showUiHints is true: run sync
        setShowUiHints(true);
        assert.equal(
          handleMouseOver({ isTrusted: true }),
          true,
          'Trusted mouseover on status page when showUiHints=true must return true'
        );

        // 4. Verify listener attachment
        assert.ok(
          Array.isArray(listeners['mouseover']) && listeners['mouseover'].includes(handleMouseOver),
          'handleMouseOver must be registered as window mouseover listener'
        );
      } finally {
        setShowUiHints(true);
        globalThis.location = prevLoc;
      }

      // 27b. C.2 Storage-only communication (chrome.storage.onChanged & no onMessage)
      const contentJsSource = fs.readFileSync(path.join(__dirname, 'content.js'), 'utf8');
      const popupJsSource = fs.readFileSync(path.join(__dirname, 'popup.js'), 'utf8');

      assert.equal(
        contentJsSource.includes('chrome.runtime.onMessage'),
        false,
        'content.js must NOT contain chrome.runtime.onMessage'
      );
      assert.equal(
        contentJsSource.includes('onMessage.addListener'),
        false,
        'content.js must NOT register any onMessage listener'
      );
      assert.ok(
        contentJsSource.includes('chrome.storage.onChanged.addListener'),
        'content.js must register chrome.storage.onChanged listener'
      );
      assert.equal(
        popupJsSource.includes('notifyTabs'),
        false,
        'popup.js must NOT contain legacy notifyTabs function'
      );
      assert.equal(
        popupJsSource.includes('chrome.tabs.sendMessage'),
        false,
        'popup.js must NOT call chrome.tabs.sendMessage'
      );
      assert.ok(
        popupJsSource.includes('chrome.storage.sync.set'),
        'popup.js must save configuration via chrome.storage.sync.set'
      );

      // Functional verification of content.js real storage.onChanged listener
      const storageChanges = {
        shortcut: { newValue: { key: 'u', code: 'KeyU', ctrlKey: false, altKey: false, shiftKey: false, metaKey: false } },
        showUiHints: { newValue: false },
        filterNonFollowers: { newValue: true },
        compactNewPostsPill: { newValue: false },
        compactPillDesign: { newValue: '1' },
        uiLang: { newValue: 'ja' }
      };

      try {
        assert.ok(
          storageOnChangedListeners.length > 0,
          'chrome.storage.onChanged listener must be registered in content.js'
        );
        const realStorageListener = storageOnChangedListeners[0];

        // Ensure baseline state
        assert.equal(getFilterNonFollowers(), false, 'baseline filterNonFollowers must be false');

        // 1. Area filtering: changes in "local" area must be ignored by content.js listener
        realStorageListener({ filterNonFollowers: { newValue: true } }, 'local');
        assert.equal(
          getFilterNonFollowers(),
          false,
          'storage changes in "local" area must be ignored by content.js'
        );

        // 2. Storage changes in "sync" area must be unpacked and applied to internal state
        realStorageListener(storageChanges, 'sync');

        assert.equal(getFilterNonFollowers(), true, 'filterNonFollowers must update to true');
        assert.equal(getCompactNewPostsPill(), false, 'compactNewPostsPill must update to false');
        assert.equal(getCompactPillDesign(), '1', 'compactPillDesign must update to "1"');
        assert.equal(getUiLang(), 'ja', 'uiLang must update to "ja"');
      } finally {
        applyConfigUpdate({
          shortcut: { ...DEFAULT_SHORTCUT },
          showUiHints: true,
          filterNonFollowers: false,
          compactNewPostsPill: true,
          compactPillDesign: '3',
          uiLang: 'auto'
        });
      }

      // 27c. C.3 Decoupled RUN_EGO_E2E === '1' gating in scripts/build-release.cjs
      const buildScriptPath = path.join(__dirname, 'scripts', 'build-release.cjs');
      const buildScriptContent = fs.readFileSync(buildScriptPath, 'utf8');

      const gatingRegex = /if\s*\(\s*process\.env\.RUN_EGO_E2E\s*===\s*['"]1['"]\s*\)/;
      assert.ok(
        gatingRegex.test(buildScriptContent),
        'scripts/build-release.cjs must strictly check process.env.RUN_EGO_E2E === "1"'
      );

      const lines = buildScriptContent.split('\n');
      const egoCallLines = lines.filter((line) => line.includes('test-e2e-ego.cjs'));
      assert.equal(egoCallLines.length, 1, 'test-e2e-ego.cjs should only be referenced once in build script');

      // Block encapsulation: test-e2e-ego.cjs must be invoked strictly inside the gated block
      const egoGatingBlockMatch = buildScriptContent.match(
        /if\s*\(\s*process\.env\.RUN_EGO_E2E\s*===\s*['"]1['"]\s*\)\s*\{([\s\S]*?)\}/
      );
      assert.ok(
        egoGatingBlockMatch,
        'scripts/build-release.cjs must contain an if (process.env.RUN_EGO_E2E === "1") block'
      );
      assert.ok(
        egoGatingBlockMatch[1].includes('test-e2e-ego.cjs'),
        'test-e2e-ego.cjs must be invoked inside the RUN_EGO_E2E === "1" block'
      );

      // Verify test-e2e-ego.cjs is not referenced anywhere outside the gated block
      const scriptWithoutGatedBlock = buildScriptContent.replace(egoGatingBlockMatch[0], '');
      assert.equal(
        scriptWithoutGatedBlock.includes('test-e2e-ego.cjs'),
        false,
        'test-e2e-ego.cjs must NOT be called outside the RUN_EGO_E2E === "1" conditional block'
      );

      // Verify exact condition syntax extracted from build-release.cjs
      const conditionMatch = buildScriptContent.match(/if\s*\(([^)]*RUN_EGO_E2E[^)]*)\)/);
      assert.ok(conditionMatch, 'RUN_EGO_E2E conditional must exist');
      assert.equal(
        conditionMatch[1].trim(),
        "process.env.RUN_EGO_E2E === '1'",
        'build script condition must strictly test process.env.RUN_EGO_E2E === "1"'
      );
    }

    // ---------------------------------------------------------------------------
    // 28. Category D: Store Assets Cleanliness, Active Functions & Dead Code Removal (D.1-D.5)
    // ---------------------------------------------------------------------------
    {
      const fs = require('node:fs');
      const path = require('node:path');
      const content = require('./content.js');
      const {
        findFollowListTabLink,
        isStatusPage,
        applyConfigUpdate,
        getFilterNonFollowers,
        getCompactNewPostsPill,
        getCompactPillDesign,
        getUiLang
      } = content;

      // 28a. D.1: Absence of duplicate screenshot-1280x800.png
      assert.equal(
        fs.existsSync(path.join(__dirname, 'store-assets', 'screenshot-1280x800.png')),
        false,
        'store-assets/screenshot-1280x800.png must not exist'
      );
      const cwsDoc = fs.readFileSync(path.join(__dirname, 'CHROMEWEBSTORE.md'), 'utf8');
      assert.equal(
        cwsDoc.includes('screenshot-1280x800.png'),
        false,
        'CHROMEWEBSTORE.md must not reference screenshot-1280x800.png'
      );

      // 28b. D.2: Following tab screenshot (screenshot-4-following-tab-go.png)
      const sc4Path = path.join(__dirname, 'store-assets', 'screenshot-4-following-tab-go.png');
      assert.ok(fs.existsSync(sc4Path), 'screenshot-4-following-tab-go.png must exist');
      const sc4Buf = fs.readFileSync(sc4Path);
      assert.ok(sc4Buf.length > 50000, 'screenshot-4-following-tab-go.png must be non-empty');
      assert.equal(sc4Buf.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', 'screenshot 4 must have PNG magic bytes');

      // 28c. D.3: Absence of demo-video.gif & presence of demo-video.mp4
      assert.equal(
        fs.existsSync(path.join(__dirname, 'store-assets', 'demo-video.gif')),
        false,
        'store-assets/demo-video.gif must not exist'
      );
      const mp4Path = path.join(__dirname, 'store-assets', 'demo-video.mp4');
      assert.ok(fs.existsSync(mp4Path), 'store-assets/demo-video.mp4 must exist');
      const mp4Buf = fs.readFileSync(mp4Path);
      assert.ok(mp4Buf.length > 100000, 'demo-video.mp4 must be non-empty (>100KB)');
      assert.equal(mp4Buf.subarray(4, 8).toString('ascii'), 'ftyp', 'demo-video.mp4 must have valid MP4 ftyp box');

      const readmes = ['README.md', 'README.ko.md', 'README.ja.md', 'README.zh.md'];
      for (const rm of readmes) {
        const rmContent = fs.readFileSync(path.join(__dirname, rm), 'utf8');
        assert.ok(
          rmContent.includes('store-assets/screenshot-4-following-tab-go.png'),
          `${rm} must include screenshot-4-following-tab-go.png`
        );
        assert.ok(
          rmContent.includes('store-assets/demo-video.mp4'),
          `${rm} must link to demo-video.mp4`
        );
        assert.equal(
          rmContent.includes('demo-video.gif'),
          false,
          `${rm} must NOT contain reference to demo-video.gif`
        );
        assert.equal(
          rmContent.includes('safari-userscript.zip'),
          false,
          `${rm} must NOT reference safari-userscript.zip`
        );
      }

      // 28d. D.4: Safari userscript zip removal
      assert.equal(
        fs.existsSync(path.join(__dirname, 'dist', 'x-multilingual-keyboard-shortcuts-and-follow-safari-userscript.zip')),
        false,
        'Safari userscript zip must not exist in dist/'
      );
      const buildReleaseContent = fs.readFileSync(path.join(__dirname, 'scripts', 'build-release.cjs'), 'utf8');
      assert.equal(
        buildReleaseContent.includes('safari-userscript.zip'),
        false,
        'scripts/build-release.cjs must not package safari-userscript.zip'
      );
      const releaseYmlContent = fs.readFileSync(path.join(__dirname, '.github', 'workflows', 'release.yml'), 'utf8');
      assert.equal(
        releaseYmlContent.includes('safari-userscript.zip'),
        false,
        'release.yml must not reference safari-userscript.zip'
      );

      // Presence of all required store screenshots
      const requiredScreenshots = [
        'screenshot-0-home-shortcuts.png',
        'screenshot-1-verified-followers-jk.png',
        'screenshot-2-unfollow-confirm-yn.png',
        'screenshot-3-followers-tab-gw.png',
        'screenshot-4-following-tab-go.png',
        'promo-440x280.png'
      ];
      for (const shot of requiredScreenshots) {
        const p = path.join(__dirname, 'store-assets', shot);
        assert.ok(fs.existsSync(p), `Required store asset ${shot} must exist`);
        assert.ok(fs.statSync(p).size > 1000, `Asset ${shot} must be non-empty`);
      }

      // 28e. D.5 Active functions & obsolete export removal
      assert.equal(
        'codeToNativeSpec' in content,
        false,
        'codeToNativeSpec must NOT be exported in content.js'
      );
      assert.equal(
        typeof content.codeToNativeSpec,
        'undefined',
        'content.codeToNativeSpec must be undefined'
      );

      const validStatusRoutes = [
        '/Buldakguy/status/2110367916348899354',
        '/elonmusk/status/1234567890',
        '/user_123/status/9876543210/photo/1',
        '/any_user/status/100/analytics',
        '/i/status/12345'
      ];
      for (const r of validStatusRoutes) {
        assert.equal(isStatusPage(r), true, `Route ${r} must be recognized as status page`);
      }

      const invalidStatusRoutes = [
        '/Hanssony_',
        '/Hanssony_/followers',
        '/Hanssony_/following',
        '/Hanssony_/verified_followers',
        '/home',
        '/explore',
        '/notifications',
        '/messages',
        '/i/bookmarks',
        '/user/status',
        '/user/status/',
        '/user/status/abc',
        '/status/123',
        ''
      ];
      for (const r of invalidStatusRoutes) {
        assert.equal(isStatusPage(r), false, `Route ${r} must NOT be recognized as status page`);
      }

      const prevLoc = globalThis.location;
      try {
        globalThis.location = { pathname: '/author/status/9999999' };
        assert.equal(isStatusPage(), true, 'isStatusPage() without args must read global location');
        globalThis.location = { pathname: '/home' };
        assert.equal(isStatusPage(), false, 'isStatusPage() without args on /home must return false');
      } finally {
        globalThis.location = prevLoc;
      }

      // findFollowListTabLink testing
      assert.equal(findFollowListTabLink('KeyA', { querySelector: () => null }, '/Hanssony_/following'), null);
      assert.equal(findFollowListTabLink('Digit1', { querySelector: () => null }, '/Hanssony_/following'), null);
      assert.equal(findFollowListTabLink(null, { querySelector: () => null }, '/Hanssony_/following'), null);

      const mockTabV = { id: 'tab-v', href: '/Hanssony_/verified_followers' };
      const mockTabW = { id: 'tab-w', href: '/Hanssony_/followers' };
      const mockTabO = { id: 'tab-o', href: '/Hanssony_/following' };

      const tabDoc = {
        querySelector(sel) {
          if (sel.includes('/verified_followers')) return mockTabV;
          if (sel.includes('/followers')) return mockTabW;
          if (sel.includes('/following')) return mockTabO;
          return null;
        }
      };
      assert.equal(findFollowListTabLink('KeyV', tabDoc, '/Hanssony_/following'), mockTabV);
      assert.equal(findFollowListTabLink('KeyW', tabDoc, '/Hanssony_/following'), mockTabW);
      assert.equal(findFollowListTabLink('KeyO', tabDoc, '/Hanssony_/followers'), mockTabO);

      let pushedPath = null;
      let popstateFired = false;
      const mockWindow = {
        dispatchEvent(ev) {
          if (ev.type === 'popstate') popstateFired = true;
          return true;
        }
      };
      const mockHistory = {
        pushState(state, title, url) {
          pushedPath = url;
        }
      };

      const prevWin = globalThis.window;
      const prevHist = globalThis.history;
      globalThis.window = mockWindow;
      globalThis.history = mockHistory;

      try {
        const emptyDoc = { querySelector: () => null };
        const syntheticLink = findFollowListTabLink('KeyW', emptyDoc, '/elonmusk/status/123456');
        assert.ok(syntheticLink, 'findFollowListTabLink must return synthetic link when DOM tab absent');
        assert.equal(syntheticLink.href, '/elonmusk/followers');

        syntheticLink.click();
        assert.equal(pushedPath, '/elonmusk/followers', 'click() must pushState to target path');
        assert.equal(popstateFired, true, 'click() must dispatch popstate event');
      } finally {
        globalThis.window = prevWin;
        globalThis.history = prevHist;
      }

      const noUserDoc = { querySelector: () => null };
      assert.equal(findFollowListTabLink('KeyW', noUserDoc, '/home'), null);

      // applyConfigUpdate testing
      applyConfigUpdate({
        compactPillDesign: '1',
        uiLang: 'ja',
        filterNonFollowers: true,
        compactNewPostsPill: false,
        showUiHints: false
      });
      assert.equal(getCompactPillDesign(), '1');
      assert.equal(getUiLang(), 'ja');
      assert.equal(getFilterNonFollowers(), true);
      assert.equal(getCompactNewPostsPill(), false);

      applyConfigUpdate({
        compactPillDesign: 'unknown_design',
        uiLang: 'auto'
      });
      assert.equal(getCompactPillDesign(), '3', 'Invalid compactPillDesign must normalize to "3"');
      assert.equal(getUiLang(), 'auto', 'uiLang "auto" must report "auto"');

      applyConfigUpdate(null);
      applyConfigUpdate(undefined);
      applyConfigUpdate({});

      applyConfigUpdate({
        compactPillDesign: '3',
        uiLang: 'auto',
        filterNonFollowers: false,
        compactNewPostsPill: true,
        showUiHints: true
      });
    }

  // 29. Shift+F cooperative main-thread yielding, steady-state zero-DOM-churn, & concurrent UI responsiveness
  {
    const prevScrollBy = globalThis.window.scrollBy;
    let scrollByCalls = [];
    globalThis.window.scrollBy = (x, y) => {
      scrollByCalls.push([x, y]);
    };

    try {
      const makeTrackedSuite = (cellCount, mode) => {
        const stats = {
          attrWrites: 0,
          attrRemoves: 0,
          stylePropWrites: 0,
          cellQueries: 0
        };

        const makeAttrBag = (tagName = 'DIV', initial = {}) => {
          const attrs = { ...initial };
          const classes = new Set();
          return {
            nodeType: 1,
            tagName,
            isConnected: true,
            getAttribute(k) {
              return Object.prototype.hasOwnProperty.call(attrs, k) ? attrs[k] : null;
            },
            setAttribute(k, v) {
              stats.attrWrites++;
              attrs[k] = String(v);
            },
            removeAttribute(k) {
              stats.attrRemoves++;
              delete attrs[k];
            },
            classList: {
              add(c) {
                classes.add(c);
              },
              remove(c) {
                classes.delete(c);
              },
              contains(c) {
                return classes.has(c);
              }
            }
          };
        };

        const styleMap = new Map();
        const docEl = {
          ...makeAttrBag('HTML'),
          lang: 'ko',
          style: {
            setProperty(k, v) {
              stats.stylePropWrites++;
              styleMap.set(k, String(v));
            },
            getPropertyValue(k) {
              return styleMap.get(k) || '';
            }
          }
        };

        const headStyles = new Map();
        const head = {
          nodeType: 1,
          tagName: 'HEAD',
          appendChild(el) {
            el.parentElement = head;
            if (el.id) headStyles.set(el.id, el);
            return el;
          }
        };

        const rows = [];
        const cells = [];
        const buttons = [];
        const links = [];

        let barEl = null;
        let toggleBtnEl = null;

        const primary = {
          ...makeAttrBag('DIV', { 'data-testid': 'primaryColumn' }),
          firstChild: null,
          insertBefore(el) {
            el.parentNode = primary;
            if (el.id === 'xfs-following-filter-bar') barEl = el;
            return el;
          },
          appendChild(el) {
            el.parentNode = primary;
            if (el.id === 'xfs-following-filter-bar') barEl = el;
            return el;
          },
          contains(node) {
            return (
              node === primary ||
              cells.includes(node) ||
              rows.includes(node) ||
              links.includes(node) ||
              buttons.includes(node)
            );
          },
          querySelector(sel) {
            if (sel === '#xfs-following-filter-bar') return barEl;
            if (sel === '[role="tablist"]') {
              return {
                getBoundingClientRect: () => ({ top: 0, bottom: 106, height: 53 }),
                closest: () => null
              };
            }
            return null;
          },
          querySelectorAll(sel) {
            if (sel === '[data-testid="UserCell"]') return cells;
            return [];
          }
        };

        for (let i = 0; i < cellCount; i++) {
          // Every 5th cell is unfiltered (non-follower / not-followed-back), others are filtered out
          const isFilteredInitial = i % 5 !== 1;
          const row = {
            ...makeAttrBag('DIV', { 'data-testid': 'cellInnerDiv' }),
            getBoundingClientRect: () => {
              const hidden =
                docEl.getAttribute('data-xfs-filter-non-followers') === 'true' &&
                row.getAttribute('data-xfs-hidden') === 'true';
              return hidden
                ? { top: 200, bottom: 200, height: 0 }
                : { top: 200 + i * 72, bottom: 272 + i * 72, height: 72 };
            },
            closest(sel) {
              if (sel === '[data-testid="cellInnerDiv"]') return row;
              if (sel === '[data-testid="primaryColumn"]') return primary;
              return null;
            },
            querySelector(sel) {
              if (sel === '[data-testid="UserCell"]') return cell;
              return null;
            }
          };

          const tid =
            mode === 'following'
              ? `${1000 + i}-unfollow`
              : isFilteredInitial
                ? `${1000 + i}-unfollow`
                : `${1000 + i}-follow`;
          const btn = {
            ...makeAttrBag('BUTTON', {
              'data-testid': tid,
              'aria-label': `@user_${i} 팔로우`
            }),
            clicked: 0,
            click() {
              this.clicked++;
            },
            closest(sel) {
              if (sel.includes('UserCell')) return cell;
              if (sel === '[data-testid="cellInnerDiv"]') return row;
              return null;
            }
          };

          const link = {
            ...makeAttrBag('A', { href: `/user_${i}`, role: 'link', tabindex: '-1' }),
            focused: 0,
            focus() {
              this.focused++;
              doc.activeElement = link;
            },
            closest(sel) {
              if (sel === '[data-testid="UserCell"]') return cell;
              if (sel === '[data-testid="cellInnerDiv"]') return row;
              return null;
            }
          };

          const indicator =
            mode === 'following' && isFilteredInitial
              ? makeAttrBag('SPAN', { 'data-testid': 'userFollowIndicator' })
              : null;
          const userNameNode = makeAttrBag('DIV', { 'data-testid': 'UserName' });

          const cell = {
            ...makeAttrBag('DIV', { 'data-testid': 'UserCell' }),
            closest(sel) {
              if (sel === '[data-testid="cellInnerDiv"]') return row;
              if (sel === '[data-testid="UserCell"]') return cell;
              if (sel === '[data-testid="primaryColumn"]') return primary;
              return null;
            },
            querySelector(sel) {
              stats.cellQueries++;
              if (sel === '[data-testid="userFollowIndicator"]') return indicator;
              if (sel === '[data-testid="UserName"]') return userNameNode;
              if (sel === 'a[role="link"][tabindex="-1"]' || sel === 'a[href]') return link;
              const curBtnTid = btn.getAttribute('data-testid') || '';
              if (sel === '[data-testid$="-follow"]') {
                return curBtnTid.endsWith('-follow') ? btn : null;
              }
              if (sel === '[data-testid$="-unfollow"], [data-testid$="-cancel"]') {
                return curBtnTid.endsWith('-unfollow') || curBtnTid.endsWith('-cancel') ? btn : null;
              }
              if (sel.includes('-follow') || sel.includes('-unfollow')) {
                return btn;
              }
              return null;
            },
            querySelectorAll(sel) {
              if (sel === 'a[href]') return [link];
              return [];
            }
          };

          rows.push(row);
          cells.push(cell);
          buttons.push(btn);
          links.push(link);
        }

        let confirmModalOpen = false;
        let confirmClicks = 0;
        let cancelClicks = 0;
        const confirmSheetBtn = {
          ...makeAttrBag('BUTTON', { 'data-testid': 'confirmationSheetConfirm' }),
          click() {
            confirmClicks++;
            confirmModalOpen = false;
          }
        };
        const cancelSheetBtn = {
          ...makeAttrBag('BUTTON', { 'data-testid': 'confirmationSheetCancel' }),
          click() {
            cancelClicks++;
            confirmModalOpen = false;
          }
        };

        const doc = {
          body: mockBody,
          hidden: false,
          activeElement: mockBody,
          documentElement: docEl,
          head,
          createElement(tag) {
            const upper = String(tag || 'DIV').toUpperCase();
            const el = {
              ...makeAttrBag(upper),
              id: '',
              type: '',
              textContent: '',
              parentNode: null,
              previousSibling: null,
              appendChild(child) {
                child.parentNode = el;
                if (child.id === 'xfs-non-follower-toggle') toggleBtnEl = child;
                return child;
              },
              addEventListener() {},
              remove() {
                if (el.id && headStyles.get(el.id) === el) headStyles.delete(el.id);
                if (el === barEl) barEl = null;
                el.parentNode = null;
              }
            };
            return el;
          },
          getElementById(id) {
            if (headStyles.has(id)) return headStyles.get(id);
            if (id === 'xfs-following-filter-bar') return barEl;
            if (id === 'xfs-non-follower-toggle') return toggleBtnEl;
            return null;
          },
          querySelector(sel) {
            if (sel === '[data-testid="primaryColumn"]') return primary;
            if (sel === 'header nav a[data-testid="AppTabBar_Profile_Link"]') {
              return { getAttribute: (k) => (k === 'href' ? '/Hanssony_' : null) };
            }
            if (confirmModalOpen && sel === '[data-testid="confirmationSheetConfirm"]') {
              return confirmSheetBtn;
            }
            if (confirmModalOpen && sel === '[data-testid="confirmationSheetCancel"]') {
              return cancelSheetBtn;
            }
            if (confirmModalOpen && sel.includes('confirmationSheetConfirm')) {
              return confirmSheetBtn;
            }
            return null;
          },
          querySelectorAll(sel) {
            if (sel === '[data-xfs-target="true"]') {
              return buttons.filter((b) => b.getAttribute('data-xfs-target') === 'true');
            }
            if (sel.includes('data-xfs-mutual')) {
              return [...cells, ...rows].filter(
                (el) =>
                  el.getAttribute('data-xfs-mutual') === 'true' ||
                  el.getAttribute('data-xfs-hidden') === 'true' ||
                  el.getAttribute('data-xfs-focused') === 'true'
              );
            }
            return [];
          }
        };

        return {
          doc,
          primary,
          rows,
          cells,
          buttons,
          links,
          stats,
          headStyles,
          openConfirmModal() {
            confirmModalOpen = true;
          },
          getModalCounts() {
            return { confirmClicks, cancelClicks, confirmModalOpen };
          }
        };
      };

      // 18a. Cooperative chunking & main-thread yielding across 220 UserCells on /followers
      setFilterNonFollowers(false);
      setShowUiHints(true);
      const flwSuite = makeTrackedSuite(220, 'followers');
      globalThis.document = flwSuite.doc;
      globalThis.location = { pathname: '/Hanssony_/followers' };

      const eventOrder = [];
      setFilterNonFollowers(true);
      eventOrder.push('toggle-returned');

      // CSS root attributes are applied synchronously for immediate visual hiding
      assert.equal(flwSuite.doc.documentElement.getAttribute('data-xfs-filter-mode'), 'followers');
      assert.equal(flwSuite.doc.documentElement.getAttribute('data-xfs-filter-non-followers'), 'true');
      assert.equal(flwSuite.primary.getAttribute('data-xfs-filter-non-followers'), 'true');
      assert.ok(
        flwSuite.headStyles.get('xfs-filter-styles')?.textContent.includes('content-visibility: hidden'),
        'Filter stylesheet must apply content-visibility: hidden to collapsed rows'
      );

      // Only the first budget (80 cells) was processed synchronously; tail cells deferred to yielded chunks
      assert.equal(flwSuite.cells[0].getAttribute('data-xfs-hidden'), 'true');
      assert.equal(flwSuite.cells[1].getAttribute('data-xfs-hidden'), null);
      assert.equal(
        flwSuite.cells[219].getAttribute('data-xfs-hidden'),
        null,
        'Tail cell 219 must be deferred to a yielded macrotask chunk instead of monopolizing one turn'
      );

      // Queue a 0ms UI macrotask: it MUST execute before the next filter chunk runs!
      let hiddenAtZeroMsTick = null;
      setTimeout(() => {
        eventOrder.push('ui-macrotask-0ms');
        hiddenAtZeroMsTick = flwSuite.cells[219].getAttribute('data-xfs-hidden');
      }, 0);

      await new Promise((r) => setTimeout(r, 180));
      assert.equal(eventOrder[0], 'toggle-returned');
      assert.equal(eventOrder[1], 'ui-macrotask-0ms', 'UI 0ms macrotask must run before yielded filter chunks');
      assert.equal(hiddenAtZeroMsTick, null, 'Chunk continuation must yield at least one macrotask gap');

      // All 220 cells are now accurately processed
      for (let i = 0; i < 220; i++) {
        const expected = i % 5 !== 1 ? 'true' : null;
        assert.equal(
          flwSuite.cells[i].getAttribute('data-xfs-hidden'),
          expected,
          `Cell ${i} hidden state mismatch after cooperative chunking`
        );
      }

      // 18b. Steady-state convergence: repeated syncUiHints() performs ZERO DOM/style writes & ZERO cell queries
      flwSuite.stats.attrWrites = 0;
      flwSuite.stats.attrRemoves = 0;
      flwSuite.stats.stylePropWrites = 0;
      flwSuite.stats.cellQueries = 0;
      for (let k = 0; k < 5; k++) {
        syncUiHints();
      }
      assert.equal(flwSuite.stats.attrWrites, 0, 'Steady-state syncUiHints must perform 0 setAttribute calls');
      assert.equal(flwSuite.stats.attrRemoves, 0, 'Steady-state syncUiHints must perform 0 removeAttribute calls');
      assert.equal(flwSuite.stats.stylePropWrites, 0, 'Steady-state syncUiHints must perform 0 style.setProperty calls');
      assert.equal(flwSuite.stats.cellQueries, 0, 'Steady-state syncUiHints must perform 0 per-cell querySelector calls');

      // Wait another 80ms while idle: zero background chunk timers remain firing
      await new Promise((r) => setTimeout(r, 80));
      assert.equal(flwSuite.stats.attrWrites, 0, 'Idle steady state must have 0 background timer churn');

      // Incremental single-cell update: clicking Follow Back flips button data-testid from -follow to -unfollow
      flwSuite.buttons[1].setAttribute('data-testid', '1001-unfollow');
      flwSuite.stats.attrWrites = 0;
      flwSuite.stats.cellQueries = 0;
      syncFollowingFilter(flwSuite.doc, '/Hanssony_/followers');
      assert.equal(flwSuite.cells[1].getAttribute('data-xfs-hidden'), 'true', 'Mutated cell must update immediately');
      assert.ok(flwSuite.stats.attrWrites <= 4, `Expected O(1) attribute writes for 1 changed cell, got ${flwSuite.stats.attrWrites}`);
      assert.ok(flwSuite.stats.cellQueries <= 4, `Expected O(1) cell queries for 1 changed cell, got ${flwSuite.stats.cellQueries}`);

      // MutationObserver record filter ignores <style> (Dark Reader / AdGuard), <head>, #xfs-*, and text-only nodes
      const darkReaderStyleNode = { nodeType: 1, tagName: 'STYLE', id: '', closest: () => flwSuite.doc.head };
      const ownBarNode = { nodeType: 1, tagName: 'BUTTON', id: 'xfs-non-follower-toggle', closest: (s) => (s.includes('xfs-following-filter-bar') ? {} : null) };
      const textNodeOnly = { nodeType: 3, parentElement: flwSuite.primary };
      const realCellNode = { nodeType: 1, tagName: 'DIV', id: '', closest: () => null };
      assert.equal(
        shouldScheduleSyncForMutations([
          { type: 'childList', target: darkReaderStyleNode, addedNodes: [{ nodeType: 3 }], removedNodes: [] },
          { type: 'childList', target: flwSuite.doc.head, addedNodes: [darkReaderStyleNode], removedNodes: [] },
          { type: 'attributes', target: ownBarNode },
          { type: 'childList', target: flwSuite.primary, addedNodes: [textNodeOnly], removedNodes: [] }
        ]),
        false,
        'External <style>, <head>, #xfs-*, and text-only mutations must never schedule syncs'
      );
      assert.equal(
        shouldScheduleSyncForMutations([
          { type: 'childList', target: flwSuite.primary, addedNodes: [realCellNode], removedNodes: [] }
        ]),
        true,
        'Element additions in timeline must schedule background sync'
      );
      assert.equal(
        shouldScheduleSyncForMutations([
          { type: 'attributes', target: flwSuite.buttons[6] }
        ]),
        true,
        'Button data-testid attribute change must schedule background sync'
      );

      // Unhydrated skeleton cells on /following terminate in bounded slices (no infinite re-scan loop)
      const skeletonCells = Array.from({ length: 120 }, () => ({
        nodeType: 1,
        tagName: 'DIV',
        getAttribute: () => null,
        setAttribute() {},
        removeAttribute() {},
        closest: () => null,
        querySelector: () => null,
        querySelectorAll: () => []
      }));
      let skeletonScanCount = 0;
      skeletonCells[0].querySelector = (sel) => {
        if (sel === '[data-testid="userFollowIndicator"]') skeletonScanCount++;
        return null;
      };
      const skelPrimary = {
        getAttribute: () => null,
        setAttribute() {},
        removeAttribute() {},
        classList: { add() {}, remove() {}, contains: () => false },
        contains: () => false,
        querySelector: () => null,
        querySelectorAll: (sel) => (sel === '[data-testid="UserCell"]' ? skeletonCells : [])
      };
      const skelDoc = {
        body: mockBody,
        hidden: false,
        activeElement: mockBody,
        documentElement: {
          lang: 'en',
          getAttribute: () => null,
          setAttribute() {},
          removeAttribute() {},
          style: { setProperty() {} }
        },
        head: { appendChild() {} },
        createElement: () => ({ id: '', textContent: '', appendChild() {}, addEventListener() {}, setAttribute() {}, getAttribute: () => null, remove() {} }),
        getElementById: () => null,
        querySelector: (sel) => (sel === '[data-testid="primaryColumn"]' ? skelPrimary : null),
        querySelectorAll: () => []
      };
      globalThis.document = skelDoc;
      globalThis.location = { pathname: '/Hanssony_/following' };
      syncFollowingFilter(skelDoc, '/Hanssony_/following');
      await new Promise((r) => setTimeout(r, 150));
      const scansAfterSettle = skeletonScanCount;
      await new Promise((r) => setTimeout(r, 80));
      assert.equal(skeletonScanCount, scansAfterSettle, 'Unhydrated skeleton cells must not loop chunk timers indefinitely');
      assert.equal(scansAfterSettle, 1, 'Cell 0 in skeleton pass must be scanned once per pass thanks to monotonic startIndex');

      // 18b-2. Partial follower hydration (avatar before -follow button) & detached button swap must NOT permanently cache as self
      {
        let mountedFollowBtn = null;
        const avatarNode = { nodeType: 1, tagName: 'DIV', getAttribute: () => 'UserAvatar-Container-bob' };
        const partialRowAttrs = {};
        const partialCellAttrs = {};
        const partialRow = {
          nodeType: 1,
          tagName: 'DIV',
          isConnected: true,
          getAttribute: (k) => (Object.prototype.hasOwnProperty.call(partialRowAttrs, k) ? partialRowAttrs[k] : null),
          setAttribute: (k, v) => { partialRowAttrs[k] = String(v); },
          removeAttribute: (k) => { delete partialRowAttrs[k]; },
          classList: { add() {}, remove() {}, contains: () => false }
        };
        const partialCell = {
          nodeType: 1,
          tagName: 'DIV',
          isConnected: true,
          getAttribute: (k) => (Object.prototype.hasOwnProperty.call(partialCellAttrs, k) ? partialCellAttrs[k] : null),
          setAttribute: (k, v) => { partialCellAttrs[k] = String(v); },
          removeAttribute: (k) => { delete partialCellAttrs[k]; },
          classList: { add() {}, remove() {}, contains: () => false },
          contains: (n) => n === partialCell || n === mountedFollowBtn || n === avatarNode,
          closest: (sel) => (sel === '[data-testid="cellInnerDiv"]' ? partialRow : null),
          querySelector: (sel) => {
            if (sel === '[data-testid$="-follow"]') {
              return mountedFollowBtn && mountedFollowBtn.getAttribute('data-testid').endsWith('-follow')
                ? mountedFollowBtn
                : null;
            }
            if (sel === '[data-testid$="-unfollow"], [data-testid$="-cancel"]') {
              return mountedFollowBtn && mountedFollowBtn.getAttribute('data-testid').endsWith('-unfollow')
                ? mountedFollowBtn
                : null;
            }
            if (sel === '[data-testid^="UserAvatar-Container-"]') return avatarNode;
            return null;
          },
          querySelectorAll: (sel) => (sel === 'a[href]' ? [{ getAttribute: () => '/bob_user' }] : [])
        };
        const partialPrimary = {
          getAttribute: () => null,
          setAttribute() {},
          removeAttribute() {},
          classList: { add() {}, remove() {}, contains: () => false },
          contains: () => false,
          querySelector: () => null,
          querySelectorAll: (sel) => (sel === '[data-testid="UserCell"]' ? [partialCell] : [])
        };
        const partialDocAttrs = {};
        const partialDoc = {
          body: mockBody,
          hidden: false,
          activeElement: mockBody,
          documentElement: {
            lang: 'en',
            getAttribute: (k) => (Object.prototype.hasOwnProperty.call(partialDocAttrs, k) ? partialDocAttrs[k] : null),
            setAttribute: (k, v) => { partialDocAttrs[k] = String(v); },
            removeAttribute: (k) => { delete partialDocAttrs[k]; },
            style: { setProperty() {} }
          },
          head: { appendChild() {} },
          createElement: () => ({ id: '', textContent: '', appendChild() {}, addEventListener() {}, setAttribute() {}, getAttribute: () => null, remove() {} }),
          getElementById: () => null,
          querySelector: (sel) => {
            if (sel === '[data-testid="primaryColumn"]') return partialPrimary;
            if (sel === 'header nav a[data-testid="AppTabBar_Profile_Link"]') {
              return { getAttribute: (k) => (k === 'href' ? '/Hanssony_' : null) };
            }
            return null;
          },
          querySelectorAll: () => []
        };

        globalThis.document = partialDoc;
        globalThis.location = { pathname: '/Hanssony_/followers' };
        setFilterNonFollowers(true);
        assert.equal(partialCell.getAttribute('data-xfs-hidden'), 'true', 'Avatar-only unhydrated cell initially hidden');

        // Now React mounts [data-testid="999-follow"] on the cell: syncFollowingFilter MUST unhide it!
        mountedFollowBtn = {
          isConnected: true,
          getAttribute: (k) => (k === 'data-testid' ? '999-follow' : null)
        };
        syncFollowingFilter(partialDoc, '/Hanssony_/followers');
        assert.equal(
          partialCell.getAttribute('data-xfs-hidden'),
          null,
          'Follower cell that had UserAvatar-Container before -follow button mounted must unhide once -follow mounts'
        );
        assert.equal(partialRow.getAttribute('data-xfs-hidden'), null);

        // Next simulate user following (999-unfollow) -> unfollowing where old button detaches on intermediate render -> new 999-follow mounts
        mountedFollowBtn = {
          isConnected: true,
          getAttribute: (k) => (k === 'data-testid' ? '999-unfollow' : null)
        };
        syncFollowingFilter(partialDoc, '/Hanssony_/followers');
        assert.equal(partialCell.getAttribute('data-xfs-hidden'), 'true');

        const detachedBtn = mountedFollowBtn;
        detachedBtn.isConnected = false;
        mountedFollowBtn = null; // intermediate render: avatar still present, button temporarily absent
        syncFollowingFilter(partialDoc, '/Hanssony_/followers');

        mountedFollowBtn = {
          isConnected: true,
          getAttribute: (k) => (k === 'data-testid' ? '999-follow' : null)
        };
        syncFollowingFilter(partialDoc, '/Hanssony_/followers');
        assert.equal(
          partialCell.getAttribute('data-xfs-hidden'),
          null,
          'Follower cell after detached -unfollow -> new -follow swap must unhide cleanly'
        );
      }

      // 18b-3. Interleaved mutation at idx < 80 (cells[5] / cells[1]) while chunk continuation is pending at startIndex = 80
      {
        setFilterNonFollowers(false);
        const interleaveSuite = makeTrackedSuite(220, 'followers');
        globalThis.document = interleaveSuite.doc;
        globalThis.location = { pathname: '/Hanssony_/followers' };

        // Trigger active user wheel window so chunk continuation backs off (120ms), keeping startIndex = 80 in flight
        for (const fn of listeners.wheel || []) fn({ type: 'wheel' });
        setFilterNonFollowers(true);
        assert.equal(interleaveSuite.cells[1].getAttribute('data-xfs-hidden'), null, 'Cell 1 (-follow) initially visible');
        assert.equal(interleaveSuite.cells[219].getAttribute('data-xfs-hidden'), null, 'Chunks 80..219 still in flight');

        // Mutate cell 1 (idx = 1 < 80) from -follow to -unfollow while chunk continuation is pending at startIndex = 80
        interleaveSuite.buttons[1].setAttribute('data-testid', '1001-unfollow');
        scheduleBackgroundUiSync();

        await new Promise((r) => setTimeout(r, 320));
        assert.equal(
          interleaveSuite.cells[1].getAttribute('data-xfs-hidden'),
          'true',
          'Mutated cell at idx < 80 during in-flight chunking must not be skipped by background sync'
        );
        assert.equal(
          interleaveSuite.cells[219].getAttribute('data-xfs-hidden'),
          'true',
          'Tail chunks 80..219 must also complete cleanly'
        );
      }

      // 18c. Concurrent UI responsiveness while Shift+F chunking is actively in flight (/following & /verified_followers)
      setFilterNonFollowers(false);
      const ingSuite = makeTrackedSuite(220, 'following');
      globalThis.document = ingSuite.doc;
      globalThis.location = { pathname: '/Hanssony_/following' };

      // Toggle Shift+F via keyboard shortcut (Korean IME 'ㄹ' + Shift)
      assert.equal(
        handleActionIfMatched(makeEv({ key: 'ㄹ', code: 'KeyF', shiftKey: true }), ingSuite.doc, false),
        true,
        'Shift+F must toggle filter ON'
      );
      assert.equal(getFilterNonFollowers(), true);
      assert.equal(ingSuite.cells[219].getAttribute('data-xfs-hidden'), null, 'Chunks 80..219 still in flight');

      // While chunks 80..219 are still pending: J / K step immediately across visible non-follower cells (indices 1, 6, 11...)
      scrollByCalls.length = 0;
      assert.equal(
        handleActionIfMatched(makeEv({ key: 'ㅓ', code: 'KeyJ' }), ingSuite.doc, false),
        true,
        'J must step immediately while Shift+F chunking is active'
      );
      assert.equal(ingSuite.doc.activeElement, ingSuite.links[1], 'First J focuses first non-follower cell (index 1)');
      assert.equal(ingSuite.cells[1].getAttribute('data-xfs-focused'), 'true');

      assert.equal(
        handleActionIfMatched(makeEv({ key: 'ㅓ', code: 'KeyJ' }), ingSuite.doc, false),
        true,
        'Second J steps to second non-follower cell (index 6)'
      );
      assert.equal(ingSuite.doc.activeElement, ingSuite.links[6]);
      assert.equal(ingSuite.cells[1].getAttribute('data-xfs-focused'), null, 'Previous cell focus highlight cleared in O(1)');
      assert.equal(ingSuite.cells[6].getAttribute('data-xfs-focused'), 'true');

      assert.equal(
        handleActionIfMatched(makeEv({ key: 'ㅏ', code: 'KeyK' }), ingSuite.doc, false),
        true,
        'K steps back to index 1 immediately'
      );
      assert.equal(ingSuite.doc.activeElement, ingSuite.links[1]);

      // Manual wheel scroll immediately cancels alignFollowingCellBelowHeader [35, 90, 160, 240]ms timers (no scroll hijack!)
      const scrollCountBeforeWheel = scrollByCalls.length;
      for (const fn of listeners.wheel || []) fn({ type: 'wheel' });
      await new Promise((r) => setTimeout(r, 270));
      assert.equal(
        scrollByCalls.length,
        scrollCountBeforeWheel,
        'Manual wheel event must cancel pending alignFollowingCellBelowHeader scrollBy timers'
      );

      // F opens unfollow modal on focused non-follower cell, and N / Y handle confirmation modal while Shift+F is ON
      assert.equal(
        handleActionIfMatched(makeEv({ key: 'ㄹ', code: 'KeyF' }), ingSuite.doc, false),
        true,
        'F must click target cell button while Shift+F is active'
      );
      assert.equal(ingSuite.buttons[1].clicked, 1);
      ingSuite.openConfirmModal();

      // Pointerdown right after modal cancel must also prevent restoreCellFocusIfNeeded from stealing focus
      assert.equal(
        handleActionIfMatched(makeEv({ key: 'ㅜ', code: 'KeyN' }), ingSuite.doc, false),
        true,
        'N cancels confirmation modal while Shift+F is active'
      );
      assert.equal(ingSuite.getModalCounts().cancelClicks, 1);
      const customClickedTarget = { nodeType: 1, tagName: 'BUTTON', getAttribute: () => null, closest: () => null };
      ingSuite.doc.activeElement = customClickedTarget;
      for (const fn of listeners.pointerdown || []) fn({ type: 'pointerdown' });
      await new Promise((r) => setTimeout(r, 170));
      assert.equal(
        ingSuite.doc.activeElement,
        customClickedTarget,
        'User pointerdown must cancel restoreCellFocusIfNeeded timers so focus is not hijacked'
      );

      // Re-focus cell 1, open modal, confirm with Y
      ingSuite.links[1].focus();
      ingSuite.openConfirmModal();
      assert.equal(
        handleActionIfMatched(makeEv({ key: 'ㅛ', code: 'KeyY' }), ingSuite.doc, false),
        true,
        'Y confirms modal while Shift+F is active'
      );
      assert.equal(ingSuite.getModalCounts().confirmClicks, 1);

      // Toggle Shift+F OFF while chunking is in flight on /verified_followers: cancels pending ON chunks immediately
      const vfSuite = makeTrackedSuite(220, 'followers');
      globalThis.document = vfSuite.doc;
      globalThis.location = { pathname: '/Hanssony_/verified_followers' };
      setFilterNonFollowers(true);
      assert.equal(vfSuite.doc.documentElement.getAttribute('data-xfs-filter-non-followers'), 'true');
      assert.equal(vfSuite.cells[219].getAttribute('data-xfs-hidden'), null);

      // Immediately toggle Shift+F OFF before ON chunks run!
      assert.equal(
        handleActionIfMatched(makeEv({ key: 'F', code: 'KeyF', shiftKey: true }), vfSuite.doc, false),
        true,
        'Shift+F must immediately toggle filter OFF even while ON chunks were queued'
      );
      assert.equal(getFilterNonFollowers(), false);
      assert.equal(
        vfSuite.doc.documentElement.getAttribute('data-xfs-filter-non-followers'),
        null,
        'Root filter attribute must be removed synchronously on Shift+F OFF'
      );
      await new Promise((r) => setTimeout(r, 180));
      for (let i = 0; i < 220; i++) {
        assert.equal(
          vfSuite.cells[i].getAttribute('data-xfs-hidden'),
          null,
          `Cell ${i} must have data-xfs-hidden cleared after Shift+F OFF`
        );
      }

      // Leaving filter route (/verified_followers -> /home) cleans up once, then does 0 filter work on /home
      globalThis.location = { pathname: '/home' };
      syncUiHints();
      assert.equal(vfSuite.doc.documentElement.getAttribute('data-xfs-filter-mode'), null);
      vfSuite.stats.attrRemoves = 0;
      syncUiHints();
      assert.equal(vfSuite.stats.attrRemoves, 0, 'Repeated /home syncs must not re-run filter cleanup');
    } finally {
      if (prevScrollBy === undefined) {
        delete globalThis.window.scrollBy;
      } else {
        globalThis.window.scrollBy = prevScrollBy;
      }
      setFilterNonFollowers(false);
    }
  }

  console.log('All assertions passed.');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
