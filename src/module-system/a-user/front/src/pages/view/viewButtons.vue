<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="pageTitle" eb-back-link="Back"></eb-navbar>
    <f7-list v-if="buttonsUser">
      <eb-list-item v-for="button of buttonsUser" :key="_buttonFullName(button)" checkbox :checked="getButtonChecked(button)" @change="onButtonChange($event,button)" :title="button.titleLocale">
      </eb-list-item>
    </f7-list>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebModules = Vue.prototype.$meta.module.get('a-base').options.mixins.ebModules;
export default {
  mixins: [ebModules],
  data() {
    return {
      side: this.$f7route.query.side,
      buttonsUser: null,
    };
  },
  created() {
    this.$store.dispatch('a/base/getUserButtons').then(buttons => {
      this.buttonsUser = buttons;
    });
  },
  computed: {
    pageTitle() {
      return this.$text('Header Buttons');
    },
    buttonsShow() {
      return this.$meta.vueLayout.sidebar[this.side].buttons;
    },
  },
  methods: {
    onButtonChange(event, button) {
      const checked = event.target.checked;
      this.$nextTick(() => {
        if (checked) {
          this.$meta.vueLayout.openButton(this.side, button);
        } else {
          this.$meta.vueLayout.closeButton(this.side, button);
        }
      });
    },
    getButtonChecked(button) {
      const _item = this.buttonsShow.find(item => this._buttonFullName(item) === this._buttonFullName(button));
      return !!_item;
    },
    _buttonFullName(button) {
      if (button.module) return `${button.module}:${button.name}`;
      return button.name;
    },
  },
};

</script>
