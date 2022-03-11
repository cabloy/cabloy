<template>
  <eb-link
    :class="buttonClass"
    :iconMaterial="buttonIcon && buttonIcon.material"
    :iconF7="buttonIcon && buttonIcon.f7"
    :iconSize="buttonIconSize"
    :text="buttonLabel"
    :tooltip="buttonTooltip"
    :onPerform="onPerformClick"
  ></eb-link>
</template>
<script>
// export
export default {
  installFactory,
};

// installFactory
function installFactory(_Vue) {
  const Vue = _Vue;
  const ebLayoutButtonBase = Vue.prototype.$meta.module.get('a-layoutpc').options.mixins.ebLayoutButtonBase;
  return {
    mixins: [ebLayoutButtonBase],
  };
}
</script>
