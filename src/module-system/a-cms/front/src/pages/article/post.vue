<template>
  <eb-page @page:afterin="onPageAfterIn">
    <eb-navbar large largeTransparent :title="$text('Post')" eb-back-link="Back"></eb-navbar>
    <f7-block class="text-align-center">
      <f7-preloader></f7-preloader>
    </f7-block>
  </eb-page>
</template>
<script>
export default {
  meta: {
    size: 'medium',
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    async onPageAfterIn() {
      try {
        const item = JSON.parse(this.$f7route.query.item);
        const action = {
          actionModule: 'a-base',
          actionComponent: 'action',
          name: 'create',
          createDelay: true,
          navigateOptions: {
            target: '_self',
            reloadCurrent: true,
          },
        };
        await this.$meta.util.performAction({ ctx: this, action, item });
      } catch (err) {
        this.$view.toast.show({ text: err.message });
      }
    },
  },
};
</script>
