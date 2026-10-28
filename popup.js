const DEFAULT_SHORTCUT = {
  key: 'f',
  code: 'KeyF',
  ctrl: false,
  alt: false,
  shift: false,
  meta: false
};

const I18N = {
  ko: {
    title: 'X 다국어 단축키 & 팔로우 (F)',
    recorderAria: '단축키 입력',
    statusDefault: '클릭 후 팔로우 단축키 변경 (한/일/중 입력 지원)',
    statusSaved: '저장됨',
    statusSaveFailed: '저장 실패',
    statusHintsOn: '단축키 UI 표시 켜짐',
    statusHintsOff: '단축키 UI 표시 꺼짐',
    statusFilterOn: '맞팔 안 한 계정만 보기 켜짐',
    statusFilterOff: '맞팔 안 한 계정만 보기 꺼짐',
    statusCompactPillOn: '"게시됨" 플로팅 버튼 최소화 켜짐',
    statusCompactPillOff: '"게시됨" 플로팅 버튼 최소화 꺼짐',
    statusWaiting: '입력 대기 중',
    statusClickToSet: '클릭 후 새 단축키 입력',
    recorderPrompt: '키 조합을 누르세요...',
    resetBtn: '초기화 (F)',
    toggleHints: '버튼·메뉴에 단축키 UI 표시',
    toggleNonFollowers: '팔로잉 목록에서 맞팔 안 한 계정만 보기 (⇧F)',
    toggleCompactPill: '"게시됨" 플로팅 버튼 최소화 (컨텐츠 가림 방지)',
    compactPillDesignLabel: '플로팅 버튼 디자인',
    compactPillDesign1: '1. 우측 상단 글래스 캡슐',
    compactPillDesign2: '2. 상단 탭바 밀착 슬림 바',
    compactPillDesign3: '3. 우측 상단 초소형 아이콘 (↑ .)',
    extSectionTitle: '확장 프로그램 추가 단축키',
    extFollowDesc: '프로필 / 게시물(status) / 팔로워·팔로잉 목록에서 팔로우·언팔로우·서로 팔로우',
    extFilterDesc: '팔로잉(/following) 페이지에서 나를 팔로우하지 않는 사용자만 필터링 토글',
    extModalDesc: '언팔로우·차단·뮤트 확인 모달에서 확인(Y) / 취소(N)',
    extTabDesc: '인증된 팔로워(V) / 팔로워(W) / 팔로잉(O) 이동',
    extQuoteDesc: '재게시 메뉴 열기 / 인용(Quote) 바로 선택',
    xSectionTitle: 'X (?) 전체 단축키 (한·일·중 다국어 자동 변환)',
    xHelpNewDesc: '단축키 도움말(?) / 새 게시물 불러오기(.)',
    xJkDesc: '다음 / 이전 게시물·계정 이동',
    xSpaceEnterDesc: '페이지 내리기(Space) / 게시물 상세 열기(Enter)',
    xNewPostDesc: '새 게시물 작성(N) / 게시물 전송(⌘+Enter)',
    xSearchDesc: '검색창 포커스',
    xLrtDesc: '마음에 들어요(L) / 답글(R) / 재게시(T)',
    xSbDesc: '공유하기(S) / 북마크(B)',
    xUxDesc: '계정 뮤트(U) / 계정 차단(X)',
    xOimDesc: '사진 펼치기(O) / 쪽지함(I) / 동영상 뮤트(M)',
    xG1Desc: '홈(H) / 탐색(E) / 알림(N) / 멘션(R) / 프로필(P)',
    xG2Desc: '초안(F) / 예약(T) / 좋아요(L) / 리스트(I) / 채팅(M)',
    xG3Desc: 'Grok(G) / 스튜디오(C) / 설정(S) / 북마크(B) / 사용자(U) / 표시(D)',
    xAudioDesc: '오디오독 이동(D) / 재생·일시중지(Space) / 음소거(M)'
  },
  en: {
    title: 'X Multilingual Shortcuts & Follow (F)',
    recorderAria: 'Shortcut Recorder',
    statusDefault: 'Click to change Follow shortcut (IME supported)',
    statusSaved: 'Saved',
    statusSaveFailed: 'Save failed',
    statusHintsOn: 'Shortcut UI hints enabled',
    statusHintsOff: 'Shortcut UI hints disabled',
    statusFilterOn: 'Non-followers filter enabled',
    statusFilterOff: 'Non-followers filter disabled',
    statusCompactPillOn: 'Compact "Posted" pill enabled',
    statusCompactPillOff: 'Compact "Posted" pill disabled',
    statusWaiting: 'Listening for key...',
    statusClickToSet: 'Click to set a new shortcut',
    recorderPrompt: 'Press any key combination...',
    resetBtn: 'Reset (F)',
    toggleHints: 'Show shortcut hints on buttons & menus',
    toggleNonFollowers: 'Filter non-followers on /following (⇧F)',
    toggleCompactPill: 'Minimize floating "Posted" pill (/home, /notifications*)',
    compactPillDesignLabel: 'Floating pill design',
    compactPillDesign1: '1. Top-right glass capsule',
    compactPillDesign2: '2. Top-docked slim bar',
    compactPillDesign3: '3. Top-right micro icon (↑ .)',
    extSectionTitle: 'Extension Added Shortcuts',
    extFollowDesc: 'Follow / Unfollow / Follow Back on Profile, Post Status, or J/K list item',
    extFilterDesc: 'Toggle filtering users who do not follow you back on /following',
    extModalDesc: 'Confirm (Y) or Cancel (N) in Unfollow, Block, and Mute dialogs',
    extTabDesc: 'Go to Verified Followers (V) / Followers (W) / Following (O)',
    extQuoteDesc: 'Open Repost menu / Select Quote directly',
    xSectionTitle: 'All X (?) Shortcuts (Multilingual IME Auto-Convert)',
    xHelpNewDesc: 'Shortcut help (?) / Load new posts (.)',
    xJkDesc: 'Next / Previous post or account',
    xSpaceEnterDesc: 'Page down (Space) / Open post details (Enter)',
    xNewPostDesc: 'New post (N) / Send post (⌘+Enter)',
    xSearchDesc: 'Focus search bar',
    xLrtDesc: 'Like (L) / Reply (R) / Repost (T)',
    xSbDesc: 'Share (S) / Bookmark (B)',
    xUxDesc: 'Mute account (U) / Block account (X)',
    xOimDesc: 'Expand photo (O) / Messages dock (I) / Mute video (M)',
    xG1Desc: 'Home (H) / Explore (E) / Notifications (N) / Mentions (R) / Profile (P)',
    xG2Desc: 'Drafts (F) / Scheduled (T) / Likes (L) / Lists (I) / Messages (M)',
    xG3Desc: 'Grok (G) / Studio (C) / Settings (S) / Bookmarks (B) / User (U) / Display (D)',
    xAudioDesc: 'Audio dock (D) / Play·Pause (Space) / Mute (M)'
  },
  zh: {
    title: 'X 多语言快捷键 & 关注 (F)',
    recorderAria: '快捷键录制',
    statusDefault: '点击修改关注快捷键（支持中/韩/日输入法）',
    statusSaved: '已保存',
    statusSaveFailed: '保存失败',
    statusHintsOn: '快捷键 UI 提示已开启',
    statusHintsOff: '快捷键 UI 提示已关闭',
    statusFilterOn: '仅看未回关筛选已开启',
    statusFilterOff: '仅看未回关筛选已关闭',
    statusCompactPillOn: '浮动新帖按钮精简已开启',
    statusCompactPillOff: '浮动新帖按钮精简已关闭',
    statusWaiting: '等待按键输入...',
    statusClickToSet: '点击设置新快捷键',
    recorderPrompt: '请按下按键组合...',
    resetBtn: '重置 (F)',
    toggleHints: '在按钮和菜单上显示快捷键提示',
    toggleNonFollowers: '在正在关注列表中仅看未回关用户 (⇧F)',
    toggleCompactPill: '精简浮动“已发帖”按钮（防止遮挡内容）',
    compactPillDesignLabel: '浮动按钮样式',
    compactPillDesign1: '1. 右上角半透明胶囊',
    compactPillDesign2: '2. 顶部贴合超薄条',
    compactPillDesign3: '3. 右上角迷你图标 (↑ .)',
    extSectionTitle: '扩展新增快捷键',
    extFollowDesc: '在个人主页 / 帖子详情 / 关注列表中关注·取消关注·回关',
    extFilterDesc: '在正在关注(/following)页面筛选未回关你的用户',
    extModalDesc: '在取消关注·屏蔽·静音确认弹窗中确认(Y) / 取消(N)',
    extTabDesc: '跳转到认证关注者(V) / 关注者(W) / 正在关注(O)',
    extQuoteDesc: '打开转发菜单 / 直接选择引用(Quote)',
    xSectionTitle: 'X (?) 全部快捷键（中·韩·日输入法自动转换）',
    xHelpNewDesc: '快捷键帮助(?) / 加载新帖子(.)',
    xJkDesc: '下一条 / 上一条帖子或账号',
    xSpaceEnterDesc: '向下翻页(Space) / 打开帖子详情(Enter)',
    xNewPostDesc: '发新帖子(N) / 发送帖子(⌘+Enter)',
    xSearchDesc: '聚焦搜索框',
    xLrtDesc: '喜欢(L) / 回复(R) / 转发(T)',
    xSbDesc: '分享(S) / 书签(B)',
    xUxDesc: '静音账号(U) / 屏蔽账号(X)',
    xOimDesc: '展开图片(O) / 私信栏(I) / 视频静音(M)',
    xG1Desc: '主页(H) / 探索(E) / 通知(N) / 提及(R) / 个人资料(P)',
    xG2Desc: '草稿(F) / 定时(T) / 喜欢(L) / 列表(I) / 聊天(M)',
    xG3Desc: 'Grok(G) / 工作室(C) / 设置(S) / 书签(B) / 用户(U) / 显示(D)',
    xAudioDesc: '音频栏(D) / 播放·暂停(Space) / 静音(M)'
  },
  ja: {
    title: 'X 多言語ショートカット & フォロー (F)',
    recorderAria: 'ショートカット入力',
    statusDefault: 'クリックしてフォローキーを変更（日/韓/中 IME対応）',
    statusSaved: '保存しました',
    statusSaveFailed: '保存に失敗しました',
    statusHintsOn: 'ショートカット UI 表示：オン',
    statusHintsOff: 'ショートカット UI 表示：オフ',
    statusFilterOn: '片思いフィルター：オン',
    statusFilterOff: '片思いフィルター：オフ',
    statusCompactPillOn: 'フローティング通知ボタン最小化：オン',
    statusCompactPillOff: 'フローティング通知ボタン最小化：オフ',
    statusWaiting: 'キー入力を待機中...',
    statusClickToSet: 'クリックして新しいキーを設定',
    recorderPrompt: 'キーの組み合わせを押してください...',
    resetBtn: 'リセット (F)',
    toggleHints: 'ボタン・メニューにショートカット UI を表示',
    toggleNonFollowers: 'フォロー中一覧で片思い（未フォローバック）のみ表示 (⇧F)',
    toggleCompactPill: '「ポスト済」フローティングボタンを最小化',
    compactPillDesignLabel: 'ボタンデザイン',
    compactPillDesign1: '1. 右上半透明カプセル',
    compactPillDesign2: '2. タブ下密着スリムバー',
    compactPillDesign3: '3. 右上ミニアイコン (↑ .)',
    extSectionTitle: '拡張機能で追加されるショートカット',
    extFollowDesc: 'プロフィール / ポスト詳細 / フォロワー・フォロー中一覧でフォロー・解除',
    extFilterDesc: 'フォロー中(/following)ページでフォローされていないユーザーのみ表示切替',
    extModalDesc: 'フォロー解除・ブロック・ミュート確認モーダルで確認(Y) / キャンセル(N)',
    extTabDesc: '認証済みフォロワー(V) / フォロワー(W) / フォロー中(O) へ移動',
    extQuoteDesc: 'リポストメニューを開く / 引用(Quote)を直接選択',
    xSectionTitle: 'X (?) 全標準ショートカット（日・韓・中 多言語自動変換）',
    xHelpNewDesc: 'ショートカット一覧(?) / 新しいポストを表示(.)',
    xJkDesc: '次 / 前のポスト・アカウントへ移動',
    xSpaceEnterDesc: 'ページスクロール(Space) / ポスト詳細を開く(Enter)',
    xNewPostDesc: '新規ポスト作成(N) / ポスト送信(⌘+Enter)',
    xSearchDesc: '検索バーにフォーカス',
    xLrtDesc: 'いいね(L) / 返信(R) / リポスト(T)',
    xSbDesc: '共有(S) / ブックマーク(B)',
    xUxDesc: 'ミュート(U) / ブロック(X)',
    xOimDesc: '画像を拡大(O) / DMドック(I) / 動画ミュート(M)',
    xG1Desc: 'ホーム(H) / 話題を検索(E) / 通知(N) / メンション(R) / プロフィール(P)',
    xG2Desc: '下書き(F) / 予約済み(T) / いいね(L) / リスト(I) / チャット(M)',
    xG3Desc: 'Grok(G) / スタジオ(C) / 設定(S) / ブックマーク(B) / ユーザー(U) / 表示(D)',
    xAudioDesc: 'オーディオドック(D) / 再生・一時停止(Space) / ミュート(M)'
  }
};

