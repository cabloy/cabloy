const __renderTypes = [
  ['group', 'renderGroup'],
  ['group-empty', 'renderGroupEmpty'],
  ['group-flatten', 'renderGroupFlatten'],
  ['panel', 'renderPanel'],
  ['text', 'renderText'],
  ['toggle', 'renderToggle'],
  ['select', 'renderSelect'],
  ['file', 'renderFile'],
  ['image', 'renderImage'],
  ['colorPicker', 'renderColorPicker'],
  ['datePicker', 'renderDatePicker'],
  ['dateRange', 'renderDateRange'],
  ['button', 'renderButton'],
  ['link', 'renderLink'],
  ['component', 'renderComponent'],
  ['component-action', 'renderComponentAction'],
  ['language', 'renderLanguage'],
  ['category', 'renderCategory'],
  ['tags', 'renderTags'],
  ['resourceType', 'renderResourceType'],
  ['json', 'renderJson'],
  ['markdown', 'renderMarkdown'],
  ['markdown-content', 'renderMarkdownContent'],
  ['markdown-content-cms', 'renderMarkdownContentCms'],
  ['details', 'renderDetails'],
  ['detailsStat', 'renderDetailsStat'],
  ['dict', 'renderDict'],
  ['atom', 'renderAtom'],
  ['atomClass', 'renderAtomClass'],
  ['atomClassId', 'renderAtomClassId'],
  ['atomItem', 'renderAtomItem'],
  ['divider', 'renderDivider'],
  ['userLabel', 'renderUserLabel'],
  ['userName', 'renderUserName'],
  ['user', 'renderUser'],
  ['role', 'renderRole'],
];

export default {
  methods: {
    renderItem() {
      if (!this.validate.ready) return <div></div>;
      // context
      const parcel = this.getParcel();
      const key = this.dataKey;
      const context = this.getContext({
        parcel,
        key,
        property: this.property || parcel.properties[key],
        meta: this.meta,
      });
      // renderItem
      return this._renderItem(context);
    },
    _renderItem(context) {
      const { parcel, key, property } = context;
      // ebType
      const ebType = property.ebType;
      // ignore if not specified
      if (!ebType) return null;
      // ebDisplay
      if (!this._handleComputedDisplay(parcel, key, property)) {
        // check group flatten
        if (property.ebType === 'group-flatten') {
          this._skipFlattenItems(context);
        }
        // null
        return null;
      }
      // render
      const renderType = __renderTypes.find(item => item[0].toUpperCase() === ebType.toUpperCase());
      if (!renderType) {
        // not support
        return <div>{`not supported ebType: ${ebType}`}</div>;
      }
      return this[renderType[1]](context);
    },
  },
};
