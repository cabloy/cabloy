<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('View Size & Open Target')" eb-back-link="Back"></eb-navbar>
    <eb-list no-hairlines-md>
      <f7-list-item group-title :title="$text('View Size')"></f7-list-item>
      <eb-list-item title="Small" link="#" eb-href="kitchen-sink/view/sizeSmall"></eb-list-item>
      <eb-list-item title="Medium" link="#" eb-href="kitchen-sink/view/sizeMedium"></eb-list-item>
      <eb-list-item title="Large" link="#" eb-href="kitchen-sink/view/sizeLarge"></eb-list-item>
      <f7-list-item group-title :title="$text('Open Target')"></f7-list-item>
      <eb-list-item title="default" link="#" eb-href="kitchen-sink/view/sizeSmall"></eb-list-item>
      <eb-list-item title="_self(Small)" link="#" eb-target="_self" eb-href="kitchen-sink/view/sizeSmall"></eb-list-item>
      <eb-list-item title="_self(Medium)" link="#" :onPerform="onPerformOpenTargetSelf"></eb-list-item>
      <eb-list-item title="_view" link="#" :onPerform="onPerformOpenTargetView"></eb-list-item>
    </eb-list>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    onPerformOpenTargetSelf() {
      this.$view.navigate('/test/party/kitchen-sink/view/sizeMedium', {
        target: '_self',
      });
    },
    onPerformOpenTargetView() {
      this.$view.navigate('/test/party/kitchen-sink/view/sizeSmall', {
        target: '_view',
      });
    },
  },
};

</script>
