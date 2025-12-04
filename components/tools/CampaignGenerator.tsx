import React, { useState } from 'react';
import { generateCampaignContent } from '../../services/geminiService';
import { GeneratedCampaign } from '../../types';
import { Loader2, Copy, Share2, Layout, Video, Hash, Sparkles } from 'lucide-react';

export const CampaignGenerator: React.FC = () => {
  const [brandName, setBrandName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [audience, setAudience] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedCampaign | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const jsonString = await generateCampaignContent(brandName, productDesc, audience);
      const cleanJson = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(cleanJson);
      setResult({
        script: data.script,
        socialPosts: data.social_posts || [],
        seoKeywords: data.seo_keywords || []
      });
    } catch (error) {
      console.error("Failed to generate campaign", error);
      alert("Failed to generate campaign. Please ensure your API Key is set and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      {/* Input Section */}
      <div className="bg-white p-8 rounded-[24px] shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.04)] border border-black/5 h-fit">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-[#6C4CF4]/10 rounded-xl mb-4">
            <Sparkles className="text-[#6C4CF4] w-6 h-6" />
          </div>
          <h2 className="text-3xl font-display font-bold text-[#1A1A1A] mb-2">Campaign Generator</h2>
          <p className="text-[#7E7E7E]">Instantly generate scripts, social copy, and SEO keywords for your brand.</p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#1A1A1A] mb-2">Brand Name</label>
            <input 
              type="text" 
              required
              className="w-full p-4 bg-[#F7F8FA] border border-transparent rounded-2xl focus:bg-white focus:border-[#6C4CF4]/50 focus:ring-4 focus:ring-[#6C4CF4]/10 outline-none transition-all font-medium text-[#1A1A1A] placeholder:text-gray-400"
              placeholder="e.g., EcoStride"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-[#1A1A1A] mb-2">Product Description</label>
            <textarea 
              required
              className="w-full p-4 bg-[#F7F8FA] border border-transparent rounded-2xl focus:bg-white focus:border-[#6C4CF4]/50 focus:ring-4 focus:ring-[#6C4CF4]/10 outline-none transition-all h-32 font-medium text-[#1A1A1A] placeholder:text-gray-400 resize-none"
              placeholder="Describe the features and benefits..."
              value={productDesc}
              onChange={(e) => setProductDesc(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#1A1A1A] mb-2">Target Audience</label>
            <input 
              type="text" 
              required
              className="w-full p-4 bg-[#F7F8FA] border border-transparent rounded-2xl focus:bg-white focus:border-[#6C4CF4]/50 focus:ring-4 focus:ring-[#6C4CF4]/10 outline-none transition-all font-medium text-[#1A1A1A] placeholder:text-gray-400"
              placeholder="e.g., Urban professionals, 25-35"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#FF7F50] via-[#FF3CAC] to-[#784BA0] hover:scale-[1.02] text-white font-bold py-4 rounded-full transition-all shadow-[0px_0px_15px_rgba(255,88,200,0.5)] flex items-center justify-center disabled:opacity-50 disabled:shadow-none disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" /> Creating Magic...
              </>
            ) : (
              'Generate Campaign Assets'
            )}
          </button>
        </form>
      </div>

      {/* Output Section */}
      <div className="space-y-6">
        {!result && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-[#9CA3AF] border-2 border-dashed border-[#E2E8F0] rounded-[24px] p-12 bg-white/50">
            <Layout size={48} className="mb-4 opacity-20" />
            <p className="font-medium">Campaign assets will appear here</p>
          </div>
        )}

        {result && (
          <div className="animate-fade-in space-y-6">
            {/* Script Card */}
            <div className="bg-white p-8 rounded-[24px] shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.04)] border border-black/5 group hover:border-[#6C4CF4]/30 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-[#1A1A1A] flex items-center text-xl"><Video className="mr-3 text-[#6C4CF4]" size={20}/> Video Script</h3>
                <button className="text-[#9CA3AF] hover:text-[#6C4CF4] transition-colors p-2 hover:bg-[#F7F8FA] rounded-full"><Copy size={18} /></button>
              </div>
              <div className="bg-[#F7F8FA] p-6 rounded-2xl text-sm font-mono whitespace-pre-wrap text-[#4A4A4A] border border-transparent group-hover:border-[#6C4CF4]/10 transition-colors leading-relaxed">
                {result.script}
              </div>
            </div>

            {/* Social Posts */}
            <div className="bg-white p-8 rounded-[24px] shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.04)] border border-black/5">
               <h3 className="font-display font-bold text-[#1A1A1A] mb-6 flex items-center text-xl"><Share2 className="mr-3 text-[#FF3CAC]" size={20}/> Social Copy</h3>
               <div className="space-y-4">
                 {result.socialPosts.map((post, idx) => (
                   <div key={idx} className="bg-[#F9FAFB] p-5 rounded-2xl border border-transparent hover:border-[#FF3CAC]/20 transition-all">
                     <span className="text-[10px] font-bold text-[#7E7E7E] uppercase tracking-widest bg-white px-2 py-1 rounded-md shadow-sm mb-3 inline-block">{post.platform}</span>
                     <p className="mt-1 text-[#1A1A1A] font-medium leading-relaxed">{post.content}</p>
                   </div>
                 ))}
               </div>
            </div>

            {/* SEO Keywords */}
            <div className="bg-white p-8 rounded-[24px] shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.04)] border border-black/5">
               <h3 className="font-display font-bold text-[#1A1A1A] mb-6 flex items-center text-xl"><Hash className="mr-3 text-[#60D46B]" size={20}/> SEO Targets</h3>
               <div className="flex flex-wrap gap-3">
                 {result.seoKeywords.map((kw, idx) => (
                   <span key={idx} className="px-4 py-2 bg-[#60D46B]/10 text-[#1A1A1A] rounded-full text-sm font-bold border border-[#60D46B]/20">
                     #{kw}
                   </span>
                 ))}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};