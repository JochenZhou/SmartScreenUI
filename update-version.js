import { readFileSync, writeFileSync, existsSync } from 'fs';

const BUILD_GRADLE = 'android/app/build.gradle';

if (existsSync(BUILD_GRADLE)) {
  let gradle = readFileSync(BUILD_GRADLE, 'utf8');
  
  // 增加 versionCode
  gradle = gradle.replace(
    /versionCode\s+(\d+)/,
    (match, code) => `versionCode ${parseInt(code) + 1}`
  );
  
  // 更新 versionName
  gradle = gradle.replace(
    /versionName\s+"([^"]+)"/,
    'versionName "1.0.0"'
  );
  
  writeFileSync(BUILD_GRADLE, gradle);
  console.log('✅ Android version updated');
} else {
  console.log('⚠️  build.gradle not found');
}
