// Ashta Koota Gun Milan calculation
// This implements a simplified but realistic Vedic astrology matching system

// Nakshatras (27 lunar mansions)
const NAKSHATRAS = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
    'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha',
    'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

// Rashis (12 zodiac signs)
const RASHIS = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// Rashi lords
const RASHI_LORDS = [
    'Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury',
    'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'
];

// Nakshatra to Rashi mapping (each rashi has 2.25 nakshatras)
function getNakshatraRashi(nakshatraIndex) {
    return Math.floor((nakshatraIndex * 4) / 9);
}

// Gana (temperament) - Deva, Manushya, Rakshasa
const NAKSHATRA_GANA = [
    0, 1, 2, 0, 0, 1, 0, 0, 2, 2, 1, 0,
    0, 2, 0, 2, 0, 2, 2, 1, 0, 0, 2, 2,
    1, 0, 0
]; // 0=Deva, 1=Manushya, 2=Rakshasa

// Nadi
const NAKSHATRA_NADI = [
    0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0,
    0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0,
    0, 1, 2
]; // 0=Adi, 1=Madhya, 2=Antya

// Yoni (animal compatibility)
const NAKSHATRA_YONI = [
    0, 1, 2, 3, 3, 4, 5, 6, 5, 7, 7, 8,
    8, 9, 8, 9, 10, 10, 4, 11, 11, 11, 12, 0,
    12, 8, 1
];

// Vashya groups
const VASHYA_GROUPS = {
    0: 'Chatushpad', 1: 'Chatushpad', 2: 'Nara', 3: 'Jalachara',
    4: 'Chatushpad', 5: 'Nara', 6: 'Nara', 7: 'Keeta',
    8: 'Chatushpad', 9: 'Chatushpad', 10: 'Nara', 11: 'Jalachara'
};

// Derive nakshatra index from DOB (simplified - using day of year + birth time)
function deriveNakshatra(dob, timeOfBirth) {
    const date = new Date(dob);
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));

    // Parse time
    let timeMinutes = 0;
    if (timeOfBirth) {
        const [hours, minutes] = timeOfBirth.split(':').map(Number);
        timeMinutes = hours * 60 + minutes;
    }

    // Combine day and time for nakshatra calculation
    const seed = (dayOfYear * 1440 + timeMinutes) % 27;
    return seed;
}

// 1. Varna Koota (1 point) - Spiritual compatibility
function calculateVarna(brideNak, groomNak) {
    const brideVarna = Math.floor(getNakshatraRashi(brideNak) / 3);
    const groomVarna = Math.floor(getNakshatraRashi(groomNak) / 3);

    if (groomVarna >= brideVarna) return 1;
    return 0;
}

// 2. Vashya Koota (2 points) - Mutual attraction
function calculateVashya(brideNak, groomNak) {
    const brideRashi = getNakshatraRashi(brideNak);
    const groomRashi = getNakshatraRashi(groomNak);
    const brideVashya = VASHYA_GROUPS[brideRashi];
    const groomVashya = VASHYA_GROUPS[groomRashi];

    if (brideVashya === groomVashya) return 2;
    if (
        (brideVashya === 'Nara' && groomVashya === 'Chatushpad') ||
        (groomVashya === 'Nara' && brideVashya === 'Chatushpad')
    ) return 1;
    return 0.5;
}

// 3. Tara Koota (3 points) - Birth star compatibility
function calculateTara(brideNak, groomNak) {
    const tara = ((groomNak - brideNak + 27) % 27) % 9;
    const auspicious = [0, 1, 2, 3, 6, 8]; // Auspicious tara positions
    if (auspicious.includes(tara)) return 3;
    if (tara === 4 || tara === 7) return 1.5;
    return 0;
}

// 4. Yoni Koota (4 points) - Physical/sexual compatibility
function calculateYoni(brideNak, groomNak) {
    const brideYoni = NAKSHATRA_YONI[brideNak];
    const groomYoni = NAKSHATRA_YONI[groomNak];

    if (brideYoni === groomYoni) return 4;
    const diff = Math.abs(brideYoni - groomYoni);
    if (diff <= 2) return 3;
    if (diff <= 4) return 2;
    if (diff <= 6) return 1;
    return 0;
}

