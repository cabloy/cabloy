<template>
  <f7-list>
    <f7-list-item smartSelect :smartSelectParams="{ openIn: 'page', closeOnSelect: true }" :title="$text('Source Widget')">
      <eb-select name="sourceWidget" :value="bindCurrent.widgetId" :options="optionsSourceWidget" @input="onInputSourceWidget"></eb-select>
    </f7-list-item>
    <f7-list-item smartSelect :smartSelectParams="{ openIn: 'page', closeOnSelect: true }" :title="$text('Property Name')">
      <eb-select name="propertyName" :value="bindCurrent.propertyName" :options="optionsPropertyName[this.bindCurrent.widgetId] || []" @input="onInputPropertyName"></eb-select>
    </f7-list-item>
  </f7-list>
</template>
<script>
export default {
  props: {
    dashboard: {
      type: Object,
    },
    widget: {
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
      optionsSourceWidget: [],
      optionsPropertyName: {},
    };
  },
  created() {
    this.bindCurrent = this.$meta.util.extend({ widgetId: '', propertyName: '' }, this.propertyBind);
    this.combineOptionsSourceWidget();
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
    combineOptionsSourceWidget() {
      // options
      const options = [{ title: '', value: '' }];
      const optionsPropertyName = {};
      // propSchema
      const propSchema = this.widget._getPropSchema(this.widget.options, this.propertyName);
      const propClues = (propSchema.ebClue || '').split(',');
      // loop
      for (const widgetItem of this.dashboard.widgetsReal) {
        const widgetIdSource = widgetItem.widgetReal.widget.options.id;
        // ignore self
        if (widgetIdSource === this.widgetId) continue;
        // optionsPropertyName
        const _optionsPropertyName = this._getOptionsPropertyName(widgetItem, propClues);
        if (_optionsPropertyName.length > 1) {
          optionsPropertyName[widgetIdSource] = _optionsPropertyName;
          options.push({
            title: widgetItem.widgetReal.widget.__getPropertyRealValue('title'),
            value: widgetIdSource,
          })
        }
      }
      this.optionsSourceWidget = options;
      this.optionsPropertyName = optionsPropertyName;
    },
    _getOptionsPropertyName(widgetItem, propClues) {
      const options = [{ title: '', value: '' }];
      // schema
      const attrsSchema = this.widget._getAttrsSchema(widgetItem.widgetReal.widget.options);
      this._combineOptionsSourceWidgetSchema(options, attrsSchema, propClues);
      return options;
    },
    _combineOptionsSourceWidgetSchema(options, attrsSchema, propClues) {
      if (!attrsSchema) return;
      for (const attrKey in attrsSchema.properties) {
        const attrSource = attrsSchema.properties[attrKey];
        const attrSourceClues = (attrSource.ebClue || '').split(',');
        // intersection
        var intersection = propClues.filter(item => attrSourceClues.indexOf(item) > -1);
        if (intersection.length > 0) {
          options.push({
            title: this.$text(attrSource.ebTitle),
            value: attrKey,
          });
        }
      }
    },
  },
};

</script>
<style lang="less" scoped>
</style>
