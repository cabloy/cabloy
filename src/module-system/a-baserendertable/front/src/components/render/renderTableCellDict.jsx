import Vue from 'vue';
const ebRenderTableCellBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebRenderTableCellBase;

export default {
  mixins: [ebRenderTableCellBase],
  data() {
    return {};
  },
  methods: {
    _renderItemTitle() {
      const { record, column } = this.info;
      const dataKey = this.base_getDataKey({ column });
      const dictItemTitle = record[`_${dataKey}TitleLocale`];
      const dictItemOptions = record[`_${dataKey}Options`];
      const domTitle = <span>{dictItemTitle}</span>;
      const icon = dictItemOptions?.icon;
      if (!icon) {
        return domTitle;
      }
      const domIcon = <f7-icon size="18" f7={icon.f7} material={icon.material}></f7-icon>;
      return (
        <div class="display-flex">
          {domIcon}
          {domTitle}
        </div>
      );
    },
  },
  render() {
    return this._renderItemTitle();
  },
};
