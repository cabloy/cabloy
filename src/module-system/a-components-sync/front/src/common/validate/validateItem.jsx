import validateActionModule from './validateActionModule.js';
import validateComputedValue from './validateComputedValue.js';
import validateComputedDisplay from './validateComputedDisplay.js';
import renderSearchStates from './render/renderSearchStates.jsx';
import renderProperties from './render/renderProperties.jsx';
import renderComponent from './render/renderComponent.jsx';
import renderComponentAction from './render/renderComponentAction.jsx';
import renderGroup from './render/renderGroup.jsx';
import renderPanel from './render/renderPanel.jsx';
import renderText from './render/renderText.jsx';
import renderDatepicker from './render/renderDatepicker.jsx';
import renderDateRange from './render/renderDateRange.jsx';
import renderFile from './render/renderFile.jsx';
import renderToggle from './render/renderToggle.jsx';
import renderSelect from './render/renderSelect.jsx';
import renderLink from './render/renderLink.jsx';
import renderLanguage from './render/renderLanguage.jsx';
import renderCategory from './render/renderCategory.jsx';
import renderTags from './render/renderTags.jsx';
import renderResourceType from './render/renderResourceType.jsx';
import renderJson from './render/renderJson.jsx';
import renderMarkdown from './render/renderMarkdown.jsx';
import renderDetails from './render/renderDetails.jsx';
import renderDetailsStat from './render/renderDetailsStat.jsx';
import renderAtom from './render/renderAtom.jsx';
import renderAtomClass from './render/renderAtomClass.jsx';
import renderDivider from './render/renderDivider.jsx';
import renderUserLabel from './render/renderUserLabel.jsx';

