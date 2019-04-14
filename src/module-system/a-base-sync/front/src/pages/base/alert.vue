<template>
  <eb-page>
    <eb-navbar :title="pageTitle" eb-back-link="Back"></eb-navbar>
    <f7-card>
      <f7-card-header>{{data.title || $text('Friendly Tips')}}</f7-card-header>
      <f7-card-content>
        {{data.message}}
      </f7-card-content>
      <f7-card-footer v-if="data.link">
        <div></div>
        <eb-link :eb-href="data.link">{{data.linkText || $text('Link')}}</eb-link>
      </f7-card-footer>
    </f7-card>
  </eb-page>
</template>
<script>
export default {
  components: {},
  data() {
    const data = JSON.parse(this.$f7route.query.data);
    return {
      data,
    };
  },
  computed: {
    pageTitle() {
      return this.$store.state.auth.instance.title;
    },
  },
  methods: {},
};

</script>
<style lang="less" scoped>
</style>
