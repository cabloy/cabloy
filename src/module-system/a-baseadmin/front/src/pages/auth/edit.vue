<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Edit')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="save" :onPerform="onPerformSave"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <f7-block>
      <textarea type="textarea" :value="content" @input="onInput" class="json-textarea auth-edit"></textarea>
      <f7-list v-if="meta">
        <f7-list-group>
          <f7-list-item group-title :title="$text('Info')"></f7-list-item>
          <f7-list-input readonly :label="$text('Login URL')" :value="meta.loginURL"></f7-list-input>
          <f7-list-input readonly :label="$text('Callback URL')" :value="meta.callbackURL"></f7-list-input>
        </f7-list-group>
      </f7-list>
    </f7-block>
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
      meta: null,
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
      this.meta = data._meta;
    });
  },
  methods: {
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
.auth-edit {
  width: 100%;
  height: 200px;
  margin: 0;
  padding: 6px;
}

</style>
