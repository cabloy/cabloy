<template>
  <eb-page>
    <eb-navbar :title="$text('Site Configuration')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="save" :onPerform="onPerformSave"></eb-link>
        <eb-link iconMaterial="info" eb-href="config/siteBase"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-box @size="onSize">
      <textarea ref="textarea" type="textarea" :value="content" @input="onInput" class="cms-json-textarea"></textarea>
    </eb-box>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      content: '{}',
    };
  },
  created() {
    this.$local.dispatch('getConfigSite').then(data => {
      if (!data) {
        this.content = '{}';
      } else {
        this.content = JSON.stringify(data, null, 2);
      }
    });
  },
  methods: {
    onSize(size) {
      this.$$(this.$refs.textarea).css({
        height: `${size.height - 20}px`,
        width: `${size.width - 20}px`,
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
  },
};

</script>
<style>


</style>
