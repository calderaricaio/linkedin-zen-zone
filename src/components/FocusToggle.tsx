
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface FocusToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

const FocusToggle: React.FC<FocusToggleProps> = ({ enabled, onChange }) => {
  return (
    <div className="flex items-center space-x-2 py-4">
      <Switch
        id="focus-mode"
        checked={enabled}
        onCheckedChange={onChange}
      />
      <Label htmlFor="focus-mode" className="text-sm font-medium">
        {enabled ? 'Focus Mode Active' : 'Activate Focus Mode'}
      </Label>
    </div>
  );
};

export default FocusToggle;
