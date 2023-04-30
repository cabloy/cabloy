const atom_0 = require('./bean.atom/bean.atom_0.js');
const atom_1 = require('./bean.atom/bean.atom_1.js');
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
      atom_1,
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
