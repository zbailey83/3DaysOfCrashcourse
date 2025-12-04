import React, { useState } from 'react';
import { Sliders, Save, FileText, Sparkles, Copy } from 'lucide-react';

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
            <div className="bg-white p-8 rounded-[24px] shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.04)] border border-slate-100 h-fit">
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-[#8B5CF6]/10 rounded-xl mb-4">
                        <Sliders className="text-[#8B5CF6] w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-[#0F172A] mb-2">Brand Voice DNA</h2>
                    <p className="text-[#64748B]">Codify the exact rules that make your voice distinct.</p>
                </div>

                <div className="space-y-8">
                    {/* Sliders */}
                    <div className="space-y-6">
                        <h3 className="font-bold text-[#0F172A]">Tone Spectrum (1-10)</h3>

                        {[
                            { key: 'formalCasual', label: 'Formal ↔ Casual', left: 'Formal', right: 'Casual' },
                            { key: 'technicalConversational', label: 'Technical ↔ Conversational', left: 'Technical', right: 'Conversational' },
                            { key: 'polishedRaw', label: 'Polished ↔ Raw', left: 'Polished', right: 'Raw' },
                            { key: 'inspiringPractical', label: 'Inspiring ↔ Practical', left: 'Inspiring', right: 'Practical' },
                            { key: 'boldNeutral', label: 'Bold ↔ Neutral', left: 'Bold', right: 'Neutral' }
                        ].map((item) => (
                            <div key={item.key}>
                                <div className="flex justify-between text-sm font-medium text-[#64748B] mb-2">
                                    <span>{item.left}</span>
                                    <span>{item.right}</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={sliders[item.key as keyof typeof sliders]}
                                    onChange={(e) => handleSliderChange(item.key as keyof typeof sliders, parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#8B5CF6]"
                                />
                                <div className="text-center text-xs font-bold text-[#8B5CF6] mt-1">{sliders[item.key as keyof typeof sliders]}</div>
                            </div>
                        ))}
                    </div>

                    {/* Text Inputs */}
                    <div>
                        <label className="block text-sm font-bold text-[#0F172A] mb-2">Power Words (comma separated)</label>
                        <input
                            type="text"
                            className="w-full p-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl focus:bg-white focus:border-[#8B5CF6]/50 focus:ring-4 focus:ring-[#8B5CF6]/10 outline-none transition-all font-medium text-[#0F172A]"
                            placeholder="e.g., Innovative, Seamless, Empower"
                            value={powerWords}
                            onChange={(e) => setPowerWords(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-[#0F172A] mb-2">Never-Say Phrases (comma separated)</label>
                        <input
                            type="text"
                            className="w-full p-4 bg-[#F8FAFC] border border-slate-100 rounded-2xl focus:bg-white focus:border-[#8B5CF6]/50 focus:ring-4 focus:ring-[#8B5CF6]/10 outline-none transition-all font-medium text-[#0F172A]"
                            placeholder="e.g., Cheap, Stuff, Maybe"
                            value={neverSay}
                            onChange={(e) => setNeverSay(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={generateBrief}
                        className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:scale-[1.02] text-white font-bold py-4 rounded-full transition-all shadow-[0px_0px_15px_rgba(139,92,246,0.4)] flex items-center justify-center"
                    >
                        <Sparkles className="mr-2" /> Generate Voice Brief
                    </button>
                </div>
            </div>

            {/* Output Section */}
            <div className="space-y-6">
                {!generatedBrief && (
                    <div className="h-full flex flex-col items-center justify-center text-[#94A3B8] border-2 border-dashed border-[#E2E8F0] rounded-[24px] p-12 bg-white/50">
                        <FileText size={48} className="mb-4 opacity-20" />
                        <p className="font-medium">Your Brand Voice Brief will appear here</p>
                    </div>
                )}

                {generatedBrief && (
                    <div className="bg-white p-8 rounded-[24px] shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.04)] border border-slate-100 animate-fade-in">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-display font-bold text-[#0F172A] flex items-center text-xl">
                                <Save className="mr-3 text-[#8B5CF6]" size={20} /> Generated Brief
                            </h3>
                            <button className="text-[#94A3B8] hover:text-[#8B5CF6] transition-colors p-2 hover:bg-[#F3E8FF] rounded-full">
                                <Copy size={18} />
                            </button>
                        </div>
                        <div className="bg-[#F8FAFC] p-6 rounded-2xl text-sm font-mono whitespace-pre-wrap text-[#475569] border border-transparent hover:border-[#8B5CF6]/10 transition-colors leading-relaxed">
                            {generatedBrief}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
