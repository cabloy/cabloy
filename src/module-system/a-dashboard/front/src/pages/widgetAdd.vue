<template>
  <eb-page>
    <eb-navbar :title="$text('Add Widget')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link v-if="widgetsSelected.length>0" iconMaterial="done" :onPerform="onPerformDone"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <f7-list v-if="widgetsUser">
      <eb-list-item v-for="widget of widgetsUser" :key="_widgetFullName(widget)" checkbox :checked="getWidgetChecked(widget)" @change="onWidgetChange($event,widget)" :title="widget.titleLocale">
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
      widgetsSelected: [],
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
      if (this.widgetsSelected.length === 0) return;
      const widgets = this.widgetsSelected.map(item => {
        return { module: item.module, name: item.name };
      });
      this.contextCallback(200, { widgets });
      this.$f7router.back();
    },
    onWidgetChange(e, widget) {
      const index = this._getWidgetIndex(widget);
      if (index === -1) {
        this.widgetsSelected.push({ module: widget.module, name: widget.name, });
      } else {
        this.widgetsSelected.splice(index, 1);
      }
    },
    _widgetFullName(widget) {
      return `${widget.module}:${widget.name}`;
    },
    _getWidgetIndex(widget) {
      return this.widgetsSelected.findIndex(item => this._widgetFullName(widget) === this._widgetFullName(item));
    },
    getWidgetChecked(widget) {
      const index = this._getWidgetIndex(widget);
      return index > -1;
    },
  },

}

</script>
