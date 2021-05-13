import validateComputedValue from './validateComputedValue.js';
import validateComputedDisplay from './validateComputedDisplay.js';
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
import renderDetails from './render/renderDetails.js';
import renderDetailsStat from './render/renderDetailsStat.js';
import renderAtom from './render/renderAtom.js';
import renderAtomClass from './render/renderAtomClass.js';

export default {
  mixins: [
    validateComputedValue,
    validateComputedDisplay,
    renderProperties, renderComponent, renderGroup, renderPanel, renderText,
    renderDatepicker, renderFile, renderToggle, renderSelect, renderLink,
    renderLanguage, renderCategory, renderTags, renderResourceType,
    renderJson, renderDetails, renderDetailsStat,
    renderAtom, renderAtomClass,
  ],
  props: {
    parcel: {
      type: Object,
    },
    dataKey: {
      type: String,
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
  watch: {
    parcel() {
      this.parcelChanged();
    },
  },
  created() {
    this.validate = this.getValidate();
  },
  beforeDestroy() {
    this.validate = null;
  },
  methods: {
    parcelChanged() {
      this.__computed_value_init();
      this.__computed_display_init();
    },
    getValidate() {
      let parent = this.$parent;
      while (parent) {
        if (parent.$options._componentTag === 'eb-validate') break;
        parent = parent.$parent;
      }
      return parent;
    },
    _handleComputedValue(parcel, key, property) {
      const ebComputed = property.ebComputed;
      if (!ebComputed) return;
      this.__computed_value.register({
        parcel, name: key,
        expression: ebComputed.expression,
        dependencies: ebComputed.dependencies,
        immediate: ebComputed.immediate,
      });
    },
    getValue(parcel, key) {
      const property = parcel.properties[key];
      const _value = parcel.data[key];
      if (!property) {
        return _value;
      }
      this._handleComputedValue(parcel, key, property);
      if (!this.checkIfEmptyForSelect(_value)) return _value;
      if (this.checkIfEmptyForSelect(property.default)) return _value;
      return property.default;
    },
    setValue(parcel, key, value) {
      let property;
      if (parcel === this.parcel && key === this.dataKey && this.property) {
        property = this.property;
      } else {
        property = parcel.properties[key];
      }
      // value
      let _value;
      if (!property) {
        _value = value;
      } else {
        if (property.ebType === 'select' && this.checkIfEmptyForSelect(value)) {
          _value = null; // for distinguish from 0
        } else {
          if (property.type === 'number') {
            if (isNaN(value)) {
              _value = value;
            } else {
              _value = Number(value);
            }
          } else if (property.type === 'integer') {
            if (isNaN(value)) {
              _value = value;
            } else {
              _value = parseInt(value);
            }
          } else if (property.type === 'boolean') {
            _value = Boolean(value);
          } else {
            _value = value;
          }
        }
      }

      const _valueOld = parcel.data[key];

      this.$set(parcel.data, key, _value); // always set as maybe Object

      // dataSrc
      //   always set value for !property
      if (!property || property.type) {
        this.$set(parcel.dataSrc, key, _value);
      }

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
      const { property } = context;
      // not use 'key' as default title
      let title = property.ebTitle || '';
      if (title) {
        title = this.$text(title);
      }
      // ignore panel/group/toggle
      const ebType = property.ebType;
      if (ebType === 'panel' || ebType === 'group' || ebType === 'group-flatten' || ebType === 'toggle') return title;
      // only edit
      if (this.validate.readOnly || property.ebReadOnly) return title;
      // hint
      if (!notHint) {
        // config
        const hint = (this.validate.host && this.validate.host.hint) || this.$config.validate.hint;
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
    getParcel() {
      return this.parcel || this.validate.parcel;
    },
    _combinePropertyMeta({ property, meta, dataPath }) {
      const metaValidateProperty = this.$meta.util.getProperty(this.validate, `meta.properties.${dataPath}`);
      if (!metaValidateProperty && !meta) return property;
      return this.$meta.util.extend({}, property, metaValidateProperty, meta);
    },
    getContext({ parcel, key, property, meta }) {
      // dataPath
      const dataPath = parcel.pathParent + key;
      // property
      property = this._combinePropertyMeta({ property, meta, dataPath });
      // patch getValue/setValue
      const patchGetValue = this.$meta.util.getProperty(property, 'ebPatch.getValue');
      const patchSetValue = this.$meta.util.getProperty(property, 'ebPatch.setValue');
      // context
      const context = {
        validate: this.validate,
        validateItem: this,
        parcel,
        key,
        property,
        dataPath,
        meta,
        getTitle: notHint => {
          return this.getTitle(context, notHint);
        },
        getValue: name => {
          let value = this.getValue(parcel, name || key);
          if (patchGetValue && (!name || name === key)) {
            // only patch this
            value = patchGetValue(value);
          }
          return value;
        },
        setValue: (value, name) => {
          if (patchSetValue && (!name || name === key)) {
            // only patch this
            value = patchSetValue(value);
          }
          this.setValue(parcel, name || key, value);
        },
      };
      return context;
    },
    renderRoot(c) {
      if (!this.validate.ready) return c('div');
      // context
      const context = {
        parcel: this.getParcel(),
      };
      // renderProperties
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
      if (!this.validate.ready) return c('div');
      // context
      const parcel = this.getParcel();
      const key = this.dataKey;
      const context = this.getContext({
        parcel,
        key,
        property: this.property || parcel.properties[key],
        meta: this.meta,
      });
      // renderItem
      return this._renderItem(c, context);
    },
    _renderItem(c, context) {
      const { parcel, key, property } = context;
      // ebType
      const ebType = property.ebType;
      // ignore if not specified
      if (!ebType) return null;
      // ebDisplay
      if (!this._handleComputedDisplay(parcel, key, property)) {
        return null;
      }
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
      } else if (ebType === 'details') {
        // details
        return this.renderDetails(c, context);
      } else if (ebType === 'detailsStat') {
        // details
        return this.renderDetailsStat(c, context);
      } else if (ebType === 'atom') {
        // atom
        return this.renderAtom(c, context);
      } else if (ebType === 'atomClass') {
        // atomClass
        return this.renderAtomClass(c, context);
      }
      // not support
      return c('div', {
        domProps: {
          innerText: `not support: ${ebType}`,
        },
      });
    },
    _handleComputedDisplay(parcel, key, property) {
      // check if specify ebDisplay
      const ebDisplay = property.ebDisplay;
      if (!ebDisplay) return true;
      // check host.mode
      if (!this._handleComputedDisplay_checkHostMode(ebDisplay)) {
        return false;
      }
      // check if specify expression
      if (!ebDisplay.expression) {
        return true;
      }
      // try to register always, for maybe disposed when parcel changed
      this.__computed_display.register({
        parcel, name: key,
        expression: ebDisplay.expression,
        dependencies: ebDisplay.dependencies,
        immediate: true, // always
      });
      // check current value
      return !!this.__computed_display_getValue(parcel, key);
    },
    _handleComputedDisplay_checkHostMode(ebDisplay) {
      const hostMode = ebDisplay.host && ebDisplay.host.mode;
      if (!hostMode) return true;
      const modeCurrent = this.validate.host && this.validate.host.mode;
      return modeCurrent === hostMode;
    },
  },
};
