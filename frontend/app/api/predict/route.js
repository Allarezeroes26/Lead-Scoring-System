import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const FASTAPI_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

        // 1. DATA TRANSFORMATION (Crucial for Pydantic/FastAPI)
        const formattedData = {
            ...body,
            age: parseInt(body.age),
            balance: parseFloat(body.balance),
            day: parseInt(body.day),
            duration: parseInt(body.duration),
            campaign: parseInt(body.campaign),
            pdays: parseInt(body.pdays) || -1,
            previous: parseInt(body.previous) || 0,
            // Convert "yes"/"no" strings to Booleans
            default: body.default === "yes",
            housing: body.housing === "yes",
            loan: body.loan === "yes",
        };

        // 2. FORWARD TO FASTAPI
        const res = await fetch(`${FASTAPI_URL}/predict`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formattedData),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            return NextResponse.json(
                { error: errorData.detail || "FastAPI request failed" },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("Predict Route Error:", error);
        return NextResponse.json(
            { error: "Service Unavailable" },
            { status: 503 }
        );
    }
}