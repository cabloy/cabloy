export default {
  meta: {
    global: false,
  },
  props: {
    context: {
      type: Object,
    },
    readOnly: {
      type: Boolean,
    },
    mode: {
      type: String,
    },
    valueSchema: {
      type: Object,
    },
    schemaReference: {
      type: Object,
    },
  },
  data() {
    return {
      valueMode: 0,
      valueModes: [
        { title: 'Allow All Fields', value: 1 },
        { title: 'Disable All Fields', value: 2 },
        { title: 'Allow Specific Fields', value: 3 },
        { title: 'Custom', value: 4 },
      ],
      valueMode4: null,
    };
  },
  computed: {
    mode3SelectValue() {
      if (this.valueMode !== 3) return null;
      const value = this.valueSchema[this.mode];
      return value.map(item => {
        const isCustom = item && typeof item === 'object';
        const key = isCustom ? item.name : item;
        return key;
      });
    },
    mode3Items() {
      if (this.valueMode !== 3) return null;
      const value = this.valueSchema[this.mode];
      const properties = this.schemaReference.schema.properties;
      return value.map(item => {
        const isCustom = item && typeof item === 'object';
        // key
        const key = isCustom ? item.name : item;
        // property
        const property = properties[key];
        // title
        let title;
        if (isCustom && item.property.ebTitle) {
          title = this.__getPropertyTitle({ key, property: item.property });
        } else {
          title = property ? this.__getPropertyTitle({ key, property }) : key;
        }
        // icon
        let icon;
        if (isCustom && item.property.ebType) {
          icon =
            item.property.ebType === 'group-flatten' || item.property.ebType === 'group'
              ? '::menu'
              : '::radio-button-unchecked';
        } else {
          icon = property
            ? property.ebType === 'group-flatten' || property.ebType === 'group'
              ? '::menu'
              : '::radio-button-unchecked'
            : '::radio-button-unchecked';
        }
        // ok
        return { key, title, icon: { f7: icon } };
      });
    },
    mode3SelectOptions() {
      const options = [];
      const properties = this.schemaReference.schema.properties;
      for (const key in properties) {
        const property = properties[key];
        const title = this.__getPropertyTitle({ key, property });
        options.push({
          title,
          value: key,
        });
      }
      return options;
    },
  },
  created() {
    this._onInputValueMode4Delay = this.$meta.util.debounce(data => {
      this.__onInputValueMode4Delay(data);
    }, 1000);
    // init
    this.__init();
  },
  methods: {
    __init() {
      // valueMode
      this.__init_valueMode();
    },
    __init_valueMode() {
      const value = this.valueSchema[this.mode];
      if (!value) {
        this.valueMode = 2;
      } else if (value === true) {
        this.valueMode = 1;
      } else if (Array.isArray(value)) {
        this.valueMode = 3;
      } else {
        this.valueMode = 4;
        this.valueMode4 = window.JSON5.stringify(value, null, 2);
      }
    },
    onInputMode(valueMode) {
      // valueMode
      valueMode = parseInt(valueMode);
      this.valueMode = valueMode;
      // value new
      const valueOld = this.valueSchema[this.mode];
      let value;
      if (valueMode === 1) {
        value = true;
      } else if (valueMode === 2) {
        value = false;
      } else if (valueMode === 3) {
        if (!Array.isArray(valueOld)) {
          value = [];
        }
      } else if (valueMode === 4) {
        this.valueMode4 = window.JSON5.stringify(valueOld, null, 2);
      }
      // change
      if (value !== undefined) {
        // eslint-disable-next-line
        this.valueSchema[this.mode] = value;
      }
    },
    __getPropertyTitle({ key, property }) {
      const title = property.ebTitle ? this.$text(property.ebTitle) : key;
      if (property.ebType === 'group-flatten' || property.ebType === 'group') {
        return `-- ${title} --`;
      }
      return title;
    },
    __findProperty({ key }) {
      const value = this.valueSchema[this.mode];
      const index = value.findIndex(item => {
        return item === key || (item && item.name === key);
      });
      return [index, index === -1 ? null : value[index]];
    },
    onInputMode3(keys) {
      const value = this.valueSchema[this.mode];
      const properties = this.schemaReference.schema.properties;
      for (const key in properties) {
        const indexSelected = keys.indexOf(key);
        const [index] = this.__findProperty({ key });
        if (indexSelected > -1 && index === -1) {
          value.push(key);
        } else if (indexSelected === -1 && index > -1) {
          value.splice(index, 1);
        }
      }
    },
    onPerformRemoveMode3(event, mode3Item, index) {
      const value = this.valueSchema[this.mode];
      value.splice(index, 1);
      this.$meta.util.swipeoutClose(event.currentTarget);
    },
    onPerformMoveUpMode3(event, mode3Item, index) {
      const value = this.valueSchema[this.mode];
      if (index > 0) {
        const item = value.splice(index, 1);
        value.splice(index - 1, 0, item[0]);
      }
      this.$meta.util.swipeoutClose(event.currentTarget);
    },
    onPerformMoveDownMode3(event, mode3Item, index) {
      const value = this.valueSchema[this.mode];
      if (index < value.length - 1) {
        const item = value.splice(index + 1, 1);
        value.splice(index, 0, item[0]);
      }
      this.$meta.util.swipeoutClose(event.currentTarget);
    },
    onInputValueMode4(data) {
      this.valueMode4 = data;
      this._onInputValueMode4Delay(data);
    },
    __onInputValueMode4Delay(data) {
      try {
        // eslint-disable-next-line
        this.valueSchema[this.mode] = window.JSON5.parse(data);
      } catch (err) {
        this.$view.toast.show({ text: err.message });
      }
    },
    renderMode_3_item(mode3Item, index) {
      // domMedia
      const domMedia = (
        <f7-icon
          material={mode3Item.icon && mode3Item.icon.material}
          f7={mode3Item.icon && mode3Item.icon.f7}
          slot="media"
        ></f7-icon>
      );
      // domTitle
      const domTitle = (
        <div slot="title" class="title">
          <div>{mode3Item.title}</div>
        </div>
      );
      // ok
      return (
        <eb-list-item class="item" key={index} swipeout={!this.readOnly}>
          {domMedia}
          {domTitle}
          {this.renderMode_3_itemContextMenu(mode3Item, index)}
        </eb-list-item>
      );
    },
    renderMode_3_itemContextMenu_left(mode3Item, index) {
      // domRight
      const domActions = [];
      domActions.push(
        <div key="moveUp" color="teal" propsOnPerform={event => this.onPerformMoveUpMode3(event, mode3Item, index)}>
          <f7-icon slot="media" f7="::arrow-up"></f7-icon>
          {this.$device.desktop && <div slot="title">{this.$text('Move Up')}</div>}
        </div>
      );
      domActions.push(
        <div key="moveDown" color="blue" propsOnPerform={event => this.onPerformMoveDownMode3(event, mode3Item, index)}>
          <f7-icon slot="media" f7="::arrow-down"></f7-icon>
          {this.$device.desktop && <div slot="title">{this.$text('Move Down')}</div>}
        </div>
      );
      return <div slot="left">{domActions}</div>;
    },
    renderMode_3_itemContextMenu_right(mode3Item, index) {
      // domRight
      const domActions = [];
      domActions.push(
        <div key="remove" color="red" propsOnPerform={event => this.onPerformRemoveMode3(event, mode3Item, index)}>
          <f7-icon slot="media" f7="::delete"></f7-icon>
          {this.$device.desktop && <div slot="title">{this.$text('Remove')}</div>}
        </div>
      );
      return <div slot="right">{domActions}</div>;
    },
    renderMode_3_itemContextMenu(mode3Item, index) {
      if (this.readOnly) return null;
      return (
        <eb-context-menu>
          {this.renderMode_3_itemContextMenu_left(mode3Item, index)}
          {this.renderMode_3_itemContextMenu_right(mode3Item, index)}
        </eb-context-menu>
      );
    },
    renderMode_3() {
      if (this.valueMode !== 3) return null;
      // group
      let domGroup;
      if (!this.readOnly) {
        domGroup = (
          <f7-list-item group-title>
            <f7-list-item
              smartSelect
              title={this.$text('Select Fields')}
              smartSelectParams={{
                openIn: 'page',
                closeOnSelect: false,
                formatValueText: () => {
                  return null;
                },
              }}
            >
              <eb-select
                name="mode3Select"
                value={this.mode3SelectValue}
                onInput={this.onInputMode3}
                multiple={true}
                options={this.mode3SelectOptions}
                propsOnGetDisplays={() => {
                  return null;
                }}
              ></eb-select>
            </f7-list-item>
          </f7-list-item>
        );
      }
      // children
      const children = [];
      for (let index = 0; index < this.mode3Items.length; index++) {
        children.push(this.renderMode_3_item(this.mode3Items[index], index));
      }
      return (
        <f7-list-group>
          {domGroup}
          {children}
        </f7-list-group>
      );
    },
    renderMode_4() {
      if (this.valueMode !== 4) return null;
      return (
        <f7-list-group>
          <f7-list-item>
            <eb-input
              slot="inner"
              type="textarea"
              readonly={this.readOnly}
              resizable
              style={{ width: '100%' }}
              class="json-textarea"
              value={this.valueMode4}
              onInput={this.onInputValueMode4}
            ></eb-input>
          </f7-list-item>
        </f7-list-group>
      );
    },
  },
  render() {
    return (
      <eb-list form inline-labels no-hairlines-md>
        <f7-list-group>
          <f7-list-item
            smartSelect={!this.readOnly}
            title={this.$text('Mode')}
            smartSelectParams={{ openIn: 'sheet', closeOnSelect: true }}
          >
            <eb-select
              readOnly={this.readOnly}
              name="mode"
              value={this.valueMode}
              onInput={this.onInputMode}
              multiple={false}
              options={this.valueModes}
            ></eb-select>
          </f7-list-item>
        </f7-list-group>
        {this.renderMode_3()}
        {this.renderMode_4()}
      </eb-list>
    );
  },
};
