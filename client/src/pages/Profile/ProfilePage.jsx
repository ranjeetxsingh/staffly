import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Input,
  Avatar,
  Tabs,
  Switch,
  Textarea,
} from '../../components/UI';
import { useAuth } from '../../Hooks/useAuth';
import { useToast } from '../../Hooks/useToast';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    department: '',
    position: '',
    address: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true,
    darkMode: false,
  });

  const { user, updateProfile, changePassword } = useAuth();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        department: user.department || '',
        position: user.position || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(profileData);
      showSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      showError('Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('New passwords do not match');
      return;
    }
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      showSuccess('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      showError('Failed to change password');
    }
  };

  const handleSaveSettings = () => {
    // Save settings logic
    showSuccess('Settings saved successfully!');
  };

  const tabsData = [
    {
      label: 'Profile',
      icon: '👤',
      content: (
        <div className="space-y-6">
          {/* Profile Header */}
          <Card variant="elevated">
            <div className="flex items-start gap-6">
              <Avatar
                name={profileData.name}
                size="2xl"
                status="online"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {profileData.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">{profileData.position}</p>
                  </div>
                  <Button
                    variant={isEditing ? 'success' : 'primary'}
                    onClick={() => {
                      if (isEditing) {
                        handleUpdateProfile();
                      } else {
                        setIsEditing(true);
                      }
                    }}
                  >
                    {isEditing ? '💾 Save' : '✏️ Edit Profile'}
                  </Button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {profileData.bio || 'No bio available'}
                </p>
              </div>
            </div>
          </Card>

          {/* Profile Details */}
          <Card title="Personal Information" variant="elevated">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                disabled={!isEditing}
              />
              <Input
                label="Email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                disabled={!isEditing}
              />
              <Input
                label="Phone"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                disabled={!isEditing}
              />
              <Input
                label="Department"
                value={profileData.department}
                onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                disabled={!isEditing}
              />
              <Input
                label="Position"
                value={profileData.position}
                onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                disabled={!isEditing}
              />
              <Input
                label="Address"
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                disabled={!isEditing}
              />
              <div className="md:col-span-2">
                <Textarea
                  label="Bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                  maxLength={200}
                  showCount
                />
              </div>
            </div>
            {isEditing && (
              <div className="mt-4 flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    // Reset form
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </Card>
        </div>
      ),
    },
    {
      label: 'Security',
      icon: '🔒',
      content: (
        <Card title="Change Password" variant="elevated">
          <div className="space-y-4 max-w-md">
            <Input
              label="Current Password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              placeholder="Enter current password"
            />
            <Input
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              placeholder="Enter new password"
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              placeholder="Confirm new password"
            />
            <Button
              variant="primary"
              onClick={handleChangePassword}
              className="w-full"
            >
              Change Password
            </Button>
          </div>
        </Card>
      ),
    },
    {
      label: 'Settings',
      icon: '⚙️',
      content: (
        <Card title="Preferences" variant="elevated">
          <div className="space-y-4 max-w-md">
            <Switch
              label="Email Notifications"
              checked={settings.emailNotifications}
              onChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
            />
            <Switch
              label="Push Notifications"
              checked={settings.pushNotifications}
              onChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
            />
            <Switch
              label="Weekly Report"
              checked={settings.weeklyReport}
              onChange={(checked) => setSettings({ ...settings, weeklyReport: checked })}
            />
            <Switch
              label="Dark Mode"
              checked={settings.darkMode}
              onChange={(checked) => {
                setSettings({ ...settings, darkMode: checked });
                document.documentElement.classList.toggle('dark');
              }}
            />
            <Button
              variant="primary"
              onClick={handleSaveSettings}
              className="w-full mt-6"
            >
              Save Settings
            </Button>
          </div>
        </Card>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabsData} variant="pills" />
    </div>
  );
};

export default ProfilePage;
