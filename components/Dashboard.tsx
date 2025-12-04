import React from 'react';
import { Course } from '../types';
import { ViewState } from '../App';
import { PlayCircle, Clock, Award, ArrowRight, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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
  return (
    <div className="space-y-8 md:space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-[#1A1A1A] mb-3">Hello, Alex</h1>
          <p className="text-[#7E7E7E] text-lg font-light">Your creative journey continues today.</p>
        </div>
        <div className="hidden md:flex -space-x-3">
            {[1,2,3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="peer" />
                </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-white bg-[#F7F8FA] flex items-center justify-center text-xs font-bold text-[#6C4CF4]">+42</div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Progress Chart */}
        <div className="bg-white p-8 rounded-[24px] shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.04)] lg:col-span-2 border border-black/5 hover:shadow-[0px_8px_20px_rgba(0,0,0,0.08)] transition-shadow duration-300">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-display font-bold text-[#1A1A1A]">Skill Matrix</h3>
            <button className="text-sm font-semibold text-[#6C4CF4] bg-[#6C4CF4]/5 px-4 py-2 rounded-full hover:bg-[#6C4CF4]/10 transition-colors">View Details</button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 500}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                <Tooltip 
                    cursor={{fill: '#F8FAFC'}}
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}} 
                />
                <Bar dataKey="score" radius={[6, 6, 6, 6]} barSize={40}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="url(#colorGradient)" />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6C4CF4" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#C84FF1" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6 md:space-y-8">
            <div className="bg-gradient-to-br from-[#6C4CF4] to-[#C84FF1] p-8 rounded-[24px] shadow-xl shadow-purple-500/20 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                
                <h3 className="text-purple-100 font-medium mb-2 flex items-center"><Zap className="w-4 h-4 mr-2" /> Overall Progress</h3>
                <div className="text-5xl font-display font-bold mb-6">72%</div>
                
                <div className="w-full bg-black/20 rounded-full h-3 mb-2 backdrop-blur-sm">
                    <div className="bg-white h-3 rounded-full w-[72%] shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                </div>
                <p className="text-sm text-purple-100/80 font-medium">Level 4: Marketing Wizard</p>
            </div>
            
            <div className="bg-white p-6 rounded-[24px] shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.04)] border border-black/5">
                <h3 className="font-display font-bold text-[#1A1A1A] mb-4 text-lg">Continue Learning</h3>
                <div className="flex items-start space-x-4">
                    <div className="bg-[#FFB14D]/10 p-3.5 rounded-2xl">
                        <Clock className="text-[#FFB14D]" size={22} />
                    </div>
                    <div>
                        <h4 className="font-semibold text-[#1A1A1A] mb-1">Visual Asset Creation</h4>
                        <p className="text-xs text-[#7E7E7E] mb-3">Module 2 • 15m remaining</p>
                        <button 
                            onClick={() => onNavigate({type: 'course', courseId: 'marketing-ai-101', moduleId: 'm2-visuals'})}
                            className="text-[#6C4CF4] text-sm font-bold hover:text-[#5839db] transition-colors flex items-center group"
                        >
                            Resume <ArrowRight size={14} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div>
        <h2 className="text-2xl font-display font-bold text-[#1A1A1A] mb-6">Active Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {courses.map(course => (
            <div key={course.id} className="group bg-white rounded-[24px] shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.04)] overflow-hidden border border-black/5 hover:shadow-[0px_8px_20px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300">
              <div className="h-48 overflow-hidden relative">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                <div className="absolute bottom-4 left-4 flex gap-2">
                    {course.tags.map(tag => (
                        <span key={tag} className="text-[10px] uppercase font-bold px-3 py-1 bg-white/90 backdrop-blur-md text-[#1A1A1A] rounded-full shadow-sm">{tag}</span>
                    ))}
                </div>
              </div>
              <div className="p-7">
                <h3 className="text-xl font-display font-bold text-[#1A1A1A] mb-3 leading-tight group-hover:text-[#6C4CF4] transition-colors">{course.title}</h3>
                <p className="text-[#7E7E7E] text-sm mb-6 leading-relaxed line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between pt-5 border-t border-dashed border-gray-100">
                  <span className="text-xs text-[#9CA3AF] font-semibold flex items-center">
                    <PlayCircle size={14} className="mr-1" /> {course.modules.length} Modules
                  </span>
                  <button 
                    onClick={() => onNavigate({ type: 'course', courseId: course.id })}
                    className="flex items-center text-white bg-[#1A1A1A] px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-[#6C4CF4] transition-colors shadow-lg shadow-black/10"
                  >
                    Start Learning <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};