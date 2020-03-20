<template>
  <span class="clock-text" @click="onClickSettings">{{clockText}}</span>
</template>
<script>
// export
export default {
  install,
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
    },
  },
};

const configDefault = {
  weekDay: true,
  date: true,
  time: true,
  customFormat: '',
};

// install
function install(_Vue) {
  const Vue = _Vue;
  const ebLayoutSectionBase = Vue.prototype.$meta.module.get('a-layoutpc').options.mixins.ebLayoutSectionBase;
  return {
    mixins: [ebLayoutSectionBase],
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
        this.$store.dispatch('a/base/getLayoutConfig', 'a-base').then(layoutConfig => {
          let options;
          if (layoutConfig.sectionClockOptions) {
            options = this.$meta.util.extend({}, configDefault, layoutConfig.sectionClockOptions);
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
      onClickSettings() {
        this.$meta.vueLayout.navigate('/a/base/section/clock/preferences', {
          scene: 'sidebar',
          sceneOptions: { side: 'right', name: 'preferences', title: 'Preferences' },
          context: {
            params: {
              clock: this,
              schema,
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
                this.$store.commit('a/base/setLayoutConfigKey', { module: 'a-base', key: 'sectionClockOptions', value: this.options });
              }
            },
          },
        });
      },
    },
  };
}

</script>
<style lang="less" scoped>
.clock-text {
  cursor: pointer;
}

</style>
