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

if (existsSync(androidDir)) {
  console.log('\n📱 Generating Android icons...\n');
  
  for (const [folder, size] of Object.entries(androidSizes)) {
    const dir = `${androidDir}/${folder}`;
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    
    const outputPath = `${dir}/ic_launcher.png`;
    await sharp(inputLogo)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(outputPath);
    
    console.log(`✅ Generated ${outputPath}`);
  }
}

console.log('\n✨ All icons generated successfully!');
