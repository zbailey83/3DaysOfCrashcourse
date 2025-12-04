import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CourseView } from './components/CourseView';
import { CampaignGenerator } from './components/tools/CampaignGenerator';
return (
  <div className="flex h-screen bg-[#F8FAFC] text-[#0F172A] overflow-hidden selection:bg-[#2563EB] selection:text-white">
    {/* Mobile Menu Overlay */}
    <div
      className={`fixed inset-0 bg-[#0F172A]/30 backdrop-blur-md z-40 transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      onClick={() => setIsMobileMenuOpen(false)}
    />

    {/* Sidebar */}
    <div className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-white shadow-2xl md:shadow-none md:border-r border-slate-200 transform transition-transform duration-400 cubic-bezier(0.16, 1, 0.3, 1) md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <Sidebar currentView={currentView} onNavigate={handleNavigate} onCloseMobile={() => setIsMobileMenuOpen(false)} />
    </div>

    {/* Main Content */}
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
      {/* Mobile Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 md:hidden flex items-center justify-between p-4 sticky top-0 z-30">
        <div className="flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-[#0F172A] transition-colors"
          >
            <Menu size={24} />
          </button>
          <span className="ml-3 font-display font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
            MarketerAI
          </span>
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#2563EB] to-[#06B6D4] p-[2px] shadow-md">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="User" className="rounded-full bg-white h-full w-full" />
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