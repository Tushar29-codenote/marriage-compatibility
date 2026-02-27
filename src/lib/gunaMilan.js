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

// ==================== MARRIAGE RISK ANALYSIS ====================
export function generateMarriageRisk(result) {
    const { totalScore, scores } = result;
    const percentage = Math.round((totalScore / 36) * 100);

    // Base risk = inverse of compatibility percentage
    let riskScore = 100 - percentage;

    // Dosha-based risk factors
    const riskFactors = [];
    const remedies = [];

    // Nadi Dosha (most critical)
    if (scores.nadi.score === 0) {
        riskScore += 12;
        riskFactors.push({
            icon: '🔴',
            factor: 'Nadi Dosha Detected',
            severity: 'High',
            detail: 'Same Nadi for both partners indicates potential health complications for progeny and disagreements in daily life. This is considered the most significant dosha in Kundli matching and carries 8 out of 36 total points.',
        });
        remedies.push('Nadi Dosha Nivaran Puja is recommended. Donate gold, grains, and clothes on an auspicious day. Maha Mrityunjaya Jaap (recitation) is highly beneficial.');
        remedies.push('Visit Trimbakeshwar Temple (Nashik) or Mahakaleshwar Temple (Ujjain) for Nadi Dosha Shanti Puja.');
    }

    // Bhakoot Dosha
    if (scores.bhakoot.score === 0) {
        riskScore += 8;
        riskFactors.push({
            icon: '🟠',
            factor: 'Bhakoot Dosha Present',
            severity: 'Medium-High',
            detail: 'Inauspicious Rashi combination (2/12, 5/9, or 6/8 relationship). This can affect financial stability, mutual love, and may create disagreements related to money, career choices, and family planning.',
        });
        remedies.push('Bhakoot Dosha Shanti Puja with Rudrabhishek is recommended. Chanting Vishnu Sahasranama together strengthens the bond.');
        remedies.push('Both partners should observe fast on their respective Rashi lord\'s day for the first year of marriage.');
    }

    // Gana Dosha
    if (scores.gana.score <= 1) {
        riskScore += 6;
        riskFactors.push({
            icon: '🟡',
            factor: 'Gana Incompatibility',
            severity: 'Medium',
            detail: 'Mismatched temperaments (Deva-Rakshasa or Manushya-Rakshasa combination). This can lead to frequent arguments, differing viewpoints on lifestyle, social behavior, and clashes in decision-making approaches.',
        });
        remedies.push('Regular couple meditation and conscious communication practices will help bridge the temperament gap. Ganesh Puja on Wednesdays is beneficial.');
    }

    // Yoni Dosha
    if (scores.yoni.score <= 1) {
        riskScore += 4;
        riskFactors.push({
            icon: '🟡',
            factor: 'Low Yoni Compatibility',
            severity: 'Medium',
            detail: 'Physical and intimate compatibility needs attention. Different Yoni animals can create challenges in physical bonding, affection expression, and understanding each other\'s emotional-physical needs.',
        });
        remedies.push('Open communication about physical and emotional needs is essential. Consider relationship counseling to build understanding.');
    }

    // Graha Maitri issue
    if (scores.grahaMaitri.score <= 1) {
        riskScore += 3;
        riskFactors.push({
            icon: '🟡',
            factor: 'Low Mental Compatibility',
            severity: 'Medium',
            detail: 'The ruling planets of both Rashis are not naturally friendly. This can create differences in thinking patterns, intellectual interests, and decision-making styles. Conscious effort to understand each other\'s perspective is needed.',
        });
        remedies.push('Engage in shared intellectual activities — reading together, discussing ideas, learning something new as a couple.');
    }

    // Manglik consideration (simplified)
    const brideRashi = RASHIS.indexOf(result.brideRashi);
    const groomRashi = RASHIS.indexOf(result.groomRashi);
    const isMarsSign = (ri) => ri === 0 || ri === 7; // Aries or Scorpio = Mars-ruled
    if (isMarsSign(brideRashi) !== isMarsSign(groomRashi) && (isMarsSign(brideRashi) || isMarsSign(groomRashi))) {
        riskScore += 5;
        riskFactors.push({
            icon: '🔴',
            factor: 'Manglik Consideration',
            severity: 'Medium-High',
            detail: 'One partner has Mars-dominant Rashi (Aries/Scorpio) while the other does not. This Mangal Dosha can cause aggression, dominance issues, and conflicts in married life if not addressed. Both partners being Manglik cancels the dosha.',
        });
        remedies.push('Mangal Dosha Shanti Puja is highly recommended. Kumbh Vivah (symbolic marriage to a pot/tree) before actual marriage is a traditional remedy.');
        remedies.push('Visit Mangalnath Temple (Ujjain) for Mangal Dosha Nivaran. Wearing a coral (Moonga) gemstone after proper consultation can help.');
    }

    // Good factors reduce risk
    if (scores.nadi.score >= 6) riskScore -= 5;
    if (scores.bhakoot.score >= 5) riskScore -= 4;
    if (scores.gana.score >= 4) riskScore -= 3;
    if (totalScore >= 25) riskScore -= 8;

    // Clamp risk between 5 and 85
    riskScore = Math.max(5, Math.min(85, riskScore));

    // Add positive notes if low risk
    if (riskFactors.length === 0) {
        riskFactors.push({
            icon: '💚',
            factor: 'No Major Doshas Detected',
            severity: 'None',
            detail: 'No significant doshas found in this Kundli matching. The planetary alignment is favorable for a harmonious and prosperous married life. Minor challenges are part of every relationship and can be easily navigated with mutual respect and understanding.',
        });
        remedies.push('No specific remedies needed. Maintain mutual respect, regular communication, and shared spiritual practices for a blessed married life.');
    }

    // Risk level label
    let riskLevel, riskColor;
    if (riskScore <= 20) { riskLevel = 'Very Low Risk'; riskColor = 'green'; }
    else if (riskScore <= 35) { riskLevel = 'Low Risk'; riskColor = 'green'; }
    else if (riskScore <= 50) { riskLevel = 'Moderate Risk'; riskColor = 'yellow'; }
    else if (riskScore <= 65) { riskLevel = 'High Risk'; riskColor = 'orange'; }
    else { riskLevel = 'Very High Risk'; riskColor = 'red'; }

    // Generate detailed "What Could Go Wrong" warnings for moderate/high risk
    const consequences = [];
    if (riskScore > 35) {
        // Relationship consequences
        if (scores.gana.score <= 1) {
            consequences.push({
                category: 'Relationship & Communication',
                icon: '💔',
                severity: riskScore > 60 ? 'Critical' : 'Serious',
                issues: [
                    'Frequent arguments over daily decisions — from household matters to social commitments. The Deva-Rakshasa or contrasting Gana combination creates fundamentally different approaches to life that clash regularly.',
                    'One partner may feel dominated or unheard, leading to suppressed resentment that builds over time. This can manifest as passive-aggressive behavior, emotional withdrawal, or sudden explosive conflicts.',
                    'Different social temperaments may cause embarrassment or friction in public settings — one partner may be outgoing while the other is reserved, leading to misunderstandings about social boundaries.',
                    'Decision-making becomes a battleground rather than a partnership. Major life decisions (home purchase, children, career moves) may become sources of prolonged disagreement and stress.',
                ],
            });
        }
        if (scores.yoni.score <= 1) {
            consequences.push({
                category: 'Physical & Intimate Life',
                icon: '😞',
                severity: 'Serious',
                issues: [
                    'Physical intimacy may feel unsatisfying or disconnected for one or both partners. Different Yoni energies create mismatched expectations around affection, frequency, and emotional connection during intimate moments.',
                    'One partner may feel emotionally neglected while the other feels pressured — this imbalance can create a growing emotional distance that affects all aspects of the relationship.',
                    'Over time, physical disconnect may lead one or both partners to seek emotional validation outside the marriage, creating trust issues and potential infidelity concerns.',
                ],
            });
        }

        // Financial consequences
        if (scores.bhakoot.score === 0) {
            consequences.push({
                category: 'Financial & Material Life',
                icon: '💸',
                severity: riskScore > 60 ? 'Critical' : 'Serious',
                issues: [
                    'Financial disagreements are highly likely — different spending habits, saving priorities, and investment philosophies will create ongoing tension. One partner may be a saver while the other is a spender.',
                    'Bhakoot Dosha can attract unexpected financial setbacks — job losses, business failures, or large unplanned expenses that strain the household budget and increase stress.',
                    'Property disputes or inheritance complications may arise within the extended family, creating legal or emotional burdens that test the marriage.',
                    'Career conflicts are possible — one partner\'s job relocation or career ambition may clash with the other\'s stability needs, forcing difficult compromises.',
                ],
            });
        }

        // Health consequences
        if (scores.nadi.score === 0) {
            consequences.push({
                category: 'Health & Progeny',
                icon: '🏥',
                severity: 'Critical',
                issues: [
                    'Nadi Dosha is the most serious concern in Vedic astrology for marriage. Same Nadi (Adi-Adi, Madhya-Madhya, or Antya-Antya) indicates potential genetic incompatibilities that may affect children\'s health.',
                    'Higher likelihood of complications during pregnancy, childbirth, or early childhood health issues for offspring. Medical consultation alongside astrological remedies is strongly recommended.',
                    'Both partners may experience recurring health issues — chronic fatigue, immunity problems, or stress-related ailments that worsen when living together due to similar constitutional weaknesses.',
                    'Mental health impact is significant — anxiety, depression, or emotional instability may surface within the first 2-3 years of marriage, particularly if other doshas are also present.',
                ],
            });
        }

        // Family & Social consequences
        if (scores.grahaMaitri.score <= 1 || scores.vashya.score <= 0.5) {
            consequences.push({
                category: 'Family & Social Harmony',
                icon: '👨‍👩‍👧‍👦',
                severity: 'Serious',
                issues: [
                    'In-law relationships may be strained from the beginning. Cultural, lifestyle, or value differences between the two families can create persistent friction that spills into the couple\'s daily life.',
                    'Social isolation is a risk — the couple may struggle to build a shared social circle, leading to loneliness and over-dependence on the partner for all emotional needs.',
                    'Children may be affected by parental conflicts — inconsistent parenting approaches, arguments in front of children, or using children as mediators can impact their emotional development.',
                    'Extended family events (festivals, weddings, gatherings) may become sources of stress rather than joy, as navigating two different family dynamics becomes exhausting.',
                ],
            });
        }

        // Emotional & Mental consequences
        if (riskScore > 50) {
            consequences.push({
                category: 'Emotional & Mental Wellbeing',
                icon: '🧠',
                severity: riskScore > 65 ? 'Critical' : 'Serious',
                issues: [
                    'Chronic emotional stress from unresolved conflicts can lead to anxiety, insomnia, and depression in one or both partners. The constant state of tension erodes mental peace and life satisfaction.',
                    'Loss of individual identity — in trying to "make it work," one partner may sacrifice their personal goals, hobbies, and friendships, leading to deep resentment and a sense of wasted years.',
                    'Trust erosion over time — repeated conflicts, broken promises, or unmet expectations gradually destroy the foundation of trust, making reconciliation increasingly difficult.',
                    'The emotional toll can manifest physically — stress-related health issues like hypertension, digestive problems, weight changes, hair loss, and weakened immunity are common in high-conflict marriages.',
                    'Impact on professional life — marital stress often spills into work performance, leading to decreased productivity, missed opportunities, and strained professional relationships.',
                ],
            });
        }

        // Long-term outlook
        if (riskScore > 50) {
            consequences.push({
                category: 'Long-term Marriage Outlook',
                icon: '⏳',
                severity: riskScore > 65 ? 'Critical' : 'Serious',
                issues: [
                    `With a risk level of ${riskScore}%, this marriage faces significant challenges that require dedicated effort from both partners. Without active intervention (counseling, remedies, communication work), the relationship may deteriorate within ${riskScore > 65 ? '2-4' : '4-7'} years.`,
                    'The "honeymoon phase" may be shorter than average — underlying incompatibilities tend to surface once the initial excitement fades and daily life routines begin.',
                    'Separation or divorce probability is elevated without proper remedies and conscious effort. However, many couples with similar charts have built successful marriages through dedication, professional guidance, and spiritual practices.',
                    'If both partners are committed to growth and willing to seek help (couples therapy, Vedic remedies, family counseling), the prognosis improves significantly. The key is early intervention rather than waiting for problems to escalate.',
                ],
            });
        }
    }

    return {
        riskPercentage: riskScore,
        riskLevel,
        riskColor,
        riskFactors,
        remedies,
        consequences,
    };
}

