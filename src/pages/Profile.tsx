import React, { useState, useEffect } from 'react';
import { Moon, Sun, User, Mail, Phone, Shield, Bell, LogOut, Save, Loader2, Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { env } from '../config/env';
import { useTheme } from '../contexts/ThemeContext';
import { useUser, getInitials } from '../contexts/UserContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';

export default function Profile() {
  const { isDark, toggleTheme } = useTheme();
  const { user, isLoading, updateUser, changePassword, logout: userLogout, refreshUser } = useUser();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Local form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    jobTitle: '',
    notificationsEnabled: true,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        jobTitle: user.jobTitle,
        notificationsEnabled: user.notificationsEnabled,
      });
    }
  }, [user]);



  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUser(formData);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setIsSaving(true);
    try {
      await changePassword({
        old_password: passwordForm.oldPassword,
        new_password: passwordForm.newPassword,
        confirm_password: passwordForm.newPassword,
      });
      setPasswordSuccess(true);
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setIsChangingPassword(false), 2000);
    } catch (error: any) {
      setPasswordError(error.message || 'Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    userLogout();
    navigate('/');
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-[#111113] transition-colors duration-500">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-zinc-900 dark:text-zinc-200 animate-spin" />
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        
        {/* Header / Cover Section */}
        <div className="relative mb-12">
          {/* Cover Photo */}
          <div className="h-40 sm:h-52 w-full rounded-3xl bg-[#F5F5F7] dark:bg-[#1a1a1f] overflow-hidden relative transition-colors duration-500 border border-black/5 dark:border-white/[0.05]">
            {/* Wave decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)' }}>
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-500/[0.05] dark:bg-indigo-500/[0.1] rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-500/[0.05] dark:bg-purple-500/[0.08] rounded-full blur-[100px]" />
              <div className="absolute top-10 left-[-10%] w-[300px] h-[300px] bg-blue-500/[0.03] dark:bg-blue-500/[0.05] rounded-full blur-[60px]" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-200/50 via-transparent to-transparent dark:from-[#111113]/80 dark:via-[#111113]/20 transition-opacity duration-500" />
          </div>

          {/* Avatar & Basic Info */}
          <div className="absolute -bottom-8 left-8 flex items-end gap-5">
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-[5px] border-white dark:border-[#09090B] overflow-hidden bg-zinc-900 dark:bg-zinc-200 transition-colors duration-500 shadow-md dark:shadow-none flex items-center justify-center">
                <span className="text-2xl sm:text-3xl font-bold text-white dark:text-black">{getInitials(user)}</span>
              </div>
            </div>
            <div className="pb-6 sm:pb-8">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-200 transition-colors duration-500">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium transition-colors duration-500">{user.jobTitle}</p>
            </div>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-24">
          
          {/* Left Column (Main Form) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Personal Information Card */}
            <div className="bg-white dark:bg-[#1a1a1f] border border-zinc-200/80 dark:border-white/[0.08] rounded-3xl p-6 sm:p-8 transition-all duration-500 shadow-sm">
              <div className="mb-8">
                <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-200 transition-colors duration-500">Personal Information</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 transition-colors duration-500">Update your photo and personal details here.</p>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1 transition-colors duration-500">First Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input 
                        type="text" 
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full pl-11 pr-4 py-2.5 bg-zinc-50 hover:bg-zinc-100/50 dark:bg-[#111113] dark:hover:bg-[#16161a] border border-black/5 dark:border-white/[0.08] shadow-sm dark:shadow-none rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-white/20 focus:border-zinc-300 transition-all duration-300 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1 transition-colors duration-500">Last Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input 
                        type="text" 
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full pl-11 pr-4 py-2.5 bg-zinc-50 hover:bg-zinc-100/50 dark:bg-[#111113] dark:hover:bg-[#16161a] border border-black/5 dark:border-white/[0.08] shadow-sm dark:shadow-none rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-white/20 focus:border-zinc-300 transition-all duration-300 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1 transition-colors duration-500">Job Title</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input 
                      type="text" 
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      className="w-full pl-11 pr-4 py-2.5 bg-zinc-50 hover:bg-zinc-100/50 dark:bg-[#111113] dark:hover:bg-[#16161a] border border-black/5 dark:border-white/[0.08] shadow-sm dark:shadow-none rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-white/20 focus:border-zinc-300 transition-all duration-300 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1 transition-colors duration-500">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-11 pr-4 py-2.5 bg-zinc-50 hover:bg-zinc-100/50 dark:bg-[#111113] dark:hover:bg-[#16161a] border border-black/5 dark:border-white/[0.08] shadow-sm dark:shadow-none rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-white/20 focus:border-zinc-300 transition-all duration-300 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1 transition-colors duration-500">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input 
                      type="tel" 
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="w-full pl-11 pr-4 py-2.5 bg-zinc-50 hover:bg-zinc-100/50 dark:bg-[#111113] dark:hover:bg-[#16161a] border border-black/5 dark:border-white/[0.08] shadow-sm dark:shadow-none rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-white/20 focus:border-zinc-300 transition-all duration-300 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (Side Cards) */}
          <div className="space-y-6">
            
            {/* Preferences Card */}
            <div className="bg-white dark:bg-[#1a1a1f] border border-zinc-200/80 dark:border-white/[0.08] rounded-3xl p-6 transition-all duration-500 shadow-sm">
              <h3 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-200 mb-5 transition-colors duration-500">Preferences</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 hover:bg-zinc-100/50 dark:bg-[#111113] border border-black/5 dark:border-white/5 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-[#1a1a1f] rounded-xl shadow-sm border border-black/5 dark:border-white/5 transition-colors duration-500">
                      <Bell className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-200 transition-colors duration-500">Notifications</p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 transition-colors duration-500">Email & Push</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={formData.notificationsEnabled}
                      onChange={(e) => setFormData({ ...formData, notificationsEnabled: e.target.checked })}
                    />
                    <div className="w-10 h-[22px] bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-zinc-900/10 dark:peer-focus:ring-white/10 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-[18px] after:w-[18px] after:transition-all dark:border-white/[0.12] peer-checked:bg-zinc-900 dark:peer-checked:bg-zinc-100 transition-colors duration-500 shadow-inner"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 hover:bg-zinc-100/50 dark:bg-[#111113] border border-black/5 dark:border-white/5 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-[#1a1a1f] rounded-xl shadow-sm border border-black/5 dark:border-white/5 transition-colors duration-500">
                      <Lock className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-200 transition-colors duration-500">Password</p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 transition-colors duration-500">Last changed recently</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsChangingPassword(true)}
                    className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors duration-300 active:scale-[0.98] bg-white dark:bg-[#1a1a1f] px-3 py-1.5 rounded-lg border border-black/5 dark:border-white/10 shadow-sm"
                  >
                    Change
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 hover:bg-zinc-100/50 dark:bg-[#111113] border border-black/5 dark:border-white/5 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-[#1a1a1f] rounded-xl shadow-sm border border-black/5 dark:border-white/5 transition-colors duration-500">
                      <Shield className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-200 transition-colors duration-500">2FA Security</p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 transition-colors duration-500">{user.twoFactorEnabled ? 'Enabled' : 'Disabled'}</p>
                    </div>
                  </div>
                  <button className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors duration-300 active:scale-[0.98] bg-white dark:bg-[#1a1a1f] px-3 py-1.5 rounded-lg border border-black/5 dark:border-white/10 shadow-sm">
                    {user.twoFactorEnabled ? 'Manage' : 'Setup'}
                  </button>
                </div>
              </div>
            </div>

            {/* Save Action */}
            <div className="bg-white dark:bg-[#1a1a1f] border border-zinc-200/80 dark:border-white/[0.08] rounded-3xl p-6 transition-all duration-500 shadow-sm">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full text-sm font-semibold border border-transparent hover:opacity-90 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {isChangingPassword && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white dark:bg-[#1a1a1f] rounded-3xl p-8 shadow-2xl dark:shadow-none border border-zinc-200/80 dark:border-white/[0.08] animate-in zoom-in-95 duration-300">
            <div className="mb-6">
              <h3 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-200">Change Password</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Enter your current and new password below.</p>
            </div>

            {passwordError && (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-600 text-sm font-medium">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 text-sm font-medium">
                Password changed successfully!
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">Current Password</label>
                <input 
                  type="password" 
                  required
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-50 hover:bg-zinc-100/50 dark:bg-[#111113] border border-black/5 dark:border-white/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-white/20 transition-all duration-300 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">New Password</label>
                <input 
                  type="password" 
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-50 hover:bg-zinc-100/50 dark:bg-[#111113] border border-black/5 dark:border-white/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-white/20 transition-all duration-300 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">Confirm New Password</label>
                <input 
                  type="password" 
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-50 hover:bg-zinc-100/50 dark:bg-[#111113] border border-black/5 dark:border-white/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-white/20 transition-all duration-300 text-sm"
                />
              </div>

              <div className="flex gap-3 pt-6">
                <button 
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="flex-1 py-2.5 bg-white border border-zinc-200 dark:bg-[#16161a] dark:border-white/[0.08] text-zinc-900 dark:text-zinc-200 rounded-full font-semibold hover:bg-zinc-50 dark:hover:bg-white/[0.06] transition-all duration-300 active:scale-[0.98] text-sm shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full font-semibold border border-transparent hover:opacity-90 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none text-sm shadow-sm"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
