<template>
  <eb-page>
    <eb-navbar :title="pageTitle" eb-back-link="Back"></eb-navbar>
    <f7-card>
      <f7-card-header>{{ data.title || $text('OpenLinkTitleRedirect') }}</f7-card-header>
      <f7-card-content>
        <eb-link :onPerform="onPerformOpenLink">{{ data.linkText || $text('Open Link') }}</eb-link>
      </f7-card-content>
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
  methods: {
    onPerformOpenLink() {
      window.open(this.data.link, this.data.target || '_blank');
      this.$f7router.back();
    },
  },
};
</script>
<style lang="less" scoped></style>
