import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Zap } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  artist: string;
  cover: string;
  url: string;
  color: string;
}

const DUMMY_TRACKS: Track[] = [
  {
    id: 1,
    title: "Electric Dreams",
    artist: "SynthAI Alpha",
    cover: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=600",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "#00ffff",
  },
  {
    id: 2,
    title: "Cyber Runner",
    artist: "NeonByte",
    cover: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "#ff00ff",
  },
  {
    id: 3,
    title: "Digital Horizon",
    artist: "Glitch Master",
    cover: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=600",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "#ff0055",
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play blocked", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div id="music-player" className="w-full max-w-[400px] p-4 bg-black border-2 border-dashed border-[#00ffff] relative overflow-visible group">
      
      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex flex-col gap-4">
        <div className="flex gap-4 items-start">
          <div className="relative w-24 h-24 border-2 border-[#ff00ff] bg-black shadow-[4px_4px_0_#00ffff]">
             <img 
              src={currentTrack.cover} 
              alt={currentTrack.title}
              className={`w-full h-full object-cover filter contrast-125 saturate-150 ${isPlaying ? 'glitch-text' : ''}`}
              style={{ mixBlendMode: 'lighten' }}
              referrerPolicy="no-referrer"
            />
            {isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="flex gap-1 items-end h-8">
                  {[0.4, 0.7, 1, 0.8, 0.5, 0.9].map((h, i) => (
                    <motion.div 
                      key={i}
                      className="w-1.5"
                      style={{ backgroundColor: currentTrack.color }}
                      animate={{ height: [`${h*100}%`, `${(h*0.2)*100}%`, `${h*100}%`] }}
                      transition={{ duration: 0.3 + Math.random(), repeat: Infinity }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0 flex flex-col justify-between h-24">
            <div>
              <h3 className="text-xl font-digital text-white truncate break-all leading-none">{currentTrack.title}</h3>
              <p className="text-sm text-[#00ffff] font-mono mt-1">{currentTrack.artist}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 border border-[#ff00ff] text-[#ff00ff] font-bold uppercase tracking-wider bg-black inline-block">SYNTH_AI_GEN</span>
              <span className="text-[10px] text-gray-500 font-mono tracking-widest">{currentTrackIndex + 1}/{DUMMY_TRACKS.length}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col gap-1 mt-2">
          <div className="relative w-full h-2 bg-gray-900 border border-gray-800 cursor-pointer overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 h-full"
              animate={{ width: `${progress}%` }}
              style={{ 
                backgroundColor: currentTrack.color,
                boxShadow: `0 0 10px ${currentTrack.color}`
              }}
            />
            {/* Grid overly for progress */}
            <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVQIW2NkYGD4z8DAwMgAI0AMDA4xAAC8wA40AAAAAElFTkSuQmCC')] opacity-50 mix-blend-overlay"></div>
          </div>
          <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest">
            <span className="text-gray-500">PKT_STREAM</span>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#ff00ff] animate-pulse" />
              <span className="text-[#00ffff]">SYNC_OK</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between border-t border-dashed border-[#00ffff]/30 pt-4 mt-2">
          <button 
            onClick={handlePrev}
            className="p-2 border-2 border-transparent text-[#00ffff] hover:border-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-colors"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-16 h-12 flex items-center justify-center border-2 border-[#ff00ff] hover:bg-[#ff00ff] hover:text-black text-[#ff00ff] transition-all active:scale-95 shadow-[4px_4px_0_#00ffff]"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
          </button>

          <button 
            onClick={handleNext}
            className="p-2 border-2 border-transparent text-[#00ffff] hover:border-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-colors"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};
