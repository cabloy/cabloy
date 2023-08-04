export default {
  computed: {
    showSpecificControls() {
      return this.valueMode === 'allowSpecificFields';
    },
    specificControlsValue() {
      return this.fieldsRight.fields || [];
    },
    selectOptionsFields() {
      const options = [];
      const properties = this.schemaBase.schema.properties;
      for (const key in properties) {
        const property = properties[key];
        const title = this.__getPropertyTitle({ property });
        if (title) {
          options.push({
            title,
            value: key,
          });
        }
      }
      return options;
    },
  },
  beforeDestroy() {
    if (this.f7SmartSelectFields) {
      this.f7SmartSelectFields.destroy();
      this.f7SmartSelectFields = null;
    }
  },
  methods: {
    onPerformSelectFields() {
      if (!this.f7SmartSelectFields) {
        const domSelect = this.$refs.selectFields;
        const smartSelectParams = {
          el: domSelect,
          openIn: 'page',
          closeOnSelect: false,
          formatValueText: () => {
            return null;
          },
          pageTitle: this.$text('SelectFields'),
        };
        this.f7SmartSelectFields = this.$f7.smartSelect.create(smartSelectParams);
      }
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
                  multiple={true}
                  options={this.selectOptionsFields}
                  propsOnGetDisplays={() => {
                    return null;
                  }}
                ></eb-select>
              </a>
            </div>
          </f7-list-item>
        </f7-list-group>
      );
    },
  },
};
