<template>
  <eb-page infinite :infinite-distance="50" :infinite-preloader="showPreloader" @infinite="loadMore">
    <eb-navbar :title="$text('Infinite Scroll')" eb-back-link="Back"></eb-navbar>
    <f7-block-title>Scroll bottom</f7-block-title>
    <f7-list>
      <f7-list-item v-for="(item, index) in items" :title="`Item ${item}`" :key="index"></f7-list-item>
    </f7-list>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      items: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 ],
      allowInfinite: true,
      showPreloader: true,
    };
  },
  methods: {
    loadMore() {
      const self = this;
      if (!self.allowInfinite) return;
      self.allowInfinite = false;

      setTimeout(() => {
        if (self.items.length >= 200) {
          self.showPreloader = false;
          return;
        }

        const itemsLength = self.items.length;

        for (let i = 1; i <= 20; i += 1) {
          self.items.push(itemsLength + i);
        }

        self.allowInfinite = true;
      }, 1000);
    },
  },
};

</script>
