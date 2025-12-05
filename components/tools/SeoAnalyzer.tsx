import React, { useState } from 'react';
import { analyzeSeoText } from '../../services/geminiService';
import { Loader2, Search, ThumbsUp, ArrowRight, CheckCircle, Target, Hash, Zap } from 'lucide-react';

interface AnalysisResult {
  score: number;
  sentiment: string;
  keywords: string[];
  keyword_density?: string;
  improvements: string[];
  suggested_keywords?: string[];
}

export const SeoAnalyzer: React.FC = () => {
  const [text, setText] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!text) return;
    setLoading(true);
    setResult(null);
    try {
      const jsonStr = await analyzeSeoText(text, targetKeyword);
      const cleanJson = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(cleanJson);
      setResult({
        score: data.score || 0,
        sentiment: data.sentiment || 'Neutral',
        keywords: data.keywords_detected || [],
        keyword_density: data.keyword_density,
        improvements: data.improvements || [],
        suggested_keywords: data.suggested_keywords || []
      });
    } catch (e) {
      console.error(e);
      alert("Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full max-w-5xl mx-auto animate-slide-up">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-text-primary mb-2">AI SEO Assistant</h2>
        <p className="text-muted">Paste your blog post or ad copy to get instant optimization suggestions.</p>
      </div>

      <div className="space-y-8">
        <div className="glass-card rounded-[24px] overflow-hidden transition-all focus-within:ring-4 focus-within:ring-primary/20 focus-within:border-primary/50">
          <div className="p-6 border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2 flex items-center">
              <Target size={12} className="mr-1.5" /> Target Keyword (Optional)
            </label>
            <input
              type="text"
              className="w-full p-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-primary placeholder:text-slate-500"
              placeholder="e.g., 'AI marketing tools'"
              value={targetKeyword}
              onChange={(e) => setTargetKeyword(e.target.value)}
            />
          </div>
          <textarea
            className="w-full p-8 h-48 outline-none resize-none bg-transparent text-slate-900 dark:text-white text-lg placeholder:text-slate-500 font-light leading-relaxed"
            placeholder="Paste your content here to begin analysis..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="bg-black/5 dark:bg-white/5 px-8 py-4 flex justify-between items-center border-t border-black/10 dark:border-white/10">
            <span className="text-xs text-muted font-bold uppercase tracking-wider">{text.split(/\s+/).filter(w => w.length > 0).length} words</span>
            <button
              onClick={handleAnalyze}
              disabled={loading || !text}
              className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-full font-bold hover:shadow-glow hover:scale-105 transition-all disabled:opacity-50 flex items-center"
            >
              {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Search className="mr-2" size={16} />}
              Analyze Content
            </button>
          </div>
        </div>

        {result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
            {/* Score Card */}
            <div className="glass-card p-8 rounded-[24px] text-center flex flex-col items-center justify-center">
              <h3 className="text-muted text-xs font-bold uppercase tracking-widest mb-6">SEO Score</h3>
              <div className="relative inline-flex items-center justify-center mb-6">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle className="text-white/10" strokeWidth="8" stroke="currentColor" fill="transparent" r="70" cx="80" cy="80" />
                  <circle
                    className={result.score > 70 ? "text-success" : result.score > 40 ? "text-yellow-400" : "text-danger"}
                    strokeWidth="8"
                    strokeDasharray={440}
                    strokeDashoffset={440 - (440 * result.score) / 100}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="70"
                    cx="80"
                    cy="80"
                    style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-display font-bold text-white">{result.score}</span>
                  <span className="text-xs font-medium text-muted">/ 100</span>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="inline-block px-4 py-1.5 bg-white/5 rounded-full text-xs font-bold text-muted uppercase tracking-wide border border-white/10">
                  {result.sentiment} Tone
                </div>
                {result.keyword_density && (
                  <div className="inline-block px-4 py-1.5 bg-primary/10 rounded-full text-xs font-bold text-primary uppercase tracking-wide border border-primary/20">
                    {result.keyword_density} Density
                  </div>
                )}
              </div>
            </div>

            {/* Suggestions */}
            <div className="glass-card p-8 rounded-[24px] md:col-span-2 flex flex-col">
              <h3 className="font-display font-bold text-text-primary mb-6 flex items-center text-xl">
                <ThumbsUp className="mr-3 text-primary" size={20} />
                Actionable Improvements
              </h3>
              <ul className="space-y-4 flex-1 mb-8">
                {result.improvements.map((imp, i) => (
                  <li key={i} className="flex items-start text-text-secondary leading-relaxed p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-default">
                    <div className="mt-1 mr-3 min-w-[20px] h-5 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <ArrowRight size={12} className="text-primary" />
                    </div>
                    {imp}
                  </li>
                ))}
              </ul>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
                <div>
                  <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-4 flex items-center"><Target size={14} className="mr-2" /> Keywords Detected</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.map((k, i) => (
                      <span key={i} className="flex items-center px-3 py-1.5 bg-success/10 text-white rounded-lg border border-success/20 text-sm font-medium hover:bg-success/20 transition-colors cursor-default">
                        <CheckCircle size={12} className="mr-1.5 text-success" /> {k}
                      </span>
                    ))}
                  </div>
                </div>
                {result.suggested_keywords && result.suggested_keywords.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-4 flex items-center"><Zap size={14} className="mr-2" /> Suggested Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.suggested_keywords.map((k, i) => (
                        <span key={i} className="flex items-center px-3 py-1.5 bg-yellow-500/10 text-white rounded-lg border border-yellow-500/20 text-sm font-medium hover:bg-yellow-500/20 transition-colors cursor-default">
                          <Hash size={12} className="mr-1.5 text-yellow-500" /> {k}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};