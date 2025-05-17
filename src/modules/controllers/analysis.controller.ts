import puppeteer from 'puppeteer';
import { scrapePage } from '@/lib/puppeteerUtils';
import { analyzeWithGemini } from '@/lib/gemini.service';
import { CompanyProfile } from '@/entities/company-profile';
import { deleteAnalysisById } from '@/actions/analysis';

export const analyzeKeywords = async (urls: string[], companyProfile: CompanyProfile) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const insights = [];

  for (const url of urls) {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));

    const result = await scrapePage(page, url);

    if (!result) {
      console.error(`Erro ao analisar a URL: ${url}`);
      await page.close();
      continue;
    }

    if (!result.data || !result.data.pageTitle || !result.fullTextContent) {
      console.error(`Dados insuficientes para a URL: ${url}`);
      await page.close();
      continue;
    }

    const insight = await analyzeWithGemini(result.data.pageTitle, result.fullTextContent, companyProfile);
    await page.close();

    insights.push({
      url,
      mainPage: {
        data: result.data,
        insight,
      },
    });
  }

  await browser.close();
  return { results: insights };
};


export const deleteAnalysis = async (id: string) => {
  const message = await deleteAnalysisById(id);
  return { message: message };
};
