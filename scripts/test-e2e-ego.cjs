const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const sharedKeymapJsPath = path.join(rootDir, 'shared-keymap.js');
const contentJsPath = path.join(rootDir, 'content.js');
const popupHtmlPath = path.join(rootDir, 'popup.html');
const popupJsPath = path.join(rootDir, 'popup.js');
const cliProfileIdx = process.argv.indexOf('--profile');
const egoProfileName =
  (cliProfileIdx >= 0 && process.argv[cliProfileIdx + 1]) ||
  process.env.EGO_PROFILE ||
  'princejoo';

const egoScript = `
const fs = await import("node:fs");
const targetProfile = ${JSON.stringify(egoProfileName)};
const allProfiles = await profiles();
const pj = allProfiles.find(p => p.name === targetProfile);
if (!pj) {
  throw new Error("Required ego-browser profile '" + targetProfile + "' not found. Available: " + JSON.stringify(allProfiles));
}

const spaceName = "e2e-xfs-" + Date.now();
const task = await taskSpace(spaceName, { profileId: pj.id });
try {
  const page = task.page("p1");
  await page.cdp("egoAutomated.disable");
  await page.cdp("Runtime.enable");

  const extensionContextIds = new Set();
  const neutralizeInstalledExtension = async () => {
    const evs = await page.events();
    for (const ev of evs) {
      if (ev.method !== "Runtime.executionContextCreated") continue;
      const ctx = ev.params?.context;
      if (!ctx) continue;
      if (
        ctx.origin === "chrome-extension://helbbdgikebbpbjjejmkkappejlhaglf" ||
        ctx.name === "X Multilingual Keyboard Shortcuts & Follow"
      ) {
        extensionContextIds.add(ctx.id);
        try {
          await page.cdp("Runtime.evaluate", {
            contextId: ctx.id,
            expression: [
              "for (let i = 1; i < 5000; i++) { try { cancelAnimationFrame(i); clearTimeout(i); clearInterval(i); } catch (_) {} }",
              "window.requestAnimationFrame = () => 0;",
              "window.setTimeout = () => 0;",
              "window.setInterval = () => 0;",
              "if (typeof chrome !== \\"undefined\\" && chrome.storage?.sync) { chrome.storage.sync.get = () => new Promise(() => {}); chrome.storage.sync.set = () => {}; }",
              "if (typeof chrome !== \\"undefined\\" && chrome.storage?.onChanged) { chrome.storage.onChanged.addListener = () => {}; }",
              "if (typeof MutationObserver !== \\"undefined\\") {",
              "  MutationObserver.prototype.observe = () => {};",
              "  MutationObserver.prototype.disconnect = () => {};",
              "}",
              "Object.defineProperty(KeyboardEvent.prototype, \\"code\\", { get: () => \\"\\" });",
              "Object.defineProperty(KeyboardEvent.prototype, \\"key\\", { get: () => \\"\\" });",
              "Object.defineProperty(KeyboardEvent.prototype, \\"keyCode\\", { get: () => 0 });",
              "Object.defineProperty(KeyboardEvent.prototype, \\"which\\", { get: () => 0 });",
              "document.getElementById(\\"xfs-following-filter-bar\\")?.remove();",
              "document.getElementById(\\"xfs-filter-styles\\")?.remove();",
              "document.getElementById(\\"xfs-styles\\")?.remove();"
            ].join("\\n")
          });
        } catch (_) {}
      }
    }
  };

  await page.goto("https://x.com/Hanssony_/following");
  await page.waitForSelector('[data-testid="UserCell"]', { timeout: 30000 });
  await page.waitForTimeout(1500);
  await neutralizeInstalledExtension();

  const sharedKeymapSrc = fs.readFileSync(${JSON.stringify(sharedKeymapJsPath)}, "utf8");
  const contentJsSrc = fs.readFileSync(${JSON.stringify(contentJsPath)}, "utf8");
  const popupHtmlSrc = fs.readFileSync(${JSON.stringify(popupHtmlPath)}, "utf8");
  const popupJsSrc = fs.readFileSync(${JSON.stringify(popupJsPath)}, "utf8");

  // Stage 1A: Core filter bar, J/K navigation, Shift+F toggle, and modal check on /following
  const coreCheck = await page.evaluate(async ({ sharedCode, contentCode }) => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const pressKey = (key, codeStr, opts = {}) => {
      const init = { key, code: codeStr, bubbles: true, cancelable: true, ...opts };
      window.dispatchEvent(new KeyboardEvent("keydown", init));
      window.dispatchEvent(new KeyboardEvent("keyup", init));
    };

    // Reset state & inject fresh shared-keymap.js and content.js
    localStorage.setItem("x_follow_shortcut_filter_non_followers", "false");
    localStorage.setItem("x_follow_shortcut_show_hints", "true");
    window.scrollTo(0, 0);

    new Function(sharedCode)();
    const xfsModule = { exports: {} };
    new Function("module", "exports", contentCode)(xfsModule, xfsModule.exports);
    window.__XFS_CONTENT_API = xfsModule.exports;

    // Trigger mouseover to ensure syncUiHints runs even when the tab is in the background (rAF may be throttled)
    window.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    await sleep(300);
    if (!document.getElementById("xfs-following-filter-bar")) {
      pressKey("Shift", "ShiftLeft");
      await sleep(100);
    }

    const primary = document.querySelector('[data-testid="primaryColumn"]');
    const bar = document.getElementById("xfs-following-filter-bar");
    const btn = document.getElementById("xfs-non-follower-toggle");
    const section = primary?.querySelector("section[role=\\"region\\"], section");
    const firstRow = primary?.querySelector('[data-testid="cellInnerDiv"]');

    const barRect0 = bar?.getBoundingClientRect();
    const firstRowRect0 = firstRow?.getBoundingClientRect();
    const sectionMarginTop = section ? getComputedStyle(section).marginTop : null;

    // 1. Check initial load state (before J/K): filter bar visible, no extra top gap, first row sits flush below bar
    const initialCheck = {
      barExists: Boolean(bar),
      btnExists: Boolean(btn),
      ariaPressed: btn?.getAttribute("aria-pressed"),
      hintAttr: btn?.getAttribute("data-xfs-hint"),
      sectionMarginTop,
      barBottom: barRect0 ? barRect0.bottom : null,
      firstRowTop: firstRowRect0 ? firstRowRect0.top : null,
      gapPx: barRect0 && firstRowRect0 ? Math.abs(firstRowRect0.top - barRect0.bottom) : null
    };

    // 2. Filter OFF: press J (Korean ㅓ) 3 times and K (Korean ㅏ) 1 time, verify focused row is never covered by sticky bar
    const offSteps = [];
    for (const [k, c] of [["ㅓ", "KeyJ"], ["j", "KeyJ"], ["ㅓ", "KeyJ"], ["ㅏ", "KeyK"]]) {
      pressKey(k, c);
      let bRect, fRow, fCell, fBtn, rRect, alignDiffPx;
      const pollStart = Date.now();
      while (Date.now() - pollStart < 600) {
        bRect = document.getElementById("xfs-following-filter-bar")?.getBoundingClientRect();
        fRow = primary?.querySelector('[data-testid="cellInnerDiv"][data-xfs-focused="true"]');
        fCell = fRow?.querySelector('[data-testid="UserCell"]');
        fBtn = fCell?.querySelector('[data-xfs-target="true"]');
        rRect = fRow?.getBoundingClientRect();
        if (bRect && rRect) {
          alignDiffPx = Math.abs(rRect.top - bRect.bottom);
          if (alignDiffPx <= 2 && Boolean(fBtn)) break;
        }
        await sleep(30);
      }
      offSteps.push({
        key: k,
        barBottom: bRect?.bottom,
        rowTop: rRect?.top,
        alignDiffPx: bRect && rRect ? Math.abs(rRect.top - bRect.bottom) : null,
        hasTargetHint: Boolean(fBtn)
      });
    }

    // 3. Toggle Filter ON via Korean Shift+ㄹ (Shift+F)
    pressKey("ㄹ", "KeyF", { shiftKey: true });
    await sleep(500);
    window.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    const barOn = document.getElementById("xfs-following-filter-bar");
    const btnOn = document.getElementById("xfs-non-follower-toggle");
    const afterToggleOn = {
      ariaPressed: btnOn?.getAttribute("aria-pressed"),
      barActive: barOn?.getAttribute("data-xfs-active"),
      docAttr: document.documentElement.getAttribute("data-xfs-filter-non-followers"),
      hiddenMutualCount: primary?.querySelectorAll('[data-testid="UserCell"][data-xfs-mutual="true"][data-xfs-hidden="true"]').length || 0,
      visibleMutualHeights: Array.from(primary?.querySelectorAll('[data-testid="cellInnerDiv"][data-xfs-hidden="true"]') || []).map(el => el.getBoundingClientRect().height)
    };

    // 4. Filter ON: press J 3 times and K 1 time, verify mutuals are skipped and focused row aligns flush below sticky bar
    const onSteps = [];
    for (const [k, c] of [["j", "KeyJ"], ["ㅓ", "KeyJ"], ["j", "KeyJ"], ["k", "KeyK"]]) {
      pressKey(k, c);
      let bRect, fRow, fCell, rRect, alignDiffPx;
      const pollStart = Date.now();
      while (Date.now() - pollStart < 600) {
        bRect = document.getElementById("xfs-following-filter-bar")?.getBoundingClientRect();
        fRow = primary?.querySelector('[data-testid="cellInnerDiv"][data-xfs-focused="true"]');
        fCell = fRow?.querySelector('[data-testid="UserCell"]');
        rRect = fRow?.getBoundingClientRect();
        if (bRect && rRect) {
          alignDiffPx = Math.abs(rRect.top - bRect.bottom);
          if (alignDiffPx <= 2 && fCell?.getAttribute("data-xfs-mutual") !== "true") break;
        }
        await sleep(30);
      }
      onSteps.push({
        key: k,
        isMutual: fCell?.getAttribute("data-xfs-mutual") === "true",
        barBottom: bRect?.bottom,
        rowTop: rRect?.top,
        alignDiffPx: bRect && rRect ? Math.abs(rRect.top - bRect.bottom) : null
      });
    }

    // 4b. Concurrent UI responsiveness WHILE Shift+F is ON
    const measureEventLoopLagSamples = async (samples = 8, gapMs = 30) => {
      const lags = [];
      for (let i = 0; i < samples; i++) {
        const t0 = performance.now();
        await new Promise((r) => setTimeout(r, 0));
        lags.push(Number((performance.now() - t0).toFixed(2)));
        await sleep(gapMs);
      }
      const sorted = [...lags].sort((a, b) => a - b);
      const maxLagMs = sorted[sorted.length - 1] || 0;
      const p95LagMs = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))] || 0;
      return { lags, maxLagMs, p95LagMs };
    };

    const longTasksFollowingOn = [];
    let ltObsFollowing = null;
    if (
      typeof PerformanceObserver === "function" &&
      PerformanceObserver.supportedEntryTypes?.includes("longtask")
    ) {
      ltObsFollowing = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          longTasksFollowingOn.push(Number(entry.duration.toFixed(1)));
        }
      });
      ltObsFollowing.observe({ type: "longtask", buffered: false });
    }

    const followingLoopLag = await measureEventLoopLagSamples(8, 25);

    // Ensure a non-mutual cell is focused while Shift+F is ON, then test F + N modal while filter stays ON
    pressKey("j", "KeyJ");
    await sleep(260);
    pressKey("ㄹ", "KeyF");
    await sleep(300);
    const modalOpenedWhileFilterOn = Boolean(document.querySelector('[data-testid="confirmationSheetConfirm"]'));
    pressKey("ㅜ", "KeyN");
    await sleep(650);
    const modalClosedWhileFilterOn = !document.querySelector('[data-testid="confirmationSheetConfirm"]');
    const filterStillOnAfterModal =
      document.getElementById("xfs-non-follower-toggle")?.getAttribute("aria-pressed") === "true";

    // Manual wheel scroll right after J step must cancel [35, 90, 160, 240]ms align timers instead of yanking scroll back
    pressKey("j", "KeyJ");
    await sleep(10);
    window.dispatchEvent(new WheelEvent("wheel", { deltaY: 140, bubbles: true }));
    const manualTargetScrollY = window.scrollY + 90;
    window.scrollTo(0, manualTargetScrollY);
    const scrollAfterManualWheel = window.scrollY;
    await sleep(265);
    const scrollAfterAlignWindow = window.scrollY;
    const manualWheelNotHijacked =
      scrollAfterManualWheel === 0 || Math.abs(scrollAfterAlignWindow - scrollAfterManualWheel) <= 5;

    // Steady-state zero data-xfs-* attribute churn check over 300ms on settled elements while Shift+F is ON
    await sleep(350);
    const settledEls = new WeakSet(
      document.querySelectorAll(
        '[data-xfs-hidden], [data-xfs-mutual], [data-xfs-focused], #xfs-following-filter-bar, #xfs-non-follower-toggle, html, [data-testid="primaryColumn"]'
      )
    );
    let xfsSteadyAttrMutations = 0;
    const xfsMutObs = new MutationObserver((records) => {
      for (const rec of records) {
        if (
          rec.type === "attributes" &&
          rec.attributeName?.startsWith("data-xfs-") &&
          settledEls.has(rec.target)
        ) {
          xfsSteadyAttrMutations++;
        }
      }
    });
    xfsMutObs.observe(document.documentElement, {
      attributes: true,
      attributeOldValue: true,
      subtree: true
    });
    await sleep(300);
    xfsMutObs.disconnect();

    // Direct UI button click toggle OFF -> ON while on /following
    const toggleBtnLive = document.getElementById("xfs-non-follower-toggle");
    toggleBtnLive?.click();
    await sleep(150);
    const clickedToggleOff = toggleBtnLive?.getAttribute("aria-pressed") === "false";
    toggleBtnLive?.click();
    await sleep(250);
    const clickedToggleBackOn = toggleBtnLive?.getAttribute("aria-pressed") === "true";

    // Question-mark (?) shortcut help modal open & close while Shift+F is ON
    pressKey("？", "Slash", { shiftKey: true });
    await sleep(450);
    const helpDialog = document.querySelector('[role="dialog"]');
    const helpModalOpenedWhileFilterOn = Boolean(helpDialog);
    const closeDialogBtn =
      helpDialog?.querySelector('[data-testid="app-bar-close"]') ||
      document.querySelector('[aria-modal="true"] [data-testid="app-bar-close"]');
    if (closeDialogBtn) {
      closeDialogBtn.click();
    } else if (/keyboard_shortcuts/i.test(location.pathname) || document.querySelector('[role="dialog"]')) {
      history.back();
    }
    for (let i = 0; i < 20; i++) {
      await sleep(100);
      if (!/keyboard_shortcuts/i.test(location.pathname) && !document.querySelector('[role="dialog"]')) break;
    }
    window.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    await sleep(200);
    const helpModalClosedWhileFilterOn =
      !/keyboard_shortcuts/i.test(location.pathname) && !document.querySelector('[role="dialog"]');

    // Re-focus a visible non-mutual cell so step 5/6 has an active target cell
    pressKey("j", "KeyJ");
    await sleep(260);
    ltObsFollowing?.disconnect();

    const concurrentWhileFilterOn = {
      followingLoopLag,
      longTasksFollowingOn,
      modalOpenedWhileFilterOn,
      modalClosedWhileFilterOn,
      filterStillOnAfterModal,
      manualWheelNotHijacked,
      scrollAfterManualWheel,
      scrollAfterAlignWindow,
      xfsSteadyAttrMutations,
      clickedToggleOff,
      clickedToggleBackOn,
      helpModalOpenedWhileFilterOn,
      helpModalClosedWhileFilterOn
    };

    // 5. Reset back to OFF via Shift+F
    pressKey("F", "KeyF", { shiftKey: true });
    await sleep(200);
    const barOff = document.getElementById("xfs-following-filter-bar");
    const btnOff = document.getElementById("xfs-non-follower-toggle");
    const afterToggleOff = {
      ariaPressed: btnOff?.getAttribute("aria-pressed"),
      barActive: barOff?.getAttribute("data-xfs-active")
    };

    // 6. Test F (Korean ㄹ) unfollow confirmation modal & N (Korean ㅜ) cancel on focused cell
    pressKey("ㄹ", "KeyF");
    await sleep(300);
    const confirmBtnOpen = Boolean(document.querySelector('[data-testid="confirmationSheetConfirm"]'));
    const cancelBtnOpen = Boolean(document.querySelector('[data-testid="confirmationSheetCancel"]'));
    pressKey("ㅜ", "KeyN");
    await sleep(650);
    const modalClosedAfterN = !document.querySelector('[data-testid="confirmationSheetConfirm"]');

    return {
      initialCheck,
      offSteps,
      afterToggleOn,
      onSteps,
      concurrentWhileFilterOn,
      afterToggleOff,
      modalCheck: { confirmBtnOpen, cancelBtnOpen, modalClosedAfterN }
    };
  }, { sharedCode: sharedKeymapSrc, contentCode: contentJsSrc });

  // Stage 1B: 16 modification proposals checks on /following
  const proposalsCheck = await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const pressKey = (key, codeStr, opts = {}) => {
      const init = { key, code: codeStr, bubbles: true, cancelable: true, ...opts };
      window.dispatchEvent(new KeyboardEvent("keydown", init));
      window.dispatchEvent(new KeyboardEvent("keyup", init));
    };

    const contentApi = window.__XFS_CONTENT_API;

    const primary = document.querySelector('[data-testid="primaryColumn"]');

    // --- Proposal Check 1: shared-keymap.js Runtime & Loading Check ---
    const km = window.XFSKeymap;
    const keymapCheck = {
      defined: Boolean(km),
      hasDefaultShortcut: km?.DEFAULT_SHORTCUT?.code === "KeyF",
      isApplePlatform: typeof km?.isApplePlatform === "function" ? km.isApplePlatform() : null,
      layoutCount: km?.LAYOUT_CHAR_TO_CODE ? Object.keys(km.LAYOUT_CHAR_TO_CODE).length : 0,
      hebrewSample: km?.resolveKeyCode?.({ key: "כ", code: "" }),
      greekSample: km?.resolveKeyCode?.({ key: "φ", code: "" }),
      thaiSample: km?.resolveKeyCode?.({ key: "ด", code: "" }),
      formatSample: km?.formatShortcutLabel?.({ key: "f", code: "KeyF" })
    };

    // --- Proposal Check 2 (B.1): Dynamic Send Badge CSS Variable & Style Rule ---
    const docStyle = document.documentElement.style;
    const sendBadgeVal = docStyle.getPropertyValue("--xfs-send-badge");
    const styleEl = document.getElementById("xfs-styles");
    const hasSendBadgeRule = Boolean(styleEl?.textContent?.includes("--xfs-send-badge"));
    const b1Check = {
      sendBadgeVal,
      hasSendBadgeRule,
      isApple: km ? km.isApplePlatform() : false
    };

    // --- Proposal Check 3 (B.3): Multilingual Hebrew, Greek, Thai Shortcuts ---
    // Hebrew J/K navigation (ח = KeyJ, ל = KeyK)
    pressKey("ח", "KeyJ");
    await sleep(120);
    const hebRow1 = primary?.querySelector('[data-testid="cellInnerDiv"][data-xfs-focused="true"]');
    pressKey("ל", "KeyK");
    await sleep(120);
    const hebRow2 = primary?.querySelector('[data-testid="cellInnerDiv"][data-xfs-focused="true"]');

    // Greek J/K navigation (ξ = KeyJ, κ = KeyK)
    pressKey("ξ", "KeyJ");
    await sleep(120);
    const grkRow1 = primary?.querySelector('[data-testid="cellInnerDiv"][data-xfs-focused="true"]');
    pressKey("κ", "KeyK");
    await sleep(120);
    const grkRow2 = primary?.querySelector('[data-testid="cellInnerDiv"][data-xfs-focused="true"]');

    // Thai J/K navigation (่ = KeyJ, า = KeyK)
    pressKey("่", "KeyJ");
    await sleep(120);
    const thaiRow1 = primary?.querySelector('[data-testid="cellInnerDiv"][data-xfs-focused="true"]');
    pressKey("า", "KeyK");
    await sleep(120);
    const thaiRow2 = primary?.querySelector('[data-testid="cellInnerDiv"][data-xfs-focused="true"]');

    // Greek F ('φ') unfollow modal + Greek N ('ν') cancel
    pressKey("φ", "KeyF");
    await sleep(250);
    const greekModalOpened = Boolean(document.querySelector('[data-testid="confirmationSheetConfirm"]'));
    pressKey("ν", "KeyN");
    await sleep(650);
    const greekModalClosed = !document.querySelector('[data-testid="confirmationSheetConfirm"]');
    const b3Check = {
      hebrewNav: Boolean(hebRow1 && hebRow2),
      greekNav: Boolean(grkRow1 && grkRow2),
      thaiNav: Boolean(thaiRow1 && thaiRow2),
      greekModalOpened,
      greekModalClosed
    };

    // --- Proposal Check 4 (A.1): 180ms Focus Guard & Orphan Keyup Filter vs Korean IME Recovery ---
    pressKey("j", "KeyJ");
    await sleep(150);

    // a) Immediate orphan keyup within 180ms of focus -> dropped by focus guard
    window.dispatchEvent(new Event("focus"));
    window.dispatchEvent(new KeyboardEvent("keyup", { key: "ㄹ", code: "KeyF", bubbles: true }));
    await sleep(80);
    const guardSuppressed = !document.querySelector('[data-testid="confirmationSheetConfirm"]');

    // b) Wait past 220ms (>180ms guard window)
    await sleep(220);

    // c) Pure ASCII orphan keyup 'f' (KeyF) -> suppressed by isPureAsciiOrphanKeyup
    window.dispatchEvent(new KeyboardEvent("keyup", { key: "f", code: "KeyF", bubbles: true }));
    await sleep(80);
    const asciiOrphanSuppressed = !document.querySelector('[data-testid="confirmationSheetConfirm"]');

    // d) Simulated Cmd+2 orphan Digit2 keyup -> suppressed
    window.dispatchEvent(new KeyboardEvent("keyup", { key: "2", code: "Digit2", bubbles: true }));
    await sleep(80);
    const digitOrphanSuppressed = !document.querySelector('[data-testid="confirmationSheetConfirm"]');

    // e) Korean IME orphan keyup 'ㄹ' (KeyF) after 180ms -> recovered and triggers confirmation sheet!
    window.dispatchEvent(new KeyboardEvent("keyup", { key: "ㄹ", code: "KeyF", bubbles: true }));
    await sleep(300);
    const imeOrphanRecovered = Boolean(document.querySelector('[data-testid="confirmationSheetConfirm"]'));
    if (imeOrphanRecovered) {
      pressKey("ㅜ", "KeyN"); // dismiss modal
      await sleep(650);
    }
    const a1Check = {
      guardSuppressed,
      asciiOrphanSuppressed,
      digitOrphanSuppressed,
      imeOrphanRecovered
    };

    // --- Proposal Check 5 (A.2): Status Page Safe Matching & Sidebar Isolation ---
    const loggedInUser = contentApi.getLoggedInUsername(document);
    const selfPostExact = contentApi.findStatusFollowButton(document, primary, loggedInUser);
    const selfPostLower = contentApi.findStatusFollowButton(document, primary, loggedInUser?.toLowerCase());
    let sidebarIsolated = true;
    const sidebar = document.querySelector('[data-testid="sidebarColumn"]');
    if (sidebar) {
      const dummyRecBtn = document.createElement("button");
      dummyRecBtn.setAttribute("data-testid", "dummy-rec-follow");
      dummyRecBtn.setAttribute("aria-label", "@ExternalAuthor 님 팔로우");
      sidebar.appendChild(dummyRecBtn);
      const picked = contentApi.findStatusFollowButton(document, primary, "ExternalAuthor");
      sidebarIsolated = picked !== dummyRecBtn;
      dummyRecBtn.remove();
    }
    const a2Check = {
      loggedInUser,
      selfPostExact,
      selfPostLower,
      sidebarIsolated
    };

    // --- Proposal Check 6 (A.3): Pending Follow Request Button Selector ---
    const dummyCancelBtn = document.createElement("button");
    dummyCancelBtn.setAttribute("data-testid", "12345678-cancel");
    dummyCancelBtn.setAttribute("aria-label", "팔로우 요청 취소");
    const cancelSelectorMatches = dummyCancelBtn.matches(
      '[data-testid$="-follow"], [data-testid$="-unfollow"], [data-testid$="-cancel"], button[aria-label*="팔로우"], [role="button"][aria-label*="팔로우"]'
    );
    const cancelCell = document.createElement("div");
    cancelCell.setAttribute("data-testid", "UserCell");
    cancelCell.appendChild(dummyCancelBtn);
    const cancelQueryMatches = Boolean(cancelCell.querySelector('[data-testid$="-cancel"]'));
    const a3Check = {
      cancelSelectorMatches,
      cancelQueryMatches
    };

    // --- Proposal Check 7 (C.1): Scoped Mouseover Listener ---
    const untrustedSync = contentApi.handleMouseOver({ isTrusted: false });
    const nullSync = contentApi.handleMouseOver(null);
    const trustedNonStatusSync = contentApi.handleMouseOver({ isTrusted: true });
    const c1Check = {
      untrustedSync,
      nullSync,
      trustedNonStatusSync
    };

    // --- Proposal Check 8 (C.2): Storage-Only Configuration Update ---
    contentApi.applyConfigUpdate({ shortcut: { key: "k", code: "KeyK", ctrl: false, alt: false, shift: false, meta: false } });
    const customKeyVar = document.documentElement.style.getPropertyValue("--xfs-follow-key");
    contentApi.applyConfigUpdate({ showUiHints: false });
    const hintsDisabled = document.getElementById("xfs-styles") === null;
    contentApi.applyConfigUpdate({
      shortcut: { key: "f", code: "KeyF", ctrl: false, alt: false, shift: false, meta: false },
      showUiHints: true
    });
    const defaultKeyVar = document.documentElement.style.getPropertyValue("--xfs-follow-key");
    const hintsRestored = document.getElementById("xfs-styles") !== null;
    const c2Check = {
      customKeyVar,
      hintsDisabled,
      defaultKeyVar,
      hintsRestored
    };

    return {
      keymapCheck,
      b1Check,
      b3Check,
      a1Check,
      a2Check,
      a3Check,
      c1Check,
      c2Check
    };
  });

  // Stage 1C: Follow list tab navigation (/followers, /verified_followers, profile cleanup, /following)
  const navCheck = await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const pressKey = (key, codeStr, opts = {}) => {
      const init = { key, code: codeStr, bubbles: true, cancelable: true, ...opts };
      window.dispatchEvent(new KeyboardEvent("keydown", init));
      window.dispatchEvent(new KeyboardEvent("keyup", init));
    };

    pressKey("ㅎ", "KeyG");
    await sleep(80);
    pressKey("ㅈ", "KeyW");
    for (let i = 0; i < 30; i++) {
      await sleep(100);
      if (document.querySelector('[data-testid="UserCell"]') && location.pathname.endsWith("/followers")) break;
    }
    window.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    await sleep(250);
    const followersPath = location.pathname;
    const barMountedOnFollowers = Boolean(document.getElementById("xfs-following-filter-bar"));
    const followersMode = document.documentElement.getAttribute("data-xfs-filter-mode");
    const followersBtnText = document.getElementById("xfs-non-follower-toggle")?.textContent || "";

    const measureEventLoopLagSamples = async (samples = 8, gapMs = 30) => {
      const lags = [];
      for (let i = 0; i < samples; i++) {
        const t0 = performance.now();
        await new Promise((r) => setTimeout(r, 0));
        lags.push(Number((performance.now() - t0).toFixed(2)));
        await sleep(gapMs);
      }
      const sorted = [...lags].sort((a, b) => a - b);
      const maxLagMs = sorted[sorted.length - 1] || 0;
      const p95LagMs = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))] || 0;
      return { lags, maxLagMs, p95LagMs };
    };

    // Toggle ON on /followers and verify -unfollow rows hide while -follow rows stay visible
    // and main thread remains responsive while VirtualScroller cascades follower batches
    const longTasksFollowersOn = [];
    let ltObsFollowers = null;
    if (
      typeof PerformanceObserver === "function" &&
      PerformanceObserver.supportedEntryTypes?.includes("longtask")
    ) {
      ltObsFollowers = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          longTasksFollowersOn.push(Number(entry.duration.toFixed(1)));
        }
      });
      ltObsFollowers.observe({ type: "longtask", buffered: false });
    }
    pressKey("ㄹ", "KeyF", { shiftKey: true });
    const followersLoopLag = await measureEventLoopLagSamples(10, 30);
    ltObsFollowers?.disconnect();
    const primaryFollowers = document.querySelector('[data-testid="primaryColumn"]');
    const followersCellCount = primaryFollowers?.querySelectorAll('[data-testid="UserCell"]').length || 0;
    const followersHiddenHeights = Array.from(
      primaryFollowers?.querySelectorAll('[data-testid="cellInnerDiv"]:has([data-testid$="-unfollow"], [data-testid$="-cancel"])') || []
    ).map((el) => el.getBoundingClientRect().height);
    const followersUnfollowedHeights = Array.from(
      primaryFollowers?.querySelectorAll('[data-testid="cellInnerDiv"]:has([data-testid$="-follow"])') || []
    ).map((el) => el.getBoundingClientRect().height);

    // Switch to /verified_followers while filter is ON
    pressKey("ㅎ", "KeyG");
    await sleep(80);
    pressKey("ㅍ", "KeyV");
    for (let i = 0; i < 30; i++) {
      await sleep(100);
      if (document.querySelector('[data-testid="UserCell"]') && location.pathname.endsWith("/verified_followers")) break;
    }
    window.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    await sleep(250);
    const verifiedFollowersPath = location.pathname;
    const barMountedOnVerifiedFollowers = Boolean(document.getElementById("xfs-following-filter-bar"));
    const verifiedFollowersMode = document.documentElement.getAttribute("data-xfs-filter-mode");
    const verifiedFollowersBtnText = document.getElementById("xfs-non-follower-toggle")?.textContent || "";
    const primaryVerified = document.querySelector('[data-testid="primaryColumn"]');
    const verifiedHiddenHeights = Array.from(
      primaryVerified?.querySelectorAll('[data-testid="cellInnerDiv"]:has([data-testid$="-unfollow"], [data-testid$="-cancel"])') || []
    ).map((el) => el.getBoundingClientRect().height);
    const verifiedUnfollowedHeights = Array.from(
      primaryVerified?.querySelectorAll('[data-testid="cellInnerDiv"]:has([data-testid$="-follow"])') || []
    ).map((el) => el.getBoundingClientRect().height);

    // Toggle filter back OFF before leaving
    pressKey("F", "KeyF", { shiftKey: true });
    await sleep(200);

    // Navigate to profile root (/Hanssony_) and verify bar is removed on non-filter route
    const profileLink = document.querySelector('header nav a[data-testid="AppTabBar_Profile_Link"]');
    if (profileLink) {
      profileLink.click();
    } else {
      history.pushState({}, "", "/Hanssony_");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
    for (let i = 0; i < 30; i++) {
      await sleep(100);
      if (location.pathname === "/Hanssony_") break;
    }
    window.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    await sleep(250);
    const nonFilterPath = location.pathname;
    const barRemovedOnNonFilter = !document.getElementById("xfs-following-filter-bar");
    const modeRemovedOnNonFilter = document.documentElement.getAttribute("data-xfs-filter-mode") === null;

    pressKey("ㅎ", "KeyG");
    await sleep(80);
    pressKey("ㅐ", "KeyO");
    for (let i = 0; i < 30; i++) {
      await sleep(100);
      if (document.querySelector('[data-testid="UserCell"]') && location.pathname.endsWith("/following")) break;
    }
    window.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    await sleep(250);
    const followingPathAgain = location.pathname;
    const barRestoredOnFollowing = Boolean(document.getElementById("xfs-following-filter-bar"));
    const followingModeAgain = document.documentElement.getAttribute("data-xfs-filter-mode");

    return {
      followersPath,
      barMountedOnFollowers,
      followersMode,
      followersBtnText,
      followersCellCount,
      followersLoopLag,
      longTasksFollowersOn,
      followersHiddenHeights,
      followersUnfollowedHeights,
      verifiedFollowersPath,
      barMountedOnVerifiedFollowers,
      verifiedFollowersMode,
      verifiedFollowersBtnText,
      verifiedHiddenHeights,
      verifiedUnfollowedHeights,
      nonFilterPath,
      barRemovedOnNonFilter,
      modeRemovedOnNonFilter,
      followingPathAgain,
      barRestoredOnFollowing,
      followingModeAgain
    };
  });

  const result = {
    ...coreCheck,
    ...proposalsCheck,
    navCheck
  };

  // Stage 2: Non-vacuous check on /DonMacKR/followers that unfollowed (-follow) followers remain visible when filter is ON
  await page.goto("https://x.com/DonMacKR/followers");
  await page.waitForSelector('[data-testid="UserCell"]', { timeout: 30000 });
  await page.waitForTimeout(1200);
  await neutralizeInstalledExtension();
  const unfollowedCheck = await page.evaluate(async ({ sharedCode, contentCode }) => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const pressKey = (key, codeStr, opts = {}) => {
      const init = { key, code: codeStr, bubbles: true, cancelable: true, ...opts };
      window.dispatchEvent(new KeyboardEvent("keydown", init));
      window.dispatchEvent(new KeyboardEvent("keyup", init));
    };
    localStorage.setItem("x_follow_shortcut_filter_non_followers", "false");
    new Function(sharedCode)();
    const xfsModule = { exports: {} };
    new Function("module", "exports", contentCode)(xfsModule, xfsModule.exports);
    window.__XFS_CONTENT_API = xfsModule.exports;
    window.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    await sleep(250);
    pressKey("ㄹ", "KeyF", { shiftKey: true });
    await sleep(300);
    const primary = document.querySelector('[data-testid="primaryColumn"]');
    const unfollowedHeights = Array.from(
      primary?.querySelectorAll('[data-testid="cellInnerDiv"]:has([data-testid$="-follow"])') || []
    ).map((el) => el.getBoundingClientRect().height);
    const hiddenHeights = Array.from(
      primary?.querySelectorAll('[data-testid="cellInnerDiv"]:has([data-testid$="-unfollow"], [data-testid$="-cancel"])') || []
    ).map((el) => el.getBoundingClientRect().height);
    const mode = document.documentElement.getAttribute("data-xfs-filter-mode");
    const ariaPressed = document.getElementById("xfs-non-follower-toggle")?.getAttribute("aria-pressed");
    pressKey("F", "KeyF", { shiftKey: true });
    await sleep(150);
    return { mode, ariaPressed, unfollowedHeights, hiddenHeights };
  }, { sharedCode: sharedKeymapSrc, contentCode: contentJsSrc });
  result.unfollowedCheck = unfollowedCheck;

  // Stage 3: Live test on https://x.com/home: 1-9 top tab switching and compact floating pill
  await page.goto("https://x.com/home");
  await page.waitForSelector('[data-testid="primaryColumn"] [role="tablist"]', { timeout: 30000 });
  await page.waitForTimeout(1500);
  await neutralizeInstalledExtension();

  const homeCheck = await page.evaluate(async ({ sharedCode, contentCode }) => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const pressKey = (key, codeStr, opts = {}) => {
      const init = { key, code: codeStr, bubbles: true, cancelable: true, ...opts };
      window.dispatchEvent(new KeyboardEvent("keydown", init));
      window.dispatchEvent(new KeyboardEvent("keyup", init));
    };

    // Reset state & inject fresh shared-keymap.js and content.js
    localStorage.setItem("x_follow_shortcut_show_hints", "true");
    localStorage.setItem("x_follow_shortcut_compact_pill", "true");
    localStorage.setItem("x_follow_shortcut_compact_pill_design", "3");
    window.scrollTo(0, 0);

    new Function(sharedCode)();
    const xfsModule = { exports: {} };
    new Function("module", "exports", contentCode)(xfsModule, xfsModule.exports);
    window.__XFS_CONTENT_API = xfsModule.exports;
    const contentApi = xfsModule.exports;
    window.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    await sleep(400);

    // --- Part A: /home 1-9 top tab switching ---
    const primary = document.querySelector('[data-testid="primaryColumn"]');
    const tablist = primary?.querySelector('[role="tablist"]');
    const tabs = Array.from(tablist?.querySelectorAll('[role="tab"]') || []);
    const tabCount = tabs.length;

    // Check data-xfs-home-idx hint attributes
    const tab1Hint = tabs[0]?.querySelector("[data-xfs-home-idx]")?.getAttribute("data-xfs-home-idx") || tabs[0]?.getAttribute("data-xfs-home-idx");
    const tab2Hint = tabs[1]?.querySelector("[data-xfs-home-idx]")?.getAttribute("data-xfs-home-idx") || tabs[1]?.getAttribute("data-xfs-home-idx");

    // Initial selected state
    const initialTab0Selected = tabs[0]?.getAttribute("aria-selected") === "true";

    // Switch to tab 2 via digit key '2' (Digit2)
    pressKey("2", "Digit2");
    await sleep(500);
    const tab1SelectedAfterDigit2 = tabs[1]?.getAttribute("aria-selected") === "true";

    // Switch back to tab 1 via digit key '1' (Digit1)
    pressKey("1", "Digit1");
    await sleep(500);
    const tab0SelectedAfterDigit1 = tabs[0]?.getAttribute("aria-selected") === "true";

    // Negative check: G + 2 should NOT switch tab (prefix pending)
    pressKey("ㅎ", "KeyG");
    await sleep(50);
    pressKey("2", "Digit2");
    await sleep(400);
    const tab0StillSelectedAfterG2 = tabs[0]?.getAttribute("aria-selected") === "true";

    // --- Part B: Compact Floating Pill (xfs-compact-pill) ---
    // 1. Verify default mount (Design '3' on /home)
    const initialDocPill = document.documentElement.getAttribute("data-xfs-compact-pill");
    const pillStyleExists = Boolean(document.getElementById("xfs-pill-styles"));

    // 2. Test design configuration switching
    contentApi.applyConfigUpdate({ compactPillDesign: "1" });
    await sleep(100);
    const design1Doc = document.documentElement.getAttribute("data-xfs-compact-pill");

    contentApi.applyConfigUpdate({ compactPillDesign: "2" });
    await sleep(100);
    const design2Doc = document.documentElement.getAttribute("data-xfs-compact-pill");

    contentApi.applyConfigUpdate({ compactPillDesign: "3" });
    await sleep(100);
    const design3Doc = document.documentElement.getAttribute("data-xfs-compact-pill");

    // 3. Test disable toggle
    contentApi.applyConfigUpdate({ compactNewPostsPill: false });
    await sleep(100);
    const disabledDocPill = document.documentElement.getAttribute("data-xfs-compact-pill");
    const disabledStyleExists = Boolean(document.getElementById("xfs-pill-styles"));

    // Re-enable
    contentApi.applyConfigUpdate({ compactNewPostsPill: true, compactPillDesign: "3" });
    await sleep(100);
    const reEnabledDocPill = document.documentElement.getAttribute("data-xfs-compact-pill");

    // 4. Test pill DOM element decoration and click interaction
    let realPillFound = false;
    let pillBtnAttr = null;
    let pillLabelAttr = null;
    let pillAvatarsAttr = null;
    let pillClickedWithoutError = false;

    let pillEl = document.querySelector('[data-testid="pillLabel"]');
    let syntheticContainer = null;
    if (!pillEl) {
      syntheticContainer = document.createElement("div");
      syntheticContainer.setAttribute("role", "status");
      syntheticContainer.innerHTML =
        '<button type="button" id="test-pill-btn">' +
        '<div>' +
        '<div data-testid="pillLabel"><span>새 게시물 보기</span></div>' +
        '<div id="test-pill-avatars"><span>Avatar</span></div>' +
        '</div>' +
        '</button>';
      primary?.appendChild(syntheticContainer);
      if (typeof contentApi.syncCompactPill === "function") {
        contentApi.syncCompactPill(document, "/home");
      } else {
        window.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
      }
      pillEl = document.querySelector('[data-testid="pillLabel"]');
    } else {
      realPillFound = true;
    }

    if (pillEl) {
      const btn = pillEl.closest('button, [role="button"]');
      pillBtnAttr = btn?.getAttribute("data-xfs-pill-btn");
      pillLabelAttr = pillEl.getAttribute("data-xfs-label");
      let avatarEl = pillEl.parentElement?.querySelector('[data-xfs-pill-avatars="true"]');
      if (!avatarEl) {
        const testAvatar = document.createElement("div");
        testAvatar.id = "xfs-test-avatar-el";
        pillEl.parentElement?.appendChild(testAvatar);
        contentApi.syncCompactPill(document, "/home");
        avatarEl = pillEl.parentElement?.querySelector('[data-xfs-pill-avatars="true"]');
        testAvatar.remove();
      }
      pillAvatarsAttr = Boolean(avatarEl);

      try {
        btn?.click();
        pillClickedWithoutError = true;
      } catch (_) {
        pillClickedWithoutError = false;
      }
    }

    if (syntheticContainer) {
      syntheticContainer.remove();
    }

    return {
      topTabs: {
        tabCount,
        tab1Hint,
        tab2Hint,
        initialTab0Selected,
        tab1SelectedAfterDigit2,
        tab0SelectedAfterDigit1,
        tab0StillSelectedAfterG2
      },
      compactPill: {
        initialDocPill,
        pillStyleExists,
        design1Doc,
        design2Doc,
        design3Doc,
        disabledDocPill,
        disabledStyleExists,
        reEnabledDocPill,
        pillBtnAttr,
        pillLabelAttr,
        pillAvatarsAttr,
        pillClickedWithoutError,
        realPillFound
      }
    };
  }, { sharedCode: sharedKeymapSrc, contentCode: contentJsSrc });
  result.homeCheck = homeCheck;

  // Stage 4: Live popup.html + popup.js verification in a fresh tab (no tabs.sendMessage)
  const cleanPopupHtml = popupHtmlSrc.replace(/<script\\b[^>]*\\bsrc=[^>]*>[\\s\\S]*?<\\/script>/gi, "");
  const popupPage = await task.newPage();
  await popupPage.goto("about:blank");
  await popupPage.evaluate(({ html, sharedCode, popupCode }) => {
    document.open();
    document.write(html);
    document.close();

    window.__initialHtmlLang = document.documentElement.getAttribute("lang");
    window.__popupErrors = [];
    window.addEventListener("error", (ev) => window.__popupErrors.push(String(ev.error || ev.message || ev)));
    window.addEventListener("unhandledrejection", (ev) => window.__popupErrors.push(String(ev.reason)));

    window.__chromeStorageData = {};
    window.__chromeStorageWrites = [];
    window.__tabsSendMessageCalls = [];
    window.chrome = {
      storage: {
        sync: {
          get(keys) {
            const s = window.__chromeStorageData;
            const out = {};
            if (keys == null) Object.assign(out, s);
            else if (typeof keys === "string") { if (keys in s) out[keys] = s[keys]; }
            else if (Array.isArray(keys)) { for (const k of keys) { if (k in s) out[k] = s[k]; } }
            else if (typeof keys === "object") { for (const [k, d] of Object.entries(keys)) out[k] = k in s ? s[k] : d; }
            return Promise.resolve(out);
          },
          set(obj) {
            Object.assign(window.__chromeStorageData, obj);
            window.__chromeStorageWrites.push({ ...obj });
            return Promise.resolve();
          }
        }
      },
      tabs: {
        sendMessage(...args) {
          window.__tabsSendMessageCalls.push(args);
          return Promise.resolve();
        }
      }
    };

    new Function(sharedCode)();
    new Function(popupCode)();
    document.dispatchEvent(new Event("DOMContentLoaded", { bubbles: true }));
  }, { html: cleanPopupHtml, sharedCode: sharedKeymapSrc, popupCode: popupJsSrc });
  await popupPage.waitForTimeout(200);

  const popupCheck = await popupPage.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const recorder = document.getElementById("recorder");
    const statusEl = document.getElementById("status");
    const resetBtn = document.getElementById("reset");
    const showHintsInput = document.getElementById("show-ui-hints");
    const compactPillInput = document.getElementById("compact-new-posts-pill");
    const compactPillDesignSelect = document.getElementById("compact-pill-design");
    const langSelect = document.getElementById("lang-select");

    const initialHtmlLang = window.__initialHtmlLang;
    const colorScheme = getComputedStyle(document.documentElement).colorScheme || "";
    const statusColor = statusEl ? getComputedStyle(statusEl).color : "";
    const initialRecorderText = recorder?.textContent;

    // 1. Activate recording via Enter (must NOT record Enter on keyup)
    recorder?.focus();
    recorder?.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true, cancelable: true }));
    await sleep(20);
    const recordingStartedOnEnter = Boolean(recorder?.classList.contains("recording"));
    recorder?.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter", code: "Enter", bubbles: true, cancelable: true }));
    await sleep(20);
    const stillRecordingAfterActivationKeyup = Boolean(recorder?.classList.contains("recording"));

    // 2. Cancel recording via Escape
    recorder?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", code: "Escape", bubbles: true, cancelable: true }));
    await sleep(30);
    const cancelledOnEscape = !recorder?.classList.contains("recording");
    const restoredAfterEscapeText = recorder?.textContent;

    // 3. Record Process + Semicolon via IME keydown after re-entering recording mode
    recorder?.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true, cancelable: true }));
    recorder?.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter", code: "Enter", bubbles: true, cancelable: true }));
    await sleep(20);
    recorder?.dispatchEvent(new KeyboardEvent("keydown", { key: "Process", code: "Semicolon", bubbles: true, cancelable: true }));
    await sleep(40);
    const imeProcessSemicolonSaved =
      !recorder?.classList.contains("recording") &&
      recorder?.textContent === ";" &&
      window.__chromeStorageData.shortcut?.code === "Semicolon" &&
      window.__chromeStorageData.shortcut?.key === ";";

    // 4. Reset button restores KeyF ("F")
    resetBtn?.click();
    await sleep(40);
    const resetRestoredDefault =
      recorder?.textContent === "F" &&
      window.__chromeStorageData.shortcut?.code === "KeyF";

    // 5. Toggle #show-ui-hints off -> on
    showHintsInput?.click();
    await sleep(30);
    const hintsToggledOff = showHintsInput?.checked === false && window.__chromeStorageData.showUiHints === false;
    showHintsInput?.click();
    await sleep(30);
    const hintsToggledOn = showHintsInput?.checked === true && window.__chromeStorageData.showUiHints === true;

    // 6. Toggle #compact-new-posts-pill off -> on and verify #compact-pill-design disabled state
    compactPillInput?.click();
    await sleep(30);
    const compactPillOffDisablesDesign =
      compactPillInput?.checked === false &&
      compactPillDesignSelect?.disabled === true &&
      window.__chromeStorageData.compactNewPostsPill === false;
    compactPillInput?.click();
    await sleep(30);
    const compactPillOnEnablesDesign =
      compactPillInput?.checked === true &&
      compactPillDesignSelect?.disabled === false &&
      window.__chromeStorageData.compactNewPostsPill === true;

    // 7. Change #compact-pill-design to "1"
    if (compactPillDesignSelect) {
      compactPillDesignSelect.value = "1";
      compactPillDesignSelect.dispatchEvent(new Event("change", { bubbles: true }));
    }
    await sleep(30);
    const designChangedTo1 = window.__chromeStorageData.compactPillDesign === "1";

    // 8. Switch language selector to "ko"
    if (langSelect) {
      langSelect.value = "ko";
      langSelect.dispatchEvent(new Event("change", { bubbles: true }));
    }
    await sleep(30);
    const langChangedToKo = document.documentElement.lang === "ko" && window.__chromeStorageData.uiLang === "ko";

    return {
      initialHtmlLang,
      colorScheme,
      statusColor,
      initialRecorderText,
      recordingStartedOnEnter,
      stillRecordingAfterActivationKeyup,
      cancelledOnEscape,
      restoredAfterEscapeText,
      imeProcessSemicolonSaved,
      resetRestoredDefault,
      hintsToggledOff,
      hintsToggledOn,
      compactPillOffDisablesDesign,
      compactPillOnEnablesDesign,
      designChangedTo1,
      langChangedToKo,
      tabsSendMessageCount: window.__tabsSendMessageCalls.length,
      popupErrors: window.__popupErrors
    };
  });
  result.popupCheck = popupCheck;
  result.neutralizedExtensionContextCount = extensionContextIds.size;

  console.log("EGO_E2E_RESULT:" + JSON.stringify(result));
} finally {
  await task.finish({ keep: [] });
}
`;

