import React, { useMemo } from 'react';
import { UserProgress, UserArtifact, Badge } from '../types';
import { Award, Zap, PenTool, Image as ImageIcon, CheckCircle } from 'lucide-react';

const BADGES: Badge[] = [
    {
        id: 'first_step',
        name: 'First Step',
        description: 'Completed your first module.',
        icon: 'Zap',
        condition: (p) => p.some(x => x.completed),
    },
    {
        id: 'campaign_creator',
        name: 'Campaign Creator',
        description: 'Generated your first ad campaign.',
        icon: 'PenTool',
        condition: (_, a) => a.some(x => x.type === 'campaign'),
    },
    {
        id: 'visual_artist',
        name: 'Visual Artist',
        description: 'Created your first AI image.',
        icon: 'ImageIcon',
        condition: (_, a) => a.some(x => x.type === 'image'),
    },
    {
        id: 'course_champion',
        name: 'Course Champion',
        description: 'Completed an entire course.',
        icon: 'Award',
        condition: (p) => {
            // Simplified check: at least 5 modules completed
            return p.filter(x => x.completed).length >= 5;
        },
    },
];

interface BadgesProps {
    progress: UserProgress[];
    artifacts: UserArtifact[];
}

export const Badges: React.FC<BadgesProps> = ({ progress, artifacts }) => {
    const unlockedBadges = useMemo(() => {
        return BADGES.filter(badge => badge.condition(progress, artifacts));
    }, [progress, artifacts]);

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'Zap': return <Zap size={24} />;
            case 'PenTool': return <PenTool size={24} />;
            case 'ImageIcon': return <ImageIcon size={24} />;
            case 'Award': return <Award size={24} />;
            default: return <CheckCircle size={24} />;
        }
    };

    return (
        <div className="bg-white p-8 rounded-[24px] shadow-[0px_1px_3px_rgba(0,0,0,0.06),0px_4px_10px_rgba(0,0,0,0.04)] border border-slate-100">
            <h3 className="text-2xl font-display font-bold text-[#0F172A] mb-6">Achievements</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {BADGES.map(badge => {
                    const isUnlocked = unlockedBadges.some(b => b.id === badge.id);
                    return (
                        <div
                            key={badge.id}
                            className={`flex flex-col items-center text-center p-4 rounded-2xl border-2 transition-all ${isUnlocked
                                    ? 'border-[#F59E0B]/20 bg-[#FFFBEB] text-[#B45309]'
                                    : 'border-slate-100 bg-slate-50 text-slate-400 grayscale'
                                }`}
                        >
                            <div className={`mb-3 p-3 rounded-full ${isUnlocked ? 'bg-[#F59E0B] text-white shadow-lg shadow-orange-500/30' : 'bg-slate-200'}`}>
                                {getIcon(badge.icon)}
                            </div>
                            <h4 className={`font-bold text-sm mb-1 ${isUnlocked ? 'text-[#92400E]' : 'text-slate-500'}`}>{badge.name}</h4>
                            <p className="text-[10px] leading-tight opacity-80">{badge.description}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
