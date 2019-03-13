export default {
  parseAtomClass(query) {
    const module = query && query.module;
    const atomClassName = query && query.atomClassName;
    if (module && atomClassName) {
      return {
        module, atomClassName,
      };
    }
    return {
      module: 'cms-sitecommunity', atomClassName: 'post',
    };
  },
  combineAtomClass(atomClass, url) {
    const query = `module=${atomClass.module}&atomClassName=${atomClass.atomClassName}`;
    if (!url) return query;
    const pos = url.indexOf('?');
    if (pos === -1) return `${url}?${query}`;
    if (pos === url.length - 1) return `${url}${query}`;
    return `${url}&${query}`;
  },
};
