'use client';

import { useState } from 'react';
import Link from 'next/link';
import BirthDetailsForm from '@/components/BirthDetailsForm';
import ScoreCircle from '@/components/ScoreCircle';
import KootaCard from '@/components/KootaCard';
import CompatibilityMetric from '@/components/CompatibilityMetric';

const initialPerson = { name: '', dob: '', tob: '', place: '' };

export default function Home() {
  const [groom, setGroom] = useState(initialPerson);
  const [bride, setBride] = useState(initialPerson);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!groom.dob || !groom.tob || !bride.dob || !bride.tob) {
      setError('Please fill in date and time of birth for both groom and bride.');
      return;
    }

    if (!groom.place || !bride.place) {
      setError('Please fill in place of birth for both groom and bride.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bride, groom }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

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
    setGroom(initialPerson);
    setBride(initialPerson);
    setError('');
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="py-8 text-center">
        <div className="animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-extrabold gradient-text mb-3">
            Modern Kundli Milan
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto px-4">
            AI-powered Ashta Koota compatibility analysis for a harmonious match
          </p>
        </div>
      </header>

      {!showResult ? (
        /* ============ INPUT PAGE ============ */
        <div className="max-w-4xl mx-auto px-4 pb-16">
          <form onSubmit={handleSubmit}>
            {/* Two-column form */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="animate-fade-in-up-delay-1">
                <BirthDetailsForm
                  title="Groom Details"
                  icon="🤵"
                  person={groom}
                  onChange={setGroom}
                  accentColor="orange"
                />
              </div>
              <div className="animate-fade-in-up-delay-2">
                <BirthDetailsForm
                  title="Bride Details"
                  icon="👰"
                  person={bride}
                  onChange={setBride}
                  accentColor="pink"
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm text-center">
                ⚠️ {error}
              </div>
            )}

            {/* Submit button */}
            <div className="text-center animate-fade-in-up-delay-3">
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-4 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center gap-3">
                    <svg className="loading-spinner w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round" />
                    </svg>
                    Analyzing Compatibility...
                  </span>
                ) : (
                  '✨ Check Compatibility'
                )}
              </button>
            </div>
          </form>

          {/* Info section */}
          <div className="mt-12 glass-card rounded-2xl p-6 text-center">
            <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-3">How It Works</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="p-3">
                <div className="text-2xl mb-2">📝</div>
                <p>Enter birth details of both bride and groom</p>
              </div>
              <div className="p-3">
                <div className="text-2xl mb-2">🔮</div>
                <p>Ashta Koota system calculates 8 compatibility factors</p>
              </div>
              <div className="p-3">
                <div className="text-2xl mb-2">📊</div>
                <p>Get instant score with AI-powered analysis</p>
              </div>
            </div>
          </div>

          {/* Vedic Insights CTA */}
          <div className="mt-6 glass-card rounded-2xl p-6 text-center">
            <div className="text-3xl mb-3">🔮</div>
            <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-2">Explore Your Vedic Insights</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Get your {new Date().getFullYear()} career, finance, relationship & health reading based on Vedic astrology</p>
            <Link
              href="/predictions"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              🔮 View My Kundli Insights
            </Link>
          </div>
        </div>
      ) : (
        /* ============ RESULT PAGE ============ */
        <div className="max-w-4xl mx-auto px-4 pb-16">
          {result && (
            <>
              {/* Score Section */}
              <div className="glass-card rounded-2xl p-8 mb-6 text-center animate-fade-in-up">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Compatibility Result</h2>

                {/* Person details */}
                <div className="flex items-center justify-center gap-4 mb-8 text-sm text-gray-600 dark:text-gray-300">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🤵</div>
                    <p className="font-semibold">{result.groom.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{result.groom.rashi} • {result.groom.nakshatra}</p>
                  </div>
                  <div className="text-3xl text-pink-400">❤️</div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">👰</div>
                    <p className="font-semibold">{result.bride.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{result.bride.rashi} • {result.bride.nakshatra}</p>
                  </div>
                </div>

                <ScoreCircle
                  score={result.score.total}
                  maxScore={result.score.max}
                  status={result.score.status}
                  statusEmoji={result.score.statusEmoji}
                />
              </div>

              {/* Ashta Koota Breakdown */}
              <div className="mb-6 animate-fade-in-up-delay-1">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 px-1">
                  📋 Ashta Koota Breakdown
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {result.kootas.map((koota, i) => (
                    <KootaCard key={koota.label} koota={koota} index={i} />
                  ))}
                </div>
              </div>

              {/* Compatibility Metrics */}
              <div className="mb-6 animate-fade-in-up-delay-2">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 px-1">
                  📊 Compatibility Analysis
                </h3>
                <div className="space-y-3">
                  <CompatibilityMetric label="Emotional Compatibility" value={result.analysis.emotional} />
                  <CompatibilityMetric label="Communication" value={result.analysis.communication} />
                  <CompatibilityMetric label="Financial Compatibility" value={result.analysis.financial} />
                  <CompatibilityMetric label="Long-term Stability" value={result.analysis.stability} />
                  <CompatibilityMetric label="Health Compatibility" value={result.analysis.health} />
                </div>
              </div>

              {/* Strengths & Concerns */}
              <div className="grid md:grid-cols-2 gap-6 mb-6 animate-fade-in-up-delay-3">
                {/* Strengths */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="font-bold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                    <span className="text-lg">💪</span> Strengths
                  </h3>
                  <ul className="space-y-2">
                    {result.analysis.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <span className="text-green-400 mt-0.5">✓</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Concerns */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="font-bold text-orange-700 dark:text-orange-400 mb-3 flex items-center gap-2">
                    <span className="text-lg">⚡</span> Areas of Attention
                  </h3>
                  <ul className="space-y-2">
                    {result.analysis.concerns.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <span className="text-orange-400 mt-0.5">!</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* AI Summary */}
              <div className="glass-card rounded-2xl p-6 mb-8">
                <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <span className="text-lg">🤖</span> AI Summary
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                  {result.analysis.summary}
                </p>
              </div>

              {/* Action buttons */}
              <div className="text-center space-x-4">
                <button
                  onClick={handleReset}
                  className="px-8 py-3 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  🔄 Check Another Match
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
