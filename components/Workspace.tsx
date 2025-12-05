import React, { useState, useEffect } from 'react';
import { useArtifacts } from '../hooks/useArtifacts';
import { supabase } from '../lib/supabase';
import { FileText, Image as ImageIcon, Search, Mic, Trash2, ExternalLink, Calendar } from 'lucide-react';

export const Workspace: React.FC = () => {
    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [activeTab, setActiveTab] = useState<'all' | 'campaign' | 'image' | 'seo_analysis' | 'brand_voice'>('all');

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUserId(user?.id);
        });
    }, []);

    const { artifacts, loading, deleteArtifact } = useArtifacts(userId, activeTab === 'all' ? undefined : activeTab);

    const getIcon = (type: string) => {
        switch (type) {
            case 'campaign': return <Calendar size={20} className="text-primary" />;
            case 'image': return <ImageIcon size={20} className="text-secondary" />;
            case 'seo_analysis': return <Search size={20} className="text-success" />;
            case 'brand_voice': return <Mic size={20} className="text-pink-500" />;
            default: return <FileText size={20} className="text-muted" />;
        }
    };

    const getLabel = (type: string) => {
        switch (type) {
            case 'campaign': return 'Campaign';
            case 'image': return 'Image';
            case 'seo_analysis': return 'SEO Report';
            case 'brand_voice': return 'Brand Voice';
            default: return 'File';
        }
    };

    return (
        <div className="space-y-8 pb-10">
            <div className="flex items-center justify-between animate-slide-up">
                <div>
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-2">My Workspace</h1>
                    <p className="text-muted">Manage your generated assets and reports.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 overflow-x-auto pb-2 animate-slide-up delay-100">
                {[
                    { id: 'all', label: 'All Assets' },
                    { id: 'campaign', label: 'Campaigns' },
                    { id: 'image', label: 'Images' },
                    { id: 'seo_analysis', label: 'SEO Reports' },
                    { id: 'brand_voice', label: 'Brand Voices' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeTab === tab.id
                            ? 'bg-primary text-white shadow-glow'
                            : 'bg-black/5 dark:bg-white/5 text-muted hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up delay-200">
                {loading ? (
                    <div className="col-span-full text-center py-20 text-muted">Loading workspace...</div>
                ) : artifacts.length === 0 ? (
                    <div className="col-span-full text-center py-20 glass-card rounded-[24px] border border-dashed border-black/10 dark:border-white/10">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-muted">
                            <FileText size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-text-primary mb-1">No artifacts found</h3>
                        <p className="text-muted">Start using the tools to generate content!</p>
                    </div>
                ) : (
                    artifacts.map(artifact => (
                        <div key={artifact.id} className="glass-card rounded-[24px] p-6 hover:shadow-glow hover:-translate-y-1 transition-all group relative">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-all">
                                    {getIcon(artifact.type)}
                                </div>
                                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => deleteArtifact(artifact.id)}
                                        className="p-2 text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="font-bold text-text-primary mb-2 line-clamp-1">{artifact.title || 'Untitled'}</h3>
                            <div className="flex items-center justify-between text-xs text-muted">
                                <span className="bg-black/5 dark:bg-white/5 px-2 py-1 rounded-md font-medium border border-black/10 dark:border-white/10">{getLabel(artifact.type)}</span>
                                <span>{new Date(artifact.created_at).toLocaleDateString()}</span>
                            </div>

                            {/* Preview Content (Simplified) */}
                            <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10">
                                {artifact.type === 'image' && artifact.content?.url ? (
                                    <div className="h-32 rounded-xl overflow-hidden bg-black/20">
                                        <img src={artifact.content.url} alt={artifact.title} className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <p className="text-xs text-muted line-clamp-3">
                                        {JSON.stringify(artifact.content)}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
