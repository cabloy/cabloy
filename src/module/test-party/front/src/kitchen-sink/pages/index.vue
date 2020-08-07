<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Kitchen-sink')" eb-back-link="Back"></eb-navbar>
    <eb-list no-hairlines-md>
      <eb-list-item v-for="item of items" :key="item.title" :title="item.titleLocale" link="#" :eb-href="item.path"></eb-list-item>
    </eb-list>
  </eb-page>
</template>
<script>
const items = [
  { title: 'About', path: 'kitchen-sink/about' },
  { title: 'Framework7', path: 'kitchen-sink/framework7/index' },
  { title: 'Guide', path: 'kitchen-sink/guide' },
  { title: 'File Upload', path: 'kitchen-sink/fileUpload' },
  { title: 'Progress Bar', path: 'kitchen-sink/progress' },
  { title: 'Settings', path: 'kitchen-sink/settings' },
  { title: 'View Size & Open Target', path: 'kitchen-sink/view/sizeTarget' },
  { title: 'Page Open & Return Value', path: 'kitchen-sink/page/openReturn' },
  { title: 'Box Container', path: 'kitchen-sink/box' },
  { title: 'Markdown Editor(mavon-editor)', path: 'kitchen-sink/markdownEditor' },
  { title: 'Dialog', path: 'kitchen-sink/dialog' },
  { title: 'Form / Schema / Validation', path: 'kitchen-sink/form-schema-validation/index' },
  { title: 'Form / Captcha', path: 'kitchen-sink/form-captcha' },
  { title: 'Form / SMS Verification', path: 'kitchen-sink/form-mobile-verify' },
  { title: 'Pull To Refresh / Infinite Scroll / Load More', path: 'kitchen-sink/ptrIsLoadMore' },
  { title: 'Button Event', path: 'kitchen-sink/buttonEvent' },
  { title: 'Atom', path: 'kitchen-sink/atom' },
  { title: 'Layout(Grid)', path: 'kitchen-sink/layout/grid' },
  { title: 'Layout(Adaptive)', path: 'kitchen-sink/layout/adaptive' },
  { title: 'Monkey', path: 'kitchen-sink/monkey/monkeyee' },
  { title: 'Dragdrop(Move)', path: 'kitchen-sink/dragdrop/move' },
  { title: 'Dragdrop(Resize)', path: 'kitchen-sink/dragdrop/resize' },
  { title: 'Socket IO', path: 'kitchen-sink/socketio' },
  { title: 'Mail', path: 'kitchen-sink/mail' },
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
    const about = _items.splice(0, 3);
    // sort
    _items = _items.sort((a, b) => {
      const locale = this.$meta.util.getLocale();
      return a.titleLocale.localeCompare(b.titleLocale, locale);
    });
    // about
    _items = about.concat(_items);
    // ok
    this.items = _items;
  },
};

</script>
