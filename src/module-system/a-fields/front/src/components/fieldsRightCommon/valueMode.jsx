export default {
  data() {
    return {
      valueModes: [
        { title: 'AllowAllFieldsRead', value: 'allowAllFieldsRead' },
        { title: 'AllowAllFieldsReadWrite', value: 'allowAllFieldsReadWrite' },
        { title: 'AllowSpecificFields', value: 'allowSpecificFields' },
        { title: 'Custom', value: 'custom' },
      ],
    };
  },
  computed: {
    valueMode() {
      return this.fieldsRight.mode || 'allowAllFieldsRead';
    },
  },
  methods: {
    onInputMode(valueMode) {
      this.$set(this.fieldsRight, 'mode', valueMode);
      this.$emit('fieldsRightChange');
    },
    _renderListGroupValueMode() {
      return (
        <f7-list-group>
          <f7-list-item
            class="eb-list-group-title"
            smartSelect={this.mode === 'edit'}
            title={this.$text('Mode')}
            smartSelectParams={{ openIn: 'sheet', closeOnSelect: true }}
          >
            <eb-select
              readOnly={this.mode !== 'edit'}
              name="mode"
              value={this.valueMode}
              onInput={this.onInputMode}
              multiple={false}
              options={this.valueModes}
            ></eb-select>
          </f7-list-item>
        </f7-list-group>
      );
    },
  },
};
