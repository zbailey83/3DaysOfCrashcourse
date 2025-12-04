import React, { useState } from 'react';
import { generateImage } from '../../services/geminiService';
import { Loader2, Image as ImageIcon, Wand2, AlertTriangle, Sparkles, BookOpen, Save, Search, X, Tag, Filter, Trash2 } from 'lucide-react';

interface PromptEntry {
  id: string;
  title: string;
  prompt: string;
  style: string;
  category: string;
  isCustom?: boolean;
}

const DEFAULT_LIBRARY: PromptEntry[] = [
  {
    id: '1',
    title: 'Neon Cyberpunk City',
    prompt: 'A futuristic city with flying cars at sunset, neon lights, cyberpunk aesthetic, rain-slicked streets, highly detailed, 8k resolution.',
    style: 'Cyberpunk',
    category: 'Environment'
  },
  {
    id: '2',
    title: 'Minimalist Tech Product',
    prompt: 'Sleek modern gadget on a white background, studio lighting, 4k resolution, product photography, minimalist design, soft shadows.',
    style: 'Minimalist',
    category: 'Marketing'
  },
  {
    id: '3',
    title: 'Corporate Portrait',
    prompt: 'Professional headshot of a diverse team leader, confident smile, blurred office background, cinematic lighting, high quality.',
    style: 'Photorealistic',
    category: 'People'
  },
  {
    id: '4',
    title: 'Abstract Data Flow',
    prompt: 'Swirling streams of glowing data particles, blue and purple gradient, 3d render, abstract visualization of internet speed, motion blur.',
    style: '3D Render',
    category: 'Abstract'
  },
  {
    id: '5',
    title: 'Luxury Perfume Bottle',
    prompt: 'Elegant glass perfume bottle on a marble surface, gold accents, soft floral elements in background, macro photography, bokeh effect.',
    style: 'Cinematic',
    category: 'Marketing'
  },
  {
    id: '6',
    title: 'Oil Painting Landscape',
    prompt: 'Rolling hills of Tuscany at golden hour, cypress trees, textured brushstrokes, vibrant colors, impressionist style, masterpiece.',
    style: 'Oil Painting',
    category: 'Environment'
  }
];

