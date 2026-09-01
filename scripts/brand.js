import { getMetadata } from './aem.js';

// The registry is imported, not fetched. A fetch here costs a round trip before
// the brand stylesheet can even be requested, and a second before first paint -
// roughly 300 ms of LCP on a mid-tier mobile connection, on every page, for
// every brand. Generate this file from brands.json at commit time, or keep the
// two in sync with a CI check.
import REGISTRY from './brands.js';

let resolved;

const matchByPath = (p) => Object.values(REGISTRY.brands)
  .find((b) => b.pathPrefix !== '/' && (p === b.pathPrefix || p.startsWith(`${b.pathPrefix}/`)));

const matchByHost = (h) => Object.values(REGISTRY.brands)
  .find((b) => (b.hosts || []).includes(h));

export function getBrand() {
  if (resolved) return resolved;
  resolved = REGISTRY.brands[getMetadata('theme')]
    ?? matchByPath(window.location.pathname)
    ?? matchByHost(window.location.hostname)
    ?? REGISTRY.brands[REGISTRY.default];
  return resolved;
}

export const getBrandConfig = () => getBrand();
export const hasFeature = (f) => Boolean(getBrand().features?.[f]);
