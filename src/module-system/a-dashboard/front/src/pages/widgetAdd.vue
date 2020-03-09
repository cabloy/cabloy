<template>
  <eb-page>
    <eb-navbar :title="$text('Add Widget')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link v-if="!!widgetSelected" iconMaterial="done" :onPerform="onPerformDone"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <f7-list v-if="widgetsUser">
      <eb-list-item v-for="widget of widgetsUser" :key="_widgetFullName(widget)" radio :checked="getWidgetChecked(widget)" @change="onWidgetChange($event,widget)" :title="widget.titleLocale">
      </eb-list-item>
    </f7-list>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.components.ebPageContext;
export default {
  mixins: [ebPageContext],
  data() {
    return {
      widgetSelected: null,
      widgetsUser: null,
    };
  },
  created() {
    this.$store.dispatch('a/base/getUserWidgets').then(widgets => {
      this.widgetsUser = widgets;
    });
  },
  methods: {
    onPerformDone() {
      if (!this.widgetSelected) return;
      this.contextCallback(200, {
        widget: {
          module: this.widgetSelected.module,
          name: this.widgetSelected.name,
        },
      });
      this.$f7router.back();
    },
    onWidgetChange(e, widget) {
      this.widgetSelected = widget;
    },
    _widgetFullName(widget) {
      return `${widget.module}:${widget.name}`;
    },
    getWidgetChecked(widget) {
      if (!this.widgetSelected) return false;
      return this._widgetFullName(widget) === this._widgetFullName(this.widgetSelected);
    },
  },

}

</script>
