import React, { useState, useEffect } from 'react';
import { Course } from '../types';
import { ViewState } from '../App';
import { PlayCircle, Clock, ArrowRight, Zap, PenTool, Image as ImageIcon, Search, BookOpen } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useProgress } from '../hooks/useProgress';
import { useArtifacts } from '../hooks/useArtifacts';
import { supabase } from '../lib/supabase';
import { Badges } from './Badges';

interface DashboardProps {
  courses: Course[];
  onNavigate: (view: ViewState) => void;
}

const data = [
  { name: 'Writing', score: 85 },
  { name: 'SEO', score: 65 },
  { name: 'Visuals', score: 92 },
  { name: 'Strategy', score: 70 },
];

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

  const { getCourseProgress, progress } = useProgress(userId);
  const { artifacts } = useArtifacts(userId);

  // Calculate overall progress
  const totalModules = courses.reduce((acc, course) => acc + course.modules.length, 0);
  const completedModules = progress.filter(p => p.completed).length;
  const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  return (
    <div className="space-y-8 md:space-y-10 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-slide-up">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-[#0F172A] mb-3">Hello, {userProfile?.full_name || 'Creator'}</h1>
          <p className="text-[#64748B] text-lg font-light">Your creative journey continues today.</p>
        </div>
        <div className="hidden md:flex -space-x-3 hover:space-x-1 transition-all duration-300">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm hover:scale-110 transition-transform z-0 hover:z-10">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="peer" />
            </div>
          ))}
          <div className="w-10 h-10 rounded-full border-2 border-white bg-[#EFF6FF] flex items-center justify-center text-xs font-bold text-[#2563EB] shadow-sm">+42</div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 animate-slide-up delay-100">
        {/* Progress Chart */}
        <div className="bg-white p-8 rounded-[24px] shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.04)] lg:col-span-2 border border-slate-100 hover:shadow-[0px_8px_20px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-display font-bold text-[#0F172A]">Skill Matrix</h3>
            <button className="text-sm font-semibold text-[#2563EB] bg-[#EFF6FF] px-4 py-2 rounded-full hover:bg-[#DBEAFE] transition-colors">View Details</button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px', fontFamily: 'Inter' }}
                />
                <Bar dataKey="score" radius={[6, 6, 6, 6]} barSize={40} animationDuration={1500}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="url(#colorGradient)" />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={1} />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6 md:space-y-8 flex flex-col">
          <div className="flex-1 bg-gradient-to-br from-[#2563EB] to-[#06B6D4] p-8 rounded-[24px] shadow-xl shadow-blue-500/20 text-white relative overflow-hidden group hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-10 -mb-10 blur-xl"></div>

            <h3 className="text-blue-100 font-medium mb-2 flex items-center relative z-10"><Zap className="w-4 h-4 mr-2 text-yellow-300" /> Overall Progress</h3>
            <div className="text-5xl font-display font-bold mb-6 relative z-10">{overallProgress}%</div>

            <div className="w-full bg-black/20 rounded-full h-3 mb-3 backdrop-blur-sm relative z-10">
              <div className="bg-white h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-1000" style={{ width: `${overallProgress}%` }}></div>
            </div>
            <p className="text-sm text-blue-50 font-medium relative z-10">Level {Math.floor(overallProgress / 20) + 1}: {overallProgress > 80 ? 'Master' : overallProgress > 50 ? 'Advanced' : 'Beginner'}</p>
          </div>

          <div className="bg-white p-6 rounded-[24px] shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.04)] border border-slate-100 hover:shadow-md transition-shadow">
            <h3 className="font-display font-bold text-[#0F172A] mb-4 text-lg">Continue Learning</h3>
            <div className="flex items-start space-x-4">
              <div className="bg-[#F59E0B]/10 p-3.5 rounded-2xl">
                <Clock className="text-[#F59E0B]" size={22} />
              </div>
              <div>
                <h4 className="font-semibold text-[#0F172A] mb-1">Visual Asset Creation</h4>
                <p className="text-xs text-[#64748B] mb-3">Module 2 • 15m remaining</p>
                <button
                  onClick={() => onNavigate({ type: 'course', courseId: 'day-1-foundation', moduleId: 'm3.1-image-prompt' })}
                  className="text-[#2563EB] text-sm font-bold hover:text-[#1D4ED8] transition-colors flex items-center group"
                >
                  Resume <ArrowRight size={14} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="animate-slide-up delay-150">
        <Badges progress={progress} artifacts={artifacts} />
      </div>

      {/* Courses Grid */}
      <div className="animate-slide-up delay-200">
        <h2 className="text-2xl font-display font-bold text-[#0F172A] mb-6">Active Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {courses.map(course => {
            const courseProgress = getCourseProgress(course.id, course.modules.length);
            return (
              <div key={course.id} className="group bg-white rounded-[24px] shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.04)] overflow-hidden border border-slate-100 hover:shadow-[0px_8px_20px_rgba(37,99,235,0.1)] hover:-translate-y-1 transition-all duration-300">
                <div className="h-48 overflow-hidden relative">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    {course.tags.map(tag => (
                      <span key={tag} className="text-[10px] uppercase font-bold px-3 py-1 bg-white/90 backdrop-blur-md text-[#0F172A] rounded-full shadow-sm">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="p-7">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-display font-bold text-[#0F172A] leading-tight group-hover:text-[#2563EB] transition-colors">{course.title}</h3>
                    {courseProgress > 0 && (
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold">
                        {courseProgress}%
                      </div>
                    )}
                  </div>
                  <p className="text-[#64748B] text-sm mb-6 leading-relaxed line-clamp-2">{course.description}</p>

                  {/* Progress Bar for Course */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mb-6 overflow-hidden">
                    <div className="bg-[#2563EB] h-full rounded-full transition-all duration-1000" style={{ width: `${courseProgress}%` }}></div>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-dashed border-slate-100">
                    <span className="text-xs text-[#94A3B8] font-semibold flex items-center">
                      <PlayCircle size={14} className="mr-1" /> {course.modules.length} Modules
                    </span>
                    <button
                      onClick={() => onNavigate({ type: 'course', courseId: course.id })}
                      className="flex items-center text-white bg-[#0F172A] px-5 py-2.5 rounded-full font-semibold text-sm group-hover:bg-[#2563EB] transition-colors shadow-lg shadow-black/5 group-hover:shadow-blue-500/20"
                    >
                      {courseProgress > 0 ? 'Continue' : 'Start Learning'} <ArrowRight size={16} className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Tools Grid */}
      <div className="animate-slide-up delay-300">
        <h2 className="text-2xl font-display font-bold text-[#0F172A] mb-6">Creative Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate({ type: 'tool', toolName: 'campaign' })}
            className="flex flex-col items-center justify-center p-6 rounded-[24px] bg-white shadow-sm border border-slate-100 hover:shadow-[0px_8px_20px_rgba(37,99,235,0.1)] hover:-translate-y-1 hover:border-[#2563EB]/20 transition-all group duration-300"
          >
            <div className="p-4 rounded-full bg-blue-50 text-[#2563EB] mb-3 group-hover:scale-110 group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-300">
              <PenTool size={24} />
            </div>
            <h3 className="font-bold text-[#0F172A] mb-1">Campaign Gen</h3>
            <span className="text-xs text-[#64748B]">Full Ads</span>
          </button>

          <button
            onClick={() => onNavigate({ type: 'tool', toolName: 'image' })}
            className="flex flex-col items-center justify-center p-6 rounded-[24px] bg-white shadow-sm border border-slate-100 hover:shadow-[0px_8px_20px_rgba(6,182,212,0.1)] hover:-translate-y-1 hover:border-[#06B6D4]/20 transition-all group duration-300"
          >
            <div className="p-4 rounded-full bg-cyan-50 text-[#06B6D4] mb-3 group-hover:scale-110 group-hover:bg-[#06B6D4] group-hover:text-white transition-all duration-300">
              <ImageIcon size={24} />
            </div>
            <h3 className="font-bold text-[#0F172A] mb-1">Visual Lab</h3>
            <span className="text-xs text-[#64748B]">Image Gen</span>
          </button>

          <button
            onClick={() => onNavigate({ type: 'tool', toolName: 'image', action: 'openLibrary' })}
            className="flex flex-col items-center justify-center p-6 rounded-[24px] bg-white shadow-sm border border-slate-100 hover:shadow-[0px_8px_20px_rgba(139,92,246,0.1)] hover:-translate-y-1 hover:border-violet-400/20 transition-all group duration-300"
          >
            <div className="p-4 rounded-full bg-violet-50 text-violet-500 mb-3 group-hover:scale-110 group-hover:bg-violet-500 group-hover:text-white transition-all duration-300">
              <BookOpen size={24} />
            </div>
            <h3 className="font-bold text-[#0F172A] mb-1">Prompt Library</h3>
            <span className="text-xs text-[#64748B]">Explore Styles</span>
          </button>

          <button
            onClick={() => onNavigate({ type: 'tool', toolName: 'seo' })}
            className="flex flex-col items-center justify-center p-6 rounded-[24px] bg-white shadow-sm border border-slate-100 hover:shadow-[0px_8px_20px_rgba(16,185,129,0.1)] hover:-translate-y-1 hover:border-emerald-400/20 transition-all group duration-300"
          >
            <div className="p-4 rounded-full bg-emerald-50 text-emerald-500 mb-3 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
              <Search size={24} />
            </div>
            <h3 className="font-bold text-[#0F172A] mb-1">SEO Analyzer</h3>
            <span className="text-xs text-[#64748B]">Optimize</span>
          </button>
        </div>
      </div>
    </div>
  );
};