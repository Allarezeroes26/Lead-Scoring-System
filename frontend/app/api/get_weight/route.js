import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch('http://127.0.0.1:8000/weights', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Backend unreachable' }, { status: 500 });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}