export const ImageGenLab: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Cinematic');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Library State
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [libraryPrompts, setLibraryPrompts] = useState<PromptEntry[]>(DEFAULT_LIBRARY);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Derived Library Data
  const categories = ['All', 'Custom', ...Array.from(new Set(DEFAULT_LIBRARY.map(p => p.category)))];
  
  const filteredPrompts = libraryPrompts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' 
        ? true 
        : selectedCategory === 'Custom' 
            ? p.isCustom 
            : p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    const fullPrompt = `${style} style. ${prompt}`;

    try {
      const imgData = await generateImage(fullPrompt);
      setGeneratedImage(imgData);
    } catch (e) {
      setError("Failed to generate image. Note: Image generation might require a specific paid tier or model access.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToLibrary = () => {
    if (!prompt) return;
    const newEntry: PromptEntry = {
      id: Date.now().toString(),
      title: `Saved Prompt ${libraryPrompts.filter(p => p.isCustom).length + 1}`,
      prompt: prompt,
      style: style,
      category: 'Marketing', // Default to marketing
      isCustom: true
    };
    setLibraryPrompts([newEntry, ...libraryPrompts]);
  };

  const handleSelectFromLibrary = (entry: PromptEntry) => {
    setPrompt(entry.prompt);
    setStyle(entry.style);
    setIsLibraryOpen(false);
  };

  const handleDeletePrompt = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLibraryPrompts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto relative">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-[#1A1A1A] mb-2">Visual Prompt Lab</h2>
        <p className="text-[#7E7E7E]">Experiment with styles and adjectives to master the text-to-image pipeline.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1">
        {/* Controls */}
        <div className="w-full lg:w-[400px] space-y-6 flex-shrink-0">
          <div className="bg-white p-8 rounded-[24px] shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.04)] border border-black/5">
            <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center">
                    <div className="p-2 bg-[#6C4CF4]/10 rounded-lg mr-3">
                        <Sparkles className="text-[#6C4CF4] w-4 h-4" />
                    </div>
                    <h3 className="font-display font-bold text-[#1A1A1A]">Configuration</h3>
                 </div>
                 <button 
                    onClick={() => setIsLibraryOpen(true)}
                    className="flex items-center text-xs font-bold text-[#6C4CF4] bg-[#6C4CF4]/5 px-3 py-2 rounded-full hover:bg-[#6C4CF4]/10 transition-colors"
                 >
                    <BookOpen size={14} className="mr-1.5" /> Library
                 </button>
            </div>
            
            <label className="block text-xs font-bold text-[#7E7E7E] uppercase tracking-wider mb-2">Visual Description</label>
            <textarea 
              className="w-full p-4 bg-[#F7F8FA] border border-transparent rounded-2xl focus:bg-white focus:border-[#6C4CF4]/50 focus:ring-4 focus:ring-[#6C4CF4]/10 outline-none transition-all h-40 resize-none font-medium text-[#1A1A1A] placeholder:text-gray-400 mb-2"
              placeholder="A futuristic city with flying cars at sunset, neon lights, cyberpunk aesthetic..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <p className="text-xs text-[#9CA3AF] mb-6">Tip: Be specific about lighting, camera angle, and mood.</p>

            <label className="block text-xs font-bold text-[#7E7E7E] uppercase tracking-wider mb-2">Art Style</label>
            <div className="grid grid-cols-2 gap-2 mb-8">
              {['Cinematic', 'Photorealistic', '3D Render', 'Oil Painting', 'Cyberpunk', 'Minimalist'].map(s => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`px-3 py-3 rounded-xl text-sm font-semibold transition-all border ${
                    style === s 
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md' 
                    : 'bg-white text-[#4A4A4A] border-gray-100 hover:border-gray-300 hover:bg-[#F9FAFB]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
                <button
                    onClick={handleGenerate}
                    disabled={loading || !prompt}
                    className="flex-1 bg-gradient-to-r from-[#6C4CF4] to-[#C84FF1] hover:scale-[1.02] text-white font-bold py-4 rounded-full transition-all shadow-[0px_8px_20px_rgba(108,76,244,0.3)] flex items-center justify-center disabled:opacity-50 disabled:shadow-none disabled:hover:scale-100"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <><Wand2 className="mr-2" size={18}/> Generate</>}
                </button>
                <button 
                    onClick={handleSaveToLibrary}
                    disabled={!prompt}
                    className="p-4 rounded-full bg-[#F7F8FA] text-[#4A4A4A] hover:text-[#6C4CF4] hover:bg-[#6C4CF4]/5 border border-transparent hover:border-[#6C4CF4]/20 transition-all disabled:opacity-50"
                    title="Save to Library"
                >
                    <Save size={20} />
                </button>
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 bg-white rounded-[24px] shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.04)] border border-black/5 flex items-center justify-center overflow-hidden relative min-h-[500px] p-4">
          <div className="absolute top-0 left-0 w-full h-full bg-[#F9FAFB] opacity-50 z-0"></div>
          
          {loading && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
               <div className="relative">
                 <div className="w-20 h-20 rounded-full border-4 border-[#F0F0F0] border-t-[#6C4CF4] animate-spin"></div>
                 <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#6C4CF4]" size={24} />
               </div>
               <p className="mt-6 text-lg font-display font-bold text-[#1A1A1A] animate-pulse">Dreaming up your image...</p>
            </div>
          )}

          {generatedImage ? (
            <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden shadow-2xl animate-fade-in group">
                <img 
                src={generatedImage} 
                alt="Generated Result" 
                className="w-full h-full object-contain bg-[#1A1A1A]" 
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-end">
                    <p className="text-white/90 text-sm font-medium line-clamp-2 w-3/4">{prompt}</p>
                    <button className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-white hover:text-black transition-colors">Download</button>
                </div>
            </div>
          ) : error ? (
            <div className="text-center p-8 max-w-md z-10">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="text-red-500" size={32} />
                </div>
                <h3 className="font-display font-bold text-[#1A1A1A] text-lg mb-2">Generation Failed</h3>
                <p className="text-[#7E7E7E] leading-relaxed">{error}</p>
            </div>
          ) : (
            <div className="text-center text-[#9CA3AF] z-10">
              <div className="w-24 h-24 bg-[#F0F0F0] rounded-full flex items-center justify-center mx-auto mb-6">
                 <ImageIcon className="opacity-40" size={40} />
              </div>
              <h3 className="font-display font-bold text-[#1A1A1A] text-xl mb-2">Preview Canvas</h3>
              <p className="text-sm font-medium">Your AI-generated artwork will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Prompt Library Modal */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#1A1A1A]/30 backdrop-blur-sm" onClick={() => setIsLibraryOpen(false)} />
            <div className="bg-white rounded-[24px] shadow-[0px_8px_30px_rgba(0,0,0,0.12)] w-full max-w-4xl max-h-[85vh] flex flex-col relative animate-fade-in border border-white/20">
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-display font-bold text-[#1A1A1A]">Prompt Library</h2>
                        <p className="text-sm text-[#7E7E7E]">Discover effective prompts or access your saved favorites.</p>
                    </div>
                    <button onClick={() => setIsLibraryOpen(false)} className="p-2 text-[#9CA3AF] hover:text-[#1A1A1A] hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Filters */}
                <div className="p-6 bg-[#F9FAFB] border-b border-gray-100 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search prompts..." 
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C4CF4]/20 focus:border-[#6C4CF4]/50 text-sm font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                                    selectedCategory === cat 
                                    ? 'bg-[#1A1A1A] text-white shadow-md' 
                                    : 'bg-white text-[#7E7E7E] border border-gray-200 hover:border-[#6C4CF4] hover:text-[#6C4CF4]'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Grid */}
                <div className="flex-1 overflow-y-auto p-6 bg-[#F7F8FA]">
                    {filteredPrompts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-[#9CA3AF]">
                            <Filter size={32} className="mb-3 opacity-50" />
                            <p className="font-medium">No prompts found.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredPrompts.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => handleSelectFromLibrary(item)}
                                    className="text-left bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#6C4CF4]/30 hover:-translate-y-0.5 transition-all group relative"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-[#1A1A1A] font-display">{item.title}</h4>
                                        <div className="flex gap-2">
                                            {item.isCustom && (
                                                <button 
                                                    onClick={(e) => handleDeletePrompt(item.id, e)}
                                                    className="p-1 text-red-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                            <span className="text-[10px] font-bold bg-[#F0F0F0] text-[#7E7E7E] px-2 py-1 rounded-md uppercase tracking-wider">
                                                {item.style}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-[#4A4A4A] line-clamp-3 leading-relaxed mb-3">
                                        {item.prompt}
                                    </p>
                                    <div className="flex items-center text-xs font-bold text-[#6C4CF4] opacity-0 group-hover:opacity-100 transition-opacity">
                                        Use this prompt <Wand2 size={12} className="ml-1" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
