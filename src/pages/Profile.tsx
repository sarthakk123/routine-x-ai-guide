
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Bell, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Profile = () => {
  const { user } = useAuth();
  
  // Account state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  
  // Notification preferences state
  const [dailyReminders, setDailyReminders] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [achievementAlerts, setAchievementAlerts] = useState(true);
  
  // Privacy settings state
  const [publicProfile, setPublicProfile] = useState(false);
  const [dataAnalytics, setDataAnalytics] = useState(true);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (user) {
      // Set email from the authenticated user
      setEmail(user.email || '');
      
      // Try to fetch user profile data if available
      const fetchUserProfile = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (error && error.code !== 'PGRST116') {
            // PGRST116 is "No rows returned" which is fine for new users
            console.error('Error fetching profile:', error);
            throw error;
          }
          
          if (data) {
            // If profile exists, set the state values
            setName(data.name || '');
            setUsername(data.username || '');
            setDailyReminders(data.daily_reminders ?? true);
            setWeeklyReports(data.weekly_reports ?? true);
            setAchievementAlerts(data.achievement_alerts ?? true);
            setPublicProfile(data.public_profile ?? false);
            setDataAnalytics(data.data_analytics ?? true);
          }
        } catch (error) {
          toast.error('Failed to load profile data');
        }
      };
      
      fetchUserProfile();
    }
  }, [user]);
  
  const handleAccountSave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Check if a profile record exists
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      
      if (data) {
        // Update existing profile
        const { error } = await supabase
          .from('profiles')
          .update({
            name,
            username
          })
          .eq('id', user.id);
        
        if (error) throw error;
      } else {
        // Insert new profile
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            name,
            username
          });
        
        if (error) throw error;
      }
      
      // Update email if changed (this is a separate auth operation)
      if (user.email !== email) {
        const { error } = await supabase.auth.updateUser({
          email
        });
        
        if (error) throw error;
      }
      
      toast.success('Account information saved successfully');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save account information');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNotificationSave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Check if a profile record exists
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      
      if (data) {
        // Update existing profile
        const { error } = await supabase
          .from('profiles')
          .update({
            daily_reminders: dailyReminders,
            weekly_reports: weeklyReports,
            achievement_alerts: achievementAlerts
          })
          .eq('id', user.id);
        
        if (error) throw error;
      } else {
        // Insert new profile
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            daily_reminders: dailyReminders,
            weekly_reports: weeklyReports,
            achievement_alerts: achievementAlerts
          });
        
        if (error) throw error;
      }
      
      toast.success('Notification preferences saved successfully');
    } catch (error: any) {
      console.error('Error saving notification preferences:', error);
      toast.error('Failed to save notification preferences');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePrivacySave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Check if a profile record exists
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      
      if (data) {
        // Update existing profile
        const { error } = await supabase
          .from('profiles')
          .update({
            public_profile: publicProfile,
            data_analytics: dataAnalytics
          })
          .eq('id', user.id);
        
        if (error) throw error;
      } else {
        // Insert new profile
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            public_profile: publicProfile,
            data_analytics: dataAnalytics
          });
        
        if (error) throw error;
      }
      
      toast.success('Privacy settings saved successfully');
    } catch (error: any) {
      console.error('Error saving privacy settings:', error);
      toast.error('Failed to save privacy settings');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDataExport = () => {
    toast.info('Data export requested. You will receive an email with your data shortly.');
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-routinex-card">
          <TabsTrigger value="account" className="data-[state=active]:bg-routinex-action">
            <User className="mr-2 h-4 w-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-routinex-action">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="data-[state=active]:bg-routinex-action">
            <Shield className="mr-2 h-4 w-4" />
            Privacy
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <Card className="bg-routinex-card border-routinex-card">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Update your account details and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="bg-routinex-bg" 
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="bg-routinex-bg" 
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  className="bg-routinex-bg" 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="bg-routinex-action hover:bg-routinex-action/90"
                onClick={handleAccountSave}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card className="bg-routinex-card border-routinex-card">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you want to receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Daily Reminders</p>
                  <p className="text-sm text-muted-foreground">Receive daily reminders about your habits.</p>
                </div>
                <div className="ml-auto">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={dailyReminders} 
                      onChange={(e) => setDailyReminders(e.target.checked)} 
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-routinex-bg peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-routinex-action"></div>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekly Progress Reports</p>
                  <p className="text-sm text-muted-foreground">Get weekly summaries of your habit progress.</p>
                </div>
                <div className="ml-auto">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={weeklyReports} 
                      onChange={(e) => setWeeklyReports(e.target.checked)} 
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-routinex-bg peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-routinex-action"></div>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Achievement Alerts</p>
                  <p className="text-sm text-muted-foreground">Notifications when you reach milestones.</p>
                </div>
                <div className="ml-auto">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={achievementAlerts} 
                      onChange={(e) => setAchievementAlerts(e.target.checked)} 
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-routinex-bg peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-routinex-action"></div>
                  </label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="bg-routinex-action hover:bg-routinex-action/90"
                onClick={handleNotificationSave}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Preferences'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy">
          <Card className="bg-routinex-card border-routinex-card">
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Manage your privacy and data settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Public Profile</p>
                  <p className="text-sm text-muted-foreground">Allow others to see your profile and progress.</p>
                </div>
                <div className="ml-auto">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={publicProfile} 
                      onChange={(e) => setPublicProfile(e.target.checked)} 
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-routinex-bg peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-routinex-action"></div>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Data Analytics</p>
                  <p className="text-sm text-muted-foreground">Allow anonymous data collection for improving the app.</p>
                </div>
                <div className="ml-auto">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={dataAnalytics} 
                      onChange={(e) => setDataAnalytics(e.target.checked)} 
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-routinex-bg peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-routinex-action"></div>
                  </label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                className="bg-routinex-bg hover:bg-routinex-bg/90"
                onClick={handleDataExport}
              >
                Export My Data
              </Button>
              <Button 
                className="bg-routinex-action hover:bg-routinex-action/90"
                onClick={handlePrivacySave}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Settings'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
