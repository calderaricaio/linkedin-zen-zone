// Add console logs for debugging
console.log('LinkedIn Focus Mode content script loaded');

// Initialize focus mode (start enabled)
let focusModeEnabled = true;

// Store focus mode state in Chrome storage
function saveFocusModeState(enabled) {
  console.log('Saving focus mode state:', enabled);
  if (chrome.storage) {
    chrome.storage.sync.set({ focusModeEnabled: enabled });
  }
}

// Load focus mode state from Chrome storage
function loadFocusModeState(callback) {
  console.log('Loading focus mode state');
  if (chrome.storage) {
    chrome.storage.sync.get('focusModeEnabled', (result) => {
      // Default to true if no saved state
      const enabled = result.focusModeEnabled !== undefined ? result.focusModeEnabled : true;
      console.log('Loaded focus mode state:', enabled);
      callback(enabled);
    });
  } else {
    // Default to true in development or if storage is not available
    callback(true);
  }
}

// Inspirational quotes related to focus and productivity
const quotes = [
  "Focus on being productive instead of busy. — Tim Ferriss",
  "The successful warrior is the average person, with laser-like focus. — Bruce Lee",
  "Concentrate all your thoughts upon the work in hand. — Alexander Graham Bell",
  "Do one thing at a time, and while doing it put your whole soul into it. — Bertie Charles Forbes",
  "Lack of direction, not lack of time, is the problem. We all have twenty-four hour days. — Zig Ziglar",
  "It's not always that we need to do more but rather that we need to focus on less. — Nathan W. Morris",
  "Concentrate on what matters most. — Brian Tracy",
  "Don't get distracted. Never tell yourself that you need to be the biggest brand in the whole world. — Richard Branson",
  "Where focus goes, energy flows. — Tony Robbins",
  "Simplicity is the ultimate sophistication. — Leonardo da Vinci"
];

// Function to apply focus mode
function applyFocusMode(enabled) {
  console.log('Applying focus mode, enabled:', enabled);
  
  if (enabled) {
    document.body.classList.add('linkedin-zen-mode');
  } else {
    document.body.classList.remove('linkedin-zen-mode');
  }
  
  // Update toggle appearance
  if (toggleContainer) {
    toggleContainer.className = enabled 
      ? 'linkedin-focus-toggle active' 
      : 'linkedin-focus-toggle';
    toggleText.textContent = enabled ? 'Focus Mode: On' : 'Focus Mode: Off';
  }
  
  // Show or hide the quote
  updateQuote(enabled);
}

// Function to add inspirational quote
function createQuoteBanner() {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  const quoteDiv = document.createElement('div');
  quoteDiv.className = 'linkedin-focus-quote';
  quoteDiv.textContent = quote;
  quoteDiv.style.display = focusModeEnabled ? 'block' : 'none';
  
  // Try to insert after the share box
  const insertAfterElement = document.querySelector('.share-box-feed-entry');
  if (insertAfterElement && insertAfterElement.parentNode) {
    insertAfterElement.parentNode.insertBefore(quoteDiv, insertAfterElement.nextSibling);
  } else {
    // Fallback: try to insert at the beginning of the main content
    const mainContent = document.querySelector('.scaffold-layout__main');
    if (mainContent) {
      mainContent.prepend(quoteDiv);
    }
  }
  
  return quoteDiv;
}

// Function to update quote visibility
function updateQuote(enabled) {
  const existingQuote = document.querySelector('.linkedin-focus-quote');
  
  if (existingQuote) {
    existingQuote.style.display = enabled ? 'block' : 'none';
  } else if (enabled) {
    // If enabled but no quote exists, create one
    setTimeout(createQuoteBanner, 1000); // Delay to make sure the DOM is ready
  }
}

// Create toggle switch in the bottom right
let toggleContainer, toggleText;

function createToggleSwitch() {
  toggleContainer = document.createElement('div');
  toggleContainer.className = focusModeEnabled ? 'linkedin-focus-toggle active' : 'linkedin-focus-toggle';
  
  toggleText = document.createElement('span');
  toggleText.className = 'linkedin-focus-toggle-text';
  toggleText.textContent = focusModeEnabled ? 'Focus Mode: On' : 'Focus Mode: Off';
  
  const toggleSwitch = document.createElement('label');
  toggleSwitch.className = 'linkedin-focus-toggle-switch';
  
  const toggleSlider = document.createElement('span');
  toggleSlider.className = 'linkedin-focus-toggle-slider';
  
  toggleSwitch.appendChild(toggleSlider);
  toggleContainer.appendChild(toggleText);
  toggleContainer.appendChild(toggleSwitch);
  
  // Add click event
  toggleContainer.addEventListener('click', () => {
    focusModeEnabled = !focusModeEnabled;
    applyFocusMode(focusModeEnabled);
    saveFocusModeState(focusModeEnabled);
  });
  
  document.body.appendChild(toggleContainer);
}

// Listen for messages from the popup (keeping for compatibility)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received in content script:', message);
  if (message.action === 'getState') {
    sendResponse({enabled: focusModeEnabled});
  } else if (message.action === 'toggleFocus') {
    focusModeEnabled = message.enabled;
    applyFocusMode(focusModeEnabled);
    saveFocusModeState(focusModeEnabled);
    sendResponse({success: true});
  }
  return true;
});

// Initialize everything when the DOM is ready
function initializeExtension() {
  loadFocusModeState((enabled) => {
    focusModeEnabled = enabled;
    
    // Apply focus mode with the loaded state
    applyFocusMode(focusModeEnabled);
    
    // Create UI elements
    createToggleSwitch();
    setTimeout(createQuoteBanner, 1000);
  });
}

// Apply focus mode when the page loads or when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeExtension);
} else {
  initializeExtension();
}

// Create a MutationObserver to handle LinkedIn's SPA behavior
const observer = new MutationObserver((mutations) => {
  // Check if we're on LinkedIn
  if (window.location.hostname.includes('linkedin.com')) {
    // Reapply focus mode if needed
    if (focusModeEnabled && !document.body.classList.contains('linkedin-zen-mode')) {
      applyFocusMode(focusModeEnabled);
    }
    
    // Check if our quote is still there, if not and focus mode is on, add it
    if (focusModeEnabled && !document.querySelector('.linkedin-focus-quote')) {
      createQuoteBanner();
    }
    
    // Ensure toggle is present
    if (!document.querySelector('.linkedin-focus-toggle')) {
      createToggleSwitch();
    }
  }
});

// Start observing the document body for DOM changes
observer.observe(document.body, { 
  childList: true,
  subtree: true
});
