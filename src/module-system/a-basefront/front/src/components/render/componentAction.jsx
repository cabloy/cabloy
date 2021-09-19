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
      const title = ctx.getTitle(context);
      // value
      const value = context.getValue();
      const children = [
        this._renderDateRange_renderProperty({ ctx, context, property, mode: 'begin', title, value }), //
        this._renderDateRange_renderProperty({ ctx, context, property, mode: 'end', title, value }),
      ];
      return children;
    },
    _renderDateRange_renderProperty({ ctx, context, mode, title, value }) {
      const { key } = context;
      // property
      const property = this._renderDateRange_combineProperty({ ctx, context, mode });
      context = {
        ...context,
        key: `${key}:${mode}`,
        property,
      };
      return this._renderDateRange_renderProperty2({ ctx, context, mode, title, value });
    },
    _renderDateRange_renderProperty2({ ctx, context, mode, title, value }) {
      const { key, property } = context;
      const placeholder = ctx.getPlaceholder(context);
      const props = {
        floatingLabel: false,
        type: 'datepicker',
        placeholder,
        resizable: false,
        clearButton: !ctx.validate.readOnly && !property.ebReadOnly && !property.ebDisabled,
        value,
        readonly: true, // always
        disabled: ctx.validate.readOnly || property.ebReadOnly || property.ebDisabled,
        calendarParams: property.ebParams,
      };
      // input
      return (
        <eb-list-input
          key={key}
          {...{ props }}
          onCalendarChange={values => {
            console.log(values);
          }}
        >
          <div slot="label" staticClass={property.ebReadOnly ? 'text-color-gray' : ''}>
            {title}
          </div>
          {ctx.__searchStates_render_list_item(context)}
        </eb-list-input>
      );
    },
    _renderDateRange_combineProperty({ ctx, context, mode }) {
      const { property } = context;
      const propertyDatepicker = {
        type: '',
        ebType: 'datepicker',
        ebDescription: mode === 'begin' ? 'Begin Date' : 'End Date',
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