// 5. Graha Maitri (5 points) - Mental compatibility
function calculateGrahaMaitri(brideNak, groomNak) {
    const brideRashi = getNakshatraRashi(brideNak);
    const groomRashi = getNakshatraRashi(groomNak);
    const brideLord = RASHI_LORDS[brideRashi];
    const groomLord = RASHI_LORDS[groomRashi];

    if (brideLord === groomLord) return 5;

    // Friendly planet combinations
    const friends = {
        'Sun': ['Moon', 'Mars', 'Jupiter'],
        'Moon': ['Sun', 'Mercury'],
        'Mars': ['Sun', 'Moon', 'Jupiter'],
        'Mercury': ['Sun', 'Venus'],
        'Jupiter': ['Sun', 'Moon', 'Mars'],
        'Venus': ['Mercury', 'Saturn'],
        'Saturn': ['Mercury', 'Venus']
    };

    const groomFriendly = friends[groomLord]?.includes(brideLord);
    const brideFriendly = friends[brideLord]?.includes(groomLord);

    if (groomFriendly && brideFriendly) return 5;
    if (groomFriendly || brideFriendly) return 3;
    return 0.5;
}

// 6. Gana Koota (6 points) - Temperament
function calculateGana(brideNak, groomNak) {
    const brideGana = NAKSHATRA_GANA[brideNak];
    const groomGana = NAKSHATRA_GANA[groomNak];

    if (brideGana === groomGana) return 6;
    if (
        (brideGana === 0 && groomGana === 1) ||
        (brideGana === 1 && groomGana === 0)
    ) return 5;
    if (
        (brideGana === 0 && groomGana === 2) ||
        (brideGana === 2 && groomGana === 0)
    ) return 1;
    if (
        (brideGana === 1 && groomGana === 2) ||
        (brideGana === 2 && groomGana === 1)
    ) return 0;
    return 0;
}

// 7. Bhakoot Koota (7 points) - Love and affection
function calculateBhakoot(brideNak, groomNak) {
    const brideRashi = getNakshatraRashi(brideNak);
    const groomRashi = getNakshatraRashi(groomNak);
    const diff = ((groomRashi - brideRashi + 12) % 12);

    // Inauspicious combinations: 2/12, 5/9, 6/8
    const inauspicious = [1, 4, 5, 6, 7, 10, 11];
    if (inauspicious.includes(diff)) return 0;
    return 7;
}

// 8. Nadi Koota (8 points) - Health and genes
function calculateNadi(brideNak, groomNak) {
    const brideNadi = NAKSHATRA_NADI[brideNak];
    const groomNadi = NAKSHATRA_NADI[groomNak];

    if (brideNadi !== groomNadi) return 8;
    return 0;
}

// Main calculation function
export function calculateGunaMilan(brideDob, brideTob, groomDob, groomTob) {
    const brideNak = deriveNakshatra(brideDob, brideTob);
    const groomNak = deriveNakshatra(groomDob, groomTob);

    const brideRashi = getNakshatraRashi(brideNak);
    const groomRashi = getNakshatraRashi(groomNak);

    const scores = {
        varna: { score: calculateVarna(brideNak, groomNak), max: 1, label: 'Varna', description: 'Spiritual Compatibility' },
        vashya: { score: calculateVashya(brideNak, groomNak), max: 2, label: 'Vashya', description: 'Mutual Attraction' },
        tara: { score: calculateTara(brideNak, groomNak), max: 3, label: 'Tara', description: 'Birth Star Compatibility' },
        yoni: { score: calculateYoni(brideNak, groomNak), max: 4, label: 'Yoni', description: 'Physical Compatibility' },
        grahaMaitri: { score: calculateGrahaMaitri(brideNak, groomNak), max: 5, label: 'Graha Maitri', description: 'Mental Compatibility' },
        gana: { score: calculateGana(brideNak, groomNak), max: 6, label: 'Gana', description: 'Temperament Match' },
        bhakoot: { score: calculateBhakoot(brideNak, groomNak), max: 7, label: 'Bhakoot', description: 'Love & Affection' },
        nadi: { score: calculateNadi(brideNak, groomNak), max: 8, label: 'Nadi', description: 'Health & Genes' },
    };

    const totalScore = Object.values(scores).reduce((sum, s) => sum + s.score, 0);

    let status, statusColor, statusEmoji;
    if (totalScore >= 25) {
        status = 'Excellent Match';
        statusColor = 'green';
        statusEmoji = '💚';
    } else if (totalScore >= 18) {
        status = 'Good Match';
        statusColor = 'yellow';
        statusEmoji = '💛';
    } else {
        status = 'Needs Caution';
        statusColor = 'red';
        statusEmoji = '❤️‍🩹';
    }

    return {
        totalScore,
        maxScore: 36,
        scores,
        status,
        statusColor,
        statusEmoji,
        brideNakshatra: NAKSHATRAS[brideNak],
        groomNakshatra: NAKSHATRAS[groomNak],
        brideRashi: RASHIS[brideRashi],
        groomRashi: RASHIS[groomRashi],
    };
}

