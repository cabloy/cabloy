export function collectTeleports(html, teleports) {
  return html.replace(/(\n|\r\n)\s*<!--app-teleports-->/, renderTeleports(teleports));
}

export function renderTeleports(teleports) {
  if (!teleports) return '';
  return Object.entries(teleports).reduce((all, [key, value]) => {
    return `${all}<div id="${key.slice(1)}">${value}</div>`;
  }, '');
}
