'use client';

export default function KootaCard({ koota, index }) {
    const percentage = (koota.score / koota.max) * 100;

    let barColor = 'bg-red-400';
    if (percentage >= 70) barColor = 'bg-green-400';
    else if (percentage >= 40) barColor = 'bg-yellow-400';

    let textColor = 'text-red-600 dark:text-red-400';
    if (percentage >= 70) textColor = 'text-green-600 dark:text-green-400';
    else if (percentage >= 40) textColor = 'text-yellow-600 dark:text-yellow-400';

    return (
        <div
            className="glass-card rounded-xl p-4 hover:shadow-md transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100">{koota.label}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{koota.description}</p>
                </div>
                <span className={`text-lg font-bold ${textColor}`}>
                    {koota.score}/{koota.max}
                </span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                <div
                    className={`h-2 rounded-full ${barColor} transition-all duration-1000 ease-out`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
