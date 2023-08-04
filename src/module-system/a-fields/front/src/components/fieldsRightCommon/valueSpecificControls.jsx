export default {
  computed: {
    showSpecificControls() {
      return this.valueMode === 'allowSpecificFields';
    },
    specificControlsValue() {
      return this.fieldsRight.specific || [];
    },
  },
  methods: {
    _renderListGroupValueSpecificControls() {
      // if (!this.showSpecificControls) return null;
      return (
        <f7-list-group>
          <f7-list-item class="eb-list-group-title" title={this.$text('FieldsRightSpecificControls')}>
            <div slot="after">
              <eb-button>plus</eb-button>
            </div>
          </f7-list-item>
        </f7-list-group>
      );
    },
  },
};
