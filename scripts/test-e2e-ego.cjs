const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const contentJsPath = path.join(rootDir, 'content.js');
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
        try {
          await page.cdp("Runtime.evaluate", {
            contextId: ctx.id,
            expression: [
              "window.requestAnimationFrame = () => 0;",
              "window.setTimeout = () => 0;",
              "window.setInterval = () => 0;",
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
  await page.waitForSelector("[data-testid=\\"UserCell\\"]", { timeout: 20000 });
  await page.waitForTimeout(1500);
  await neutralizeInstalledExtension();

  const src = fs.readFileSync(${JSON.stringify(contentJsPath)}, "utf8");
  const result = await page.evaluate(async (code) => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const pressKey = (key, codeStr, opts = {}) => {
      const init = { key, code: codeStr, bubbles: true, cancelable: true, ...opts };
      window.dispatchEvent(new KeyboardEvent("keydown", init));
      window.dispatchEvent(new KeyboardEvent("keyup", init));
    };

    // Reset state & inject fresh content.js
    localStorage.setItem("x_follow_shortcut_filter_non_followers", "false");
    localStorage.setItem("x_follow_shortcut_show_hints", "true");
    window.scrollTo(0, 0);
    new Function(code)();
    // Trigger mouseover to ensure syncUiHints runs even when the tab is in the background (rAF may be throttled)
    window.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    await sleep(300);
    if (!document.getElementById("xfs-following-filter-bar")) {
      pressKey("Shift", "ShiftLeft");
      await sleep(100);
    }

    const primary = document.querySelector("[data-testid=\\"primaryColumn\\"]");
    const bar = document.getElementById("xfs-following-filter-bar");
    const btn = document.getElementById("xfs-non-follower-toggle");
    const section = primary?.querySelector("section[role=\\"region\\"], section");
    const firstRow = primary?.querySelector("[data-testid=\\"cellInnerDiv\\"]");

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
      await sleep(180);
      const bRect = document.getElementById("xfs-following-filter-bar")?.getBoundingClientRect();
      const fRow = primary?.querySelector("[data-testid=\\"cellInnerDiv\\"][data-xfs-focused=\\"true\\"]");
      const fCell = fRow?.querySelector("[data-testid=\\"UserCell\\"]");
      const fBtn = fCell?.querySelector("[data-xfs-target=\\"true\\"]");
      const rRect = fRow?.getBoundingClientRect();
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
    await sleep(250);
    const barOn = document.getElementById("xfs-following-filter-bar");
    const btnOn = document.getElementById("xfs-non-follower-toggle");
    const afterToggleOn = {
      ariaPressed: btnOn?.getAttribute("aria-pressed"),
      barActive: barOn?.getAttribute("data-xfs-active"),
      docAttr: document.documentElement.getAttribute("data-xfs-filter-non-followers"),
      hiddenMutualCount: primary?.querySelectorAll("[data-testid=\\"UserCell\\"][data-xfs-mutual=\\"true\\"][data-xfs-hidden=\\"true\\"]").length || 0,
      visibleMutualHeights: Array.from(primary?.querySelectorAll("[data-testid=\\"cellInnerDiv\\"][data-xfs-hidden=\\"true\\"]") || []).map(el => el.getBoundingClientRect().height)
    };

    // 4. Filter ON: press J 3 times and K 1 time, verify mutuals are skipped and focused row aligns flush below sticky bar
    const onSteps = [];
    for (const [k, c] of [["j", "KeyJ"], ["ㅓ", "KeyJ"], ["j", "KeyJ"], ["k", "KeyK"]]) {
      pressKey(k, c);
      await sleep(220);
      window.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
      await sleep(50);
      const bRect = document.getElementById("xfs-following-filter-bar")?.getBoundingClientRect();
      const fRow = primary?.querySelector("[data-testid=\\"cellInnerDiv\\"][data-xfs-focused=\\"true\\"]");
      const fCell = fRow?.querySelector("[data-testid=\\"UserCell\\"]");
      const rRect = fRow?.getBoundingClientRect();
      onSteps.push({
        key: k,
        isMutual: fCell?.getAttribute("data-xfs-mutual") === "true",
        barBottom: bRect?.bottom,
        rowTop: rRect?.top,
        alignDiffPx: bRect && rRect ? Math.abs(rRect.top - bRect.bottom) : null
      });
    }

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
    const confirmBtnOpen = Boolean(document.querySelector("[data-testid=\\"confirmationSheetConfirm\\"]"));
    const cancelBtnOpen = Boolean(document.querySelector("[data-testid=\\"confirmationSheetCancel\\"]"));
    pressKey("ㅜ", "KeyN");
    await sleep(300);
    const modalClosedAfterN = !document.querySelector("[data-testid=\\"confirmationSheetConfirm\\"]");

    // 7. Test g -> w (/followers), g -> v (/verified_followers), profile root cleanup, and g -> o (/following)
    pressKey("ㅎ", "KeyG");
    await sleep(80);
    pressKey("ㅈ", "KeyW");
    await sleep(1500);
    window.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    await sleep(250);
    const followersPath = location.pathname;
    const barMountedOnFollowers = Boolean(document.getElementById("xfs-following-filter-bar"));
    const followersMode = document.documentElement.getAttribute("data-xfs-filter-mode");
    const followersBtnText = document.getElementById("xfs-non-follower-toggle")?.textContent || "";

    // Toggle ON on /followers and verify -unfollow rows hide while -follow rows stay visible
    pressKey("ㄹ", "KeyF", { shiftKey: true });
    await sleep(300);
    const primaryFollowers = document.querySelector("[data-testid=\\"primaryColumn\\"]");
    const followersHiddenHeights = Array.from(
      primaryFollowers?.querySelectorAll("[data-testid=\\"cellInnerDiv\\"]:has([data-testid$=\\"-unfollow\\"], [data-testid$=\\"-cancel\\"])") || []
    ).map((el) => el.getBoundingClientRect().height);
    const followersUnfollowedHeights = Array.from(
      primaryFollowers?.querySelectorAll("[data-testid=\\"cellInnerDiv\\"]:has([data-testid$=\\"-follow\\"])") || []
    ).map((el) => el.getBoundingClientRect().height);

    // Switch to /verified_followers while filter is ON
    pressKey("ㅎ", "KeyG");
    await sleep(80);
    pressKey("ㅍ", "KeyV");
    await sleep(1500);
    window.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    await sleep(250);
    const verifiedFollowersPath = location.pathname;
    const barMountedOnVerifiedFollowers = Boolean(document.getElementById("xfs-following-filter-bar"));
    const verifiedFollowersMode = document.documentElement.getAttribute("data-xfs-filter-mode");
    const verifiedFollowersBtnText = document.getElementById("xfs-non-follower-toggle")?.textContent || "";
    const primaryVerified = document.querySelector("[data-testid=\\"primaryColumn\\"]");
    const verifiedHiddenHeights = Array.from(
      primaryVerified?.querySelectorAll("[data-testid=\\"cellInnerDiv\\"]:has([data-testid$=\\"-unfollow\\"], [data-testid$=\\"-cancel\\"])") || []
    ).map((el) => el.getBoundingClientRect().height);
    const verifiedUnfollowedHeights = Array.from(
      primaryVerified?.querySelectorAll("[data-testid=\\"cellInnerDiv\\"]:has([data-testid$=\\"-follow\\"])") || []
    ).map((el) => el.getBoundingClientRect().height);

    // Toggle filter back OFF before leaving
    pressKey("F", "KeyF", { shiftKey: true });
    await sleep(200);

    // Navigate to profile root (/Hanssony_) and verify bar is removed on non-filter route
    const profileLink = document.querySelector("header nav a[data-testid=\\"AppTabBar_Profile_Link\\"]");
    if (profileLink) {
      profileLink.click();
    } else {
      history.pushState({}, "", "/Hanssony_");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
    await sleep(1200);
    window.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    await sleep(250);
    const nonFilterPath = location.pathname;
    const barRemovedOnNonFilter = !document.getElementById("xfs-following-filter-bar");
    const modeRemovedOnNonFilter = document.documentElement.getAttribute("data-xfs-filter-mode") === null;

    pressKey("ㅎ", "KeyG");
    await sleep(80);
    pressKey("ㅐ", "KeyO");
    await sleep(1400);
    window.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    await sleep(250);
    const followingPathAgain = location.pathname;
    const barRestoredOnFollowing = Boolean(document.getElementById("xfs-following-filter-bar"));
    const followingModeAgain = document.documentElement.getAttribute("data-xfs-filter-mode");

    return {
      initialCheck,
      offSteps,
      afterToggleOn,
      onSteps,
      afterToggleOff,
      modalCheck: { confirmBtnOpen, cancelBtnOpen, modalClosedAfterN },
      navCheck: {
        followersPath,
        barMountedOnFollowers,
        followersMode,
        followersBtnText,
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
      }
    };
  }, src);

  // 8. Non-vacuous check on /DonMacKR/followers that unfollowed (-follow) followers remain visible when filter is ON
  await page.goto("https://x.com/DonMacKR/followers");
  await page.waitForSelector("[data-testid=\\"UserCell\\"]", { timeout: 20000 });
  await page.waitForTimeout(1200);
  await neutralizeInstalledExtension();
  const unfollowedCheck = await page.evaluate(async (code) => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const pressKey = (key, codeStr, opts = {}) => {
      const init = { key, code: codeStr, bubbles: true, cancelable: true, ...opts };
      window.dispatchEvent(new KeyboardEvent("keydown", init));
      window.dispatchEvent(new KeyboardEvent("keyup", init));
    };
    localStorage.setItem("x_follow_shortcut_filter_non_followers", "false");
    new Function(code)();
    window.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    await sleep(250);
    pressKey("ㄹ", "KeyF", { shiftKey: true });
    await sleep(300);
    const primary = document.querySelector("[data-testid=\\"primaryColumn\\"]");
    const unfollowedHeights = Array.from(
      primary?.querySelectorAll("[data-testid=\\"cellInnerDiv\\"]:has([data-testid$=\\"-follow\\"])") || []
    ).map((el) => el.getBoundingClientRect().height);
    const hiddenHeights = Array.from(
      primary?.querySelectorAll("[data-testid=\\"cellInnerDiv\\"]:has([data-testid$=\\"-unfollow\\"], [data-testid$=\\"-cancel\\"])") || []
    ).map((el) => el.getBoundingClientRect().height);
    const mode = document.documentElement.getAttribute("data-xfs-filter-mode");
    const ariaPressed = document.getElementById("xfs-non-follower-toggle")?.getAttribute("aria-pressed");
    pressKey("F", "KeyF", { shiftKey: true });
    await sleep(150);
    return { mode, ariaPressed, unfollowedHeights, hiddenHeights };
  }, src);
  result.unfollowedCheck = unfollowedCheck;

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
assert.ok(res.navCheck.verifiedHiddenHeights.length > 0, 'Expected at least one -unfollow/-cancel row on /Hanssony_/verified_followers');
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

console.log(`E2E ego-browser (${egoProfileName} profile) assertions passed.`);
