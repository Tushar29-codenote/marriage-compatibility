'use client';

export default function PredictionCard({ title, icon, items, accentColor }) {
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

    return (
        <div className="glass-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
            {/* Gradient top stripe */}
            <div className={`h-1 bg-gradient-to-r ${borderGradient[accentColor] || borderGradient.pink}`} />

            {/* Header */}
            <div className={`px-6 py-4 ${headerBg[accentColor] || headerBg.pink} border-b border-white/50 dark:border-gray-700/50`}>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <span className="text-xl">{icon}</span>
                    {title}
                </h3>
            </div>

            {/* Items */}
            <div className="p-6 space-y-4">
                {items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                        <span className="text-lg mt-0.5 flex-shrink-0">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{item.label}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{item.value}</p>
                            {item.subtext && (
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 italic">{item.subtext}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
