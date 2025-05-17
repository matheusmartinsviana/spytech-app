import { Page } from 'puppeteer';

export const scrapePage = async (page: Page, baseUrl: string) => {
  const data = await page.evaluate((baseUrl) => {
    const getText = (selector: string) =>
      Array.from(document.querySelectorAll(selector)).map(el => el.textContent?.trim()).filter(Boolean) as string[];

    const getAttr = (selector: string, attr: string) =>
      Array.from(document.querySelectorAll(selector)).map(el => el.getAttribute(attr)).filter(Boolean) as string[];

    const links = getAttr('a', 'href')
      .map(link => {
        try {
          return new URL(link!, baseUrl).href;
        } catch {
          return null;
        }
      })
      .filter(link => link && link.startsWith(baseUrl)) as string[];

    const favicon = (document.querySelector('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"], link[rel="mask-icon"]') as HTMLLinkElement)?.href || '';

    return {
      pageTitle: document.title,
      metaDescription: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
      metaKeywords: document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '',
      h1: getText('h1'),
      h2: getText('h2'),
      h3: getText('h3'),
      strongs: getText('strong'),
      italics: getText('i, em'),
      paragraphs: getText('p'),
      links,
      imagesAlt: getAttr('img', 'alt'),
      faviconUrl: favicon || 'Favicon não encontrado',
    };
  }, baseUrl);

  const fullTextContent = await page.evaluate(() => document.body.innerText);

  return { data, fullTextContent };
};
