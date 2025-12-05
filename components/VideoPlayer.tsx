import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipBack, SkipForward } from 'lucide-react';

interface VideoPlayerProps {
    title: string;
    duration: string;
    thumbnail?: string;
    videoUrl?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ title, duration, thumbnail, videoUrl }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
        }
    }, [isPlaying]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = isMuted;
        }
    }, [isMuted]);

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const current = videoRef.current.currentTime;
            const total = videoRef.current.duration;
            setProgress((current / total) * 100);
        }
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (videoRef.current) {
            const progressBar = e.currentTarget;
            const rect = progressBar.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = (x / rect.width);
            videoRef.current.currentTime = percentage * videoRef.current.duration;
        }
    };

    // Fallback mock progress if no videoUrl
    useEffect(() => {
        if (!videoUrl) {
            let interval: NodeJS.Timeout;
            if (isPlaying) {
                interval = setInterval(() => {
                    setProgress(p => (p >= 100 ? 0 : p + 0.5));
                }, 100);
            }
            return () => clearInterval(interval);
        }
    }, [isPlaying, videoUrl]);

    return (
        <div className="w-full bg-black rounded-2xl overflow-hidden shadow-2xl group relative aspect-video">
            {videoUrl ? (
                <video
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full h-full object-cover"
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => setIsPlaying(false)}
                    poster={thumbnail}
                />
            ) : (
                /* Video Placeholder / Thumbnail for Mock */
                <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                    {thumbnail ? (
                        <img src={thumbnail} alt={title} className="w-full h-full object-cover opacity-60" />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
                    )}
                </div>
            )}

            {/* Play Button Overlay */}
            {!isPlaying && (
                <button
                    onClick={() => setIsPlaying(true)}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:scale-110 hover:bg-white/20 transition-all border border-white/20 shadow-2xl group-hover:shadow-blue-500/20"
                >
                    <Play size={32} className="ml-1 fill-white" />
                </button>
            )}

            {/* Controls Overlay */}
            <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 transition-opacity duration-300 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                {/* Progress Bar */}
                <div
                    className="w-full h-1.5 bg-white/20 rounded-full mb-4 cursor-pointer hover:h-2.5 transition-all relative group/progress"
                    onClick={handleSeek}
                >
                    <div
                        className="h-full bg-[#2563EB] rounded-full relative"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                    </div>
                </div>

                <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-6">
                        <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-[#2563EB] transition-colors">
                            {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current" />}
                        </button>

                        <div className="flex items-center space-x-4 text-sm font-medium">
                            <button className="hover:text-white/80"><SkipBack size={20} /></button>
                            <button className="hover:text-white/80"><SkipForward size={20} /></button>
                        </div>

                        <div className="flex items-center space-x-2 group/volume">
                            <button onClick={() => setIsMuted(!isMuted)} className="hover:text-[#2563EB] transition-colors">
                                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                            </button>
                            <div className="w-0 overflow-hidden group-hover/volume:w-20 transition-all duration-300">
                                <div className="w-20 h-1 bg-white/20 rounded-full ml-2">
                                    <div className="w-2/3 h-full bg-white rounded-full" />
                                </div>
                            </div>
                        </div>

                        <span className="text-xs font-medium text-white/70">
                            {videoUrl && videoRef.current ? (
                                `${Math.floor(videoRef.current.currentTime / 60)}:${Math.floor(videoRef.current.currentTime % 60).toString().padStart(2, '0')} / ${duration}`
                            ) : (
                                `${Math.floor((progress / 100) * parseInt(duration))}m / ${duration}`
                            )}
                        </span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="hover:text-[#2563EB] transition-colors"><Settings size={20} /></button>
                        <button className="hover:text-[#2563EB] transition-colors"><Maximize size={20} /></button>
                    </div>
                </div>
            </div>

            {/* Title Overlay (Top) */}
            <div className={`absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-300 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                <h3 className="text-white font-display font-bold text-lg">{title}</h3>
            </div>
        </div>
    );
};
