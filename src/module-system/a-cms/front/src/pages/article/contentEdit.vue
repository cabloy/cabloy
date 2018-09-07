<template>
  <eb-page>
    <eb-navbar :title="title" eb-back-link="Back">
      <f7-nav-right>
        <eb-link v-if="!readOnly" iconMaterial="save" :onPerform="onPerformSave"></eb-link>
        <eb-link iconMaterial="visibility" :onPerform="onPerformPreview"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <template v-if="module">
      <eb-box>
        <eb-mde ref="editor" :value="item.content" @change="onChange" @save="onSave" @imgAdd="onImgAdd" :editable="editable" />
      </eb-box>
    </template>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.components.ebPageContext;
export default {
  meta: {
    size: 'large',
  },
  mixins: [ ebPageContext ],
  data() {
    return {
      dirty: false,
      module: null,
      _unwatch: null,
    };
  },
  computed: {
    title() {
      return `${this.dirty ? '* ' : ''}${this.item.atomName}`;
    },
    readOnly() {
      return this.contextParams.readOnly;
    },
    item() {
      return this.contextParams.item;
    },
    editable() {
      return !this.readOnly;
    },
  },
  mounted() {
    this.$meta.module.use('a-mde', module => {
      this.module = module;
    });
  },
  methods: {
    onChange(data) {
      console.log(data);
      if (this.readOnly) return;
      this.dirty = true;
      this.contextCallback(200, { content: data });
    },
    onSave() {
      this.onPerformSave();
    },
    onPerformSave() {
      return this.contextParams.ctx.onSave().then(() => {
        this.dirty = false;
        return true;
      });
    },
    onPerformPreview() {

    },
    onImgAdd(pos, file) {
      console.log(pos, file);
    },
  },
};

</script>
<style lang="less" scoped>


</style>
