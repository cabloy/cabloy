<template>
  <f7-card>
    <f7-card-header>{{$text('About CabloyJS')}}</f7-card-header>
    <f7-card-content>
      <div class="alert-info">{{$text('CabloyAboutTip1')}}</div>
      <p>{{$text('CabloyAboutTip2')}}</p>
      <p>{{$text('CabloyAboutTip3')}}</p>
      <p>{{$text('CabloyAboutTip4')}}</p>
    </f7-card-content>
    <f7-card-footer>
      <f7-link external target="_blank" href="https://cabloy.com">{{$text('Documentation')}}</f7-link>
      <f7-link external target="_blank" href="https://community.cabloy.com">{{$text('Community')}}</f7-link>
      <f7-link external target="_blank" href="https://github.com/zhennann/cabloy">GitHub</f7-link>
    </f7-card-footer>
  </f7-card>
</template>
<script>
// export
export default {
  install,
};

// install
function install(_Vue) {
  const Vue = _Vue;
  const ebDashboardWidgetBase = Vue.prototype.$meta.module.get('a-dashboard').options.mixins.ebDashboardWidgetBase;
  return {
    mixins: [ebDashboardWidgetBase],
  };
}

</script>
