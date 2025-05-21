import { is_dev } from "@/utils/constants";
import puppeteer from "puppeteer";

const BLOCKED_DOMAINS = [
  "youtube.com",
  "facebook.com",
  "instagram.com",
  "twitter.com",
  "linkedin.com",
  "pinterest.com",
  "tiktok.com",
  "bing.com",
  "microsoft.com",
];

export const getTopSearchResults = async (query: string): Promise<string[]> => {
  console.log(`🔍 Buscando concorrentes no Bing para: "${query}"`);

  const browser = is_dev
    ? await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      })
    : await puppeteer.connect({
        browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`,
      });

  const page = await browser.newPage();

  try {
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    );

    const allUrls: string[] = [];

    for (let i = 0; i < 3; i++) {
      const start = i * 10 + 1; // Bing paginates 10 results per page
      const searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}&first=${start}&setlang=pt-br`;

      await page.goto(searchUrl, { waitUntil: "networkidle2" });
      await new Promise((res) => setTimeout(res, 1500));

      const rawUrls = await page.evaluate(() => {
        const urls: string[] = [];
        const resultItems = document.querySelectorAll("#b_results > li.b_algo");

        resultItems.forEach((item) => {
          const link = item.querySelector("h2 a") as HTMLAnchorElement | null;
          if (link?.href?.startsWith("http")) {
            urls.push(link.href);
          }
        });

        return urls;
      });

      allUrls.push(...rawUrls);
    }

    const filteredUrls = allUrls.filter((url) => {
      try {
        const domain = new URL(url).hostname.replace(/^www\./, "");
        return !BLOCKED_DOMAINS.some((blocked) => domain.includes(blocked));
      } catch {
        return false;
      }
    });

    const domainFrequency: Record<string, { count: number; url: string }> = {};

    filteredUrls.forEach((url) => {
      try {
        const domain = new URL(url).hostname.replace(/^www\./, "");
        if (!domainFrequency[domain]) {
          domainFrequency[domain] = { count: 1, url };
        } else {
          domainFrequency[domain].count += 1;
        }
        console.log(`URL: ${url}, Domain: ${domain}, Count: ${domainFrequency[domain].count}`);
      } catch {}
    });

    const sorted = Object.entries(domainFrequency)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 3)
      .map(([, data]) => data.url);
    console.log("🔍 URLs encontradas:", sorted);

    return sorted;
  } catch (error) {
    console.error("❌ Erro durante scraping com Bing:", error);
    return [];
  } finally {
    await browser.close();
  }
};
