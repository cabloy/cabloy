<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Info')" eb-back-link="Back"></eb-navbar>
    <f7-block>
      <f7-list form no-hairlines-md v-if="meta">
        <f7-list-input type="textarea" readonly :label="$text('Login URL')" :value="meta.loginURL">
          <f7-link ref="loginURL" class="float-right" slot="label">{{$text('Copy')}}</f7-link>
        </f7-list-input>
        <f7-list-input type="textarea" readonly :label="$text('Callback URL')" :value="meta.callbackURL">
          <f7-link ref="callbackURL" class="float-right" slot="label">{{$text('Copy')}}</f7-link>
        </f7-list-input>
      </f7-list>
    </f7-block>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebClipboard = Vue.prototype.$meta.module.get('a-components').options.mixins.ebClipboard;
export default {
  meta: {
    global: false,
  },
  mixins: [ebClipboard],
  data() {
    return {
      id: parseInt(this.$f7route.query.id),
      item: null,
      meta: null,
    };
  },
  created() {
    this.$api.post('auth/item', { id: this.id }).then(data => {
      this.item = data;
      // meta
      this.meta = data._meta;
      // clipboard
      this.clipboardCreate();
    });
  },
  methods: {
    clipboardCreate() {
      if (!this.meta) return;
      this.$nextTick(() => {
        for (let btn of ['loginURL', 'callbackURL']) {
          this.addClipboardTrigger(this.$refs[btn].$el, {
            text: trigger => {
              return this.meta[btn];
            },
          });
        }
      });
    }
  },
};

</script>
<style lang="less" scoped>
.auth-edit {
  width: 100%;
  height: 200px;
}

</style>
