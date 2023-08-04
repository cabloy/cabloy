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
    onChangeBasicControls(action, checked) {
      const basic = this.basicControlsValue;
      // read/write
      basic[action] = checked;
      // special check for write
      if (action === 'write' && checked) {
        basic.read = true;
      }
      // set
      this.$set(this.fieldsRight, 'basic', basic);
      // emit
      this.$emit('fieldsRightChange');
    },
    _renderListGroupValueBasicControls() {
      // if (!this.showBasicControls) return null;
      return (
        <f7-list-group>
          <f7-list-item class="eb-list-group-title" title={this.$text('FieldsRightBasicControls')}>
            <div slot="after">
              <eb-checkbox
                value={this.basicControlsValue.read}
                onInput={value => this.onChangeBasicControls('read', value)}
              ></eb-checkbox>
              <span>&nbsp;{this.$text('Read')}&nbsp;</span>
              <eb-checkbox
                value={this.basicControlsValue.write}
                onInput={value => this.onChangeBasicControls('write', value)}
              ></eb-checkbox>
              <span>&nbsp;{this.$text('Write')}</span>
            </div>
          </f7-list-item>
        </f7-list-group>
      );
    },
  },
};
