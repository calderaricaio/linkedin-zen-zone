
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Linkedin, CheckCircle } from "lucide-react";

const ExtensionPopup: React.FC = () => {
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
      });
    } else {
      // In development environment, simulate LinkedIn for UI testing
      console.log('Development environment detected, simulating LinkedIn');
      setIsLinkedIn(true);
    }
  }, []);

  return (
    <Card className="w-[320px]">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          <Linkedin className="h-6 w-6 text-[#0A66C2]" />
          <CardTitle className="text-lg">LinkedIn Zen Zone</CardTitle>
        </div>
        <CardDescription>
          Distraction-free LinkedIn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 py-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <p className="text-sm font-medium">Focus Mode is Always Active</p>
        </div>
        
        {isLinkedIn ? (
          <p className="text-sm text-muted-foreground mt-2">
            LinkedIn's feed and distractions are hidden. Refresh LinkedIn if you don't see changes.
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
        Focus on what matters - create content without distractions
      </CardFooter>
    </Card>
  );
};

export default ExtensionPopup;
