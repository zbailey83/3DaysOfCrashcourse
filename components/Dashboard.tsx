import React, { useState, useEffect } from 'react';
import { Course } from '../types';
import { ViewState } from '../App';
import { PenTool, Image as ImageIcon, Search, BookOpen, PlayCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { useArtifacts } from '../hooks/useArtifacts';
import { supabase } from '../lib/supabase';

interface DashboardProps {
  courses: Course[];
  onNavigate: (view: ViewState) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ courses, onNavigate }) => {
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [userProfile, setUserProfile] = useState<{ full_name: string } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id);
      if (user) {
        // Fetch profile
        supabase.from('profiles').select('full_name').eq('id', user.id).single()
          .then(({ data }) => setUserProfile(data));
      }
    });
  }, []);

  const { getCourseProgress } = useProgress(userId);

  return (
    <div className="space-y-8 md:space-y-10 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-slide-up">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-3">Hello, {userProfile?.full_name || 'Creator'}</h1>
          <p className="text-muted text-lg font-light">Your creative journey continues today.</p>
        </div>
        <div className="hidden md:flex -space-x-3 hover:space-x-1 transition-all duration-300">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-10 h-10 rounded-full border-2 border-white/10 bg-white/5 overflow-hidden shadow-sm hover:scale-110 transition-transform z-0 hover:z-10">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="peer" />
            </div>
          ))}
          <div className="w-10 h-10 rounded-full border-2 border-white/10 bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shadow-sm">+42</div>
        </div>
      </div>

      {/* Active Courses & Tools */}
      <div className="animate-slide-up delay-100">
        <h2 className="text-2xl font-display font-bold text-text-primary mb-6">Active Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {courses.map(course => {
            const courseProgress = getCourseProgress(course.id, course.modules.length);
            return (
              <div key={course.id} className="group glass-card rounded-[24px] overflow-hidden hover:shadow-glow hover:-translate-y-1 transition-all duration-300">
                <div className="h-48 overflow-hidden relative">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    {course.tags.map(tag => (
                      <span key={tag} className="text-[10px] uppercase font-bold px-3 py-1 bg-white/10 backdrop-blur-md text-white border border-white/10 rounded-full shadow-sm">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="p-7">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-display font-bold text-text-primary leading-tight group-hover:text-primary transition-colors">{course.title}</h3>
                    {courseProgress > 0 && (
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary text-xs font-bold">
                        {courseProgress}%
                      </div>
                    )}
                  </div>
                  <p className="text-muted text-sm mb-6 leading-relaxed line-clamp-2">{course.description}</p>

                  {/* Progress Bar for Course */}
                  <div className="w-full bg-white/5 rounded-full h-1.5 mb-6 overflow-hidden">
                    <div className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-1000" style={{ width: `${courseProgress}%` }}></div>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-dashed border-border-light">
                    <span className="text-xs text-muted font-semibold flex items-center">
                      <PlayCircle size={14} className="mr-1" /> {course.modules.length} Modules
                    </span>
                    <button
                      onClick={() => onNavigate({ type: 'course', courseId: course.id })}
                      className="flex items-center text-text-primary bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/10 px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-primary hover:text-white hover:border-primary transition-all shadow-lg shadow-black/5 hover:shadow-glow"
                    >
                      {courseProgress > 0 ? 'Continue' : 'Start Learning'} <ArrowRight size={16} className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Creative Tools Card */}
          <div className="group glass-card rounded-[24px] overflow-hidden hover:shadow-glow hover:-translate-y-1 transition-all duration-300 flex flex-col">
            <div className="h-48 overflow-hidden relative bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 dark:from-violet-600/20 dark:to-fuchsia-600/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={48} className="text-violet-500/20 dark:text-white/20" />
              </div>
              <div className="absolute bottom-4 left-4">
                <span className="text-[10px] uppercase font-bold px-3 py-1 bg-white/10 backdrop-blur-md text-white border border-white/10 rounded-full shadow-sm">Creative Suite</span>
              </div>
            </div>

            <div className="p-7 flex-1 flex flex-col">
              <div className="mb-4">
                <h3 className="text-xl font-display font-bold text-text-primary leading-tight">Creative Tools</h3>
                <p className="text-muted text-sm mt-1">AI-powered tools to supercharge your content creation.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-auto">
                <button
                  onClick={() => onNavigate({ type: 'tool', toolName: 'campaign' })}
                  className="flex flex-col items-center p-3 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-primary/10 transition-colors group/btn"
                >
                  <PenTool size={20} className="mb-2 text-primary group-hover/btn:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-text-primary">Campaign</span>
                </button>

                <button
                  onClick={() => onNavigate({ type: 'tool', toolName: 'image' })}
                  className="flex flex-col items-center p-3 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-secondary/10 transition-colors group/btn"
                >
                  <ImageIcon size={20} className="mb-2 text-secondary group-hover/btn:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-text-primary">Visual Lab</span>
                </button>

                <button
                  onClick={() => onNavigate({ type: 'tool', toolName: 'image', action: 'openLibrary' })}
                  className="flex flex-col items-center p-3 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-violet-500/10 transition-colors group/btn"
                >
                  <BookOpen size={20} className="mb-2 text-violet-400 group-hover/btn:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-text-primary">Library</span>
                </button>

                <button
                  onClick={() => onNavigate({ type: 'tool', toolName: 'seo' })}
                  className="flex flex-col items-center p-3 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-emerald-500/10 transition-colors group/btn"
                >
                  <Search size={20} className="mb-2 text-emerald-400 group-hover/btn:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-text-primary">SEO</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};