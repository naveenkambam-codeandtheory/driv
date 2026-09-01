/*
 * form-locator — "Where To Buy" ZIP/postal-code locator bar.
 *
 * Authored content (rows):
 *   1. heading    -> h2 e.g. "Where To Buy"
 *   2. subheading -> h2 (field label, e.g. "ZIP/Postal Code") + p (input placeholder/hint)
 *   3. reference  -> (optional) form endpoint link
 *   4. action     -> (optional) submit endpoint link
 *   5. ctaLabel   -> p with the search button label, e.g. "Search"
 *
 * Rebuilds the rows into a single horizontal locator bar: heading + labelled
 * ZIP input + red Search submit button.
 */

const MARKER_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
  <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
</svg>`;

export default async function decorate(block) {
  const rows = [...block.children];

  // Row 1: heading text
  const headingText = rows[0]?.querySelector('h1, h2, h3, h4, h5, h6, p')?.textContent.trim()
    || 'Where To Buy';

  // Row 2: field label (heading) + placeholder/hint (paragraph)
  const fieldCell = rows[1];
  const labelText = fieldCell?.querySelector('h1, h2, h3, h4, h5, h6')?.textContent.trim()
    || 'ZIP/Postal Code';
  const placeholder = fieldCell?.querySelector('p')?.textContent.trim()
    || 'Enter a ZIP/Postal Code';

  // Optional endpoints from any authored links.
  const links = [...block.querySelectorAll('a')].map((a) => a.href);
  const actionHref = links.find((l) => l && l !== window.location.href) || '';

  // Last row: CTA / submit label.
  const ctaText = rows[rows.length - 1]?.querySelector('p, a')?.textContent.trim() || 'Search';

  const inputId = 'form-locator-zip';

  const form = document.createElement('form');
  form.className = 'form-locator-bar';
  if (actionHref) form.dataset.action = actionHref;

  // Left group: icon + heading + small ZIP/Postal Code sublabel.
  const headingEl = document.createElement('div');
  headingEl.className = 'form-locator-heading';
  headingEl.innerHTML = `<span class="form-locator-icon">${MARKER_ICON}</span>`
    + `<div class="form-locator-heading-text"><h2>${headingText}</h2>`
    + `<label for="${inputId}">${labelText}</label></div>`;

  const field = document.createElement('div');
  field.className = 'form-locator-field';
  const input = document.createElement('input');
  input.type = 'text';
  input.id = inputId;
  input.name = 'zip';
  input.placeholder = placeholder;
  input.setAttribute('autocomplete', 'postal-code');
  input.setAttribute('aria-label', labelText);
  field.append(input);

  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'form-locator-submit';
  button.textContent = ctaText;

  form.append(headingEl, field, button);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (form.dataset.action && input.value.trim()) {
      const url = new URL(form.dataset.action, window.location.origin);
      url.searchParams.set('zip', input.value.trim());
      window.location.href = url.toString();
    }
  });

  block.replaceChildren(form);
}
