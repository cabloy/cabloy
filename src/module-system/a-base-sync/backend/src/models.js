const atom = require('./model/atom.js');
const atomAction = require('./model/atomAction.js');
const atomClass = require('./model/atomClass.js');
const auth = require('./model/auth.js');
const authProvider = require('./model/authProvider.js');
const role = require('./model/role.js');
const roleInc = require('./model/roleInc.js');
const roleIncRef = require('./model/roleIncRef.js');
const roleRef = require('./model/roleRef.js');
const roleRight = require('./model/roleRight.js');
const roleRightRef = require('./model/roleRightRef.js');
const roleExpand = require('./model/roleExpand.js');
const user = require('./model/user.js');
const userAgent = require('./model/userAgent.js');
const userRole = require('./model/userRole.js');
const label = require('./model/label.js');
const atomLabel = require('./model/atomLabel.js');
const atomLabelRef = require('./model/atomLabelRef.js');
const atomStar = require('./model/atomStar.js');
const comment = require('./model/comment.js');
const commentView = require('./model/commentView.js');
const commentHeart = require('./model/commentHeart.js');
const category = require('./model/category.js');
const tag = require('./model/tag.js');
const tagRef = require('./model/tagRef.js');
const resource = require('./model/resource.js');
const resourceLocale = require('./model/resourceLocale.js');
const resourceRole = require('./model/resourceRole.js');

module.exports = app => {
  const models = {
    atom,
    atomAction,
    atomClass,
    auth,
    authProvider,
    role,
    roleInc,
    roleIncRef,
    roleRef,
    roleRight,
    roleRightRef,
    roleExpand,
    user,
    userAgent,
    userRole,
    label,
    atomLabel,
    atomLabelRef,
    atomStar,
    comment,
    commentView,
    commentHeart,
    category,
    tag,
    tagRef,
    resource,
    resourceLocale,
    resourceRole,
  };
  return models;
};
