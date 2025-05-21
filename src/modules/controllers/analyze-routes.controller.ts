import { analyzeRoutesService } from "../services/analyze-routes.service";

export const analyzeRoutesController = async (body: any) => {
  
  const { baseUrl, companyProfile } = body;

  if (!baseUrl || typeof baseUrl !== 'string') {
    return { status: 400, body: { error: 'URL base inválida.' } };
  }

  if (!companyProfile) {
    return { status: 400, body: { error: 'Perfil da empresa não fornecido.' } };
  }

  try {
    const results = await analyzeRoutesService(baseUrl, companyProfile);
    return { status: 200, body: { results } };
  } catch (err) {
    console.error('Erro na análise de rotas:', err);
    return { status: 500, body: { error: 'Erro interno ao processar subdomínios.' } };
  }
};
