import { getAllAnalysesByUserId } from "@/actions/analysis";
import { getUserByEmail } from "@/actions/user";
import { getCurrentUserEmail } from "@/lib/get-current-email";
import { NextResponse } from "next/server";

export async function GET() {
    const userEmail = await getCurrentUserEmail();
    if (!userEmail) {
        return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const user = await getUserByEmail(userEmail);
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const results = await getAllAnalysesByUserId(user.id);
    if (!results || !('analyses' in results)) {
        return NextResponse.json({ error: "No analyses found" }, { status: 404 });
    }

    const recentAnalyses = 'analyses' in results ? results.analyses.slice(0, 20) : [];
    return NextResponse.json(recentAnalyses);
}