console.log(`Running live E2E browser test in ego-browser (profile: ${egoProfileName})...`);
const proc = spawnSync('ego-browser', ['nodejs', '-e', egoScript], {
  cwd: rootDir,
  encoding: 'utf8'
});
const rawOut = `${proc.stdout || ''}\n${proc.stderr || ''}`;
if (proc.status !== 0) {
  throw new Error(`ego-browser exited with code ${proc.status}:\n${rawOut}`);
}

const markerLine = rawOut
  .split(/\r?\n/)
  .map((line) => line.trim())
  .find((line) => line.includes('EGO_E2E_RESULT:'));
assert.ok(markerLine, `Expected EGO_E2E_RESULT output from ego-browser. Got:\n${rawOut}`);

const jsonStart = markerLine.indexOf('EGO_E2E_RESULT:') + 'EGO_E2E_RESULT:'.length;
const res = JSON.parse(markerLine.slice(jsonStart));

// 1. Initial load assertions
assert.equal(res.initialCheck.barExists, true, 'Filter bar must exist on /following');
assert.equal(res.initialCheck.btnExists, true, 'Filter toggle button must exist');
assert.equal(res.initialCheck.ariaPressed, 'false', 'Filter starts OFF');
assert.equal(res.initialCheck.hintAttr, 'true', 'Shortcut UI hint attribute must be enabled');
assert.equal(res.initialCheck.sectionMarginTop, '0px', 'Section must not have artificial top margin');
assert.ok(
  res.initialCheck.gapPx !== null && res.initialCheck.gapPx <= 2,
  `First card must sit flush below filter bar on reload without extra gap (measured gap: ${res.initialCheck.gapPx}px)`
);

