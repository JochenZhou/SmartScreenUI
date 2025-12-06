import { readFileSync, writeFileSync, existsSync } from 'fs';

const BUILD_GRADLE = 'android/app/build.gradle';
const PACKAGE_JSON = 'package.json';

if (existsSync(BUILD_GRADLE) && existsSync(PACKAGE_JSON)) {
  const packageJson = JSON.parse(readFileSync(PACKAGE_JSON, 'utf8'));
  const version = packageJson.version;
  
  // 从版本号生成 versionCode (例如: 1.2.3 -> 10203)
  const [major, minor, patch] = version.split('.').map(Number);
  const versionCode = major * 10000 + minor * 100 + patch;
  
  let gradle = readFileSync(BUILD_GRADLE, 'utf8');
  
  gradle = gradle.replace(
    /versionCode\s+\d+/,
    `versionCode ${versionCode}`
  );
  
  gradle = gradle.replace(
    /versionName\s+"[^"]+"/,
    `versionName "${version}"`
  );
  
  writeFileSync(BUILD_GRADLE, gradle, 'utf8');
  console.log(`✅ Android version updated: ${version} (${versionCode})`);
} else {
  console.log('⚠️  build.gradle or package.json not found');
}
