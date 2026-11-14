# AGENTS.md

## 버전 규칙 (SemVer: `MAJOR.MINOR.PATCH`)

버전은 반드시 변경 성격에 따라 **Major / Minor / Patch**를 구분해 올린다. (현재 기준 버전: `1.0.17`)

- **MAJOR (`X.0.0`)**: 기존 단축키·저장 설정(`chrome.storage.sync`)·유저스크립트 동작의 하위 호환성이 깨지는 변경(Breaking Change) 또는 전면 개편 시 올리고 `MINOR`, `PATCH`를 `0`으로 초기화한다.
- **MINOR (`x.Y.0`)**: 하위 호환성을 유지하면서 새로운 기능, 새 단축키, 새 언어/레이아웃, 새 UI 옵션을 추가할 때 올리고 `PATCH`를 `0`으로 초기화한다. (예: `1.0.17` → `1.1.0`)
- **PATCH (`x.y.Z`)**: 버그 수정, 오작동 가드, 성능 개선, UI 미세 조정, 내부 리팩터링 등 기존 기능의 수정·안정화 시 올린다. (예: `1.0.17` → `1.0.18`)

## Release 절차

`main`에 push하면 `.github/workflows/release.yml`(CD)이 `node test.cjs` → `node scripts/build-release.cjs` → `manifest.json`의 version으로 `v<version>` GitHub Release 생성/갱신 → Chrome Web Store API v2(Workload Identity Federation)로 초안(Draft) 패키지 업로드(`CHROMEWEBSTORE.md`의 해당 버전 Status가 `Submitted`면 검토 제출까지)를 수행한다. 따라서 릴리스에 포함할 변경은 push 전에 버전을 올려야 한다.

기능 추가·수정을 릴리스할 때마다 아래를 같은 변경에 포함한다.

1. **원격 최신화 및 다음 버전 결정**: `git fetch origin` 후 `origin/main`의 최신 버전(`manifest.json`, `git tag`)을 확인하고, 위 SemVer 기준(MAJOR / MINOR / PATCH)에 맞춰 다음 버전을 정한다. 이미 사용된 버전이면 해당 자릿수의 다음 버전을 쓴다.
2. **버전 올리기** — 아래 위치를 모두 같은 버전으로 맞춘다.
   - `manifest.json`의 `"version"` (단일 source of truth. `dist/*.user.js`의 `@version`은 빌드 시 자동 반영되므로 직접 수정하지 않는다)
   - `README.md`, `README.ko.md`, `README.ja.md`, `README.zh.md` 상단 Chrome Web Store 배지(`Web%20Store-v<version>-`)
   - `CHROMEWEBSTORE.md`의 Version History 표 맨 위에 새 행 추가 (Version / Date / Changes / Status=`Draft`)
3. **문서 동기화**: 사용자에게 보이는 기능이 바뀌면 README 4종(ko/en/ja/zh)의 기능 목록도 함께 갱신한다.
4. **검증**: `node --check content.js && node test.cjs` 통과를 확인한다.
5. **커밋·push**: 커밋 메시지에 버전을 포함한다(예: `feat: ... (v1.0.11)`). push 후 `gh run list --limit 1`로 Release 워크플로 성공 여부를 확인한다.

## 로컬 지침 (`AGENTS.local.md`)

저장소 루트에 `AGENTS.local.md` 파일이 존재하면 세션 시작 시 항상 함께 읽고 따른다.
