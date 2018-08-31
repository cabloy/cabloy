<template>
  <eb-page>
    <eb-navbar :title="$text('cms')" eb-back-link="Back"> </eb-navbar>
    <f7-list>
      <eb-list-item :title="$text('Site')">
        <div slot="after">
          <eb-link eb-href="config/site">{{$text('Config')}}</eb-link>
          <eb-link :onPerform="onPerformBuild">{{$text('Build')}}</eb-link>
        </div>
      </eb-list-item>
      <f7-list-group>
        <f7-list-item :title="$text('Languages')" group-title></f7-list-item>
        <eb-list-item v-for="item of languages" :key="item" :title="item">
          <div slot="after">
            <eb-link :eb-href="`category/list?language=${item}`">{{$text('Categories')}}</eb-link>
            <eb-link :eb-href="`config/language?language=${item}`">{{$text('Config')}}</eb-link>
            <eb-link :context="item" :onPerform="onPerformBuildLanguage">{{$text('Build')}}</eb-link>
          </div>
        </eb-list-item>
      </f7-list-group>
    </f7-list>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {};
  },
  computed: {
    languages() {
      return this.$local.getters('languages');
    },
  },
  created() {
    this.$local.dispatch('getLanguages');
  },
  methods: {
    onPerformBuild() {
      return this.$view.dialog.confirm().then(() => {
        return this.$api.post('site/buildLanguages').then(data => {
          return `${this.$text('Time Used')}: ${data.time}${this.$text('seconds')}`;
        });
      });
    },
    onPerformBuildLanguage(event, context) {
      return this.$view.dialog.confirm().then(() => {
        return this.$api.post('site/buildLanguage', {
          language: context,
        }).then(data => {
          return `${this.$text('Time Used')}: ${data.time}${this.$text('seconds')}`;
        });
      });
    },
  },
};

</script>
