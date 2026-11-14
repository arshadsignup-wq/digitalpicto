# SEO changelog

Work run against the seo-guru-turnaround standard, Mode B (direct implementation).
Every figure below is Verified by extraction from this repository unless marked otherwise.

## Root causes found

1. **The money pages targeted a market the business cannot evidence.** All 13 service
   pages declared `areaServed: "UAE"` and carried Dubai and UAE keyword copy, while all
   17 case studies are USA, North America, International or Bangladesh, both testimonials
   are US and Australia, and the contact form prices in USD. The pages that must rank
   were pointed at queries with no supporting proof, no address and no local signals.
2. **The case studies hub contradicted itself.** It rendered 12 cards while its ItemList
   schema declared 17 URLs and the copy said "17 campaigns". Five case studies had zero
   inbound links from any page body.
3. **Thin internal linking.** 39 of 62 blog posts linked to no service page. Five service
   pages had exactly one inbound body link.
4. **Shallow entity and authorship signals.** `sameAs` listed one URL; all 62 posts
   declared the Organization as author with no traceable byline.

## Changes made

### Targeting (owner decision: United States / North America)
- `areaServed` on all 13 service pages: UAE replaced with United States and Canada.
- Organization `areaServed` on the homepage and About: now United States, Canada,
  Australia and Bangladesh, the four markets with evidence on the site. UAE and Singapore
  removed because nothing on the site evidences them.
- Service descriptions and meta keywords: UAE phrasing replaced with US framing.
- `services/seo` local examples moved from Dubai to US equivalents, in both the visible
  FAQ text and the FAQPage schema so the two still match.
- Four blog posts rewritten off Dubai, Abu Dhabi, Sharjah and JLT examples onto US ones.

### Structure and schema
- Added the two missing hub sections, Automation and AI (4) and Email Design (1), so all
  17 case studies are linked and the ItemList schema now matches visible content.
- `services.html`: added an ItemList covering the 13 services shown on the page.
- `privacy` and `terms`: added WebPage and BreadcrumbList schema, previously none.
- Homepage Organization given a stable `@id`; blog BlogPosting author now references it.

### On-page
- Six case study titles reduced to under 60 characters.
- Fifteen meta descriptions reduced to under 155 characters. Three of them had previously
  been truncated mid-sentence and now read as complete sentences.
- En dashes removed from the two case studies that carried them.

### Internal linking
- One contextual service link added to each of 39 blog posts, with descriptive anchors
  and wording varied by service. Inbound body links to service pages moved from a range
  of 1 to 11 up to 3 to 17. Blog posts with no service link: 39 to 0.

### Technical
- `robots.txt`: `Disallow: /search.html` corrected to `Disallow: /search`. The rule had
  stopped matching when URLs went extensionless, leaving the search page crawlable.

### Contact form
- Added an optional Website field. Blank passes, a bare domain is normalised to https://,
  and an invalid entry is rejected with an inline message.

## Verified after the work
0 broken internal references, 0 links ending .html, 258 JSON-LD blocks all valid,
0 titles over 60, 0 metas over 155, 0 pages with more than one H1, 0 em or en dashes on
published pages, 0 nesting errors, 0 FAQ entries missing from visible content,
0 residual UAE targeting, 0 images without alt, sitemap 100 unique URLs all backed by a page.

## Still needs a human

1. **Confirm the UAE decision.** If the business does serve UAE clients, removing that
   targeting is a factual regression, not just a repositioning. Reverting is simple.
2. **Existing rankings are unverified.** `site:` queries returned unrelated results and
   live fetches to the www host timed out from the build environment, so current
   indexation and rankings could not be observed. If the site holds any UAE rankings
   today, this change puts them at risk. Confirm coverage in Google Search Console.
3. **`sameAs` has one entry.** Supply the real LinkedIn, Facebook, Instagram or X profile
   URLs and they can be added to the Organization schema. They should not be invented.
4. **Per-post authorship.** Posts are attributed to the Organization. Naming a founder as
   the author of each post would be a stronger E-E-A-T signal, but requires confirmation
   of who actually wrote what.
5. **www versus apex.** Canonicals say `digitalpicto.online`, which 307-redirects to
   `www.digitalpicto.online`. Pick one as primary in the Vercel dashboard so the canonical
   names the URL that actually serves.
6. **GA4 measurement ID.** `js/analytics.js` is live but inert until an ID is supplied.
   No analytics are being collected.
