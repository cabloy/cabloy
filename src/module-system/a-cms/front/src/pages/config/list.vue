<template>
  <eb-page>
    <eb-navbar :title="pageTitle" eb-back-link="Back"> </eb-navbar>
    <f7-list>
      <eb-list-item :title="$text('Site')">
        <div slot="after">
          <eb-link :eb-href="combineAtomClass('config/site')">{{$text('Config')}}</eb-link>
          <eb-link :onPerform="onPerformBuild">{{$text('Build')}}</eb-link>
        </div>
      </eb-list-item>
      <f7-list-group>
        <f7-list-item :title="$text('Languages')" group-title></f7-list-item>
        <template v-if="languages">
          <eb-list-item v-for="item of languages" :key="item.value" :title="item.title">
            <div slot="after">
              <eb-link :eb-href="combineAtomClass(`category/list?language=${item.value}`)">{{$text('Categories')}}</eb-link>
              <eb-link :eb-href="combineAtomClass(`config/language?language=${item.value}`)">{{$text('Config')}}</eb-link>
              <eb-link :context="item.value" :onPerform="onPerformBuildLanguage">{{$text('Build')}}</eb-link>
              <eb-link :context="item.value" :onPerform="onPerformPreview">{{$text('Preview')}}</eb-link>
            </div>
          </eb-list-item>
        </template>
      </f7-list-group>
    </f7-list>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebModules = Vue.prototype.$meta.module.get('a-base').options.components.ebModules;
import utils from '../../common/utils.js';
export default {
  mixins: [ ebModules ],
  data() {
    const atomClass = utils.parseAtomClass(this.$f7route.query);
    return {
      atomClass,
    };
  },
  computed: {
    languages() {
      return this.$local.state.languages[this.atomClass.module];
    },
    pageTitle() {
      const module = this.getModule(this.atomClass.module);
      if (module) return module.titleLocale;
      return '';
    },
  },
  created() {
    this.$local.dispatch('getLanguages', {
      atomClass: this.atomClass,
    });
  },
  methods: {
    combineAtomClass(url) {
      return utils.combineAtomClass(this.atomClass, url);
    },
    onPerformBuild() {
      return this.$view.dialog.confirm().then(() => {
        return this.$api.post('site/buildLanguages', {
          atomClass: this.atomClass,
        }).then(data => {
          return `${this.$text('Time Used')}: ${data.time}${this.$text('seconds')}`;
        });
      });
    },
    onPerformBuildLanguage(event, context) {
      return this.$view.dialog.confirm().then(() => {
        return this.$api.post('site/buildLanguage', {
          atomClass: this.atomClass,
          language: context,
        }).then(data => {
          return `${this.$text('Time Used')}: ${data.time}${this.$text('seconds')}`;
        });
      });
    },
    onPerformPreview(event, context) {
      return this.$api.post('site/getUrl', {
        atomClass: this.atomClass,
        language: context,
        path: 'index.html',
      }).then(data => {
        window.open(data, `cms_site_${this.atomClass.module}_${context}`);
      });
    },
  },
};

</script>
