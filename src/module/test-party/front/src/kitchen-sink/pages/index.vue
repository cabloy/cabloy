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
  { title: 'About', path: 'kitchen-sink/about' },
  { title: 'Framework7', path: 'kitchen-sink/framework7/index' },
  { title: 'File Upload', path: 'kitchen-sink/fileUpload' },
  { title: 'Progress Bar', path: 'kitchen-sink/progress' },
  { title: 'Settings', path: 'kitchen-sink/settings' },
  { title: 'View Size & Open Target', path: 'kitchen-sink/view/sizeTarget' },
  { title: 'Page Open & Return Value', path: 'kitchen-sink/page/openReturn' },
  { title: 'Box Container', path: 'kitchen-sink/box' },
  { title: 'Markdown Editor(mavon-editor)', path: 'kitchen-sink/markdownEditor' },
  { title: 'Dialog', path: 'kitchen-sink/dialog' },
  { title: 'Form / Schema / Validation', path: 'kitchen-sink/form-schema-validation/index' },
  { title: 'Pull To Refresh / Infinite Scroll / Load More', path: 'kitchen-sink/ptrIsLoadMore' },
];
export default {
  data() {
    return {
      items: null,
    };
  },
  created() {
    // locale
    let _items = items.map(item => {
      return {
        titleLocale: this.$text(item.title),
        ...item,
      };
    });
    // about
    const about = _items.splice(0, 2);
    // sort
    _items = _items.sort((a, b) => {
      const locale = this.$meta.util.cookies.get('locale') || 'en-us';
      return a.titleLocale.localeCompare(b.titleLocale, locale);
    });
    // about
    _items = about.concat(_items);
    // ok
    this.items = _items;
  },
};

</script>
