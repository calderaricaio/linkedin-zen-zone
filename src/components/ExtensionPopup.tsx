
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Linkedin } from "lucide-react";
import FocusToggle from './FocusToggle';
import { toast } from "@/hooks/use-toast";

const ExtensionPopup: React.FC = () => {
  const [focusModeEnabled, setFocusModeEnabled] = useState(false);
  const [isLinkedIn, setIsLinkedIn] = useState(false);
  const [isExtensionEnvironment, setIsExtensionEnvironment] = useState(false);

  // Check if we're in a Chrome extension environment
  useEffect(() => {
    console.log("ExtensionPopup mounted, checking environment");
    
    // Check if chrome.tabs is available (extension environment)
    if (typeof window !== 'undefined' && window.chrome && chrome.tabs) {
      console.log("Chrome extension environment detected");
      setIsExtensionEnvironment(true);
      
      // Only run Chrome API code if we're in an extension environment
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentUrl = tabs[0]?.url || '';
        console.log("Current URL:", currentUrl);
        
        const isOnLinkedIn = currentUrl.includes('linkedin.com');
        setIsLinkedIn(isOnLinkedIn);
        
        // If we're on LinkedIn, get the current state
        if (isOnLinkedIn) {
          console.log("On LinkedIn, getting state");
          chrome.tabs.sendMessage(
            tabs[0].id!,
            { action: 'getState' },
            (response) => {
              console.log("Got state response:", response);
              if (response) {
                setFocusModeEnabled(response.enabled);
              } else {
                console.log("No response or error:", chrome.runtime.lastError);
              }
            }
          );
        } else {
          console.log("Not on LinkedIn");
        }
        
        // Also check stored state
        chrome.storage.local.get(['focusModeEnabled'], (result) => {
          console.log("Retrieved stored state:", result);
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
    console.log("Toggle focus mode called with enabled:", enabled);
    setFocusModeEnabled(enabled);
    
    // Only interact with Chrome APIs in extension environment
    if (isExtensionEnvironment && window.chrome) {
      // Save state
      chrome.storage.local.set({ focusModeEnabled: enabled });
      
      // Send message to content script
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id && isLinkedIn) {
          console.log("Sending toggleFocusMode message to tab:", tabs[0].id);
          chrome.tabs.sendMessage(
            tabs[0].id,
            { action: 'toggleFocusMode', enabled },
            (response) => {
              console.log('Focus mode toggled response:', response);
              toast({
                title: enabled ? "Focus Mode Activated" : "Focus Mode Deactivated",
                description: enabled ? "Distractions have been removed" : "LinkedIn is back to normal"
              });
              if (!response && chrome.runtime.lastError) {
                console.error("Error:", chrome.runtime.lastError);
                toast({
                  title: "Error",
                  description: "Could not communicate with the LinkedIn page. Try refreshing LinkedIn.",
                  variant: "destructive"
                });
              }
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
          <>
            <FocusToggle 
              enabled={focusModeEnabled} 
              onChange={handleToggleFocusMode} 
            />
            <p className="text-xs text-muted-foreground mt-2">
              {focusModeEnabled 
                ? "Focus mode is active. LinkedIn's feed and distractions are hidden." 
                : "Enable focus mode to hide distractions and focus on content creation."}
            </p>
          </>
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
