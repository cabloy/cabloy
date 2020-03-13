<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Block')" eb-back-link="Back"> </eb-navbar>
    <f7-list>
      <eb-list-item v-for="item of blocks" :key="item.meta.name" :title="item.meta.titleLocale" link="#" :context="item" :onPerform="onPerformItem">
      </eb-list-item>
    </f7-list>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ebPageContext],
  data() {
    return {
      blocks: null,
    };
  },
  created() {
    this.$local.dispatch('getBlockArray').then(data => {
      this.blocks = data;
    });
  },
  methods: {
    onPerformItem(event, block) {
      const atomId = this.contextParams.atomId;
      this.$view.navigate('/a/cms/block/item', {
        target: '_self',
        context: {
          params: {
            block,
            atomId,
          },
          callback: (code, data) => {
            if (code === 200) {
              // data: {name,content}
              this.contextCallback(200, data);
            }
            if (code === false) {
              // donothing
            }
          },
        },
      });
    },
  },
};

</script>
