# Pacific Business Park: September 2026 release

The source repository is `notsofatfredd/pacificbusinesspark-live`, branch `main`.

GitHub Pages cannot be enabled on this private repository under the current account plan. The same static release is therefore published through the existing public Pages repository, `notsofatfredd/pbp-spring-market-takeover-test`, branch `main`. The repository name is historical; the source repository remains private.

Public routes:

- Park home: `https://notsofatfredd.github.io/pbp-spring-market-takeover-test/`
- Pacific Roadhouse: `https://notsofatfredd.github.io/pbp-spring-market-takeover-test/roadhouse/`
- Centre updates: `https://notsofatfredd.github.io/pbp-spring-market-takeover-test/#social`

Roadhouse is built from the supplied `PACIFIC_ROADHOUSE_PROJECT_STARTER.zip` and now opens inside the parent park experience. The reusable scheduled-event system remains dormant until a current event is verified. Navigation and assets use relative paths so the same files work on the park's domain and on GitHub Pages.

Run `python verify-static.py` before publishing. Serve this directory using an HTTP server to preview all routes locally. Push the canonical source to `pacificbusinesspark-live/main`, then copy the static release into the public Pages repository and push its `main` branch. GitHub Pages deploys automatically. `.nojekyll` prevents unwanted Jekyll processing.

The `.htaccess` file is used only by Apache/cPanel; GitHub Pages does not apply Apache rules.
