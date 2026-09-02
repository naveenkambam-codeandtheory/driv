/**
 * Generated from brands.json — do not hand-edit divergent content here.
 * brands.json is the single source of truth (Step 7); this file exists only because
 * brand.js imports the registry as a module instead of fetching it, to avoid a network
 * round trip before the brand stylesheet can even be requested. Until Part 3's
 * onboard-brand.mjs / CI check keeps the two in sync automatically, update this file by
 * hand whenever brands.json changes.
 */
export default {
  default: 'driv',
  brands: {
    driv: {
      key: 'driv',
      name: 'DRiV',
      pathPrefix: '/',
      hosts: [
        'main--driv--naveenkambam-codeandtheory.aem.page',
        'main--driv--naveenkambam-codeandtheory.aem.live',
      ],
      locales: ['en-us'],
      indexPath: '/query-index.json',
      features: {},
      endpoints: {},
    },
    moog: {
      key: 'moog',
      name: 'Moog',
      pathPrefix: '/',
      hosts: [
        'main--moog--naveenkambam-codeandtheory.aem.page',
        'main--moog--naveenkambam-codeandtheory.aem.live',
      ],
      locales: ['en-us'],
      indexPath: '/query-index.json',
      features: {},
      endpoints: {},
    },
    abex: {
      key: 'abex',
      name: 'Abex',
      pathPrefix: '/abex',
      hosts: [
        'main--abex--naveenkambam-codeandtheory.aem.page',
        'main--abex--naveenkambam-codeandtheory.aem.live',
      ],
      locales: ['en-us'],
      indexPath: '/abex/query-index.json',
      features: {},
      endpoints: {},
    },
  },
};