// 2. Filter OFF J/K assertions
assert.equal(res.offSteps.length, 4);
for (const step of res.offSteps) {
  assert.ok(
    step.alignDiffPx !== null && step.alignDiffPx <= 2,
    `Filter OFF J/K step (${step.key}) must align selected row directly below sticky filter bar (diff: ${step.alignDiffPx}px)`
  );
  assert.equal(step.hasTargetHint, true, 'Focused cell Follow button must have data-xfs-target="true"');
}

// 3. Toggle ON assertions
assert.equal(res.afterToggleOn.ariaPressed, 'true', 'Shift+ㄹ must toggle filter ON');
assert.equal(res.afterToggleOn.barActive, 'true');
assert.equal(res.afterToggleOn.docAttr, 'true');
for (const h of res.afterToggleOn.visibleMutualHeights) {
  assert.equal(h, 0, 'Hidden mutual rows must collapse to height 0');
}

// 4. Filter ON J/K assertions
assert.equal(res.onSteps.length, 4);
for (const step of res.onSteps) {
  assert.equal(step.isMutual, false, 'J/K with filter ON must never land on a mutual follower cell');
  assert.ok(
    step.alignDiffPx !== null && step.alignDiffPx <= 2,
    `Filter ON J/K step (${step.key}) must align selected row directly below sticky filter bar (diff: ${step.alignDiffPx}px)`
  );
}

