import { NextResponse } from 'next/server';
import { calculateGunaMilan, generateCompatibilityAnalysis, generateMarriageRisk, generateIdealPartner } from '@/lib/gunaMilan';

export async function POST(request) {
    try {
        const body = await request.json();

        const { bride, groom } = body;

        // Validate inputs
        if (!bride?.dob || !bride?.tob || !groom?.dob || !groom?.tob) {
            return NextResponse.json(
                { error: 'Please provide date of birth and time of birth for both bride and groom.' },
                { status: 400 }
            );
        }

        // Calculate Guna Milan
        const result = calculateGunaMilan(bride.dob, bride.tob, groom.dob, groom.tob);

        // Generate compatibility analysis
        const analysis = generateCompatibilityAnalysis(result);

        // Generate marriage risk analysis
        const marriageRisk = generateMarriageRisk(result);

        // Generate ideal partner suggestions for both
        const brideIdealPartner = generateIdealPartner(result.brideRashi, result.brideNakshatra);
        const groomIdealPartner = generateIdealPartner(result.groomRashi, result.groomNakshatra);

        return NextResponse.json({
            success: true,
            data: {
                bride: {
                    name: bride.name || 'Bride',
                    dob: bride.dob,
                    place: bride.place || '',
                    nakshatra: result.brideNakshatra,
                    rashi: result.brideRashi,
                },
                groom: {
                    name: groom.name || 'Groom',
                    dob: groom.dob,
                    place: groom.place || '',
                    nakshatra: result.groomNakshatra,
                    rashi: result.groomRashi,
                },
                score: {
                    total: result.totalScore,
                    max: result.maxScore,
                    percentage: analysis.percentage,
                    status: result.status,
                    statusColor: result.statusColor,
                    statusEmoji: result.statusEmoji,
                },
                kootas: Object.values(result.scores),
                analysis,
                marriageRisk,
                idealPartner: {
                    bride: brideIdealPartner,
                    groom: groomIdealPartner,
                },
            },
        });
    } catch (error) {
        console.error('Compatibility calculation error:', error);
        return NextResponse.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        );
    }
}
