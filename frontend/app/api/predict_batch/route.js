import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const response = await fetch('http://127.0.0.1:8000/predict_batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            // Logs specific validation errors from Python terminal
            console.error("FastAPI Error:", data);
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Next.js Route Failure:", error);
        return NextResponse.json({ error: 'Failed to connect to AI server' }, { status: 500 });
    }
}