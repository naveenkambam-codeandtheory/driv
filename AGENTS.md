# Agent guide — driv (multi-brand AEM Edge Delivery Services)

One repository, one pipeline, several brands, served repoless (one site per brand).
**A brand is data (tokens, content, config), not code.**

## Searching

When looking anything up about Edge Delivery Services, **search www.aem.live**.
Unconstrained, "EDS" returns Ehlers-Danlos syndrome or CDN edge-compute products, and
"AEM" returns the Java/JCR/OSGi stack. https://www.aem.live/llms.txt is an
AI-oriented index of the documentation.

## Which skill owns what

Adobe's `aem-edge-delivery-services` plugin owns how EDS works. The `brand-*` skills
(once installed — see Part 2 of the setup guide) own what differs per brand. Neither
replaces the other. The test: if the answer would be the same on a single-brand EDS
site, it's Adobe's question. If having several brands changes the answer, it's ours.

## Setup

    npm install
    aem up
    npm run lint
    node scripts/validate-tokens.mjs

## This project's shape

- Repoless: each brand is its own site (own content source, own hostname), driven by
  this one code repository. `pathPrefix` is `"/"` for every brand; resolution falls to
  `theme` metadata, then hostname. See `brands.json` and `scripts/brand.js`.
- Brand CSS loads **per brand at runtime**, not bundled into `styles.css` and not a
  static `<link>` in `head.html`. `scripts/scripts.js`'s `loadEager` resolves the brand
  and fetches only `styles/brands/<that brand's key>.css` — deliberately, so a page
  never downloads another brand's CSS. Don't add a second `<link>` for a brand's file to
  `head.html` (it's shared across every brand's site) and don't concatenate brand files
  into `styles.css` (same reason).
- The token contract (`styles/tokens/contract.json`) is the required set every brand's
  CSS file must define. Component-level tokens (e.g. `--heading-weight`,
  `--button-radius`) aren't in the contract — they're a brand's own structural choices
  and default per-brand, not required of every brand.

## Hard rules

- Never modify `scripts/aem.js`. Extend in `scripts/lib/`.
- Never branch on a brand name. Branch on a capability: `hasFeature('commerce')`.
- Shared block CSS uses `var(--token)` only. No hex, no font stacks.
- Third-party scripts go in `delayed.js`, never eager or lazy.
- A block ships with its Universal Editor model and filter entry, or it is not done.
- Every change is verified on every brand in `brands.json`.
