<template>
  <span>{{$text('CopyrightTip')}}</span>
</template>
<script>
// export
export default {
  install,
};

// install
function install(_Vue) {
  const Vue = _Vue;
  const ebLayoutSectionBase = Vue.prototype.$meta.module.get('a-layoutpc').options.mixins.ebLayoutSectionBase;
  return {
    mixins: [ebLayoutSectionBase],
  };
}

</script>
