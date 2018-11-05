<script>
import validate from '../common/validate.js';
export default {
  name: 'eb-select',
  mixins: [ validate ],
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
    multiple: {
      type: Boolean,
      default: false,
    },
    value: {},
  },
  data() {
    return {
      voptions: null,
    };
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
    setValue() {
      const f7Select = this.$$(this.$el).parents('.smart-select')[0].f7SmartSelect;
      f7Select.setValue();
    },
    onValidateError(error) {
      const panel = this.$$(this.$el).parents('.item-content');
      if (error) {
        panel.addClass('item-panel-invalid');
      } else {
        panel.removeClass('item-panel-invalid');
      }
    },
    prepareOptions() {
      if (this.optionsUrl) {
        this.fetchOptions();
      } else {
        this.changeOptions(this.options);
      }
    },
    changeOptions(options) {
      // concat
      const _options = options ? options.concat() : [];

      // optionsBlankAuto
      if (this.optionsBlankAuto) {
        const opt = _options[0];
        if (!opt || opt.value) {
          _options.unshift({ title: '', value: '' });
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
    fetchOptions() {
      let moduleName;
      let fetchUrl;
      if (this.optionsUrl.charAt(0) === '/') {
        const moduleInfo = this.$meta.util.parseModuleInfo(this.optionsUrl);
        moduleName = moduleInfo.relativeName;
        fetchUrl = this.optionsUrl;
      } else {
        moduleName = this.$page.$module.name;
        fetchUrl = this.$meta.util.combineApiPath(moduleName, this.optionsUrl);
      }
      this.$meta.module.use(moduleName, module => {
        this.$api.post(fetchUrl, this.optionsUrlParams).then(data => {
          this.changeOptions(data);
        });
      });
    },
    onChange(event) {
      let value;
      if (!this.multiple) {
        value = event.target.value;
      } else {
        const f7Select = this.$$(this.$el).parents('.smart-select')[0].f7SmartSelect;
        const options = f7Select.getItemsData();
        value = options.filter(opt => opt.selected).map(opt => opt.value);
      }
      this.$emit('input', value);
      this.clearValidateError();
    },
    getSelectedOptions() {
      if (!this.voptions) return null;
      if (!this.value) return null;
      if (!this.multiple) {
        return this.voptions.find(opt => this.optionValue(opt) == this.value);
      }
      // multiple
      const options = [];
      const value = this.value.findIndex ? this.value : this.value.toString().split(',');
      for (const opt of this.voptions) {
        if (value.findIndex(item => item == this.optionValue(opt)) > -1) {
          options.push(opt);
        }
      }
      return options;
    },
    getDisplays() {
      const options = this.getSelectedOptions();
      if (!options) return null;
      if (!this.multiple) return this.optionDisplay(options);
      return options.map(opt => this.optionDisplay(opt)).join(',');
    },
    optionValue(opt) {
      return opt[this.optionValueKey];
    },
    optionTitle(opt) {
      return opt[this.optionTitleKey];
    },
    optionDisplay(opt) {
      return this.$text(this.optionTitle(opt) || this.optionValue(opt));
    },
  },
  render(c) {
    if (this.readOnly) {
      return c('div', {
        staticClass: 'item-after',
        domProps: { innerText: this.getDisplays() },
      });
    }
    // options
    const options = [];
    if (this.voptions) {
      for (const opt of this.voptions) {
        let selected;
        if (!this.multiple) {
          selected = this.value == this.optionValue(opt); // not use ===
        } else {
          if (!this.value) {
            selected = false;
          } else {
            const value = this.value.findIndex ? this.value : this.value.toString().split(',');
            selected = value.findIndex(item => item == this.optionValue(opt)) > -1;
          }
        }
        options.push(c('option', {
          attrs: {
            value: this.optionValue(opt),
            selected,
          },
          domProps: { innerText: this.optionDisplay(opt) },
        }));
      }
    }
    // select
    return c('select', {
      attrs: {
        multiple: this.multiple ? 'multiple' : false,
      },
      on: {
        change: this.onChange,
      },
    }, options);
  },
};

</script>
<style scoped>
</style>
