module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowDef {
    _calcConditionExpressionLevel({ conditionExpression }) {
      if (!conditionExpression && conditionExpression !== false) return 3;
      if (conditionExpression === false) return 2;
      return 1;
    }
  }

  return FlowDef;
};