// 4b. Concurrent UI responsiveness & zero steady-state churn while Shift+F is ON
assert.equal(
  res.concurrentWhileFilterOn.modalOpenedWhileFilterOn,
  true,
  'F (ㄹ) must open confirmation modal while Shift+F is active'
);
assert.equal(
  res.concurrentWhileFilterOn.modalClosedWhileFilterOn,
  true,
  'N (ㅜ) must cancel confirmation modal while Shift+F is active'
);
assert.equal(
  res.concurrentWhileFilterOn.filterStillOnAfterModal,
  true,
  'Shift+F filter must stay ON after modal cancel'
);
assert.equal(
  res.concurrentWhileFilterOn.manualWheelNotHijacked,
  true,
  `Manual wheel scroll must cancel align timers instead of hijacking scroll (afterWheel=${res.concurrentWhileFilterOn.scrollAfterManualWheel}, afterAlignWindow=${res.concurrentWhileFilterOn.scrollAfterAlignWindow})`
);
assert.equal(
  res.concurrentWhileFilterOn.xfsSteadyAttrMutations,
  0,
  `Steady-state Shift+F ON must produce 0 data-xfs-* attribute mutations over 300ms (got ${res.concurrentWhileFilterOn.xfsSteadyAttrMutations})`
);
assert.equal(
  res.concurrentWhileFilterOn.clickedToggleOff,
  true,
  'Clicking #xfs-non-follower-toggle must toggle filter OFF responsively'
);
assert.equal(
  res.concurrentWhileFilterOn.clickedToggleBackOn,
  true,
  'Clicking #xfs-non-follower-toggle again must toggle filter back ON responsively'
);
assert.equal(
  res.concurrentWhileFilterOn.helpModalOpenedWhileFilterOn,
  true,
  'Question-mark (?) shortcut help modal must open while Shift+F is active'
);
assert.equal(
  res.concurrentWhileFilterOn.helpModalClosedWhileFilterOn,
  true,
  'Question-mark (?) shortcut help modal must close cleanly while Shift+F is active'
);
assert.ok(
  res.concurrentWhileFilterOn.followingLoopLag.p95LagMs < 150,
  `Main thread macrotask p95 lag on /following with Shift+F ON must stay responsive (<150ms, got ${res.concurrentWhileFilterOn.followingLoopLag.p95LagMs}ms)`
);
assert.ok(
  res.navCheck.followersLoopLag.p95LagMs < 150,
  `Main thread macrotask p95 lag during /followers Shift+F ON cascade must stay responsive (<150ms, got ${res.navCheck.followersLoopLag.p95LagMs}ms)`
);

