<template>
  <eb-page>
    <eb-navbar :title="$text('Box Container')" eb-back-link="Back"> </eb-navbar>
    <eb-box @size="onSize" toolbar>
      <textarea ref="textarea" type="textarea" :value="content" class="json-textarea"></textarea>
    </eb-box>
    <f7-toolbar bottom-md>
      <f7-button>left</f7-button>
      <f7-button>middle</f7-button>
      <eb-button>right</eb-button>
    </f7-toolbar>
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
