
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Settings as SettingsIcon, Save, Undo2 } from "lucide-react";

// Settings interface
interface UserSettings {
  countdownDuration: number;
  minReflectionLength: number;
  enableNotifications: boolean;
  autosavingEnabled: boolean;
  autosavingPercentage: number;
  currency: string;
  theme: "system" | "light" | "dark";
}

// Default settings
const defaultSettings: UserSettings = {
  countdownDuration: 10,
  minReflectionLength: 10,
  enableNotifications: true,
  autosavingEnabled: false,
  autosavingPercentage: 10,
  currency: "USD",
  theme: "system",
};

// LocalStorage key
const SETTINGS_KEY = "impulselock-settings";

const Settings = () => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSaveSettings = () => {
    // Save settings to localStorage
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    setIsEditing(false);
    toast.success("Settings saved successfully");
  };

  const handleResetToDefaults = () => {
    setSettings(defaultSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
    toast.success("Settings reset to defaults");
  };

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <SettingsIcon className="mr-2" size={24} />
          Settings
        </h2>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button 
                onClick={handleSaveSettings} 
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Save className="mr-2" size={16} />
                Save Changes
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(true)}
              className="border-purple-300 text-purple-700"
            >
              Edit Settings
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Impulse Vault Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="countdown">Countdown Duration (seconds)</Label>
              <Input
                id="countdown"
                type="number"
                min="5"
                max="60"
                value={settings.countdownDuration}
                onChange={(e) => updateSetting("countdownDuration", parseInt(e.target.value))}
                disabled={!isEditing}
              />
              <p className="text-xs text-gray-500">
                How long to wait before allowing a purchase (5-60 seconds)
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reflection">Minimum Reflection Length</Label>
              <Input
                id="reflection"
                type="number"
                min="0"
                max="100"
                value={settings.minReflectionLength}
                onChange={(e) => updateSetting("minReflectionLength", parseInt(e.target.value))}
                disabled={!isEditing}
              />
              <p className="text-xs text-gray-500">
                Minimum characters required in the reflection field
              </p>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Notifications & Alerts</h3>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications" className="text-base">Enable Notifications</Label>
                <p className="text-sm text-gray-500">
                  Receive reminders and insights about your spending
                </p>
              </div>
              <Switch
                id="notifications"
                checked={settings.enableNotifications}
                onCheckedChange={(checked) => updateSetting("enableNotifications", checked)}
                disabled={!isEditing}
              />
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Auto-Saving</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-saving" className="text-base">Enable Auto-Saving</Label>
                  <p className="text-sm text-gray-500">
                    Automatically redirect a percentage of avoided purchases to savings
                  </p>
                </div>
                <Switch
                  id="auto-saving"
                  checked={settings.autosavingEnabled}
                  onCheckedChange={(checked) => updateSetting("autosavingEnabled", checked)}
                  disabled={!isEditing}
                />
              </div>
              
              {settings.autosavingEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="auto-saving-percentage">Auto-Saving Percentage</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="auto-saving-percentage"
                      type="number"
                      min="1"
                      max="100"
                      value={settings.autosavingPercentage}
                      onChange={(e) => updateSetting("autosavingPercentage", parseInt(e.target.value))}
                      disabled={!isEditing}
                    />
                    <span>%</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Percentage of each avoided purchase to put into savings
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Display Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select 
                  value={settings.currency}
                  onValueChange={(value) => updateSetting("currency", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                    <SelectItem value="JPY">JPY (¥)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select 
                  value={settings.theme}
                  onValueChange={(value: "system" | "light" | "dark") => updateSetting("theme", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">System Default</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={handleResetToDefaults}
          disabled={!isEditing}
          className="flex items-center text-gray-500"
        >
          <Undo2 size={16} className="mr-2" />
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
};

export default Settings;
