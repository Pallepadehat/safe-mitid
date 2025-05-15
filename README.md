# MitID & CPR Mask

A Firefox extension that automatically converts MitID username and CPR number input fields to password fields, so others can't see your sensitive information when you're logging in.

## What This Extension Does

This extension has one simple purpose: **to protect your privacy when entering sensitive information** into MitID and CPR input forms. It achieves this by:

1. **Converting text fields to password fields** - All text in these fields will be shown as dots (•••••) instead of characters
2. **Working automatically** - No configuration needed, it activates as soon as a MitID or CPR form is detected
3. **Operating entirely on your device** - Your data never leaves your browser

### Specific Fields Protected:

- **MitID username fields** - Identified by the class `mitid-core-user__user-id`
- **CPR number fields** - Identified by the ID `cpr-input` or class `cpr-input`

## Installation

### Temporary Installation (For Testing)

1. Open Firefox and navigate to `about:debugging`
2. Click on "This Firefox" in the left sidebar
3. Click on "Load Temporary Add-on..."
4. Navigate to the folder containing this extension and select the `manifest.json` file
5. The extension will be installed temporarily until you close Firefox

### Permanent Installation

1. Zip the extension files using the command: `npm run package`
2. Submit the zip file to the Firefox Add-ons store: https://addons.mozilla.org/developers/
3. Once approved, it can be installed directly from the Firefox Add-ons store

## How It Works - Code Explanation

The extension consists of several key files:

### manifest.json

The manifest file defines basic extension properties and permissions:

```json
{
  "manifest_version": 2,
  "name": "MitID & CPR Mask",
  "version": "1.0",
  "description": "Automatically masks MitID username and CPR number fields for privacy",
  "content_scripts": [
    {
      "matches": ["*://*/*"],
      "js": ["content.js"]
    }
  ],
  "content_security_policy": "script-src 'self'; object-src 'self'"
}
```

This tells Firefox to inject our content script into all web pages and sets a strict Content Security Policy.

### content.js

This is the main script that performs the field masking:

1. **Field Detection**:
   ```javascript
   const usernameFields = document.querySelectorAll(
     ".mitid-core-user__user-id"
   );
   const cprFields = document.querySelectorAll("#cpr-input, .cpr-input");
   ```
2. **Field Conversion**:

   ```javascript
   usernameFields.forEach((field) => {
     field.type = "password";
   });

   cprFields.forEach((field) => {
     field.type = "password";
   });
   ```

3. **Live Monitoring**: Uses MutationObserver to detect dynamically loaded forms
   ```javascript
   observer.observe(document.documentElement, {
     childList: true,
     subtree: true,
   });
   ```

## Testing

A test page (`test.html`) is included to verify the extension works correctly:

1. Open `test.html` in Firefox after installing the extension
2. Note how the MitID username and CPR fields are automatically converted to password fields
3. Test entering information to ensure it appears as dots

## Security Features

- **Content Security Policy (CSP)**: The extension uses a strict CSP that prevents inline JavaScript and restricts script sources to only the extension itself. This helps protect against code injection attacks.
- **No Permissions**: The extension doesn't request any special permissions, minimizing its security footprint.
- **Local Processing**: All field masking happens locally in your browser.

## Privacy and Security Considerations

- This extension **only modifies the display** of input fields, not their functionality
- It **does not store or transmit** any data you enter
- The extension has **no network permissions** and cannot send data anywhere
- All processing happens **locally in your browser**

## Known Limitations

- The extension can only mask fields it can identify through CSS selectors
- It cannot protect against keyboard loggers or screen recording software
- Some forms may use unusual field types that aren't detected by our selectors

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
