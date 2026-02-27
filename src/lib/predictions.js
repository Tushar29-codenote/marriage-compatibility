// Personal Horoscope & Prediction Engine
// Generates yearly predictions based on birth details

const NAKSHATRAS = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
    'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha',
    'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

const RASHIS = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const RASHI_LORDS = [
    'Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury',
    'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'
];

const RASHI_ELEMENTS = [
    'Fire', 'Earth', 'Air', 'Water', 'Fire', 'Earth',
    'Air', 'Water', 'Fire', 'Earth', 'Air', 'Water'
];

// Career fields suited per rashi
const CAREER_SUITS = {
    0: { // Aries
        topCareers: ['Entrepreneurship', 'Military / Defense', 'Sports & Athletics', 'Surgery / Medicine', 'Law Enforcement'],
        traits: 'Natural leader with strong initiative and competitive spirit',
        advice: 'Your Mars-ruled nature thrives in fast-paced, leadership-oriented roles. Avoid monotonous desk jobs.',
    },
    1: { // Taurus
        topCareers: ['Banking & Finance', 'Real Estate', 'Agriculture', 'Fashion & Luxury', 'Culinary Arts'],
        traits: 'Patient, reliable, and drawn to stability and material comfort',
        advice: 'Venus blesses you with artistic sense and financial acumen. Careers involving beauty, money, or land suit you best.',
    },
    2: { // Gemini
        topCareers: ['Journalism & Media', 'Marketing & Advertising', 'Teaching', 'Writing & Content Creation', 'IT & Software'],
        traits: 'Excellent communicator with versatile intellectual abilities',
        advice: 'Mercury makes you a natural communicator. Roles requiring multitasking and mental agility are your forte.',
    },
    3: { // Cancer
        topCareers: ['Healthcare & Nursing', 'Hospitality & Hotels', 'Social Work', 'Psychology', 'Food & Catering'],
        traits: 'Nurturing, empathetic, and emotionally intelligent',
        advice: 'Your Moon-ruled nature excels in caring professions. Roles where you nurture or protect others bring fulfillment.',
    },
    4: { // Leo
        topCareers: ['Acting & Entertainment', 'Government & Politics', 'Corporate Leadership', 'Event Management', 'Creative Direction'],
        traits: 'Charismatic leader with strong creative expression',
        advice: 'Sun gives you a commanding presence. You shine brightest in roles with authority, stage presence, or creative freedom.',
    },
    5: { // Virgo
        topCareers: ['Data Analysis & Research', 'Accounting & Auditing', 'Healthcare / Pharmacy', 'Quality Assurance', 'Technical Writing'],
        traits: 'Detail-oriented, analytical, and service-minded',
        advice: 'Mercury gives you precision and analytical thinking. Careers requiring attention to detail and problem-solving suit you.',
    },
    6: { // Libra
        topCareers: ['Law & Legal Services', 'Diplomacy & HR', 'Interior Design', 'Fashion Designing', 'Public Relations'],
        traits: 'Diplomatic, fair-minded, and aesthetically inclined',
        advice: 'Venus bestows balance and beauty. Roles involving negotiation, aesthetics, or justice align with your nature.',
    },
    7: { // Scorpio
        topCareers: ['Research & Investigation', 'Psychology & Counseling', 'Surgery & Medicine', 'Cybersecurity', 'Occult Sciences'],
        traits: 'Intense, resourceful, and deeply perceptive',
        advice: 'Mars and Pluto give you depth and intensity. Careers requiring investigation, transformation, or deep analysis suit you.',
    },
    8: { // Sagittarius
        topCareers: ['Teaching & Education', 'Travel & Tourism', 'Philosophy & Spirituality', 'International Business', 'Publishing'],
        traits: 'Optimistic, wise, and drawn to higher knowledge',
        advice: 'Jupiter expands your horizons. Roles involving teaching, travel, philosophy, or international dealings fulfill you.',
    },
    9: { // Capricorn
        topCareers: ['Government Services', 'Civil Engineering', 'Corporate Management', 'Architecture', 'Administration'],
        traits: 'Disciplined, ambitious, and naturally authoritative',
        advice: 'Saturn rewards hard work and discipline. Structured careers with clear hierarchies and long-term growth suit you best.',
    },
    10: { // Aquarius
        topCareers: ['Technology & Innovation', 'Social Activism', 'Space & Aerospace', 'AI & Machine Learning', 'Non-Profit Organizations'],
        traits: 'Innovative, humanitarian, and forward-thinking',
        advice: 'Saturn and Uranus make you a visionary. Careers in technology, social change, or unconventional fields bring success.',
    },
    11: { // Pisces
        topCareers: ['Art & Music', 'Spiritual Healing', 'Marine Sciences', 'Film & Photography', 'Charitable Work'],
        traits: 'Intuitive, creative, and deeply compassionate',
        advice: 'Jupiter gives you wisdom and compassion. Creative, spiritual, or healing-oriented careers align with your soul.',
    },
};