// 5. Toggle OFF assertions
assert.equal(res.afterToggleOff.ariaPressed, 'false', 'Shift+F must toggle filter back OFF');
assert.equal(res.afterToggleOff.barActive, 'false');

// 6. Follow/Unfollow (F/ㄹ) + Confirmation Modal (N/ㅜ) assertions
assert.equal(res.modalCheck.confirmBtnOpen, true, 'Pressing ㄹ (F) on focused cell must open unfollow confirmation dialog');
assert.equal(res.modalCheck.cancelBtnOpen, true, 'Confirmation dialog must have cancel button');
assert.equal(res.modalCheck.modalClosedAfterN, true, 'Pressing ㅜ (N) must cancel and close the confirmation dialog');

// 7. Follow list tab navigation (/followers, /verified_followers, profile root cleanup, /following) assertions
const followerLabelRe = /(내가 팔로우 안 한 계정만 보기|Not followed back only|仅看我未回关用户|未フォローバックのみ表示)/;
assert.equal(/\/followers\/?$/i.test(res.navCheck.followersPath), true, 'ㅎ -> ㅈ (g -> w) must navigate to /followers');
assert.equal(res.navCheck.barMountedOnFollowers, true, 'Filter bar must stay mounted on /followers');
assert.equal(res.navCheck.followersMode, 'followers', 'data-xfs-filter-mode must be "followers" on /followers');
assert.match(res.navCheck.followersBtnText, followerLabelRe, 'Filter button must show follower-mode label on /followers');
assert.ok(res.navCheck.followersHiddenHeights.length > 0, 'Expected at least one -unfollow/-cancel row on /Hanssony_/followers');
for (const h of res.navCheck.followersHiddenHeights) {
  assert.equal(h, 0, 'Already-followed (-unfollow/-cancel) rows on /followers must collapse to height 0');
}
for (const h of res.navCheck.followersUnfollowedHeights) {
  assert.ok(h > 0, 'Unfollowed (-follow) rows on /followers must remain visible');
}

