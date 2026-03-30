import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Lock, Trash2, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Personal Info State
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  // Security State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, bio, phone_number, date_of_birth')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setFullName(data.full_name || '');
        setBio(data.bio || '');
        setPhoneNumber(data.phone_number || '');
        setDateOfBirth(data.date_of_birth || '');
      }
    } catch (error: any) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          bio: bio,
          phone_number: phoneNumber,
          date_of_birth: dateOfBirth || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill both password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setIsUpdatingPassword(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast.success('Password updated successfully');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error(error.message || 'Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = () => {
    toast('Please contact support to delete your account.', { icon: 'ℹ️' });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center space-x-4">
          <button
            onClick={() => navigate('/profile')}
            className="rounded-full bg-white p-2 text-slate-500 shadow-sm hover:bg-slate-50 hover:text-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        </div>

        <div className="space-y-8">
          {/* Personal Information */}
          <section>
            <h2 className="mb-4 flex items-center space-x-2 text-lg font-semibold text-slate-900 dark:text-white">
              <User size={20} className="text-indigo-600 dark:text-indigo-400" />
              <span>Personal Information</span>
            </h2>

            <form onSubmit={handleSavePersonalInfo} className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email Address <span className="text-xs text-slate-400">(Read-only)</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail size={16} className="text-slate-400" />
                    </div>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="block w-full rounded-xl border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-slate-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-70 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="block w-full rounded-xl border-slate-200 py-2.5 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    placeholder="Tell us a little about yourself"
                    className="block w-full resize-none rounded-xl border-slate-200 py-2.5 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter your phone number"
                    className="block w-full rounded-xl border-slate-200 py-2.5 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="block w-full rounded-xl border-slate-200 py-2.5 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:[color-scheme:dark]"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-indigo-600 px-6 py-2.5 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 dark:focus:ring-offset-slate-900"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </section>

          {/* Security Settings */}
          <section>
            <h2 className="mb-4 flex items-center space-x-2 text-lg font-semibold text-slate-900 dark:text-white">
              <Lock size={20} className="text-indigo-600 dark:text-indigo-400" />
              <span>Security Settings</span>
            </h2>

            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
              <form onSubmit={handleUpdatePassword} className="space-y-4 mb-8">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="block w-full rounded-xl border-slate-200 py-2.5 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="block w-full rounded-xl border-slate-200 py-2.5 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="rounded-xl bg-slate-900 px-6 py-2.5 font-medium text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-70 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                  >
                    {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>

              <div className="border-t border-slate-100 pt-6 dark:border-slate-800/60">
                <h3 className="mb-2 font-medium text-slate-900 dark:text-white">Danger Zone</h3>
                <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  className="flex items-center space-x-2 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-500 dark:hover:bg-rose-500/20"
                >
                  <Trash2 size={16} />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
