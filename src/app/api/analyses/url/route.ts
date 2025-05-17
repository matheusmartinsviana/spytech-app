import { getLatestAnalysisByUrl } from "@/actions/analysis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    const email = searchParams.get("email");
    
  if (!email) {
    return NextResponse.json({ error: "Email não fornecido." }, { status: 400 });
  }

  if (!url) {
    return NextResponse.json({ error: "URL não fornecida." }, { status: 400 });
  }

  const analisys = await getLatestAnalysisByUrl(url, email);

  if (!analisys) {
    return NextResponse.json(
      { error: "Análise não encontrada." },
      { status: 404 },
    );
  }

  return NextResponse.json({ id: analisys.id }, { status: 200 });
}
