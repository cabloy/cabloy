<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('About')" eb-back-link="Back">
      <f7-nav-right>
        <f7-link
          :external="true"
          target="_blank"
          href="https://github.com/zhennann/cabloy/blob/master/src/module-system/a-basefront/front/src/pages/base/about.vue"
        >
          {{ $text('kitchenSinkSource') }}
        </f7-link>
      </f7-nav-right>
    </eb-navbar>
    <f7-toolbar position="bottom">
      <f7-link external target="_blank" href="https://cabloy.com">{{ $text('Documentation') }}</f7-link>
      <f7-link external target="_blank" href="https://community.cabloy.com">{{ $text('Community') }}</f7-link>
      <f7-link external target="_blank" href="https://github.com/zhennann/cabloy">GitHub</f7-link>
    </f7-toolbar>
    <f7-block-title>{{ $text('Welcome to CabloyJS') }}</f7-block-title>
    <f7-block strong>
      <div class="alert-info">{{ $text('CabloyAboutTip1') }}</div>
      <p>{{ $text('CabloyAboutTip2') }}</p>
      <p>{{ $text('CabloyAboutTip3') }}</p>
      <p>{{ $text('CabloyAboutTip4') }}</p>
    </f7-block>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {};
  },
};
</script>
<style scoped></style>
