import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/weights`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                cache: "no-store",
            }
        );

        if (!response.ok) {
            return NextResponse.json(
                { error: "Backend unreachable" },
                { status: 500 }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        return NextResponse.json(
            { error: error?.message || "Unknown error" },
            { status: 500 }
        );
    }
}