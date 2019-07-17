<template>
  <eb-page>
    <eb-navbar :title="$text('Box Container')" eb-back-link="Back"> </eb-navbar>
    <eb-box @size="onSize">
      <textarea ref="textarea" type="textarea" :value="content" class="json-textarea"></textarea>
    </eb-box>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      content: '',
    };
  },
  created() {
    const data = {
      userName: 'zhennann',
      sex: 'Male',
    };
    this.content = JSON.stringify(data, null, 2);
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
<style scoped>
</style>
