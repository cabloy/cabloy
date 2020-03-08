<template>
  <eb-page>
    <template v-if="ready">
      <f7-row ref="container">
        <f7-col v-for="item of profile.widgets" :key="item.id" resizable :width="item.properties.width.small" :medium="item.properties.width.medium" :large="item.properties.width.large">
          <widget :options="item"></widget>
        </f7-col>
      </f7-row>
    </template>
  </eb-page>
</template>
<script>
import widget from './widget.vue';
export default {
  meta: {
    title: 'Dashboard',
  },
  components: {
    widget
  },
  data() {
    return {
      ready: false,
      widgetsAll: null,
      profile: null,
    };
  },
  created() {
    this.__init();
  },
  methods: {
    __init() {
      // widgetsAll
      this.$store.dispatch('a/base/getWidgets').then(widgets => {
        this.widgetsAll = widgets;
        // layoutConfig
        this.$store.dispatch('a/base/getLayoutConfig', 'a-dashboard').then(layoutConfig => {
          // init layoutConfig
          this.__initLayoutConfig(layoutConfig);
          // ready
          this.ready = true;
        });
      });
    },
    __initLayoutConfig(layoutConfig) {
      if (layoutConfig.profile) {
        this.profile = JSON.parse(JSON.stringify(layoutConfig.profile));
      } else {
        const profileDefault = this.$config.profile.default;
        this.profile = JSON.parse(JSON.stringify(profileDefault));
      }
    },
  }
}

</script>