// ==================== IDEAL PARTNER SUGGESTION ====================
// Nakshatra starting letters (aksharas) for naming
const NAKSHATRA_LETTERS = {
    'Ashwini': ['Chu', 'Che', 'Cho', 'La'],
    'Bharani': ['Lee', 'Lu', 'Le', 'Lo'],
    'Krittika': ['A', 'Ee', 'U', 'Ea'],
    'Rohini': ['O', 'Va', 'Vi', 'Vu'],
    'Mrigashira': ['Ve', 'Vo', 'Ka', 'Ki'],
    'Ardra': ['Ku', 'Gha', 'Ng', 'Chh'],
    'Punarvasu': ['Ke', 'Ko', 'Ha', 'Hi'],
    'Pushya': ['Hu', 'He', 'Ho', 'Da'],
    'Ashlesha': ['Di', 'Du', 'De', 'Do'],
    'Magha': ['Ma', 'Mi', 'Mu', 'Me'],
    'Purva Phalguni': ['Mo', 'Ta', 'Ti', 'Tu'],
    'Uttara Phalguni': ['Te', 'To', 'Pa', 'Pi'],
    'Hasta': ['Pu', 'Sha', 'Na', 'Tha'],
    'Chitra': ['Pe', 'Po', 'Ra', 'Ri'],
    'Swati': ['Ru', 'Re', 'Ro', 'Taa'],
    'Vishakha': ['Ti', 'Tu', 'Te', 'To'],
    'Anuradha': ['Na', 'Ni', 'Nu', 'Ne'],
    'Jyeshtha': ['No', 'Ya', 'Yi', 'Yu'],
    'Mula': ['Ye', 'Yo', 'Bha', 'Bhi'],
    'Purva Ashadha': ['Bhu', 'Dha', 'Pha', 'Dha'],
    'Uttara Ashadha': ['Bhe', 'Bho', 'Ja', 'Ji'],
    'Shravana': ['Khi', 'Khu', 'Khe', 'Kho'],
    'Dhanishtha': ['Ga', 'Gi', 'Gu', 'Ge'],
    'Shatabhisha': ['Go', 'Sa', 'Si', 'Su'],
    'Purva Bhadrapada': ['Se', 'So', 'Da', 'Di'],
    'Uttara Bhadrapada': ['Du', 'Tha', 'Jha', 'Da'],
    'Revati': ['De', 'Do', 'Cha', 'Chi'],
};

