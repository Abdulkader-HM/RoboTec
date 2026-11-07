import { readFile, writeFile, mkdir, rm, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist');
const template = await readFile(path.join(root, 'src/index.html'), 'utf8');
const translations = JSON.parse(await readFile(path.join(root, 'src/translations.json'), 'utf8'));
const metadata = JSON.parse(await readFile(path.join(root, 'src/seo.json'), 'utf8'));
const origin = 'https://abdulkader-hm.github.io/RoboTec/';
const languages = Object.keys(translations);
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(path.join(root, 'assets'), output, { recursive: true });

for (const locale of ['', ...languages]) {
  const lang = locale || 'en';
  const prefix = locale ? '../' : './';
  const dictionary = translations[lang];
  const localizedUrl = code => code === 'en' ? origin : `${origin}${code}/`;
  const canonical = localizedUrl(lang);
  const page = metadata[lang];
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': `${origin}#organization`, name: 'RoboTec', url: origin, logo: `${origin}img/logo.png`, email: 'Robotec.app@gmail.com' },
      { '@type': 'WebSite', '@id': `${origin}#website`, name: 'RoboTec', url: origin, inLanguage: languages, publisher: { '@id': `${origin}#organization` } },
      { '@type': 'WebPage', '@id': `${canonical}#webpage`, name: page.title, description: page.description, url: canonical, inLanguage: lang, isPartOf: { '@id': `${origin}#website` } }
    ]
  };
  const seo = `<link rel="canonical" href="${canonical}">\n` + languages.map(code => `<link rel="alternate" hreflang="${code}" href="${localizedUrl(code)}">`).join('\n') + `
    <link rel="alternate" hreflang="x-default" href="${origin}">
    <meta name="robots" content="index,follow">
    <meta name="theme-color" content="#22f603">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="RoboTec">
    <meta property="og:title" content="${escape(page.title)}">
    <meta property="og:description" content="${escape(page.description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${origin}img/laptop-robotec.png">
    <meta property="og:image:alt" content="RoboTec">
    <meta name="twitter:card" content="summary_large_image">
    <script type="application/ld+json">${JSON.stringify(graph).replaceAll('<', '\\u003c')}</script>`;
  let html = template.replace(/\{\{t:([\s\S]*?)\}\}/g, (_, key) => escape(dictionary[key] ?? translations.en[key] ?? key));
  html = html.replaceAll('{{lang}}', lang).replaceAll('{{dir}}', lang === 'ar' ? 'rtl' : 'ltr').replaceAll('{{seo}}', seo);
  html = html.replaceAll('{{pageTitle}}', escape(page.title)).replaceAll('{{pageDescription}}', escape(page.description));
  html = html.replace(/\{\{url:([a-z]+)\}\}/g, (_, code) => {
    if (!languages.includes(code)) throw new Error(`Unsupported language: ${code}`);
    return `${prefix}${code}/`;
  });
  html = html.replace(/\b(src|href)=(['"])((?:img|css|js)\/[^'"]+)\2/g, (_, attr, quote, value) => `${attr}=${quote}${prefix}${value}${quote}`);
  html = html.replace(/<option value="[^"]+">([^<]+)\s*<\/option>/g, (option, label) => option.includes(`value="${prefix}${lang}/"`) ? option.replace('>', ' selected>') : option);
  if (/\{\{|@csrf|<\?php/.test(html)) throw new Error(`Unresolved template syntax: ${lang}`);
  const directory = path.join(output, locale);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, 'index.html'), html);
}
await writeFile(path.join(output, '.nojekyll'), '');
await writeFile(path.join(output, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${origin}sitemap.xml\n`);
await writeFile(path.join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['', ...languages.filter(code => code !== 'en').map(code => code + '/')].map(route => `<url><loc>${origin}${route}</loc></url>`).join('')}</urlset>\n`);
await writeFile(path.join(output, '404.html'), `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>RoboTec — Page not found</title><body style="font-family:sans-serif;text-align:center;padding:15vh 20px;background:#111;color:white"><h1>RoboTec</h1><p>Page not found.</p><a style="color:#7cc576" href="${origin}">Return to RoboTec</a></body></html>`);
console.log(`Built ${languages.length + 1} pages without PHP or third-party build dependencies.`);
