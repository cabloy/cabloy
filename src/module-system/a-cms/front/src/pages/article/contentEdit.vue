<template>
  <eb-page>
    <eb-navbar :title="$text('Content')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="save" :onPerform="onPerformSave"></eb-link>
        <eb-link iconMaterial="visibility" :onPerform="onPerformPreview"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <template v-if="module">
      <mavon-editor ref="editor" v-model="item.content" />
    </template>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.components.ebPageContext;
export default {
  mixins: [ ebPageContext ],
  data() {
    return {
      module: null,
      _unwatch: null,
    };
  },
  computed: {
    item() {
      return this.contextParams.item;
    },
  },
  created() {
    this.$meta.module.use('a-mavoneditor', module => {
      this.module = module;
      this.onSize();
    });
  },
  mounted() {
    this._unwatch = this.$view.$watch('sizeExtent', () => {
      this.onSize();
    });
    this.onSize();
  },
  beforeDestroy() {
    if (this._unwatch) {
      this._unwatch();
      this._unwatch = null;
    }
  },
  methods: {
    onSize() {
      this.$nextTick(() => {
        const size = this.$view.sizeExtent;
        if (size) {
          this.$$(this.$refs.editor.$el).css({
            height: `${size.height - 56}px`,
            width: `${size.width}px`,
          });
        }
      });
    },
    onInput(event) {
      this.content = event.target.value;
    },
    onPerformSave() {
      const data = JSON.parse(this.content);
      return this.$api.post('site/setConfigSite', { data }).then(() => {
        this.$local.commit('setConfigSite', data);
        return true;
      });
    },
    onPerformPreview() {

    },
  },
};

</script>
<style lang="less" scoped>


</style>
