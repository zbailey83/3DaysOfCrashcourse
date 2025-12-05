import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useArtifacts } from '../../hooks/useArtifacts';
import { Sliders, Save, FileText, Sparkles, Copy, Loader2 } from 'lucide-react';

export const BrandVoiceDNA: React.FC = () => {
    const [sliders, setSliders] = useState({
        formalCasual: 5,
        technicalConversational: 5,
        polishedRaw: 5,
        inspiringPractical: 5,
        boldNeutral: 5
    });

    const [powerWords, setPowerWords] = useState('');
    const [neverSay, setNeverSay] = useState('');
    const [generatedBrief, setGeneratedBrief] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [userId, setUserId] = useState<string | undefined>(undefined);

    const { saveArtifact } = useArtifacts(userId);

    React.useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUserId(user?.id);
        });
    }, []);

    const handleSave = async () => {
        if (!userId || !generatedBrief) return;
        setSaving(true);
        try {
            await saveArtifact({
                user_id: userId,
                type: 'brand_voice',
                title: 'Brand Voice Brief',
                content: { brief: generatedBrief, sliders, powerWords, neverSay },
            });
            alert('Brand Voice saved to workspace!');
        } catch (e) {
            console.error(e);
            alert('Failed to save.');
        } finally {
            setSaving(false);
        }
    };

    const handleSliderChange = (key: keyof typeof sliders, value: number) => {
        setSliders(prev => ({ ...prev, [key]: value }));
    };

    const generateBrief = () => {
        const brief = `
# Brand Voice DNA Brief

## Tone Spectrum
*   **Formal ↔ Casual:** ${sliders.formalCasual}/10
*   **Technical ↔ Conversational:** ${sliders.technicalConversational}/10
*   **Polished ↔ Raw:** ${sliders.polishedRaw}/10
*   **Inspiring ↔ Practical:** ${sliders.inspiringPractical}/10
*   **Bold ↔ Neutral:** ${sliders.boldNeutral}/10

## Vocabulary Mapping
**Power Words:**
${powerWords.split(',').map(w => `* ${w.trim()}`).join('\n')}

**Never-Say Phrases:**
${neverSay.split(',').map(w => `* ${w.trim()}`).join('\n')}

## Voice Summary
This brand aims for a balance defined by the sliders above. Content should utilize the identified power words while strictly avoiding the negative phrases to maintain consistency across all channels.
    `;
        setGeneratedBrief(brief.trim());
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full animate-slide-up">
            {/* Input Section */}
            <div className="glass-card p-8 rounded-[24px] h-fit">
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-secondary/10 rounded-xl mb-4">
                        <Sliders className="text-secondary w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-text-primary mb-2">Brand Voice DNA</h2>
                    <p className="text-muted">Codify the exact rules that make your voice distinct.</p>
                </div>

                <div className="space-y-8">
                    {/* Sliders */}
                    <div className="space-y-6">
                        <h3 className="font-bold text-text-primary">Tone Spectrum (1-10)</h3>

                        {[
                            { key: 'formalCasual', label: 'Formal ↔ Casual', left: 'Formal', right: 'Casual' },
                            { key: 'technicalConversational', label: 'Technical ↔ Conversational', left: 'Technical', right: 'Conversational' },
                            { key: 'polishedRaw', label: 'Polished ↔ Raw', left: 'Polished', right: 'Raw' },
                            { key: 'inspiringPractical', label: 'Inspiring ↔ Practical', left: 'Inspiring', right: 'Practical' },
                            { key: 'boldNeutral', label: 'Bold ↔ Neutral', left: 'Bold', right: 'Neutral' }
                        ].map((item) => (
                            <div key={item.key}>
                                <div className="flex justify-between text-sm font-medium text-muted mb-2">
                                    <span>{item.left}</span>
                                    <span>{item.right}</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={sliders[item.key as keyof typeof sliders]}
                                    onChange={(e) => handleSliderChange(item.key as keyof typeof sliders, parseInt(e.target.value))}
                                    className="w-full h-2 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-secondary"
                                />
                                <div className="text-center text-xs font-bold text-secondary mt-1">{sliders[item.key as keyof typeof sliders]}</div>
                            </div>
                        ))}
                    </div>

                    {/* Text Inputs */}
                    <div>
                        <label className="block text-sm font-bold text-text-primary mb-2">Power Words (comma separated)</label>
                        <input
                            type="text"
                            className="w-full p-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl focus:bg-white/10 focus:border-secondary/50 focus:ring-4 focus:ring-secondary/10 outline-none transition-all font-medium text-slate-900 dark:text-white placeholder:text-slate-500"
                            placeholder="e.g., Innovative, Seamless, Empower"
                            value={powerWords}
                            onChange={(e) => setPowerWords(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-text-primary mb-2">Never-Say Phrases (comma separated)</label>
                        <input
                            type="text"
                            className="w-full p-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl focus:bg-white/10 focus:border-secondary/50 focus:ring-4 focus:ring-secondary/10 outline-none transition-all font-medium text-slate-900 dark:text-white placeholder:text-slate-500"
                            placeholder="e.g., Cheap, Stuff, Maybe"
                            value={neverSay}
                            onChange={(e) => setNeverSay(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={generateBrief}
                        className="w-full bg-gradient-to-r from-secondary to-pink-500 hover:scale-[1.02] text-white font-bold py-4 rounded-full transition-all shadow-glow flex items-center justify-center"
                    >
                        <Sparkles className="mr-2" /> Generate Voice Brief
                    </button>
                </div>
            </div>

            {/* Output Section */}
            <div className="space-y-6">
                {!generatedBrief && (
                    <div className="h-full flex flex-col items-center justify-center text-muted border-2 border-dashed border-white/10 rounded-[24px] p-12 bg-white/5">
                        <FileText size={48} className="mb-4 opacity-20" />
                        <p className="font-medium">Your Brand Voice Brief will appear here</p>
                    </div>
                )}

                {generatedBrief && (
                    <div className="glass-card p-8 rounded-[24px] animate-fade-in">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-display font-bold text-text-primary flex items-center text-xl">
                                <Save className="mr-3 text-secondary" size={20} /> Generated Brief
                            </h3>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="text-muted hover:text-secondary transition-colors p-2 hover:bg-white/5 rounded-full"
                                    title="Save to Workspace"
                                >
                                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                </button>
                                <button className="text-muted hover:text-secondary transition-colors p-2 hover:bg-white/5 rounded-full" title="Copy to Clipboard">
                                    <Copy size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="bg-white/5 p-6 rounded-2xl text-sm font-mono whitespace-pre-wrap text-text-secondary border border-transparent hover:border-secondary/10 transition-colors leading-relaxed">
                            {generatedBrief}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
