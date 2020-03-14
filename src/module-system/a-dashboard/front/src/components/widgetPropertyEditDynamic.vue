<template>
  <f7-list>
    <f7-list-item smartSelect :smartSelectParams="{ openIn: 'page', closeOnSelect: true }" :title="$text('Source Widget')">
      <eb-select name="sourceWidget" :value="bindCurrent.widgetId" :options="getOptionsSourceWidget()" @input="onInputSourceWidget"></eb-select>
    </f7-list-item>
    <f7-list-item smartSelect :smartSelectParams="{ openIn: 'page', closeOnSelect: true }" :title="$text('Property Name')">
      <eb-select name="propertyName" :value="bindCurrent.propertyName" :options="getOptionsPropertyName()" @input="onInputPropertyName"></eb-select>
    </f7-list-item>
  </f7-list>
</template>
<script>
export default {
  props: {
    dashboard: {
      type: Object,
    },
    widgetId: {
      type: String,
    },
    propertyName: {
      type: String,
    },
    propertyBind: {
      type: Object,
    },
  },
  data() {
    return {
      bindCurrent: null,
    };
  },
  created() {
    this.bindCurrent = this.$meta.util.extend({ widgetId: '', propertyName: '' }, this.propertyBind);
  },
  methods: {
    onInputSourceWidget(value) {
      this.bindCurrent.widgetId = value;
      this.bindCurrent.propertyName = '';
      this.$emit('bind:change', this.bindCurrent);
    },
    onInputPropertyName(value) {
      this.bindCurrent.propertyName = value;
      this.$emit('bind:change', this.bindCurrent);
    },
    getOptionsSourceWidget() {
      const options = [{ title: '', value: '' }];
      for (const widgetItem of this.dashboard.widgetsReal) {
        const component = widgetItem.widgetReal.$options;
        const attrs = component.meta && component.meta.widget && component.meta.widget.attrs;
        const widgetId = widgetItem.widgetReal.widget.options.id;
        if (widgetId !== this.widgetId && attrs) {
          options.push({
            title: widgetItem.widgetReal.widget.__getPropertyRealValue('title'),
            value: widgetId,
          })
        }
      }
      return options;
    },
    getOptionsPropertyName() {
      const options = [{ title: '', value: '' }];
      if (!this.bindCurrent.widgetId) return options;
      const [widgetItem] = this.dashboard.__findWidgetRealById(this.bindCurrent.widgetId);
      if (!widgetItem) return options;
      const component = widgetItem.widgetReal.$options;
      const attrs = component.meta && component.meta.widget && component.meta.widget.attrs;
      if (!attrs) return options;
      for (const attrKey in attrs) {
        options.push({
          title: this.$text(attrs[attrKey].ebTitle),
          value: attrKey,
        });
      }
      return options;
    },
  },
};

</script>
<style lang="less" scoped>
</style>
