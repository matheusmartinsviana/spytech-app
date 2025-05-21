import puppeteer from "puppeteer";
import { scrapePage } from "@/lib/puppeteerUtils";
import { analyzeWithGemini } from "./gemini.service";
import { is_dev } from "@/utils/constants";

const getInternalLinks = (baseUrl: string, allLinks: string[]) => {
  const base = new URL(baseUrl);
  return Array.from(new Set(
    allLinks.map(link => {
      try {
        const url = new URL(link, base);
        if (url.hostname === base.hostname && url.origin === base.origin) {
          return url.href;
        }
        return null;
      } catch {
        return null;
      }
    }).filter(Boolean)
  ));
};

export const analyzeRoutesService = async (
  baseUrl: string,
  companyProfile: any,
) => {

  const browser = is_dev
    ? await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })
    : await puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`,
    });

  const mainPage = await browser.newPage();
  await mainPage.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 60000 });

  const mainResult = await scrapePage(mainPage, baseUrl);
  const internalLinks = getInternalLinks(baseUrl, mainResult.data.links);

  const results = [];

  const mainInsight = await analyzeWithGemini(
    mainResult.data.pageTitle,
    mainResult.fullTextContent,
    companyProfile,
  );

  results.push({
    url: baseUrl,
    route: '/',
    data: mainResult.data,
    insight: mainInsight,
  });

  for (const route of internalLinks) {
    if (!route) continue;
    try {
      const subPage = await browser.newPage();
      await subPage.goto(route, { waitUntil: "domcontentloaded", timeout: 60000 });

      const subResult = await scrapePage(subPage, route);

      if (!subResult.data.pageTitle || !subResult.fullTextContent) {
        await subPage.close();
        continue;
      }

      const insight = await analyzeWithGemini(
        subResult.data.pageTitle,
        subResult.fullTextContent,
        companyProfile,
      );

      results.push({
        url: route,
        route: new URL(route).pathname,
        data: subResult.data,
        insight,
      });

      await subPage.close();
    } catch (err) {
      console.warn(`Erro ao acessar rota: ${route}`, err);
    }
  }

  await browser.close();
  return results;
};
