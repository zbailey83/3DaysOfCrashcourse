import React from 'react';
import { ViewState } from '../App';
import { Home, BookOpen, PenTool, Image as ImageIcon, Search, BarChart, X, Sparkles } from 'lucide-react';

interface SidebarProps {
  onNavigate: (view: ViewState) => void;
  currentView: ViewState;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentView, onCloseMobile }) => {
  const navItemClass = (isActive: boolean) => 
    `flex items-center w-full px-5 py-3.5 mb-1.5 rounded-full transition-all duration-300 group ${
      isActive 
      ? 'bg-gradient-to-r from-[#6C4CF4] to-[#C84FF1] text-white shadow-[0px_4px_12px_rgba(108,76,244,0.3)] transform scale-[1.02]' 
      : 'text-[#4A4A4A] hover:bg-slate-50 hover:text-[#6C4CF4]'
    }`;

  const handleNav = (view: ViewState) => {
    onNavigate(view);
    if (onCloseMobile) onCloseMobile();
  }

  return (
    <div className="flex flex-col h-full p-6 relative">
      <div className="flex items-center justify-between mb-10 px-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C4CF4] to-[#C84FF1] flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <h1 className="text-2xl font-display font-bold text-[#1A1A1A] tracking-tight">MarketerAI</h1>
        </div>
        <button onClick={onCloseMobile} className="md:hidden p-2 text-slate-400 hover:text-slate-800">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-[11px] font-bold text-[#7E7E7E] uppercase tracking-widest mb-4 px-5">Dashboard</h2>
          <button 
            onClick={() => handleNav({ type: 'dashboard' })}
            className={navItemClass(currentView.type === 'dashboard')}
          >
            <Home size={20} className="mr-3 stroke-[1.5]" />
            <span className="font-medium text-[15px]">Overview</span>
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-[11px] font-bold text-[#7E7E7E] uppercase tracking-widest mb-4 px-5">Creative Suite</h2>
          
          <button 
            onClick={() => handleNav({ type: 'tool', toolName: 'campaign' })}
            className={navItemClass(currentView.type === 'tool' && currentView.toolName === 'campaign')}
          >
            <PenTool size={20} className="mr-3 stroke-[1.5]" />
            <span className="font-medium text-[15px]">Campaign Gen</span>
          </button>

          <button 
            onClick={() => handleNav({ type: 'tool', toolName: 'image' })}
            className={navItemClass(currentView.type === 'tool' && currentView.toolName === 'image')}
          >
            <ImageIcon size={20} className="mr-3 stroke-[1.5]" />
            <span className="font-medium text-[15px]">Visual Lab</span>
          </button>

          <button 
            onClick={() => handleNav({ type: 'tool', toolName: 'seo' })}
            className={navItemClass(currentView.type === 'tool' && currentView.toolName === 'seo')}
          >
            <Search size={20} className="mr-3 stroke-[1.5]" />
            <span className="font-medium text-[15px]">SEO Analyzer</span>
          </button>
        </div>
      </nav>

      <div className="p-5 bg-[#F7F8FA] rounded-3xl mt-auto border border-black/5">
        <div className="flex items-center justify-between mb-2">
            <h3 className="font-display font-bold text-[#1A1A1A]">Daily Streak</h3>
            <span className="text-xs font-bold text-[#FF7F50] bg-[#FF7F50]/10 px-2 py-1 rounded-full">🔥 12 Days</span>
        </div>
        <p className="text-xs text-[#7E7E7E] mb-3">You're on fire! Keep learning to maintain your streak.</p>
        <div className="w-full bg-white rounded-full h-2.5 overflow-hidden border border-black/5">
          <div className="bg-gradient-to-r from-[#FF7F50] to-[#FF3CAC] h-full rounded-full w-3/4"></div>
        </div>
      </div>
    </div>
  );
};