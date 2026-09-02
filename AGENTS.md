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

## Checking what a brand still needs

Onboarding a brand leaves deliberate TODOs (token values, assets, content) rather than
guessed placeholders — see `scripts/onboard-brand.mjs`'s own doc comment for why. If
you've just been pointed at this repo (including after a fresh sync — e.g. from
aemcoder.adobe.io / the Experience Modernization Agent) and need to know what's
outstanding for a given brand, don't grep for TODO by hand:

    node scripts/onboard-brand.mjs <key> --check --json

Machine-readable, exits 1 if anything's outstanding. Add `--dry-run` (without `--check`)
to preview onboarding a brand that doesn't exist yet. The equivalent human-readable
checklist lives at `docs/brands/<key>.md`. `node scripts/validate-tokens.mjs` is the
harder gate — it fails the build on an unfilled token, a missing brand file, or
`scripts/brands.js` drifting from `brands.json` (brand.js imports that module, not
brands.json directly, so a brand present in one but not the other silently resolves to
the default brand instead of erroring).

## Hard rules

- Never modify `scripts/aem.js`. Extend in `scripts/lib/`.
- Never branch on a brand name. Branch on a capability: `hasFeature('commerce')`.
- Shared block CSS uses `var(--token)` only. No hex, no font stacks.
- Third-party scripts go in `delayed.js`, never eager or lazy.
- A block ships with its Universal Editor model and filter entry, or it is not done.
- Every change is verified on every brand in `brands.json`.
