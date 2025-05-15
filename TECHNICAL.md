# Technical Documentation for MitID & CPR Mask Extension

This document provides detailed technical information about how the MitID & CPR Mask Firefox extension works. It's intended for developers who want to understand, modify, or contribute to the codebase.

## Architecture Overview

The extension follows a simple architecture:

1. **Manifest Definition** - `manifest.json` defines extension metadata and content script injection
2. **Content Script Injection** - `content.js` is injected into all web pages
3. **DOM Observation** - The content script monitors the DOM for target input fields
4. **Field Modification** - When target fields are found, they're modified to be password fields

## File Details

### manifest.json

```json
{
  "manifest_version": 2,
  "name": "MitID & CPR Mask",
  "version": "1.0",
  "description": "Automatically masks MitID username and CPR number fields for privacy",
  "icons": {
    "48": "icons/mask-48.png",
    "96": "icons/mask-96.png"
  },
  "content_scripts": [
    {
      "matches": ["*://*/*"],
      "js": ["content.js"]
    }
  ],
  "browser_specific_settings": {
    "gecko": {
      "id": "mitidhide@example.com"
    }
  }
}
```

Key points:

- Uses manifest version 2 (compatible with Firefox)
- Injects the content script into all webpages (`*://*/*`)
- No special permissions are requested
- Includes browser-specific settings for Firefox

### content.js

The content script is structured as follows:

1. **Field Processing Function**:

   ```javascript
   function processFields() {
     // Find target fields
     const usernameFields = document.querySelectorAll(
       ".mitid-core-user__user-id"
     );
     const cprFields = document.querySelectorAll("#cpr-input, .cpr-input");

     const totalFields = usernameFields.length + cprFields.length;

     if (totalFields > 0) {
       // Convert fields to password type
       usernameFields.forEach((field) => {
         field.type = "password";
       });

       cprFields.forEach((field) => {
         field.type = "password";
       });

       // Show notification
       // ...
     }
   }
   ```

2. **Initial Processing**:

   ```javascript
   // Run when page loads
   processFields();
   ```

3. **DOM Observation Setup**:

   ```javascript
   const observer = new MutationObserver((mutations) => {
     // Check for relevant changes
     const shouldProcess = mutations.some((mutation) => {
       // ...
     });

     if (shouldProcess) {
       processFields();
     }
   });

   // Start observing
   observer.observe(document.documentElement, {
     childList: true,
     subtree: true,
   });
   ```

#### Selector Details

The extension targets specific elements:

- MitID username fields: `.mitid-core-user__user-id`
- CPR number fields: `#cpr-input, .cpr-input`

These selectors were determined by analyzing the DOM structure of MitID and CPR input forms.

#### MutationObserver Usage

The MutationObserver is configured to detect DOM changes that might introduce new input fields. It:

1. Watches the entire document (`document.documentElement`)
2. Monitors for child node additions (`childList: true`)
3. Includes all descendants (`subtree: true`)
4. Filters mutations to only process when relevant elements are added
5. Calls `processFields()` only when necessary

This approach minimizes performance impact while ensuring dynamic content is handled correctly.

## Field Detection Logic

The field detection logic follows these steps:

1. **Initial Check**: When the page loads, immediately scan for matching fields
2. **Continuous Monitoring**: Use MutationObserver to watch for dynamically added fields
3. **Selective Processing**: Process only mutations that potentially add relevant fields

The selective processing is particularly important for performance. The extension analyzes each mutation to determine:

```javascript
const shouldProcess = mutations.some((mutation) => {
  if (mutation.addedNodes.length) {
    return Array.from(mutation.addedNodes).some((node) => {
      return (
        node.nodeType === Node.ELEMENT_NODE &&
        (node.classList?.contains("mitid-core-user__user-id") ||
          node.id === "cpr-input" ||
          node.classList?.contains("cpr-input") ||
          node.querySelector?.(
            ".mitid-core-user__user-id, #cpr-input, .cpr-input"
          ))
      );
    });
  }
  return false;
});
```

This checks if:

- The mutation added any nodes
- Any of those nodes are either:
  - A target input field themselves
  - A container that contains target input fields

## Visual Notification

The extension briefly shows a notification when it activates:

```javascript
if (!document.getElementById("mitid-mask-banner")) {
  const banner = document.createElement("div");
  banner.id = "mitid-mask-banner";
  banner.style.cssText =
    "position: fixed; top: 0; right: 0; background: rgba(0,0,0,0.7); color: white; padding: 3px 6px; font-size: 10px; z-index: 9999;";
  banner.textContent = "Fields Masked";
  document.body.appendChild(banner);

  setTimeout(() => {
    banner.style.display = "none";
  }, 3000);
}
```

Key points:

- Uses a fixed position to ensure visibility
- Uses a high z-index (9999) to appear above other elements
- Automatically hides after 3 seconds
- Only creates one banner per page (checks for existing banner)

## Performance Considerations

The extension is designed to minimize performance impact:

1. **Selective Observation**: Only processes relevant mutations
2. **Minimal DOM Manipulation**: Only modifies targeted input fields
3. **Single-Pass Processing**: Processes each field only once
4. **No External Dependencies**: Uses only native browser APIs

## Browser Compatibility

The extension is designed for Firefox but uses standard web APIs:

- `document.querySelectorAll()` - Standard DOM method
- `MutationObserver` - Standard web API
- Input type modification - Standard DOM property

The extension should be compatible with all modern versions of Firefox.

## Extension Packaging

The extension is packaged using a simple npm script:

```json
"scripts": {
  "package": "zip -r mitid-cpr-mask.zip manifest.json content.js icons/ README.md"
}
```

This creates a ZIP file containing all necessary extension files.

## Icon Generation

The extension includes a helper script (`convert-icons.svg`) to convert SVG icons to PNG:

```bash
#!/bin/bash
# Convert SVG to PNG files
rsvg-convert -w 48 -h 48 icons/mask-48.png.svg -o icons/mask-48.png
rsvg-convert -w 96 -h 96 icons/mask-96.png.svg -o icons/mask-96.png
```

This requires the `librsvg` package, with a fallback to ImageMagick if available.

## Potential Improvements

Future versions could include:

1. **Options Page**: Allow users to customize which fields are masked
2. **Context Menu**: Enable/disable masking on specific sites
3. **Custom Selectors**: Allow users to define additional field selectors
4. **Site-Specific Configurations**: Optimize for specific websites
5. **Visual Indicator**: Add a permanent, subtle indicator when fields are masked

## Security Considerations

This extension only modifies the visual representation of input fields. It:

- Does not read or store the field values
- Does not transmit any data
- Does not modify the form submission process

## Debugging

To debug the extension:

1. Install it temporarily via `about:debugging`
2. Open the Browser Console (Ctrl+Shift+J)
3. Look for console logs from the content script
4. Use the Browser Toolbox to inspect the DOM and extension behavior
