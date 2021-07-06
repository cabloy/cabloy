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
        let item = JSON.parse(this.$f7route.query.item);
        const key = await this.$api.post('/a/base/atom/create', {
          atomClass: {
            module: item.module,
            atomClassName: item.atomClassName,
          },
          item,
        });
        item = {
          ...item,
          atomId: key.atomId,
          itemId: key.itemId,
        };
        const action = {
          actionModule: 'a-base',
          actionComponent: 'action',
          name: 'write',
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
