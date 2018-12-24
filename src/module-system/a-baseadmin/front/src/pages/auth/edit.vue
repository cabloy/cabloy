<template>
  <eb-page>
    <eb-navbar :title="$text('Edit')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="save" :onPerform="onPerformSave"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-box @size="onSize">
      <textarea ref="textarea" type="textarea" :value="content" @input="onInput" class="json-textarea"></textarea>
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
    };
  },
  created() {
    this.$api.post('auth/item', { id: this.id }).then(data => {
      this.item = data;
      if (!data.config) {
        this.content = '{}';
      } else {
        this.content = JSON.stringify(JSON.parse(data.config), null, 2);
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
<style scoped>
</style>
