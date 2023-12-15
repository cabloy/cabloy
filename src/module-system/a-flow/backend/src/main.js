const config = require('./config/config.js');
const locales = require('./config/locales.js');
const errors = require('./config/errors.js');
const constants = require('./config/constants.js');
const FlowBehaviorBase = require('./common/flowBehaviorBase.js');
const FlowNodeBase = require('./common/flowNodeBase.js');
const FlowEdgeBase = require('./common/flowEdgeBase.js');
const aops = require('./aops.js');

// FlowBehaviorBase/FlowNodeBase/FlowEdgeBase
module.meta.class.FlowBehaviorBase = FlowBehaviorBase;
module.meta.class.FlowNodeBase = FlowNodeBase;
module.meta.class.FlowEdgeBase = FlowEdgeBase;

module.exports = app => {
  const beans = require('./beans.js');
  // routes
  const routes = require('./routes.js')(app);
  // controllers
  const controllers = require('./controllers.js')(app);
  // services
  const services = require('./services.js')(app);
  // models
  const models = require('./models.js')(app);
  // meta
  const meta = require('./meta.js')(app);

  return {
    aops,
    beans,
    routes,
    controllers,
    services,
    models,
    config,
    locales,
    errors,
    constants,
    meta,
  };
};
