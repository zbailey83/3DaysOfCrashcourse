import React, { useState, useEffect } from 'react';
import { ViewState } from '../App';
import { Home, PenTool, Image as ImageIcon, Search, X, Sparkles, Sliders, FolderOpen, User, Sun, Moon, LayoutDashboard, BookOpen, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SidebarProps {
  onNavigate: (view: ViewState) => void;
  currentView: ViewState;
  onCloseMobile?: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentView, onCloseMobile, theme, onToggleTheme }) => {
  const [profile, setProfile] = useState<{ full_name: string; email: string; avatar_url: string } | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) setProfile(data);
      }
    };
    getProfile();
  }, []);

  // Active state: Glass tile with left accent border
  const navItemClass = (isActive: boolean) =>
    `flex items-center w-full px-5 py-3 mb-2 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive
      ? 'bg-primary/10 text-text-primary shadow-lg border-l-4 border-primary'
      : 'text-muted hover:bg-primary/5 hover:text-text-primary'
    }`;

  const handleNav = (view: ViewState) => {
    onNavigate(view);
    if (onCloseMobile) onCloseMobile();
  }

  return (
    <div className="flex flex-col h-full p-6 relative glass-panel border-r border-border-light shadow-2xl transition-colors duration-300">

      {/* Logo Area */}
      <div className="flex items-center justify-between mb-10 pl-2">
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => handleNav({ type: 'profile' })}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="text-white w-5 h-5 group-hover:rotate-12 transition-transform" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-text-primary tracking-tight leading-none">MarketerAI</h1>
            <span className="text-[10px] uppercase tracking-widest text-primary font-semibold opacity-80">Pro Suite</span>
          </div>
        </div>

        {/* Theme Toggle (Desktop) */}
        <button
          onClick={onToggleTheme}
          className="hidden md:flex p-2 rounded-full hover:bg-primary/10 text-muted hover:text-primary transition-colors"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Mobile Close */}
        <button onClick={onCloseMobile} className="md:hidden p-2 text-muted hover:text-text-primary transition-colors rounded-lg hover:bg-white/5">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto space-y-8">

        {/* Main Section */}
        <div>
          <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4 px-5">Dashboard</h2>
          <div className="space-y-1">
            <button
              onClick={() => handleNav({ type: 'profile' })}
              className={navItemClass(currentView.type === 'profile')}
            >
              <LayoutDashboard size={18} className="mr-3 stroke-[1.5]" />
              <span className="font-medium text-sm">Overview</span>
            </button>
            <button
              onClick={() => handleNav({ type: 'dashboard' })}
              className={navItemClass(currentView.type === 'dashboard')}
            >
              <BookOpen size={18} className="mr-3 stroke-[1.5]" />
              <span className="font-medium text-sm">Course Modules</span>
            </button>
            <button
              onClick={() => handleNav({ type: 'workspace' })}
              className={navItemClass(currentView.type === 'workspace')}
            >
              <FolderOpen size={18} className="mr-3 stroke-[1.5]" />
              <span className="font-medium text-sm">My Workspace</span>
            </button>
          </div>
        </div>

        {/* Tools Section */}
        <div>
          <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4 px-5">Creative Suite</h2>
          <div className="space-y-1">
            <button
              onClick={() => handleNav({ type: 'tool', toolName: 'brand-voice' })}
              className={navItemClass(currentView.type === 'tool' && currentView.toolName === 'brand-voice')}
            >
              <Sliders size={18} className="mr-3 stroke-[1.5]" />
              <span className="font-medium text-sm">Brand Voice DNA</span>
            </button>

            <button
              onClick={() => handleNav({ type: 'tool', toolName: 'campaign' })}
              className={navItemClass(currentView.type === 'tool' && currentView.toolName === 'campaign')}
            >
              <PenTool size={18} className="mr-3 stroke-[1.5]" />
              <span className="font-medium text-sm">Campaign Gen</span>
            </button>

            <button
              onClick={() => handleNav({ type: 'tool', toolName: 'image' })}
              className={navItemClass(currentView.type === 'tool' && currentView.toolName === 'image')}
            >
              <ImageIcon size={18} className="mr-3 stroke-[1.5]" />
              <span className="font-medium text-sm">Visual Lab</span>
            </button>

            <button
              onClick={() => handleNav({ type: 'tool', toolName: 'seo' })}
              className={navItemClass(currentView.type === 'tool' && currentView.toolName === 'seo')}
            >
              <Search size={18} className="mr-3 stroke-[1.5]" />
              <span className="font-medium text-sm">SEO Analyzer</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="mt-auto pt-6 border-t border-border-light">
        <button
          onClick={() => handleNav({ type: 'profile' })}
          className="flex items-center w-full p-3 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-transparent dark:border-white/5 transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border border-black/10 dark:border-white/10 mr-3 ring-2 ring-transparent group-hover:ring-primary/50 transition-all">
            <img src={profile?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'} alt="Avatar" className="w-full h-full object-cover bg-black" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-text-primary truncate">{profile?.full_name || 'User'}</h3>
            <p className="text-xs text-muted truncate group-hover:text-primary transition-colors">View Profile</p>
          </div>
          <ChevronRight size={16} className="text-muted group-hover:text-primary transition-colors transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};