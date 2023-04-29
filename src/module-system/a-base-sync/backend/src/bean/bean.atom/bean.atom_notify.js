module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom {
    _notifyDraftsDrafting(user, atomClass) {
      ctx.bean.stats.notify({
        module: moduleInfo.relativeName,
        name: 'draftsDrafting',
        nameSub: `${atomClass.module}_${atomClass.atomClassName}`,
        user,
      });
    }

    _notifyDraftsFlowing(user, atomClass) {
      ctx.bean.stats.notify({
        module: moduleInfo.relativeName,
        name: 'draftsFlowing',
        nameSub: `${atomClass.module}_${atomClass.atomClassName}`,
        user,
      });
    }

    _notifyStars(user) {
      ctx.bean.stats.notify({
        module: moduleInfo.relativeName,
        name: 'stars',
        user,
      });
    }

    _notifyLabels(user) {
      ctx.bean.stats.notify({
        module: moduleInfo.relativeName,
        name: 'labels',
        user,
      });
    }
  }

  return Atom;
};
