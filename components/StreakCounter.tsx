import React from 'react';

export const StreakCounter: React.FC<{ className?: string }> = ({ className = '' }) => {
    return (
        <div className={`p-5 bg-[#F1F5F9] rounded-3xl border border-white/50 shadow-inner ${className}`}>
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-bold text-[#0F172A]">Daily Streak</h3>
                <span className="text-xs font-bold text-[#F59E0B] bg-[#FFFBEB] px-2 py-1 rounded-full border border-[#FEF3C7]">🔥 12 Days</span>
            </div>
            <p className="text-xs text-[#64748B] mb-3">You're on fire! Keep learning to maintain your streak.</p>
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div className="bg-gradient-to-r from-[#F59E0B] to-[#F97316] h-full rounded-full w-3/4 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
            </div>
        </div>
    );
};
