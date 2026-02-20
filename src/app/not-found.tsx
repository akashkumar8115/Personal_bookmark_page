// src/app/not-found.tsx
"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

// --- Game Constants ---
const CELL_SIZE = 20;
const COLS = 20;
const ROWS = 15;
const WIDTH = COLS * CELL_SIZE;
const HEIGHT = ROWS * CELL_SIZE;
const INITIAL_SNAKE = [
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 }; // Start moving up

export default function NotFound() {
    // --- Game State ---
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isGameActive, setIsGameActive] = useState(false);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    // Refs for mutable game state to avoid re-renders in the loop
    const snake = useRef<{ x: number; y: number }[]>([...INITIAL_SNAKE]);
    const direction = useRef(INITIAL_DIRECTION);
    const nextDirection = useRef(INITIAL_DIRECTION);
    const food = useRef({ x: 5, y: 5 });
    const gameLoop = useRef<NodeJS.Timeout | null>(null);

    // --- Game Logic ---

    const spawnFood = useCallback(() => {
        let newFood: { x: number; y: number };
        while (true) {
            newFood = {
                x: Math.floor(Math.random() * COLS),
                y: Math.floor(Math.random() * ROWS),
            };
            // Ensure food doesn't spawn on snake
            const onSnake = snake.current.some(
                (segment) => segment.x === newFood.x && segment.y === newFood.y
            );
            if (!onSnake) break;
        }
        food.current = newFood;
    }, []);

    const resetGame = () => {
        snake.current = [...INITIAL_SNAKE];
        direction.current = INITIAL_DIRECTION;
        nextDirection.current = INITIAL_DIRECTION;
        setScore(0);
        setGameOver(false);
        setIsGameActive(true);
        spawnFood();
    };

    const draw = useCallback((ctx: CanvasRenderingContext2D) => {
        // Clear Canvas
        ctx.fillStyle = "#0f172a"; // slate-900
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        // Draw Grid (Subtle)
        ctx.strokeStyle = "#1e293b"; // slate-800
        ctx.lineWidth = 1;
        for (let i = 0; i <= COLS; i++) {
            ctx.beginPath();
            ctx.moveTo(i * CELL_SIZE, 0);
            ctx.lineTo(i * CELL_SIZE, HEIGHT);
            ctx.stroke();
        }
        for (let i = 0; i <= ROWS; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * CELL_SIZE);
            ctx.lineTo(WIDTH, i * CELL_SIZE);
            ctx.stroke();
        }

        // Draw Snake
        snake.current.forEach((segment, index) => {
            // Head is brighter
            ctx.fillStyle = index === 0 ? "#34d399" : "#059669"; // emerald-400 : emerald-600

            // Add a slight glow to the head
            if (index === 0) {
                ctx.shadowColor = "#34d399";
                ctx.shadowBlur = 10;
            } else {
                ctx.shadowBlur = 0;
            }

            ctx.fillRect(
                segment.x * CELL_SIZE + 1,
                segment.y * CELL_SIZE + 1,
                CELL_SIZE - 2,
                CELL_SIZE - 2
            );
        });
        ctx.shadowBlur = 0; // Reset shadow

        // Draw Food
        ctx.fillStyle = "#10b981"; // emerald-500
        ctx.beginPath();
        ctx.arc(
            food.current.x * CELL_SIZE + CELL_SIZE / 2,
            food.current.y * CELL_SIZE + CELL_SIZE / 2,
            CELL_SIZE / 3,
            0,
            2 * Math.PI
        );
        ctx.fill();

        // Food Glow
        ctx.shadowColor = "#10b981";
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;

    }, []);

    const update = useCallback(() => {
        if (gameOver) return;

        // Update direction
        direction.current = nextDirection.current;

        const head = snake.current[0];
        if (!head) return;

        const newHead = {
            x: head.x + direction.current.x,
            y: head.y + direction.current.y,
        };

        // Wall Collision
        if (
            newHead.x < 0 ||
            newHead.x >= COLS ||
            newHead.y < 0 ||
            newHead.y >= ROWS
        ) {
            setGameOver(true);
            setIsGameActive(false);
            return;
        }

        // Self Collision
        if (snake.current.some((seg) => seg.x === newHead.x && seg.y === newHead.y)) {
            setGameOver(true);
            setIsGameActive(false);
            return;
        }

        snake.current.unshift(newHead);

        // Food Collision
        if (newHead.x === food.current.x && newHead.y === food.current.y) {
            setScore((s) => s + 10);
            spawnFood();
        } else {
            snake.current.pop();
        }
    }, [gameOver, spawnFood]);

    // Input Handler
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isGameActive) return;

            // Prevent default scrolling for arrow keys
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
                e.preventDefault();
            }

            switch (e.key) {
                case "ArrowUp":
                    if (direction.current.y === 0) nextDirection.current = { x: 0, y: -1 };
                    break;
                case "ArrowDown":
                    if (direction.current.y === 0) nextDirection.current = { x: 0, y: 1 };
                    break;
                case "ArrowLeft":
                    if (direction.current.x === 0) nextDirection.current = { x: -1, y: 0 };
                    break;
                case "ArrowRight":
                    if (direction.current.x === 0) nextDirection.current = { x: 1, y: 0 };
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isGameActive]);

    // Game Loop
    useEffect(() => {
        if (isGameActive && !gameOver) {
            gameLoop.current = setInterval(() => {
                update();
                const ctx = canvasRef.current?.getContext("2d");
                if (ctx) draw(ctx);
            }, 100);
        } else if (!isGameActive && canvasRef.current) {
            // Initial Draw or Game Over Draw
            const ctx = canvasRef.current.getContext("2d");
            if (ctx) draw(ctx);
        }

        return () => {
            if (gameLoop.current) clearInterval(gameLoop.current);
        };
    }, [isGameActive, gameOver, update, draw]);


    // --- Render ---
    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 relative overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-200"
            style={{
                backgroundImage: `linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
            }}
        >
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-96 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="z-10 text-center px-4"
            >
                <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-emerald-400 to-emerald-700 drop-shadow-2xl mb-2">
                    404
                </h1>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-200 mb-6">
                    Oops! Page not found.
                </h2>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                <div className="flex justify-center gap-4 mb-12">
                    <Link
                        href="/"
                        className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20 border border-emerald-500/20"
                    >
                        Return to Dashboard
                    </Link>
                </div>

                {/* Easter Egg Game Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="relative inline-block rounded-2xl overflow-hidden border border-emerald-500/30 shadow-2xl shadow-emerald-900/20 bg-slate-900"
                >
                    <div className="absolute top-4 left-4 text-xs font-mono text-emerald-500/70 pointer-events-none">
                        SCORE: {score}
                    </div>

                    <canvas
                        ref={canvasRef}
                        width={WIDTH}
                        height={HEIGHT}
                        className="block cursor-pointer"
                        onClick={!isGameActive ? resetGame : undefined}
                    />

                    {/* Game Over / Start Overlay */}
                    {!isGameActive && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm">
                            <h3 className="text-2xl font-bold text-emerald-400 mb-2">
                                {gameOver ? "Game Over" : "Lost?"}
                            </h3>
                            <p className="text-slate-300 text-sm mb-4">
                                {gameOver ? `Final Score: ${score}` : "Play Snake while you wait"}
                            </p>
                            <button
                                onClick={resetGame}
                                className="px-4 py-2 rounded-lg bg-slate-800 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-900/30 transition-colors text-sm font-mono"
                            >
                                {gameOver ? "Try Again" : "Start Game"}
                            </button>
                            <p className="mt-4 text-[10px] text-slate-500 uppercase tracking-widest">
                                Use Arrow Keys to Move
                            </p>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
}
