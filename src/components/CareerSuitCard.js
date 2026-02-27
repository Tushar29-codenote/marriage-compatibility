'use client';

export default function CareerSuitCard({ careerSuits, rashi }) {
    if (!careerSuits) return null;

    return (
        <div className="glass-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
            {/* Gradient top stripe */}
            <div className="h-1 bg-gradient-to-r from-violet-400 to-purple-500" />

            {/* Header */}
            <div className="px-6 py-4 bg-purple-50 dark:bg-purple-900/20 border-b border-white/50 dark:border-gray-700/50">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <span className="text-xl">🎯</span>
                    Best Career Paths for {rashi}
                </h3>
            </div>

            <div className="p-6">
                {/* Personality trait */}
                <div className="mb-5 p-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl">
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300 flex items-center gap-2">
                        <span>✨</span> {careerSuits.traits}
                    </p>
                </div>

                {/* Top careers */}
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Recommended Career Fields:</p>
                <div className="flex flex-wrap gap-2 mb-5">
                    {careerSuits.topCareers.map((career, index) => (
                        <span
                            key={index}
                            className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900/40 dark:to-violet-900/40 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-full border border-purple-200 dark:border-purple-700 hover:shadow-md transition-all duration-200"
                        >
                            {career}
                        </span>
                    ))}
                </div>

                {/* Advice */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                        <span className="text-lg flex-shrink-0">💡</span>
                        <span>{careerSuits.advice}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