// Derive nakshatra index from DOB
function deriveNakshatra(dob, timeOfBirth) {
    const date = new Date(dob);
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    let timeMinutes = 0;
    if (timeOfBirth) {
        const [hours, minutes] = timeOfBirth.split(':').map(Number);
        timeMinutes = hours * 60 + minutes;
    }
    const seed = (dayOfYear * 1440 + timeMinutes) % 27;
    return seed;
}

function getNakshatraRashi(nakshatraIndex) {
    return Math.floor((nakshatraIndex * 4) / 9);
}

// Seed-based pseudo-random for consistent results per person per year
function seededValue(seed, min, max) {
    const x = Math.sin(seed * 9301 + 49297) * 49297;
    const val = x - Math.floor(x);
    return min + val * (max - min);
}

// Get current year transit influence
function getTransitInfluence(rashiIndex, currentYear) {
    // Jupiter transits one rashi per year approximately
    const jupiterRashi = (currentYear - 2000) % 12;
    // Saturn transits one rashi per ~2.5 years
    const saturnRashi = Math.floor((currentYear - 2000) / 2.5) % 12;
    // Rahu transits one rashi per ~1.5 years
    const rahuRashi = Math.floor((currentYear - 2000) / 1.5) % 12;

    const jupiterAspect = getAspectStrength(jupiterRashi, rashiIndex);
    const saturnAspect = getAspectStrength(saturnRashi, rashiIndex);
    const rahuAspect = getAspectStrength(rahuRashi, rashiIndex);

    return { jupiterAspect, saturnAspect, rahuAspect, jupiterRashi, saturnRashi };
}

function getAspectStrength(planetRashi, nativeRashi) {
    const diff = ((nativeRashi - planetRashi + 12) % 12);
    // Direct conjunction
    if (diff === 0) return 1.0;
    // Trine (5, 9)
    if (diff === 4 || diff === 8) return 0.8;
    // Opposition (7)
    if (diff === 6) return -0.5;
    // Square (4, 10)
    if (diff === 3 || diff === 9) return -0.3;
    // Sextile (3, 11)
    if (diff === 2 || diff === 10) return 0.5;
    return 0.1;
}

// ==================== PREDICTION GENERATORS ====================

