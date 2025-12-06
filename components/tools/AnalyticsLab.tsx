import React, { useState } from 'react';
import { analyzeAnalyticsData } from '../../services/geminiService';
import { supabase } from '../../lib/supabase';
import { useArtifacts } from '../../hooks/useArtifacts';
import { Loader2, PieChart, TrendingUp, AlertCircle, CheckCircle, BarChart2, Save, ArrowRight } from 'lucide-react';

interface AnalyticsResult {
    summary: string;
    top_performing: string[];
    underperforming: string[];
    trends: string[];
    recommendations: string[];
    roi_analysis: string;
}

export const AnalyticsLab: React.FC = () => {
    const [dataInput, setDataInput] = useState('');
    const [context, setContext] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [result, setResult] = useState<AnalyticsResult | null>(null);
    const [userId, setUserId] = useState<string | undefined>(undefined);

    const { saveArtifact } = useArtifacts(userId);

    React.useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUserId(user?.id);
        });
    }, []);

    const handleAnalyze = async () => {
        if (!dataInput) return;
        setLoading(true);
        setResult(null);
        try {
            const jsonStr = await analyzeAnalyticsData(dataInput, context);
            const cleanJson = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(cleanJson);
            setResult(data);
        } catch (e) {
            console.error(e);
            alert('Analysis failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!userId || !result) return;
        setSaving(true);
        try {
            await saveArtifact({
                user_id: userId,
                type: 'analytics_report',
                title: `Analytics Report - ${new Date().toLocaleDateString()}`,
                content: { ...result, source_data: dataInput },
            });
            alert('Report saved to workspace!');
        } catch (e) {
            console.error(e);
            alert('Failed to save report.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="h-full max-w-6xl mx-auto animate-slide-up">
            <div className="mb-8">
                <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-xl mb-4">
                    <BarChart2 className="text-purple-500 w-6 h-6" />
                </div>
                <h2 className="text-3xl font-display font-bold text-text-primary mb-2">Analytics Lab</h2>
                <p className="text-muted">Feed your raw numbers into the AI to uncover hidden trends and actionable insights.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Input Column */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="glass-card p-6 rounded-[24px]">
                        <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Raw Data Input</label>
                        <textarea
                            className="w-full p-4 h-64 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl focus:bg-white/10 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all font-mono text-sm text-text-primary placeholder:text-muted resize-none shadow-inner mb-4"
                            placeholder="Paste your metrics here (CSV, JSON, or plain text list)...&#10;e.g.,&#10;Week 1: 500 clicks, 2% CTR&#10;Week 2: 800 clicks, 3.5% CTR"
                            value={dataInput}
                            onChange={(e) => setDataInput(e.target.value)}
                        />

                        <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Context (Optional)</label>
                        <input
                            type="text"
                            className="w-full p-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-sm font-medium text-text-primary focus:outline-none focus:border-purple-500 placeholder:text-muted shadow-inner mb-6"
                            placeholder="e.g., 'Instagram Ad Campaign for Eco-Shoes'"
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                        />

                        <button
                            onClick={handleAnalyze}
                            disabled={loading || !dataInput}
                            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-4 rounded-full transition-all shadow-glow hover:scale-[1.02] flex items-center justify-center disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin mr-2" /> : <TrendingUp className="mr-2" size={18} />}
                            Analyze Performance
                        </button>
                    </div>

                    <div className="glass-panel p-6 rounded-[24px] border-l-4 border-purple-500">
                        <h4 className="font-bold text-text-primary mb-2 flex items-center"><AlertCircle size={16} className="mr-2 text-purple-500" /> Pro Tip</h4>
                        <p className="text-sm text-muted">Copy/paste directly from your Facebook Ads Manager, Google Analytics, or Excel sheets. The AI understands messy formats.</p>
                    </div>
                </div>

                {/* Results Column */}
                <div className="lg:col-span-7">
                    {!result && !loading && (
                        <div className="h-full flex flex-col items-center justify-center text-muted border-2 border-dashed border-black/10 dark:border-white/10 rounded-[24px] p-12 bg-black/5 dark:bg-white/5 min-h-[400px]">
                            <PieChart size={48} className="mb-4 opacity-20" />
                            <p className="font-medium">Analysis insights will appear here</p>
                        </div>
                    )}

                    {loading && (
                        <div className="h-full flex flex-col items-center justify-center glass-card rounded-[24px] min-h-[400px]">
                            <Loader2 size={48} className="text-purple-500 animate-spin mb-4" />
                            <p className="text-text-primary font-bold animate-pulse">Crunching numbers...</p>
                        </div>
                    )}

                    {result && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex justify-end">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="bg-purple-500/10 text-purple-500 px-4 py-2 rounded-xl text-sm font-bold hover:bg-purple-500/20 transition-colors flex items-center border border-purple-500/20"
                                >
                                    {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
                                    Save Report
                                </button>
                            </div>

                            {/* Summary Card */}
                            <div className="glass-card p-8 rounded-[24px] border-t-4 border-t-purple-500">
                                <h3 className="font-display font-bold text-2xl text-text-primary mb-4">Executive Summary</h3>
                                <p className="text-text-secondary leading-relaxed text-lg">{result.summary}</p>
                            </div>

                            {/* Performance Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="glass-card p-6 rounded-[24px] bg-green-500/5 border-green-500/10">
                                    <h4 className="font-bold text-green-500 mb-4 flex items-center uppercase text-xs tracking-wider"><TrendingUp size={14} className="mr-2" /> Top Performing</h4>
                                    <ul className="space-y-2">
                                        {result.top_performing.map((item, i) => (
                                            <li key={i} className="flex items-start text-sm text-text-primary">
                                                <CheckCircle size={14} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" /> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="glass-card p-6 rounded-[24px] bg-red-500/5 border-red-500/10">
                                    <h4 className="font-bold text-red-500 mb-4 flex items-center uppercase text-xs tracking-wider"><AlertCircle size={14} className="mr-2" /> Needs Attention</h4>
                                    <ul className="space-y-2">
                                        {result.underperforming.map((item, i) => (
                                            <li key={i} className="flex items-start text-sm text-text-primary">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 mr-2 flex-shrink-0"></span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Recommendations */}
                            <div className="glass-card p-8 rounded-[24px]">
                                <h3 className="font-display font-bold text-xl text-text-primary mb-6">Action Plan</h3>
                                <div className="space-y-4">
                                    {result.recommendations.map((rec, i) => (
                                        <div key={i} className="flex items-start p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-transparent hover:border-purple-500/20 transition-all">
                                            <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold text-sm mr-4 flex-shrink-0">
                                                {i + 1}
                                            </div>
                                            <p className="text-text-primary pt-1">{rec}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ROI Analysis */}
                            <div className="glass-panel p-6 rounded-[24px] flex items-start">
                                <div className="mr-4 p-3 bg-indigo-500/10 rounded-full text-indigo-500">
                                    <BarChart2 size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-text-primary mb-1">ROI Analysis</h4>
                                    <p className="text-sm text-muted">{result.roi_analysis}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
