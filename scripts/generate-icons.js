const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Ensure the icons directory exists
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create a simple SVG icon as base
const svgIcon = `
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#000"/>
  <text x="50%" y="50%" font-family="Arial" font-size="80" fill="white" text-anchor="middle" dy=".3em">BG3</text>
</svg>
`;

// Save the SVG as base icon
fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgIcon);

// Generate different sizes
const sizes = [16, 32, 64, 192, 512];

async function generateIcons() {
  for (const size of sizes) {
    await sharp(Buffer.from(svgIcon))
      .resize(size, size)
      .png()
      .toFile(path.join(iconsDir, `icon-${size}.png`));
    
    // Also save 16x16 and 32x32 to public root for favicon
    if (size === 16) {
      await sharp(Buffer.from(svgIcon))
        .resize(size, size)
        .png()
        .toFile(path.join(__dirname, '../public/favicon.png'));
    }
  }
}

generateIcons().catch(console.error);