function generateCareerPrediction(rashiIndex, nakshatraIndex, transit, seed) {
    const lord = RASHI_LORDS[rashiIndex];
    const jupiterBoost = transit.jupiterAspect > 0.5;
    const saturnChallenge = transit.saturnAspect < 0;

    // Growth
    const growthBase = seededValue(seed + 1, 0, 1);
    let growthScore = growthBase + (transit.jupiterAspect * 0.3);
    growthScore = Math.max(0, Math.min(1, growthScore));
    let growth;
    if (growthScore > 0.7) growth = 'Strong';
    else if (growthScore > 0.45) growth = 'Moderate to Strong';
    else if (growthScore > 0.25) growth = 'Moderate';
    else growth = 'Slow but Steady';

    // Job change
    const changeBase = seededValue(seed + 2, 0, 1);
    const changeFactor = changeBase + (transit.saturnAspect < 0 ? 0.3 : 0) + (transit.rahuAspect > 0.5 ? 0.2 : 0);
    let jobChange;
    let jobChangeTiming;
    if (changeFactor > 0.7) {
        jobChange = 'Highly Possible';
        jobChangeTiming = 'First half of the year';
    } else if (changeFactor > 0.45) {
        jobChange = 'Possible';
        const timings = ['mid-year', 'second half', 'Q3-Q4'];
        jobChangeTiming = timings[Math.floor(seededValue(seed + 20, 0, 3))];
    } else {
        jobChange = 'Unlikely';
        jobChangeTiming = 'Stability indicated throughout the year';
    }

    // Promotion
    const promoBase = seededValue(seed + 3, 0, 1);
    let promoScore = promoBase + (jupiterBoost ? 0.25 : 0) - (saturnChallenge ? 0.15 : 0);
    let promotion;
    if (promoScore > 0.65) promotion = 'Strong chances, especially after mid-year';
    else if (promoScore > 0.4) promotion = 'Moderate — effort will be recognized';
    else promotion = 'Focus on building skills this year, promotion likely next year';

    // Business stability
    const bizBase = seededValue(seed + 4, 0, 1);
    let business;
    if (bizBase > 0.6) business = 'Stable with growth potential';
    else if (bizBase > 0.35) business = 'Moderate — avoid major risks';
    else business = 'Cautious approach recommended';

    // Skill advice
    const skillAdvices = [
        'Focus on leadership and management skills',
        'Invest in technical certifications and upskilling',
        'Develop communication and presentation skills',
        'Learn financial planning and investment strategies',
        'Build networking and relationship-building skills',
        'Explore creative and design-thinking courses',
        'Strengthen analytical and data-driven skills',
        'Focus on digital marketing and online presence',
    ];
    const skillIndex = Math.floor(seededValue(seed + 5, 0, skillAdvices.length));
    const skillAdvice = skillAdvices[skillIndex];

    return {
        growth: { value: growth, icon: '📈' },
        jobChange: { value: jobChange, timing: jobChangeTiming, icon: '🔄' },
        promotion: { value: promotion, icon: '⭐' },
        businessStability: { value: business, icon: '🏢' },
        skillAdvice: { value: skillAdvice, icon: '🧠' },
    };
}

function generateFinancialPrediction(rashiIndex, nakshatraIndex, transit, seed) {
    // Income stability
    const incomeBase = seededValue(seed + 10, 0, 1);
    let incomeStability;
    if (incomeBase > 0.6) incomeStability = 'Stable with growth';
    else if (incomeBase > 0.35) incomeStability = 'Stable';
    else incomeStability = 'Fluctuating — maintain buffer';

    // Sudden expenses
    const expenseBase = seededValue(seed + 11, 0, 1);
    let expenses;
    let expenseTiming;
    if (expenseBase > 0.6) {
        expenses = 'Likely';
        const quarters = ['Q1 (Jan-Mar)', 'Q2 (Apr-Jun)', 'Q3 (Jul-Sep)', 'Q4 (Oct-Dec)'];
        expenseTiming = quarters[Math.floor(seededValue(seed + 21, 0, 4))];
    } else if (expenseBase > 0.3) {
        expenses = 'Possible';
        expenseTiming = 'Keep emergency fund ready';
    } else {
        expenses = 'Unlikely';
        expenseTiming = 'Financial flow looks smooth';
    }

    // Investment advice
    const investBase = seededValue(seed + 12, 0, 1);
    let investment;
    if (transit.jupiterAspect > 0.5) {
        investment = 'Good time for calculated investments';
    } else if (transit.saturnAspect < 0) {
        investment = 'Avoid high-risk investments, stick to safe options';
    } else if (investBase > 0.5) {
        investment = 'Moderate risk is acceptable, diversify portfolio';
    } else {
        investment = 'Focus on savings over investments this year';
    }

    // Savings trend
    const savingsBase = seededValue(seed + 13, 0, 1) + (transit.jupiterAspect * 0.2);
    let savings;
    if (savingsBase > 0.65) savings = 'Positive — good year for wealth accumulation';
    else if (savingsBase > 0.4) savings = 'Moderate — maintain discipline';
    else savings = 'Challenging — budget carefully';

    // Lucky months for finance
    const luckyMonths = [];
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const m1 = Math.floor(seededValue(seed + 22, 0, 6));
    const m2 = Math.floor(seededValue(seed + 23, 6, 12));
    luckyMonths.push(months[m1], months[m2]);

    return {
        incomeStability: { value: incomeStability, icon: '💰' },
        unexpectedExpenses: { value: expenses, timing: expenseTiming, icon: '⚠️' },
        investment: { value: investment, icon: '📊' },
        savingsTrend: { value: savings, icon: '🏦' },
        luckyMonths: { value: luckyMonths.join(' & '), icon: '🍀' },
    };
}

