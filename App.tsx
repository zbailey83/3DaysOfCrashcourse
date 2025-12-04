import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CourseView } from './components/CourseView';
import { CampaignGenerator } from './components/tools/CampaignGenerator';
import { ImageGenLab } from './components/tools/ImageGenLab';
import { SeoAnalyzer } from './components/tools/SeoAnalyzer';
import { Course, Module } from './types';
import { COURSES } from './constants';
import { Menu, X } from 'lucide-react';

// Simple view router state type
export type ViewState = 
  | { type: 'dashboard' }
  | { type: 'course'; courseId: string; moduleId?: string }
  | { type: 'tool'; toolName: 'campaign' | 'image' | 'seo' };

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>({ type: 'dashboard' });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigate = (view: ViewState) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch (currentView.type) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} courses={COURSES} />;
      case 'course':
        const course = COURSES.find(c => c.id === currentView.courseId);
        if (!course) return <div>Course not found</div>;
        return <CourseView course={course} initialModuleId={currentView.moduleId} />;
      case 'tool':
        switch (currentView.toolName) {
          case 'campaign': return <CampaignGenerator />;
          case 'image': return <ImageGenLab />;
          case 'seo': return <SeoAnalyzer />;
          default: return <div>Tool not found</div>;
        }
      default:
        return <Dashboard onNavigate={handleNavigate} courses={COURSES} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB] text-[#1A1A1A] overflow-hidden selection:bg-[#6C4CF4] selection:text-white">
      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-[#1A1A1A]/20 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-white shadow-2xl md:shadow-none md:border-r border-black/5 transform transition-transform duration-400 cubic-bezier(0.22, 1, 0.36, 1) md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar currentView={currentView} onNavigate={handleNavigate} onCloseMobile={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-black/5 md:hidden flex items-center justify-between p-4 sticky top-0 z-30">
          <div className="flex items-center">
             <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-full hover:bg-black/5 text-[#1A1A1A]"
            >
              <Menu size={24} />
            </button>
            <span className="ml-3 font-display font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-[#6C4CF4] to-[#C84FF1]">
              MarketerAI
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6C4CF4] to-[#C84FF1] p-[2px]">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="User" className="rounded-full bg-white" />
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 scroll-smooth">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;