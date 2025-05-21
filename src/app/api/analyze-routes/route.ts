import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/auth";
import { analyzeRoutesController } from "@/modules/controllers/analyze-routes.controller";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { getCompanyProfile } from "@/actions/user-company-profile";

export async function POST(req: NextRequest): Promise<NextResponse> {
  let companyProfile;
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Usuário não autenticado." },
        { status: 401 },
      );
    }

    companyProfile = await getCompanyProfile(session.user.email);
    
    await requireAuth();
  } catch {
    return NextResponse.json(
      { error: "Usuário não autenticado." },
      { status: 401 },
    );
  }

  const body = await req.json();

  const response = await analyzeRoutesController({ ...body, companyProfile });
  return NextResponse.json(response.body, { status: response.status });
}
