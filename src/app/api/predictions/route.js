import { NextResponse } from 'next/server';
import { generatePredictions } from '@/lib/predictions';

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, dob, tob, place } = body;

        if (!dob || !tob) {
            return NextResponse.json(
                { error: 'Please provide date of birth and time of birth.' },
                { status: 400 }
            );
        }

        const predictions = generatePredictions(dob, tob, name);

        return NextResponse.json({
            success: true,
            data: {
                ...predictions,
                place: place || '',
            },
        });
    } catch (error) {
        console.error('Prediction calculation error:', error);
        return NextResponse.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        );
    }
}
