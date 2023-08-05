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
      // switch
      this.__switchFieldActionStatus(basic, action, checked);
      // set
      this.$set(this.fieldsRight, 'basic', basic);
      // emit
      this.$emit('fieldsRightChange');
    },
    _renderListGroupValueBasicControls() {
      if (!this.showBasicControls) return null;
      const domCheckboxRead = (
        <eb-checkbox
          value={this.basicControlsValue.read}
          onInput={value => this.onChangeBasicControls('read', value)}
          disabled={this.mode === 'view'}
        ></eb-checkbox>
      );
      const domCheckboxWrite = (
        <eb-checkbox
          value={this.basicControlsValue.write}
          onInput={value => this.onChangeBasicControls('write', value)}
          disabled={this.mode === 'view'}
        ></eb-checkbox>
      );
      return (
        <f7-list-group>
          <f7-list-item class="eb-list-group-title" title={'1. ' + this.$text('FieldsRightBasicControls')}>
            <div slot="after">
              {domCheckboxRead}
              <span>&nbsp;{this.$text('Read')}&nbsp;</span>
              {domCheckboxWrite}
              <span>&nbsp;{this.$text('Write')}</span>
            </div>
          </f7-list-item>
        </f7-list-group>
      );
    },
  },
};
