import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CourseView } from './components/CourseView';
import { CampaignGenerator } from './components/tools/CampaignGenerator';
import { ImageGenLab } from './components/tools/ImageGenLab';
import { SeoAnalyzer } from './components/tools/SeoAnalyzer';
import { BrandVoiceDNA } from './components/tools/BrandVoiceDNA';
import { Workspace } from './components/Workspace';
import { Profile } from './components/Profile';
import { Auth } from './components/Auth';
import { COURSES } from './constants';
import { Menu, Sun, Moon } from 'lucide-react';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';

// Simple view router state type
export type ViewState =
  | { type: 'dashboard' }
  | { type: 'workspace' }
  | { type: 'profile' }
  | { type: 'course'; courseId: string; moduleId?: string }
  | { type: 'tool'; toolName: 'campaign' | 'image' | 'seo' | 'brand-voice'; action?: 'openLibrary' };

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>({ type: 'dashboard' });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Initialize theme from local storage or system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    } else {
      setTheme('light'); // Default to light if no preference
    }

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleNavigate = (view: ViewState) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    // Scroll to top on navigation
    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.scrollTop = 0;
  };

  const renderContent = () => {
    switch (currentView.type) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} courses={COURSES} />;
      case 'workspace':
        return <Workspace />;
      case 'profile':
        return <Profile />;
      case 'course':
        const course = COURSES.find(c => c.id === currentView.courseId);
        if (!course) return <div>Course not found</div>;
        return <CourseView course={course} moduleId={currentView.moduleId} onBack={() => handleNavigate({ type: 'dashboard' })} />;
      case 'tool':
        switch (currentView.toolName) {
          case 'campaign': return <CampaignGenerator />;
          case 'image': return <ImageGenLab initialAction={currentView.action} />;
          case 'seo': return <SeoAnalyzer />;
          case 'brand-voice': return <BrandVoiceDNA />;
          default: return <div>Tool not found</div>;
        }
      default:
        return <Dashboard onNavigate={handleNavigate} courses={COURSES} />;
    }
  };

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="flex h-screen bg-transparent text-text-primary overflow-hidden selection:bg-primary selection:text-white">
      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-[280px] transform transition-transform duration-400 cubic-bezier(0.16, 1, 0.3, 1) md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile Header */}
        <header className="bg-surface-glass backdrop-blur-xl border-b border-border-light md:hidden flex items-center justify-between p-4 sticky top-0 z-30">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-full hover:bg-white/10 text-text-primary transition-colors"
            >
              <Menu size={24} />
            </button>
            <span className="ml-3 font-display font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              MarketerAI
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-muted hover:text-text-primary"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-primary to-secondary p-[2px] shadow-glow">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="User" className="rounded-full bg-black h-full w-full" />
            </div>
          </div>
        </header>

        <main id="main-content" className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 scroll-smooth">
          <div className="max-w-7xl mx-auto animate-slide-up">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;