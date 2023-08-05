export default {
  data() {
    return {
      jsonEditorReady: false,
    };
  },
  computed: {
    showCustom() {
      return this.valueMode === 'custom';
    },
    valueCustom() {
      return this.fieldsRight.custom || [];
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      // json editor
      await this.$meta.module.use('a-jsoneditor');
      this.jsonEditorReady = true;
    },
    async onInputValueCustom(value) {
      // set
      this.$set(this.fieldsRight, 'custom', value);
      // emit
      this.$emit('fieldsRightChange');
    },
    _renderListGroupValueCustom_jsonEditor() {
      if (!this.jsonEditorReady) return null;
      return (
        <eb-json-editor
          ref="jsonEditor"
          readOnly={this.mode === 'view'}
          valueType="object"
          value={this.valueCustom}
          onInput={this.onInputValueCustom}
        ></eb-json-editor>
      );
    },
    _renderListGroupValueCustom() {
      if (!this.showCustom) return null;
      return (
        <f7-list-group>
          <f7-list-item group-title title={this.$text('FieldsRightCustom')}></f7-list-item>
          {this._renderListGroupValueCustom_jsonEditor()}
        </f7-list-group>
      );
    },
  },
};
