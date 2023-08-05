export default {
  computed: {
    showSpecificControls() {
      return this.valueMode === 'allowSpecificFields';
    },
    specificControlsValue() {
      return this.fieldsRight.fields || [];
    },
    selectFieldsSelected() {
      const fields = this.specificControlsValue;
      return fields.map(item => {
        return typeof item === 'string' ? item : item.name;
      });
    },
    selectFieldsOptions() {
      const options = [];
      const properties = this.schemaBase.schema.properties;
      for (const key in properties) {
        const property = properties[key];
        const title = this.__getPropertyTitle({ property, prefixGroup: true });
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
          openIn: 'sheet',
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
    onInputSelectFields(fieldNamesSelected) {
      const fieldsCurrent = this.specificControlsValue;
      const fieldsResult = [];
      const properties = this.schemaBase.schema.properties;
      for (const key in properties) {
        // check in fieldNamesNew
        const indexSelected = fieldNamesSelected.indexOf(key);
        if (indexSelected > -1) {
          const fieldCurrent = fieldsCurrent.find(item => {
            const _key = typeof item === 'string' ? item : item.name;
            return _key === key;
          });
          if (fieldCurrent) {
            fieldsResult.push(fieldCurrent);
          } else {
            fieldsResult.push(key);
          }
        }
      }
      // set
      this.$set(this.fieldsRight, 'fields', fieldsResult);
      // emit
      this.$emit('fieldsRightChange');
    },
    onChangeSpecificControlsField(action, fieldInfo, checked) {
      // switch
      this.__switchFieldActionStatus(fieldInfo, action, checked);
      // change
      const fields = this.specificControlsValue;
      const fieldIndex = fields.findIndex(item => {
        const key = typeof item === 'string' ? item : item.name;
        return key === fieldInfo.name;
      });
      fields.splice(fieldIndex, 1, fieldInfo);
      // set
      this.$set(this.fieldsRight, 'fields', fields);
      // emit
      this.$emit('fieldsRightChange');
    },
    _renderListGroupValueSpecificControls_selectFields() {
      let domAfter;
      if (this.mode === 'edit') {
        domAfter = (
          <div slot="after">
            <eb-button iconF7="::add" propsOnPerform={this.onPerformSelectFields}>
              {this.$text('SelectFields')}
            </eb-button>
            <a ref="selectFields" class="item-link smart-select">
              <eb-select
                name="selectFields"
                readOnly={this.mode === 'view'}
                value={this.selectFieldsSelected}
                onInput={this.onInputSelectFields}
                multiple={true}
                options={this.selectFieldsOptions}
                propsOnGetDisplays={() => {
                  return null;
                }}
              ></eb-select>
            </a>
          </div>
        );
      }
      return (
        <f7-list-item class="eb-list-group-title" title={'2. ' + this.$text('FieldsRightSpecificControls')}>
          {domAfter}
        </f7-list-item>
      );
    },
    _renderListGroupValueSpecificControls_fields() {
      const domRows = [];
      const fields = this.specificControlsValue;
      const properties = this.schemaBase.schema.properties;
      for (const field of fields) {
        let fieldName;
        let fieldInfo;
        if (typeof field === 'string') {
          fieldName = field;
          fieldInfo = { name: fieldName, read: false, write: false };
        } else {
          fieldName = field.name;
          fieldInfo = field;
        }
        const property = properties[fieldName];
        const title = this.__getPropertyTitle({ property });
        domRows.push(
          <tr>
            <th class="label-cell">{title}</th>
            <td class="label-cell">
              <eb-checkbox
                value={fieldInfo.read}
                onInput={value => this.onChangeSpecificControlsField('read', fieldInfo, value)}
                disabled={this.mode === 'view'}
              ></eb-checkbox>
            </td>
            <td class="label-cell">
              <eb-checkbox
                value={fieldInfo.write}
                onInput={value => this.onChangeSpecificControlsField('write', fieldInfo, value)}
                disabled={this.mode === 'view'}
              ></eb-checkbox>
            </td>
          </tr>
        );
      }
      return (
        <f7-list-item>
          <div class="data-table data-table-fields-right-fields">
            <table>
              <thead>
                <tr>
                  <th class="label-cell">{this.$text('FieldsRightProperty_Field')}</th>
                  <th class="label-cell">{this.$text('FieldsRightProperty_AllowRead')}</th>
                  <th class="label-cell">{this.$text('FieldsRightProperty_AllowWrite')}</th>
                </tr>
              </thead>
              <tbody>{domRows}</tbody>
            </table>
          </div>
        </f7-list-item>
      );
    },
    _renderListGroupValueSpecificControls() {
      if (!this.showSpecificControls) return null;
      return (
        <f7-list-group>
          {this._renderListGroupValueSpecificControls_selectFields()}
          {this._renderListGroupValueSpecificControls_fields()}
        </f7-list-group>
      );
    },
  },
};
