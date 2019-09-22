<template>
  <eb-page>
    <eb-navbar :title="$text('Edit')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="save" :onPerform="onPerformSave"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-box @size="onSize">
      <textarea ref="textarea" type="textarea" :value="content" @input="onInput" class="json-textarea"></textarea>
      <template v-if="meta">
        <f7-block-title>{{$text('Info')}}</f7-block-title>
        <div class="json-textarea">{{meta}}</div>
      </template>
    </eb-box>
  </eb-page>
</template>
<script>
export default {
  meta: {
    global: false,
  },
  data() {
    return {
      id: parseInt(this.$f7route.query.id),
      item: null,
      content: '{}',
      meta: '',
    };
  },
  created() {
    this.$api.post('auth/item', { id: this.id }).then(data => {
      this.item = data;
      // config
      if (!data.config) {
        this.content = '{}';
      } else {
        this.content = JSON.stringify(JSON.parse(data.config), null, 2);
      }
      // meta
      if (!data._meta) {
        this.meta = '';
      } else {
        this.meta = JSON.stringify(data._meta, null, 2);
      }
    });
  },
  methods: {
    onSize(size) {
      this.$$(this.$refs.textarea).css({
        height: '200px', // `${size.height - 20}px`,
        width: `${size.width - 20}px`,
      });
    },
    onInput(event) {
      this.content = event.target.value;
    },
    onPerformSave() {
      return this.$api.post('auth/save', {
        id: this.id,
        data: JSON.parse(this.content),
      }).then(() => {
        this.$f7router.back();
      });
    },
  },
};

</script>
<style lang="less" scoped>
</style>
