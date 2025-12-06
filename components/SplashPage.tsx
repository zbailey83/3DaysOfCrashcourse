import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Terminal, CheckCircle2, Calendar, Play } from 'lucide-react';

interface SplashPageProps {
    onEnter: () => void;
}

export const SplashPage: React.FC<SplashPageProps> = ({ onEnter }) => {
    return (
        <div className="min-h-screen bg-[#020712] text-white overflow-x-hidden relative selection:bg-cyan-500/30">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] mix-blend-screen animate-pulse-slow" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] mix-blend-screen" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
            </div>

            {/* Navigation */}
            <nav className="relative z-20 flex justify-between items-center px-6 py-6 max-w-7xl mx-auto">
                <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <span className="font-bold font-mono text-xl text-white">3D</span>
                    </div>
                    <span className="font-display font-bold text-xl tracking-tight">CrashCourse</span>
                </div>
                <div>
                    <button
                        onClick={onEnter}
                        className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium backdrop-blur-sm"
                    >
                        Log In
                    </button>
                </div>
            </nav>

            {/* Main Hero Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-24 lg:pt-24 lg:flex lg:items-center lg:gap-16">

                {/* Left Column: Copy */}
                <div className="lg:w-1/2 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-wider uppercase"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                        <span>Last 2 spots remaining</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl lg:text-7xl font-display font-bold leading-[1.1] tracking-tight"
                    >
                        Build Your AI <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient-x">
                            Content Machine
                        </span> <br />
                        in 72 Hours.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-slate-400 max-w-xl leading-relaxed"
                    >
                        A 3-Day Weekend Intensive for marketers who want output, not theory.
                        Leave with <strong className="text-white">30+ assets</strong> and a fully automated system.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 pt-4"
                    >
                        <button
                            onClick={onEnter}
                            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Start The Crash Course
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </button>
                        <button
                            onClick={() => { }}
                            className="px-8 py-4 rounded-xl font-bold text-white border border-white/10 hover:bg-white/5 transition-colors flex items-center gap-2"
                        >
                            <Play className="w-4 h-4 fill-current" />
                            Watch Syllabus
                        </button>
                    </motion.div>

                    {/* Social Proof / Footer Info */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="pt-12 border-t border-white/10 flex flex-col sm:flex-row sm:items-center gap-6 text-sm text-slate-500"
                    >
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-purple-400" />
                            <span>Next Start: <span className="text-slate-300">12-14th December</span></span>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Hero Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, rotate: 1 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="lg:w-1/2 mt-16 lg:mt-0 relative"
                >
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/20 border border-white/10 bg-[#0A0F1E]/80 backdrop-blur-sm group">
                        {/* Window Controls */}
                        <div className="absolute top-0 left-0 right-0 h-10 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2 z-20">
                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                            <div className="ml-4 text-xs font-mono text-slate-500">course_init.sh</div>
                        </div>

                        {/* The Image Itself */}
                        <div className="relative pt-10">
                            {/* User's provided hero will be placed here. Styling to make it look embedded */}
                            <img
                                src="/hero-splash.png"
                                alt="Dashboard Preview"
                                className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                            />

                            {/* Overlay Gradient for integration */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#020712] via-transparent to-transparent pointer-events-none" />
                        </div>

                        {/* Floating Badge (Glassmorphism) */}
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 1, duration: 0.5 }}
                            className="absolute bottom-6 right-6 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 shadow-xl max-w-xs"
                        >
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                                    <CheckCircle2 size={20} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-white">System Ready</h4>
                                    <p className="text-xs text-slate-400 mt-1">Brand voice analyzed. 30 content assets generated.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Decorative Elements behind the image */}
                    <div className="absolute -z-10 -top-10 -right-10 w-24 h-24 bg-cyan-500/30 rounded-full blur-2xl animate-pulse" />
                    <div className="absolute -z-10 -bottom-10 -left-10 w-32 h-32 bg-purple-500/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
                </motion.div>
            </main>
        </div>
    );
};