// Compatible Rashi pairs based on elemental harmony
const RASHI_COMPATIBILITY = {
    0: [4, 8, 2, 6],   // Aries -> Leo, Sag, Gemini, Libra
    1: [5, 9, 3, 11],  // Taurus -> Virgo, Cap, Cancer, Pisces
    2: [6, 10, 0, 4],  // Gemini -> Libra, Aqua, Aries, Leo
    3: [7, 11, 1, 5],  // Cancer -> Scorpio, Pisces, Taurus, Virgo
    4: [0, 8, 2, 6],   // Leo -> Aries, Sag, Gemini, Libra
    5: [1, 9, 3, 11],  // Virgo -> Taurus, Cap, Cancer, Pisces
    6: [2, 10, 0, 8],  // Libra -> Gemini, Aqua, Aries, Sag
    7: [3, 11, 1, 5],  // Scorpio -> Cancer, Pisces, Taurus, Virgo
    8: [0, 4, 2, 6],   // Sag -> Aries, Leo, Gemini, Libra
    9: [1, 5, 3, 11],  // Cap -> Taurus, Virgo, Cancer, Pisces
    10: [2, 6, 0, 8],   // Aqua -> Gemini, Libra, Aries, Sag
    11: [3, 7, 1, 5],   // Pisces -> Cancer, Scorpio, Taurus, Virgo
};

