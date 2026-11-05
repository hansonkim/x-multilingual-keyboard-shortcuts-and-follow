# AGENTS.md

## Release 절차

`main`에 push하면 `.github/workflows/release.yml`(CD)이 `node test.cjs` → `node scripts/build-release.cjs` → `manifest.json`의 version으로 `v<version>` GitHub Release 생성/갱신을 수행한다. 따라서 릴리스에 포함할 변경은 push 전에 버전을 올려야 한다.

기능 추가·수정을 릴리스할 때마다 아래를 같은 변경에 포함한다.

1. **원격 최신화**: `git fetch origin` 후 `origin/main`의 최신 버전(`manifest.json`, `git tag`)을 확인한다. 이미 사용된 버전이면 그 다음 버전을 쓴다.
2. **버전 올리기** — 아래 위치를 모두 같은 버전으로 맞춘다.
   - `manifest.json`의 `"version"` (단일 source of truth. `dist/*.user.js`의 `@version`은 빌드 시 자동 반영되므로 직접 수정하지 않는다)
   - `README.md`, `README.ko.md`, `README.ja.md`, `README.zh.md` 상단 Chrome Web Store 배지(`Web%20Store-v<version>-`)
   - `CHROMEWEBSTORE.md`의 Version History 표 맨 위에 새 행 추가 (Version / Date / Changes / Status=`Draft`)
3. **문서 동기화**: 사용자에게 보이는 기능이 바뀌면 README 4종(ko/en/ja/zh)의 기능 목록도 함께 갱신한다.
4. **검증**: `node --check content.js && node test.cjs` 통과를 확인한다.
5. **커밋·push**: 커밋 메시지에 버전을 포함한다(예: `feat: ... (v1.0.11)`). push 후 `gh run list --limit 1`로 Release 워크플로 성공 여부를 확인한다.

## 로컬 지침 (`AGENTS.local.md`)

저장소 루트에 `AGENTS.local.md` 파일이 존재하면 세션 시작 시 항상 함께 읽고 따른다.
