/**
 * MitID Mask Username & CPR - Firefox Extension
 * Converts MitID username and CPR number fields to password fields to hide sensitive information
 */

// Function to process and convert fields to password type
function processFields() {
  // Look for username input fields with class "mitid-core-user__user-id"
  const usernameFields = document.querySelectorAll(".mitid-core-user__user-id");

  // Look for CPR input fields with id "cpr-input" or class "cpr-input"
  const cprFields = document.querySelectorAll("#cpr-input, .cpr-input");

  const totalFields = usernameFields.length + cprFields.length;

  if (totalFields > 0) {
    console.log(
      `MitID/CPR Mask: Found ${totalFields} fields to mask (${usernameFields.length} username, ${cprFields.length} CPR)`
    );

    // Convert each username field to a password field
    usernameFields.forEach((field) => {
      // Change the type to password
      field.type = "password";
    });

    // Convert each CPR field to a password field
    cprFields.forEach((field) => {
      // Change the type to password
      field.type = "password";
    });

    // Add a small banner to show the extension is active
    if (!document.getElementById("mitid-mask-banner")) {
      const banner = document.createElement("div");
      banner.id = "mitid-mask-banner";
      banner.style.cssText =
        "position: fixed; top: 0; right: 0; background: rgba(0,0,0,0.7); color: white; padding: 3px 6px; font-size: 10px; z-index: 9999;";
      banner.textContent = "Fields Masked";
      document.body.appendChild(banner);

      // Auto-hide the banner after 3 seconds
      setTimeout(() => {
        banner.style.display = "none";
      }, 3000);
    }
  }
}

// Run when page loads
processFields();

// Watch for changes in the DOM to handle dynamic content loading
const observer = new MutationObserver((mutations) => {
  // Check if any of the mutations added nodes that contain our target elements
  const shouldProcess = mutations.some((mutation) => {
    if (mutation.addedNodes.length) {
      return Array.from(mutation.addedNodes).some((node) => {
        // Check if node is an element and contains our target elements
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

  if (shouldProcess) {
    processFields();
  }
});

// Start observing the document
observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});
