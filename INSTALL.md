# Installation Guide for MitID & CPR Mask Extension

This guide will help you install and test the MitID & CPR Mask Firefox extension.

## Quick Installation (Development Mode)

1. **Prepare the extension**:

   - Make sure you have all the extension files in a folder
   - Run the icon conversion script: `./convert-icons.sh`
   - If you get permission errors, run: `chmod +x convert-icons.sh` first

2. **Install in Firefox**:

   - Open Firefox
   - Type `about:debugging` in the address bar and press Enter
   - Click on "This Firefox" in the left sidebar
   - Click on "Load Temporary Add-on..."
   - Navigate to your extension folder and select the `manifest.json` file
   - The extension is now installed temporarily (until Firefox is closed)

3. **Test the extension**:
   - Open the included `test.html` file in Firefox
   - Notice how the username and CPR fields are automatically converted to password fields
   - Try typing in these fields - your input should appear as dots (•••••)

## Permanent Installation

To install the extension permanently, you need to submit it to the Firefox Add-ons store:

1. **Package the extension**:

   - Make sure you have Node.js installed
   - Run: `npm run package`
   - This will create a file called `mitid-cpr-mask.zip`

2. **Submit to Firefox Add-ons**:

   - Go to https://addons.mozilla.org/developers/
   - Create an account if you don't have one
   - Click "Submit a New Add-on"
   - Follow the submission process
   - Wait for Mozilla review (usually takes a few days)

3. **After approval**:
   - Once approved, your extension will be available in the Firefox Add-ons store
   - Users can install it directly from there

## Troubleshooting

### Icon Conversion Issues

If you have issues with the icon conversion script:

1. **Using librsvg**:

   - On macOS: `brew install librsvg`
   - On Ubuntu/Debian: `sudo apt-get install librsvg2-bin`
   - Then run: `./convert-icons.sh`

2. **Using ImageMagick**:

   - On macOS: `brew install imagemagick`
   - On Ubuntu/Debian: `sudo apt-get install imagemagick`
   - The script will automatically try ImageMagick if librsvg fails

3. **Manual conversion**:
   - If both methods fail, you can use an online SVG to PNG converter
   - Create 48x48 and 96x96 PNG files and place them in the `/icons` folder

### Extension Not Working

If the extension is not masking fields:

1. **Check installation**:

   - Go to `about:addons` in Firefox
   - Ensure the extension is listed and enabled

2. **Check browser console**:

   - Press F12 to open Developer Tools
   - Go to the Console tab
   - Look for any error messages

3. **Test with sample page**:
   - Open the included `test.html` file
   - If it works there but not on real sites, the selectors might need updating

## Usage Notes

- The extension activates automatically when it detects MitID or CPR fields
- A small notification appears briefly when fields are masked
- The extension works on dynamically loaded content (like forms that appear after page load)
- Your data never leaves your browser - this is purely a visual modification
