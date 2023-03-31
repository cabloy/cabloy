module.exports = ctx => {
  class Procedure {
    async selectAtoms({
      iid,
      userIdWho,
      atomClass,
      atomClassBase,
      tableName,
      where,
      orders,
      page,
      star,
      label,
      comment,
      file,
      count,
      stage,
      language,
      category,
      tag,
      mine,
      resource,
      resourceLocale,
      mode,
      cms,
      forAtomUser,
      role,
    }) {
      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      star = parseInt(star);
      label = parseInt(label);
      comment = parseInt(comment);
      file = parseInt(file);
      stage = parseInt(stage);
      category = parseInt(category);
      tag = parseInt(tag);
      mine = parseInt(mine);
      resource = parseInt(resource);
      role = parseInt(role);

      // draft
      if (stage === 0) {
        // userIdWho must be set
        return await this._selectAtoms_draft({
          iid,
          userIdWho,
          atomClass,
          atomClassBase,
          tableName,
          where,
          orders,
          page,
          star,
          label,
          comment,
          file,
          count,
          stage,
          language,
          category,
          tag,
          mode,
          cms,
        });
      }
      if (userIdWho === 0) {
        return await this._selectAtoms_0({
          iid,
          atomClass,
          atomClassBase,
          tableName,
          where,
          orders,
          page,
          comment,
          file,
          count,
          stage,
          language,
          category,
          tag,
          resource,
          resourceLocale,
          mode,
          cms,
          forAtomUser,
          role,
        });
      }
      // formal/history
      return await this._selectAtoms_formal({
        iid,
        userIdWho,
        atomClass,
        atomClassBase,
        tableName,
        where,
        orders,
        page,
        star,
        label,
        comment,
        file,
        count,
        stage,
        language,
        category,
        tag,
        mine,
        resource,
        resourceLocale,
        mode,
        cms,
        forAtomUser,
        role,
      });
    }
  }
  return Procedure;
};
