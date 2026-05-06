export async function POST(request) {
    try {
        const body = await request.json();
        const FASTAPI_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

        const res = await fetch(`${FASTAPI_URL}/predict`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            return new Response(
                JSON.stringify({ error: errorData.detail || "FastAPI request failed" }),
                { status: res.status }
            );
        }

        const data = await res.json();
        return new Response(JSON.stringify(data), { status: 200 });

    } catch (error) {
        return new Response(
            JSON.stringify({ error: "Service Unavailable" }),
            { status: 503 }
        );
    }
}
