import React from 'react';

export const StreakCounter: React.FC<{ className?: string }> = ({ className = '' }) => {
    return (
        <div className={`p-5 glass-card ${className}`}>
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-bold text-text-primary">Daily Streak</h3>
                <span className="text-xs font-bold text-[#F59E0B] bg-yellow-400/10 px-2 py-1 rounded-full border border-yellow-400/20">🔥 12 Days</span>
            </div>
            <p className="text-xs text-muted mb-3">You're on fire! Keep learning to maintain your streak.</p>
            <div className="w-full bg-black/5 dark:bg-white/10 rounded-full h-2.5 overflow-hidden">
                <div className="bg-gradient-to-r from-[#F59E0B] to-[#F97316] h-full rounded-full w-3/4 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
            </div>
        </div>
    );
};
