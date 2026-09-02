// MOOG header: utility bar (row 0) + main nav (row 1) with multi-level dropdowns.
// Content-first: all links/labels/images come from /content/nav.plain.html.
// This module fetches that fragment, reads its DOM, and builds the header + behavior.

const isDesktop = window.matchMedia('(min-width: 900px)');

const SOCIAL_ICONS = {
  instagram: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2m0 1.6c-3.1 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.3.8-.4.4-.6.8-.8 1.3-.2.4-.3 1-.4 2.1-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.3.4.4.8.6 1.3.8.4.2 1 .3 2.1.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.3-.8.4-.4.6-.8.8-1.3.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.3-.4-.4-.8-.6-1.3-.8-.4-.2-1-.3-2.1-.4-1.2-.1-1.6-.1-4.7-.1m0 4.1a4.1 4.1 0 1 0 0 8.2 4.1 4.1 0 0 0 0-8.2m0 6.8a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4m5.2-6.9a1 1 0 1 1-1.9 0 1 1 0 0 1 1.9 0"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 3.9 12 3.9 12 3.9s-7.5 0-9.4.5A3 3 0 0 0 .5 6.5C0 8.4 0 12 0 12s0 3.6.5 5.5a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.6 24 12 24 12s0-3.6-.5-5.5M9.6 15.6V8.4l6.2 3.6-6.2 3.6"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.6 4.5-4.6 1.3 0 2.7.2 2.7.2v2.9h-1.5c-1.5 0-1.9.9-1.9 1.8V12h3.3l-.5 3.5h-2.8v8.4A12 12 0 0 0 24 12"/></svg>',
};

function socialIconFor(label) {
  const key = (label || '').toLowerCase();
  return SOCIAL_ICONS[key] || '';
}

function closeAllDropdowns(root, except) {
  root.querySelectorAll('.nav-drop[aria-expanded="true"]').forEach((li) => {
    if (li !== except) li.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Build the utility bar (row 0) from the first fragment section.
 * Links whose label matches a known social network render as an icon.
 */
function buildUtilityBar(section) {
  const bar = document.createElement('div');
  bar.className = 'nav-utility';
  const links = document.createElement('ul');
  links.className = 'nav-utility-links';
  const social = document.createElement('ul');
  social.className = 'nav-utility-social';

  section.querySelectorAll('a').forEach((a) => {
    const label = a.textContent.trim();
    const icon = socialIconFor(label);
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = a.getAttribute('href');
    if (icon) {
      link.innerHTML = icon;
      link.setAttribute('aria-label', label);
      link.target = '_blank';
      link.rel = 'noopener';
      li.append(link);
      social.append(li);
    } else {
      link.textContent = label;
      li.append(link);
      links.append(li);
    }
  });

  if (links.childElementCount) bar.append(links);
  if (social.childElementCount) bar.append(social);
  return bar;
}

/** Build the brand/logo area from the section that contains an <img>. */
function buildBrand(section) {
  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  const link = section.querySelector('a');
  const img = section.querySelector('img');
  if (link && img) {
    const a = document.createElement('a');
    a.href = link.getAttribute('href') || '/';
    a.setAttribute('aria-label', 'Home');
    a.append(img.cloneNode(true));
    brand.append(a);
  }
  return brand;
}

/** Build the multi-level nav tree from the section containing the top-level <ul>. */
function buildNavSections(section) {
  const wrapper = document.createElement('nav');
  wrapper.className = 'nav-sections';
  const topList = section.querySelector(':scope > ul');
  if (!topList) return wrapper;

  const list = topList.cloneNode(true);
  // Mark items that have a nested <ul> as dropdown parents.
  list.querySelectorAll(':scope > li').forEach((li) => {
    const sublist = li.querySelector(':scope > ul');
    if (sublist) {
      li.classList.add('nav-drop');
      li.setAttribute('aria-expanded', 'false');
      const trigger = li.querySelector(':scope > a');
      if (trigger) {
        // Desktop: hover opens; click on the label still navigates.
        li.addEventListener('mouseenter', () => {
          if (isDesktop.matches) {
            closeAllDropdowns(wrapper, li);
            li.setAttribute('aria-expanded', 'true');
          }
        });
        li.addEventListener('mouseleave', () => {
          if (isDesktop.matches) li.setAttribute('aria-expanded', 'false');
        });
        // Mobile: tapping the label toggles its panel instead of navigating.
        trigger.addEventListener('click', (e) => {
          if (!isDesktop.matches) {
            e.preventDefault();
            const open = li.getAttribute('aria-expanded') === 'true';
            closeAllDropdowns(wrapper, open ? null : li);
            li.setAttribute('aria-expanded', open ? 'false' : 'true');
          }
        });
      }
    }
  });

  wrapper.append(list);
  return wrapper;
}

/** Build the right-side CTA(s) from the final section. */
function buildTools(section) {
  const tools = document.createElement('div');
  tools.className = 'nav-tools';
  section.querySelectorAll('a').forEach((a) => {
    const link = document.createElement('a');
    link.href = a.getAttribute('href');
    link.textContent = a.textContent.trim();
    link.className = 'nav-cta';
    tools.append(link);
  });
  return tools;
}

function toggleMobileMenu(nav, hamburger) {
  const open = nav.getAttribute('data-expanded') === 'true';
  nav.setAttribute('data-expanded', open ? 'false' : 'true');
  hamburger.setAttribute('aria-expanded', open ? 'false' : 'true');
  document.body.style.overflowY = open || isDesktop.matches ? '' : 'hidden';
}

export default async function decorate(block) {
  // Metadata-independent dual-fetch: /content first (localhost), then root (DA/EDS prod).
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
  if (!resp.ok) return;
  const html = await resp.text();

  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const sections = [...tmp.children];

  block.textContent = '';
  const nav = document.createElement('div');
  nav.id = 'nav';
  nav.setAttribute('data-expanded', 'false');

  // Section 0 -> utility bar; img section -> brand; ul section -> nav; last -> tools.
  const utilitySection = sections[0];
  const brandSection = sections.find((s) => s.querySelector('img'));
  const navSection = sections.find((s) => s.querySelector(':scope > ul'));
  const toolsSection = sections[sections.length - 1];

  if (utilitySection) nav.append(buildUtilityBar(utilitySection));

  const mainRow = document.createElement('div');
  mainRow.className = 'nav-main';

  // Hamburger (mobile only, shown via CSS)
  const hamburger = document.createElement('button');
  hamburger.className = 'nav-hamburger';
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span class="nav-hamburger-icon"></span>';
  hamburger.addEventListener('click', () => toggleMobileMenu(nav, hamburger));

  if (brandSection) mainRow.append(buildBrand(brandSection));
  mainRow.append(hamburger);
  if (navSection) mainRow.append(buildNavSections(navSection));
  if (toolsSection && toolsSection !== navSection) mainRow.append(buildTools(toolsSection));

  nav.append(mainRow);
  block.append(nav);

  // Close mobile menu / reset on breakpoint change.
  isDesktop.addEventListener('change', () => {
    nav.setAttribute('data-expanded', 'false');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflowY = '';
    closeAllDropdowns(nav);
  });
}
