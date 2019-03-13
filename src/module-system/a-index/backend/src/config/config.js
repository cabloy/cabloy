// eslint-disable-next-line
module.exports = appInfo => {
  const config = {
  };

  // indexes
  config.indexes = {
    'a-version': {
      aVersion: 'createdAt,updatedAt,module,version',
      aVersionInit: 'createdAt,updatedAt,subdomain+module,version',
    },
    'a-authsimple': {
      aAuthSimple: 'createdAt,updatedAt,userId',
    },
    'a-base': {
      aAtom: 'createdAt,updatedAt,itemId,atomFlag,atomName,userIdCreated,atomClassId',
      aAtomAction: 'createdAt,updatedAt,atomClassId+code,name',
      aAtomClass: 'createdAt,updatedAt,module+atomClassName',
      aAtomLabel: 'createdAt,updatedAt,userId,atomId',
      aAtomLabelRef: 'createdAt,updatedAt,userId+labelId,atomId',
      aAtomStar: 'createdAt,updatedAt,userId,atomId',
      aAuth: 'createdAt,updatedAt,userId,providerId+profileId',
      aAuthProvider: 'createdAt,updatedAt,module+providerName',
      aComment: 'createdAt,updatedAt,atomId,userId,sorting',
      aCommentHeart: 'createdAt,updatedAt,userId,atomId,commentId',
      aFunction: 'createdAt,updatedAt,module+name,scene,atomClassId+action,sorting',
      aFunctionLocale: 'createdAt,updatedAt,functionId',
      aFunctionStar: 'createdAt,updatedAt,userId,functionId',
      aLabel: 'createdAt,updatedAt,userId',
      aRole: 'createdAt,updatedAt,roleName,sorting,roleIdParent',
      aRoleExpand: 'createdAt,updatedAt,roleId,roleIdBase',
      aRoleFunction: 'createdAt,updatedAt,roleId,functionId,roleRightId',
      aRoleInc: 'createdAt,updatedAt,roleId,roleIdInc',
      aRoleIncRef: 'createdAt,updatedAt,roleId,roleIdInc,roleIdSrc',
      aRoleRef: 'createdAt,updatedAt,roleId,roleIdParent',
      aRoleRight: 'createdAt,updatedAt,roleId,atomClassId+action',
      aRoleRightRef: 'createdAt,updatedAt,roleRightId,roleId,atomClassId+action,roleIdScope',
      aUser: 'createdAt,updatedAt,userName,email,mobile',
      aUserAgent: 'createdAt,updatedAt,userId,userIdAgent',
      aUserRole: 'createdAt,updatedAt,userId,roleId',
    },
    'a-cache': {
      aCache: 'createdAt,updatedAt,module+name',
    },
    'a-cms': {
      aCmsArticle: 'createdAt,updatedAt,atomId,categoryId,sticky,sorting',
      aCmsArticleTag: 'createdAt,updatedAt,atomId,itemId',
      aCmsArticleTagRef: 'createdAt,updatedAt,atomId,itemId,tagId',
      aCmsCategory: 'createdAt,updatedAt,categoryName,sorting,categoryIdParent,atomClassId',
      aCmsContent: 'createdAt,updatedAt,atomId,itemId,content:fulltext',
      aCmsTag: 'createdAt,updatedAt,atomClassId+language+tagName',
    },
    'a-file': {
      aFile: 'createdAt,updatedAt,userId,downloadId,atomId',
    },
    'a-instance': {
      aInstance: 'createdAt,updatedAt,name',
    },
    'a-sequence': {
      aSequence: 'createdAt,updatedAt,module+name',
    },
    'a-settings': {
      aSettings: 'createdAt,updatedAt,module+scene+userId',
      aSettingsRef: 'createdAt,updatedAt,module+scene+userId+name',
    },
    'a-status': {
      aStatus: 'createdAt,updatedAt,module+name',
    },

  };
  // indexes extend
  config.indexesExtend = null;
  // indexesCheck
  config.indexesCheck = true;

  return config;
};
