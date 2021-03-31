<template>
  <eb-page>
    <eb-navbar :title="title" eb-back-link="Back">
      <f7-nav-right>
        <eb-link v-if="!readOnly" iconMaterial="save" :onPerform="onPerformSave"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <template v-if="module">
      <eb-box>
        <mavon-editor ref="editor" :value="item.content" @change="onChange" @save="onSave" :onImageUpload="onImageUpload" :onAudioUpload="onAudioUpload" :onBlockAdd="onBlockAdd" :language="language" :subfield="subfield" :editable="editable" :defaultOpen="defaultOpen" :toolbarsFlag="toolbarsFlag" :navigation="navigation" :toolbars="toolbars" />
      </eb-box>
    </template>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  meta: {
    size: 'large',
  },
  mixins: [ ebPageContext ],
  data() {
    return {
      dirty: false,
      module: null,
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
  created() {},
  methods: {
    onChange(data) {
      if (this.readOnly) return;
      if (this.item.content === data) return;
      this.dirty = true;
      this.contextCallback(200, { content: data });
    },
    onSave() {
      this.onPerformSave().then(text => {
        this.$view.toast.show({ text });
      }).catch(err => {
        this.$view.toast.show({ text: err.message });
      });
    },
    onPerformSave() {
      return this.contextParams.ctx.save().then(() => {
        this.dirty = false;
        return this.$text('Saved');
      });
    },
  },
};

</script>
