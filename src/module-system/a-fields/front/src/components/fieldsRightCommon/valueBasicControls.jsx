export default {
  computed: {
    showBasicControls() {
      return this.valueMode === 'allowSpecificFields';
    },
    basicControlsValue() {
      return this.fieldsRight.basic || { read: true, write: false };
    },
  },
  methods: {
    onChangeBasicControlsRead(value) {
      const basic = this.basicControlsValue;
      basic.read = value;
      this.$set(this.fieldsRight, 'basic', basic);
      this.$emit('fieldsRightChange');
    },
    _renderListGroupValueBasicControls() {
      // if (!this.showBasicControls) return null;
      return (
        <f7-list-group>
          <f7-list-item class="eb-list-group-title" title={this.$text('FieldsRightBasicControls')}>
            <div slot="after">
              <eb-checkbox value={this.basicControlsValue.read} onInput={this.onChangeBasicControlsRead}></eb-checkbox>
              <span>&nbsp;Read</span>
            </div>
          </f7-list-item>
        </f7-list-group>
      );
    },
  },
};
