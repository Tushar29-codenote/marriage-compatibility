'use client';

export default function BirthDetailsForm({ title, icon, person, onChange, accentColor }) {
    const borderColor = accentColor === 'pink'
        ? 'border-pink-200 focus:border-pink-400 dark:border-pink-800 dark:focus:border-pink-500'
        : 'border-orange-200 focus:border-orange-400 dark:border-orange-800 dark:focus:border-orange-500';
    const iconBg = accentColor === 'pink' ? 'bg-pink-50 dark:bg-pink-900/30' : 'bg-orange-50 dark:bg-orange-900/30';

    return (
        <div className="glass-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center text-2xl`}>
                    {icon}
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{title}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Enter birth details</p>
                </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                        Name <span className="text-gray-400 dark:text-gray-500">(optional)</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter name"
                        value={person.name}
                        onChange={(e) => onChange({ ...person, name: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border ${borderColor} bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200`}
                    />
                </div>

                {/* Date of Birth */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                        Date of Birth <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="date"
                        value={person.dob}
                        onChange={(e) => onChange({ ...person, dob: e.target.value })}
                        required
                        className={`w-full px-4 py-3 rounded-xl border ${borderColor} bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-200 transition-all duration-200`}
                    />
                </div>

                {/* Time of Birth */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                        Time of Birth <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="time"
                        value={person.tob}
                        onChange={(e) => onChange({ ...person, tob: e.target.value })}
                        required
                        className={`w-full px-4 py-3 rounded-xl border ${borderColor} bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-200 transition-all duration-200`}
                    />
                </div>

                {/* Place of Birth */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                        Place of Birth <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter city name"
                        value={person.place}
                        onChange={(e) => onChange({ ...person, place: e.target.value })}
                        required
                        className={`w-full px-4 py-3 rounded-xl border ${borderColor} bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200`}
                    />
                </div>
            </div>
        </div>
    );
}
