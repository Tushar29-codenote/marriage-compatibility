'use client';

const ICON_MAP = {
    'Emotional Compatibility': '💕',
    'Communication': '💬',
    'Financial Compatibility': '💰',
    'Long-term Stability': '🏠',
    'Health Compatibility': '🏥',
};

const STATUS_STYLES = {
    'Strong': 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
    'Excellent': 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
    'Very Stable': 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
    'Good': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
    'Stable': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
    'Moderate': 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800',
    'Average': 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800',
    'Needs Attention': 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800',
    'Needs Planning': 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800',
    'Requires Effort': 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800',
    'Consult Expert': 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
};

export default function CompatibilityMetric({ label, value }) {
    const icon = ICON_MAP[label] || '✨';
    const style = STATUS_STYLES[value] || 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';

    return (
        <div className={`flex items-center justify-between p-4 rounded-xl border ${style} transition-all duration-300 hover:shadow-sm`}>
            <div className="flex items-center gap-3">
                <span className="text-xl">{icon}</span>
                <span className="font-medium">{label}</span>
            </div>
            <span className="font-semibold text-sm px-3 py-1 rounded-full bg-white/50 dark:bg-black/20">
                {value}
            </span>
        </div>
    );
}
