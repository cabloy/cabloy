import Vue from 'vue';
export default {
  meta: {
    global: false,
  },
  props: {
    context: {
      type: Object,
    },
    readOnly: {
      type: Boolean,
    },
    mode: {
      type: String,
    },
    valueSchema: {
      type: Object,
    },
    schemaReference: {
      type: Object,
    },
  },
  data() {
    return {
      valueMode: 0,
      valueModes: [
        { title: 'Allow All Fields', value: 1 },
        { title: 'Disable All Fields', value: 2 },
        { title: 'Allow Specific Fields', value: 3 },
        { title: 'Custom', value: 4 },
      ],
      valueMode4: null,
    };
  },
  created() {
    this.__init();
  },
  methods: {
    __init() {
      // valueMode
      this.__init_valueMode();
    },
    __init_valueMode() {
      const value = this.valueSchema[this.mode];
      if (!value) {
        this.valueMode = 2;
      } else if (value === true) {
        this.valueMode = 1;
      } else if (Array.isArray(value)) {
        this.valueMode = 3;
      } else {
        this.valueMode = 4;
        this.valueMode4 = window.JSON5.stringify(value, null, 2);
      }
    },
    onInputMode(valueMode) {
      // valueMode
      valueMode = parseInt(valueMode);
      this.valueMode = valueMode;
      // value new
      const valueOld = this.valueSchema[this.mode];
      let value;
      if (valueMode === 1) {
        value = true;
      } else if (valueMode === 2) {
        value = false;
      } else if (valueMode === 3) {
        if (!Array.isArray(valueOld)) {
          value = [];
        }
      } else if (valueMode === 4) {
        this.valueMode4 = window.JSON5.stringify(valueOld, null, 2);
      }
      // change
      if (value !== undefined) {
        this.valueSchema[this.mode] = value;
      }
    },
    onPerformAdd() {

    },
    onInputValueMode4(data) {
      this.valueMode4 = data;
      this._onInputValueMode4Delay(data);
    },
    _onInputValueMode4Delay: Vue.prototype.$meta.util.debounce(function(data) {
      try {
        this.valueSchema[this.mode] = window.JSON5.parse(data);
      } catch (err) {
        this.$view.toast.show({ text: err.message });
      }
    }, 1000),
    renderMode_3() {
      if (this.valueMode !== 3) return null;
      return (
        <f7-list-group>
          <f7-list-item group-title>
            <div class="display-flex justify-content-space-between">
              <div></div>
              <eb-link iconMaterial='add' propsOnPerform={this.onPerformAdd}></eb-link>
            </div>
          </f7-list-item>
        </f7-list-group>
      );
    },
    renderMode_4() {
      if (this.valueMode !== 4) return null;
      return (
        <f7-list-group>
          <f7-list-item>
            <eb-input slot="inner" type="textarea" resizable style={ { width: '100%' } } class="json-textarea" value={this.valueMode4} onInput={this.onInputValueMode4}></eb-input>
          </f7-list-item>
        </f7-list-group>
      );
    },
  },
  render() {
    return (
      <eb-list form inline-labels no-hairlines-md>
        <f7-list-group>
          <f7-list-item smartSelect title={this.$text('Mode')} smartSelectParams={ { openIn: 'sheet', closeOnSelect: true } }>
            <eb-select name="mode" value={this.valueMode} onInput={this.onInputMode} multiple={false} options={this.valueModes}></eb-select>
          </f7-list-item>
        </f7-list-group>
        {this.renderMode_3()}
        {this.renderMode_4()}
      </eb-list>
    );
  },
};
