
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Linkedin, CheckCircle, ToggleLeft, ToggleRight } from "lucide-react";

const ExtensionPopup: React.FC = () => {
  const [isLinkedIn, setIsLinkedIn] = useState(false);
  const [isExtensionEnvironment, setIsExtensionEnvironment] = useState(false);
  const [isFocusModeEnabled, setIsFocusModeEnabled] = useState(true);

  // Check if we're in a Chrome extension environment
  useEffect(() => {
    console.log("ExtensionPopup mounted, checking environment");
    
    // Check if chrome.tabs is available (extension environment)
    if (typeof window !== 'undefined' && window.chrome && chrome.tabs) {
      console.log("Chrome extension environment detected");
      setIsExtensionEnvironment(true);
      
      // Load saved state
      if (chrome.storage) {
        chrome.storage.sync.get('focusModeEnabled', (result) => {
          const enabled = result.focusModeEnabled !== undefined ? result.focusModeEnabled : true;
          setIsFocusModeEnabled(enabled);
        });
      }
      
      // Only run Chrome API code if we're in an extension environment
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentUrl = tabs[0]?.url || '';
        console.log("Current URL:", currentUrl);
        
        const isOnLinkedIn = currentUrl.includes('linkedin.com');
        setIsLinkedIn(isOnLinkedIn);
        
        // Get current state from the active tab
        if (isOnLinkedIn && chrome.tabs.sendMessage) {
          chrome.tabs.sendMessage(tabs[0].id as number, { action: 'getState' }, (response) => {
            if (response && response.enabled !== undefined) {
              setIsFocusModeEnabled(response.enabled);
            }
          });
        }
      });
    } else {
      // In development environment, simulate LinkedIn for UI testing
      console.log('Development environment detected, simulating LinkedIn');
      setIsLinkedIn(true);
    }
  }, []);

  // Toggle focus mode
  const toggleFocusMode = () => {
    const newState = !isFocusModeEnabled;
    setIsFocusModeEnabled(newState);
    
    // Save to storage
    if (isExtensionEnvironment && chrome.storage) {
      chrome.storage.sync.set({ focusModeEnabled: newState });
    }
    
    // Send message to content script
    if (isExtensionEnvironment && isLinkedIn && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(
          tabs[0].id as number, 
          { action: 'toggleFocus', enabled: newState }
        );
      });
    }
  };

  return (
    <Card className="w-[320px]">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          <Linkedin className="h-6 w-6 text-[#0A66C2]" />
          <CardTitle className="text-lg">LinkedIn Focus Mode</CardTitle>
        </div>
        <CardDescription>
          Distraction-free LinkedIn experience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between py-2">
          <p className="text-sm font-medium">Focus Mode</p>
          <button 
            onClick={toggleFocusMode}
            className="flex items-center text-[#0A66C2]"
          >
            {isFocusModeEnabled ? (
              <><ToggleRight className="h-6 w-6 mr-1" /> On</>
            ) : (
              <><ToggleLeft className="h-6 w-6 mr-1" /> Off</>
            )}
          </button>
        </div>
        
        {isLinkedIn ? (
          <p className="text-sm text-muted-foreground mt-2">
            {isFocusModeEnabled 
              ? "Distractions hidden. Stay focused on creating content." 
              : "Turn on Focus Mode to hide distractions and improve focus."}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground mt-2">
            {isExtensionEnvironment 
              ? "Navigate to LinkedIn to experience distraction-free browsing" 
              : "Development mode: Simulating LinkedIn environment"}
          </p>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4 text-xs text-muted-foreground">
        <div className="w-full text-center">
          Stay focused, create better content
        </div>
      </CardFooter>
    </Card>
  );
};

export default ExtensionPopup;
