import React, { useState, useEffect } from 'react';
import { Course, Module, QuizQuestion } from '../types';
import { CheckCircle, PlayCircle, FileText, HelpCircle, ChevronRight, AlertCircle, ArrowLeft, ArrowRight, Menu, X, Lock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { VideoPlayer } from './VideoPlayer';
import { useProgress } from '../hooks/useProgress';
import { supabase } from '../lib/supabase';

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
      <p className="font-bold text-[#0F172A] mb-4 text-lg">{index + 1}. {question.question}</p>
      <div className="space-y-3">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            disabled={isSubmitted}
            onClick={() => setSelected(idx)}
            className={`w-full text-left px-5 py-4 rounded-xl text-sm font-medium transition-all duration-200 border-2 ${isSubmitted
              ? idx === question.correctAnswer
                ? 'bg-[#10B981]/10 border-[#10B981] text-[#065F46]'
                : idx === selected
                  ? 'bg-red-50 border-red-300 text-red-800'
                  : 'bg-white border-transparent text-slate-400'
              : selected === idx
                ? 'bg-white border-[#2563EB] text-[#2563EB] shadow-[0_0_0_4px_rgba(37,99,235,0.1)]'
                : 'bg-white border-transparent hover:bg-white hover:border-slate-200 hover:shadow-md text-[#475569]'
              }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {!isSubmitted && selected !== null && (
        <button
          onClick={() => setIsSubmitted(true)}
          className="mt-5 text-sm font-bold text-white bg-gradient-to-r from-[#2563EB] to-[#06B6D4] px-8 py-3 rounded-full hover:scale-105 transition-all shadow-lg shadow-blue-500/25"
        >
          Submit Answer
        </button>
      )}
      {isSubmitted && (
        <div className={`mt-5 p-5 rounded-2xl text-sm flex items-start animate-fade-in ${isCorrect ? 'bg-[#10B981]/10 text-[#065F46]' : 'bg-red-50 text-red-800'}`}>
          <div className={`mr-3 mt-0.5 p-1 rounded-full ${isCorrect ? 'bg-[#10B981] text-white' : 'bg-red-500 text-white'}`}>
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
        className="md:hidden fixed bottom-6 right-6 z-50 bg-[#2563EB] text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform"
        onClick={() => setShowMobileModules(!showMobileModules)}
      >
        {showMobileModules ? <X size={24} /> : <PlayCircle size={24} />}
      </button>

      {/* Mobile Module Overlay */}
      {showMobileModules && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setShowMobileModules(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-3/4 bg-white shadow-2xl p-6 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-4 text-[#0F172A]">Course Modules</h3>
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
                      ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-xs font-bold ${isCompleted ? 'bg-[#10B981] text-white' : activeModuleId === module.id ? 'bg-white/20' : 'bg-white border border-slate-200'
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
      <div className="hidden md:block w-80 bg-white border-r border-slate-100 flex-shrink-0 overflow-y-auto h-full p-6">
        <button
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-[#2563EB] font-bold text-sm mb-8 transition-colors group"
        >
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </button>

        <h2 className="font-display font-bold text-xl text-[#0F172A] mb-2">{course.title}</h2>
        <div className="h-1 w-12 bg-[#2563EB] rounded-full mb-6"></div>

        <div className="space-y-3">
          {course.modules.map((module, idx) => {
            const isCompleted = isModuleCompleted(module.id);
            return (
              <button
                key={module.id}
                onClick={() => setActiveModuleId(module.id)}
                className={`w-full text-left p-4 rounded-xl text-sm font-medium transition-all flex items-start group ${activeModuleId === module.id
                  ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-500/25 scale-[1.02]'
                  : 'bg-white border border-slate-100 text-slate-600 hover:border-[#2563EB]/30 hover:shadow-md'
                  }`}
              >
                <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center mr-3 text-[10px] font-bold flex-shrink-0 transition-colors ${isCompleted ? 'bg-[#10B981] text-white' : activeModuleId === module.id ? 'bg-white/20' : 'bg-slate-100 text-slate-400 group-hover:bg-[#2563EB]/10 group-hover:text-[#2563EB]'
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
      <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto p-6 md:p-10">
          <div className="md:hidden mb-6">
            <button
              onClick={onBack}
              className="flex items-center text-slate-500 hover:text-[#2563EB] font-bold text-sm transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" /> Back
            </button>
          </div>

          <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden min-h-[calc(100vh-100px)]">
            {/* Header Image */}
            <div className="h-48 md:h-64 bg-slate-100 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] opacity-90"></div>
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
              <div className="prose prose-slate prose-lg max-w-none mb-12 prose-headings:font-display prose-headings:font-bold prose-a:text-[#2563EB] prose-img:rounded-2xl">
                <ReactMarkdown>{activeModule.content}</ReactMarkdown>
              </div>
              {/* Quiz Section */}
              {activeModule.quiz && activeModule.quiz.length > 0 && (
                <div className="mt-12 bg-[#F8FAFC] rounded-[24px] p-8 border border-slate-100">
                  <div className="flex items-center mb-8">
                    <div className="w-10 h-10 rounded-full bg-[#2563EB]/10 flex items-center justify-center mr-4 text-[#2563EB]">
                      <HelpCircle size={20} />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-xl text-[#0F172A]">Knowledge Check</h3>
                      <p className="text-slate-500 text-sm">Test your understanding of this module</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {activeModule.quiz.map((q, idx) => (
                      <QuizItem key={idx} question={q} index={idx} onCorrect={handleQuizCorrect} />
                    ))}
                  </div>
                </div>
              )}

              {/* Completion Badge */}
              {isModuleCompleted(activeModule.id) && (
                <div className="mt-8 flex items-center justify-center p-4 bg-green-50 text-green-700 rounded-xl animate-fade-in">
                  <CheckCircle size={20} className="mr-2" />
                  <span className="font-bold">Module Completed!</span>
                </div>
              )}
            </div>

            {/* Navigation Footer */}
            <div className="bg-slate-50 p-6 md:p-8 border-t border-slate-100 flex justify-between items-center">
              <button
                onClick={handlePrev}
                disabled={activeModuleIndex === 0}
                className="flex items-center px-6 py-3 rounded-full font-bold text-slate-600 hover:bg-white hover:shadow-md transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:shadow-none"
              >
                <ArrowLeft size={18} className="mr-2" /> Previous
              </button>

              <button
                onClick={handleNext}
                disabled={activeModuleIndex === course.modules.length - 1}
                className="flex items-center px-8 py-3 rounded-full font-bold text-white bg-[#0F172A] hover:bg-[#2563EB] shadow-lg hover:shadow-blue-500/25 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-[#0F172A]"
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