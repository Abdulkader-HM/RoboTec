import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
const translations = JSON.parse(await readFile(path.join(root, 'src/translations.json'), 'utf8'));
const locales = ['', ...Object.keys(translations)];
for (const locale of locales) {
  const file = path.join(dist, locale, 'index.html');
  const html = await readFile(file, 'utf8');
  assert.match(html, /<title>RoboTec \| [^<]+<\/title>/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /<meta name="description" content="[^\"]{40,}">/);
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert.equal(graph['@graph'][0].email, 'Robotec.app@gmail.com');
  assert.equal(graph['@graph'][2].inLanguage, locale || 'en');
  assert.equal((html.match(/rel="alternate" hreflang=/g) || []).length, 9);
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)[1];
  assert.equal(canonical, 'https://abdulkader-hm.github.io/RoboTec/' + (locale && locale !== 'en' ? locale + '/' : ''));
  const nav = html.match(/<ul class="main-nav"[^>]*>([\s\S]*?)<\/ul>/)[1];
  const navItems = [...nav.matchAll(/<li\b/g)];
  assert.equal(navItems.length, 7);
  assert.match(nav, /<li class="small-logo">/);
  assert.equal((nav.split('<li class="small-logo">')[0].match(/<li\b/g) || []).length, 3);
  assert.match(html, new RegExp(`<html lang="${locale || 'en'}" dir="${locale === 'ar' ? 'rtl' : 'ltr'}">`));
  assert.equal((html.match(/<body>/g) || []).length, 1);
  assert.equal((html.match(/<\/body>/g) || []).length, 1);
  assert.doesNotMatch(html, /\{\{|@csrf|<\?php|route\(|Abdulkader\.haj\.mahmoud@gmail\.com|>\s*RoboTech\s*</);
  assert.doesNotMatch(html, /href=["'][^"']*(?:login|register|logout)/);
  assert.doesNotMatch(html, /tel:|wa\.me|facebook\.com\/messages|linkedin\.com|\+?49\d{8,}/);
  assert.equal((html.match(/class="portfolio-card"/g) || []).length, 13);
  assert.equal((html.match(/data-filter=/g) || []).length, 4);
  assert.match(html, /mailto:Robotec\.app@gmail\.com/);
  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `Duplicate IDs: ${locale}`);
  for (const [, attr, ref] of html.matchAll(/\b(src|href)=["']([^"']+)["']/g)) {
    if (ref.startsWith('#')) {
      if (ref.length > 1) assert.ok(ids.includes(ref.slice(1)), `Missing anchor: ${ref}`);
      continue;
    }
    if (/^(?:[a-z]+:|\/\/)/i.test(ref) || !ref) continue;
    let target = path.resolve(path.dirname(file), ref.split(/[?#]/)[0]);
    if (ref.endsWith('/')) target = path.join(target, 'index.html');
    assert.ok(target.startsWith(dist + path.sep), `Reference escapes output: ${ref}`);
    assert.ok((await stat(target)).isFile(), `Missing ${attr}: ${ref}`);
  }
  for (const lang of Object.keys(translations)) {
    assert.match(html, new RegExp(`<option value="(?:\.\./|\./)${lang}/"`));
  }
  assert.match(html, /value="(?:\.\.\/|\.\/)it\/">Italian|value="(?:\.\.\/|\.\/)it\/"(?: selected)?>/);
}
const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8');
assert.equal((sitemap.match(/<loc>/g) || []).length, 8);
assert.doesNotMatch(sitemap, /RoboTec\/en\//);
for (const name of await readdir(path.join(dist, 'css'))) {
  const file = path.join(dist, 'css', name);
  const css = (await readFile(file, 'utf8')).replace(/\/\*[\s\S]*?\*\//g, '');
  for (const [, raw] of css.matchAll(/url\(["']?([^)'"\s]+)["']?\)/g)) {
    if (/^(?:data:|https?:)/.test(raw)) continue;
    const target = path.resolve(path.dirname(file), raw.split(/[?#]/)[0]);
    assert.ok((await stat(target)).isFile(), `Missing CSS asset: ${raw}`);
  }
}

// Exercise the shipped contact handler without opening an email application.
const source = await readFile(path.join(root, 'assets/js/site.js'), 'utf8');
let submit;
let valid = true;
const status = { textContent: '', getAttribute: () => 'Draft requested; not sent.' };
const form = {
  elements: { name: { value: 'محمود & Co' }, email: { value: 'visitor@example.com' }, message: { value: 'Hello & مرحباً\nSecond line' } },
  reportValidity: () => valid,
  addEventListener: (event, handler) => { if (event === 'submit') submit = handler; }
};
const context = {
  window: { matchMedia: () => ({ matches: true }), location: { href: '' } },
  document: { querySelector: () => null, querySelectorAll: () => [], getElementById: id => id === 'contact-form' ? form : status }
};
vm.runInNewContext(source, context);
submit({ preventDefault() {} });
const draft = new URL(context.window.location.href);
assert.equal(draft.protocol, 'mailto:');
assert.equal(draft.pathname, 'Robotec.app@gmail.com');
assert.equal(draft.searchParams.get('subject'), 'RoboTec — محمود & Co');
assert.equal(draft.searchParams.get('body'), 'Name: محمود & Co\r\nEmail: visitor@example.com\r\n\r\nHello & مرحباً\nSecond line');
assert.equal(status.textContent, 'Draft requested; not sent.');
assert.equal(form.elements.message.value, 'Hello & مرحباً\nSecond line');
valid = false;
context.window.location.href = '';
submit({ preventDefault() {} });
assert.equal(context.window.location.href, '');
console.log(`Verified ${locales.length} pages, assets, language links, anchors, branding, and email-draft behavior.`);
