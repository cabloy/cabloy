<template>
  <eb-page>
    <eb-navbar :title="$text('Site Configuration')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="save" :onPerform="onPerformSave"></eb-link>
        <eb-link iconMaterial="info" :eb-href="combineAtomClass('config/siteBase')"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-box @size="onSize">
      <textarea ref="textarea" type="textarea" :value="content" @input="onInput" class="json-textarea json-textarea-margin"></textarea>
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
    this.$local.dispatch('getConfigSite', {
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
    combineAtomClass(url) {
      return utils.combineAtomClass(this.atomClass, url);
    },
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
      const data = JSON5.parse(this.content);
      return this.$api.post('site/setConfigSite', {
        atomClass: this.atomClass,
        data,
      }).then(() => {
        // change
        this.$local.commit('setConfigSite', { atomClass: this.atomClass, configSite: data });
        // refetch languages
        this.$local.commit('setLanguages', { atomClass: this.atomClass, languages: null });
        this.$local.dispatch('getLanguages', { atomClass: this.atomClass });
        return true;
      });
    },
  },
};

</script>
<style>
</style>
