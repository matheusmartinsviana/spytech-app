import { requireAuth } from '@/lib/auth/auth';
import { analyzeKeywords, deleteAnalysis} from '@/modules/controllers/analysis.controller';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  
  try {
      await requireAuth();
    } catch (error) {
      return NextResponse.json({ error: 'Usuário não autenticado.' }, { status: 401 });
    }

  const body = await req.json();

  if (!body.urls || !Array.isArray(body.urls) || body.urls.length === 0) {
    return NextResponse.json({ error: 'Nenhuma URL fornecida para análise.' }, { status: 400 });
  }

  if (!body.companyProfile) {
    return NextResponse.json({ error: 'Perfil da empresa não fornecido.' }, { status: 400 });
  }

  try {
    const result = await analyzeKeywords(body.urls, body.companyProfile);
    return NextResponse.json(result);
  } catch (err) {
    console.error('Erro:', err);
    return NextResponse.json({ error: 'Erro ao processar a análise.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  
  const body = await req.json();
  const { id } = body;
  try {
    await requireAuth(); 
  } catch (error) {
    return NextResponse.json({ error: 'Usuário não autenticado.' }, { status: 401 });
  }

  if (!id) {
    return NextResponse.json({ error: 'ID da análise não fornecido.' }, { status: 400 });
  }

  try {
    await deleteAnalysis(id);
    return NextResponse.json({ message: 'Análise excluída com sucesso.' });
  } catch (err) {
    console.error('Erro ao excluir análise:', err);
    return NextResponse.json({ error: 'Erro ao excluir análise.' }, { status: 500 });
  }
}
