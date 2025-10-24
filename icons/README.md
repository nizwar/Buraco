# PWA Icons - Placeholder Notice

The icon files need to be generated for the PWA to work properly. 

## Quick Setup:

1. **Option 1: Use the icon generator**
   - Open `icon-generator.html` in your browser
   - Click "Generate Icons" 
   - Save all downloaded files to the `icons/` folder

2. **Option 2: Manual creation**
   - Create PNG files with these exact names:
   - icon-72x72.png
   - icon-96x96.png  
   - icon-128x128.png
   - icon-144x144.png
   - icon-152x152.png
   - icon-192x192.png
   - icon-384x384.png
   - icon-512x512.png

3. **Option 3: Use ImageMagick (if installed)**
   - Run: `./generate-icons.sh`

## For Development:
The PWA will work without icons, but browsers may show a generic icon instead.

## Recommended Icon Content:
- Background: Dark green (#1a4d2e)
- Card element with gold border (#ffd700)
- Spade symbol or "B" text
- "BURACO" text at bottom