<template>
  <eb-page>
    <eb-navbar title="Framework7" eb-back-link="Back"></eb-navbar>
    <eb-list no-hairlines-md>
      <eb-list-item v-for="item of items" :key="item.title" :title="item.titleLocale" link="#" :eb-href="item.path"></eb-list-item>
    </eb-list>
  </eb-page>
</template>
<script>
const items = [
  { title: 'About', path: 'kitchen-sink/framework7/about' },
  { title: 'Accordion', path: 'kitchen-sink/framework7/accordion' },
  { title: 'Action Sheet', path: 'kitchen-sink/framework7/action-sheet' },
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
    const about = _items.shift();
    // sort
    _items = _items.sort((a, b) => {
      const locale = this.$meta.util.cookies.get('locale') || 'en-us';
      return a.titleLocale.localeCompare(b.titleLocale, locale);
    });
    // about
    _items.unshift(about);
    // ok
    this.items = _items;
  },
  methods: {

  },
};

</script>
