// export
export default {
  installFactory,
};

// schema
const schema = {
  type: 'object',
  properties: {
    weekDay: {
      type: 'boolean',
      ebType: 'toggle',
      ebTitle: 'Day of Week',
    },
    date: {
      type: 'boolean',
      ebType: 'toggle',
      ebTitle: 'Date',
    },
    time: {
      type: 'boolean',
      ebType: 'toggle',
      ebTitle: 'Time',
    },
    customFormat: {
      type: 'string',
      ebType: 'text',
      ebTitle: 'Custom Format',
      ebHelp: 'YYYY-MM-DD HH:mm:ss',
    },
  },
};

const configDefault = {
  weekDay: true,
  date: true,
  time: true,
  customFormat: '',
};

// installFactory
function installFactory(_Vue) {
  const Vue = _Vue;
  const ebLayoutButtonBase = Vue.prototype.$meta.module.get('a-layoutpc').options.mixins.ebLayoutButtonBase;
  return {
    mixins: [ebLayoutButtonBase],
    data() {
      return {
        options: null,
        ready: false,
        timerId: 0,
        clockText: '',
      };
    },
    created() {
      this.__init();
    },
    beforeDestroy() {
      this.__setTimer(false);
    },
    methods: {
      __init() {
        // widgetsAll
        // layoutConfig
        this.$store.dispatch('a/base/getLayoutConfig', 'a-layoutpc').then(layoutConfig => {
          let options;
          if (layoutConfig.buttonClockOptions) {
            options = this.$meta.util.extend({}, configDefault, layoutConfig.buttonClockOptions);
          } else {
            // default
            options = this.$meta.util.extend({}, configDefault);
          }
          this.options = options;
          this.ready = true;
          this.__setTimer(true);
        });
      },
      __setTimer(set) {
        if (set) {
          // timer
          this.timerId = window.setInterval(() => {
            this.updateClockText();
          }, 1000);
        } else {
          if (this.timerId) {
            window.clearInterval(this.timerId);
            this.timerId = 0;
          }
        }
      },
      updateClockText() {
        this.clockText = this.getClockText();
      },
      getClockText() {
        if (!this.ready) return '';
        const moment = this.$meta.util.moment();
        if (this.options.customFormat) return moment.format(this.options.customFormat);
        let text = '';
        if (this.options.weekDay) text = `${text} ${moment.format('ddd')}`;
        if (this.options.date) text = `${text} ${moment.format('DD/MM')}`;
        if (this.options.time) text = `${text} ${moment.format('HH:mm')}`;
        return text.trim();
      },
      onPerform() {
        this.$meta.vueLayout.navigate(this.buttonConfig.actionPath, {
          scene: this.buttonConfig.scene,
          sceneOptions: this.buttonConfig.sceneOptions,
          context: {
            params: {
              clock: this,
              schema: {
                module: 'a-layoutpc',
                schema,
              },
              item: this.options,
            },
            callback: (code, data) => {
              if (code === 200) {
                this.options = {
                  ...this.options,
                  [data.key]: data.value,
                };
                this.updateClockText();
                // save
                this.$store.commit('a/base/setLayoutConfigKey', {
                  module: 'a-layoutpc',
                  key: 'buttonClockOptions',
                  value: this.options,
                });
              }
            },
          },
        });
      },
    },
    render() {
      return (
        <eb-link
          class={this.buttonClass}
          iconMaterial={this.buttonIcon && this.buttonIcon.material}
          iconF7={this.buttonIcon && this.buttonIcon.f7}
          text={this.clockText}
          propsOnPerform={this.onPerform}
        ></eb-link>
      );
    },
  };
}
