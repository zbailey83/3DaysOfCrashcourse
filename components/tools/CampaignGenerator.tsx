import React, { useState } from 'react';
import { generateCampaignContent } from '../../services/geminiService';
import { GeneratedCampaign } from '../../types';
import { Loader2, Copy, Share2, Layout, Video, Hash, Sparkles, Calendar, Briefcase, Target, Megaphone } from 'lucide-react';

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
  const [adResult, setAdResult] = useState<GeneratedCampaign | null>(null);
  const [calendarResult, setCalendarResult] = useState<GeneratedCalendar | null>(null);

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
      <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-[24px] shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.04)] border border-slate-100 h-fit">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-[#2563EB]/10 rounded-xl mb-4">
            <Sparkles className="text-[#2563EB] w-6 h-6" />
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-[#0F172A] mb-2">Campaign Generator</h2>
          <p className="text-[#64748B] text-sm md:text-base">Generate targeted assets based on your unique business context.</p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-5">
          {/* Business Input Template */}
          <div className="space-y-4">
            <div>
              <label className="flex items-center text-sm font-bold text-[#0F172A] mb-2">
                <Briefcase size={16} className="mr-2 text-slate-400" /> Business Name
              </label>
              <input
                type="text"
                required
                className="w-full p-3.5 bg-[#F8FAFC] border border-slate-100 rounded-xl focus:bg-white focus:border-[#2563EB]/50 focus:ring-4 focus:ring-[#2563EB]/10 outline-none transition-all font-medium text-[#0F172A] placeholder:text-gray-400"
                placeholder="e.g., EcoStride"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-bold text-[#0F172A] mb-2">
                <Target size={16} className="mr-2 text-slate-400" /> Target Audience
              </label>
              <input
                type="text"
                required
                className="w-full p-3.5 bg-[#F8FAFC] border border-slate-100 rounded-xl focus:bg-white focus:border-[#2563EB]/50 focus:ring-4 focus:ring-[#2563EB]/10 outline-none transition-all font-medium text-[#0F172A] placeholder:text-gray-400"
                placeholder="e.g., Urban professionals, 25-35"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-bold text-[#0F172A] mb-2">
                <Megaphone size={16} className="mr-2 text-slate-400" /> Key Offer / Product
              </label>
              <textarea
                required
                className="w-full p-3.5 bg-[#F8FAFC] border border-slate-100 rounded-xl focus:bg-white focus:border-[#2563EB]/50 focus:ring-4 focus:ring-[#2563EB]/10 outline-none transition-all h-24 font-medium text-[#0F172A] placeholder:text-gray-400 resize-none"
                placeholder="Describe what you're promoting..."
                value={keyOffer}
                onChange={(e) => setKeyOffer(e.target.value)}
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-bold text-[#0F172A] mb-2">
                <Target size={16} className="mr-2 text-slate-400" /> Main Goal
              </label>
              <input
                type="text"
                required
                className="w-full p-3.5 bg-[#F8FAFC] border border-slate-100 rounded-xl focus:bg-white focus:border-[#2563EB]/50 focus:ring-4 focus:ring-[#2563EB]/10 outline-none transition-all font-medium text-[#0F172A] placeholder:text-gray-400"
                placeholder="e.g., Drive website traffic, Brand awareness"
                value={mainGoal}
                onChange={(e) => setMainGoal(e.target.value)}
              />
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="p-1 bg-slate-100 rounded-xl flex relative">
            <button
              type="button"
              onClick={() => setMode('ad')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center ${mode === 'ad' ? 'bg-white text-[#2563EB] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Video size={16} className="mr-2" /> Ad Campaign
            </button>
            <button
              type="button"
              onClick={() => setMode('calendar')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center ${mode === 'calendar' ? 'bg-white text-[#2563EB] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Calendar size={16} className="mr-2" /> Content Calendar
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#2563EB] to-[#06B6D4] hover:scale-[1.02] text-white font-bold py-4 rounded-full transition-all shadow-[0px_0px_15px_rgba(37,99,235,0.4)] flex items-center justify-center disabled:opacity-50 disabled:shadow-none disabled:hover:scale-100 relative overflow-hidden"
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
          <div className="h-full flex flex-col items-center justify-center text-[#94A3B8] border-2 border-dashed border-[#E2E8F0] rounded-[24px] p-12 bg-white/50 min-h-[400px]">
            <Layout size={48} className="mb-4 opacity-20" />
            <p className="font-medium">Generated assets will appear here</p>
          </div>
        )}

        {/* Ad Result View */}
        {adResult && mode === 'ad' && (
          <div className="animate-fade-in space-y-6">
            {/* Script Card */}
            <div className="bg-white p-8 rounded-[24px] shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.04)] border border-slate-100 group hover:border-[#2563EB]/30 transition-all hover:shadow-lg duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-[#0F172A] flex items-center text-xl"><Video className="mr-3 text-[#2563EB]" size={20} /> Video Script</h3>
                <button className="text-[#94A3B8] hover:text-[#2563EB] transition-colors p-2 hover:bg-[#EFF6FF] rounded-full"><Copy size={18} /></button>
              </div>
              <div className="bg-[#F8FAFC] p-6 rounded-2xl text-sm font-mono whitespace-pre-wrap text-[#475569] border border-transparent group-hover:border-[#2563EB]/10 transition-colors leading-relaxed">
                {adResult.script}
              </div>
            </div>

            {/* Social Posts */}
            <div className="bg-white p-8 rounded-[24px] shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.04)] border border-slate-100">
              <h3 className="font-display font-bold text-[#0F172A] mb-6 flex items-center text-xl"><Share2 className="mr-3 text-[#06B6D4]" size={20} /> Social Copy</h3>
              <div className="space-y-4">
                {adResult.socialPosts.map((post, idx) => (
                  <div key={idx} className="bg-[#F8FAFC] p-5 rounded-2xl border border-transparent hover:border-[#06B6D4]/20 transition-all hover:bg-white hover:shadow-sm">
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest bg-white px-2 py-1 rounded-md shadow-sm mb-3 inline-block">{post.platform}</span>
                    <p className="mt-1 text-[#0F172A] font-medium leading-relaxed">{post.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SEO Keywords */}
            <div className="bg-white p-8 rounded-[24px] shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.04)] border border-slate-100">
              <h3 className="font-display font-bold text-[#0F172A] mb-6 flex items-center text-xl"><Hash className="mr-3 text-[#10B981]" size={20} /> SEO Targets</h3>
              <div className="flex flex-wrap gap-3">
                {adResult.seoKeywords.map((kw, idx) => (
                  <span key={idx} className="px-4 py-2 bg-[#10B981]/10 text-[#065F46] rounded-full text-sm font-bold border border-[#10B981]/20 hover:scale-105 transition-transform cursor-default">
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
            <div className="bg-white p-8 rounded-[24px] shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.04)] border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-[#0F172A] flex items-center text-xl"><Calendar className="mr-3 text-[#2563EB]" size={20} /> 7-Day Content Plan</h3>
                <button className="text-[#94A3B8] hover:text-[#2563EB] transition-colors p-2 hover:bg-[#EFF6FF] rounded-full"><Copy size={18} /></button>
              </div>

              <div className="space-y-4">
                {calendarResult.calendar.map((day, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row gap-4 p-5 bg-[#F8FAFC] rounded-2xl border border-transparent hover:border-[#2563EB]/20 transition-all hover:bg-white hover:shadow-sm">
                    <div className="flex-shrink-0 w-full md:w-24">
                      <span className="text-xs font-bold text-[#2563EB] bg-[#EFF6FF] px-3 py-1 rounded-full">{day.day}</span>
                      <div className="mt-2 text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">{day.platform}</div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[#0F172A] mb-1">{day.theme}</h4>
                      <p className="text-sm text-[#475569] leading-relaxed">{day.post_idea}</p>
                    </div>
                  </div>
                ))}
              </div>

              {calendarResult.strategy_note && (
                <div className="mt-6 p-5 bg-[#F0FDF4] rounded-2xl border border-[#DCFCE7] text-[#166534] text-sm leading-relaxed">
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