import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile, Course } from '../types';
import { ViewState } from '../App';
import { Camera, User, LogOut, Save, Loader2, PlayCircle, Clock, ArrowRight, Zap, Mic, LayoutDashboard } from 'lucide-react';
import { StreakCounter } from './StreakCounter';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useProgress } from '../hooks/useProgress';
import { useArtifacts } from '../hooks/useArtifacts';
import { Badges } from './Badges';

interface ProfileProps {
    courses: Course[];
    onNavigate: (view: ViewState) => void;
}

export const Profile: React.FC<ProfileProps> = ({ courses, onNavigate }) => {
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [fullName, setFullName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [stats, setStats] = useState({ completedModules: 0, totalArtifacts: 0 });
    const [userId, setUserId] = useState<string | undefined>(undefined);

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error('No user');
            setUserId(user.id);

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

            // Get user first to ensure we have the ID for the filename
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            // Use user.id and timestamp for unique filename
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const filePath = fileName;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true });

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

            if (!data.publicUrl) {
                throw new Error('Failed to get public URL');
            }

            setAvatarUrl(data.publicUrl);

            // Auto-save after upload
            const { error: updateError } = await supabase.from('profiles').upsert({
                id: user.id,
                avatar_url: data.publicUrl,
            });

            if (updateError) throw updateError;

            // Refresh profile to ensure sync
            await getProfile();

        } catch (error: any) {
            alert(`Error uploading avatar: ${error.message}`);
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

    const { getCourseProgress, progress } = useProgress(userId);
    const { artifacts } = useArtifacts(userId);

    // Calculate overall progress
    const totalModules = courses.reduce((acc, course) => acc + course.modules.length, 0);
    const overallProgress = totalModules > 0 ? Math.round((stats.completedModules / totalModules) * 100) : 0;

    // Calculate dynamic skill scores
    const skillData = React.useMemo(() => {
        const writingCount = artifacts.filter(a => a.type === 'campaign' || a.type === 'brand_voice').length;
        const seoCount = artifacts.filter(a => a.type === 'seo_analysis').length;
        const visualsCount = artifacts.filter(a => a.type === 'image').length;
        const strategyCount = artifacts.filter(a => a.type === 'analytics_report').length;

        // Base scores on progress (30%) + artifacts (70%)
        // Normalized to 0-100
        const moduleCompletion = stats.completedModules / (totalModules || 1);
        const baseScore = Math.round(moduleCompletion * 30);

        return [
            { name: 'Writing', score: Math.min(100, baseScore + (writingCount * 10)) },
            { name: 'SEO', score: Math.min(100, baseScore + (seoCount * 15)) },
            { name: 'Visuals', score: Math.min(100, baseScore + (visualsCount * 5)) },
            { name: 'Strategy', score: Math.min(100, baseScore + (strategyCount * 20)) },
        ];
    }, [artifacts, stats.completedModules, totalModules]);


    if (loading && !profile) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto animate-slide-up pb-10 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-display font-bold text-text-primary">Profile & Progress</h1>
                <button
                    onClick={handleSignOut}
                    className="px-4 py-2 rounded-xl font-bold text-danger bg-danger/10 hover:bg-danger/20 transition-colors flex items-center border border-danger/20 text-sm"
                >
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile Settings */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-card rounded-[24px] p-6">
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full overflow-hidden bg-white/5 border-4 border-white/10 shadow-lg mb-3">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted">
                                            <User size={32} />
                                        </div>
                                    )}
                                </div>
                                <label className="absolute bottom-2 right-0 bg-primary text-white p-1.5 rounded-full cursor-pointer hover:bg-blue-600 transition-colors shadow-md" htmlFor="avatar-upload">
                                    {uploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
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
                            <h2 className="text-lg font-bold text-text-primary">{fullName || 'User'}</h2>
                            <p className="text-muted text-xs">{profile?.email}</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-text-primary mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <button
                                onClick={updateProfile}
                                disabled={loading}
                                className="w-full py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-primary to-secondary hover:shadow-glow transition-all flex items-center justify-center shadow-lg text-sm"
                            >
                                {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
                                Save Changes
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="glass-card p-4 rounded-[20px] text-center">
                            <div className="text-muted text-[10px] font-bold uppercase tracking-wider mb-1">Modules</div>
                            <div className="text-2xl font-display font-bold text-text-primary">{stats.completedModules}</div>
                        </div>
                        <div className="glass-card p-4 rounded-[20px] text-center">
                            <div className="text-muted text-[10px] font-bold uppercase tracking-wider mb-1">Artifacts</div>
                            <div className="text-2xl font-display font-bold text-text-primary">{stats.totalArtifacts}</div>
                        </div>
                    </div>

                </div>

                {/* Right Column: Progress & Courses */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Overall Progress Card */}
                    <div className="bg-gradient-to-br from-primary to-secondary p-8 rounded-[24px] shadow-glow text-white relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-10 -mb-10 blur-xl"></div>

                        <h3 className="text-blue-100 font-medium mb-2 flex items-center relative z-10"><Zap className="w-4 h-4 mr-2 text-yellow-300" /> Overall Progress</h3>
                        <div className="text-5xl font-display font-bold mb-6 relative z-10">{overallProgress}%</div>

                        <div className="w-full bg-black/20 rounded-full h-3 mb-3 backdrop-blur-sm relative z-10">
                            <div className="bg-white h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-1000" style={{ width: `${overallProgress}%` }}></div>
                        </div>
                        <p className="text-sm text-blue-50 font-medium relative z-10">Level {Math.floor(overallProgress / 20) + 1}: {overallProgress > 80 ? 'Master' : overallProgress > 50 ? 'Advanced' : 'Beginner'}</p>
                    </div>

                    {/* Brand Voice Section - Moved here */}
                    <div className="glass-card p-6 rounded-[24px] border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-text-primary flex items-center text-lg">
                                <Mic size={20} className="mr-3 text-primary" /> Brand Voice DNA
                            </h3>
                            {artifacts.some(a => a.type === 'brand_voice') && (
                                <span className="text-[10px] font-bold bg-success/20 text-success px-2 py-1 rounded-full">Active</span>
                            )}
                        </div>

                        {artifacts.some(a => a.type === 'brand_voice') ? (
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted">Your brand voice is configured. We use this DNA to tailor your content.</p>
                                <button
                                    onClick={() => onNavigate({ type: 'tool', toolName: 'brand-voice' })}
                                    className="px-4 py-2 rounded-xl text-primary font-bold bg-white/10 hover:bg-white/20 transition-all text-sm border border-primary/20 whitespace-nowrap ml-4"
                                >
                                    Refine DNA
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted">Configure your brand voice to ensure consistently on-brand AI content.</p>
                                <button
                                    onClick={() => onNavigate({ type: 'tool', toolName: 'brand-voice' })}
                                    className="px-4 py-2 rounded-xl text-white font-bold bg-gradient-to-r from-primary to-secondary hover:shadow-glow transition-all text-sm animate-pulse-slow whitespace-nowrap ml-4"
                                >
                                    Configure
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Continue Learning */}
                    <div className="glass-card p-6 rounded-[24px] hover:shadow-glow transition-all duration-300">
                        <h3 className="font-display font-bold text-text-primary mb-4 text-lg">Continue Learning</h3>
                        <div className="flex items-start space-x-4">
                            <div className="bg-[#F59E0B]/10 p-3.5 rounded-2xl">
                                <Clock className="text-[#F59E0B]" size={22} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-text-primary mb-1">Visual Asset Creation</h4>
                                <p className="text-xs text-muted mb-3">Module 2 • 15m remaining</p>
                                <button
                                    onClick={() => onNavigate({ type: 'course', courseId: 'day-1-foundation', moduleId: 'm3.1-image-prompt' })}
                                    className="text-primary text-sm font-bold hover:text-secondary transition-colors flex items-center group"
                                >
                                    Resume <ArrowRight size={14} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Badges / Achievements */}
                    <div>
                        <h2 className="text-xl font-display font-bold text-text-primary mb-4">Achievements</h2>
                        <Badges progress={progress} artifacts={artifacts} />
                    </div>
                </div>
            </div>
        </div>
    );
};
