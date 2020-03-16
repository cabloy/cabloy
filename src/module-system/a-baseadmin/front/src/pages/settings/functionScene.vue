<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Basic Admin')" eb-back-link="Back"> </eb-navbar>
    <f7-list>
      <eb-list-item :title="$text('Site')">
      </eb-list-item>
    </f7-list>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      functions: null,
    };
  },
  created() {
    this.__loadFunctions();
  },
  methods: {
    __loadFunctions() {
      const functions = [
        { module: '', name: '' },
      ];
    },
  },
};

</script>
