<script>
import widgetPropertyEditDynamic from '../components/widgetPropertyEditDynamic.vue';

import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ebPageContext],
  components: {
    widgetPropertyEditDynamic,
  },
  data() {
    return {
      widgetId: this.$f7route.query.widgetId,
      propertyName: this.$f7route.query.propertyName,
    };
  },
  computed: {
    dashboard() {
      return this.contextParams.dashboard;
    },
    widget() {
      return this.contextParams.widget;
    },
    propertySchema() {
      return this.contextParams.propertySchema;
    },
  },
  created() {},
  render(c) {
    const children = [];
    const propertyReal = this.widget.__getPropertyReal(this.propertyName);
    const isDynamic = this.propertySchema.ebBindOnly || (propertyReal && propertyReal.type === 2);
    // navbar
    children.push(this._renderNavbar(c));
    // toolbar
    if (this.propertySchema.ebBindArray) {
      children.push(this._renderToolbar(c));
    }
    // valueType
    children.push(this._renderValueTypes(c, propertyReal, isDynamic));
    // static
    if (!isDynamic) {
      children.push(this._renderValueStatic(c, propertyReal));
    } else {
      children.push(this._renderValueDynamic(c, propertyReal));
    }
    // ok
    return c('eb-page', {
      staticClass: 'widget-property-edit',
    }, children);
  },
  methods: {
    _getPageTitle() {
      return `${this.$text('Property')}: ${this.$text(this.propertySchema.ebTitle)}`;
    },
    _setPropertyValue: Vue.prototype.$meta.util.debounce(function(data) {
      this.widget.__setPropertyRealValue(this.propertyName, data);
    }, 600),
    _onChangeValueType(bDynamic) {
      this._setPropertyValue({ type: bDynamic ? 2 : 1 });
    },
    _onBindChange(bind) {
      if (this.propertySchema.ebBindArray) {
        // array
        const propertyReal = this.widget.__getPropertyReal(this.propertyName);
        const binds = (propertyReal && propertyReal.binds) || [];
        const index = binds.findIndex(item => item.id === bind.id);
        if (index > -1) {
          binds.splice(index, 1, bind);
        } else {
          binds.push(bind);
        }
        this._setPropertyValue({ type: 2, binds });
      } else {
        // single
        this._setPropertyValue({ type: 2, bind });
      }
    },
    _onPerformBindDelete(e, bind) {
      const propertyReal = this.widget.__getPropertyReal(this.propertyName);
      const binds = (propertyReal && propertyReal.binds) || [];
      const index = binds.findIndex(item => item.id === bind.id);
      if (index > -1) {
        binds.splice(index, 1);
        this._setPropertyValue({ type: 2, binds });
      }
      this.$meta.util.swipeoutClose(e.target);
    },
    _onPerformBindEdit(e, bind) {
      this._bindAddOrEdit(bind);
      this.$meta.util.swipeoutClose(e.target);
    },
    _onPerformBindAdd() {
      this._bindAddOrEdit({ id: this.dashboard.__generateUUID() });
    },
    _bindAddOrEdit(propertyBind) {
      this.$view.navigate(`/a/dashboard/widget/property/bind/add?widgetId=${this.widgetId}&propertyName=${this.propertyName}`, {
        target: '_self',
        context: {
          params: {
            dashboard: this.dashboard,
            widget: this.widget,
            propertySchema: this.propertySchema,
            propertyBind,
          },
          callback: (code, bind) => {
            if (code === 200) {
              this._onBindChange(bind);
            }
          },
        },
      });
    },
    _renderNavbar(c) {
      return c('eb-navbar', {
        props: {
          title: this._getPageTitle(),
          ebBackLink: 'Back',
        },
      });
    },
    _renderToolbar(c) {
      const children = [];
      children.push(c('div'));
      children.push(c('eb-button', {
        props: {
          text: this.$text('Add Data Source'),
          onPerform: this._onPerformBindAdd,
        },
      }));
      return c('f7-toolbar', {
        props: {
          bottomMd: true,
        },
      }, children);
    },
    _renderValueDynamicArray(c, propertyBinds) {
      const children = [];
      if (propertyBinds) {
        for (const propertyBind of propertyBinds) {
          // buttons
          const buttons = [];
          buttons.push(c('div', {
            attrs: {
              color: 'orange',
              context: propertyBind,
              onPerform: this._onPerformBindEdit,
            },
          }, [c('span', {
            domProps: {
              innerText: this.$text('Edit'),
            }
          })]));
          buttons.push(c('div', {
            attrs: {
              color: 'red',
              context: propertyBind,
              onPerform: this._onPerformBindDelete,
            },
          }, [c('span', {
            domProps: {
              innerText: this.$text('Delete'),
            }
          })]));
          // right
          const right = c('div', {
            slot: 'right',
          }, buttons);
          // context menu
          const menu = c('eb-context-menu', {}, [right]);
          // list item
          const [title, propertyTitle] = this.widget._getBindSourceTitleAndPropertyTitle(propertyBind.widgetId, propertyBind.propertyName);
          children.push(c('eb-list-item', {
            key: propertyBind.id,
            props: {
              title: propertyTitle,
              after: title,
              swipeout: true,
            },
          }, [menu]));
        }
      }
      return c('f7-list', {}, children);
    },
    _renderValueDynamicSingle(c, propertyBind) {
      return c('widget-property-edit-dynamic', {
        props: {
          dashboard: this.dashboard,
          widget: this.widget,
          widgetId: this.widgetId,
          propertyName: this.propertyName,
          propertyBind,
        },
        on: {
          'bind:change': this._onBindChange,
        },
      });
    },
    _renderValueDynamic(c, propertyReal) {
      // dynamic
      if (this.propertySchema.ebBindArray) {
        // array
        return this._renderValueDynamicArray(c, propertyReal && propertyReal.binds);
      } else {
        // single
        return this._renderValueDynamicSingle(c, propertyReal && propertyReal.bind);
      }
    },
    _renderValueStatic(c, propertyReal) {
      // schema
      const schema = {
        type: 'object',
        properties: {
          [this.propertyName]: this.propertySchema,
        },
      };
      // data
      const data = {
        [this.propertyName]: this.widget.__getPropertyRealValue(this.propertyName),
      };
      // validate
      return c('eb-validate', {
        ref: 'validate',
        props: {
          auto: true,
          readOnly: false,
          data,
          meta: {
            schema,
          },
        },
        on: {
          'validateItem:change': (key, value) => {
            return this._setPropertyValue({ type: 1, value });
          }
        }
      });
    },
    _renderValueTypes(c, propertyReal, isDynamic) {
      const children = [];
      // static
      if (!this.propertySchema.ebBindOnly) {
        children.push(c('f7-radio', {
          props: {
            name: 'valueType',
            value: 'static',
            checked: !isDynamic,
          },
          on: {
            change: () => this._onChangeValueType(false),
          },
        }));
        children.push(c('span', {
          domProps: {
            innerText: this.$text('Static'),
          },
        }));
      }
      // dynamic
      children.push(c('f7-radio', {
        props: {
          name: 'valueType',
          value: 'dynamic',
          checked: isDynamic,
        },
        on: {
          change: () => this._onChangeValueType(true),
        },
      }));
      children.push(c('span', {
        domProps: {
          innerText: this.$text('Dynamic'),
        },
      }));
      return c('f7-block', {
        staticClass: 'value-types',
      }, children);
    },
  },

}

</script>
