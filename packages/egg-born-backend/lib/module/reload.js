module.exports = app => {
  return {
    now() {
      app.meta['a-cms:watcher'].reload({ action: 'now' });
    },
    freeze() {
      app.meta['a-cms:watcher'].reload({ action: 'freeze' });
    },
    unfreeze() {
      app.meta['a-cms:watcher'].reload({ action: 'unfreeze' });
    },
  };
};
