export default {
  props: {
    data: {
      type: Object,
    },
    pathParent: {
      type: String,
      default: '',
    },
    dataKey: {
      type: String,
    },
    schema: {
      type: Object,
    },
    properties: {
      type: Object,
    },
    property: {
      type: Object,
    },
    meta: {
      type: Object,
    },
    root: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      validate: null,
    };
  },
  created() {
    this.validate = this.getValidate();
  },
  beforeDestroy() {
    this.validate = null;
  },
  methods: {
    getValidate() {
      let parent = this.$parent;
      while (parent) {
        if (parent.$options._componentTag === 'eb-validate') break;
        parent = parent.$parent;
      }
      return parent;
    },
    getMetaValue(meta, key, dataPath) {
      // 1. item
      const value = meta ? meta[key] : undefined;
      if (value !== undefined) return value;
      // 2. validate
      const validateMeta = this.validate.meta;
      if (!validateMeta) return undefined;
      // dataPath is empty
      if (!dataPath) return validateMeta[key];
      // dataPath is not empty
      return (validateMeta[dataPath] && validateMeta[dataPath][key]) || validateMeta[key];
    },
    getValue(data, key, property) {
      const _value = data[key];
      if (!this.checkIfEmptyForSelect(_value)) return _value;
      if (this.checkIfEmptyForSelect(property.default)) return _value;
      return property.default;
    },
    setValue(data, key, value, property) {
      let _value;

      if (property.ebType === 'select' && this.checkIfEmptyForSelect(value)) {
        _value = null; // for distinguish from 0
      } else {
        if (property.type === 'number') {
          _value = Number(value);
        } else if (property.type === 'boolean') {
          _value = Boolean(value);
        } else {
          _value = value;
        }
      }

      const _valueOld = data[key];

      this.$set(data, key, _value); // always set as maybe Object

      if (_valueOld !== _value) {
        this.$emit('change', _value);
        this.validate.$emit('validateItem:change', key, _value);
      }
    },
    checkIfEmptyForSelect(value) {
      return value === '' || value === undefined || value === null;
    },
    adjustDataPath(dataPath) {
      if (!dataPath) return dataPath;
      if (dataPath[0] !== '/') return this.validate.dataPathRoot + dataPath;
      return dataPath;
    },
    getTitle(context, notHint) {
      const { meta, key, property } = context;
      const title = this.$text(property.ebTitle || key);
      // ignore panel/group/toggle
      const ebType = property.ebType;
      if (ebType === 'panel' || ebType === 'group' || ebType === 'group-flatten' || ebType === 'toggle') return title;
      // only edit
      if (this.validate.readOnly || property.ebReadOnly) return title;
      // hint
      if (!notHint) {
        // config
        const hint = this.getMetaValue(meta, 'hint') || this.$config.validate.hint;
        const hintOptional = hint.optional;
        const hintMust = hint.must;
        // check optional
        if (hintOptional && !property.notEmpty) {
          return `${title}${this.$text(hintOptional)}`;
        }
        // check must
        if (hintMust && property.notEmpty) {
          return `${title}${this.$text(hintMust)}`;
        }
      }
      // default
      return title;
    },
    getPlaceholder(context) {
      const { property } = context;
      if (this.validate.readOnly || property.ebReadOnly) return undefined;
      return property.ebDescription ? this.$text(property.ebDescription) : this.getTitle(context, true);
    },
    onSubmit(event) {
      this.validate.onSubmit(event);
    },
    renderRoot(c) {
      if (!this.validate.data || !this.validate.schema) return c('div');
      // context
      const context = {
        data: this.data || this.validate.data,
        pathParent: this.pathParent,
        schema: this.schema || this.validate.schema,
        properties: this.properties || this.validate.schema.properties,
      };
      const children = this.renderProperties(c, context);
      const attrs = {
        form: true,
        noHairlinesMd: true,
        inlineLabels: !this.$config.form.floatingLabel,
      };
      return c('eb-list', {
        staticClass: 'eb-list-row',
        attrs,
        on: { submit: this.onSubmit },
      }, children);
    },
    renderItem(c) {
      if (!this.validate.data || !this.validate.schema) return c('div');
      // context
      const context = {
        data: this.data || this.validate.data,
        pathParent: this.pathParent,
        schema: this.schema || this.validate.schema,
        properties: this.properties || this.validate.schema.properties,
        key: this.dataKey,
        meta: this.meta,
      };
      context.property = this.property || context.properties[context.key];
      context.dataPath = context.pathParent + context.key;
      return this._renderItem(c, context);
    },
    _renderItem(c, context) {
      const ebType = context.property.ebType;
      // ignore if not specified
      if (!ebType) return null;
      // render
      if (ebType === 'group') {
        // group
        return this.renderGroup(c, context);
      } else if (ebType === 'panel') {
        // panel
        return this.renderPanel(c, context);
      } else if (ebType === 'text') {
        // text
        return this.renderText(c, context);
      } else if (ebType === 'toggle') {
        // toggle
        return this.renderToggle(c, context);
      } else if (ebType === 'select') {
        // select
        return this.renderSelect(c, context);
      } else if (ebType === 'file') {
        // file
        return this.renderFile(c, context);
      } else if (ebType === 'datepicker') {
        // datepicker
        return this.renderDatepicker(c, context);
      } else if (ebType === 'link') {
        // link
        return this.renderLink(c, context);
      } else if (ebType === 'component') {
        // component
        return this.renderComponent(c, context);
      }
      // not support
      return c('div', {
        domProps: {
          innerText: `not support: ${ebType}`,
        },
      });
    },
    renderProperties(c, context) {
      const { data, properties, pathParent } = context;
      const children = [];
      let domGroupFlattenChildren = null;
      let domGroupFlattenkey = null;
      let domGroupFlattenProperty = null;
      const _closeGroup = () => {
        // title
        const groupTitle = c('f7-list-item', {
          attrs: {
            groupTitle: true,
            title: this.getTitle({
              key: domGroupFlattenkey,
              property: domGroupFlattenProperty,
            }),
          },
        });
        // combine
        domGroupFlattenChildren.unshift(groupTitle);
        // group
        const className = domGroupFlattenProperty.ebGroupWhole ? 'eb-list-group-whole' : 'eb-list-group';
        const item = c('f7-list-group', {
          staticClass: className,
        }, domGroupFlattenChildren);
        // clear
        domGroupFlattenChildren = null;
        domGroupFlattenkey = null;
        domGroupFlattenProperty = null;
        return item;
      };
      for (const key in properties) {
        const property = properties[key];
        const bGroup = property.ebType === 'group';
        const bGroupFlatten = property.ebType === 'group-flatten';
        if ((bGroup || bGroupFlatten) && domGroupFlattenChildren) {
          // close previous group
          children.push(_closeGroup());
        }
        if (bGroupFlatten) {
          // open new group
          domGroupFlattenChildren = [];
          domGroupFlattenkey = key;
          domGroupFlattenProperty = property;
        } else {
          // others
          // context
          const context2 = {
            data,
            pathParent,
            schema: context.schema,
            properties,
            key,
          };
          context2.property = context2.properties[context2.key];
          context2.dataPath = context2.pathParent + context2.key;
          // render
          const item = this._renderItem(c, context2);
          if (item) {
            if (domGroupFlattenChildren) {
              domGroupFlattenChildren.push(item);
            } else {
              children.push(item);
            }
          }
        }
      }
      // close previous group
      if (domGroupFlattenChildren) {
        children.push(_closeGroup());
      }
      // ok
      return children;
    },
    renderGroup(c, context) {
      const { data, key, property, dataPath } = context;
      // context2
      const context2 = {
        data: data[key],
        pathParent: dataPath + '/',
        schema: context.schema,
        properties: property.properties,
      };
      // children
      const children = this.renderProperties(c, context2);
      // group
      const group = c('f7-list-item', {
        attrs: {
          groupTitle: true,
          title: this.getTitle(context),
        },
      });
      // combine
      children.unshift(group);
      // group
      const className = property.ebGroupWhole ? 'eb-list-group-whole' : 'eb-list-group';
      return c('f7-list-group', {
        staticClass: className,
      }, children);
    },
    renderPanel(c, context) {
      let { data, key, property, dataPath } = context;
      dataPath = dataPath + '/';
      return c('eb-list-item-panel', {
        key,
        attrs: {
          link: '#',
          title: this.getTitle(context),
          dataPath,
        },
        on: {
          click: () => {
            const params = this.validate.params;
            const verrors = this.validate.verrors;
            this.$view.navigate('/a/validation/validate', {
              target: '_self',
              context: {
                params: {
                  params: {
                    module: params.module,
                    validator: params.validator,
                    schema: property.$ref,
                  },
                  data: data[key],
                  dataPathRoot: this.adjustDataPath(dataPath),
                  errors: verrors ? verrors.slice(0) : null,
                  readOnly: this.validate.readOnly || property.ebReadOnly,
                },
                callback: (code, res) => {
                  if (code) {
                    this.setValue(data, key, res.data, property);
                    this.validate.verrors = res.errors;
                  }
                },
              },
            });
          },
        },
      });
    },
    renderText(c, context) {
      const { data, key, property, dataPath } = context;
      const title = this.getTitle(context);
      if ((this.validate.readOnly || property.ebReadOnly) && !property.ebTextarea) {
        return c('f7-list-item', {
          key,
          staticClass: '',
          attrs: {
            after: data[key] ? data[key].toString() : null,
          },
        }, [
          c('div', {
            slot: 'title',
            staticClass: property.ebReadOnly ? 'text-color-gray' : '',
            domProps: { innerText: title },
          }),
        ]);
      }
      const placeholder = this.getPlaceholder(context);
      const info = property.ebHelp ? this.$text(property.ebHelp) : undefined;
      let type;
      if (property.ebSecure) {
        type = 'password';
      } else if (property.ebTextarea) {
        type = 'textarea';
      } else if (property.ebInputType) {
        type = property.ebInputType;
      } else {
        type = 'text';
      }
      return c('eb-list-input', {
        key,
        attrs: {
          floatingLabel: this.$config.form.floatingLabel,
          type,
          placeholder,
          info,
          resizable: property.ebTextarea,
          clearButton: !this.validate.readOnly && !property.ebReadOnly,
          dataPath,
          value: this.getValue(data, key, property),
          disabled: this.validate.readOnly || property.ebReadOnly,
        },
        on: {
          input: value => {
            this.setValue(data, key, value, property);
          },
        },
      }, [
        c('div', {
          slot: 'label',
          staticClass: property.ebReadOnly ? 'text-color-gray' : '',
          domProps: { innerText: title },
        }),
      ]);
    },
    renderDatepicker(c, context) {
      const { data, key, property, dataPath } = context;
      const title = this.getTitle(context);
      // should format date
      // // the form is readOnly
      // if (this.validate.readOnly || property.ebDisabled) {
      //   return c('f7-list-item', {
      //     key,
      //     staticClass: '',
      //     attrs: {
      //       title,
      //       after: data[key] ? data[key].toString() : null,
      //     },
      //   });
      // }
      const placeholder = this.getPlaceholder(context);
      const info = property.ebHelp ? this.$text(property.ebHelp) : undefined;
      // value
      let value = this.getValue(data, key, property);
      if (!value) {
        value = [];
      } else if (!Array.isArray(value)) {
        value = [ value ];
      }
      // input
      return c('eb-list-input', {
        key,
        attrs: {
          floatingLabel: this.$config.form.floatingLabel,
          type: 'datepicker',
          placeholder,
          info,
          resizable: false,
          clearButton: !this.validate.readOnly && !property.ebDisabled,
          dataPath,
          value,
          readonly: true, // always
          disabled: this.validate.readOnly || property.ebDisabled,
        },
        props: {
          calendarParams: property.ebParams,
        },
        on: {
          'calendar:change': values => {
            // date or array of date
            if (property.type === 'array') {
              this.setValue(data, key, values, property);
            } else {
              this.setValue(data, key, values[0] || null, property);
            }
          },
        },
      }, [
        c('div', {
          slot: 'label',
          staticClass: property.ebReadOnly ? 'text-color-gray' : '',
          domProps: { innerText: title },
        }),
      ]);
    },
    renderFile(c, context) {
      const { data, key, property, dataPath, meta } = context;
      const title = this.getTitle(context);
      if ((this.validate.readOnly || property.ebReadOnly) && !property.ebTextarea) {
        return c('f7-list-item', {
          key,
          staticClass: property.ebReadOnly ? 'text-color-gray' : '',
          attrs: {
            after: data[key] ? data[key].toString() : null,
          },
        }, [
          c('div', {
            slot: 'title',
            staticClass: property.ebReadOnly ? 'text-color-gray' : '',
            domProps: { innerText: title },
          }),
        ]);
      }
      const placeholder = this.getPlaceholder(context);
      const info = property.ebHelp ? this.$text(property.ebHelp) : undefined;
      let type;
      if (property.ebSecure) {
        type = 'password';
      } else if (property.ebTextarea) {
        type = 'textarea';
      } else {
        type = 'text';
      }
      // mode
      const mode = this.getMetaValue(meta, 'mode', dataPath) || property.ebParams.mode;
      // atomId
      const atomId = this.getMetaValue(meta, 'atomId', dataPath) || property.ebParams.atomId || 0;
      // attachment
      const attachment = this.getMetaValue(meta, 'attachment', dataPath) || property.ebParams.attachment;
      // flag
      const flag = this.getMetaValue(meta, 'flag', dataPath) || property.ebParams.flag;
      // accept
      const accept = this.getMetaValue(meta, 'accept', dataPath) || property.ebParams.accept;
      // render
      return c('eb-list-input', {
        key,
        attrs: {
          floatingLabel: this.$config.form.floatingLabel,
          type,
          placeholder,
          info,
          resizable: property.ebTextarea,
          clearButton: !this.validate.readOnly && !property.ebReadOnly,
          dataPath,
          value: this.getValue(data, key, property),
          disabled: this.validate.readOnly || property.ebReadOnly,
        },
        on: {
          input: value => {
            this.setValue(data, key, value, property);
          },
          focus: event => {
            const upload = this.$$(event.target).closest('li').find('.eb-input-file-upload');
            const timeoutId = upload.data('timeoutId');
            if (timeoutId) {
              window.clearTimeout(timeoutId);
              upload.data('timeoutId', 0);
            }
            upload.show();
          },
          blur: () => {
            const upload = this.$$(event.target).closest('li').find('.eb-input-file-upload');
            const timeoutId = window.setTimeout(() => {
              upload.data('timeoutId', 0);
              upload.hide();
            }, 300);
            upload.data('timeoutId', timeoutId);
          },
        },
      }, [
        c('div', {
          slot: 'label',
          staticClass: property.ebReadOnly ? 'text-color-gray' : '',
          domProps: { innerText: title },
        }),
        c('eb-button', {
          slot: 'root-end',
          staticClass: 'eb-input-file-upload',
          domProps: { innerText: this.$text('Upload') },
          props: {
            onPerform: () => {
              this.$view.navigate('/a/file/file/upload', {
                target: '_self',
                context: {
                  params: {
                    mode,
                    atomId,
                    attachment,
                    flag,
                    accept,
                  },
                  callback: (code, value) => {
                    if (code === 200) {
                      this.setValue(data, key, value.downloadUrl, property);
                    }
                  },
                },
              });
            },
          },
        }),
      ]);
    },
    renderToggle(c, context) {
      const { data, key, property, dataPath } = context;
      const title = this.getTitle(context);
      return c('f7-list-item', {
        key,
      }, [
        c('div', {
          slot: 'title',
          staticClass: property.ebReadOnly ? 'text-color-gray' : '',
          domProps: { innerText: title },
        }),
        c('eb-toggle', {
          slot: 'after',
          attrs: {
            dataPath,
            value: this.getValue(data, key, property),
            disabled: this.validate.readOnly || property.ebReadOnly,
          },
          on: {
            input: value => {
              this.setValue(data, key, value, property);
            },
          },
        }),
      ]);
    },
    renderSelect(c, context) {
      const { data, key, property, dataPath, meta } = context;
      const title = this.getTitle(context);
      const valueCurrent = this.getValue(data, key, property);
      const attrs = {
        name: key,
        dataPath,
        value: valueCurrent,
        readOnly: this.validate.readOnly || property.ebReadOnly,
      };
      const metaOptions = this.getMetaValue(meta, 'options', dataPath);
      if (metaOptions) attrs.options = metaOptions;
      if (!metaOptions && property.ebOptions) attrs.options = property.ebOptions;
      if (property.ebOptionsUrl) {
        attrs.optionsUrl = property.ebOptionsUrl;
        attrs.optionsUrlParams = property.ebOptionsUrlParams;
      }
      attrs.optionsBlankAuto = property.ebOptionsBlankAuto;
      if (property.ebOptionTitleKey) attrs.optionTitleKey = property.ebOptionTitleKey;
      if (property.ebOptionValueKey) attrs.optionValueKey = property.ebOptionValueKey;
      if (property.ebMultiple) attrs.multiple = property.ebMultiple;
      // specially, not showing blank option when notEmpty and has value
      if (property.notEmpty && !this.checkIfEmptyForSelect(valueCurrent)) {
        attrs.optionsBlankAuto = false;
        if (attrs.options && attrs.options.length > 0) {
          const opt = attrs.options[0];
          if (!opt || this.checkIfEmptyForSelect(opt.value)) {
            attrs.options.shift();
          }
        }
      }
      // render
      return c('eb-list-item', {
        key,
        attrs: {
          smartSelect: !this.validate.readOnly && !property.ebReadOnly,
          // title,
          smartSelectParams: property.ebParams || { openIn: 'page', closeOnSelect: true },
        },
      }, [
        c('div', {
          slot: 'title',
          staticClass: property.ebReadOnly ? 'text-color-gray' : '',
          domProps: { innerText: title },
        }),
        c('eb-select', {
          attrs,
          on: {
            input: value => {
              this.setValue(data, key, value, property);
            },
          },
        }),
      ]);
    },
    renderLink(c, context) {
      const { data, property } = context;
      const title = this.getTitle(context, true);
      const href = this.$meta.util.combinePagePath(
        this.validate.renderModuleName,
        this.$meta.util.replaceTemplate(property.ebParams.href, data)
      );
      return c('eb-list-item', {
        props: {
          link: '#',
          ebHref: href,
          title,
        },
      });
    },
    renderComponent(c, context) {
      const { data, pathParent, key, property, dataPath } = context;
      const renderProps = this.$meta.util.extend({ options: { props: {} } }, property.ebRender);
      renderProps.options.props.context = {
        validate: this.validate,
        validateItem: this,
        data,
        pathParent,
        key,
        schema: context.schema,
        properties: context.properties,
        property,
        dataPath,
        meta: context.meta,
        getValue: () => {
          return this.getValue(data, key, property);
        },
        setValue: value => {
          this.setValue(data, key, value, property);
        },
      };
      return c('eb-list-item-component', {
        props: renderProps,
      });
    },
  },
};
