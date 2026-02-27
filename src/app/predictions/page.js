'use client';

import { useState } from 'react';
import PredictionCard from '@/components/PredictionCard';
import CareerSuitCard from '@/components/CareerSuitCard';

const initialPerson = { name: '', dob: '', tob: '', place: '' };

export default function PredictionsPage() {
    const [person, setPerson] = useState(initialPerson);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showResult, setShowResult] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!person.dob || !person.tob) {
            setError('Please fill in your date and time of birth.');
            return;
        }
        if (!person.place) {
            setError('Please fill in your place of birth.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/predictions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(person),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Something went wrong');
            setResult(data.data);
            setShowResult(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setShowResult(false);
        setResult(null);
        setPerson(initialPerson);
        setError('');
    };

    return (
        <main className="min-h-screen">
            {/* Header */}
            <header className="py-8 text-center">
                <div className="animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-extrabold gradient-text mb-3">
                        My {new Date().getFullYear()} Kundli Insights
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto px-4">
                        Career, finance, relationships & health — your personalized Vedic reading
                    </p>
                </div>
            </header>

            {!showResult ? (
                /* ============ INPUT FORM ============ */
                <div className="max-w-lg mx-auto px-4 pb-16">
                    <form onSubmit={handleSubmit}>
                        <div className="glass-card rounded-2xl p-6 shadow-lg animate-fade-in-up-delay-1">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-2xl">
                                    🔮
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Your Birth Details</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Enter details to get your Vedic reading</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                                        Name <span className="text-gray-400 dark:text-gray-500">(optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        value={person.name}
                                        onChange={(e) => setPerson({ ...person, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-purple-200 dark:border-purple-800 focus:border-purple-400 dark:focus:border-purple-500 bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                                        Date of Birth <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={person.dob}
                                        onChange={(e) => setPerson({ ...person, dob: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-purple-200 dark:border-purple-800 focus:border-purple-400 dark:focus:border-purple-500 bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-200 transition-all duration-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                                        Time of Birth <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="time"
                                        value={person.tob}
                                        onChange={(e) => setPerson({ ...person, tob: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-purple-200 dark:border-purple-800 focus:border-purple-400 dark:focus:border-purple-500 bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-200 transition-all duration-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                                        Place of Birth <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter city name"
                                        value={person.place}
                                        onChange={(e) => setPerson({ ...person, place: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-purple-200 dark:border-purple-800 focus:border-purple-400 dark:focus:border-purple-500 bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm text-center">
                                ⚠️ {error}
                            </div>
                        )}

                        {/* Submit */}
                        <div className="text-center mt-6 animate-fade-in-up-delay-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-10 py-4 bg-gradient-to-r from-purple-500 to-violet-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-3">
                                        <svg className="loading-spinner w-5 h-5" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round" />
                                        </svg>
                                        Generating Your Reading...
                                    </span>
                                ) : (
                                    '🔮 Get My Kundli Insights'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Info */}
                    <div className="mt-12 glass-card rounded-2xl p-6 text-center animate-fade-in-up-delay-3">
                        <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-3">What You&apos;ll Get</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="p-3">
                                <div className="text-2xl mb-2">📈</div>
                                <p>Career outlook & growth</p>
                            </div>
                            <div className="p-3">
                                <div className="text-2xl mb-2">💰</div>
                                <p>Financial forecast</p>
                            </div>
                            <div className="p-3">
                                <div className="text-2xl mb-2">❤️</div>
                                <p>Relationship insights</p>
                            </div>
                            <div className="p-3">
                                <div className="text-2xl mb-2">🧘</div>
                                <p>Health & wellness</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* ============ RESULTS ============ */
                <div className="max-w-4xl mx-auto px-4 pb-16">
                    {result && (
                        <>
                            {/* Profile Header */}
                            <div className="glass-card rounded-2xl p-6 mb-6 text-center animate-fade-in-up">
                                <div className="text-4xl mb-3">🪐</div>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                                    {result.name ? `${result.name}'s` : 'Your'} {result.currentYear} Forecast
                                </h2>
                                <div className="flex items-center justify-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="px-3 py-1 bg-purple-50 dark:bg-purple-900/30 rounded-full">🌙 {result.rashi}</span>
                                    <span className="px-3 py-1 bg-orange-50 dark:bg-orange-900/30 rounded-full">⭐ {result.nakshatra}</span>
                                    <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-full">🪐 {result.rashiLord}</span>
                                    <span className="px-3 py-1 bg-green-50 dark:bg-green-900/30 rounded-full">🔥 {result.element}</span>
                                </div>

                                {/* Year Overview */}
                                <p className="mt-5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
                                    {result.yearOverview}
                                </p>

                                {/* Lucky Elements */}
                                <div className="flex items-center justify-center gap-6 mt-5 text-xs text-gray-500 dark:text-gray-400">
                                    <span>🎨 Colors: <strong>{result.lucky.colors.join(', ')}</strong></span>
                                    <span>🔢 Numbers: <strong>{result.lucky.numbers.join(', ')}</strong></span>
                                    <span>📅 Day: <strong>{result.lucky.day}</strong></span>
                                </div>
                            </div>

                            {/* Prediction Cards — Full Width for Detail */}
                            <div className="space-y-6 mb-6">
                                {/* Career */}
                                <div className="animate-fade-in-up-delay-1">
                                    <PredictionCard
                                        title="Career Outlook"
                                        icon="💼"
                                        accentColor="orange"
                                        detailedSummary={result.career.detailedSummary}
                                        items={[
                                            { icon: result.career.growth.icon, label: 'Career Growth', value: result.career.growth.value },
                                            { icon: result.career.promotion.icon, label: 'Promotion & Recognition', value: result.career.promotion.value },
                                            { icon: result.career.businessStability.icon, label: 'Business Stability', value: result.career.businessStability.value },
                                            { icon: result.career.skillAdvice.icon, label: 'Skill Development Advice', value: result.career.skillAdvice.value },
                                            ...(result.career.bestMonths ? [{ icon: result.career.bestMonths.icon, label: 'Best Career Months', value: result.career.bestMonths.value }] : []),
                                            ...(result.career.networking ? [{ icon: result.career.networking.icon, label: 'Networking & Connections', value: result.career.networking.value }] : []),
                                            ...(result.career.workLifeBalance ? [{ icon: result.career.workLifeBalance.icon, label: 'Work-Life Balance', value: result.career.workLifeBalance.value }] : []),
                                            ...(result.career.quarterlyOutlook ? [{ icon: result.career.quarterlyOutlook.icon, label: 'Quarterly Career Outlook', value: result.career.quarterlyOutlook.value }] : []),
                                        ]}
                                    />
                                </div>

                                {/* Financial */}
                                <div className="animate-fade-in-up-delay-2">
                                    <PredictionCard
                                        title="Financial Outlook"
                                        icon="💰"
                                        accentColor="green"
                                        detailedSummary={result.financial.detailedSummary}
                                        items={[
                                            { icon: result.financial.incomeStability.icon, label: 'Income Stability', value: result.financial.incomeStability.value },
                                            { icon: result.financial.unexpectedExpenses.icon, label: 'Unexpected Expenses', value: result.financial.unexpectedExpenses.value, subtext: result.financial.unexpectedExpenses.timing },
                                            { icon: result.financial.investment.icon, label: 'Investment Strategy', value: result.financial.investment.value },
                                            { icon: result.financial.savingsTrend.icon, label: 'Savings Trend', value: result.financial.savingsTrend.value },
                                            { icon: result.financial.luckyMonths.icon, label: 'Favorable Financial Months', value: result.financial.luckyMonths.value },
                                            ...(result.financial.propertyAdvice ? [{ icon: result.financial.propertyAdvice.icon, label: 'Property & Real Estate', value: result.financial.propertyAdvice.value }] : []),
                                            ...(result.financial.debtManagement ? [{ icon: result.financial.debtManagement.icon, label: 'Debt & Loan Management', value: result.financial.debtManagement.value }] : []),
                                            ...(result.financial.taxPlanning ? [{ icon: result.financial.taxPlanning.icon, label: 'Tax Planning', value: result.financial.taxPlanning.value }] : []),
                                        ]}
                                    />
                                </div>

                                {/* Relationship */}
                                <div className="animate-fade-in-up-delay-3">
                                    <PredictionCard
                                        title="Relationship & Marriage"
                                        icon="❤️"
                                        accentColor="pink"
                                        detailedSummary={result.relationship.detailedSummary}
                                        items={[
                                            { icon: result.relationship.harmony.icon, label: 'Relationship Harmony', value: result.relationship.harmony.value },
                                            { icon: result.relationship.marriageProspects.icon, label: 'Marriage Prospects', value: result.relationship.marriageProspects.value },
                                            { icon: result.relationship.emotionalBalance.icon, label: 'Emotional Balance', value: result.relationship.emotionalBalance.value },
                                            { icon: result.relationship.familyRelations.icon, label: 'Family Relations', value: result.relationship.familyRelations.value },
                                            ...(result.relationship.socialCircle ? [{ icon: result.relationship.socialCircle.icon, label: 'Social Circle & Friendships', value: result.relationship.socialCircle.value }] : []),
                                            ...(result.relationship.communication ? [{ icon: result.relationship.communication.icon, label: 'Communication & Expression', value: result.relationship.communication.value }] : []),
                                            ...(result.relationship.romanticTiming ? [{ icon: result.relationship.romanticTiming.icon, label: 'Romantic Timing', value: result.relationship.romanticTiming.value }] : []),
                                        ]}
                                    />
                                </div>

                                {/* Health */}
                                <div className="animate-fade-in-up-delay-3">
                                    <PredictionCard
                                        title="Health & Wellness"
                                        icon="🧘"
                                        accentColor="blue"
                                        detailedSummary={result.health.detailedSummary}
                                        items={[
                                            { icon: result.health.energyLevels.icon, label: 'Energy Levels', value: result.health.energyLevels.value },
                                            { icon: result.health.stressLevels.icon, label: 'Stress Management', value: result.health.stressLevels.value },
                                            { icon: result.health.immunity.icon, label: 'Immunity & Resistance', value: result.health.immunity.value },
                                            { icon: result.health.cautionPeriod.icon, label: 'Caution Period', value: result.health.cautionPeriod.value },
                                            ...(result.health.mentalWellness ? [{ icon: result.health.mentalWellness.icon, label: 'Mental Wellness', value: result.health.mentalWellness.value }] : []),
                                            ...(result.health.fitness ? [{ icon: result.health.fitness.icon, label: 'Fitness & Exercise', value: result.health.fitness.value }] : []),
                                            ...(result.health.diet ? [{ icon: result.health.diet.icon, label: 'Diet & Nutrition', value: result.health.diet.value }] : []),
                                            ...(result.health.sleep ? [{ icon: result.health.sleep.icon, label: 'Sleep & Recovery', value: result.health.sleep.value }] : []),
                                        ]}
                                    />
                                </div>
                            </div>

                            {/* Career Suitability */}
                            <div className="mb-8 animate-fade-in-up-delay-3">
                                <CareerSuitCard
                                    careerSuits={result.careerSuits}
                                    rashi={result.rashi}
                                />
                            </div>

                            {/* Action buttons */}
                            <div className="text-center">
                                <button
                                    onClick={handleReset}
                                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-violet-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                                >
                                    🔄 Get Another Reading
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Footer */}
            <footer className="py-6 text-center text-sm text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800">
                <p>Made with ❤️ for Hackathon 2026 | AstroMilan</p>
            </footer>
        </main>
    );
}
