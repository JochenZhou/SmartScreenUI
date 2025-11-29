import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';

const sizes = [192, 512];
const inputLogo = 'src/assets/logo.png';
const outputDir = 'public';

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

console.log('🎨 Generating app icons from logo.png...\n');

for (const size of sizes) {
  const outputPath = `${outputDir}/pwa-${size}x${size}.png`;
  
  await sharp(inputLogo)
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toFile(outputPath);
  
  console.log(`✅ Generated ${outputPath}`);
}

// Generate Android icons
const androidDir = 'android/app/src/main/res';
const androidSizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192
};

// Android 8.0+ 自适应图标前景尺寸 (需要比普通图标大，留出安全区域)
const foregroundSizes = {
  'mipmap-mdpi': 108,
  'mipmap-hdpi': 162,
  'mipmap-xhdpi': 216,
  'mipmap-xxhdpi': 324,
  'mipmap-xxxhdpi': 432
};

if (existsSync(androidDir)) {
  console.log('\n📱 Generating Android icons...\n');
  
  for (const [folder, size] of Object.entries(androidSizes)) {
    const dir = `${androidDir}/${folder}`;
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    
    // Regular icon
    const outputPath = `${dir}/ic_launcher.png`;
    await sharp(inputLogo)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(outputPath);
    
    // Round icon
    const roundPath = `${dir}/ic_launcher_round.png`;
    await sharp(inputLogo)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(roundPath);
    
    // Foreground icon for adaptive icons (Android 8.0+)
    const fgSize = foregroundSizes[folder];
    const foregroundPath = `${dir}/ic_launcher_foreground.png`;
    await sharp(inputLogo)
      .resize(Math.round(fgSize * 0.6), Math.round(fgSize * 0.6), {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .extend({
        top: Math.round(fgSize * 0.2),
        bottom: Math.round(fgSize * 0.2),
        left: Math.round(fgSize * 0.2),
        right: Math.round(fgSize * 0.2),
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(foregroundPath);
    
    console.log(`✅ Generated ${outputPath}, ${roundPath} and ${foregroundPath}`);
  }
}

console.log('\n✨ All icons generated successfully!');
