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
      const action = this.action;
      const actionName = action.actionName || action.name;
      if (actionName === 'dateRange') {
        return this._renderDateRange();
      }
    },
    _renderDateRange() {
      const { ctx, item } = this.$props;
      const { context } = item;
      const { property } = context;
      // title
      const title = ctx.getTitle(context);
      // value
      const value = context.getValue();
      const [valueBegin, valueEnd] = this._renderDateRange_splitValue({ ctx, context, value });
      const children = [
        this._renderDateRange_renderProperty({
          ctx,
          context,
          property,
          mode: 'begin',
          title,
          value: valueBegin,
        }),
        this._renderDateRange_renderProperty({
          ctx,
          context,
          property,
          mode: 'end',
          title,
          value: valueEnd,
        }),
      ];
      return children;
    },
    _renderDateRange_splitValue({ ctx, context, value }) {
      const { property } = context;
      if (!value) return [null, null];
      let [valueBegin, valueEnd] = value.split(',');
      valueBegin = valueBegin ? ctx.$meta.util.moment(valueBegin, property.ebParams.dateFormat) : null;
      valueEnd = valueEnd ? ctx.$meta.util.moment(valueEnd, property.ebParams.dateFormat) : null;
      return [valueBegin, valueEnd];
    },
    _renderDateRange_setValue({ ctx, context, mode, value }) {
      const { property } = context;
      let [valueBegin, valueEnd] = this._renderDateRange_splitValue({ ctx, context, value: context.getValue() });
      if (mode === 'begin') {
        valueBegin = value;
      } else {
        valueEnd = value;
      }
      valueBegin = valueBegin ? ctx.$meta.util.moment(valueBegin).format(property.ebParams.dateFormat) : '';
      valueEnd = valueEnd ? ctx.$meta.util.moment(valueEnd).format(property.ebParams.dateFormat) : '';
      let _value = [valueBegin, valueEnd].join(',');
      if (_value === ',') _value = ''; // should not set to null
      context.setValue(_value);
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
        value: value ? [value] : [],
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
            const value = values[0];
            this._renderDateRange_setValue({ ctx, context, mode, value });
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
        ebType: 'datePicker',
        ebDescription: mode === 'begin' ? 'Begin Date' : 'End Date',
        ebRender: null,
        ebSearch: {
          operators: mode === 'begin' ? '>=' : '<=',
        },
      };
      return ctx.$meta.util.extend({}, property, propertyDatepicker);
    },
  },
};
