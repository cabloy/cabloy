export default function (Vue) {
  async function _parseIcon({ icon }) {
    // for safe
    icon = Vue.prototype.$meta.util.escapeURL(icon);
    // support backend api static
    if (icon.indexOf('/api/static/') === 0) {
      return Vue.prototype.$meta.util.combineFetchStaticPath(icon);
    }
    // split module:group:name
    const parts = icon.split(':');
    if (parts.length < 3) {
      // just use as icon-f7
      return icon;
    }
    const moduleName = parts[0] || 'a-iconbooster';
    const group = parts[1] || 'default';
    const name = parts[2] || '';
    // load module
    const module = await Vue.prototype.$meta.module.use(moduleName);
    // group
    const groupHref = module.options.icons[group];
    // combine
    return `${groupHref}#${name}`;
  }
  return {
    state() {
      return {
        icons: {},
      };
    },
    actions: {
      setIcon({ icon, iconHref }) {
        this.icons = {
          ...this.icons,
          [icon]: iconHref,
        };
      },
      async getIcon({ icon }) {
        if (!icon) return null;
        if (this.icons[icon]) return this.icons[icon];
        // support backend api static
        const iconHref = await _parseIcon({ icon });
        this.setIcon({ icon, iconHref });
        return iconHref;
      },
      async combineIcon({ material, icon, color, size }) {
        let _colorClass = '';
        let _colorStyle = '';
        if (color) {
          const _color = Vue.prototype.$meta.util.escapeURL(color);
          if (_color[0] === '#') {
            _colorStyle = ` color: ${_color};`;
          } else {
            _colorClass = ` color-${_color}`;
          }
        }
        const _size = parseInt(size || 24) + 'px';
        // material icon
        if (material) {
          return `<i class="icon material-icons${_colorClass}" style="font-size: ${_size}; width: ${_size}; height: ${_size};${_colorStyle}">${Vue.prototype.$meta.util.escapeHtml(
            material
          )}</i>`;
        }
        // f7 icon
        const iconHref = await this.getIcon({ icon });
        return `<i class="icon f7-icons${_colorClass}" style="font-size: ${_size}; width: ${_size}; height: ${_size};${_colorStyle}"><svg width="${_size}" height="${_size}" aria-hidden="true"><use href="${iconHref}" x="0" y="0" width="${_size}" height="${_size}"></use></svg></i>`;
      },
    },
  };
}
