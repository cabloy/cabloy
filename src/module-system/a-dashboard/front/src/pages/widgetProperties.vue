<template>
  <eb-page>
    <eb-navbar :title="$text('Properties')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link v-if="widget.options.group" :onPerform="onPerformAddWidget">{{$text('Add Widget')}}</eb-link>
      </f7-nav-right>
    </eb-navbar>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.components.ebPageContext;
export default {
  mixins: [ebPageContext],
  data() {
    return {
      widgetId: parseInt(this.$f7route.query.widgetId),
    };
  },
  computed: {
    dashboard() {
      return this.contextParams.dashboard;
    },
    widget() {
      return this.contextParams.widget;
    },
  },
  created() {},
  mounted() {
    this.widget.$on('widget:destroy', this.onWidgetDestroy);
  },
  beforeDestroy() {
    this.widget.$off('widget:destroy', this.onWidgetDestroy);
  },
  methods: {
    onWidgetDestroy() {
      this.$view.close();
    },
    onPerformAddWidget() {
      this.$view.navigate('/a/dashboard/widget/add', {
        target: '_self',
        context: {
          callback: (code, data) => {
            if (code === 200) {
              this.widget.onWidgetsAdd(data);
            }
          },
        },
      });
    },
  },
}

</script>
