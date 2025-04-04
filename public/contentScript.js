
let focusModeEnabled = false;

// Function to toggle focus mode
function toggleFocusMode(enabled) {
  focusModeEnabled = enabled;
  
  if (enabled) {
    document.body.classList.add('linkedin-zen-mode');
  } else {
    document.body.classList.remove('linkedin-zen-mode');
  }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggleFocusMode') {
    toggleFocusMode(message.enabled);
    sendResponse({success: true, enabled: focusModeEnabled});
  } else if (message.action === 'getState') {
    sendResponse({enabled: focusModeEnabled});
  }
  return true;
});

// Check stored state when the content script loads
chrome.storage.local.get(['focusModeEnabled'], (result) => {
  if (result.focusModeEnabled !== undefined) {
    toggleFocusMode(result.focusModeEnabled);
  }
});
