import renderProperties from './render/renderProperties.js';
import renderComponent from './render/renderComponent.js';
import renderGroup from './render/renderGroup.js';
import renderPanel from './render/renderPanel.js';
import renderText from './render/renderText.js';
import renderDatepicker from './render/renderDatepicker.js';
import renderFile from './render/renderFile.js';
import renderToggle from './render/renderToggle.js';
import renderSelect from './render/renderSelect.js';
import renderLink from './render/renderLink.js';
import renderLanguage from './render/renderLanguage.js';
import renderCategory from './render/renderCategory.js';
import renderTags from './render/renderTags.js';
import renderResourceType from './render/renderResourceType.js';
import renderJson from './render/renderJson.js';
import renderCurrency from './render/renderCurrency.js';

export default {
  mixins: [
    renderProperties, renderComponent, renderGroup, renderPanel, renderText,
    renderDatepicker, renderFile, renderToggle, renderSelect, renderLink,
    renderLanguage, renderCategory, renderTags, renderResourceType,
    renderJson, renderCurrency,
  ],
  props: {
    data: {
      type: Object,
    },
    pathParent: {
      type: String,
      default: '',
    },
    dataKey: {
      type: String,
    },
    schema: {
      type: Object,
    },
    properties: {
      type: Object,
    },
    property: {
      type: Object,
    },
    meta: {
      type: Object,
    },
    root: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      validate: null,
    };
  },
  created() {
    this.validate = this.getValidate();
  },
  beforeDestroy() {
    this.validate = null;
  },
  methods: {
    getValidate() {
      let parent = this.$parent;
      while (parent) {
        if (parent.$options._componentTag === 'eb-validate') break;
        parent = parent.$parent;
      }
      return parent;
    },
    getMetaValue(meta, key, dataPath) {
      // 1. item
      const value = meta ? meta[key] : undefined;
      if (value !== undefined) return value;
      // 2. validate
      const validateMeta = this.validate.meta;
      if (!validateMeta) return undefined;
      // dataPath is empty
      if (!dataPath) return validateMeta[key];
      // dataPath is not empty
      return (validateMeta[dataPath] && validateMeta[dataPath][key]) || validateMeta[key];
    },
    getValue(data, key, property) {
      const _value = data[key];
      if (!this.checkIfEmptyForSelect(_value)) return _value;
      if (this.checkIfEmptyForSelect(property.default)) return _value;
      return property.default;
    },
    setValue(data, key, value, property) {
      let _value;

      if (property.ebType === 'select' && this.checkIfEmptyForSelect(value)) {
        _value = null; // for distinguish from 0
      } else {
        if (property.type === 'number') {
          if (isNaN(value)) {
            _value = value;
          } else {
            _value = Number(value);
          }
        } else if (property.type === 'boolean') {
          _value = Boolean(value);
        } else {
          _value = value;
        }
      }

      const _valueOld = data[key];

      this.$set(data, key, _value); // always set as maybe Object

      if (_valueOld !== _value) {
        this.$emit('change', _value);
        this.validate.$emit('validateItem:change', key, _value);
      }
    },
    checkIfEmptyForSelect(value) {
      return value === '' || value === undefined || value === null;
    },
    adjustDataPath(dataPath) {
      if (!dataPath) return dataPath;
      if (dataPath[0] !== '/') return this.validate.dataPathRoot + dataPath;
      return dataPath;
    },
    getTitle(context, notHint) {
      const { meta, key, property } = context;
      const title = this.$text(property.ebTitle || key);
      // ignore panel/group/toggle
      const ebType = property.ebType;
      if (ebType === 'panel' || ebType === 'group' || ebType === 'group-flatten' || ebType === 'toggle') return title;
      // only edit
      if (this.validate.readOnly || property.ebReadOnly) return title;
      // hint
      if (!notHint) {
        // config
        const hint = this.getMetaValue(meta, 'hint') || this.$config.validate.hint;
        const hintOptional = hint.optional;
        const hintMust = hint.must;
        // check optional
        if (hintOptional && !property.notEmpty) {
          return `${title}${this.$text(hintOptional)}`;
        }
        // check must
        if (hintMust && property.notEmpty) {
          return `${title}${this.$text(hintMust)}`;
        }
      }
      // default
      return title;
    },
    getPlaceholder(context) {
      const { property } = context;
      if (this.validate.readOnly || property.ebReadOnly) return undefined;
      return property.ebDescription ? this.$text(property.ebDescription) : this.getTitle(context, true);
    },
    onSubmit(event) {
      this.validate.onSubmit(event);
    },
    renderRoot(c) {
      if (!this.validate.data || !this.validate.schema) return c('div');
      // context
      const context = {
        data: this.data || this.validate.data,
        pathParent: this.pathParent,
        schema: this.schema || this.validate.schema,
        properties: this.properties || this.validate.schema.properties,
      };
      const children = this.renderProperties(c, context);
      const attrs = {
        form: true,
        noHairlinesMd: true,
        inlineLabels: !this.$config.form.floatingLabel,
      };
      return c('eb-list', {
        staticClass: 'eb-list-row',
        attrs,
        on: { submit: this.onSubmit },
      }, children);
    },
    renderItem(c) {
      if (!this.validate.data || !this.validate.schema) return c('div');
      // context
      const context = {
        data: this.data || this.validate.data,
        pathParent: this.pathParent,
        schema: this.schema || this.validate.schema,
        properties: this.properties || this.validate.schema.properties,
        key: this.dataKey,
        meta: this.meta,
      };
      context.property = this.property || context.properties[context.key];
      context.dataPath = context.pathParent + context.key;
      return this._renderItem(c, context);
    },
    _renderItem(c, context) {
      const ebType = context.property.ebType;
      // ignore if not specified
      if (!ebType) return null;
      // render
      if (ebType === 'group') {
        // group
        return this.renderGroup(c, context);
      } else if (ebType === 'panel') {
        // panel
        return this.renderPanel(c, context);
      } else if (ebType === 'text') {
        // text
        return this.renderText(c, context);
      } else if (ebType === 'toggle') {
        // toggle
        return this.renderToggle(c, context);
      } else if (ebType === 'select') {
        // select
        return this.renderSelect(c, context);
      } else if (ebType === 'file') {
        // file
        return this.renderFile(c, context);
      } else if (ebType === 'datepicker') {
        // datepicker
        return this.renderDatepicker(c, context);
      } else if (ebType === 'link') {
        // link
        return this.renderLink(c, context);
      } else if (ebType === 'component') {
        // component
        return this.renderComponent(c, context);
      } else if (ebType === 'language') {
        // language
        return this.renderLanguage(c, context);
      } else if (ebType === 'category') {
        // category
        return this.renderCategory(c, context);
      } else if (ebType === 'tags') {
        // tags
        return this.renderTags(c, context);
      } else if (ebType === 'resourceType') {
        // resourceType
        return this.renderResourceType(c, context);
      } else if (ebType === 'json') {
        // json
        return this.renderJson(c, context);
      } else if (ebType === 'currency') {
        // currency
        return this.renderCurrency(c, context);
      }
      // not support
      return c('div', {
        domProps: {
          innerText: `not support: ${ebType}`,
        },
      });
    },
  },
};
