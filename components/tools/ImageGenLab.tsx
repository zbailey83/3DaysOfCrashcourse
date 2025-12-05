import React, { useState, useEffect } from 'react';
import { generateImage } from '../../services/geminiService';
import { Loader2, Image as ImageIcon, Wand2, AlertTriangle, Sparkles, BookOpen, Save, Search, X, Tag, Filter, Trash2, Sliders, Camera, Sun, Palette, Hash } from 'lucide-react';

interface PromptEntry {
  id: string;
  title: string;
  prompt: string;
  style: string;
  category: string;
  isCustom?: boolean;
}

interface ImageGenLabProps {
  initialAction?: 'openLibrary';
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

export const ImageGenLab: React.FC<ImageGenLabProps> = ({ initialAction }) => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Cinematic');
  const [lighting, setLighting] = useState('Studio');
  const [camera, setCamera] = useState('Default');
  const [mood, setMood] = useState('Neutral');
  const [seed, setSeed] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Library State
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [libraryPrompts, setLibraryPrompts] = useState<PromptEntry[]>(DEFAULT_LIBRARY);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Handle Initial Action (Deep Linking)
  useEffect(() => {
    if (initialAction === 'openLibrary') {
      setIsLibraryOpen(true);
    }
  }, [initialAction]);

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

