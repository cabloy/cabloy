<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="getPageTitle()" eb-back-link="Back"> </eb-navbar>
    <f7-list>
      <eb-list-item v-for="(item,index) of functionScenes" :key="item.id" :title="item.titleLocale" :badge="index+1">
      </eb-list-item>
    </f7-list>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      menu: parseInt(this.$f7route.query.menu),
      functionScenes: null,
    };
  },
  created() {
    this.__loadFunctionScenes();
  },
  methods: {
    getPageTitle() {
      if (this.menu === 0) return this.$text('Function Category');
      if (this.menu === 1) return this.$text('Menu Category');
    },
    __loadFunctionScenes() {
      this.$api.post('function/scenesLoad', { sceneMenu: this.menu }).then(data => {
        this.functionScenes = data;
      });
    },
  },
};

</script>
