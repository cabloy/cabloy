export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    blockConfig: {
      type: Object,
    },
  },
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
    onItemClick() {
      // todo
      console.log('ss');
    },
    onItemChange(event, item) {
      // todo
    },
    getItemMetaMedia(item) {
      const media = (item._meta && item._meta.media) || item.avatar || this.$meta.config.modules['a-base'].user.avatar.default;
      return this.$meta.util.combineImageUrl(media, 32);
    },
    _renderList() {
      const items = [{ atomId: 1 }];// this.layoutManager.items;
      const children = [];
      for (const item of items) {
        let domMedia;
        if (this.layoutManager.scene !== 'selectSearch') {
          domMedia = (
            <div slot="media">
              <img class="avatar avatar32" src={this.getItemMetaMedia(item)} />
            </div>
          );
        }
        children.push(
          <eb-list-item class="item" key={item.atomId}
            name={this.layoutManager.radioName}
            radio={this.layoutManager.scene === 'selectSearch' && this.layoutManager.params.selectMode === 'single'}
            checkbox={this.layoutManager.scene === 'selectSearch' && this.layoutManager.params.selectMode === 'multiple'}
            link={this.layoutManager.scene === 'selectSearch' ? false : '#'}
            context={item} propsOnPerform={this.onItemClick}
            onChange={$event => { this.onItemChange($event, item); }}>
            {domMedia}
          </eb-list-item>
        );
      }
      return (
        <f7-list>
          {children}
        </f7-list>
      );
    },
  },
  render() {
    return (
      <div>
        {this._renderList()}
      </div>
    );
  },
};
