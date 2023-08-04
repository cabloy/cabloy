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
    onPerformSelectFields() {
      const domSelect = this.$refs.selectFields;
      const ssParams = this.$utils.extend(
        {
          el: domSelect,
        },
        {
          openIn: 'page',
          closeOnSelect: false,
          formatValueText: () => {
            return null;
          },
        }
      );
      this.f7SmartSelectFields = this.$f7.smartSelect.create(ssParams);
      this.f7SmartSelectFields.open();
    },
    _renderListGroupValueSpecificControls() {
      // if (!this.showSpecificControls) return null;
      return (
        <f7-list-group>
          <f7-list-item class="eb-list-group-title" title={this.$text('FieldsRightSpecificControls')}>
            <div slot="after">
              <eb-button iconF7="::add" propsOnPerform={this.onPerformSelectFields}>
                {this.$text('SelectFields')}
              </eb-button>
              <a ref="selectFields" class="item-link smart-select">
                <eb-select
                  name="selectFields"
                  readOnly={this.mode !== 'edit'}
                  value={this.valueMode}
                  onInput={this.onInputMode}
                  multiple={false}
                  options={this.valueModes}
                ></eb-select>
              </a>
            </div>
          </f7-list-item>
        </f7-list-group>
      );
    },
  },
};
