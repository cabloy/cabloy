module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Flow {
    evaluateExpression({ expression, globals }) {
      return ctx.bean.util.evaluateExpression({ expression, globals });
    }

    async executeService({ bean, parameterExpression, parameter, globals }) {
      if (parameterExpression !== undefined) {
        parameter = this.evaluateExpression({ expression: parameterExpression, globals });
      }
      return await this._executeServiceInner({ bean, parameter, globals });
    }

    async _executeServiceInner({ bean, parameter, globals }) {
      if (!bean) throw new Error('flow service bean is not set');
      // bean
      const beanFullName = `${bean.module}.flow.service.${bean.name}`;
      const beanInstance = ctx.bean._getBean(beanFullName);
      if (!beanInstance) throw new Error(`bean not found: ${beanFullName}`);
      if (Object.getPrototypeOf(Object.getPrototypeOf(beanInstance)).constructor.name !== 'FlowServiceBase') {
        throw new Error(`bean should extends FlowServiceBase: ${beanFullName}`);
      }
      // context
      const context = Object.assign({}, globals);
      if (parameter !== undefined) {
        context.parameter = parameter;
      }
      return await beanInstance.execute(context);
    }
  }

  return Flow;
};
