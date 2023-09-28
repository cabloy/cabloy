import validateCheck from '../common/validate/validateCheck.js';
export default {
  meta: {
    global: true,
  },
  name: 'eb-select',
  mixins: [validateCheck],
  props: {
    readOnly: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
    },
    optionsUrl: {
      type: String,
    },
    optionsUrlParams: {
      type: Object,
    },
    optionsBlankAuto: {
      type: Boolean,
      default: false,
    },
    optionTitleKey: {
      type: String,
      default: 'title',
    },
    optionValueKey: {
      type: String,
      default: 'value',
    },
    optionIconKey: {
      type: String,
      default: 'icon',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    value: {},
    onGetDisplays: {
      type: Function,
    },
  },
  data() {
    return {
      voptions: null,
      valueSetting: false,
    };
  },
  computed: {
    group() {
      return this.checkIfGroup(this.voptions);
    },
  },
  watch: {
    options() {
      this.$nextTick(() => {
        this.prepareOptions();
      });
    },
    optionsUrl() {
      this.$nextTick(() => {
        this.prepareOptions();
      });
    },
    value() {
      this.$nextTick(() => {
        this.setValue();
      });
    },
  },
  mounted() {
    this.prepareOptions();
  },
  methods: {
    checkIfGroup(options) {
      if (!options || options.length === 0) return false;
      return options[0].options;
    },
    setValue() {
      this.valueSetting = true;
      //
      const $select = this.$$(this.$el).parents('.smart-select');
      if ($select.length > 0) {
        const f7Select = $select[0].f7SmartSelect;
        if (f7Select) {
          f7Select.setValue(this.value);
        }
      } else {
        const text = this.getDisplays();
        this.$$(this.$el).text(text);
      }
      //
      this.valueSetting = false;
    },
    onValidateError(error) {
      const panel = this.$$(this.$el).parents('.item-content');
      if (error) {
        panel.addClass('item-panel-invalid');
      } else {
        panel.removeClass('item-panel-invalid');
      }
    },
    async prepareOptions() {
      if (this.optionsUrl) {
        await this.fetchOptions();
      } else {
        await this.changeOptions(this.options);
      }
    },
    async changeOptions(options) {
      // extend
      const _options = this.$meta.util.extend([], options);
      await this._changeOptions_handle(_options);
      // optionsBlankAuto
      if (this.optionsBlankAuto) {
        const optEmpty = {
          [this.optionTitleKey]: '',
          [this.optionValueKey]: '',
        };
        if (_options[0] && _options[0].options) {
          // group
          _options.unshift({
            title: 'Empty',
            options: [optEmpty],
          });
        } else {
          const opt = _options[0];
          if (!opt || !this.equal(this.optionValue(opt), '')) {
            _options.unshift(optEmpty);
          }
        }
      }

      // hold
      this.voptions = _options;

      // readOnly
      if (this.readOnly) return;

      this.$nextTick(() => {
        this.setValue();
      });
    },
    async _changeOptions_handle_option(option) {
      const icon = this.optionIcon(option);
      const iconF7 = icon?.f7;
      if (iconF7) {
        option._iconF7 = await this.$meta.util.combineIcon({ f7: iconF7 });
      }
    },
    async _changeOptions_handle(options) {
      const isGroup = this.checkIfGroup(options);
      // not group
      if (!isGroup) {
        for (const option of options) {
          await this._changeOptions_handle_option(option);
        }
        return;
      }
      // group
      for (const group of options) {
        for (const option of group.options) {
          await this._changeOptions_handle_option(option);
        }
      }
    },
    async fetchOptions() {
      let moduleName;
      let fetchUrl;
      if (this.optionsUrl.charAt(0) === '/') {
        const moduleInfo = this.$meta.util.parseModuleInfo(this.optionsUrl);
        moduleName = moduleInfo.relativeName;
        fetchUrl = this.optionsUrl;
      } else {
        moduleName = this.$pageContainer.$module.name;
        fetchUrl = this.$meta.util.combineApiPath(moduleName, this.optionsUrl);
      }
      await this.$meta.module.use(moduleName);
      const data = await this.$api.post(fetchUrl, this.optionsUrlParams);
      await this.changeOptions(data);
    },
    onChange(event) {
      if (this.valueSetting) return;
      let value;
      if (!this.multiple) {
        value = event.currentTarget.value;
      } else {
        const f7Select = this.$$(this.$el).parents('.smart-select')[0].f7SmartSelect;
        const options = f7Select.getItemsData();
        value = options.filter(opt => opt.selected).map(opt => opt.value);
      }
      this.$emit('input', value);
      this.clearValidateError();
    },
    findOption(value) {
      if (!this.group) {
        return this.voptions.find(opt => this.equal(this.optionValue(opt), value));
      }
      // group
      let option;
      for (const group of this.voptions) {
        option = group.options.find(opt => this.equal(this.optionValue(opt), value));
        if (option) break;
      }
      return option;
    },
    findOptions(values) {
      values = Array.isArray(values) ? values : values.toString().split(',');
      if (!this.group) {
        const options = [];
        for (const opt of this.voptions) {
          if (values.findIndex(item => this.equal(item, this.optionValue(opt))) > -1) {
            options.push(opt);
          }
        }
        return options;
      }
      // group
      const options = [];
      for (const group of this.voptions) {
        for (const opt of group.options) {
          if (values.findIndex(item => this.equal(item, this.optionValue(opt))) > -1) {
            options.push(opt);
          }
        }
      }
      return options;
    },
    getSelectedOptions() {
      if (!this.voptions) return null;
      // only check empty for multiple
      if (this.multiple && this.checkIfEmptyForSelect(this.value)) return null;
      if (!this.multiple) {
        return this.findOption(this.value);
      }
      return this.findOptions(this.value);
    },
    getDisplays() {
      const options = this.getSelectedOptions();
      if (!options) return null;
      if (this.onGetDisplays) {
        return this.onGetDisplays({ options });
      }
      if (!this.multiple) return this.optionDisplay(options);
      return options.map(opt => this.optionDisplay(opt)).join(',');
    },
    optionValue(opt) {
      return opt[this.optionValueKey];
    },
    optionTitle(opt) {
      return opt[this.optionTitleKey];
    },
    optionIcon(opt) {
      return opt[this.optionIconKey];
    },
    optionDisplay(opt) {
      const text = this.optionTitle(opt) || this.optionValue(opt);
      return text ? this.$text(text) : null;
    },
    checkIfEmptyForSelect(value) {
      return value === '' || value === undefined || value === null;
    },
    adjustToString(value) {
      // undefined / null / '' , except 0/false
      if (this.checkIfEmptyForSelect(value)) return '';
      return String(value);
    },
    equal(valueFrom, valueTo) {
      const valueFrom2 = this.adjustToString(valueFrom);
      const valueTo2 = this.adjustToString(valueTo);
      return valueFrom2 === valueTo2;
    },
    _renderOptions(c, opts) {
      const options = [];
      for (const opt of opts) {
        let selected;
        if (!this.multiple) {
          selected = this.equal(this.value, this.optionValue(opt));
        } else {
          if (!this.value) {
            selected = false;
          } else {
            const value = this.value.findIndex ? this.value : this.value.toString().split(',');
            selected = value.findIndex(item => this.equal(item, this.optionValue(opt))) > -1;
          }
        }
        const attrs = {
          value: this.optionValue(opt),
          selected,
        };
        const icon = opt._iconF7;
        if (icon) {
          attrs['data-option-icon'] = icon;
        }
        options.push(
          c('option', {
            key: this.optionValue(opt),
            attrs,
            domProps: { innerText: this.optionDisplay(opt) },
          })
        );
      }
      return options;
    },
    _renderGroups(c, groups) {
      const options = [];
      for (const group of groups) {
        const _options = this._renderOptions(c, group.options);
        options.push(
          c(
            'optgroup',
            {
              key: this.optionTitle(group),
              attrs: {
                label: this.optionDisplay(group),
              },
            },
            _options
          )
        );
      }
      return options;
    },
  },
  render(c) {
    if (this.readOnly) {
      const text = this.getDisplays();
      return c('div', {
        domProps: { innerText: text },
      });
    }
    // options
    let options;
    if (this.voptions) {
      if (!this.group) {
        options = this._renderOptions(c, this.voptions);
      } else {
        options = this._renderGroups(c, this.voptions);
      }
    }
    // select
    return c(
      'select',
      {
        attrs: {
          multiple: this.multiple ? 'multiple' : false,
        },
        on: {
          change: this.onChange,
        },
      },
      options
    );
  },
};
