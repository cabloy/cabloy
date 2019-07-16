<template>
  <eb-page>
    <eb-navbar :title="$text('Kitchen-sink')" eb-back-link="Back"></eb-navbar>
    <eb-list no-hairlines-md>
      <eb-list-item v-for="item of items" :key="item.title" :title="item.titleLocale" link="#" :eb-href="item.path"></eb-list-item>
    </eb-list>
  </eb-page>
</template>
<script>
const items = [
  { title: 'File Upload', path: 'kitchen-sink/fileUpload' },
  { title: 'Progress Bar', path: 'kitchen-sink/progress' },
  { title: 'Settings', path: 'kitchen-sink/settings' },
  { title: 'View Size & Open Target', path: 'kitchen-sink/view/sizeTarget' },
  { title: 'Page Open & Return Value', path: 'kitchen-sink/page/openReturn' },
];
export default {
  data() {
    return {
      items: null,
    };
  },
  created() {
    this.items = items.map(item => {
      return {
        titleLocale: this.$text(item.title),
        ...item,
      };
    }).sort((a, b) => {
      const locale = this.$meta.util.cookies.get('locale') || 'en-us';
      return a.titleLocale.localeCompare(b.titleLocale, locale);
    });
  },
  methods: {

  },
};

</script>
