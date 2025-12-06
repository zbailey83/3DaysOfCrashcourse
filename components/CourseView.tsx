import React, { useState, useEffect } from 'react';
import { Course, Module, QuizQuestion } from '../types';
import { CheckCircle, PlayCircle, FileText, HelpCircle, ChevronRight, AlertCircle, ArrowLeft, ArrowRight, Menu, X, Lock, Zap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { VideoPlayer } from './VideoPlayer';
import { useProgress } from '../hooks/useProgress';
import { supabase } from '../lib/supabase';
import { CampaignGenerator } from './tools/CampaignGenerator';
import { ImageGenLab } from './tools/ImageGenLab';
import { SeoAnalyzer } from './tools/SeoAnalyzer';
import { BrandVoiceDNA } from './tools/BrandVoiceDNA';
import { AnalyticsLab } from './tools/AnalyticsLab';

const QuizItem = ({ question, index, onCorrect }: { question: QuizQuestion; index: number; onCorrect: () => void }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const isCorrect = selected === question.correctAnswer;

  useEffect(() => {
    if (isSubmitted && isCorrect) {
      onCorrect();
    }
  }, [isSubmitted, isCorrect, onCorrect]);

  return (
    <div className="mb-8 last:mb-0">
      <p className="font-bold text-text-primary mb-4 text-lg">{index + 1}. {question.question}</p>
      <div className="space-y-3">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            disabled={isSubmitted}
            onClick={() => setSelected(idx)}
            className={`w-full text-left px-5 py-4 rounded-xl text-sm font-medium transition-all duration-200 border ${isSubmitted
              ? idx === question.correctAnswer
                ? 'bg-success/10 border-success text-success'
                : idx === selected
                  ? 'bg-danger/10 border-danger text-danger'
                  : 'bg-white/5 border-transparent text-muted'
              : selected === idx
                ? 'bg-primary/10 border-primary text-primary shadow-glow'
                : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/20 text-text-secondary'
              }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {!isSubmitted && selected !== null && (
        <button
          onClick={() => setIsSubmitted(true)}
          className="mt-5 text-sm font-bold text-white bg-gradient-to-r from-primary to-secondary px-8 py-3 rounded-full hover:scale-105 transition-all shadow-glow"
        >
          Submit Answer
        </button>
      )}
      {isSubmitted && (
        <div className={`mt-5 p-5 rounded-2xl text-sm flex items-start animate-fade-in ${isCorrect ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
          <div className={`mr-3 mt-0.5 p-1 rounded-full ${isCorrect ? 'bg-success text-white' : 'bg-danger text-white'}`}>
            {isCorrect ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
          </div>
          <div>
            <span className="font-bold block mb-1 text-base">{isCorrect ? 'Correct!' : 'Incorrect'}</span>
            <p className="opacity-90 leading-relaxed">{question.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
};

interface CourseViewProps {
  course: Course;
  moduleId?: string;
  onBack: () => void;
}

export const CourseView: React.FC<CourseViewProps> = ({ course, moduleId, onBack }) => {
  const [activeModuleId, setActiveModuleId] = useState<string>(moduleId || course.modules[0].id);
  const [showMobileModules, setShowMobileModules] = useState(false);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id);
    });
  }, []);

  const { isModuleCompleted, markModuleCompleted } = useProgress(userId);

  useEffect(() => {
    if (moduleId) setActiveModuleId(moduleId);
  }, [moduleId]);

  const activeModule = course.modules.find(m => m.id === activeModuleId) || course.modules[0];
  const activeModuleIndex = course.modules.findIndex(m => m.id === activeModuleId);

  // Auto-complete logic for non-quiz modules (e.g., when viewing or finishing video)
  useEffect(() => {
    if (activeModule.type !== 'lab' && (!activeModule.quiz || activeModule.quiz.length === 0)) {
      // Simple timeout to simulate "reading" or "watching"
      const timer = setTimeout(() => {
        markModuleCompleted(course.id, activeModule.id);
      }, 5000); // Mark as complete after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [activeModuleId, userId]);

  const handleNext = () => {
    if (activeModuleIndex < course.modules.length - 1) {
      setActiveModuleId(course.modules[activeModuleIndex + 1].id);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (activeModuleIndex > 0) {
      setActiveModuleId(course.modules[activeModuleIndex - 1].id);
      window.scrollTo(0, 0);
    }
  };

  const handleQuizCorrect = () => {
    // In a real app, check if all questions are correct
    markModuleCompleted(course.id, activeModule.id, 100);
  };

  return (
    <div className="flex h-full relative">
      {/* Mobile Module Toggle */}
      <button
        className="md:hidden fixed bottom-6 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-glow hover:scale-110 transition-transform"
        onClick={() => setShowMobileModules(!showMobileModules)}
      >
        {showMobileModules ? <X size={24} /> : <PlayCircle size={24} />}
      </button>

      {/* Mobile Module Overlay */}
      {showMobileModules && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setShowMobileModules(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-3/4 glass-panel p-6 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-4 text-text-primary">Course Modules</h3>
            <div className="space-y-2">
              {course.modules.map((module, idx) => {
                const isCompleted = isModuleCompleted(module.id);
                return (
                  <button
                    key={module.id}
                    onClick={() => {
                      setActiveModuleId(module.id);
                      setShowMobileModules(false);
                    }}
                    className={`w-full text-left p-4 rounded-xl text-sm font-medium transition-all flex items-center ${activeModuleId === module.id
                      ? 'bg-primary/20 text-text-primary dark:text-white border border-primary/30 shadow-glow'
                      : 'bg-black/5 dark:bg-white/5 text-text-secondary hover:bg-black/10 dark:hover:bg-white/10'
                      }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-xs font-bold ${isCompleted ? 'bg-success text-white' : activeModuleId === module.id ? 'bg-white/20' : 'bg-white/10 border border-white/10'
                      }`}>
                      {isCompleted ? <CheckCircle size={14} /> : idx + 1}
                    </div>
                    <span className="line-clamp-2">{module.title}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar (Desktop) */}
      <div className="hidden md:block w-80 glass-panel border-r border-border-light flex-shrink-0 overflow-y-auto h-full p-6">
        <button
          onClick={onBack}
          className="flex items-center text-muted hover:text-primary font-bold text-sm mb-8 transition-colors group"
        >
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </button>

        <h2 className="font-display font-bold text-xl text-text-primary mb-2">{course.title}</h2>
        <div className="h-1 w-12 bg-gradient-to-r from-primary to-secondary rounded-full mb-6"></div>

        <div className="space-y-3">
          {course.modules.map((module, idx) => {
            const isCompleted = isModuleCompleted(module.id);
            return (
              <button
                key={module.id}
                onClick={() => setActiveModuleId(module.id)}
                className={`w-full text-left p-4 rounded-xl text-sm font-medium transition-all flex items-start group ${activeModuleId === module.id
                  ? 'bg-primary/20 text-text-primary border border-primary/30 shadow-glow scale-[1.02]'
                  : 'bg-black/5 dark:bg-white/5 border border-transparent text-text-secondary hover:bg-black/10 dark:hover:bg-white/10 hover:border-black/5 dark:hover:border-white/10'
                  }`}
              >
                <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center mr-3 text-[10px] font-bold flex-shrink-0 transition-colors ${isCompleted ? 'bg-success text-white' : activeModuleId === module.id ? 'bg-black/20 dark:bg-white/20' : 'bg-black/10 dark:bg-white/10 text-muted group-hover:bg-primary/10 group-hover:text-primary'
                  }`}>
                  {isCompleted ? <CheckCircle size={12} /> : idx + 1}
                </div>
                <span className="leading-relaxed">{module.title}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-transparent">
        <div className="max-w-4xl mx-auto p-6 md:p-10">
          <div className="md:hidden mb-6">
            <button
              onClick={onBack}
              className="flex items-center text-muted hover:text-primary font-bold text-sm transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" /> Back
            </button>
          </div>

          <div className="glass-card rounded-[32px] overflow-hidden min-h-[calc(100vh-100px)]">
            {/* Header Image */}
            <div className="h-48 md:h-64 bg-slate-900 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80"></div>
              <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                <div>
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold mb-4 border border-white/10">
                    Module {activeModuleIndex + 1} of {course.modules.length}
                  </span>
                  <h1 className="text-2xl md:text-4xl font-display font-bold text-white mb-2">{activeModule.title}</h1>
                  <div className="flex items-center justify-center text-white/80 text-sm font-medium">
                    <FileText size={14} className="mr-2" /> {activeModule.type === 'video' ? 'Video Lesson' : 'Reading & Quiz'}
                    <span className="mx-3">•</span>
                    <PlayCircle size={14} className="mr-2" /> {activeModule.duration}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-8 md:p-12">
              {activeModule.type === 'video' && (
                <div className="mb-12">
                  <VideoPlayer
                    title={activeModule.title}
                    duration={activeModule.duration}
                    thumbnail={course.thumbnail}
                    videoUrl={activeModule.videoUrl}
                  />
                </div>
              )}
              <div className="prose prose-invert prose-lg max-w-none mb-12 prose-headings:font-display prose-headings:font-bold prose-a:text-primary prose-img:rounded-2xl">
                <ReactMarkdown>{activeModule.content}</ReactMarkdown>
              </div>
              {/* Quiz Section */}
              {activeModule.quiz && activeModule.quiz.length > 0 && (
                <div className="mt-12 bg-white/5 rounded-[24px] p-8 border border-white/10">
                  <div className="flex items-center mb-8">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-4 text-primary">
                      <HelpCircle size={20} />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-xl text-text-primary">Knowledge Check</h3>
                      <p className="text-muted text-sm">Test your understanding of this module</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {activeModule.quiz.map((q, idx) => (
                      <QuizItem key={idx} question={q} index={idx} onCorrect={handleQuizCorrect} />
                    ))}
                  </div>
                </div>
              )}

              {/* Tool Integration */}
              {activeModule.toolId && (
                <div className="mt-12 animate-slide-up">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center mr-4 text-violet-500">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-xl text-text-primary">Interactive Lab</h3>
                      <p className="text-muted text-sm">Use the tools below to complete this module.</p>
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-primary/20 rounded-[24px] p-6 bg-primary/5">
                    {activeModule.toolId === 'campaign' && <CampaignGenerator />}
                    {activeModule.toolId === 'image' && <ImageGenLab />}
                    {activeModule.toolId === 'seo' && <SeoAnalyzer />}
                    {activeModule.toolId === 'brand-voice' && <BrandVoiceDNA />}
                    {activeModule.toolId === 'analytics' && <AnalyticsLab />}
                  </div>
                </div>
              )}

              {/* Completion Badge */}
              {isModuleCompleted(activeModule.id) && (
                <div className="mt-8 flex items-center justify-center p-4 bg-success/10 text-success rounded-xl animate-fade-in border border-success/20">
                  <CheckCircle size={20} className="mr-2" />
                  <span className="font-bold">Module Completed!</span>
                </div>
              )}
            </div>

            {/* Navigation Footer */}
            <div className="bg-white/5 p-6 md:p-8 border-t border-white/10 flex justify-between items-center">
              <button
                onClick={handlePrev}
                disabled={activeModuleIndex === 0}
                className="flex items-center px-6 py-3 rounded-full font-bold text-muted hover:bg-white/10 hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <ArrowLeft size={18} className="mr-2" /> Previous
              </button>

              <button
                onClick={handleNext}
                disabled={activeModuleIndex === course.modules.length - 1}
                className="flex items-center px-8 py-3 rounded-full font-bold text-white bg-gradient-to-r from-primary to-secondary hover:shadow-glow hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                Next Lesson <ArrowRight size={18} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};