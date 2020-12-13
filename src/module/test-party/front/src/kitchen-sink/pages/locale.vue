<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Locale')" eb-back-link="Back"></eb-navbar>
    <eb-list no-hairlines-md>
      <eb-list-item :title="$text('en-us')">
        <div slot="after">
          <f7-badge>{{$text.locale('en-us','EnglishTest')}}</f7-badge>
          <f7-badge>{{$text.locale('en-us','Chinese Test')}}</f7-badge>
        </div>
      </eb-list-item>
      <eb-list-item v-if="localeCurrent==='zh-cn'" :title="$text('zh-cn')">
        <div slot="after">
          <f7-badge>{{$text.locale('zh-cn','EnglishTest')}}</f7-badge>
          <f7-badge>{{$text.locale('zh-cn','Chinese Test')}}</f7-badge>
        </div>
      </eb-list-item>
      <f7-list-item divider></f7-list-item>
      <eb-list-item :title="$text('Language')" link="#" :onPerform="onPerformLanguage"></eb-list-item>
    </eb-list>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      localeCurrent: null,
    };
  },
  created() {
    this.localeCurrent = this.$meta.util.getLocale();
  },
  methods: {
    onPerformLanguage(event) {
      const resourceConfig = {
        actionModule: 'a-user',
        actionComponent: 'action',
        name: 'appearanceLanguage',
      };
      const action = this.$utils.extend({}, resourceConfig, {
        targetEl: event.target,
      });
      return this.$meta.util.performAction({ ctx: this, action, item: null });
    },
  },
};

</script>
