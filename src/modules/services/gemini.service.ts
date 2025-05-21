import { GoogleGenerativeAI } from '@google/generative-ai';
import { CompanyProfile } from '@/entities/company-profile';
import { generatePrompt } from '@/lib/prompt';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const analyzeWithGemini = async (title: string, content: string, companyProfile: CompanyProfile): Promise<string> => {
  if (!title || !content) {
    return 'Erro: Título ou conteúdo não fornecido.';
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const fullPrompt = generatePrompt({ title, content, companyProfile });

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return await response.text();
  } catch (error) {
    console.error('Erro com Gemini:', error);
    return 'Erro ao gerar análise com Gemini.';
  }
};
