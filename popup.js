const {
  DEFAULT_SHORTCUT,
  MODIFIER_KEYS,
  MODIFIER_CODES,
  IME_SWITCH_CODES,
  NON_PRINTABLE_IME_KEYS,
  CODE_TO_KEY_LABEL,
  isApplePlatform,
  resolveKeyCode,
  formatShortcutLabel
} =
  typeof globalThis !== 'undefined' && globalThis.XFSKeymap
    ? globalThis.XFSKeymap
    : (typeof require === 'function' ? require('./shared-keymap.js') : {});

const I18N = {
  ko: {
    title: 'X 다국어 단축키 & 팔로우 (F)',
    recorderAria: '단축키 입력',
    statusDefault: '클릭 후 팔로우 단축키 변경 (한/일/중 입력 지원)',
    statusSaved: '저장됨',
    statusSaveFailed: '저장 실패',
    statusHintsOn: '단축키 UI 표시 켜짐',
    statusHintsOff: '단축키 UI 표시 꺼짐',
    statusFilterOn: '맞팔·팔로우 안 한 계정만 보기 켜짐',
    statusFilterOff: '맞팔·팔로우 안 한 계정만 보기 꺼짐',
    statusCompactPillOn: '"게시됨" 플로팅 버튼 최소화 켜짐',
    statusCompactPillOff: '"게시됨" 플로팅 버튼 최소화 꺼짐',
    statusWaiting: '입력 대기 중',
    statusClickToSet: '클릭 후 새 단축키 입력',
    recorderPrompt: '키 조합을 누르세요...',
    resetBtn: '초기화 (F)',
    toggleHints: '버튼·메뉴에 단축키 UI 표시',
    toggleNonFollowers: '팔로잉·팔로워에서 미맞팔 계정만 보기 (⇧F)',
    toggleCompactPill: '"게시됨" 플로팅 버튼 최소화 (컨텐츠 가림 방지)',
    compactPillDesignLabel: '플로팅 버튼 디자인',
    compactPillDesign1: '1. 우측 상단 글래스 캡슐',
    compactPillDesign2: '2. 상단 탭바 밀착 슬림 바',
    compactPillDesign3: '3. 우측 상단 초소형 아이콘 (↑ .)',
    extSectionTitle: '확장 프로그램 추가 단축키',
    extFollowDesc: '프로필 / 게시물(status) / 팔로워·팔로잉 목록에서 팔로우·언팔로우·서로 팔로우',
    extFilterDesc: '팔로잉(/following)은 맞팔 안 한 계정, 팔로워(/followers·/verified_followers)는 내가 팔로우 안 한 계정만 보기 토글',
    extModalDesc: '언팔로우·차단·뮤트 확인 모달에서 확인(Y) / 취소(N)',
    extTabDesc: '인증된 팔로워(V) / 팔로워(W) / 팔로잉(O) 이동',
    extHomeTabDesc: '홈(/home) 상단 탭 바로 전환',
    extQuoteDesc: '재게시 메뉴 열기 / 인용(Quote) 선택',
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
    statusFilterOn: 'Unreciprocated follow filter enabled',
    statusFilterOff: 'Unreciprocated follow filter disabled',
    statusCompactPillOn: 'Compact "Posted" pill enabled',
    statusCompactPillOff: 'Compact "Posted" pill disabled',
    statusWaiting: 'Listening for key...',
    statusClickToSet: 'Click to set a new shortcut',
    recorderPrompt: 'Press any key combination...',
    resetBtn: 'Reset (F)',
    toggleHints: 'Show shortcut hints on buttons & menus',
    toggleNonFollowers: 'Filter non-followers & unfollowed followers (⇧F)',
    toggleCompactPill: 'Minimize floating "Posted" pill (/home, /notifications*)',
    compactPillDesignLabel: 'Floating pill design',
    compactPillDesign1: '1. Top-right glass capsule',
    compactPillDesign2: '2. Top-docked slim bar',
    compactPillDesign3: '3. Top-right micro icon (↑ .)',
    extSectionTitle: 'Extension Added Shortcuts',
    extFollowDesc: 'Follow / Unfollow / Follow Back on Profile, Post Status, or J/K list item',
    extFilterDesc: 'Toggle non-followers on /following & unfollowed followers on /followers, /verified_followers',
    extModalDesc: 'Confirm (Y) or Cancel (N) in Unfollow, Block, and Mute dialogs',
    extTabDesc: 'Go to Verified Followers (V) / Followers (W) / Following (O)',
    extHomeTabDesc: 'Switch top tabs on /home',
    extQuoteDesc: 'Open Repost menu / Select Quote when open',
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
    statusFilterOn: '未互关账号筛选已开启',
    statusFilterOff: '未互关账号筛选已关闭',
    statusCompactPillOn: '浮动新帖按钮精简已开启',
    statusCompactPillOff: '浮动新帖按钮精简已关闭',
    statusWaiting: '等待按键输入...',
    statusClickToSet: '点击设置新快捷键',
    recorderPrompt: '请按下按键组合...',
    resetBtn: '重置 (F)',
    toggleHints: '在按钮和菜单上显示快捷键提示',
    toggleNonFollowers: '在正在关注/关注者列表中仅看未互关账号 (⇧F)',
    toggleCompactPill: '精简浮动“已发帖”按钮（防止遮挡内容）',
    compactPillDesignLabel: '浮动按钮样式',
    compactPillDesign1: '1. 右上角半透明胶囊',
    compactPillDesign2: '2. 顶部贴合超薄条',
    compactPillDesign3: '3. 右上角迷你图标 (↑ .)',
    extSectionTitle: '扩展新增快捷键',
    extFollowDesc: '在个人主页 / 帖子详情 / 关注列表中关注·取消关注·回关',
    extFilterDesc: '在 /following 仅看未回关你的人，在 /followers·/verified_followers 仅看你未回关的关注者',
    extModalDesc: '在取消关注·屏蔽·静音确认弹窗中确认(Y) / 取消(N)',
    extTabDesc: '跳转到认证关注者(V) / 关注者(W) / 正在关注(O)',
    extHomeTabDesc: '在 /home 直接切换顶部标签',
    extQuoteDesc: '打开转发菜单 / 选择引用(Quote)',
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
    statusFilterOn: '未相互フォローフィルター：オン',
    statusFilterOff: '未相互フォローフィルター：オフ',
    statusCompactPillOn: 'フローティング通知ボタン最小化：オン',
    statusCompactPillOff: 'フローティング通知ボタン最小化：オフ',
    statusWaiting: 'キー入力を待機中...',
    statusClickToSet: 'クリックして新しいキーを設定',
    recorderPrompt: 'キーの組み合わせを押してください...',
    resetBtn: 'リセット (F)',
    toggleHints: 'ボタン・メニューにショートカット UI を表示',
    toggleNonFollowers: 'フォロー中・フォロワーで未相互のみ表示 (⇧F)',
    toggleCompactPill: '「ポスト済」フローティングボタンを最小化',
    compactPillDesignLabel: 'ボタンデザイン',
    compactPillDesign1: '1. 右上半透明カプセル',
    compactPillDesign2: '2. タブ下密着スリムバー',
    compactPillDesign3: '3. 右上ミニアイコン (↑ .)',
    extSectionTitle: '拡張機能で追加されるショートカット',
    extFollowDesc: 'プロフィール / ポスト詳細 / フォロワー・フォロー中一覧でフォロー・解除',
    extFilterDesc: '/following では片思いのみ、/followers・/verified_followers では未フォローバックのみ表示切替',
    extModalDesc: 'フォロー解除・ブロック・ミュート確認モーダルで確認(Y) / キャンセル(N)',
    extTabDesc: '認証済みフォロワー(V) / フォロワー(W) / フォロー中(O) へ移動',
    extHomeTabDesc: '/home 上部タブの切り替え',
    extQuoteDesc: 'リポストメニューを開く / 引用(Quote)を選択',
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

function formatShortcut(sc) {
  return formatShortcutLabel(sc, ' + ');
}

function adaptPlatformText(text, apple = isApplePlatform()) {
  return apple ? text : String(text).replaceAll('⌘+Enter', 'Ctrl+Enter').replaceAll('⌘↵', 'Ctrl↵');
}

let currentLang = detectBrowserLang();
let lastStatusKey = 'statusDefault';

function t(key) {
  const dict = I18N[currentLang] || I18N.en;
  return adaptPlatformText(dict[key] || I18N.en[key] || key);
}

if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
  const recorder = document.getElementById('recorder');
  const extFollowKey = document.getElementById('ext-follow-key');
  const xSendKbd = document.getElementById('x-send-kbd');
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
    if (xSendKbd) {
      xSendKbd.textContent = isApplePlatform() ? 'N / ⌘+Enter' : 'N / Ctrl+Enter';
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

  async function saveShortcut(sc) {
    try {
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
        await chrome.storage.sync.set({ compactPillDesign: val });
        setStatus('statusSaved');
      } catch (err) {
        setStatus('statusSaveFailed');
        console.error(err);
      }
    });
  }

  let ignoreNextActivationKeyup = false;

  function startRecording() {
    recording = true;
    recorder.classList.add('recording');
    recorder.textContent = t('recorderPrompt');
    setStatus('statusWaiting');
    recorder.focus();
  }

  async function cancelRecording() {
    if (!recording) return;
    recording = false;
    ignoreNextActivationKeyup = false;
    recorder.classList.remove('recording');
    const { shortcut = DEFAULT_SHORTCUT } = await chrome.storage.sync.get('shortcut');
    renderShortcutLabel({ ...DEFAULT_SHORTCUT, ...shortcut });
    setStatus('statusClickToSet');
  }

  recorder.addEventListener('click', () => {
    ignoreNextActivationKeyup = false;
    startRecording();
  });

  recorder.addEventListener('blur', cancelRecording);

  async function handleRecordEvent(e) {
    if (!recording) return;
    e.preventDefault();
    e.stopPropagation();

    if (MODIFIER_KEYS.has(e.key) || MODIFIER_CODES.has(e.code) || IME_SWITCH_CODES.has(e.key) || IME_SWITCH_CODES.has(e.code)) {
      return;
    }

    if ((e.key === 'Escape' || e.code === 'Escape') && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
      await cancelRecording();
      return;
    }

    const resolvedCode = resolveKeyCode(e);
    if (!resolvedCode && NON_PRINTABLE_IME_KEYS.has(e.key)) {
      return;
    }

    recording = false;
    ignoreNextActivationKeyup = false;
    recorder.classList.remove('recording');

    const rawKey = e.key && !NON_PRINTABLE_IME_KEYS.has(e.key) ? e.key : '';
    let canonicalKey = rawKey.length === 1 ? rawKey.toLowerCase() : rawKey;
    if (resolvedCode?.startsWith('Key')) canonicalKey = resolvedCode.slice(3).toLowerCase();
    else if (resolvedCode?.startsWith('Digit')) canonicalKey = resolvedCode.slice(5);
    else if (resolvedCode === 'Space') canonicalKey = ' ';
    else if (resolvedCode === 'Slash') canonicalKey = e.shiftKey ? '?' : '/';
    else if (resolvedCode && CODE_TO_KEY_LABEL[resolvedCode]) {
      const lbl = CODE_TO_KEY_LABEL[resolvedCode];
      canonicalKey = lbl.length === 1 ? lbl.toLowerCase() : lbl;
    } else if (!canonicalKey && resolvedCode) {
      canonicalKey = resolvedCode;
    }

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

  recorder.addEventListener('keydown', (e) => {
    if (!recording) {
      if ((e.key === 'Enter' || e.key === ' ' || e.code === 'Space') && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
        e.preventDefault();
        e.stopPropagation();
        ignoreNextActivationKeyup = true;
        startRecording();
      }
      return;
    }
    ignoreNextActivationKeyup = false;
    handleRecordEvent(e);
  });

  recorder.addEventListener('keyup', (e) => {
    if (!recording) return;
    if (ignoreNextActivationKeyup && (e.key === 'Enter' || e.key === ' ' || e.code === 'Space')) {
      ignoreNextActivationKeyup = false;
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    handleRecordEvent(e);
  });

  resetBtn.addEventListener('click', async () => {
    recording = false;
    ignoreNextActivationKeyup = false;
    recorder.classList.remove('recording');
    await saveShortcut({ ...DEFAULT_SHORTCUT });
  });
}

if (typeof module !== 'undefined') {
  module.exports = {
    I18N,
    detectBrowserLang,
    resolveKeyCode,
    formatShortcut,
    adaptPlatformText,
    isApplePlatform
  };
}
