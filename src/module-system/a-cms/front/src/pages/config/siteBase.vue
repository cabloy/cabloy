<template>
  <eb-page>
    <eb-navbar :title="$text('Default')" eb-back-link="Back"></eb-navbar>
    <eb-box @size="onSize">
      <textarea ref="textarea" type="textarea" readonly="readonly" :value="content" class="json-textarea"></textarea>
    </eb-box>
  </eb-page>
</template>
<script>
import utils from '../../common/utils.js';
export default {
  data() {
    const atomClass = utils.parseAtomClass(this.$f7route.query);
    return {
      atomClass,
      content: '{}',
    };
  },
  created() {
    this.$local.dispatch('getConfigSiteBase', {
      atomClass: this.atomClass,
    }).then(data => {
      if (!data) {
        this.content = '{}';
      } else {
        this.content = JSON5.stringify(data, null, 2);
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
