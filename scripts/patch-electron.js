#!/usr/bin/env node
// Patches the local Electron.app to use Wolf AI's bundle ID so it shows up
// correctly in macOS System Settings → Privacy & Security → Microphone.
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const appPath = path.join(__dirname, '../node_modules/electron/dist/Electron.app');
const plistPath = path.join(appPath, 'Contents/Info.plist');

if (!fs.existsSync(plistPath)) {
  console.log('[patch-electron] Electron.app not found — skipping');
  process.exit(0);
}

// Check if already patched
try {
  const current = execSync(`/usr/libexec/PlistBuddy -c "Print :CFBundleIdentifier" "${plistPath}"`, { stdio: 'pipe' }).toString().trim();
  if (current === 'com.risegroup.wolfai') {
    console.log('[patch-electron] Already patched — skipping');
    process.exit(0);
  }
} catch (_) {}

const pb = (cmd) => execSync(`/usr/libexec/PlistBuddy -c "${cmd}" "${plistPath}"`, { stdio: 'pipe' });

try {
  pb('Set :CFBundleIdentifier com.risegroup.wolfai');
  pb('Set :CFBundleName Wolf AI');
  try { pb('Set :CFBundleDisplayName Wolf AI'); } catch (_) { pb('Add :CFBundleDisplayName string Wolf AI'); }

  // Re-sign with ad-hoc identity after Info.plist change
  execSync(`codesign --force --deep --sign - "${appPath}"`, { stdio: 'pipe' });

  console.log('[patch-electron] Patched Electron.app → com.risegroup.wolfai (Wolf AI)');
} catch (e) {
  console.error('[patch-electron] Failed:', e.message);
  process.exit(1);
}
