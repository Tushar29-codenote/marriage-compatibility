'use client';

import { useEffect, useState } from 'react';

export default function ScoreCircle({ score, maxScore, status, statusEmoji }) {
    const [animatedScore, setAnimatedScore] = useState(0);
    const percentage = (score / maxScore) * 100;
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (animatedScore / maxScore) * circumference;

    let strokeColor = '#ef4444';
    if (percentage >= 70) strokeColor = '#22c55e';
    else if (percentage >= 50) strokeColor = '#eab308';

    useEffect(() => {
        const timer = setTimeout(() => {
            let current = 0;
            const increment = score / 40;
            const interval = setInterval(() => {
                current += increment;
                if (current >= score) {
                    setAnimatedScore(score);
                    clearInterval(interval);
                } else {
                    setAnimatedScore(current);
                }
            }, 30);
            return () => clearInterval(interval);
        }, 300);
        return () => clearTimeout(timer);
    }, [score]);

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-48 h-48">
                <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                        cx="50" cy="50" r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                        cx="50" cy="50" r="45"
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-gray-800 dark:text-gray-100">
                        {Math.round(animatedScore)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">out of {maxScore}</span>
                </div>
            </div>
            <div className="mt-4 text-center">
                <span className="text-3xl">{statusEmoji}</span>
                <p className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">{status}</p>
            </div>
        </div>
    );
}