export default {
  mixins: [
    renderSearchStates,
    validateActionModule,
    validateComputedValue,
    validateComputedDisplay,
    renderProperties,
    renderComponent,
    renderComponentAction,
    renderGroup,
    renderPanel,
    renderText,
    renderDatepicker,
    renderDateRange,
    renderFile,
    renderToggle,
    renderSelect,
    renderLink,
    renderLanguage,
    renderCategory,
    renderTags,
    renderResourceType,
    renderJson,
    renderMarkdown,
    renderDetails,
    renderDetailsStat,
    renderAtom,
    renderAtomClass,
    renderDivider,
    renderUserLabel,
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
        parcel,
        name: key,
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
      // typed value
      const _value = this._convertValueType(property, value);

      const _valueOld = parcel.data[key];

      this.$set(parcel.data, key, _value); // always set as maybe Object

      // dataSrc
      //   always set value for !property
      if (!property || property.type) {
        // change src
        this.$set(parcel.dataSrc, key, _value);
        // emit changed
        if (!this._checkIfEqual(_valueOld, _value)) {
          this.$emit('change', _value);
          this.validate.$emit('validateItem:change', key, _value);
          this.validate.$emit('validateItemChange', key, _value);
        }
      }
    },
    _checkIfEqual(value1, value2) {
      if (value1 === value2) return true;
      if (!value1 || !value2) return false;
      // special for date
      if (value1 instanceof Date && value2 instanceof Date && value1.getTime() === value2.getTime()) return true;
      // others
      return false;
    },
    _convertValueType(property, value) {
      if (!property) return value;
      // special for select empty
      if (property.ebType === 'select' && this.checkIfEmptyForSelect(value)) {
        return null; // for distinguish from 0
      }
      // others
      let _value;
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
          _value = parseInt(Number(value));
        }
      } else if (property.type === 'boolean') {
        _value = Boolean(value);
      } else if (property.type === 'string') {
        _value = String(value);
      } else {
        _value = value;
      }
      // ok
      return _value;
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
        let hint = this.validate.host && this.validate.host.hint;
        if (!hint && hint !== false) {
          hint = this.$config.validate.hint;
        }
        if (hint === false) {
          return title;
        }
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
      const patchGetValueGlobal = this.$meta.util.getProperty(this.validate, 'meta.ebPatch.getValue');
      const patchSetValueGlobal = this.$meta.util.getProperty(this.validate, 'meta.ebPatch.setValue');
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
          const propertyName = name || key;
          let value = this.getValue(parcel, propertyName);
          if (patchGetValue && (!name || name === key)) {
            // only patch this
            value = patchGetValue(value);
          }
          if (patchGetValueGlobal) {
            value = patchGetValueGlobal(value, propertyName);
          }
          return value;
        },
        setValue: (value, name) => {
          const propertyName = name || key;
          if (patchSetValueGlobal) {
            value = patchSetValueGlobal(value, propertyName);
          }
          if (patchSetValue && (!name || name === key)) {
            // only patch this
            value = patchSetValue(value);
          }
          this.setValue(parcel, propertyName, value);
        },
      };
      return context;
    },
    renderRoot() {
      if (!this.validate.ready) return <div></div>;
      // context
      const context = {
        parcel: this.getParcel(),
      };
      // renderProperties
      const children = this.renderProperties(context);
      const props = {
        form: true,
        noHairlinesMd: true,
        inlineLabels: !this.$config.form.floatingLabel,
      };
      return (
        <eb-list staticClass="eb-list-row" {...{ props }} onSubmit={this.onSubmit}>
          {children}
        </eb-list>
      );
    },
    renderItem() {
      if (!this.validate.ready) return <div></div>;
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
      return this._renderItem(context);
    },
    _renderItem(context) {
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
        return this.renderGroup(context);
      } else if (ebType === 'panel') {
        // panel
        return this.renderPanel(context);
      } else if (ebType === 'text') {
        // text
        return this.renderText(context);
      } else if (ebType === 'toggle') {
        // toggle
        return this.renderToggle(context);
      } else if (ebType === 'select') {
        // select
        return this.renderSelect(context);
      } else if (ebType === 'file') {
        // file
        return this.renderFile(context);
      } else if (ebType === 'datepicker') {
        // datepicker
        return this.renderDatepicker(context);
      } else if (ebType === 'dateRange') {
        // dateRange
        return this.renderDateRange(context);
      } else if (ebType === 'link') {
        // link
        return this.renderLink(context);
      } else if (ebType === 'component') {
        // component
        return this.renderComponent(context);
      } else if (ebType === 'component-action') {
        // component-action
        return this.renderComponentAction(context);
      } else if (ebType === 'language') {
        // language
        return this.renderLanguage(context);
      } else if (ebType === 'category') {
        // category
        return this.renderCategory(context);
      } else if (ebType === 'tags') {
        // tags
        return this.renderTags(context);
      } else if (ebType === 'resourceType') {
        // resourceType
        return this.renderResourceType(context);
      } else if (ebType === 'json') {
        // json
        return this.renderJson(context);
      } else if (ebType === 'markdown') {
        // json
        return this.renderMarkdown(context);
      } else if (ebType === 'markdown-content') {
        // json
        return this.renderMarkdownContent(context);
      } else if (ebType === 'markdown-content-cms') {
        // json
        return this.renderMarkdownContentCms(context);
      } else if (ebType === 'details') {
        // details
        return this.renderDetails(context);
      } else if (ebType === 'detailsStat') {
        // details
        return this.renderDetailsStat(context);
      } else if (ebType === 'atom') {
        // atom
        return this.renderAtom(context);
      } else if (ebType === 'atomClass') {
        // atomClass
        return this.renderAtomClass(context);
      } else if (ebType === 'divider') {
        // divider
        return this.renderDivider(context);
      } else if (ebType === 'userLabel') {
        // userLabel
        return this.renderUserLabel(context);
      }
      // not support
      return <div>{`not support: ${ebType}`}</div>;
    },
    _handleComputedDisplay(parcel, key, property) {
      // check if specify ebDisplay
      const ebDisplay = property.ebDisplay;
      if (!ebDisplay) return true;
      // check host.stage
      if (!this._handleComputedDisplay_checkHost(ebDisplay, 'stage')) {
        return false;
      }
      // check host.mode
      if (!this._handleComputedDisplay_checkHost(ebDisplay, 'mode')) {
        return false;
      }
      // check if specify expression
      if (!ebDisplay.expression) {
        return true;
      }
      // try to register always, for maybe disposed when parcel changed
      this.__computed_display.register({
        parcel,
        name: key,
        expression: ebDisplay.expression,
        dependencies: ebDisplay.dependencies,
        immediate: true, // always
      });
      // check current value
      return !!this.__computed_display_getValue(parcel, key);
    },
    _handleComputedDisplay_checkHost(ebDisplay, attr) {
      const hostAttr = ebDisplay.host && ebDisplay.host[attr];
      if (!hostAttr) return true;
      const current = this.validate.host && this.validate.host[attr];
      return current === hostAttr;
    },
  },
};
