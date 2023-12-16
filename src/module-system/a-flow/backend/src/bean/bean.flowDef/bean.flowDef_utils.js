// const moduleInfo = module.info;
module.exports = class FlowDef {
  _calcConditionExpressionLevel({ conditionExpression }) {
    if (!conditionExpression && conditionExpression !== false) return 3;
    if (conditionExpression === false) return 2;
    return 1;
  }
};
