<template>
  <eb-page>
    <eb-navbar :title="$text('Default')" eb-back-link="Back">
    </eb-navbar>
    <textarea ref="textarea" type="textarea" readonly="readonly" :value="content" class="cms-json-textarea"></textarea>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      content: '{}',
      _unwatch: null,
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
      const size = this.$view.sizeExtent;
      if (size) {
        this.$$(this.$refs.textarea).css({
          height: `${size.height - 84}px`,
          width: `${size.width - 20}px`,
        });
      }
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
