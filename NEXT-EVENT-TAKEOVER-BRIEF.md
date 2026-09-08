# PBP Event Takeover — Locked Brief

Status: **Approved direction for the next event poster**  
Project: Pacific Business Park  
Purpose: Build each event takeover correctly in the first review round.

## Core direction

When an event is active, Pacific Business Park's website must visibly become that event from the header to the footer. The active event poster and the social manager's published event post are the only sources for the campaign's visual language and event information.

Every new event replaces the previous event theme completely. Do not reuse colours, gradients, decorative shapes, typography treatments, wording, or atmosphere from an older event unless they also appear in the new poster.

The takeover must feel designed from the new poster rather than placed around it.

## What the event takes over

Apply the active event's art direction to:

- Site header and navigation frame
- Homepage hero and hero artwork
- Event title, description, date, time, admission, and actions
- Announcement ticker and ticker wording
- General page backgrounds and transitions between sections
- Section headings, generic buttons, borders, accents, and decorative elements
- Generic directory controls and directory-group panels
- Social section
- Visit and directions section
- Events section
- Mobile quick-action dock
- Footer

Use recognisable details from the poster throughout the page: its palette, shapes, patterns, illustration fragments, type treatment, borders, textures, and spacing character. These details should continue below the hero so the takeover does not fade back into the ordinary PBP design.

## What must remain untouched

Individual shops and vendors keep their own identity.

Do not recolour or redesign:

- Store and vendor logos
- Store-card backgrounds or brand palettes
- Store artwork and photography
- Store-specific typography or presentation
- Store descriptions, details, buttons, or contact information unless the event post explicitly changes trading information
- Store detail dialogs

The event theme frames the businesses. It does not repaint them.

## Events section

Keep the Events section in its established position on the page. It remains the complete information area for the event and must contain:

- Event artwork
- Event name
- Date and time
- Admission information
- Short description
- Important event or centre note
- Directions link
- Original social-post link

The rest of the website should lead naturally into and out of this section using the same event art direction.

## Source material required

Before building, collect:

- Final approved event poster in the highest available quality
- Mobile-friendly poster or crop when available
- Original social-manager post and link
- Exact event name
- Start date and time
- End date and time
- Admission or ticket information
- Venue details
- Event description
- Special centre or store trading note
- Directions link
- Confirmed event palette and any supplied fonts

Do not invent missing event facts. Flag missing information before final review while continuing with the visual work that can be completed.

## Reusable event record

Each event should be controlled from one event record containing:

- `enabled`
- `startsAt`
- `endsAt`
- `eventAt`
- `title`
- `description`
- `date`
- `time`
- `admission`
- `note`
- `artwork`
- `mobileArtwork`
- `instagramUrl`
- `directionsUrl`
- Event theme colours
- Full-site takeover wording

Changing this record and replacing the poster assets must reskin the complete event shell. Old event values must not remain elsewhere in HTML, CSS, or JavaScript.

## Campaign lifecycle

The finished production system must support three states:

1. **Before the campaign:** show the normal PBP site unless an approved pre-event start time has arrived.
2. **During the campaign:** activate the complete event takeover automatically.
3. **After the campaign:** remove the expired event theme automatically and return to the normal PBP site, or activate the next scheduled event when its campaign begins.

Only one event theme may control the site at a time. A newer active event replaces the older event completely.

## Responsive direction

Desktop and mobile may adapt the event artwork differently, but the established PBP mobile structure must remain familiar.

- Desktop may use the poster scene as a wide environment with event copy beside it.
- Mobile must use a deliberate crop or supplied mobile artwork.
- Preserve the original mobile header, navigation, quick-action dock, section order, directory flow, and control positions.
- Place the event artwork, palette, and copy into the existing mobile rhythm instead of replacing it with a new poster-style page structure.
- Keep the mobile dock labels short and familiar: Directory, Events, Map, and WhatsApp.
- Event titles must never clip, overflow, or break into accidental single letters.
- Dates, times, admission, and primary actions must be visible without fighting the mobile dock.
- The Events section and store directory must remain usable at every supported width.

## Performance rules

- Optimise poster assets to WebP or AVIF where practical.
- Provide explicit image dimensions.
- Use a separate mobile asset when it materially reduces weight or improves the crop.
- Reuse the active event artwork rather than shipping repeated copies.
- Lazy-load below-the-fold event artwork.
- Preserve the existing lightweight store data and card system.
- Do not duplicate store assets for an event takeover.

## First-review acceptance checklist

Do not present the event build for review until all of these are true:

- The new poster is the sole source of event colours and visual motifs.
- No visual treatment from the previous event remains.
- The event identity continues from the hero through the footer.
- The Events section remains in its established position.
- Individual store and vendor branding is unchanged.
- Generic directory-group panels follow the event theme.
- Desktop and mobile compositions have been visually checked.
- The event title does not clip or wrap incorrectly.
- Event facts and links match the approved social post.
- Event artwork and critical assets load successfully.
- The normal site state remains available.
- The production timer and event transition are tested before launch.
- No live deployment occurs until the event version has been approved.

## Reference implementation

The Spring Market GitHub Pages test is the structural reference for the reusable takeover shell. Its Spring Market colours and artwork are examples only. They must be fully replaced for the next event.

Reference: https://notsofatfredd.github.io/pbp-spring-market-takeover-test/