function generateRelationshipPrediction(rashiIndex, nakshatraIndex, transit, seed) {
    const element = RASHI_ELEMENTS[rashiIndex];

    // Relationship harmony
    const harmonyBase = seededValue(seed + 30, 0, 1);
    let harmony;
    if (harmonyBase > 0.6) harmony = 'Harmonious — strong emotional bonding';
    else if (harmonyBase > 0.35) harmony = 'Good — minor misunderstandings possible';
    else harmony = 'Challenging — communication is key';

    // Marriage chances
    const marriageBase = seededValue(seed + 31, 0, 1) + (transit.jupiterAspect > 0.5 ? 0.2 : 0);
    let marriage;
    if (marriageBase > 0.65) marriage = 'Strong prospects, especially in second half';
    else if (marriageBase > 0.4) marriage = 'Possible — social connections increase';
    else marriage = 'Focus on self-growth first, timing will come';

    // Emotional stability
    const emotionalBase = seededValue(seed + 32, 0, 1);
    let emotional;
    if (element === 'Water') {
        emotional = emotionalBase > 0.4 ? 'Sensitive but balanced' : 'Emotionally intense — practice mindfulness';
    } else if (element === 'Fire') {
        emotional = emotionalBase > 0.4 ? 'Passionate and confident' : 'Impulsive — channel energy positively';
    } else if (element === 'Earth') {
        emotional = emotionalBase > 0.4 ? 'Stable and grounded' : 'Stubborn phases possible — stay flexible';
    } else {
        emotional = emotionalBase > 0.4 ? 'Balanced and adaptable' : 'Overthinking tendencies — trust your instincts';
    }

    // Family relations
    const familyBase = seededValue(seed + 33, 0, 1);
    let family;
    if (familyBase > 0.55) family = 'Supportive and joyful family atmosphere';
    else if (familyBase > 0.3) family = 'Generally good — some differences to resolve';
    else family = 'Patience needed in family matters';

    return {
        harmony: { value: harmony, icon: '💑' },
        marriageProspects: { value: marriage, icon: '💍' },
        emotionalBalance: { value: emotional, icon: '❤️' },
        familyRelations: { value: family, icon: '👨‍👩‍👧‍👦' },
    };
}

function generateHealthPrediction(rashiIndex, nakshatraIndex, transit, seed) {
    const element = RASHI_ELEMENTS[rashiIndex];

    // Energy levels
    const energyBase = seededValue(seed + 40, 0, 1);
    let energy;
    if (element === 'Fire') {
        energy = energyBase > 0.4 ? 'High energy throughout the year' : 'Bursts of energy with rest needed';
    } else if (element === 'Earth') {
        energy = energyBase > 0.4 ? 'Steady and consistent energy' : 'Build stamina gradually';
    } else if (element === 'Air') {
        energy = energyBase > 0.4 ? 'Mental energy is strong' : 'Physical exercise recommended';
    } else {
        energy = energyBase > 0.4 ? 'Good with proper rest' : 'Fluctuating — listen to your body';
    }

    // Stress levels
    const stressBase = seededValue(seed + 41, 0, 1);
    let stress;
    if (transit.saturnAspect < -0.2) {
        stress = 'Elevated — Saturn transit demands discipline and rest';
    } else if (stressBase > 0.6) {
        stress = 'Low — a relaxed year ahead';
    } else if (stressBase > 0.35) {
        stress = 'Moderate — manageable with routine';
    } else {
        stress = 'Slightly High — practice meditation';
    }

    // Lifestyle advice
    const advices = [
        'Maintain a consistent daily routine with 7-8 hours sleep',
        'Include yoga or meditation in your morning routine',
        'Focus on balanced diet, reduce processed foods',
        'Stay hydrated and include more fruits in your diet',
        'Regular walks or light exercise will boost immunity',
        'Avoid late nights, maintain work-life balance',
        'Practice breathing exercises for mental clarity',
        'Outdoor activities and nature time will rejuvenate energy',
    ];
    const adviceIndex = Math.floor(seededValue(seed + 42, 0, advices.length));

    // Vulnerable period
    const vulnMonth = Math.floor(seededValue(seed + 43, 0, 12));
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    // Immunity
    const immunityBase = seededValue(seed + 44, 0, 1);
    let immunity;
    if (immunityBase > 0.6) immunity = 'Strong — good resistance to seasonal changes';
    else if (immunityBase > 0.35) immunity = 'Moderate — take preventive measures';
    else immunity = 'Build immunity with proper nutrition and rest';

    return {
        energyLevels: { value: energy, icon: '⚡' },
        stressLevels: { value: stress, icon: '🧘' },
        lifestyleAdvice: { value: advices[adviceIndex], icon: '🥗' },
        cautionPeriod: { value: `Extra care recommended in ${months[vulnMonth]}`, icon: '🩺' },
        immunity: { value: immunity, icon: '🛡️' },
    };
}

