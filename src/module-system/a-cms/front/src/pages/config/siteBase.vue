<template>
  <eb-page>
    <eb-navbar :title="$text('Default')" eb-back-link="Back">
    </eb-navbar>
    <eb-box @size="onSize">
      <textarea ref="textarea" type="textarea" readonly="readonly" :value="content" class="cms-json-textarea"></textarea>
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
    this.$local.dispatch('getConfigSiteBase').then(data => {
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
  },
};

</script>
<style>


</style>