function detectBrowserLang(navLang = (typeof navigator !== 'undefined' && navigator.language) || 'en') {
  const lower = String(navLang).toLowerCase();
  if (lower.startsWith('ko')) return 'ko';
  if (lower.startsWith('zh')) return 'zh';
  if (lower.startsWith('ja')) return 'ja';
  return 'en';
}

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

let currentLang = detectBrowserLang();
let lastStatusKey = 'statusDefault';

function t(key) {
  const dict = I18N[currentLang] || I18N.en;
  return dict[key] || I18N.en[key] || key;
}

if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
  const recorder = document.getElementById('recorder');
  const extFollowKey = document.getElementById('ext-follow-key');
  const statusEl = document.getElementById('status');
  const resetBtn = document.getElementById('reset');
  const showUiHintsInput = document.getElementById('show-ui-hints');
  const filterNonFollowersInput = document.getElementById('filter-non-followers');
  const compactPillInput = document.getElementById('compact-new-posts-pill');
  const compactPillDesignSelect = document.getElementById('compact-pill-design');
  const compactPillDesignRow = document.getElementById('compact-pill-design-row');
  const langSelect = document.getElementById('lang-select');
  let recording = false;

  function setStatus(statusKey) {
    lastStatusKey = statusKey;
    if (statusEl) statusEl.textContent = t(statusKey);
  }

  function applyLanguage(lang) {
    currentLang = I18N[lang] ? lang : detectBrowserLang(lang);
    document.documentElement.lang = currentLang;
    if (langSelect && langSelect.value !== currentLang) {
      langSelect.value = currentLang;
    }
    if (recorder) {
      recorder.setAttribute('aria-label', t('recorderAria'));
      if (recording) {
        recorder.textContent = t('recorderPrompt');
      }
    }
    const nodes = document.querySelectorAll('[data-i18n]');
    nodes.forEach((node) => {
      const key = node.getAttribute('data-i18n');
      if (node === statusEl) return;
      if (key) node.textContent = t(key);
    });
    setStatus(lastStatusKey);
  }

  function renderShortcutLabel(sc) {
    const formatted = formatShortcut(sc);
    if (recorder && !recording) recorder.textContent = formatted;
    if (extFollowKey) extFollowKey.textContent = formatted;
  }

  function notifyTabs(payload) {
    if (typeof chrome === 'undefined' || !chrome.tabs || typeof chrome.tabs.query !== 'function') {
      return;
    }
    try {
      chrome.tabs.query({}, (tabs) => {
        if (!Array.isArray(tabs)) return;
        for (const tab of tabs) {
          if (!tab || typeof tab.id !== 'number') continue;
          try {
            const p = chrome.tabs.sendMessage(tab.id, { type: 'xfs-config-update', ...payload });
            if (p && typeof p.catch === 'function') {
              p.catch(() => {});
            }
          } catch (_) {}
        }
      });
    } catch (_) {}
  }

  async function saveShortcut(sc) {
    try {
      notifyTabs({ shortcut: sc });
      await chrome.storage.sync.set({ shortcut: sc });
      renderShortcutLabel(sc);
      setStatus('statusSaved');
    } catch (err) {
      setStatus('statusSaveFailed');
      console.error(err);
    }
  }

  document.addEventListener('DOMContentLoaded', async () => {
    applyLanguage(currentLang);
    try {
      const {
        shortcut = DEFAULT_SHORTCUT,
        showUiHints = true,
        filterNonFollowers = false,
        compactNewPostsPill = true,
        compactPillDesign = '3',
        uiLang
      } = await chrome.storage.sync.get([
        'shortcut',
        'showUiHints',
        'filterNonFollowers',
        'compactNewPostsPill',
        'compactPillDesign',
        'uiLang'
      ]);
      if (uiLang && I18N[uiLang]) {
        applyLanguage(uiLang);
      } else {
        applyLanguage(detectBrowserLang());
      }
      renderShortcutLabel({ ...DEFAULT_SHORTCUT, ...shortcut });
      if (showUiHintsInput) {
        showUiHintsInput.checked = Boolean(showUiHints);
      }
      if (filterNonFollowersInput) {
        filterNonFollowersInput.checked = Boolean(filterNonFollowers);
      }
      if (compactPillInput) {
        compactPillInput.checked = Boolean(compactNewPostsPill);
      }
      if (compactPillDesignSelect) {
        compactPillDesignSelect.value = ['1', '2', '3'].includes(String(compactPillDesign))
          ? String(compactPillDesign)
          : '3';
        compactPillDesignSelect.disabled = !compactNewPostsPill;
      }
      if (compactPillDesignRow) {
        compactPillDesignRow.style.opacity = compactNewPostsPill ? '1' : '0.5';
      }
    } catch (err) {
      console.error(err);
    }
  });

  if (langSelect) {
    langSelect.addEventListener('change', async () => {
      const selected = langSelect.value;
      applyLanguage(selected);
      notifyTabs({ uiLang: currentLang });
      try {
        await chrome.storage.sync.set({ uiLang: currentLang });
      } catch (err) {
        console.error(err);
      }
    });
  }

  if (showUiHintsInput) {
    showUiHintsInput.addEventListener('change', async () => {
      try {
        const checked = Boolean(showUiHintsInput.checked);
        notifyTabs({ showUiHints: checked });
        await chrome.storage.sync.set({ showUiHints: checked });
        setStatus(checked ? 'statusHintsOn' : 'statusHintsOff');
      } catch (err) {
        setStatus('statusSaveFailed');
        console.error(err);
      }
    });
  }

  if (filterNonFollowersInput) {
    filterNonFollowersInput.addEventListener('change', async () => {
      try {
        const checked = Boolean(filterNonFollowersInput.checked);
        notifyTabs({ filterNonFollowers: checked });
        await chrome.storage.sync.set({ filterNonFollowers: checked });
        setStatus(checked ? 'statusFilterOn' : 'statusFilterOff');
      } catch (err) {
        setStatus('statusSaveFailed');
        console.error(err);
      }
    });
  }

  if (compactPillInput) {
    compactPillInput.addEventListener('change', async () => {
      try {
        const checked = Boolean(compactPillInput.checked);
        if (compactPillDesignSelect) compactPillDesignSelect.disabled = !checked;
        if (compactPillDesignRow) compactPillDesignRow.style.opacity = checked ? '1' : '0.5';
        notifyTabs({ compactNewPostsPill: checked });
        await chrome.storage.sync.set({ compactNewPostsPill: checked });
        setStatus(checked ? 'statusCompactPillOn' : 'statusCompactPillOff');
      } catch (err) {
        setStatus('statusSaveFailed');
        console.error(err);
      }
    });
  }

  if (compactPillDesignSelect) {
    compactPillDesignSelect.addEventListener('change', async () => {
      try {
        const val = ['1', '2', '3'].includes(compactPillDesignSelect.value)
          ? compactPillDesignSelect.value
          : '3';
        notifyTabs({ compactPillDesign: val });
        await chrome.storage.sync.set({ compactPillDesign: val });
        setStatus('statusSaved');
      } catch (err) {
        setStatus('statusSaveFailed');
        console.error(err);
      }
    });
  }

  recorder.addEventListener('click', () => {
    recording = true;
    recorder.classList.add('recording');
    recorder.textContent = t('recorderPrompt');
    setStatus('statusWaiting');
    recorder.focus();
  });

  recorder.addEventListener('blur', async () => {
    if (!recording) return;
    recording = false;
    recorder.classList.remove('recording');
    const { shortcut = DEFAULT_SHORTCUT } = await chrome.storage.sync.get('shortcut');
    renderShortcutLabel({ ...DEFAULT_SHORTCUT, ...shortcut });
    setStatus('statusClickToSet');
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
}

if (typeof module !== 'undefined') {
  module.exports = {
    I18N,
    detectBrowserLang,
    resolveKeyCode,
    formatShortcut
  };
}