assert.equal(/\/verified_followers\/?$/i.test(res.navCheck.verifiedFollowersPath), true, 'ㅎ -> ㅍ (g -> v) must navigate to /verified_followers');
assert.equal(res.navCheck.barMountedOnVerifiedFollowers, true, 'Filter bar must stay mounted on /verified_followers');
assert.equal(res.navCheck.verifiedFollowersMode, 'followers', 'data-xfs-filter-mode must be "followers" on /verified_followers');
assert.match(res.navCheck.verifiedFollowersBtnText, followerLabelRe, 'Filter button must show follower-mode label on /verified_followers');
for (const h of res.navCheck.verifiedHiddenHeights) {
  assert.equal(h, 0, 'Already-followed (-unfollow/-cancel) rows on /verified_followers must collapse to height 0');
}
for (const h of res.navCheck.verifiedUnfollowedHeights) {
  assert.ok(h > 0, 'Unfollowed (-follow) rows on /verified_followers must remain visible');
}

assert.equal(res.navCheck.barRemovedOnNonFilter, true, 'Filter bar must be removed on profile root / non-filter route');
assert.equal(res.navCheck.modeRemovedOnNonFilter, true, 'data-xfs-filter-mode must be removed on non-filter route');
assert.equal(/\/following\/?$/i.test(res.navCheck.followingPathAgain), true, 'ㅎ -> ㅐ (g -> o) must navigate back to /following');
assert.equal(res.navCheck.barRestoredOnFollowing, true, 'Filter bar must be restored when returning to /following');
assert.equal(res.navCheck.followingModeAgain, 'following', 'data-xfs-filter-mode must be "following" on /following');

