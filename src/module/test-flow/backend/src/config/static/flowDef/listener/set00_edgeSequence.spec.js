module.exports = class Listener {
  constructor(context) {
    this.context = context;
  }

  async onNodeEnter(contextNode) {
    if (contextNode._nodeDef.id === 'startEvent_1') {
      // nodeVars
      const x = this.context.vars.get('x');
      contextNode.vars.set('x', x);
    }
  }

};
