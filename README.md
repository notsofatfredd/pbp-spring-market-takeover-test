# Pacific Business Park website v21

**ATLAS product code:** `ATL-26230`

This is the main Pacific Business Park website. It is separate from the marketplace project.

Version 21 contains the complete 23-store identity system for the live directory:

- approved raster and vector identities, with raster campaign artwork used wherever supplied or commissioned;
- 17 full campaign storefronts with a logo, ultra-wide banner, hero, brand colours and store highlights;
- a custom fresh-market treatment for The Farm Fruit & Veg using its existing identity;
- source-derived primary, accent and surface colours;
- business details, contact actions, and visible colour references;
- responsive desktop and mobile layouts, keyboard support and reduced-motion handling;
- a complete favicon/app-icon system and social sharing metadata;
- high-quality WebP campaign artwork plus network-aware look-ahead loading for upcoming rotations and likely store selections;
- a hardened Apache/cPanel configuration with HTTPS, CSP, security headers and asset caching.

Product listings and product renders are not part of this website pass.

Run `node v21-smoke-test.js` before packaging or deployment.

## cPanel release

The curated cPanel package contains only production files: `.htaccess`, the page shell, CSS and JavaScript, manifest, search metadata, local vendor script, campaign configuration, store data, fonts, optimized store artwork and the organized favicon set under `assets/favicon/`.

Upload the contents of the release folder directly into `public_html/`. Enable **Show Hidden Files** in cPanel File Manager so `.htaccess` is included. Use `755` for folders and `644` for files.

## Event campaign switch

The reusable temporary-event section is controlled in `assets/event-config.js` and is dormant until a verified campaign is supplied.

- Keep `enabled` set to `false` when no current event is verified; this removes the section and every “What’s On” navigation link.
- Set `startsAt` and `endsAt` to schedule when the section appears and disappears.
- Replace the artwork, copy, links, and five theme colours for the next campaign.

Past events remain in Git history and release tags, not as promoted public routes.
