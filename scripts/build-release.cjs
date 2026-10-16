const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const manifest = JSON.parse(fs.readFileSync(path.join(rootDir, 'manifest.json'), 'utf8'));
const contentJs = fs.readFileSync(path.join(rootDir, 'content.js'), 'utf8');

fs.mkdirSync(distDir, { recursive: true });

// 1. Build Safari / cross-browser Userscript (.user.js)
const userscriptHeader = `// ==UserScript==
// @name         ${manifest.name}
// @namespace    https://github.com/hansonkim/x-multilingual-keyboard-shortcuts-and-follow
// @version      ${manifest.version}
// @description  ${manifest.description}
// @author       Hanssony
// @match        https://x.com/*
// @match        https://twitter.com/*
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @downloadURL  https://github.com/hansonkim/x-multilingual-keyboard-shortcuts-and-follow/releases/latest/download/x-multilingual-keyboard-shortcuts-and-follow.user.js
// @updateURL    https://github.com/hansonkim/x-multilingual-keyboard-shortcuts-and-follow/releases/latest/download/x-multilingual-keyboard-shortcuts-and-follow.user.js
// ==/UserScript==

`;

const userscriptPath = path.join(distDir, 'x-multilingual-keyboard-shortcuts-and-follow.user.js');
fs.writeFileSync(userscriptPath, userscriptHeader + contentJs, 'utf8');

// 2. Build Safari Userscript bundle ZIP & Chrome Extension ZIP
const safariZipPath = path.join(distDir, 'x-multilingual-keyboard-shortcuts-and-follow-safari-userscript.zip');
const chromeZipPath = path.join(distDir, 'x-multilingual-keyboard-shortcuts-and-follow-chrome.zip');

if (fs.existsSync(safariZipPath)) fs.unlinkSync(safariZipPath);
if (fs.existsSync(chromeZipPath)) fs.unlinkSync(chromeZipPath);

execFileSync('zip', ['-j', safariZipPath, userscriptPath], { cwd: rootDir, stdio: 'inherit' });
execFileSync(
  'zip',
  [
    '-r',
    chromeZipPath,
    'manifest.json',
    'content.js',
    'popup.html',
    'popup.js',
    'icons/icon-16.png',
    'icons/icon-48.png',
    'icons/icon-128.png'
  ],
  { cwd: rootDir, stdio: 'inherit' }
);

console.log(`Built packages for v${manifest.version} in ${distDir}:`);
console.log(' -', path.basename(userscriptPath));
console.log(' -', path.basename(safariZipPath));
console.log(' -', path.basename(chromeZipPath));
