import puppeteer from 'puppeteer';

export const getTopSearchResults = async (query: string): Promise<string[]> => {
  console.log(`🔍 Buscando no Bing: "${query}"`);
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  try {
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
    );

    const searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}&setlang=pt-br`;
    await page.goto(searchUrl, { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 2000));

    const urls = await page.evaluate(() => {
      const results = new Set<string>();
      const links = document.querySelectorAll('li.b_algo h2 a');

      links.forEach(link => {
        try {
          const href = (link as HTMLAnchorElement).href;
          if (href && href.startsWith('http')) {
            const url = new URL(href);
            results.add(url.origin);
          }
        } catch {}
      });

      return Array.from(results).slice(0, 3);
    });

    return urls;
  } catch (error) {
    console.error('❌ Erro durante scraping com Bing:', error);
    return [];
  } finally {
    await browser.close();
  }
};
