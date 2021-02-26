<template>
  <eb-link-color :class="buttonClass" :iconMaterial="buttonIcon" :text="buttonLabel" :onPerform="onPerformClick"
     :stats_params="{module: 'a-user',name: 'user'}"
  ></eb-link-color>
</template>
<script>
// export
export default {
  installFactory,
};

// installFactory
function installFactory(_Vue) {
  const Vue = _Vue;
  const ebLayoutButtonBase = Vue.prototype.$meta.module.get('a-layoutmobile').options.mixins.ebLayoutButtonBase;
  return {
    mixins: [ ebLayoutButtonBase ],
    data() {
      return {
      };
    },
    methods: {
    },
  };
}

</script>
