import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/predict_batch`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
                cache: "no-store",
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("FastAPI Error:", data);
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error("Next.js Route Failure:", error);
        return NextResponse.json(
            { error: "Failed to connect to AI server" },
            { status: 500 }
        );
    }
}