// 8. Non-vacuous unfollowed (-follow) visibility check on /DonMacKR/followers
assert.equal(res.unfollowedCheck.mode, 'followers');
assert.equal(res.unfollowedCheck.ariaPressed, 'true');
assert.ok(res.unfollowedCheck.unfollowedHeights.length > 0, 'Expected at least one unfollowed (-follow) row on /DonMacKR/followers');
for (const h of res.unfollowedCheck.unfollowedHeights) {
  assert.ok(h > 0, 'Unfollowed (-follow) rows on /DonMacKR/followers must remain visible');
}
for (const h of res.unfollowedCheck.hiddenHeights) {
  assert.equal(h, 0, 'Already-followed (-unfollow/-cancel) rows on /DonMacKR/followers must collapse to height 0');
}

// 9. shared-keymap.js runtime & loading assertions
assert.equal(res.keymapCheck.defined, true, 'window.XFSKeymap must be defined in browser runtime');
assert.equal(res.keymapCheck.hasDefaultShortcut, true, 'DEFAULT_SHORTCUT must have code KeyF');
assert.equal(typeof res.keymapCheck.isApplePlatform, 'boolean', 'isApplePlatform must return boolean');
assert.ok(res.keymapCheck.layoutCount >= 150, 'LAYOUT_CHAR_TO_CODE must contain multilingual layouts');
assert.equal(res.keymapCheck.hebrewSample, 'KeyF', 'Hebrew כ must resolve to KeyF');
assert.equal(res.keymapCheck.greekSample, 'KeyF', 'Greek φ must resolve to KeyF');
assert.equal(res.keymapCheck.thaiSample, 'KeyF', 'Thai ด must resolve to KeyF');
assert.equal(res.keymapCheck.formatSample, 'F', 'formatShortcutLabel must format KeyF as F');

// 10. Proposal B.1: Dynamic Send Badge CSS Variable & Style Rule assertions
assert.equal(res.b1Check.hasSendBadgeRule, true, '#xfs-styles must include var(--xfs-send-badge) CSS rule');
assert.equal(
  res.b1Check.sendBadgeVal,
  res.b1Check.isApple ? '"⌘↵"' : '"Ctrl↵"',
  '--xfs-send-badge must match platform detection'
);

