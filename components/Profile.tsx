import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile, UserProgress, UserArtifact } from '../types';
import { Camera, User, Mail, Calendar, LogOut, Save, Loader2 } from 'lucide-react';
import { StreakCounter } from './StreakCounter';

export const Profile: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [fullName, setFullName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [stats, setStats] = useState({ completedModules: 0, totalArtifacts: 0 });

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error('No user');

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                throw error;
            }

            if (data) {
                setProfile(data);
                setFullName(data.full_name || '');
                setAvatarUrl(data.avatar_url);
            }

            // Fetch stats
            const { count: progressCount } = await supabase
                .from('user_progress')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('completed', true);

            const { count: artifactCount } = await supabase
                .from('user_artifacts')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id);

            setStats({
                completedModules: progressCount || 0,
                totalArtifacts: artifactCount || 0,
            });

        } catch (error) {
            console.error('Error loading user data!', error);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error('No user');

            const updates = {
                id: user.id,
                full_name: fullName,
                avatar_url: avatarUrl,
                updated_at: new Date(),
            };

            const { error } = await supabase.from('profiles').upsert(updates);

            if (error) throw error;
            alert('Profile updated!');
        } catch (error) {
            alert('Error updating the data!');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            setAvatarUrl(data.publicUrl);

            // Auto-save after upload
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase.from('profiles').upsert({
                    id: user.id,
                    avatar_url: data.publicUrl,
                    updated_at: new Date(),
                });
            }

        } catch (error) {
            alert('Error uploading avatar!');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

    if (loading && !profile) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-[#2563EB]" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto animate-slide-up pb-10">
            <h1 className="text-3xl font-display font-bold text-[#0F172A] mb-8">Profile Settings</h1>

            <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100 mb-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-lg mb-4">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <User size={48} />
                                </div>
                            )}
                        </div>
                        <label className="absolute bottom-4 right-0 bg-[#2563EB] text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors shadow-md" htmlFor="avatar-upload">
                            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                        </label>
                        <input
                            type="file"
                            id="avatar-upload"
                            accept="image/*"
                            onChange={uploadAvatar}
                            disabled={uploading}
                            className="hidden"
                        />
                    </div>
                    <h2 className="text-xl font-bold text-[#0F172A]">{fullName || 'User'}</h2>
                    <p className="text-slate-500 text-sm">{profile?.email}</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-[#0F172A] mb-2">Full Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-[#0F172A] mb-2">Email Address</label>
                        <div className="flex items-center px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500">
                            <Mail size={18} className="mr-3" />
                            <span>{profile?.email}</span>
                        </div>
                    </div>

                    <button
                        onClick={updateProfile}
                        disabled={loading}
                        className="w-full py-3 rounded-xl font-bold text-white bg-[#0F172A] hover:bg-[#2563EB] transition-colors flex items-center justify-center shadow-lg shadow-blue-500/10"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Modules Completed</div>
                    <div className="text-3xl font-display font-bold text-[#0F172A]">{stats.completedModules}</div>
                </div>
                <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Artifacts Created</div>
                    <div className="text-3xl font-display font-bold text-[#0F172A]">{stats.totalArtifacts}</div>
                </div>
            </div>

            <div className="mb-8">
                <StreakCounter className="bg-white border-slate-100 shadow-sm" />
            </div>

            <button
                onClick={handleSignOut}
                className="w-full py-4 rounded-xl font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center"
            >
                <LogOut size={18} className="mr-2" />
                Sign Out
            </button>
        </div>
    );
};
