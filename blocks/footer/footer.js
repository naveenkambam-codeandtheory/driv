// MOOG footer: primary links row + legal bar. Content-first — all copy/links/images
// come from /content/footer.plain.html. This module fetches that fragment and renders it.

export default async function decorate(block) {
  // Metadata-independent dual-fetch: /content first (localhost), then root (DA/EDS prod).
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  if (!resp.ok) return;
  const html = await resp.text();

  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const sections = [...tmp.children];

  block.textContent = '';
  const footer = document.createElement('div');
  footer.className = 'footer-inner';

  // Section 0 -> primary links + MOOG logo; Section 1 -> legal bar + DRiV logo.
  const [primary, legal] = sections;

  if (primary) {
    const top = document.createElement('div');
    top.className = 'footer-primary';
    top.append(...primary.childNodes);
    footer.append(top);
  }

  if (legal) {
    const bottom = document.createElement('div');
    bottom.className = 'footer-legal';
    bottom.append(...legal.childNodes);
    footer.append(bottom);
  }

  block.append(footer);
}
