import React, { useState } from 'react';
import { generateCampaignContent } from '../../services/geminiService';
import { GeneratedCampaign } from '../../types';
import { supabase } from '../../lib/supabase';
import { useArtifacts } from '../../hooks/useArtifacts';
import { Loader2, Copy, Share2, Layout, Video, Hash, Sparkles, Calendar, Briefcase, Target, Megaphone, Save } from 'lucide-react';

interface CalendarDay {
  day: string;
  theme: string;
  post_idea: string;
  platform: string;
}

interface GeneratedCalendar {
  calendar: CalendarDay[];
  strategy_note: string;
}

export const CampaignGenerator: React.FC = () => {
  // Business Input State
  const [businessName, setBusinessName] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [keyOffer, setKeyOffer] = useState('');
  const [mainGoal, setMainGoal] = useState('');

  // Generator State
  const [mode, setMode] = useState<'ad' | 'calendar'>('ad');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [adResult, setAdResult] = useState<GeneratedCampaign | null>(null);
  const [calendarResult, setCalendarResult] = useState<GeneratedCalendar | null>(null);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  const { saveArtifact } = useArtifacts(userId);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id);
    });
  }, []);

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      if (mode === 'ad' && adResult) {
        await saveArtifact({
          user_id: userId,
          type: 'campaign',
          title: `${businessName || 'Untitled'} - Ad Campaign`,
          content: adResult,
        });
      } else if (mode === 'calendar' && calendarResult) {
        await saveArtifact({
          user_id: userId,
          type: 'campaign',
          title: `${businessName || 'Untitled'} - Content Calendar`,
          content: calendarResult,
        });
      }
      alert('Saved to workspace!');
    } catch (e) {
      console.error(e);
      alert('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAdResult(null);
    setCalendarResult(null);

    // Construct a rich product description from inputs
    const richProductDesc = `
      Offer: ${keyOffer}
      Goal: ${mainGoal}
    `.trim();

    try {
      const jsonString = await generateCampaignContent(businessName, richProductDesc, targetAudience, mode);
      const cleanJson = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(cleanJson);

      if (mode === 'ad') {
        setAdResult({
          script: data.script,
          socialPosts: data.social_posts || [],
          seoKeywords: data.seo_keywords || []
        });
      } else {
        setCalendarResult({
          calendar: data.calendar || [],
          strategy_note: data.strategy_note || ''
        });
      }
    } catch (error) {
      console.error("Failed to generate content", error);
      alert("Failed to generate content. Please ensure your API Key is set and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full animate-slide-up">
      {/* Input Section */}
      <div className="lg:col-span-5 glass-card p-6 md:p-8 rounded-[24px] h-fit">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-xl mb-4">
            <Sparkles className="text-primary w-6 h-6" />
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-text-primary mb-2">Campaign Generator</h2>
          <p className="text-muted text-sm md:text-base">Generate targeted assets based on your unique business context.</p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-5">
          {/* Business Input Template */}
          <div className="space-y-4">
            <div>
              <label className="flex items-center text-sm font-bold text-text-primary mb-2">
                <Briefcase size={16} className="mr-2 text-muted" /> Business Name
              </label>
              <input
                type="text"
                required
                className="w-full p-3.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl focus:bg-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-text-primary placeholder:text-muted shadow-inner backdrop-blur-sm"
                placeholder="e.g., EcoStride"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-bold text-text-primary mb-2">
                <Target size={16} className="mr-2 text-muted" /> Target Audience
              </label>
              <input
                type="text"
                required
                className="w-full p-3.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl focus:bg-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-text-primary placeholder:text-muted shadow-inner backdrop-blur-sm"
                placeholder="e.g., Urban professionals, 25-35"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-bold text-text-primary mb-2">
                <Megaphone size={16} className="mr-2 text-muted" /> Key Offer / Product
              </label>
              <textarea
                required
                className="w-full p-3.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl focus:bg-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all h-24 font-medium text-text-primary placeholder:text-muted resize-none shadow-inner backdrop-blur-sm"
                placeholder="Describe what you're promoting..."
                value={keyOffer}
                onChange={(e) => setKeyOffer(e.target.value)}
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-bold text-text-primary mb-2">
                <Target size={16} className="mr-2 text-muted" /> Main Goal
              </label>
              <input
                type="text"
                required
                className="w-full p-3.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl focus:bg-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-text-primary placeholder:text-muted shadow-inner backdrop-blur-sm"
                placeholder="e.g., Drive website traffic, Brand awareness"
                value={mainGoal}
                onChange={(e) => setMainGoal(e.target.value)}
              />
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="p-1 bg-black/5 dark:bg-white/5 rounded-xl flex relative border border-black/10 dark:border-white/10">
            <button
              type="button"
              onClick={() => setMode('ad')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center ${mode === 'ad' ? 'bg-primary/20 text-text-primary dark:text-white shadow-glow' : 'text-muted hover:text-text-primary'}`}
            >
              <Video size={16} className="mr-2" /> Ad Campaign
            </button>
            <button
              type="button"
              onClick={() => setMode('calendar')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center ${mode === 'calendar' ? 'bg-primary/20 text-text-primary dark:text-white shadow-glow' : 'text-muted hover:text-text-primary'}`}
            >
              <Calendar size={16} className="mr-2" /> Content Calendar
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:scale-[1.02] text-white font-bold py-4 rounded-full transition-all shadow-glow flex items-center justify-center disabled:opacity-50 disabled:shadow-none disabled:hover:scale-100 relative overflow-hidden"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" /> Generating...
              </>
            ) : (
              `Generate ${mode === 'ad' ? 'Campaign' : 'Calendar'}`
            )}
          </button>
        </form>
      </div>

      {/* Output Section */}
      <div className="lg:col-span-7 space-y-6">
        {!adResult && !calendarResult && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-muted border-2 border-dashed border-white/10 rounded-[24px] p-12 bg-white/5 min-h-[400px]">
            <Layout size={48} className="mb-4 opacity-20" />
            <p className="font-medium">Generated assets will appear here</p>
          </div>
        )}

        {/* Ad Result View */}
        {adResult && mode === 'ad' && (
          <div className="animate-fade-in space-y-6">
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/20 transition-colors flex items-center border border-primary/20"
              >
                {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
                Save Campaign
              </button>
            </div>
            {/* Script Card */}
            <div className="glass-card p-8 rounded-[24px] group hover:border-primary/30 transition-all hover:shadow-glow duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-text-primary flex items-center text-xl"><Video className="mr-3 text-primary" size={20} /> Video Script</h3>
                <button className="text-muted hover:text-primary transition-colors p-2 hover:bg-white/5 rounded-full"><Copy size={18} /></button>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl text-sm font-mono whitespace-pre-wrap text-text-secondary border border-transparent group-hover:border-primary/10 transition-colors leading-relaxed">
                {adResult.script}
              </div>
            </div>

            {/* Social Posts */}
            <div className="glass-card p-8 rounded-[24px]">
              <h3 className="font-display font-bold text-text-primary mb-6 flex items-center text-xl"><Share2 className="mr-3 text-secondary" size={20} /> Social Copy</h3>
              <div className="space-y-4">
                {adResult.socialPosts.map((post, idx) => (
                  <div key={idx} className="bg-white/5 p-5 rounded-2xl border border-transparent hover:border-secondary/20 transition-all hover:bg-white/10 hover:shadow-sm">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-widest bg-white/10 px-2 py-1 rounded-md shadow-sm mb-3 inline-block">{post.platform}</span>
                    <p className="mt-1 text-text-primary font-medium leading-relaxed">{post.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SEO Keywords */}
            <div className="glass-card p-8 rounded-[24px]">
              <h3 className="font-display font-bold text-text-primary mb-6 flex items-center text-xl"><Hash className="mr-3 text-success" size={20} /> SEO Targets</h3>
              <div className="flex flex-wrap gap-3">
                {adResult.seoKeywords.map((kw, idx) => (
                  <span key={idx} className="px-4 py-2 bg-success/10 text-success rounded-full text-sm font-bold border border-success/20 hover:scale-105 transition-transform cursor-default">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Calendar Result View */}
        {calendarResult && mode === 'calendar' && (
          <div className="animate-fade-in space-y-6">
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/20 transition-colors flex items-center border border-primary/20"
              >
                {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
                Save Calendar
              </button>
            </div>
            <div className="glass-card p-8 rounded-[24px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-text-primary flex items-center text-xl"><Calendar className="mr-3 text-primary" size={20} /> 7-Day Content Plan</h3>
                <button className="text-muted hover:text-primary transition-colors p-2 hover:bg-white/5 rounded-full"><Copy size={18} /></button>
              </div>

              <div className="space-y-4">
                {calendarResult.calendar.map((day, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row gap-4 p-5 bg-white/5 rounded-2xl border border-transparent hover:border-primary/20 transition-all hover:bg-white/10 hover:shadow-sm">
                    <div className="flex-shrink-0 w-full md:w-24">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">{day.day}</span>
                      <div className="mt-2 text-[10px] font-semibold text-muted uppercase tracking-wider">{day.platform}</div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-text-primary mb-1">{day.theme}</h4>
                      <p className="text-sm text-text-secondary leading-relaxed">{day.post_idea}</p>
                    </div>
                  </div>
                ))}
              </div>

              {calendarResult.strategy_note && (
                <div className="mt-6 p-5 bg-success/5 rounded-2xl border border-success/20 text-success text-sm leading-relaxed">
                  <span className="font-bold block mb-1">💡 Strategy Note:</span>
                  {calendarResult.strategy_note}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};