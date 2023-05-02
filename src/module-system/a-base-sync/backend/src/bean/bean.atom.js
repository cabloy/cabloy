const atom_0 = require('./bean.atom/bean.atom_0.js');
const atom_0_create = require('./bean.atom/bean.atom_0_create.js');
const atom_0_delete = require('./bean.atom/bean.atom_0_delete.js');
const atom_0_enable = require('./bean.atom/bean.atom_0_enable.js');
const atom_0_export = require('./bean.atom/bean.atom_0_export.js');
const atom_0_import = require('./bean.atom/bean.atom_0_import.js');
const atom_0_read = require('./bean.atom/bean.atom_0_read.js');
const atom_0_select = require('./bean.atom/bean.atom_0_select.js');
const atom_0_write = require('./bean.atom/bean.atom_0_write.js');
const atom_starLabel = require('./bean.atom/bean.atom_starLabel.js');
const atom_clone = require('./bean.atom/bean.atom_clone.js');
const atom_draft = require('./bean.atom/bean.atom_draft.js');
const atom_formal = require('./bean.atom/bean.atom_formal.js');
const atom_simple = require('./bean.atom/bean.atom_simple.js');
const atom_submit = require('./bean.atom/bean.atom_submit.js');
const atom_notify = require('./bean.atom/bean.atom_notify.js');
const atom_right_preferredRoles = require('./bean.atom/bean.atom_right_preferredRoles.js');
const atom_right_actions = require('./bean.atom/bean.atom_right_actions.js');
const atom_right_actionsBulk = require('./bean.atom/bean.atom_right_actionsBulk.js');
const atom_right_checkRightAction = require('./bean.atom/bean.atom_right_checkRightAction.js');
const atom_right_checkRightActionBulk = require('./bean.atom/bean.atom_right_checkRightActionBulk.js');
const atom_right_checkRightCreate = require('./bean.atom/bean.atom_right_checkRightCreate.js');
const atom_right_checkRightRead = require('./bean.atom/bean.atom_right_checkRightRead.js');
const atom_right_detailRightInherit = require('./bean.atom/bean.atom_right_detailRightInherit.js');
const atom_right_roleScopes = require('./bean.atom/bean.atom_right_roleScopes.js');
const atom_utils = require('./bean.atom/bean.atom_utils.js');

module.exports = ctx => {
  return ctx.app.meta.util.mixinClasses(
    atom_0,
    [
      //
      atom_0_create,
      atom_0_delete,
      atom_0_enable,
      atom_0_export,
      atom_0_import,
      atom_0_read,
      atom_0_select,
      atom_0_write,
      atom_starLabel,
      atom_clone,
      atom_draft,
      atom_formal,
      atom_simple,
      atom_submit,
      atom_notify,
      atom_right_actions,
      atom_right_actionsBulk,
      atom_right_checkRightAction,
      atom_right_checkRightActionBulk,
      atom_right_checkRightCreate,
      atom_right_checkRightRead,
      atom_right_detailRightInherit,
      atom_right_preferredRoles,
      atom_right_roleScopes,
      atom_utils,
    ],
    ctx
  );
};