// Generate AI-like compatibility analysis
export function generateCompatibilityAnalysis(result) {
    const { totalScore, scores, status } = result;
    const percentage = Math.round((totalScore / 36) * 100);

    // Emotional compatibility based on Gana + Yoni
    const emotionalScore = ((scores.gana.score / 6) + (scores.yoni.score / 4)) / 2;
    const emotional = emotionalScore >= 0.7 ? 'Strong' : emotionalScore >= 0.4 ? 'Moderate' : 'Needs Attention';

    // Communication based on Graha Maitri + Varna
    const commScore = ((scores.grahaMaitri.score / 5) + (scores.varna.score / 1)) / 2;
    const communication = commScore >= 0.7 ? 'Excellent' : commScore >= 0.4 ? 'Good' : 'Average';

    // Financial compatibility based on Bhakoot
    const financial = scores.bhakoot.score >= 5 ? 'Strong' : scores.bhakoot.score >= 3 ? 'Moderate' : 'Needs Planning';

    // Long-term stability based on Nadi + Tara
    const stabilityScore = ((scores.nadi.score / 8) + (scores.tara.score / 3)) / 2;
    const stability = stabilityScore >= 0.7 ? 'Very Stable' : stabilityScore >= 0.4 ? 'Stable' : 'Requires Effort';

    // Health compatibility based on Nadi
    const health = scores.nadi.score >= 6 ? 'Excellent' : scores.nadi.score >= 4 ? 'Good' : 'Consult Expert';

    // Strengths
    const strengths = [];
    if (scores.nadi.score >= 6) strengths.push('Strong genetic compatibility ensures healthy progeny');
    if (scores.gana.score >= 4) strengths.push('Well-matched temperaments lead to harmonious relations');
    if (scores.bhakoot.score >= 5) strengths.push('Strong mutual love and financial prosperity indicated');
    if (scores.grahaMaitri.score >= 3) strengths.push('Good mental wavelength and intellectual compatibility');
    if (scores.yoni.score >= 3) strengths.push('Strong physical and intimate compatibility');
    if (scores.tara.score >= 2) strengths.push('Favorable destiny alignment between birth stars');
    if (scores.vashya.score >= 1.5) strengths.push('Good mutual attraction and bonding potential');

    if (strengths.length === 0) strengths.push('Unique combination that can grow stronger with mutual effort');

    // Concerns
    const concerns = [];
    if (scores.nadi.score === 0) concerns.push('Nadi Dosha present - consider remedial measures for health');
    if (scores.bhakoot.score === 0) concerns.push('Bhakoot Dosha detected - may need attention in financial matters');
    if (scores.gana.score <= 1) concerns.push('Different temperaments may require patience and understanding');
    if (scores.grahaMaitri.score <= 1) concerns.push('Mental compatibility may need conscious effort to nurture');
    if (scores.yoni.score <= 1) concerns.push('Physical compatibility needs attention and communication');

    if (concerns.length === 0) concerns.push('No major concerns identified - a well-matched pair overall');

    // Summary paragraph
    let summary;
    if (percentage >= 70) {
        summary = `This is an excellent match with a compatibility score of ${totalScore}/36 (${percentage}%). The stars indicate a strong and harmonious union between the couple. With ${result.brideRashi} and ${result.groomRashi} moon signs, there is a natural affinity that supports long-term happiness. The Ashta Koota analysis reveals strong alignment across key areas of married life including emotional bonding, mutual respect, and shared life goals. This pairing has the cosmic support for a fulfilling and prosperous partnership.`;
    } else if (percentage >= 50) {
        summary = `With a compatibility score of ${totalScore}/36 (${percentage}%), this match shows good potential with some areas that would benefit from mutual understanding. The ${result.brideRashi} and ${result.groomRashi} combination creates an interesting dynamic. While the core compatibility is solid, there are opportunities to strengthen the bond through open communication and shared experiences. With conscious effort, this pairing can build a strong and lasting relationship.`;
    } else {
        summary = `The compatibility score of ${totalScore}/36 (${percentage}%) suggests this match requires careful consideration and effort from both partners. The ${result.brideRashi} and ${result.groomRashi} combination presents both challenges and opportunities for growth. While the Ashta Koota analysis highlights areas that need attention, many successful marriages thrive with dedication and mutual understanding. Consider consulting with a Vedic astrology expert for personalized remedial guidance.`;
    }

    return {
        emotional,
        communication,
        financial,
        stability,
        health,
        strengths,
        concerns,
        summary,
        percentage,
    };
}
