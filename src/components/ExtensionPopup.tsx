
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Linkedin } from "lucide-react";
import FocusToggle from './FocusToggle';

const ExtensionPopup: React.FC = () => {
  const [focusModeEnabled, setFocusModeEnabled] = useState(false);
  const [isLinkedIn, setIsLinkedIn] = useState(false);
  const [isExtensionEnvironment, setIsExtensionEnvironment] = useState(false);

  // Check if we're in a Chrome extension environment
  useEffect(() => {
    // Check if chrome.tabs is available (extension environment)
    if (typeof window !== 'undefined' && window.chrome && chrome.tabs) {
      setIsExtensionEnvironment(true);
      
      // Only run Chrome API code if we're in an extension environment
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentUrl = tabs[0]?.url || '';
        setIsLinkedIn(currentUrl.includes('linkedin.com'));
        
        // If we're on LinkedIn, get the current state
        if (currentUrl.includes('linkedin.com')) {
          chrome.tabs.sendMessage(
            tabs[0].id!,
            { action: 'getState' },
            (response) => {
              if (response) {
                setFocusModeEnabled(response.enabled);
              }
            }
          );
        }
        
        // Also check stored state
        chrome.storage.local.get(['focusModeEnabled'], (result) => {
          if (result.focusModeEnabled !== undefined) {
            setFocusModeEnabled(result.focusModeEnabled);
          }
        });
      });
    } else {
      // In development environment, simulate LinkedIn for UI testing
      console.log('Development environment detected, simulating LinkedIn');
      setIsLinkedIn(true);
    }
  }, []);

  const handleToggleFocusMode = (enabled: boolean) => {
    setFocusModeEnabled(enabled);
    
    // Only interact with Chrome APIs in extension environment
    if (isExtensionEnvironment && window.chrome) {
      // Save state
      chrome.storage.local.set({ focusModeEnabled: enabled });
      
      // Send message to content script
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id && isLinkedIn) {
          chrome.tabs.sendMessage(
            tabs[0].id,
            { action: 'toggleFocusMode', enabled },
            (response) => {
              console.log('Focus mode toggled:', response);
            }
          );
        }
      });
    } else {
      console.log('Focus mode toggled in development:', enabled);
    }
  };

  return (
    <Card className="w-[320px]">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          <Linkedin className="h-6 w-6 text-[#0A66C2]" />
          <CardTitle className="text-lg">LinkedIn Zen Zone</CardTitle>
        </div>
        <CardDescription>
          Remove distractions from LinkedIn
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLinkedIn ? (
          <FocusToggle 
            enabled={focusModeEnabled} 
            onChange={handleToggleFocusMode} 
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            {isExtensionEnvironment 
              ? "Navigate to LinkedIn to activate focus mode" 
              : "Development mode: Simulating LinkedIn environment"}
          </p>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4 text-xs text-muted-foreground">
        Focus on what matters - create content without distractions
      </CardFooter>
    </Card>
  );
};

export default ExtensionPopup;
