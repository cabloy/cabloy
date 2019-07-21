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
  { title: 'Contacts List', path: 'kitchen-sink/framework7/contacts-list' },
  { title: 'Content Block', path: 'kitchen-sink/framework7/content-block' },
  { title: 'Data Table', path: 'kitchen-sink/framework7/data-table' },
  { title: 'Elevation', path: 'kitchen-sink/framework7/elevation' },
  { title: 'FAB Morph', path: 'kitchen-sink/framework7/fab-morph' },
  { title: 'FAB', path: 'kitchen-sink/framework7/fab' },
  { title: 'Form Storage', path: 'kitchen-sink/framework7/form-storage' },
  { title: 'GaugeChart', path: 'kitchen-sink/framework7/gauge' },
  { title: 'Grid / Layout', path: 'kitchen-sink/framework7/grid' },
  { title: 'Icons', path: 'kitchen-sink/framework7/icons' },
  { title: 'Infinite Scroll', path: 'kitchen-sink/framework7/infinite-scroll' },
  { title: 'Form Inputs', path: 'kitchen-sink/framework7/inputs' },
  { title: 'Lazy Load Images', path: 'kitchen-sink/framework7/lazy-load' },
  { title: 'List Index', path: 'kitchen-sink/framework7/list-index' },
  { title: 'List View', path: 'kitchen-sink/framework7/list' },
  { title: 'Menu', path: 'kitchen-sink/framework7/menu' },
  { title: 'Messsages', path: 'kitchen-sink/framework7/messages' },
  { title: 'Navbar', path: 'kitchen-sink/framework7/navbar' },
  { title: 'Photo Browser', path: 'kitchen-sink/framework7/photo-browser' },
  { title: 'Picker', path: 'kitchen-sink/framework7/picker' },
  { title: 'Popover', path: 'kitchen-sink/framework7/popover' },
  { title: 'Preloader', path: 'kitchen-sink/framework7/preloader' },
  { title: 'Progress Bar', path: 'kitchen-sink/framework7/progressbar' },
  { title: 'Pull To Refresh', path: 'kitchen-sink/framework7/pull-to-refresh' },
  { title: 'RadioBox', path: 'kitchen-sink/framework7/radio' },
  { title: 'Range Slider', path: 'kitchen-sink/framework7/range' },
  { title: 'Searchbar Expandable', path: 'kitchen-sink/framework7/searchbar-expandable' },
  { title: 'Searchbar', path: 'kitchen-sink/framework7/searchbar' },
  { title: 'Sheet Modal', path: 'kitchen-sink/framework7/sheet-modal' },
  { title: 'Skeleton Layouts', path: 'kitchen-sink/framework7/skeleton' },
  { title: 'Smart Select', path: 'kitchen-sink/framework7/smart-select' },
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
