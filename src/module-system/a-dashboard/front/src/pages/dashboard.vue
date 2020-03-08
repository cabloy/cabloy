<template>
  <eb-page>
    <template v-if="ready">
      <test-party:widgetProducts></test-party:widgetProducts>
    </template>
  </eb-page>
</template>
<script>
export default {
  meta: {
    title: 'Dashboard',
  },
  data() {
    return {
      ready: false,
    };
  },
  created() {
    this.$meta.module.use('test-party', module => {
      this.$options.components['test-party:widgetProducts'] = module.options.components.widgetAbout;
      this.ready = true;
    });
  }
}

</script>
