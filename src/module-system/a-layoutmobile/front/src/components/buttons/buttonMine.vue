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
        stats: null,
      };
    },
    computed: {
      badgeColor() {
        if (!this.stats) return null;
        if (this.stats['a-user:userRed']) return 'red';
        if (this.stats['a-user:userOrange']) return 'orange';
        return null;
      },
      statsValue() {
        if (!this.stats) return null;
        if (this.stats['a-user:userRed']) return this.stats['a-user:userRed'];
        if (this.stats['a-user:userOrange']) return this.stats['a-user:userOrange'];
        return null;
      },
    },
    methods: {
      onStatsChange(event) {
        this.stats = event;
      },
    },
  };
}

</script>
