<template>
  <eb-page>
    <eb-navbar :title="$text('Site Configuration')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="save" :onPerform="onPerformSave"></eb-link>
        <eb-link :onPerform="onPerformSave"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <textarea ref="textarea" type="textarea" :value="content" @input="onInput" class="cms-json-textarea"></textarea>
    <f7-toolbar bottom-md>
      <eb-link :onPerform="onPerformBuild">{{$text('Build')}}</eb-link>
    </f7-toolbar>
  </eb-page>
</template>
<script>
import Vue from 'vue';
export default {
  data() {
    return {
      content: '{}',
    };
  },
  computed: {},
  created() {
    this.$local.dispatch('getConfigSite').then(data => {
      if (!data) {
        this.content = '{}';
      } else {
        this.content = JSON.stringify(data, null, 2);
      }
    });
  },
  mounted() {
    const height = this.$$(this.$view.$el).height();
    const width = this.$$(this.$view.$el).width();
    this.$$(this.$refs.textarea).css({
      height: `${height - 128}px`,
      width: `${width - 20}px`,
    });
  },
  methods: {
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
    onPerformBuild() {

    },
  },
};

</script>
<style lang="less" scoped>
.cms-json-textarea {
  border: 1px solid #C3D4E7;
  margin: 10px;
  padding: 6px;
  line-height: 1.5;
}

</style>
