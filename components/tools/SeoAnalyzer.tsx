import React, { useState } from 'react';
import { analyzeSeoText } from '../../services/geminiService';
import { Loader2, Search, ThumbsUp, ArrowRight, CheckCircle, Target } from 'lucide-react';

interface AnalysisResult {
    score: number;
    sentiment: string;
    keywords: string[];
    improvements: string[];
}

export const SeoAnalyzer: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!text) return;
    setLoading(true);
    setResult(null);
    try {
      const jsonStr = await analyzeSeoText(text);
      const cleanJson = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(cleanJson);
      setResult({
        score: data.score || 0,
        sentiment: data.sentiment || 'Neutral',
        keywords: data.keywords_detected || [],
        improvements: data.improvements || []
      });
    } catch (e) {
      console.error(e);
      alert("Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full max-w-5xl mx-auto">
       <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-[#1A1A1A] mb-2">AI SEO Assistant</h2>
        <p className="text-[#7E7E7E]">Paste your blog post or ad copy to get instant optimization suggestions.</p>
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-[24px] shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.04)] border border-black/5 overflow-hidden transition-all focus-within:ring-4 focus-within:ring-[#6C4CF4]/5 focus-within:border-[#6C4CF4]/30">
            <textarea 
                className="w-full p-8 h-48 outline-none resize-none text-[#1A1A1A] text-lg placeholder:text-gray-300 font-light leading-relaxed"
                placeholder="Paste your content here to begin analysis..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <div className="bg-[#F9FAFB] px-8 py-4 flex justify-between items-center border-t border-gray-100">
                <span className="text-xs text-[#9CA3AF] font-bold uppercase tracking-wider">{text.split(/\s+/).filter(w => w.length > 0).length} words</span>
                <button 
                    onClick={handleAnalyze}
                    disabled={loading || !text}
                    className="bg-[#1A1A1A] text-white px-6 py-3 rounded-full font-bold hover:bg-[#6C4CF4] transition-colors disabled:opacity-50 flex items-center shadow-lg hover:shadow-xl hover:shadow-purple-500/20"
                >
                    {loading ? <Loader2 className="animate-spin mr-2" size={16}/> : <Search className="mr-2" size={16} />}
                    Analyze Content
                </button>
            </div>
        </div>

        {result && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
                {/* Score Card */}
                <div className="bg-white p-8 rounded-[24px] shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.04)] border border-black/5 text-center flex flex-col items-center justify-center">
                    <h3 className="text-[#7E7E7E] text-xs font-bold uppercase tracking-widest mb-6">SEO Score</h3>
                    <div className="relative inline-flex items-center justify-center mb-6">
                         <svg className="w-40 h-40 transform -rotate-90">
                           <circle className="text-gray-100" strokeWidth="8" stroke="currentColor" fill="transparent" r="70" cx="80" cy="80" />
                           <circle 
                             className={result.score > 70 ? "text-[#60D46B]" : result.score > 40 ? "text-[#FFB14D]" : "text-[#FF4D4D]"} 
                             strokeWidth="8" 
                             strokeDasharray={440}
                             strokeDashoffset={440 - (440 * result.score) / 100}
                             strokeLinecap="round"
                             stroke="currentColor" 
                             fill="transparent" 
                             r="70" 
                             cx="80" 
                             cy="80" 
                             style={{transition: 'stroke-dashoffset 1.5s ease-out'}}
                           />
                         </svg>
                         <div className="absolute flex flex-col items-center">
                            <span className="text-4xl font-display font-bold text-[#1A1A1A]">{result.score}</span>
                            <span className="text-xs font-medium text-gray-400">/ 100</span>
                         </div>
                    </div>
                    <div className="inline-block px-4 py-1.5 bg-[#F7F8FA] rounded-full text-xs font-bold text-[#4A4A4A] uppercase tracking-wide border border-black/5">
                        {result.sentiment} Tone
                    </div>
                </div>

                {/* Suggestions */}
                <div className="bg-white p-8 rounded-[24px] shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.04)] border border-black/5 md:col-span-2 flex flex-col">
                    <h3 className="font-display font-bold text-[#1A1A1A] mb-6 flex items-center text-xl">
                        <ThumbsUp className="mr-3 text-[#6C4CF4]" size={20}/> 
                        Actionable Improvements
                    </h3>
                    <ul className="space-y-4 flex-1">
                        {result.improvements.map((imp, i) => (
                            <li key={i} className="flex items-start text-[#4A4A4A] leading-relaxed p-3 rounded-xl hover:bg-[#F9FAFB] transition-colors">
                                <div className="mt-1 mr-3 min-w-[20px] h-5 rounded-full bg-[#6C4CF4]/10 flex items-center justify-center">
                                    <ArrowRight size={12} className="text-[#6C4CF4]" />
                                </div>
                                {imp}
                            </li>
                        ))}
                    </ul>
                    
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <h4 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-4 flex items-center"><Target size={14} className="mr-2"/> Keywords Detected</h4>
                        <div className="flex flex-wrap gap-2">
                            {result.keywords.map((k, i) => (
                                <span key={i} className="flex items-center px-3 py-1.5 bg-[#60D46B]/5 text-[#1A1A1A] rounded-lg border border-[#60D46B]/20 text-sm font-medium">
                                    <CheckCircle size={12} className="mr-1.5 text-[#60D46B]" /> {k}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};