<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="pageTitle" eb-back-link="Back"> </eb-navbar>
    <f7-list>
      <eb-list-item :title="$text('Site')">
        <div slot="after">
          <eb-link iconMaterial="settings" :eb-href="combineAtomClass('config/site')">{{$text('Config')}}</eb-link>
          <eb-link iconMaterial="build" :onPerform="onPerformBuild">{{$text('Build')}}</eb-link>
        </div>
      </eb-list-item>
      <f7-list-group>
        <f7-list-item :title="$text('Languages')" group-title></f7-list-item>
        <template v-if="languages">
          <div v-for="item of languages" :key="item.value">
            <f7-block-title medium>{{item.title}}</f7-block-title>
            <f7-card>
              <f7-card-content>
                <f7-row>
                  <f7-col class="flex-direction-column text-align-center">
                    <div>
                      <eb-link :eb-href="combineLinkArticles(item.value)">{{$text('Articles')}}</eb-link>
                    </div>
                    <div>{{getStat(item.value,'articles')}}</div>
                  </f7-col>
                  <f7-col class="flex-direction-column text-align-center">
                    <div>
                      <eb-link :eb-href="combineLinkComments(item.value)">{{$text('Comments')}}</eb-link>
                    </div>
                    <div>{{getStat(item.value,'comments')}}</div>
                  </f7-col>
                  <f7-col class="flex-direction-column text-align-center">
                    <div>
                      <eb-link :eb-href="combineAtomClass(`category/list?language=${item.value}`)">{{$text('Categories')}}</eb-link>
                    </div>
                    <div>{{getStat(item.value,'categories')}}</div>
                  </f7-col>
                  <f7-col class="flex-direction-column text-align-center">
                    <div>{{$text('Tags')}}</div>
                    <div>{{getStat(item.value,'tags')}}</div>
                  </f7-col>
                </f7-row>
              </f7-card-content>
              <f7-card-footer>
                <eb-link iconMaterial="settings" :eb-href="combineAtomClass(`config/language?language=${item.value}`)">{{$text('Config')}}</eb-link>
                <eb-link iconMaterial="build" :context="item" :onPerform="onPerformBuildLanguage">{{$text('Build')}}</eb-link>
                <eb-link v-if="!!$device.desktop" iconMaterial="visibility" :context="item" :onPerform="onPerformPreview">{{$text('Preview')}}</eb-link>
              </f7-card-footer>
            </f7-card>
          </div>
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
  mixins: [ebModules],
  data() {
    const atomClass = utils.parseAtomClass(this.$f7route.query);
    return {
      atomClass,
      stats: null,
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
  watch: {
    languages(value) {
      this.getStats(value);
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
      return this.$api.post('site/getUrl', {
        atomClass: this.atomClass,
        language: context.value,
        path: 'index.html',
      }).then(data => {
        window.open(data, `cms_site_${this.atomClass.module}_${context.value}`);
      });
    },
    combineLinkArticles(language) {
      const where = {
        'f.language': language
      };
      return this.combineAtomClass(`/a/base/atom/list?where=${encodeURIComponent(JSON.stringify(where))}`);
    },
    combineLinkComments(language) {
      const where = {
        'f.language': language
      };
      return this.combineAtomClass(`/a/base/comment/all?where=${encodeURIComponent(JSON.stringify(where))}`);
    },
    getStats(languages) {
      if (!languages) {
        return this.stats = null;
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
    }
  },
};

</script>
