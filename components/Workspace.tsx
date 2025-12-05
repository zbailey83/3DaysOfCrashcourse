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
            case 'campaign': return <Calendar size={20} className="text-blue-500" />;
            case 'image': return <ImageIcon size={20} className="text-cyan-500" />;
            case 'seo_analysis': return <Search size={20} className="text-emerald-500" />;
            case 'brand_voice': return <Mic size={20} className="text-violet-500" />;
            default: return <FileText size={20} className="text-slate-500" />;
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
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-[#0F172A] mb-2">My Workspace</h1>
                    <p className="text-[#64748B]">Manage your generated assets and reports.</p>
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
                                ? 'bg-[#0F172A] text-white shadow-md'
                                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up delay-200">
                {loading ? (
                    <div className="col-span-full text-center py-20 text-slate-400">Loading workspace...</div>
                ) : artifacts.length === 0 ? (
                    <div className="col-span-full text-center py-20 bg-white rounded-[24px] border border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <FileText size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-[#0F172A] mb-1">No artifacts found</h3>
                        <p className="text-slate-500">Start using the tools to generate content!</p>
                    </div>
                ) : (
                    artifacts.map(artifact => (
                        <div key={artifact.id} className="bg-white rounded-[24px] p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.04)] border border-slate-100 hover:shadow-lg transition-all group relative">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 rounded-xl bg-slate-50 group-hover:bg-white group-hover:shadow-md transition-all">
                                    {getIcon(artifact.type)}
                                </div>
                                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => deleteArtifact(artifact.id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="font-bold text-[#0F172A] mb-2 line-clamp-1">{artifact.title || 'Untitled'}</h3>
                            <div className="flex items-center justify-between text-xs text-slate-500">
                                <span className="bg-slate-100 px-2 py-1 rounded-md font-medium">{getLabel(artifact.type)}</span>
                                <span>{new Date(artifact.created_at).toLocaleDateString()}</span>
                            </div>

                            {/* Preview Content (Simplified) */}
                            <div className="mt-4 pt-4 border-t border-slate-50">
                                {artifact.type === 'image' && artifact.content?.url ? (
                                    <div className="h-32 rounded-xl overflow-hidden bg-slate-100">
                                        <img src={artifact.content.url} alt={artifact.title} className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-400 line-clamp-3">
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
