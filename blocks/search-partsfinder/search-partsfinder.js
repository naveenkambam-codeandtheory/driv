/**
 * Parts Finder block.
 *
 * Echoes the DRiV "Parts Finder" widget: a dark panel with a title,
 * a row of vehicle/parts search tabs, and a "look it up" CTA. The live
 * site's dropdowns are JS/API driven and are not part of the static
 * authored content, so this block renders the panel chrome only.
 *
 * Authored rows (from .plain.html):
 *   row 1: title            -> h2
 *   row 2: tabLabels        -> ul > li
 *   row 3: ctaLabel         -> p
 *   row 4: (empty)
 */

function textOf(row) {
  return row ? row.textContent.trim() : '';
}

export default async function decorate(block) {
  const rows = [...block.children];
  const titleText = textOf(rows[0]);
  const tabList = rows[1]?.querySelector('ul');
  const tabLabels = tabList
    ? [...tabList.querySelectorAll('li')].map((li) => li.textContent.trim())
    : [];
  const ctaText = textOf(rows[2]) || 'Look It Up';

  block.textContent = '';

  const panel = document.createElement('div');
  panel.className = 'search-partsfinder-panel';

  // Header: title + tabs
  const header = document.createElement('div');
  header.className = 'search-partsfinder-header';

  if (titleText) {
    const title = document.createElement('p');
    title.className = 'search-partsfinder-title';
    title.textContent = titleText;
    header.append(title);
  }

  if (tabLabels.length) {
    const tabs = document.createElement('ul');
    tabs.className = 'search-partsfinder-tabs';
    tabs.setAttribute('role', 'tablist');
    tabLabels.forEach((label, i) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'search-partsfinder-tab';
      btn.textContent = label;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      if (i === 0) li.classList.add('is-active');
      li.append(btn);
      tabs.append(li);
    });
    // simple tab-selection behaviour (visual only)
    tabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.search-partsfinder-tab');
      if (!btn) return;
      tabs.querySelectorAll('li').forEach((li) => li.classList.remove('is-active'));
      tabs.querySelectorAll('.search-partsfinder-tab').forEach((b) => b.setAttribute('aria-selected', 'false'));
      btn.closest('li').classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
    });
    header.append(tabs);
  }

  panel.append(header);

  // Field row placeholder (echoes the source dropdown bar) + CTA
  const controls = document.createElement('div');
  controls.className = 'search-partsfinder-controls';

  const field = document.createElement('div');
  field.className = 'search-partsfinder-field';
  field.setAttribute('aria-hidden', 'true');
  controls.append(field);

  const cta = document.createElement('button');
  cta.type = 'button';
  cta.className = 'search-partsfinder-cta';
  cta.textContent = ctaText;
  controls.append(cta);

  panel.append(controls);
  block.append(panel);
}
