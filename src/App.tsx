import { motion } from 'motion/react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Music, Terminal, ShieldAlert } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono selection:bg-[#ff00ff] selection:text-black relative">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none noise-overlay z-50"></div>
      <div className="fixed inset-0 pointer-events-none scanlines z-40"></div>
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#00ffff]/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#ff00ff]/10 rounded-full blur-[120px] mix-blend-screen" />
        
        {/* Retro Grid Floor Effect with tear */}
        <div 
          className="absolute bottom-0 left-0 w-full h-[30%] opacity-30 screen-tear"
          style={{
            background: 'linear-gradient(0deg, #00ffff 0%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, transparent, black)',
            perspective: '1000px'
          }}
        >
          <div 
            className="absolute inset-0 grid grid-cols-[repeat(20,minmax(0,1fr))]"
            style={{ transform: 'rotateX(60deg)', transformOrigin: 'bottom' }}
          >
            {Array.from({ length: 400 }).map((_, i) => (
              <div key={i} className="border-[0.5px] border-[#00ffff]/30 w-full h-20" />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation / Header */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-4 border-b-2 border-white/10 bg-black backdrop-blur-none uppercase tracking-widest">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-black border-2 border-[#00ffff] shadow-[4px_4px_0px_#ff00ff]">
            <Terminal className="w-6 h-6 text-[#00ffff]" />
          </div>
          <div>
            <h1 className="text-2xl font-digital text-white flex items-center gap-2">
              <span className="text-white drop-shadow-[2px_2px_0px_#00ffff]">SYS_</span>
              <span className="text-[#ff00ff] glitch-text relative">SERPENT.EXE</span>
            </h1>
            <p className="text-xs text-[#00ffff] font-mono tracking-widest uppercase mt-1">KERNEL_BOOT_SEQ_INITIALIZED</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-gray-400">
          <a href="#" className="hover:text-[#ff00ff] hover:bg-[#00ffff] hover:text-black px-2 transition-colors">/EXTRACT</a>
          <a href="#" className="hover:text-[#ff00ff] hover:bg-[#00ffff] hover:text-black px-2 transition-colors">/MEMORY</a>
          <a href="#" className="hover:text-[#ff00ff] hover:bg-[#00ffff] hover:text-black px-2 transition-colors">/CONFIG</a>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 border-2 border-[#ff0055] bg-black text-[#ff0055] hover:bg-[#ff0055] hover:text-black transition-colors focus:ring-4 focus:ring-[#00ffff]">
          <ShieldAlert className="w-4 h-4" />
          <span className="text-sm font-bold">OVERRIDE</span>
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center">
        <div className="w-full flex flex-col lg:flex-row gap-12 items-center lg:items-start justify-center max-w-7xl">
          
          {/* Left Side: Info (Desktop Only) */}
          <motion.div 
            className="hidden lg:flex flex-col gap-8 w-64 pt-20"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-4 border-l-4 border-[#00ffff] bg-black border-2 border-dashed border-gray-800">
              <h4 className="text-xs text-[#00ffff] mb-2 uppercase">CURRENT_TASK</h4>
              <p className="text-sm text-white bg-[#00ffff] text-black px-1 inline-block">Execute Directive: FEED</p>
            </div>
            <div className="p-4 border-l-4 border-[#ff00ff] bg-black border-2 border-dashed border-gray-800">
              <h4 className="text-xs text-[#ff00ff] mb-2 uppercase">AURAL_FEED</h4>
              <p className="text-sm text-white bg-[#ff00ff] text-black px-1 inline-block">Subsystem Intercepted</p>
            </div>
            
            <div className="mt-12 opacity-80">
              <p className="text-xs leading-relaxed text-[#ff0055]">
                <span className="animate-pulse">&gt;</span> WAITING_FOR_INPUT...<br/>
                <span className="animate-pulse">&gt;</span> PARSING_DATA_STREAM...<br/>
                <span className="animate-pulse">&gt;</span> INJECTING_NOISE...<br/>
                <span className="animate-pulse">&gt;</span> CORRUPTION_DETECTED
              </p>
            </div>
          </motion.div>

          {/* Center: Snake Game */}
          <motion.div 
            className="flex-1 flex justify-center w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative group border-4 border-[#00ffff] p-1 bg-black shadow-[8px_8px_0px_#ff00ff] w-full max-w-[420px]">
              {/* Screen tear on hover */}
              <div className="absolute inset-0 pointer-events-none group-hover:screen-tear bg-transparent z-20"></div>
              <SnakeGame />
            </div>
          </motion.div>

          {/* Right Side: Music Player */}
          <motion.div 
            className="w-full lg:w-[400px] flex flex-col gap-4 lg:pt-20"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-2 px-2 border-b-2 border-dashed border-[#ff00ff] pb-2">
              <Music className="w-5 h-5 text-[#ff00ff]" />
              <h2 className="text-lg font-digital uppercase text-white tracking-widest">AURAL_OVERRIDE_MODULE</h2>
            </div>
            <MusicPlayer />
            
            {/* Playback Stats */}
            <div className="mt-4 p-4 border-2 border-[#00ffff] bg-black text-xs uppercase text-gray-400">
               <div className="flex justify-between items-center border-b border-gray-800 pb-2 mb-2">
                  <span>DATA_RATE</span>
                  <span className="text-[#ff00ff] font-bold">10110011 BPS</span>
               </div>
               <div className="flex justify-between items-center">
                  <span>PACKET_LOSS</span>
                  <span className="text-red-500 font-bold glitch-text text-[10px]">CRITICAL</span>
               </div>
            </div>
          </motion.div>

        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="fixed bottom-0 left-0 w-full py-2 px-6 flex justify-between items-center bg-[#00ffff] text-black z-20 font-bold uppercase tracking-widest border-t-4 border-[#ff00ff]">
         <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2 bg-black text-[#00ffff] px-2 py-1">
               <div className="w-2 h-2 bg-[#ff00ff] animate-ping" />
               LINK_ESTABLISHED
            </div>
            <span className="hidden sm:inline">HEX_NODE_7X9</span>
         </div>
         <div className="text-xs bg-black text-white px-2 py-1">
            (C) 2084 CYBER_DYNAMICS
         </div>
      </footer>
    </div>
  );
}
