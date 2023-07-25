// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

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
      aAtom:
        'createdAt,updatedAt,itemId,atomStage,atomFlowId,atomClassId,atomName,userIdCreated,userIdUpdated,atomStaticKey,atomLanguage,atomCategoryId',
      aAtomAction: 'createdAt,updatedAt,atomClassId+code,name',
      aAtomClass: 'createdAt,updatedAt,module+atomClassName',
      aAtomLabel: 'createdAt,updatedAt,userId,atomId',
      aAtomLabelRef: 'createdAt,updatedAt,userId+labelId,atomId',
      aAtomStar: 'createdAt,updatedAt,userId,atomId',
      aAuth: 'createdAt,updatedAt,userId,providerId+profileId',
      aAuthProvider: 'createdAt,updatedAt,module+providerName',
      aCategory: 'createdAt,updatedAt,atomClassId,categoryName,categorySorting,categoryIdParent',
      aComment: 'createdAt,updatedAt,atomId,userId,sorting',
      aCommentHeart: 'createdAt,updatedAt,userId,atomId,commentId',
      aLabel: 'createdAt,updatedAt,userId',
      aResource: 'createdAt,updatedAt,atomId,resourceSorting,resourceType',
      aResourceLocale: 'createdAt,updatedAt,atomId,locale',
      aResourceRole: 'createdAt,updatedAt,atomId,roleId',
      aRole: 'createdAt,updatedAt,roleName,sorting,roleIdParent',
      aRoleExpand: 'createdAt,updatedAt,roleId,roleIdBase',
      aRoleInc: 'createdAt,updatedAt,roleId,roleIdInc',
      aRoleIncRef: 'createdAt,updatedAt,roleId,roleIdInc,roleIdSrc',
      aRoleRef: 'createdAt,updatedAt,roleId,roleIdParent',
      aRoleRight: 'createdAt,updatedAt,roleId,atomClassId+action',
      aRoleRightRef: 'createdAt,updatedAt,roleRightId,roleId,atomClassId+action,roleIdScope',
      aTag: 'createdAt,updatedAt,atomClassId,tagName',
      aTagRef: 'createdAt,updatedAt,atomId,tagId',
      aUser: 'createdAt,updatedAt,userName,email,mobile',
      aUserAgent: 'createdAt,updatedAt,userId,userIdAgent',
      aUserRole: 'createdAt,updatedAt,userId,roleId',
    },
    'a-cache': {
      aCache: 'createdAt,updatedAt,module+name',
    },
    'a-cms': {
      aCmsArticle: 'createdAt,updatedAt,atomId,sticky,slug,sorting',
      aCmsContent: 'createdAt,updatedAt,atomId,html:fulltext',
    },
    'a-dashboard': {
      aDashboard: 'createdAt,updatedAt,atomId',
      aDashboardContent: 'createdAt,updatedAt,atomId,itemId',
      aDashboardUser: 'createdAt,updatedAt,userId,dashboardAtomId',
    },
    'a-detail': {
      aDetailBase: 'createdAt,updatedAt,atomIdMain,atomClassIdMain,detailId,detailClassId,detailStaticKey',
    },
    'a-dict': {
      aDict: 'createdAt,updatedAt,atomId',
    },
    'a-dingtalk': {
      aDingtalkDepartment: 'createdAt,updatedAt,roleId,departmentId,departmentParentId',
      aDingtalkMember: 'createdAt,updatedAt,userId,memberId',
    },
    'a-file': {
      aFile: 'createdAt,updatedAt,userId,downloadId,atomId',
    },
    'a-flow': {
      aFlow: 'createdAt,updatedAt,flowDefId,flowStatus,flowUserId',
      aFlowDef: 'createdAt,updatedAt,atomId',
      aFlowDefContent: 'createdAt,updatedAt,atomId,itemId',
      aFlowHistory: 'createdAt,updatedAt,flowId,flowDefId,flowStatus,flowUserId',
      aFlowNode: 'createdAt,updatedAt,flowId,flowNodeIdPrev',
      aFlowNodeHistory: 'createdAt,updatedAt,flowId,flowNodeId,flowNodeIdPrev',
    },
    'a-flowtask': {
      aFlowNodeStartEventAtomCondition: 'createdAt,updatedAt,flowDefId,atomClassId',
      aFlowTask: 'createdAt,updatedAt,flowId,flowNodeId,flowTaskStatus,userIdAssignee',
      aFlowTaskHistory: 'createdAt,updatedAt,flowId,flowTaskId,flowNodeId,flowTaskStatus,userIdAssignee',
    },
    'a-instance': {
      aInstance: 'createdAt,updatedAt,name',
    },
    'a-mail': {
      aMail: 'createdAt,updatedAt,status',
    },
    'a-progress': {},
    'a-sequence': {
      aSequence: 'createdAt,updatedAt,module+name',
    },
    'a-settings': {
      aSettings: 'createdAt,updatedAt,module+scene+userId',
      aSettingsRef: 'createdAt,updatedAt,module+scene+userId+name',
    },
    'a-share': {
      aShare: 'createdAt,updatedAt,uuid,atomId,userId,host',
      aShareRecordPV: 'createdAt,updatedAt,shareId,userId',
      aShareRecordUV: 'createdAt,updatedAt,atomId,userIdSource,userIdTarget',
    },
    'a-socketio': {
      aSocketIOMessage: 'createdAt,updatedAt,messageClassId,messageFilter,sessionId',
      aSocketIOMessageClass: 'createdAt,updatedAt,module+messageClassName',
      aSocketIOMessageSync: 'createdAt,updatedAt,messageId,userId,messageRead',
    },
    'a-stats': {
      aStats: 'createdAt,updatedAt,userId,module+name',
    },
    'a-status': {
      aStatus: 'createdAt,updatedAt,module+name',
    },
    'a-wechat': {
      aWechatUser: 'createdAt,updatedAt,userId,openid,unionid',
    },
    'a-wxwork': {
      aWxworkDepartment: 'createdAt,updatedAt,roleId,departmentId,departmentParentId',
      aWxworkMember: 'createdAt,updatedAt,userId,memberId',
    },
  };
  // indexes extend
  config.indexesExtend = null;
  // indexesCheck
  config.indexesCheck = true;

  return config;
};
