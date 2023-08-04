export default {
  computed: {
    showBasicControls() {
      return this.valueMode === 'allowSpecificFields';
    },
  },
  methods: {
    _renderListGroupValueBasicControls() {
      // if (!this.showBasicControls) return null;
      return (
        <f7-list-group>
          <f7-list-item group-title title={this.$text('FieldsRightBasicControls')}>
            <div slot="after">ssss</div>
          </f7-list-item>
        </f7-list-group>
      );
    },
  },
};