// ==================== MAIN EXPORT ====================

export function generatePredictions(dob, timeOfBirth, name) {
    const nakshatraIndex = deriveNakshatra(dob, timeOfBirth);
    const rashiIndex = getNakshatraRashi(nakshatraIndex);
    const currentYear = new Date().getFullYear();
    const transit = getTransitInfluence(rashiIndex, currentYear);

    // Create a unique seed from birth details
    const date = new Date(dob);
    const seed = date.getTime() + (timeOfBirth ? parseInt(timeOfBirth.replace(':', '')) : 0);

    const career = generateCareerPrediction(rashiIndex, nakshatraIndex, transit, seed);
    const financial = generateFinancialPrediction(rashiIndex, nakshatraIndex, transit, seed);
    const relationship = generateRelationshipPrediction(rashiIndex, nakshatraIndex, transit, seed);
    const health = generateHealthPrediction(rashiIndex, nakshatraIndex, transit, seed);

    // Career suitability
    const careerSuits = CAREER_SUITS[rashiIndex];

    // Overall year summary
    const overallScore = seededValue(seed + 100, 0, 1) + (transit.jupiterAspect * 0.2);
    let yearOverview;
    if (overallScore > 0.65) {
        yearOverview = `${currentYear} looks like a promising year for you! With Jupiter's favorable transit and your ${RASHIS[rashiIndex]} moon sign energy, this year brings opportunities for growth in career and personal life. Stay focused and make the most of the positive planetary alignments.`;
    } else if (overallScore > 0.4) {
        yearOverview = `${currentYear} will be a year of steady progress for ${RASHIS[rashiIndex]} natives. While not without challenges, the planetary positions indicate that hard work and patience will yield results. Balance is the key theme — maintain equilibrium between ambition and well-being.`;
    } else {
        yearOverview = `${currentYear} asks for patience and resilience from ${RASHIS[rashiIndex]} natives. Saturn's influence means this is a year of learning and building foundations. Challenges faced now will lead to stronger outcomes in the coming years. Focus on self-improvement and disciplined effort.`;
    }

    // Lucky elements
    const luckyColors = ['Red', 'Blue', 'Green', 'Yellow', 'White', 'Orange', 'Purple', 'Gold', 'Silver', 'Pink'];
    const luckyNumbers = [1, 2, 3, 5, 7, 8, 9, 11, 14, 22];
    const luckyDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const colorIdx = rashiIndex % luckyColors.length;
    const colorIdx2 = (rashiIndex + 3) % luckyColors.length;
    const numberIdx = rashiIndex % luckyNumbers.length;
    const numberIdx2 = (rashiIndex + 4) % luckyNumbers.length;
    const dayIdx = rashiIndex % luckyDays.length;

    return {
        name: name || 'Your',
        dob,
        nakshatra: NAKSHATRAS[nakshatraIndex],
        rashi: RASHIS[rashiIndex],
        rashiLord: RASHI_LORDS[rashiIndex],
        element: RASHI_ELEMENTS[rashiIndex],
        currentYear,
        yearOverview,
        career,
        financial,
        relationship,
        health,
        careerSuits,
        lucky: {
            colors: [luckyColors[colorIdx], luckyColors[colorIdx2]],
            numbers: [luckyNumbers[numberIdx], luckyNumbers[numberIdx2]],
            day: luckyDays[dayIdx],
        },
    };
}
