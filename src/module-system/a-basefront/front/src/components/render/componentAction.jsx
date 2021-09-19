import Vue from 'vue';
const ebActionBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebActionBase;

export default {
  meta: {
    global: false,
  },
  mixins: [
    ebActionBase, //
  ],
  methods: {
    onAction() {
      if (this.action.name === 'dateRange') return this._renderDateRange();
    },
    _renderDateRange() {
      const { ctx, item } = this.$props;
      const { context } = item;
      const { property } = context;
      const children = [
        this._renderDateRange_renderProperty({ ctx, context, property, mode: 'begin' }), //
        this._renderDateRange_renderProperty({ ctx, context, property, mode: 'end' }),
      ];
      return children;
    },
    _renderDateRange_renderProperty({ ctx, context, mode }) {
      const { key } = context;
      const propertyDatepicker = this._renderDateRange_combineProperty({ ctx, context, mode });
      context = {
        ...context,
        key: `${key}:${mode}`,
        property: propertyDatepicker,
      };
      return ctx._renderItem(context);
    },
    _renderDateRange_combineProperty({ ctx, context, mode }) {
      const { property } = context;
      const propertyDatepicker = {
        type: ['object', 'null'],
        ebType: 'datepicker',
        ebRender: null,
        ebSearch: {
          tableAlias: 'a',
          operators: mode === 'begin' ? '>=' : '<=',
        },
      };
      return ctx.$meta.util.extend({}, property, propertyDatepicker);
    },
  },
};
