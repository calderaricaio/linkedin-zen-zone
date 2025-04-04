
// Add console logs for debugging
console.log('LinkedIn Zen Zone content script loaded');

let focusModeEnabled = false;

// Function to toggle focus mode
function toggleFocusMode(enabled) {
  console.log('Toggle focus mode called with enabled:', enabled);
  focusModeEnabled = enabled;
  
  if (enabled) {
    console.log('Adding linkedin-zen-mode class to body');
    document.body.classList.add('linkedin-zen-mode');
  } else {
    console.log('Removing linkedin-zen-mode class from body');
    document.body.classList.remove('linkedin-zen-mode');
  }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received in content script:', message);
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
  console.log('Retrieved stored state:', result);
  if (result.focusModeEnabled !== undefined) {
    toggleFocusMode(result.focusModeEnabled);
  }
});

// Add a small indicator that the extension is active
const indicator = document.createElement('div');
indicator.style.position = 'fixed';
indicator.style.bottom = '10px';
indicator.style.right = '10px';
indicator.style.backgroundColor = 'rgba(10, 102, 194, 0.8)';
indicator.style.color = 'white';
indicator.style.padding = '5px 10px';
indicator.style.borderRadius = '5px';
indicator.style.zIndex = '9999';
indicator.style.fontSize = '12px';
indicator.textContent = 'LinkedIn Zen Zone Active';
indicator.style.display = 'none';

document.body.appendChild(indicator);

// Update the toggle function to also show/hide the indicator
const originalToggle = toggleFocusMode;
toggleFocusMode = function(enabled) {
  originalToggle(enabled);
  indicator.style.display = enabled ? 'block' : 'none';
};
