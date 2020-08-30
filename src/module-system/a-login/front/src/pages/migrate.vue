<template>
  <f7-page class="eb-page-empty" @page:afterin="onPageAfterIn">
  </f7-page>
</template>
<script>
export default {
  methods: {
    onPageAfterIn() {
      // open login
      this.$meta.vueLayout.openLogin({
        query: { state: 'migrate' },
      }, {
        ctx: this,
        target: '_self',
        reloadCurrent: true,
      });
    },
  },
}

</script>
<style scoped>
</style>
