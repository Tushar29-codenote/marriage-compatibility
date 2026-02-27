'use client';

import { useState } from 'react';

export default function PredictionCard({ title, icon, items, accentColor, detailedSummary }) {
    const [expanded, setExpanded] = useState({});

    const borderGradient = {
        pink: 'from-pink-400 to-rose-400',
        orange: 'from-orange-400 to-amber-400',
        blue: 'from-blue-400 to-indigo-400',
        green: 'from-green-400 to-emerald-400',
        purple: 'from-purple-400 to-violet-400',
    };

    const headerBg = {
        pink: 'bg-pink-50 dark:bg-pink-900/20',
        orange: 'bg-orange-50 dark:bg-orange-900/20',
        blue: 'bg-blue-50 dark:bg-blue-900/20',
        green: 'bg-green-50 dark:bg-green-900/20',
        purple: 'bg-purple-50 dark:bg-purple-900/20',
    };

    const summaryBg = {
        pink: 'from-pink-50 to-rose-50 dark:from-pink-900/10 dark:to-rose-900/10',
        orange: 'from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10',
        blue: 'from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10',
        green: 'from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10',
        purple: 'from-purple-50 to-violet-50 dark:from-purple-900/10 dark:to-violet-900/10',
    };

    const toggleItem = (index) => {
        setExpanded(prev => ({ ...prev, [index]: !prev[index] }));
    };

    // Check if text is long enough to truncate
    const TRUNCATE_LENGTH = 120;

    return (
        <div className="glass-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
            <div className={`h-1 bg-gradient-to-r ${borderGradient[accentColor] || borderGradient.pink}`} />

            <div className={`px-6 py-4 ${headerBg[accentColor] || headerBg.pink} border-b border-white/50 dark:border-gray-700/50`}>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <span className="text-xl">{icon}</span>
                    {title}
                </h3>
            </div>

            <div className="p-6 space-y-5">
                {items.map((item, index) => {
                    const isLong = item.value && item.value.length > TRUNCATE_LENGTH;
                    const isExpanded = expanded[index];
                    const displayValue = isLong && !isExpanded
                        ? item.value.substring(0, TRUNCATE_LENGTH) + '...'
                        : item.value;

                    return (
                        <div key={index} className="flex items-start gap-3">
                            <span className="text-lg mt-0.5 flex-shrink-0">{item.icon}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{item.label}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                    {displayValue}
                                </p>
                                {item.subtext && (
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 italic leading-relaxed">{item.subtext}</p>
                                )}
                                {isLong && (
                                    <button
                                        onClick={() => toggleItem(index)}
                                        className="text-xs font-medium mt-1.5 text-purple-500 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                                    >
                                        {isExpanded ? '▲ Show less' : '▼ Read more'}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Detailed Summary */}
            {detailedSummary && (
                <div className={`mx-6 mb-6 p-4 rounded-xl bg-gradient-to-r ${summaryBg[accentColor] || summaryBg.pink} border border-white/50 dark:border-gray-700/30`}>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                        <span>📜</span> Detailed Vedic Analysis
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        {detailedSummary}
                    </p>
                </div>
            )}
        </div>
    );
}
