module.exports = ctx => {
  // const moduleInfo = module.info;
  class FlowDef {
    _calcConditionExpressionLevel({ conditionExpression }) {
      if (!conditionExpression && conditionExpression !== false) return 3;
      if (conditionExpression === false) return 2;
      return 1;
    }
  }

  return FlowDef;
};
