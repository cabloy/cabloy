<template>
  <eb-link :class="buttonClass" :iconMaterial="buttonIcon" :text="buttonLabel" :onPerform="onPerformClick"
    :badge-color="badgeColor" :icon-badge="statsValue" :stats_params="{module: 'a-user',name: 'user'}" @stats_change="onStatsChange($event)"
  ></eb-link>
</template>
<script>
// export
export default {
  installFactory,
};

// installFactory
function installFactory(_Vue) {
  const Vue = _Vue;
  const ebLayoutButtonBase = Vue.prototype.$meta.module.get('a-layoutmobile').options.mixins.ebLayoutButtonBase;
  return {
    mixins: [ ebLayoutButtonBase ],
    data() {
      return {
        statsUser: null,
      };
    },
    computed: {
      badgeColor() {
        if (!this.statsUser) return null;
        if (this.statsUser['a-user:userRed']) return 'red';
        if (this.statsUser['a-user:userOrange']) return 'orange';
        return null;
      },
      statsValue() {
        if (!this.statsUser) return null;
        return this.statsUser['a-user:userRed'] || this.statsUser['a-user:userOrange'] || null;
      },
    },
    created() {
      // uniform messages
      const action = {
        actionModule: 'a-message',
        actionComponent: 'uniform',
        name: 'initialize',
      };
      this.$meta.util.performAction({ ctx: this, action }).then(() => {});
    },
    methods: {
      onStatsChange(event) {
        this.statsUser = event;
      },
    },
  };
}

</script>
