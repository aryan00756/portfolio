"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function LoadingScreen() {
    const [isVisible, setIsVisible] = useState(true);
    const [isClient, setIsClient] = useState(false);
    const [showSkip, setShowSkip] = useState(false);

    // Sequence completion states to trigger next steps based purely on time or skip
    const [seqPhase, setSeqPhase] = useState(0);
    // 0: Init (0s)
    // 1: Logo visible (0s-0.5s)
    // 2: Terminal typing (0.5s-1.8s)
    // 3: Progress bar (1.8s-2.8s)
    // 4: Fade out content (2.8s-3.2s)
    // 5: Slide up & Unmount (3.2s)

    // Initialization & Session Storage Check
    useEffect(() => {
        setIsClient(true);
        const hasLoaded = sessionStorage.getItem("loaded");
        if (hasLoaded === "true") {
            setIsVisible(false); // Skip immediately
        } else {
            // Start timeline
            const t1 = setTimeout(() => setSeqPhase(1), 0);
            const t2 = setTimeout(() => setSeqPhase(2), 500);
            const tSkip = setTimeout(() => setShowSkip(true), 1000); // Show skip after 1s
            const t3 = setTimeout(() => setSeqPhase(3), 1800);
            const t4 = setTimeout(() => setSeqPhase(4), 2800);
            const t5 = setTimeout(() => {
                setSeqPhase(5);
                completeLoading();
            }, 3200);

            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
                clearTimeout(tSkip);
                clearTimeout(t3);
                clearTimeout(t4);
                clearTimeout(t5);
            };
        }
    }, []);

    const completeLoading = () => {
        sessionStorage.setItem("loaded", "true");
        setIsVisible(false);
    };

    const handleSkip = () => {
        // Jump straight to slide up phase
        setSeqPhase(5);
        completeLoading();
    };

    if (!isClient) return null; // Avoid hydration mismatch

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    key="loading-screen"
                    initial={{ y: 0 }}
                    exit={{ y: "-100vh" }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#050508] overflow-hidden"
                >
                    {/* Brief Flash at 2.8s */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: seqPhase === 4 ? 1 : 0 }}
                        transition={{ duration: 0.1 }}
                        className="absolute inset-0 bg-white/5 pointer-events-none z-0"
                    />

                    <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: seqPhase >= 4 ? 0 : 1 }}
                        transition={{ duration: 0.4, ease: "easeIn" }}
                        className="relative z-10 flex flex-col items-center w-full max-w-sm px-6"
                    >
                        {/* STEP 1: Logo */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="font-display font-bold text-[3rem] md:text-[4rem] tracking-wider mb-8"
                        >
                            <span className="text-[#FF4500]">A</span>
                            <span className="text-[#00BFFF]">Y</span>
                        </motion.div>

                        {/* STEP 2: Terminal Text */}
                        <div className="w-full flex flex-col gap-2 font-mono text-[0.7rem] md:text-[0.8rem] min-h-[120px]">
                            {seqPhase >= 2 && (
                                <>
                                    <TypewriterText
                                        text="> INITIALIZING NEURAL INTERFACE..."
                                        speed={30}
                                        className="text-[#FF4500]"
                                        delay={0}
                                    />
                                    <TypewriterText
                                        text="> LOADING ARYAN YADAV.EXE"
                                        speed={25}
                                        className="text-white/70"
                                        delay={960} // Waits for line 1 (~32 * 30ms = 960ms)
                                    />

                                    {/* Line 3 */}
                                    <div className="flex justify-between w-full h-4 mt-1">
                                        <TypewriterText
                                            text="> ML SYSTEMS............"
                                            speed={25}
                                            className="text-[#00BFFF]"
                                            delay={1585} // Line 1 (960) + Line 2 (625) = 1585
                                        />
                                        <DelayedShow delay={2185}>
                                            <span className="text-green-500 whitespace-nowrap">ONLINE ✓</span>
                                        </DelayedShow>
                                    </div>

                                    {/* Line 4 */}
                                    <div className="flex justify-between w-full h-4">
                                        <TypewriterText
                                            text="> COMPUTER VISION......."
                                            speed={25}
                                            className="text-[#00BFFF]"
                                            delay={2185} // Previous + Line 3 dots (600) = 2185
                                        />
                                        <DelayedShow delay={2785}>
                                            <span className="text-green-500 whitespace-nowrap">ONLINE ✓</span>
                                        </DelayedShow>
                                    </div>

                                    {/* Line 5 */}
                                    <div className="flex justify-between w-full h-4">
                                        <TypewriterText
                                            text="> GENAI ENGINE.........."
                                            speed={25}
                                            className="text-[#00BFFF]"
                                            delay={2785} // Previous + Line 4 dots (600) = 2785
                                        />
                                        <DelayedShow delay={3385}>
                                            <span className="text-green-500 whitespace-nowrap">ONLINE ✓</span>
                                        </DelayedShow>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* STEP 3: Progress Bar */}
                        <div className="mt-8 relative w-[240px] md:w-[280px]">
                            {/* Fake hidden space to keep height */}
                            <div className="h-4 w-full" />

                            {seqPhase >= 3 && (
                                <div className="absolute inset-0">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-transparent">.</span>
                                        <Counter duration={1} />
                                    </div>
                                    <div className="w-full h-[2px] bg-white/10 rounded-sm overflow-hidden">
                                        <motion.div
                                            initial={{ width: "0%" }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 1, ease: "easeInOut" }}
                                            className="h-full bg-gradient-to-r from-[#FF4500] via-[#FF8C00] to-[#00BFFF]"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                    </motion.div>

                    {/* SKIP BUTTON */}
                    <AnimatePresence>
                        {showSkip && seqPhase < 4 && (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={handleSkip}
                                className="absolute bottom-6 right-6 font-mono text-[0.7rem] text-white/30 hover:text-white/70 tracking-widest transition-colors cursor-pointer"
                            >
                                SKIP &rsaquo;
                            </motion.button>
                        )}
                    </AnimatePresence>

                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Helper components for precise timing

function TypewriterText({ text, speed, className, delay }: { text: string, speed: number, className: string, delay: number }) {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        let interval: NodeJS.Timeout;

        timeout = setTimeout(() => {
            let i = 0;
            interval = setInterval(() => {
                setDisplayedText((prev) => text.substring(0, i + 1));
                i++;
                if (i >= text.length) clearInterval(interval);
            }, speed);
        }, delay);

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, [text, speed, delay]);

    return <span className={`whitespace-nowrap ${className}`}>{displayedText}</span>;
}

function DelayedShow({ children, delay }: { children: React.ReactNode, delay: number }) {
    const [show, setShow] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setShow(true), delay);
        return () => clearTimeout(t);
    }, [delay]);
    return show ? <>{children}</> : null;
}

function Counter({ duration }: { duration: number }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTimestamp: number | null = null;
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
            setCount(Math.floor(progress * 100));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }, [duration]);

    return <span className="font-mono text-[0.7rem] text-white/50">{count}%</span>;
}
