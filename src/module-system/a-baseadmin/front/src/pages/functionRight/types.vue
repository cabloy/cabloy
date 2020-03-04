<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Function Right Management')" eb-back-link="Back"></eb-navbar>
    <f7-list>
      <eb-list-item v-for="(item,index) of types" :key="index" link="#" :eb-href="`functionRight/list?menu=${index}`" :title="$text(item)">
      </eb-list-item>
    </f7-list>
  </eb-page>
</template>
<script>
const _types = ['Function', 'Menu', 'Panel', 'Widget'];
export default {
  data() {
    return {
      types: _types,
    };
  },
  methods: {},
};

</script>
