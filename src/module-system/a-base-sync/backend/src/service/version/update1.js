const update1Data = require('./update1Data.js');

module.exports = function(ctx) {

  class VersionUpdate1 {

    async run() {
      // tables
      const tableNames = [
        'aUser', 'aUserAgent', 'aAuthProvider', 'aAuth', 'aRole', 'aRoleInc', 'aUserRole', 'aRoleRight',
        'aAtomClass', 'aAtom', 'aAtomAction',
        'aLabel', 'aAtomLabel', 'aAtomLabelRef', 'aAtomStar',
        'aRoleRef', 'aRoleIncRef', 'aRoleExpand', 'aRoleRightRef',
        'aFunction', 'aFunctionStar', 'aFunctionLocale', 'aRoleFunction',
      ];

      for (const tableName of tableNames) {
        await ctx.model.query(update1Data.tables[tableName]);
      }

      // views
      const viewNames = [
        'aViewUserRoleRef',
        'aViewUserRoleExpand',
        'aViewUserRightAtomClass',
        'aViewUserRightAtomClassUser',
        'aViewUserRightAtom',
        'aViewUserRightFunction',
      ];
      for (const viewName of viewNames) {
        await ctx.model.query(update1Data.views[viewName]);
      }

      // functions
      const functionNames = [
      ];
      for (const functionName of functionNames) {
        await ctx.model.query(update1Data.functions[functionName]);
      }

      // procedures
      const procedureNames = [
        'aSelectAtoms',
        'aGetAtom',
        'aCheckRightRead',
        'aCheckRightUpdate',
        'aCheckRightAction',
        'aCheckRightCreate',
        'aCheckRightFunction',
        'aSelectFunctions',
        'aCheckFunctionLocales',
        'aBuildRoles',
        'aBuildRolesRemove',
        'aBuildRolesAdd',
        'aBuildRoleRef',
        'aBuildRoleIncRef',
        'aBuildRoleExpand',
      ];
      for (const procedureName of procedureNames) {
        await ctx.model.query(update1Data.procedures[procedureName]);
      }
    }

  }

  return VersionUpdate1;
};
