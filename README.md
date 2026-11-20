# RoboTec

Company website of RoboTec (Abdulkader Haj Mahmoud, Ottweiler). Static, animated, dark/light themes, eight languages, no third-party requests. See `DESIGN.md`.

Website: https://abdulkader-hm.github.io/RoboTec/

Contact: [Robotec.app@gmail.com](mailto:Robotec.app@gmail.com)

## Develop

Requires Node.js 22 or newer. There are no npm dependencies and no PHP, database, or server requirements.

```sh
npm run build
npm run check
python3 -m http.server 8080 --directory dist
```

Edit `src/index.html` for page structure, `src/translations.json` for all texts (keys like `hero.title1`, one block per language), `src/legal/` for Impressum and Datenschutz, and `assets/` for styling (`css/site.css`), scripts (`js/site.js`), fonts, and images. Build output is generated in `dist/` and is not committed. English is the default; Arabic, German, Dutch, English, French, Italian, Russian, and Turkish have their own static routes.

## Contact form

The form opens a prepared message in the visitor's email application. The visitor reviews and sends it there. The website itself sends and stores no messages. A direct email link is shown as a fallback. Contact is email only. The postal address appears only in the Impressum and Datenschutz pages, as legally required.

Motion is reduced when the visitor requests it through their device settings.

## Publication

GitHub Pages uses the GitHub Actions source. Changes pushed to `main` build, validate, and publish automatically using `.github/workflows/pages.yml`. The repository contains only the static website source and assets, without the original Laravel history, environment files, user records, or database.

Original portfolio destinations and original descriptive content are retained; external project availability is independent of this site.

## Search indexing

Each language has its own title and description, crawlable HTML, canonical URL, reciprocal language alternatives, structured site/organization metadata, and share previews. The default English page and `/en/` use one canonical URL. `sitemap.xml` lists the eight canonical language pages.

After publication, verify the URL-prefix property `https://abdulkader-hm.github.io/RoboTec/` in Google Search Console using Google's supplied HTML tag or verification file. Submit `https://abdulkader-hm.github.io/RoboTec/sitemap.xml` and request indexing for the homepage. Verification requires the owner's Google account; it has not been configured automatically. The project-level `robots.txt` advertises the sitemap for reference; GitHub Pages controls the domain-root robots file.

Technical SEO does not guarantee indexing, timing, or a first-place ranking. Relevant project descriptions, updated work, useful content, and reputable links matter over time.

Fonts: Space Grotesk and Inter, both SIL Open Font License (see `assets/fonts/`).