// 11. Proposal A.1: 180ms Focus Guard & Orphan Keyup Filter vs Korean IME Recovery assertions
assert.equal(res.a1Check.guardSuppressed, true, 'Orphan keyup within 180ms of window focus must be dropped');
assert.equal(res.a1Check.asciiOrphanSuppressed, true, 'Pure ASCII orphan keyup "f" must be suppressed without action');
assert.equal(res.a1Check.digitOrphanSuppressed, true, 'Digit2 orphan keyup (e.g. Cmd+2) must be suppressed without action');
assert.equal(res.a1Check.imeOrphanRecovered, true, 'Korean IME orphan keyup "ㄹ" after 180ms must trigger follow action recovery');

// 12. Proposal B.3: Multilingual Hebrew, Greek, Thai Shortcuts assertions
assert.equal(res.b3Check.hebrewNav, true, 'Hebrew ח / ל must navigate rows');
assert.equal(res.b3Check.greekNav, true, 'Greek ξ / κ must navigate rows');
assert.equal(res.b3Check.thaiNav, true, 'Thai ่ / า must navigate rows');
assert.equal(res.b3Check.greekModalOpened, true, 'Greek φ must open unfollow confirmation modal');
assert.equal(res.b3Check.greekModalClosed, true, 'Greek ν must cancel and close confirmation modal');

// 13. Proposal A.2: Status Page Safe Matching & Sidebar Isolation assertions
assert.ok(res.a2Check.loggedInUser, 'Logged in username must be detected from profile link');
assert.equal(res.a2Check.selfPostExact, null, 'findStatusFollowButton must return null for self-post (exact)');
assert.equal(res.a2Check.selfPostLower, null, 'findStatusFollowButton must return null for self-post (case-insensitive)');
assert.equal(res.a2Check.sidebarIsolated, true, 'findStatusFollowButton must NEVER select buttons from sidebarColumn');

// 14. Proposal A.3: Pending Follow Request Button Selector assertions
assert.equal(res.a3Check.cancelSelectorMatches, true, 'FOLLOW_BTN_SELECTOR must match pending follow request buttons ending in -cancel');
assert.equal(res.a3Check.cancelQueryMatches, true, 'UserCell with pending -cancel button must be queryable');

// 15. Proposal C.1: Scoped Mouseover Listener assertions
assert.equal(res.c1Check.untrustedSync, true, 'handleMouseOver must allow synthetic/untrusted events');
assert.equal(res.c1Check.nullSync, true, 'handleMouseOver must allow null/synthetic event calls');
assert.equal(res.c1Check.trustedNonStatusSync, false, 'handleMouseOver must ignore trusted mouseovers on non-status pages');

// 16. Proposal C.2: Storage-Only Configuration Update assertions
assert.equal(res.c2Check.customKeyVar, '"k"', 'applyConfigUpdate must update --xfs-follow-key dynamically');
assert.equal(res.c2Check.hintsDisabled, true, 'applyConfigUpdate with showUiHints=false must remove styles');
assert.equal(res.c2Check.defaultKeyVar, '"f"', 'Restoring shortcut must update --xfs-follow-key back to "f"');
assert.equal(res.c2Check.hintsRestored, true, 'Restoring showUiHints must restore styles');

// 17. /home top tab switching (1-9) assertions
assert.ok(res.homeCheck.topTabs.tabCount >= 2, 'Expected at least 2 top tabs on /home (For you and Following)');
assert.equal(res.homeCheck.topTabs.tab1Hint, '1', 'Tab 1 must have data-xfs-home-idx="1"');
assert.equal(res.homeCheck.topTabs.tab2Hint, '2', 'Tab 2 must have data-xfs-home-idx="2"');
assert.equal(res.homeCheck.topTabs.initialTab0Selected, true, 'Tab 0 (For you) must be initially selected');
assert.equal(res.homeCheck.topTabs.tab1SelectedAfterDigit2, true, 'Pressing Digit2 must select tab 1 (Following)');
assert.equal(res.homeCheck.topTabs.tab0SelectedAfterDigit1, true, 'Pressing Digit1 must select tab 0 (For you)');
assert.equal(res.homeCheck.topTabs.tab0StillSelectedAfterG2, true, 'G + 2 must NOT switch tabs (prefix guard)');

// 18. Compact floating button (xfs-compact-pill) assertions
assert.equal(res.homeCheck.compactPill.initialDocPill, '3', 'html must have data-xfs-compact-pill="3" by default on /home');
assert.equal(res.homeCheck.compactPill.pillStyleExists, true, '#xfs-pill-styles must exist on /home');
assert.equal(res.homeCheck.compactPill.design1Doc, '1', 'compactPillDesign="1" must update html[data-xfs-compact-pill="1"]');
assert.equal(res.homeCheck.compactPill.design2Doc, '2', 'compactPillDesign="2" must update html[data-xfs-compact-pill="2"]');
assert.equal(res.homeCheck.compactPill.design3Doc, '3', 'compactPillDesign="3" must update html[data-xfs-compact-pill="3"]');
assert.equal(res.homeCheck.compactPill.disabledDocPill, null, 'Disabling compact pill must remove data-xfs-compact-pill');
assert.equal(res.homeCheck.compactPill.disabledStyleExists, false, 'Disabling compact pill must remove #xfs-pill-styles');
assert.equal(res.homeCheck.compactPill.reEnabledDocPill, '3', 'Re-enabling compact pill must restore data-xfs-compact-pill="3"');
assert.equal(res.homeCheck.compactPill.pillBtnAttr, '3', 'Pill button must have data-xfs-pill-btn="3"');
assert.match(res.homeCheck.compactPill.pillLabelAttr, /(게시됨|Posted|已发帖|ポスト済)/, 'Pill must receive localized data-xfs-label');
assert.equal(res.homeCheck.compactPill.pillAvatarsAttr, true, 'Avatar element must receive data-xfs-pill-avatars="true"');
assert.equal(res.homeCheck.compactPill.pillClickedWithoutError, true, 'Pill button click must execute cleanly without error');

// 19. Popup UI & storage-only contract assertions (Stage 4)
assert.equal(res.popupCheck.initialHtmlLang, 'ko', 'popup.html root must declare lang="ko"');
assert.ok(
  res.popupCheck.colorScheme.includes('light') && res.popupCheck.colorScheme.includes('dark'),
  `popup.html color-scheme must support light dark (got "${res.popupCheck.colorScheme}")`
);
assert.equal(res.popupCheck.initialRecorderText, 'F', 'Initial recorder label must be F');
assert.equal(res.popupCheck.recordingStartedOnEnter, true, 'Enter keydown on #recorder must start recording');
assert.equal(
  res.popupCheck.stillRecordingAfterActivationKeyup,
  true,
  'Matching Enter keyup after activation must not record Enter'
);
assert.equal(res.popupCheck.cancelledOnEscape, true, 'Escape must cancel recording');
assert.equal(res.popupCheck.restoredAfterEscapeText, 'F', 'Escape must restore previous shortcut label');
assert.equal(
  res.popupCheck.imeProcessSemicolonSaved,
  true,
  'Process + Semicolon keydown during recording must save Semicolon shortcut (;)'
);
assert.equal(res.popupCheck.resetRestoredDefault, true, '#reset click must restore KeyF ("F")');
assert.equal(
  res.popupCheck.hintsToggledOff && res.popupCheck.hintsToggledOn,
  true,
  '#show-ui-hints toggle must update checked state and chrome.storage.sync'
);
assert.equal(
  res.popupCheck.compactPillOffDisablesDesign,
  true,
  'Disabling #compact-new-posts-pill must disable #compact-pill-design and persist false'
);
assert.equal(
  res.popupCheck.compactPillOnEnablesDesign,
  true,
  'Enabling #compact-new-posts-pill must re-enable #compact-pill-design and persist true'
);
assert.equal(res.popupCheck.designChangedTo1, true, 'Changing #compact-pill-design must persist value "1"');
assert.equal(res.popupCheck.langChangedToKo, true, 'Changing #lang-select to "ko" must update html lang and persist uiLang');
assert.equal(res.popupCheck.tabsSendMessageCount, 0, 'popup.js must use storage-only updates (0 tabs.sendMessage calls)');
assert.deepEqual(res.popupCheck.popupErrors, [], 'popup page must have zero uncaught runtime errors');
console.log('Neutralized installed CWS extension contexts:', res.neutralizedExtensionContextCount);

console.log(`E2E ego-browser (${egoProfileName} profile) assertions passed.`);
