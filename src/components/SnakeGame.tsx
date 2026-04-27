import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Play, Pause, AlertTriangle } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;
const MIN_SPEED = 60;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    setDirection('RIGHT');
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
  };

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check collisions with walls
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Check collisions with self
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if food eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => {
          const newScore = s + 10;
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
        setSpeed((s) => Math.max(MIN_SPEED, s - SPEED_INCREMENT));
        // Keep the tail (don't pop)
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isPaused, isGameOver, generateFood, highScore]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused((p) => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, isPaused, isGameOver, speed]);

  return (
    <div id="snake-container" className="flex flex-col items-center gap-6 p-4">
      <div className="flex justify-between w-full max-w-[400px] mb-2 px-4 shadow-[0_4px_0_#00ffff] pb-2 border-b-2 border-dashed border-[#ff00ff]">
        <div className="flex flex-col">
          <span className="text-[#00ffff] text-[12px] font-mono uppercase tracking-widest leading-none mb-1">DATA_HARVESTED</span>
          <span className="text-5xl font-black text-white font-digital glitch-text tracking-tighter">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[#ff00ff] text-[12px] font-mono uppercase tracking-widest leading-none mb-1">MAX_YIELD</span>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#ffff00]" />
            <span className="text-4xl font-bold text-white font-digital tracking-tighter">
              {highScore.toString().padStart(4, '0')}
            </span>
          </div>
        </div>
      </div>

      <div 
        className="relative bg-black border-2 border-[#00ffff] overflow-hidden shadow-[inset_0_0_20px_rgba(0,255,255,0.2)] flex items-center justify-center p-1"
        style={{ width: 400, height: 400 }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#00ffff]/10 via-black to-black">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border-[1px] border-dashed border-[#00ffff]/20" />
          ))}
        </div>

        <div className="w-[380px] h-[380px] relative">
          {/* Snake segments */}
          {snake.map((segment, i) => (
            <motion.div
              key={`${i}-${segment.x}-${segment.y}`}
              className={`absolute border border-black ${i === 0 ? 'bg-[#00ffff] z-10 shadow-[0_0_10px_#00ffff]' : 'bg-[#00aaaa]'}`}
              initial={false}
              animate={{
                left: (segment.x * 100) / GRID_SIZE + '%',
                top: (segment.y * 100) / GRID_SIZE + '%',
              }}
              transition={{ type: 'tween', duration: 0.1 }}
              style={{
                width: 100 / GRID_SIZE + '%',
                height: 100 / GRID_SIZE + '%',
              }}
            />
          ))}

          {/* Food */}
          <motion.div
            className="absolute bg-[#ff0055] border-2 border-white shadow-[0_0_15px_#ff0055] z-20"
            animate={{
              scale: [1, 1.2, 1],
              left: (food.x * 100) / GRID_SIZE + '%',
              top: (food.y * 100) / GRID_SIZE + '%',
              rotate: [0, 90, 180, 270, 360]
            }}
            transition={{
              scale: { repeat: Infinity, duration: 1 },
              rotate: { repeat: Infinity, duration: 2, ease: "linear" },
              left: { duration: 0 },
              top: { duration: 0 },
            }}
            style={{
              width: 100 / GRID_SIZE + '%',
              height: 100 / GRID_SIZE + '%',
            }}
          />
        </div>

        {/* Overlays */}
        <AnimatePresence>
          {(isPaused || isGameOver) && (
            <motion.div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {isGameOver ? (
                <div className="text-center p-8 border-4 border-[#ff0055] bg-black shadow-[8px_8px_0px_rgba(255,0,85,0.5)]">
                  <AlertTriangle className="w-16 h-16 text-[#ff0055] mx-auto mb-4 animate-ping opacity-50 absolute right-4 top-4" />
                  <h2 className="text-4xl font-digital text-[#ff0055] mb-2 uppercase tracking-tighter glitch-text">FATAL_ERROR</h2>
                  <p className="text-white mb-6 font-mono border-b border-[#ff0055] pb-2">DATA_YIELD: {score}</p>
                  <button 
                    onClick={resetGame}
                    className="flex items-center gap-2 px-6 py-3 bg-[#00ffff] hover:bg-white text-black font-bold uppercase transition-all shadow-[4px_4px_0_#ff0055] active:shadow-none active:translate-x-1 active:translate-y-1 group border-2 border-transparent hover:border-black"
                  >
                    <RotateCcw className="w-5 h-5 group-hover:-rotate-90 transition-transform duration-500" />
                    REBOOT_SEQ
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="flex items-center gap-3 px-8 py-4 bg-[#ff00ff] hover:bg-white text-black font-digital text-xl uppercase transition-all shadow-[6px_6px_0_#00ffff] active:shadow-none active:translate-x-1 active:translate-y-1 group"
                  >
                    <Play className="fill-current" />
                    INITIATE_EXECUTION
                  </button>
                  <p className="mt-6 text-[#00ffff] font-mono text-sm animate-[pulse_1s_ease-in-out_infinite]">AWAITING SPACEBAR INPUT...</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-[#ff00ff] text-sm font-mono uppercase tracking-[0.2em] bg-black px-4 py-1 border border-dashed border-[#ff00ff]">
        [W,A,S,D] OR ARROWS TO OVERRIDE TRAJECTORY
      </div>
    </div>
  );
};
