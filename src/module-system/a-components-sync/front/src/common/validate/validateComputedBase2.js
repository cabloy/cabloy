import ValidateComputedBaseFn from './validateComputedBase.js';
export default ({ ctx, onChange }) => {
  class ValidateComputedBase2 {
    constructor() {
      this.__computed_instance = null;
    }

    initialize() {
      // clear
      this.dispose();
      // check parcel
      if (!ctx.parcel || !ctx.parcel.data) return;
      // class
      const _Class = ValidateComputedBaseFn({
        ctx,
        dataRootName: 'parcel.data',
        dataRoot: ctx.parcel.data,
        onDataMeta: () => {
          return {
            host: ctx.validate.host,
            user: ctx.$store.state.auth.user.op,
          };
        },
        onChange: ({ parcel, name, value }) => {
          onChange({ parcel, name, value });
        },
      });
      // create
      this.__computed_instance = new _Class();
    }

    dispose() {
      if (this.__computed_instance) {
        this.__computed_instance.dispose();
        this.__computed_instance = null;
      }
    }

    register({ parcel, name, expression, dependencies, immediate }) {
      this.__computed_instance.register({ parcel, name, expression, dependencies, immediate });
    }
  }

  const _instance = new ValidateComputedBase2();
  return _instance;
};
