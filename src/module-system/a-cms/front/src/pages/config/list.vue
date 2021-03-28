<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="title" eb-back-link="Back"> </eb-navbar>
    <div v-if="ready">
      <f7-list>
        <eb-list-item :title="$text('Site')">
          <div slot="after">
            <eb-link iconMaterial="settings" :eb-href="combineAtomClass('config/site')">{{$text('Config')}}</eb-link>
            <eb-link iconMaterial="build" :onPerform="onPerformBuild">{{$text('Build')}}</eb-link>
            <eb-link v-if="!!$device.desktop && !languageEnable" iconMaterial="visibility" :onPerform="onPerformPreview">{{$text('Preview')}}</eb-link>
          </div>
        </eb-list-item>
        <f7-list-group v-if="languageEnable">
          <f7-list-item :title="$text('Languages')" group-title></f7-list-item>
        </f7-list-group>
      </f7-list>
      <div v-for="item of languages" :key="item.value">
        <f7-block-title medium v-if="languageEnable">{{item.title}}</f7-block-title>
        <f7-card>
          <f7-card-content>
            <f7-row>
              <f7-col class="flex-direction-column text-align-center">
                <div>
                  <eb-link :eb-href="combineLinkArticles(item.value)">{{atomClassBase.titleLocale}}</eb-link>
                </div>
                <div>{{getStat(item.value,'atoms')}}</div>
              </f7-col>
              <f7-col class="flex-direction-column text-align-center">
                <div>
                  <eb-link :eb-href="combineLinkComments(item.value)">{{$text('Comment')}}</eb-link>
                </div>
                <div>{{getStat(item.value,'comments')}}</div>
              </f7-col>
              <f7-col v-if="!!atomClassBase.category" class="flex-direction-column text-align-center">
                <div>
                  <eb-link :eb-href="combineLinkCategoriesTags(item,'/a/baseadmin/category/tree')">{{$text('Category')}}</eb-link>
                </div>
                <div>{{getStat(item.value,'categories')}}</div>
              </f7-col>
              <f7-col v-if="!!atomClassBase.tag" class="flex-direction-column text-align-center">
                <div>
                  <eb-link :eb-href="combineLinkCategoriesTags(item,'/a/baseadmin/tag/list')">{{$text('Tag')}}</eb-link>
                </div>
                <div>{{getStat(item.value,'tags')}}</div>
              </f7-col>
            </f7-row>
          </f7-card-content>
          <f7-card-footer v-if="languageEnable">
            <eb-link iconMaterial="settings" :eb-href="combineAtomClass(`config/language?language=${item.value}`)">{{$text('Config')}}</eb-link>
            <eb-link iconMaterial="build" :context="item" :onPerform="onPerformBuildLanguage">{{$text('Build')}}</eb-link>
            <eb-link v-if="!!$device.desktop" iconMaterial="visibility" :context="item" :onPerform="onPerformPreview">{{$text('Preview')}}</eb-link>
          </f7-card-footer>
        </f7-card>
      </div>
    </div>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebModules = Vue.prototype.$meta.module.get('a-base').options.mixins.ebModules;
const ebAtomClasses = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomClasses;
import utils from '../../common/utils.js';
export default {
  mixins: [ ebModules, ebAtomClasses ],
  data() {
    const title = this.$f7route.query.title;
    const atomClass = utils.parseAtomClass(this.$f7route.query);
    return {
      title,
      atomClass,
      stats: null,
      languageEnable: true,
    };
  },
  computed: {
    ready() {
      return this.modulesAll && this.atomClassesAll && this.languages;
    },
    languages() {
      const atomClassNameFull = `${this.atomClass.module}:${this.atomClass.atomClassName}`;
      return this.$local.state.languages[atomClassNameFull];
    },
    atomClassBase() {
      return this.getAtomClass(this.atomClass);
    },
  },
  watch: {
    languages(value) {
      // should invoke on change
      this.onLanguagesChanged(value);
    },
  },
  created() {
    this.$local.dispatch('getLanguages', {
      atomClass: this.atomClass,
    }).then(value => {
      // should invoke on init
      this.onLanguagesChanged(value);
    });
  },
  methods: {
    onLanguagesChanged(languages) {
      if (!languages) return;
      this.languageEnable = languages[0].value !== 'default';
      this.getStats(languages);
    },
    combineAtomClass(url) {
      return utils.combineAtomClass(this.atomClass, url);
    },
    onPerformBuild() {
      return this.$view.dialog.confirm().then(() => {
        return this.$api.post('site/buildLanguages', {
          atomClass: this.atomClass,
        }).then(data => {
          const progressId = data.progressId;
          this.$view.dialog.progressbar({ progressId, title: this.$text('Build All Languages') });
        });
      });
    },
    onPerformBuildLanguage(event, context) {
      return this.$view.dialog.confirm().then(() => {
        return this.$api.post('site/buildLanguage', {
          atomClass: this.atomClass,
          language: context.value,
        }).then(data => {
          const progressId = data.progressId;
          this.$view.dialog.progressbar({ progressId, title: `${this.$text('Build')} ${context.title}` });
        });
      });
    },
    onPerformPreview(event, context) {
      const language = context ? context.value : 'default';
      return this.$api.post('site/getUrl', {
        atomClass: this.atomClass,
        language,
        path: 'index.html',
      }).then(data => {
        window.open(data, `cms_site_${this.atomClass.module}_${context.value}`);
      });
    },
    combineLinkArticles(language) {
      const options = {};
      if (this.languageEnable) {
        options.language = language;
      }
      return this.combineAtomClass(`/a/basefront/atom/list?options=${encodeURIComponent(JSON.stringify(options))}`);
    },
    combineLinkComments(language) {
      const where = {};
      if (this.languageEnable) {
        where['a.atomLanguage'] = language;
      }
      return this.combineAtomClass(`/a/basefront/comment/all?where=${encodeURIComponent(JSON.stringify(where))}`);
    },
    combineLinkCategoriesTags(item, link) {
      if (this.languageEnable) {
        link = `${link}?language=${item.value}&languageTitle=${item.title}`;
      }
      return this.combineAtomClass(link);
    },
    getStats(languages) {
      if (!languages) {
        this.stats = null;
        return;
      }
      this.$api.post('site/getStats', {
        atomClass: this.atomClass,
        languages: languages.map(item => item.value),
      }).then(data => {
        this.stats = data;
      });
    },
    getStat(language, fieldName) {
      if (!this.stats) return '--';
      const stats = this.stats[language];
      if (!stats) return '--';
      return stats[fieldName];
    },
  },
};

</script>
