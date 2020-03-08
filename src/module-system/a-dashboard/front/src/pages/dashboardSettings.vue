<template>
  <eb-page>
    <eb-navbar :title="$text('Profile2')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="add" :onPerform="onPerformAddWidget"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <f7-toolbar bottom-md>
      <f7-button></f7-button>
      <f7-button></f7-button>
      <eb-button :onPerform="onPerformNewProfile">{{$text('New Profile')}}</eb-button>
    </f7-toolbar>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.components.ebPageContext;
export default {
  mixins: [ebPageContext],
  computed: {
    dashboard() {
      return this.contextParams.dashboard;
    },
  },
  methods: {
    onPerformAddWidget() {
      this.$view.navigate('/a/dashboard/widget/add', {
        target: '_self',
        context: {
          callback: (code, widget) => {
            if (code === 200) {
              this.dashboard.onWidgetAdd(widget);
            }
          },
        },
      });
    },
    onPerformNewProfile() {}
  },
}

</script>
