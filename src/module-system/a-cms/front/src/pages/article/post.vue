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
    onPageAfterIn() {
      const item = JSON.parse(this.$f7route.query.item);
      this.$api.post('/a/base/atom/create', {
        atomClass: {
          module: item.module,
          atomClassName: item.atomClassName,
        },
        item,
      }).then(key => {
        // write
        const url = `/a/base/atom/edit?atomId=${key.atomId}&itemId=${key.itemId}&module=${item.module}&atomClassName=${item.atomClassName}&atomClassIdParent=${item.atomClassIdParent}`;
        this.$view.navigate(url, {
          target: '_self',
          reloadCurrent: true,
        });
      });
    },
  },
};

</script>
</style>
