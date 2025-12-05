import React from 'react';
import { ViewState } from '../App';
import { Home, PenTool, Image as ImageIcon, Search, X, Sparkles, Sliders, FolderOpen, User, Sun, Moon, LayoutDashboard, BookOpen } from 'lucide-react';
import { StreakCounter } from './StreakCounter';

interface SidebarProps {
  onNavigate: (view: ViewState) => void;
  currentView: ViewState;
  onCloseMobile?: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentView, onCloseMobile, theme, onToggleTheme }) => {
  const navItemClass = (isActive: boolean) =>
    `flex items-center w-full px-5 py-3.5 mb-1.5 rounded-full transition-all duration-300 group ${isActive
      ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-text-primary border border-primary/30 shadow-glow backdrop-blur-sm'
      : 'text-muted hover:bg-primary/10 hover:text-primary'
    }`;

  const handleNav = (view: ViewState) => {
    onNavigate(view);
    if (onCloseMobile) onCloseMobile();
  }

  return (
    <div className="flex flex-col h-full p-6 relative glass-panel border-r border-border-light">
      <div className="flex items-center justify-between mb-10 px-2 pt-2">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNav({ type: 'profile' })}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow group hover:scale-105 transition-transform">
            <Sparkles className="text-white w-5 h-5 group-hover:rotate-12 transition-transform" />
          </div>
          <h1 className="text-2xl font-display font-bold text-text-primary tracking-tight">MarketerAI</h1>
        </div>

        {/* Theme Toggle (Desktop) */}
        <button
          onClick={onToggleTheme}
          className="hidden md:flex p-2 rounded-full hover:bg-primary/10 text-muted hover:text-primary transition-colors"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button onClick={onCloseMobile} className="md:hidden p-2 text-muted hover:text-text-primary transition-colors rounded-full hover:bg-primary/10">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-[11px] font-bold text-muted uppercase tracking-widest mb-4 px-5">Dashboard</h2>
          <button
            onClick={() => handleNav({ type: 'profile' })}
            className={navItemClass(currentView.type === 'profile')}
          >
            <LayoutDashboard size={20} className="mr-3 stroke-[1.5]" />
            <span className="font-medium text-[15px]">Dashboard</span>
          </button>
          <button
            onClick={() => handleNav({ type: 'dashboard' })}
            className={navItemClass(currentView.type === 'dashboard')}
          >
            <BookOpen size={20} className="mr-3 stroke-[1.5]" />
            <span className="font-medium text-[15px]">Courses</span>
          </button>
          <button
            onClick={() => handleNav({ type: 'workspace' })}
            className={navItemClass(currentView.type === 'workspace')}
          >
            <FolderOpen size={20} className="mr-3 stroke-[1.5]" />
            <span className="font-medium text-[15px]">My Workspace</span>
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-[11px] font-bold text-muted uppercase tracking-widest mb-4 px-5">Creative Suite</h2>

          <button
            onClick={() => handleNav({ type: 'tool', toolName: 'brand-voice' })}
            className={navItemClass(currentView.type === 'tool' && currentView.toolName === 'brand-voice')}
          >
            <Sliders size={20} className="mr-3 stroke-[1.5]" />
            <span className="font-medium text-[15px]">Brand Voice DNA</span>
          </button>

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

      <StreakCounter className="mt-auto" />
    </div>
  );
};