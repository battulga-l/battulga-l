const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputSvg = path.join(__dirname, '..', 'public', 'logo.svg');
const outputDir = path.join(__dirname, '..', 'public', 'icons');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
  console.log('Generating PWA icons...\n');
  
  for (const size of sizes) {
    const outputFile = path.join(outputDir, `icon-${size}x${size}.png`);
    
    try {
      await sharp(inputSvg)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 59, g: 130, b: 246, alpha: 1 } // #3b82f6
        })
        .png()
        .toFile(outputFile);
      
      console.log(`✓ Generated icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`✗ Failed to generate icon-${size}x${size}.png:`, error.message);
    }
  }
  
  // Generate apple-touch-icon (180x180 for iOS)
  try {
    const appleTouchIcon = path.join(__dirname, '..', 'public', 'apple-touch-icon.png');
    await sharp(inputSvg)
      .resize(180, 180, {
        fit: 'contain',
        background: { r: 59, g: 130, b: 246, alpha: 1 }
      })
      .png()
      .toFile(appleTouchIcon);
    console.log('✓ Generated apple-touch-icon.png');
  } catch (error) {
    console.error('✗ Failed to generate apple-touch-icon.png:', error.message);
  }
  
  // Generate favicon
  try {
    const favicon = path.join(__dirname, '..', 'public', 'favicon.ico');
    await sharp(inputSvg)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 59, g: 130, b: 246, alpha: 1 }
      })
      .toFormat('png')
      .toFile(favicon.replace('.ico', '-32x32.png'));
    console.log('✓ Generated favicon-32x32.png');
  } catch (error) {
    console.error('✗ Failed to generate favicon:', error.message);
  }
  
  console.log('\n✅ All icons generated successfully!');
  console.log(`📁 Icons saved to: ${outputDir}`);
}

generateIcons().catch(console.error);