    let fullPrompt = `${style} style. ${prompt}`;
    if (lighting !== 'Default') fullPrompt += `, ${lighting} lighting`;
    if (camera !== 'Default') fullPrompt += `, ${camera} view`;
    if (mood !== 'Neutral') fullPrompt += `, ${mood} mood`;
    if (seed) fullPrompt += ` (Seed: ${seed})`;

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
    <div className="flex flex-col h-full max-w-6xl mx-auto relative animate-slide-up">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-text-primary mb-2">Visual Prompt Lab</h2>
        <p className="text-muted">Experiment with styles, lighting, and camera angles to master the text-to-image pipeline.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1">
        {/* Controls */}
        <div className="w-full lg:w-[400px] space-y-6 flex-shrink-0">
          <div className="glass-card p-6 md:p-8 rounded-[24px]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-lg mr-3">
                  <Sliders className="text-primary w-4 h-4" />
                </div>
                <h3 className="font-display font-bold text-text-primary">Configuration</h3>
              </div>
              <button
                onClick={() => setIsLibraryOpen(true)}
                className="flex items-center text-xs font-bold text-primary bg-primary/5 px-3 py-2 rounded-full hover:bg-primary/10 transition-colors"
              >
                <BookOpen size={14} className="mr-1.5" /> Library
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Visual Description</label>
                <textarea
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:bg-white/10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all h-32 resize-none font-medium text-white placeholder:text-slate-500"
                  placeholder="A futuristic city with flying cars at sunset..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              {/* Style Mixer */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center text-xs font-bold text-muted uppercase tracking-wider mb-1">
                  <Palette size={12} className="mr-1.5" /> Style Mixer
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-muted mb-1.5">Art Style</label>
                    <select
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-primary [&>option]:bg-slate-900 [&>option]:text-white"
                    >
                      {['Cinematic', 'Photorealistic', '3D Render', 'Oil Painting', 'Cyberpunk', 'Minimalist', 'Anime', 'Watercolor'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted mb-1.5">Lighting</label>
                    <select
                      value={lighting}
                      onChange={(e) => setLighting(e.target.value)}
                      className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-primary [&>option]:bg-slate-900 [&>option]:text-white"
                    >
                      {['Default', 'Studio', 'Golden Hour', 'Neon', 'Natural', 'Dramatic', 'Softbox'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted mb-1.5">Camera</label>
                    <select
                      value={camera}
                      onChange={(e) => setCamera(e.target.value)}
                      className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-primary [&>option]:bg-slate-900 [&>option]:text-white"
                    >
                      {['Default', 'Wide Angle', 'Macro', 'Drone', 'Portrait', 'Telephoto'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted mb-1.5">Mood</label>
                    <select
                      value={mood}
                      onChange={(e) => setMood(e.target.value)}
                      className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-primary [&>option]:bg-slate-900 [&>option]:text-white"
                    >
                      {['Neutral', 'Happy', 'Dark', 'Ethereal', 'Energetic', 'Calm'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Seed Input */}
                <div>
                  <label className="block text-[10px] font-bold text-muted mb-1.5 flex items-center"><Hash size={10} className="mr-1" /> Seed (Optional)</label>
                  <input
                    type="number"
                    placeholder="Random"
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-primary placeholder:text-slate-500"
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleGenerate}
                  disabled={loading || !prompt}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary hover:scale-[1.02] text-white font-bold py-4 rounded-full transition-all shadow-glow flex items-center justify-center disabled:opacity-50 disabled:shadow-none disabled:hover:scale-100"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <><Wand2 className="mr-2" size={18} /> Generate</>}
                </button>
                <button
                  onClick={handleSaveToLibrary}
                  disabled={!prompt}
                  className="p-4 rounded-full bg-white/5 text-muted hover:text-primary hover:bg-white/10 border border-transparent hover:border-primary/20 transition-all disabled:opacity-50"
                  title="Save to Library"
                >
                  <Save size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 glass-card rounded-[24px] flex items-center justify-center overflow-hidden relative min-h-[500px] p-4">
          <div className="absolute top-0 left-0 w-full h-full bg-slate-900/50 opacity-50 z-0"></div>

          {loading && (
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-white/10 border-t-primary animate-spin"></div>
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" size={24} />
              </div>
              <p className="mt-6 text-lg font-display font-bold text-white animate-[pulse-soft_2s_infinite]">Dreaming up your image...</p>
            </div>
          )}

          {generatedImage ? (
            <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden shadow-2xl animate-fade-in group">
              <img
                src={generatedImage}
                alt="Generated Result"
                className="w-full h-full object-contain bg-black"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-end">
                <p className="text-white/90 text-sm font-medium line-clamp-2 w-3/4">{prompt}</p>
                <button className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-white hover:text-black transition-colors">Download</button>
              </div>
            </div>
          ) : error ? (
            <div className="text-center p-8 max-w-md z-10 animate-fade-in">
              <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="text-danger" size={32} />
              </div>
              <h3 className="font-display font-bold text-white text-lg mb-2">Generation Failed</h3>
              <p className="text-muted leading-relaxed">{error}</p>
            </div>
          ) : (
            <div className="text-center text-muted z-10">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="opacity-40" size={40} />
              </div>
              <h3 className="font-display font-bold text-white text-xl mb-2">Preview Canvas</h3>
              <p className="text-sm font-medium">Your AI-generated artwork will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Prompt Library Modal */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsLibraryOpen(false)} />
          <div className="glass-panel rounded-[24px] w-full max-w-4xl max-h-[85vh] flex flex-col relative animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)] border border-white/20">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-display font-bold text-text-primary">Prompt Library</h2>
                <p className="text-sm text-muted">Discover effective prompts or access your saved favorites.</p>
              </div>
              <button onClick={() => setIsLibraryOpen(false)} className="p-2 text-muted hover:text-white hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Filters */}
            <div className="p-6 bg-white/5 border-b border-white/10 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search prompts..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary/50 text-sm font-medium text-white placeholder:text-slate-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${selectedCategory === cat
                      ? 'bg-primary text-white shadow-glow'
                      : 'bg-white/5 text-muted border border-white/10 hover:border-primary hover:text-primary'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Grid */}
            <div className="flex-1 overflow-y-auto p-6 bg-transparent">
              {filteredPrompts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-muted">
                  <Filter size={32} className="mb-3 opacity-50" />
                  <p className="font-medium">No prompts found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPrompts.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectFromLibrary(item)}
                      className="text-left bg-white/5 p-5 rounded-2xl shadow-sm border border-white/10 hover:shadow-glow hover:border-primary/30 hover:-translate-y-0.5 transition-all group relative"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-text-primary font-display">{item.title}</h4>
                        <div className="flex gap-2">
                          {item.isCustom && (
                            <div
                              onClick={(e) => handleDeletePrompt(item.id, e)}
                              className="p-1 text-danger/70 hover:text-danger hover:bg-danger/10 rounded transition-colors z-10"
                            >
                              <Trash2 size={14} />
                            </div>
                          )}
                          <span className="text-[10px] font-bold bg-white/10 text-muted px-2 py-1 rounded-md uppercase tracking-wider border border-white/10">
                            {item.style}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-text-secondary line-clamp-3 leading-relaxed mb-3">
                        {item.prompt}
                      </p>
                      <div className="flex items-center text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
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