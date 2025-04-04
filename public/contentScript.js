// Add console logs for debugging
console.log('LinkedIn Zen Zone content script loaded');

// Always enable focus mode
let focusModeEnabled = true;

// Function to apply focus mode
function applyFocusMode() {
  console.log('Applying focus mode automatically');
  document.body.classList.add('linkedin-zen-mode');
  
  // Make sure the indicator is shown
  if (indicator) {
    indicator.style.display = 'block';
  }
}

// Listen for messages from the popup (keeping for compatibility)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received in content script:', message);
  if (message.action === 'getState') {
    sendResponse({enabled: true});
  }
  return true;
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
indicator.style.display = 'block';

// Apply focus mode when the page loads or when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(indicator);
    applyFocusMode();
  });
} else {
  document.body.appendChild(indicator);
  applyFocusMode();
}

// Also apply focus mode when the body changes (for SPAs like LinkedIn)
const observer = new MutationObserver(() => {
  if (!document.body.classList.contains('linkedin-zen-mode')) {
    applyFocusMode();
  }
});

// Start observing the document body for DOM changes
observer.observe(document.body, { 
  childList: true,
  subtree: true
});
