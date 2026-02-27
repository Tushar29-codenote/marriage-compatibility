// Personal Horoscope & Vedic Insight Engine — Detailed Edition

const NAKSHATRAS = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
    'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha',
    'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];
const RASHIS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const RASHI_LORDS = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
const RASHI_ELEMENTS = ['Fire', 'Earth', 'Air', 'Water', 'Fire', 'Earth', 'Air', 'Water', 'Fire', 'Earth', 'Air', 'Water'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const CAREER_SUITS = {
    0: { topCareers: ['Entrepreneurship', 'Military / Defense', 'Sports & Athletics', 'Surgery / Medicine', 'Law Enforcement'], traits: 'Natural leader with strong initiative and competitive spirit', advice: 'Your Mars-ruled nature thrives in fast-paced, leadership-oriented roles. Avoid monotonous desk jobs.' },
    1: { topCareers: ['Banking & Finance', 'Real Estate', 'Agriculture', 'Fashion & Luxury', 'Culinary Arts'], traits: 'Patient, reliable, and drawn to stability and material comfort', advice: 'Venus blesses you with artistic sense and financial acumen. Careers involving beauty, money, or land suit you best.' },
    2: { topCareers: ['Journalism & Media', 'Marketing & Advertising', 'Teaching', 'Writing & Content Creation', 'IT & Software'], traits: 'Excellent communicator with versatile intellectual abilities', advice: 'Mercury makes you a natural communicator. Roles requiring multitasking and mental agility are your forte.' },
    3: { topCareers: ['Healthcare & Nursing', 'Hospitality & Hotels', 'Social Work', 'Psychology', 'Food & Catering'], traits: 'Nurturing, empathetic, and emotionally intelligent', advice: 'Your Moon-ruled nature excels in caring professions. Roles where you nurture or protect others bring fulfillment.' },
    4: { topCareers: ['Acting & Entertainment', 'Government & Politics', 'Corporate Leadership', 'Event Management', 'Creative Direction'], traits: 'Charismatic leader with strong creative expression', advice: 'Sun gives you a commanding presence. You shine brightest in roles with authority, stage presence, or creative freedom.' },
    5: { topCareers: ['Data Analysis & Research', 'Accounting & Auditing', 'Healthcare / Pharmacy', 'Quality Assurance', 'Technical Writing'], traits: 'Detail-oriented, analytical, and service-minded', advice: 'Mercury gives you precision and analytical thinking. Careers requiring attention to detail and problem-solving suit you.' },
    6: { topCareers: ['Law & Legal Services', 'Diplomacy & HR', 'Interior Design', 'Fashion Designing', 'Public Relations'], traits: 'Diplomatic, fair-minded, and aesthetically inclined', advice: 'Venus bestows balance and beauty. Roles involving negotiation, aesthetics, or justice align with your nature.' },
    7: { topCareers: ['Research & Investigation', 'Psychology & Counseling', 'Surgery & Medicine', 'Cybersecurity', 'Occult Sciences'], traits: 'Intense, resourceful, and deeply perceptive', advice: 'Mars and Pluto give you depth and intensity. Careers requiring investigation, transformation, or deep analysis suit you.' },
    8: { topCareers: ['Teaching & Education', 'Travel & Tourism', 'Philosophy & Spirituality', 'International Business', 'Publishing'], traits: 'Optimistic, wise, and drawn to higher knowledge', advice: 'Jupiter expands your horizons. Roles involving teaching, travel, philosophy, or international dealings fulfill you.' },
    9: { topCareers: ['Government Services', 'Civil Engineering', 'Corporate Management', 'Architecture', 'Administration'], traits: 'Disciplined, ambitious, and naturally authoritative', advice: 'Saturn rewards hard work and discipline. Structured careers with clear hierarchies and long-term growth suit you best.' },
    10: { topCareers: ['Technology & Innovation', 'Social Activism', 'Space & Aerospace', 'AI & Machine Learning', 'Non-Profit Organizations'], traits: 'Innovative, humanitarian, and forward-thinking', advice: 'Saturn and Uranus make you a visionary. Careers in technology, social change, or unconventional fields bring success.' },
    11: { topCareers: ['Art & Music', 'Spiritual Healing', 'Marine Sciences', 'Film & Photography', 'Charitable Work'], traits: 'Intuitive, creative, and deeply compassionate', advice: 'Jupiter gives you wisdom and compassion. Creative, spiritual, or healing-oriented careers align with your soul.' },
};

function deriveNakshatra(dob, timeOfBirth) {
    const date = new Date(dob);
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
    let timeMinutes = 0;
    if (timeOfBirth) { const [h, m] = timeOfBirth.split(':').map(Number); timeMinutes = h * 60 + m; }
    return (dayOfYear * 1440 + timeMinutes) % 27;
}
function getNakshatraRashi(ni) { return Math.floor((ni * 4) / 9); }
function sv(seed, min, max) { const x = Math.sin(seed * 9301 + 49297) * 49297; return min + (x - Math.floor(x)) * (max - min); }
function pick(seed, arr) { return arr[Math.floor(sv(seed, 0, arr.length))]; }

function getTransitInfluence(ri, yr) {
    const jR = (yr - 2000) % 12, sR = Math.floor((yr - 2000) / 2.5) % 12, rR = Math.floor((yr - 2000) / 1.5) % 12;
    const asp = (pR, nR) => { const d = ((nR - pR + 12) % 12); if (d === 0) return 1; if (d === 4 || d === 8) return 0.8; if (d === 6) return -0.5; if (d === 3 || d === 9) return -0.3; if (d === 2 || d === 10) return 0.5; return 0.1; };
    return { jupiterAspect: asp(jR, ri), saturnAspect: asp(sR, ri), rahuAspect: asp(rR, ri) };
}

// ==================== CAREER ====================
function generateCareerPrediction(ri, ni, transit, seed) {
    const lord = RASHI_LORDS[ri]; const rashi = RASHIS[ri];
    const jB = transit.jupiterAspect > 0.5; const sC = transit.saturnAspect < 0;
    const yr = new Date().getFullYear();
    const growthScore = Math.max(0, Math.min(1, sv(seed + 1, 0, 1) + transit.jupiterAspect * 0.3));
    let growth;
    if (growthScore > 0.7) growth = `Strong upward trajectory indicated for ${yr}. Your ruling planet ${lord} is well-positioned to amplify professional growth. ${jB ? "Jupiter's positive transit adds fuel to your ambitions — expect at least one significant career milestone between " + pick(seed + 200, ['March-May', 'April-July', 'June-September']) + "." : ""} You may find yourself taking on higher responsibilities, leading new teams, or being entrusted with critical projects. Key advice: set ambitious but measurable goals at the start of each quarter, track your progress, and don't shy away from high-visibility assignments. The cosmic energy strongly supports career acceleration — stay proactive and visible.`;
    else if (growthScore > 0.45) growth = `Moderate to strong growth energy this year. While not a sudden rocket launch, you'll experience steady, meaningful progress. ${lord}'s influence suggests that consistent effort will be recognized, particularly during ${pick(seed + 201, ['the second quarter (April-June)', 'mid-year (May-August)', 'the third quarter (July-September)'])}. You may receive new responsibilities or a lateral move that broadens your skill set. Focus on delivering exceptional results in your current role, and the right opportunities — promotion, salary raise, or new role — will follow naturally by year-end.`;
    else if (growthScore > 0.25) growth = `Moderate growth — this is a year of steady building rather than dramatic leaps. The foundational work you do now will pay significant dividends in ${yr + 1} and beyond. ${sC ? "Saturn's current transit is testing your patience and discipline — those who persist through this phase emerge as much stronger professionals." : "Planetary positions support skill development and knowledge acquisition over rapid advancement."} Focus on learning, contributing consistently, and strengthening relationships with key stakeholders. By ${pick(seed + 202, ['Q3', 'Q4', 'late year'])}, you'll start seeing tangible progress.`;
    else growth = `Slow but steady — patience is your greatest career asset this year. The planetary configuration suggests ${yr} is a foundational year where you're building infrastructure for future success. Think of this as planting seeds: the harvest will come in ${yr + 1}-${yr + 2}. ${sC ? "Saturn's challenging transit is deliberately slowing you down to ensure you build on solid ground. Every lesson learned now prevents bigger setbacks later." : ""} Use this time wisely: update your skills, earn certifications, expand your network. Avoid frustration with the pace — professionals who invest in growth during slower periods consistently outperform peers. Progress months: ${pick(seed + 203, ['May and October', 'June and November', 'April and September'])}.`;
    const changeFactor = sv(seed + 2, 0, 1) + (sC ? 0.3 : 0) + (transit.rahuAspect > 0.5 ? 0.2 : 0);
    let jobChange, jobChangeTiming;
    if (changeFactor > 0.7) { jobChange = `Highly likely — the planetary alignment strongly supports career transitions this year. Rahu's influence creates restlessness with the status quo and pushes you toward new horizons. If you've been considering a switch, this year provides the cosmic green light. You'll likely receive ${pick(seed + 204, ['2-3 compelling offers', '1-2 strong opportunities', 'multiple unexpected opportunities'])} that align with your long-term vision. Be selective — don't jump at the first offer, negotiate from strength and ensure the new role offers meaningful growth, not just a salary bump.`; jobChangeTiming = `Best window for transition: ${pick(seed + 20, ['January-March', 'February-April', 'March-May'])}. This period offers the strongest planetary support for new beginnings. Second favorable window: ${pick(seed + 205, ['August-September', 'September-October', 'July-August'])}. Prepare your resume and start networking at least 6-8 weeks before your target transition period.`; }
    else if (changeFactor > 0.45) { jobChange = `Possible but not urgent — an opportunity may present itself organically, likely through your professional network rather than active searching. ${pick(seed + 206, ["A former colleague or mentor may approach you with an interesting proposition around mid-year.", "An internal transfer or role restructuring within your current organization could open unexpected doors.", "A recruiter may reach out with a role that's surprisingly aligned with your aspirations."])} Evaluate any opportunity against growth potential, cultural fit, compensation fairness, and long-term career alignment.`; jobChangeTiming = `A window may open around ${pick(seed + 20, ['mid-year (June-July)', 'Q3 (August-September)', 'late year (October-November)'])}. Keep your resume updated and network actively. Meanwhile, invest in making your current role as fulfilling as possible — sometimes the best career move is deepening your impact where you are.`; }
    else { jobChange = `Unlikely this year — and that's actually a positive sign. The planetary configuration suggests that your current position holds more growth potential than you may realize. ${pick(seed + 207, ["There are hidden opportunities within your existing role that will reveal themselves as you take on new challenges.", "Your current organization is likely to undergo changes that could significantly benefit your position.", "A senior leader is quietly observing your work and has plans to involve you in something bigger."])} Rather than looking outward, direct energy inward: propose new initiatives, solve visible problems, and build alliances across departments.`; jobChangeTiming = `Current position offers stability and untapped growth potential. Focus on maximizing your impact where you are — the cosmic window opens much more favorably in ${pick(seed + 208, ['early', 'mid-', 'the second half of '])}${yr + 1}.`; }
    const promoScore = sv(seed + 3, 0, 1) + (jB ? 0.25 : 0) - (sC ? 0.15 : 0);
    let promotion;
    if (promoScore > 0.65) promotion = `Strong chances of promotion or recognition, especially after ${pick(seed + 50, ['April', 'June', 'August'])}. ${jB ? "Jupiter's favorable aspect directly boosts your professional standing — superiors view you favorably and your contributions are magnified." : ""} Your consistent efforts will be acknowledged, and you're likely to receive either a formal title upgrade, a significant salary revision, or a high-profile responsibility. To maximize this: document your achievements quantitatively (numbers, percentages, revenue impact), request a formal performance review, and advocate for yourself. The cosmic timing is on your side — be proactive in showcasing what you've accomplished. If you manage a team, their success will also reflect on you.`;
    else if (promoScore > 0.4) promotion = `Moderate — your work will be noticed but promotion timing depends on organizational factors beyond your control. ${pick(seed + 209, ["Budget cycles, restructuring, or leadership changes may delay formal recognition even though your performance merits it.", "The decision-makers appreciate your work but may be constrained by organizational hierarchies.", "Your contributions are valued, but you may need to explicitly communicate your career aspirations to management."])} Document achievements meticulously and request feedback reviews around ${pick(seed + 51, ['March', 'May', 'September'])}. Pro tip: schedule a career conversation with your manager to discuss your growth path. Express your ambitions clearly and ask what milestones would trigger a promotion. Even if it doesn't happen this year, you'll be first in line next cycle.`;
    else promotion = `This year focuses on skill-building rather than title changes — and that's strategically wise. The most successful professionals alternate between "harvest years" (promotions, raises) and "investment years" (learning, positioning). ${yr} is your investment year. ${sC ? "Saturn's influence is creating a gestation period where your skills, patience, and resilience are being forged." : ""} Invest heavily in certifications, cross-functional knowledge, and visible projects. Take on stretch assignments that expose you to senior leadership. By doing this groundwork, you'll be positioned for a significant leap in ${yr + 1} — potentially skipping a level rather than making an incremental move.`;
    const bizBase = sv(seed + 4, 0, 1);
    let business;
    if (bizBase > 0.6) business = `Stable with strong growth potential. ${lord}'s influence supports business expansion and calculated risk-taking. Revenue growth of ${pick(seed + 210, ['10-20%', '15-25%', '12-18%'])} is achievable with the right strategy. Consider launching new product lines, entering adjacent markets, or expanding your customer base between ${pick(seed + 52, ['Q1-Q2', 'Q2-Q3', 'Q3-Q4'])}. Client acquisition efforts will be particularly fruitful during ${pick(seed + 211, ['March-May', 'June-August', 'September-November'])}. Existing business owners should focus on systems, processes, and team building to handle increased demand gracefully.`;
    else if (bizBase > 0.35) business = `Moderate stability — the business landscape requires a strategic, cautious approach. While revenues remain steady, avoid over-leveraging or making large capital commitments. Focus on consolidating existing operations, strengthening client relationships, and improving operational efficiency. ${pick(seed + 212, ["Customer retention is more profitable than acquisition this year — invest in loyalty programs and exceptional service.", "Streamline operations and eliminate waste before pursuing growth — a lean operation scales more sustainably.", "Build strategic partnerships rather than going solo — collaborations will multiply your reach with shared risk."])} Major expansion is better suited for ${yr + 1} when planetary support strengthens.`;
    else business = `Exercise caution with business ventures this year. Planetary positions suggest consolidation rather than expansion. Avoid large capital commitments, risky partnerships, and speculative ventures. ${pick(seed + 213, ["Focus on profitability over revenue growth — cutting costs by even 10-15% can dramatically improve your financial runway.", "Business partnerships entered this year may have hidden complications — conduct thorough due diligence.", "Innovation efforts will face delays — prioritize proven strategies over experimental ones."])} Focus on cost optimization, cash reserve building, and strengthening your core offering. Target ${pick(seed + 214, ['Q3-Q4', 'early ' + String(yr + 1), 'mid-' + String(yr + 1)])} for resuming growth initiatives.`;
    const skillAdvice = pick(seed + 5, [
        'Leadership & management certifications will open doors. Consider PMP, MBA modules, or executive coaching to position yourself for senior roles.',
        'Technical upskilling is your priority. Cloud computing, AI/ML fundamentals, or advanced data analytics certifications will significantly boost your market value.',
        'Communication and presentation mastery will be your differentiator. Join Toastmasters, take storytelling workshops, or develop your personal brand on LinkedIn.',
        'Financial literacy will serve you well. Study investment strategies, financial modeling, or business analytics to complement your domain expertise.',
        'Networking is your superpower this year. Attend industry conferences, join professional communities, and build strategic relationships that will pay dividends long-term.',
        'Creative problem-solving and design thinking will set you apart. Take courses in UX design, innovation, or product management to broaden your perspective.',
        'Analytical and data-driven decision making will accelerate your growth. Master Excel advanced functions, SQL, Python for data analysis, or BI tools.',
        'Digital marketing and personal branding will amplify your career. Learn SEO, content strategy, or social media marketing to increase your professional visibility.',
    ]);
    const bestMonths = `${MONTHS[Math.floor(sv(seed + 53, 0, 4))]}, ${MONTHS[Math.floor(sv(seed + 54, 4, 8))]}, and ${MONTHS[Math.floor(sv(seed + 55, 8, 12))]}`;
    const networkingAdvice = pick(seed + 56, [
        `Your networking star is bright this year. Professional connections made during ${pick(seed + 57, ['Q1', 'Q2', 'Q3'])} will prove especially valuable. Attend at least 2-3 industry events.`,
        'A mentor figure may enter your life around mid-year. Be open to guidance from senior professionals — their experience will fast-track your growth.',
        'Collaborative projects will be your biggest career catalysts. Seek cross-functional assignments and volunteer for team initiatives that increase your visibility.',
        `Alumni networks and old professional contacts will resurface with opportunities. Reconnect with former colleagues, especially during ${pick(seed + 58, ['February-March', 'May-June', 'September-October'])}.`,
    ]);
    const workLifeBalance = pick(seed + 59, [
        'Work-life balance needs conscious attention this year. Set firm boundaries — avoid checking emails after 8 PM and protect your weekends for personal rejuvenation.',
        `Burnout risk is ${sC ? 'elevated' : 'moderate'} this year. Schedule regular breaks, take your vacation days, and consider a mid-year retreat to recharge.`,
        'Your productivity peaks in focused sprints rather than long hours. Adopt time-blocking, the Pomodoro technique, or deep work sessions for maximum output with less stress.',
        'Remote/flexible work arrangements are favored this year. If possible, negotiate hybrid schedules that give you creative space while maintaining team connection.',
    ]);
    const quarterlyOutlook = {
        Q1: pick(seed + 60, ['Strong start — use this momentum to set ambitious goals and initiate key projects.', 'Slow start — be patient, foundations laid now will support rapid growth later.', 'Transitional — focus on planning and strategy rather than execution.']),
        Q2: pick(seed + 61, ['Peak productivity period — push hard on deliverables and showcase results.', 'Consolidation phase — refine your approach and build internal alliances.', 'Creative breakthroughs possible — brainstorm freely and experiment with new ideas.']),
        Q3: pick(seed + 62, ['Harvest period — results of earlier efforts become visible. Recognition incoming.', 'Challenging but rewarding — perseverance through obstacles will build resilience.', 'Networking peak — relationships built now will define your next career chapter.']),
        Q4: pick(seed + 63, ['Strong finish — wrap up the year with impactful achievements and set stage for next year.', 'Reflection period — review accomplishments, plan ahead, and position yourself strategically.', 'Unexpected opportunities — stay flexible and ready to pivot if a compelling offer arises.']),
    };
    const detailedSummary = `As a ${rashi} native ruled by ${lord}, your career in ${new Date().getFullYear()} is characterized by ${growth.toLowerCase()} growth energy. ${jB ? "Jupiter's favorable transit amplifies professional opportunities and brings supportive mentors into your circle." : "While Jupiter's current position doesn't offer direct career support, your own efforts and determination will drive results."} ${sC ? "Saturn's challenging aspect demands discipline and patience — shortcuts will backfire, but systematic effort will be rewarded handsomely." : "Saturn's neutral-to-positive influence ensures stable career foundations with room for measured advancement."} The key months to watch for career developments are ${bestMonths}. Your ${NAKSHATRAS[ni]} nakshatra energy adds ${pick(seed + 64, ['innovative thinking', 'persistent determination', 'creative flair', 'analytical precision', 'diplomatic skill', 'strategic vision'])} to your professional toolkit — leverage this unique strength in competitive situations.`;

    return {
        growth: { value: growth, icon: '📈' },
        promotion: { value: promotion, icon: '⭐' },
        businessStability: { value: business, icon: '🏢' },
        skillAdvice: { value: skillAdvice, icon: '🧠' },
        bestMonths: { value: `Key career months: ${bestMonths}`, icon: '📅' },
        networking: { value: networkingAdvice, icon: '🤝' },
        workLifeBalance: { value: workLifeBalance, icon: '⚖️' },
        quarterlyOutlook: { value: `Q1: ${quarterlyOutlook.Q1} | Q2: ${quarterlyOutlook.Q2} | Q3: ${quarterlyOutlook.Q3} | Q4: ${quarterlyOutlook.Q4}`, icon: '📊' },
        detailedSummary,
    };
}

// ==================== FINANCIAL ====================
function generateFinancialPrediction(ri, ni, transit, seed) {
    const lord = RASHI_LORDS[ri]; const rashi = RASHIS[ri]; const yr = new Date().getFullYear();
    const incomeBase = sv(seed + 10, 0, 1);
    let incomeStability;
    if (incomeBase > 0.6) incomeStability = `Stable with growth potential. Expect a ${pick(seed + 70, ['5-12%', '8-15%', '10-18%'])} increase in overall income through salary hikes, bonuses, or secondary income streams. Most gains will materialize after ${pick(seed + 71, ['Q1', 'Q2', 'mid-year'])}.`;
    else if (incomeBase > 0.35) incomeStability = 'Stable but flat. Income will remain consistent without major jumps. Consider negotiating a raise or exploring freelance/consulting opportunities to supplement earnings.';
    else incomeStability = `Fluctuating — anticipate variable income months. Build a ${pick(seed + 72, ['3-month', '4-month', '6-month'])} emergency buffer. Income stabilizes significantly in the second half of the year.`;

    const expenseBase = sv(seed + 11, 0, 1);
    let expenses, expenseTiming;
    if (expenseBase > 0.6) { expenses = 'Likely — plan ahead'; expenseTiming = `Major unexpected expenses indicated around ${pick(seed + 21, ['Q1 (January-March), possibly related to home or vehicle repairs', 'Q2 (April-June), likely medical or family-related', 'Q3 (July-September), could involve travel or legal matters', 'Q4 (October-December), festive spending plus an unplanned expense'])}. Set aside an emergency fund of at least 2-3 months expenses.`; }
    else if (expenseBase > 0.3) { expenses = 'Moderate risk'; expenseTiming = 'Some unplanned expenses possible but manageable. Maintain a liquid emergency fund and avoid maxing out credit cards. Insurance review recommended.'; }
    else { expenses = 'Low risk'; expenseTiming = 'Financial outflow looks predictable this year. A great time to redirect savings toward investments or debt repayment.'; }

    let investment;
    if (transit.jupiterAspect > 0.5) investment = `Jupiter's favorable transit makes this an excellent year for calculated investments. Consider diversifying into ${pick(seed + 73, ['mutual funds, SIPs, and blue-chip stocks', 'index funds, gold ETFs, and government bonds', 'real estate REITs, balanced funds, and fixed deposits'])}. Best investment months: ${MONTHS[Math.floor(sv(seed + 74, 0, 4))]} and ${MONTHS[Math.floor(sv(seed + 75, 6, 10))]}.`;
    else if (transit.saturnAspect < 0) investment = `Saturn's challenging aspect advises caution with investments. Stick to low-risk options: fixed deposits, PPF, government bonds, or debt mutual funds. Avoid speculative trading, cryptocurrency, and high-volatility stocks until ${yr + 1}.`;
    else investment = `Moderate investment approach recommended. Allocate ${pick(seed + 76, ['60% to safe instruments (FD, bonds) and 40% to growth (equity, SIPs)', '70% to stable funds and 30% to calculated equity positions', '50-50 split between debt and equity instruments'])}. Review and rebalance portfolio quarterly.`;

    const savingsBase = sv(seed + 13, 0, 1) + (transit.jupiterAspect * 0.2);
    let savings;
    if (savingsBase > 0.65) savings = `Positive trend — this is one of your best years for wealth accumulation. Target saving ${pick(seed + 77, ['20-30%', '25-35%', '15-25%'])} of your income. Automate transfers to savings accounts on salary day for consistency.`;
    else if (savingsBase > 0.4) savings = 'Moderate — savings possible with disciplined budgeting. Track expenses using a financial app, eliminate subscription waste, and follow the 50/30/20 rule (needs/wants/savings).';
    else savings = `Challenging — expenses may eat into savings capacity. Create a strict monthly budget, cut discretionary spending by ${pick(seed + 78, ['15-20%', '20-25%', '10-15%'])}, and prioritize building an emergency fund before investing.`;

    const m1 = MONTHS[Math.floor(sv(seed + 22, 0, 6))], m2 = MONTHS[Math.floor(sv(seed + 23, 6, 12))];
    const propertyAdvice = pick(seed + 79, [
        `Property investment is ${transit.jupiterAspect > 0.3 ? 'favored' : 'not strongly indicated'} this year. ${transit.jupiterAspect > 0.3 ? 'If planning to buy, explore options during ' + MONTHS[Math.floor(sv(seed + 80, 2, 6))] + '-' + MONTHS[Math.floor(sv(seed + 81, 6, 9))] + ' for best deals.' : 'Delay major property decisions to next year when planetary support improves.'}`,
        'Home renovation or improvement projects are well-starred this year. Budget carefully and get multiple quotes before committing to contractors.',
        `Rental income opportunities look ${sv(seed + 82, 0, 1) > 0.5 ? 'promising — consider leveraging existing property assets' : 'modest — focus on maintaining existing properties rather than acquiring new ones'}.`,
    ]);
    const debtAdvice = pick(seed + 83, [
        'Prioritize clearing high-interest debts (credit cards, personal loans) this year. The snowball or avalanche method will accelerate your debt-free journey.',
        `Debt management looks manageable. Consider refinancing existing loans for better rates during ${pick(seed + 84, ['Q1-Q2', 'mid-year', 'Q3'])} when lending rates are expected to be favorable.`,
        'Avoid taking on new debt unless absolutely necessary. If you must borrow, opt for secured loans with lower interest rates over unsecured credit.',
    ]);
    const taxPlanning = pick(seed + 85, [
        `Start tax planning early — maximize deductions under applicable sections. Invest in tax-saving instruments by ${pick(seed + 86, ['March', 'September', 'November'])} to avoid last-minute decisions.`,
        'Review your tax structure with a financial advisor. There may be overlooked deductions or more efficient investment vehicles that can reduce your tax burden by 10-20%.',
        'Consider setting up systematic investments in ELSS or PPF to optimize tax savings while building long-term wealth. Automate monthly contributions for consistency.',
    ]);
    const detailedSummary = `Your financial landscape in ${yr} as a ${rashi} native is shaped by ${lord}'s influence on wealth and material comfort. ${transit.jupiterAspect > 0.5 ? 'Jupiter\'s benevolent gaze on your chart indicates a year of financial expansion — both earned and passive income channels show promise.' : 'While Jupiter doesn\'t directly boost finances this year, steady effort and smart money management will maintain stability.'} The key to maximizing wealth this year lies in disciplined saving during the first half and strategic investing during the second half. Your most financially productive months are ${m1} and ${m2}. ${sav(seed + 87) > 0.5 ? 'An unexpected windfall or bonus is possible — when it arrives, allocate 50% to savings/investments and enjoy the rest guilt-free.' : 'Financial growth will come through systematic effort rather than windfalls — patience and consistency are your best wealth-building tools.'}`;

    return {
        incomeStability: { value: incomeStability, icon: '💰' },
        unexpectedExpenses: { value: expenses, timing: expenseTiming, icon: '⚠️' },
        investment: { value: investment, icon: '📊' },
        savingsTrend: { value: savings, icon: '🏦' },
        luckyMonths: { value: `Most favorable financial months: ${m1} & ${m2}. Plan major financial decisions, investments, and negotiations during these periods.`, icon: '🍀' },
        propertyAdvice: { value: propertyAdvice, icon: '🏠' },
        debtManagement: { value: debtAdvice, icon: '💳' },
        taxPlanning: { value: taxPlanning, icon: '📋' },
        detailedSummary,
    };
}

// helper to avoid crash on typo
function sav(seed) { return sv(seed, 0, 1); }

// ==================== RELATIONSHIP ====================
function generateRelationshipPrediction(ri, ni, transit, seed) {
    const element = RASHI_ELEMENTS[ri]; const rashi = RASHIS[ri]; const lord = RASHI_LORDS[ri];
    const harmonyBase = sv(seed + 30, 0, 1);
    let harmony;
    if (harmonyBase > 0.6) harmony = 'Harmonious — expect deep emotional bonding and mutual understanding this year. Communication flows naturally and both partners feel valued. This is an excellent period for creating shared memories through travel, experiences, and quality time together.';
    else if (harmonyBase > 0.35) harmony = `Good overall, with occasional friction that can be resolved through open communication. Minor misunderstandings may arise around ${pick(seed + 90, ['March-April', 'June-July', 'September-October'])} — approach these with patience rather than reactivity. A heart-to-heart conversation during this period will strengthen your bond.`;
    else harmony = 'Challenging — requires conscious effort from both partners. External stressors (work, family, finances) may strain the relationship. Schedule regular date nights, practice active listening, and consider couples counseling if tensions persist. The second half of the year brings improvement.';

    const marriageBase = sv(seed + 31, 0, 1) + (transit.jupiterAspect > 0.5 ? 0.2 : 0);
    let marriage;
    if (marriageBase > 0.65) marriage = `Strong auspicious energy for marriage this year. ${transit.jupiterAspect > 0.5 ? 'Jupiter\'s blessings strongly support matrimonial decisions.' : ''} Most favorable periods: ${pick(seed + 91, ['February-April and October-November', 'March-May and November-December', 'January-March and September-October'])}. If already in a committed relationship, this is the year to take it to the next level.`;
    else if (marriageBase > 0.4) marriage = `Possible — social connections and family introductions increase during ${pick(seed + 92, ['Q2', 'Q3', 'late Q1'])}. While marriage may not be immediate, meaningful romantic connections are likely. For those already engaged, wedding planning proceeds smoothly after mid-year.`;
    else marriage = 'Focus on self-growth and emotional readiness first. The universe is preparing you for the right partnership by helping you develop inner clarity and confidence. Use this time to understand your relationship values and non-negotiables. Marriage timing improves significantly next year.';

    let emotional;
    const eBase = sv(seed + 32, 0, 1);
    if (element === 'Water') emotional = eBase > 0.4 ? 'Sensitive but beautifully balanced this year. Your emotional depth becomes a source of wisdom and empathy. Others will gravitate toward your nurturing presence. Practice self-care to avoid absorbing others\' emotional energy.' : 'Emotionally intense periods are likely — your feelings run deep and strong. Practice mindfulness meditation, journaling, and grounding exercises. Set emotional boundaries with energy-draining people. Water activities (swimming, beach walks) will restore equilibrium.';
    else if (element === 'Fire') emotional = eBase > 0.4 ? 'Passionate, confident, and emotionally vibrant. Your enthusiasm is contagious and attracts positive people. Channel your fire energy into creative expression, physical activity, and inspiring others.' : 'Impulsive emotional reactions may create unnecessary conflicts. Practice the 24-hour rule before responding to triggering situations. Physical exercise, especially martial arts or running, will help channel excess fire energy constructively.';
    else if (element === 'Earth') emotional = eBase > 0.4 ? 'Stable, grounded, and emotionally reliable. You serve as an anchor for those around you. This steady emotional foundation supports deep, meaningful connections. Trust your practical instincts in matters of the heart.' : 'Stubborn phases and emotional rigidity possible during stress. Practice flexibility and openness to others\' perspectives. Spending time in nature, gardening, or outdoor activities will help release emotional tension and restore adaptability.';
    else emotional = eBase > 0.4 ? 'Balanced and intellectually adaptable in emotional matters. You process feelings through understanding and analysis. Creative writing, philosophical discussions, or artistic pursuits will enhance emotional expression.' : 'Overthinking and analysis paralysis in emotional decisions. Trust your intuition more — not everything needs to be logically processed. Breathing exercises, spontaneous activities, and connecting with lighthearted friends will break mental loops.';

    const familyBase = sv(seed + 33, 0, 1);
    let family;
    if (familyBase > 0.55) family = `Supportive and joyful family atmosphere throughout the year. A family celebration or reunion around ${pick(seed + 93, ['April-May', 'August-September', 'November-December'])} brings everyone closer. Elder family members offer valuable guidance — be open to their wisdom.`;
    else if (familyBase > 0.3) family = 'Generally good with some generational differences to navigate. Approach family disagreements with empathy and patience. A family member may need extra support or care this year — your involvement will strengthen bonds and create gratitude.';
    else family = 'Patience and diplomacy are essential in family dynamics. Property or financial matters within the family may require careful handling. Avoid taking sides in disputes — serve as a mediator instead. Things improve noticeably after mid-year.';

    const socialCircle = pick(seed + 94, [
        `Your social life expands significantly this year. New friendships formed during ${pick(seed + 95, ['Q1', 'Q2', 'Q3'])} will prove lasting and meaningful. Join community groups, clubs, or volunteer organizations to meet like-minded people.`,
        'Quality over quantity in friendships this year. Some casual connections may fade while deeper bonds strengthen. A close friend may introduce you to someone who changes your life trajectory.',
        `Social energy peaks during ${pick(seed + 96, ['spring months', 'summer months', 'autumn months'])}. Hosting gatherings, attending cultural events, or joining fitness communities will enrich your social network.`,
    ]);
    const communicationAdvice = pick(seed + 97, [
        'Active listening is your relationship superpower this year. Practice reflecting back what you hear before responding. Small gestures of appreciation (hand-written notes, surprise calls) will deepen intimacy.',
        `Communication clarity improves after ${pick(seed + 98, ['February', 'March', 'April'])}. Express your needs directly and lovingly — assumptions create unnecessary distance. Schedule weekly check-in conversations with your partner.`,
        'Non-verbal communication matters more than words this year. Pay attention to body language, tone, and energy. Physical touch, shared experiences, and acts of service speak louder than verbal declarations.',
    ]);
    const romanticTiming = pick(seed + 99, [
        `Romantic energy peaks during ${pick(seed + 100, ['February-March', 'April-May', 'September-October'])} — plan special dates, surprise getaways, or heartfelt gestures during this window.`,
        `Venus transits bring romantic opportunities around ${pick(seed + 101, ['March-April', 'June-July', 'October-November'])}. Single natives may meet someone special through ${pick(seed + 102, ['social gatherings', 'work/professional circles', 'mutual friends or family'])}.`,
        `The most emotionally connected period is ${pick(seed + 103, ['Q2 (April-June)', 'Q3 (July-September)', 'Q4 (October-December)'])} — deepen existing bonds or open your heart to new connections during this phase.`,
    ]);
    const detailedSummary = `Relationships for ${rashi} natives in ${new Date().getFullYear()} are influenced by ${lord}'s energy in the emotional sphere. ${element} element brings ${element === 'Fire' ? 'passion and intensity' : element === 'Earth' ? 'stability and reliability' : element === 'Air' ? 'intellectual connection and adaptability' : 'emotional depth and intuitive bonding'} to all your relationships. ${transit.jupiterAspect > 0.5 ? 'Jupiter\'s favorable position enhances all partnerships — both romantic and professional relationships flourish under this benevolent influence.' : 'While Jupiter isn\'t directly supporting relationships, your own emotional intelligence and effort will create the harmony you seek.'} The key relationship themes for this year are authenticity, vulnerability, and conscious communication. Trust the process and remain open to love in all its forms.`;

    return {
        harmony: { value: harmony, icon: '💑' },
        marriageProspects: { value: marriage, icon: '💍' },
        emotionalBalance: { value: emotional, icon: '❤️' },
        familyRelations: { value: family, icon: '👨‍👩‍👧‍👦' },
        socialCircle: { value: socialCircle, icon: '👥' },
        communication: { value: communicationAdvice, icon: '💬' },
        romanticTiming: { value: romanticTiming, icon: '🌹' },
        detailedSummary,
    };
}

// ==================== HEALTH ====================
function generateHealthPrediction(ri, ni, transit, seed) {
    const element = RASHI_ELEMENTS[ri]; const rashi = RASHIS[ri]; const lord = RASHI_LORDS[ri];
    const energyBase = sv(seed + 40, 0, 1);
    let energy;
    if (element === 'Fire') energy = energyBase > 0.4 ? `High energy throughout the year. Your ${rashi} fire element fuels physical stamina and mental drive. Channel this energy into regular exercise, competitive sports, or adventurous activities. You thrive with an active lifestyle — a sedentary routine will make you restless and irritable.` : 'Energy comes in powerful bursts followed by rest needs. Your fire element burns bright but can exhaust reserves quickly. Adopt interval-style activity patterns — intense workouts followed by recovery days. Power naps of 15-20 minutes will recharge you more effectively than long sleep.';
    else if (element === 'Earth') energy = energyBase > 0.4 ? 'Steady, reliable energy that builds throughout the day. Your Earth element provides remarkable endurance for sustained effort. You perform best with consistent routines — same wake-up time, regular meals, and structured exercise. Strength training and hiking align perfectly with your energy type.' : 'Build stamina gradually — don\'t push too hard too fast. Your Earth element prefers steady progression over sudden intensity. Start with walking 30 minutes daily, gradually adding resistance training. Yoga and stretching will prevent stiffness that Earth signs are prone to.';
    else if (element === 'Air') energy = energyBase > 0.4 ? 'Mental energy is exceptionally strong this year — ideas flow freely and intellectual curiosity peaks. Balance mental activity with physical movement to prevent mind-body disconnect. Dancing, swimming, or group fitness classes will keep both mind and body energized.' : 'Mental restlessness may drain physical energy. Your Air element creates constant mental activity that can exhaust the body. Grounding exercises (walking barefoot, gardening), regular sleep schedules, and device-free evenings will restore the mind-body balance.';
    else energy = energyBase > 0.4 ? 'Energy flows well with emotional state — when happy, you\'re unstoppable. Your Water element connects physical vitality directly to emotional health. Maintain emotional equilibrium through creative outlets, time near water (beaches, pools, rivers), and nurturing relationships.' : 'Fluctuating energy tied to emotional cycles. Your Water element makes you sensitive to environmental and emotional shifts. Track your energy patterns across the month — you\'ll notice rhythms. During low-energy phases, prioritize rest and gentle activities like swimming or tai chi.';

    const stressBase = sv(seed + 41, 0, 1);
    let stress;
    if (transit.saturnAspect < -0.2) stress = `Elevated stress levels due to Saturn's challenging transit. This is a year of significant mental growth through pressure. Adopt a daily meditation practice (even 10 minutes), regular exercise, and strict sleep hygiene. Consider professional support if stress becomes overwhelming. Key pressure months: ${pick(seed + 110, ['March-April and September', 'February-March and August', 'May-June and October-November'])}. However, each challenge overcome will build lasting resilience.`;
    else if (stressBase > 0.6) stress = 'Low stress levels — one of your more relaxed years. Your nervous system is well-regulated and you handle pressure with grace. Use this calm period to build stress-management habits (meditation, journaling, exercise) that will serve you in more demanding years ahead.';
    else if (stressBase > 0.35) stress = `Moderate and manageable stress with proper routines. Workplace pressures peak around ${pick(seed + 111, ['Q2', 'Q3', 'Q1'])} but remain within healthy limits. Progressive muscle relaxation before bed, a gratitude journal, and 3 deep breaths before responding to stressors will keep you balanced.`;
    else stress = `Slightly elevated — practice proactive stress management. ${pick(seed + 112, ['Morning meditation and evening walks will create bookends of calm around your busy days.', 'Yoga combined with breathwork (pranayama) will regulate your nervous system effectively.', 'Regular massage therapy, aromatherapy, and nature immersion will counteract stress accumulation.'])} Consider reducing caffeine and sugar, which amplify stress responses.`;

    const immunityBase = sv(seed + 44, 0, 1);
    let immunity;
    if (immunityBase > 0.6) immunity = 'Strong immunity this year — good natural resistance to seasonal illnesses and infections. Maintain this advantage with vitamin-rich foods, adequate sleep, and regular exercise. A daily dose of turmeric, ginger, and citrus fruits will further fortify your defenses.';
    else if (immunityBase > 0.35) immunity = `Moderate — seasonal vulnerability possible during ${pick(seed + 113, ['monsoon months (July-August)', 'winter transition (November-December)', 'spring season change (March-April)'])}. Proactively supplement with Vitamin C, D3, and Zinc. Wash hands frequently and avoid crowded spaces during peak illness seasons.`;
    else immunity = 'Focus on building immunity through nutrition and lifestyle changes. Include probiotic foods (yogurt, fermented vegetables), antioxidant-rich berries, and immune-boosting herbs (ashwagandha, tulsi, giloy) in your daily diet. Consider annual health checkups and preventive vaccinations.';

    const vulnMonth = MONTHS[Math.floor(sv(seed + 43, 0, 12))];
    const mentalWellness = pick(seed + 114, [
        'Mental clarity peaks during morning hours — tackle important decisions before noon. Journaling for 10 minutes each evening helps process the day\'s emotions and prevents mental clutter from accumulating. Reading before bed promotes better sleep quality than screen time.',
        `Mindfulness practice is especially beneficial for you this year. Start with 5-minute guided meditations and gradually increase to 20 minutes daily. Apps like Headspace or Calm can provide structure. Peak mental wellness months: ${pick(seed + 115, ['March-May', 'June-August', 'September-November'])}.`,
        'Creative expression is your mental health therapy. Whether it\'s painting, music, writing, cooking, or crafting — regular creative activities will prevent anxiety and promote emotional processing. Schedule at least 2 creative sessions per week.',
        'Social connection is essential for your mental health. Isolation amplifies negative thought patterns. Maintain regular contact with 3-5 close friends, join group activities, and don\'t hesitate to share vulnerabilities with trusted people.',
    ]);
    const fitnessAdvice = pick(seed + 116, [
        `Best fitness approach for your ${element} element: ${element === 'Fire' ? 'High-intensity interval training (HIIT), martial arts, running, competitive sports' : element === 'Earth' ? 'Strength training, hiking, power yoga, rock climbing' : element === 'Air' ? 'Dancing, tennis, cycling, group fitness classes, Pilates' : 'Swimming, tai chi, water aerobics, gentle yoga, walking meditation'}. Aim for ${pick(seed + 117, ['30 minutes 5 times', '45 minutes 4 times', '20 minutes 6 times'])} per week.`,
        `Your body responds best to ${pick(seed + 118, ['morning workouts between 6-8 AM', 'afternoon exercise between 4-6 PM', 'evening workouts between 6-8 PM'])} based on your birth chart energy. Consistency matters more than intensity — a sustainable 30-minute daily routine beats occasional intense sessions.`,
    ]);
    const dietRecommendation = pick(seed + 119, [
        `Foods that align with your ${element} constitution: ${element === 'Fire' ? 'cooling foods — cucumber, coconut water, leafy greens, melons, yogurt. Reduce spicy, oily, and fried foods.' : element === 'Earth' ? 'warming, light foods — soups, steamed vegetables, whole grains, ginger tea. Avoid heavy, cold, and excessively sweet foods.' : element === 'Air' ? 'grounding, warm foods — root vegetables, nuts, warming spices, ghee, oatmeal. Avoid raw, cold, and dry foods.' : 'light, warm, and spiced foods — ginger, turmeric, honey, cooked vegetables, lentils. Avoid dairy excess, cold drinks, and oily foods.'}`,
        'Follow the Ayurvedic principle: eat your largest meal at lunch when digestive fire (Agni) is strongest. Keep dinner light and eat at least 2 hours before sleep. Seasonal eating (local, fresh produce) will optimize your health this year.',
    ]);
    const sleepAdvice = pick(seed + 120, [
        `Optimal sleep for your constitution: ${pick(seed + 121, ['7-8 hours', '7.5-8.5 hours', '6.5-7.5 hours'])} nightly. Create a wind-down ritual: dim lights at 9 PM, avoid screens after 9:30 PM, and practice 5 minutes of deep breathing in bed. Your ideal sleep window is ${pick(seed + 122, ['10 PM to 6 AM', '10:30 PM to 6:30 AM', '11 PM to 7 AM'])}.`,
        'Sleep quality matters more than quantity for you this year. Invest in a comfortable mattress, maintain bedroom temperature at 18-20°C, and use blackout curtains. A few drops of lavender oil on your pillow can improve sleep onset by 20-30 minutes.',
    ]);
    const detailedSummary = `Health for ${rashi} natives in ${new Date().getFullYear()} is governed by ${lord}'s influence on vitality and the ${element} element's effect on your constitution. ${transit.saturnAspect < 0 ? 'Saturn\'s transit requires extra attention to bone health, joints, and stress management. Don\'t ignore persistent symptoms — early intervention prevents complications.' : 'The planetary alignment supports good health foundations — use this year to establish lasting wellness habits.'} Your most vulnerable period is around ${vulnMonth} — pre-emptive care (rest, nutrition, hydration) during this time will prevent issues. Overall, ${energyBase > 0.5 ? 'your energy reserves are strong' : 'building energy gradually through consistent routines'} should be your health strategy. Remember: small daily health investments compound into extraordinary long-term wellness.`;

    return {
        energyLevels: { value: energy, icon: '⚡' },
        stressLevels: { value: stress, icon: '🧘' },
        immunity: { value: immunity, icon: '🛡️' },
        cautionPeriod: { value: `Extra care recommended in ${vulnMonth}. This month, your body's resistance dips slightly — prioritize sleep, reduce social commitments, and nourish yourself with immunity-boosting foods. Avoid travel stress if possible.`, icon: '🩺' },
        mentalWellness: { value: mentalWellness, icon: '🧠' },
        fitness: { value: fitnessAdvice, icon: '🏃' },
        diet: { value: dietRecommendation, icon: '🥗' },
        sleep: { value: sleepAdvice, icon: '😴' },
        detailedSummary,
    };
}

// ==================== MAIN EXPORT ====================
export function generatePredictions(dob, timeOfBirth, name) {
    const ni = deriveNakshatra(dob, timeOfBirth);
    const ri = getNakshatraRashi(ni);
    const yr = new Date().getFullYear();
    const transit = getTransitInfluence(ri, yr);
    const date = new Date(dob);
    const seed = date.getTime() + (timeOfBirth ? parseInt(timeOfBirth.replace(':', '')) : 0);

    const career = generateCareerPrediction(ri, ni, transit, seed);
    const financial = generateFinancialPrediction(ri, ni, transit, seed);
    const relationship = generateRelationshipPrediction(ri, ni, transit, seed);
    const health = generateHealthPrediction(ri, ni, transit, seed);
    const careerSuits = CAREER_SUITS[ri];

    const overallScore = sv(seed + 100, 0, 1) + (transit.jupiterAspect * 0.2);
    let yearOverview;
    if (overallScore > 0.65) yearOverview = `${yr} looks like a promising year for you! With Jupiter's favorable transit and your ${RASHIS[ri]} moon sign energy, this year brings opportunities for growth in career and personal life. Stay focused and make the most of the positive planetary alignments. Key themes: expansion, opportunity, and abundance.`;
    else if (overallScore > 0.4) yearOverview = `${yr} will be a year of steady progress for ${RASHIS[ri]} natives. While not without challenges, the planetary positions indicate that hard work and patience will yield results. Balance is the key theme — maintain equilibrium between ambition and well-being. Your second half looks stronger than the first.`;
    else yearOverview = `${yr} asks for patience and resilience from ${RASHIS[ri]} natives. Saturn's influence means this is a year of learning and building unshakable foundations. Challenges faced now will lead to significantly stronger outcomes in the coming years. Focus on self-improvement, disciplined effort, and trust the timing of the universe.`;

    const luckyColors = ['Red', 'Blue', 'Green', 'Yellow', 'White', 'Orange', 'Purple', 'Gold', 'Silver', 'Pink'];
    const luckyNumbers = [1, 2, 3, 5, 7, 8, 9, 11, 14, 22];
    const luckyDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const cI = ri % 10, cI2 = (ri + 3) % 10, nI = ri % 10, nI2 = (ri + 4) % 10, dI = ri % 7;

    return {
        name: name || 'Your', dob, nakshatra: NAKSHATRAS[ni], rashi: RASHIS[ri],
        rashiLord: RASHI_LORDS[ri], element: RASHI_ELEMENTS[ri], currentYear: yr,
        yearOverview, career, financial, relationship, health, careerSuits,
        lucky: { colors: [luckyColors[cI], luckyColors[cI2]], numbers: [luckyNumbers[nI], luckyNumbers[nI2]], day: luckyDays[dI] },
    };
}
