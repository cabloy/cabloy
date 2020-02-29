<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="title" eb-back-link="Back"></eb-navbar>
    <f7-block>
      <div class="alert-info">
        {{ $text('Please preview this page in PC mode') }}
      </div>
    </f7-block>
    <f7-block-title>Responsive Grid</f7-block-title>
    <f7-block>
      <p>Grid cells have different size on Small/Medium/Large</p>
      <p>Small: 100; medium: 50; large: 25; </p>
      <f7-row>
        <f7-col class="demo-col" width="100" medium="50" large="25">1</f7-col>
        <f7-col class="demo-col" width="100" medium="50" large="25">2</f7-col>
        <f7-col class="demo-col" width="100" medium="50" large="25">3</f7-col>
        <f7-col class="demo-col" width="100" medium="50" large="25">4</f7-col>
      </f7-row>
    </f7-block>
  </eb-page>
</template>
<script>
export default {
  meta: {
    size: 'large',
  },
  data() {
    return {};
  },
  computed: {
    title() {
      return `${this.$text('View Size')}: Large`;
    },
  },
};

</script>
<style lang="less" scoped>
.demo-col {
  background: #fff;
  text-align: center;
  color: #000;
  border: 1px solid #ddd;
  padding: 5px;
  margin-bottom: 16px;
  font-size: 12px;
}

</style>