export function generateIdealPartner(personRashi, personNakshatra) {
    const rashiIndex = RASHIS.indexOf(personRashi);
    if (rashiIndex === -1) return null;

    const compatibleRashis = RASHI_COMPATIBILITY[rashiIndex];
    const personElement = ['Fire', 'Earth', 'Air', 'Water', 'Fire', 'Earth', 'Air', 'Water', 'Fire', 'Earth', 'Air', 'Water'][rashiIndex];

    // Get compatible Nakshatras and their name letters
    const suggestions = compatibleRashis.map(cri => {
        const rashi = RASHIS[cri];
        const element = ['Fire', 'Earth', 'Air', 'Water', 'Fire', 'Earth', 'Air', 'Water', 'Fire', 'Earth', 'Air', 'Water'][cri];
        const lord = RASHI_LORDS[cri];
        // Nakshatras belonging to this rashi
        const nakshatras = [];
        for (let n = 0; n < 27; n++) {
            if (getNakshatraRashi(n) === cri) {
                nakshatras.push({
                    name: NAKSHATRAS[n],
                    letters: NAKSHATRA_LETTERS[NAKSHATRAS[n]] || [],
                });
            }
        }
        // Compatibility reason
        let reason;
        const sameElement = personElement === element;
        if (sameElement) reason = `Same ${element} element creates natural understanding, shared energy, and instinctive harmony.`;
        else if ((personElement === 'Fire' && element === 'Air') || (personElement === 'Air' && element === 'Fire'))
            reason = 'Fire and Air elements fuel each other — passionate, dynamic, and intellectually stimulating partnership.';
        else if ((personElement === 'Earth' && element === 'Water') || (personElement === 'Water' && element === 'Earth'))
            reason = 'Earth and Water elements nurture each other — stable, supportive, and emotionally deep connection.';
        else reason = `${personElement} and ${element} elements complement each other, bringing balance and growth to the relationship.`;

        // Collect all starting letters
        const allLetters = nakshatras.flatMap(n => n.letters);

        return {
            rashi,
            element,
            lord,
            nakshatras,
            allLetters: [...new Set(allLetters)],
            reason,
            compatibility: sameElement ? 'Excellent' : 'Very Good',
        };
    });

    return {
        personRashi,
        personElement,
        suggestions,
    };
}
