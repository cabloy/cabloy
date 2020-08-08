<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Button Event')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="save" :onPerform="onPerformTrue"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <f7-block-title>eb-button</f7-block-title>
    <f7-block>
      <f7-row>
        <f7-col>
          <eb-button fill @click="onClick">@click</eb-button>
        </f7-col>
        <f7-col>
          <eb-button fill :onPerform="onPerform">:onPerform</eb-button>
        </f7-col>
        <f7-col>
          <eb-button fill :onPerform="onPerformTrue">:onPerform</eb-button>
        </f7-col>
      </f7-row>
    </f7-block>
    <f7-block-title>eb-link</f7-block-title>
    <f7-block>
      <f7-row class="test-link">
        <f7-col>
          <eb-link @click="onClick">@click</eb-link>
        </f7-col>
        <f7-col>
          <eb-link :onPerform="onPerformTrue">:onPerform</eb-link>
        </f7-col>
      </f7-row>
    </f7-block>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    onClick() {
      this.$view.toast.show({ text: 'Clicked' });
    },
    onPerform() {
      this.$view.toast.show({ text: 'Clicked' });
      return new Promise(resolve => {
        window.setTimeout(() => {
          this.$view.toast.show({ text: 'Done' });
          resolve();
        }, 2000);
      });
    },
    onPerformTrue() {
      this.$view.toast.show({ text: 'Clicked' });
      return new Promise(resolve => {
        window.setTimeout(() => {
          resolve(true);
        }, 2000);
      });
    },
  },
};

</script>
<style scoped>
.test-link {
  text-align: center;
}

</style>
