export function collectTeleports(html, teleports) {
  return html.replace(/(\n|\r\n)\s*<!--app-teleports-->/, renderTeleports(teleports));
}

export function renderTeleports(teleports) {
  if (!teleports) return '';
  return Object.entries(teleports).reduce((all, [key, value]) => {
    // This serializer creates dedicated containers, not arbitrary CSS selector targets.
    const target = /^#[a-z_][\w-]*/i.exec(key);
    if (!target || target[0] !== key) {
      throw new Error(
        `Unsupported SSR Teleport target ${JSON.stringify(key)}. Only simple #id targets are supported (ASCII letter or underscore first, then letters, digits, underscores, or hyphens). Use a dedicated Teleport container, not body.`,
      );
    }
    return `${all}<div id="${key.slice(1)}">${value}</div>`;
  }, '');
}
