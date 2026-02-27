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
              {/* ==================== MARRIAGE RISK ANALYSIS (TOP HERO) ==================== */}
              {result.marriageRisk && (
                <div className="glass-card rounded-2xl overflow-hidden mb-8 animate-fade-in-up">
                  <div className={`h-1.5 bg-gradient-to-r ${result.marriageRisk.riskPercentage <= 30 ? 'from-green-400 to-emerald-400' : result.marriageRisk.riskPercentage <= 50 ? 'from-yellow-400 to-amber-400' : result.marriageRisk.riskPercentage <= 65 ? 'from-orange-400 to-red-400' : 'from-red-500 to-red-700'}`} />
                  <div className="p-6">
                    {/* Person names for context */}
                    <div className="flex items-center justify-center gap-3 mb-4 text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-semibold">🤵 {result.groom.name}</span>
                      <span className="text-pink-400">❤️</span>
                      <span className="font-semibold">👰 {result.bride.name}</span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 mb-1 flex items-center justify-center gap-2">
                      <span className="text-3xl">⚠️</span> Marriage Risk Analysis
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">Comprehensive risk assessment based on Ashta Koota, Dosha analysis, and planetary positions</p>

                    {/* Risk Gauge — Large & Prominent */}
                    <div className="flex flex-col items-center mb-8">
                      <div className="relative w-56 h-56">
                        <svg className="w-56 h-56 transform -rotate-90" viewBox="0 0 120 120">
                          <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-200 dark:text-gray-700" />
                          <circle cx="60" cy="60" r="52" fill="none" strokeWidth="8"
                            strokeDasharray={`${result.marriageRisk.riskPercentage * 3.267} 326.7`}
                            strokeLinecap="round"
                            className={`${result.marriageRisk.riskPercentage <= 30 ? 'text-green-500' : result.marriageRisk.riskPercentage <= 50 ? 'text-yellow-500' : result.marriageRisk.riskPercentage <= 65 ? 'text-orange-500' : 'text-red-500'} transition-all duration-1000`}
                            stroke="currentColor"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className={`text-5xl font-black ${result.marriageRisk.riskPercentage <= 30 ? 'text-green-600 dark:text-green-400' : result.marriageRisk.riskPercentage <= 50 ? 'text-yellow-600 dark:text-yellow-400' : result.marriageRisk.riskPercentage <= 65 ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'}`}>
                            {result.marriageRisk.riskPercentage}%
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold mt-1">Risk Level</span>
                        </div>
                      </div>
                      <span className={`mt-3 text-base font-bold px-6 py-1.5 rounded-full ${result.marriageRisk.riskColor === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : result.marriageRisk.riskColor === 'yellow' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : result.marriageRisk.riskColor === 'orange' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {result.marriageRisk.riskLevel}
                      </span>
                    </div>

                    {/* Risk Factors */}
                    <div className="mb-5">
                      <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 text-sm">🔍 Risk Factors Identified:</h4>
                      <div className="space-y-3">
                        {result.marriageRisk.riskFactors.map((rf, i) => (
                          <div key={i} className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-2 mb-1">
                              <span>{rf.icon}</span>
                              <span className="font-semibold text-sm text-gray-800 dark:text-gray-100">{rf.factor}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ml-auto font-medium ${rf.severity === 'High' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : rf.severity === 'Medium-High' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : rf.severity === 'Medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}>{rf.severity}</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{rf.detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ===== WHAT COULD GO WRONG — Consequences ===== */}
                    {result.marriageRisk.consequences && result.marriageRisk.consequences.length > 0 && (
                      <div className="mb-5">
                        <h4 className="font-bold text-red-600 dark:text-red-400 mb-3 text-base flex items-center gap-2">
                          <span className="text-xl">🚨</span> What Could Go Wrong
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                          Based on the detected doshas and incompatibilities, here are detailed potential challenges this marriage may face if remedies are not followed:
                        </p>
                        <div className="space-y-4">
                          {result.marriageRisk.consequences.map((c, ci) => (
                            <div key={ci} className={`rounded-xl overflow-hidden border ${c.severity === 'Critical' ? 'border-red-200 dark:border-red-800/50' : 'border-orange-200 dark:border-orange-800/50'
                              }`}>
                              <div className={`px-4 py-2.5 flex items-center gap-2 ${c.severity === 'Critical'
                                ? 'bg-red-50 dark:bg-red-900/15'
                                : 'bg-orange-50 dark:bg-orange-900/15'
                                }`}>
                                <span className="text-lg">{c.icon}</span>
                                <span className="font-bold text-sm text-gray-800 dark:text-gray-100">{c.category}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ml-auto font-bold ${c.severity === 'Critical'
                                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                  : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                  }`}>{c.severity}</span>
                              </div>
                              <div className="px-4 py-3 bg-white/30 dark:bg-gray-800/30">
                                <ul className="space-y-2.5">
                                  {c.issues.map((issue, ii) => (
                                    <li key={ii} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                      <span className={`mt-0.5 flex-shrink-0 text-xs ${c.severity === 'Critical' ? 'text-red-400' : 'text-orange-400'}`}>▸</span>
                                      {issue}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Remedies */}
                    {result.marriageRisk.remedies.length > 0 && (
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-xl p-4 border border-purple-100 dark:border-purple-800/30">
                        <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2 text-sm flex items-center gap-1.5">
                          <span>🙏</span> Vedic Remedies & Suggestions
                        </h4>
                        <ul className="space-y-2">
                          {result.marriageRisk.remedies.map((r, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                              <span className="text-purple-400 mt-0.5 flex-shrink-0">✦</span>
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Score Section */}
              <div className="glass-card rounded-2xl p-8 mb-6 text-center animate-fade-in-up-delay-1">
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



              {/* ==================== IDEAL PARTNER SUGGESTION ==================== */}
              {result.idealPartner && (
                <div className="glass-card rounded-2xl overflow-hidden mb-8 animate-fade-in-up-delay-3">
                  <div className="h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
                      <span className="text-2xl">💑</span> Ideal Partner Kundli Match
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                      Based on Rashi compatibility, these are the most harmonious matches — including the <strong>starting letters of names</strong> (Aksharas) of ideal partners.
                    </p>

                    {/* Show for both bride and groom */}
                    {['bride', 'groom'].map((person) => {
                      const data = result.idealPartner[person];
                      if (!data) return null;
                      const label = person === 'bride' ? result.bride?.name || 'Bride' : result.groom?.name || 'Groom';
                      return (
                        <div key={person} className="mb-6 last:mb-0">
                          <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                              {label.charAt(0)}
                            </span>
                            Best Matches for {label} ({data.personRashi} — {data.personElement})
                          </h4>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {data.suggestions.map((s, i) => (
                              <div key={i} className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'][['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].indexOf(s.rashi)]}</span>
                                    <span className="font-bold text-sm text-gray-800 dark:text-gray-100">{s.rashi}</span>
                                  </div>
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.compatibility === 'Excellent' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                    {s.compatibility}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{s.reason}</p>
                                <div className="text-xs text-gray-600 dark:text-gray-300 mb-1">
                                  <span className="font-semibold">Lord:</span> {s.lord} | <span className="font-semibold">Element:</span> {s.element}
                                </div>

                                {/* Name Starting Letters */}
                                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                                  <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1.5">
                                    ✨ Partner's Name Starting Letters:
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {s.allLetters.slice(0, 12).map((letter, li) => (
                                      <span key={li} className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 text-purple-700 dark:text-purple-300 rounded-md border border-purple-200 dark:border-purple-700/40">
                                        {letter}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                {/* Nakshatras */}
                                <div className="mt-2">
                                  <p className="text-xs text-gray-400 dark:text-gray-500">
                                    Nakshatras: {s.nakshatras.map(n => n.name).join(', ')}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

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
