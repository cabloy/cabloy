<template>
  <span>{{getClockText()}}</span>
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
      ebType: 'Toggle',
      ebTitle: 'Day of Week',
    },
    date: {
      type: 'boolean',
      ebType: 'Toggle',
      ebTitle: 'Date',
    },
    time: {
      type: 'boolean',
      ebType: 'Toggle',
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
      };
    },
    created() {
      this.__init();
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
        });
      },
      getClockText() {
        if (!this.ready) return;
        const moment = this.$meta.util.moment();
        let text = '';
        if (this.options.weekDay) text = `${text} ${moment.format('ddd')}`;
        if (this.options.date) text = `${text} ${moment.format('YYYY-MM-DD')}`;
        if (this.options.time) text = `${text} ${moment.format('HH:mm:ss')}`;
        return text.trim();
      },
    },
  };
}

</script>
