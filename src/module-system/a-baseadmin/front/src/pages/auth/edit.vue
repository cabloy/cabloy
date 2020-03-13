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
          <f7-list-input readonly :label="$text('Login URL')" :value="meta.loginURL">
            <f7-link ref="loginURL" class="float-right" slot="label">{{$text('Copy')}}</f7-link>
          </f7-list-input>
          <f7-list-input readonly :label="$text('Callback URL')" :value="meta.callbackURL">
            <f7-link ref="callbackURL" class="float-right" slot="label">{{$text('Copy')}}</f7-link>
          </f7-list-input>
        </f7-list-group>
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
        this.content = JSON5.stringify(JSON5.parse(data.config), null, 2);
      }
      // meta
      this.meta = data._meta;
      // clipboard
      this.clipboardCreate();
    });
  },
  methods: {
    onInput(event) {
      this.content = event.target.value;
    },
    onPerformSave() {
      return this.$api.post('auth/save', {
        id: this.id,
        data: JSON5.parse(this.content),
      }).then(() => {
        this.$f7router.back();
      });
    },
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
  margin: 0;
  padding: 6px;
}

</style>
