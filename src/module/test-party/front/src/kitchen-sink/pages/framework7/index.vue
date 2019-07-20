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
  { title: 'Autocomplete', path: 'kitchen-sink/framework7/autocomplete' },
  { title: 'Badge', path: 'kitchen-sink/framework7/badge' },
  { title: 'Buttons', path: 'kitchen-sink/framework7/buttons' },
  { title: 'Calendar / Date Picker', path: 'kitchen-sink/framework7/calendar' },
  { title: 'Cards', path: 'kitchen-sink/framework7/cards' },
  { title: 'Cards Expandable', path: 'kitchen-sink/framework7/cards-expandable' },
  { title: 'Checkbox', path: 'kitchen-sink/framework7/checkbox' },
  { title: 'Chips / Tags', path: 'kitchen-sink/framework7/chips' },
  { title: 'Color Picker', path: 'kitchen-sink/framework7/color-picker' },
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
