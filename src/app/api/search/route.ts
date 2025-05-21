import { NextRequest, NextResponse } from 'next/server';
import { getTopSearchResults } from '@/modules/services/google-search.service';
import { requireAuth } from '@/lib/auth/auth';

export async function GET(req: NextRequest) {
  
  try {
    await requireAuth();
  } catch (error) {
    return NextResponse.json({ error: 'Usuário não autenticado.' }, { status: 401 });
  }
  
  const { searchParams } = new URL(req.url);
  const keywords = searchParams.get('keywords');

  if (!keywords) {
    return NextResponse.json({ error: 'Palavras-chave são obrigatórias.' }, { status: 400 });
  }

  try {
    const urls = await getTopSearchResults(keywords);
    console.log('🔍 URLs encontradas:', urls);
    return NextResponse.json({ keywords, urls });
  } catch (err) {
    console.error('Erro:', err);
    return NextResponse.json({ error: 'Erro ao buscar as URLs.' }, { status: 500 });
  }
}
