import Vue from 'vue';
export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    layout: {
      type: Object,
    },
    blockConfig: {
      type: Object,
    },
  },
  data() {
    return {
      radioName: Vue.prototype.$meta.util.nextId('radio'),
    };
  },
  computed: {
    user() {
      return this.$store.state.auth.user.op;
    },
  },
  mounted() {
    this.$meta.eventHub.$on('atom:star', this.onStarChanged);
    this.$meta.eventHub.$on('atom:labels', this.onLabelsChanged);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('atom:star', this.onStarChanged);
    this.$meta.eventHub.$off('atom:labels', this.onLabelsChanged);
  },
  methods: {
    onItemClick() {
      // todo
      console.log('ss');
    },
    onItemChange(event, item) {
      // todo
    },
    onSwipeoutOpened(event, item) {
      if (item._actions) return;
      this.$api.post('/a/base/atom/actions', {
        key: { atomId: item.atomId },
        basic: true,
      }).then(data => {
        Vue.set(item, '_actions', data);
      });
    },
    onLabel(event, item) {
      // anonymous
      if (this.user.anonymous) {
        this.$view.dialog.confirm(this.$text('Please Sign In')).then(() => {
          // login
          this.$meta.vueLayout.openLogin();
        });
        return;
      }
      // navigate
      this.$view.navigate(`/a/base/atom/labels?atomId=${item.atomId}`);
      this.$meta.util.swipeoutClose(event.target);
    },
    onLabelsChanged(data) {
      const index = this.layout.items.findIndex(item => item.atomId === data.key.atomId);
      if (index !== -1) {
        this.layout.items[index].labels = JSON.stringify(data.labels);
      }
    },
    onStarChanged(data) {
      const index = this.layout.items.findIndex(item => item.atomId === data.key.atomId);
      if (index !== -1) {
        this.layout.items[index].star = data.star;
      }
    },
    onStarSwitch(event, item) {
      const star = item.star ? 0 : 1;
      return this._onStarSwitch(event, item, star, 'swipeoutClose');
    },
    _onStarSwitch(event, item, star, swipeoutAction) {
      // anonymous
      if (this.user.anonymous) {
        this.$view.dialog.confirm(this.$text('Please Sign In')).then(() => {
          // login
          this.$meta.vueLayout.openLogin();
        });
        return;
      }
      // key
      const key = {
        atomId: item.atomId,
        itemId: item.itemId,
      };
      //
      return this.$api.post('/a/base/atom/star', {
        key,
        atom: { star },
      }).then(data => {
        this.$meta.eventHub.$emit('atom:star', { key, star: data.star, starCount: data.starCount });
        this.$meta.util[swipeoutAction](event.target);
      });
    },
    _getItemMetaMedia(item) {
      const media = (item._meta && item._meta.media) || item.avatar || this.$meta.config.modules['a-base'].user.avatar.default;
      return this.$meta.util.combineImageUrl(media, 32);
    },
    _getItemMetaMediaLabel(item) {
      const mediaLabel = (item._meta && item._meta.mediaLabel) || item.userName;
      return mediaLabel;
    },
    _getItemMetaSummary(item) {
      const summary = (item._meta && item._meta.summary) || '';
      if (this.layoutManager.atomClass) {
        return summary;
      }
      const atomClass = this.layoutManager.getAtomClass({
        module: item.module,
        atomClassName: item.atomClassName,
      });
      if (!atomClass) return summary;
      return `${atomClass.titleLocale} ${summary}`;
    },
    _getItemMetaFlags(item) {
      const flags = (item._meta && item._meta.flags);
      if (!flags) return [];
      if (Array.isArray(flags)) return flags;
      return flags.split(',');
    },
    _getLabel(id) {
      if (!this.layoutManager.userLabels) return null;
      return this.layoutManager.userLabels[id];
    },
    _renderListItem(item) {
      // media
      let domMedia;
      if (this.layoutManager.scene !== 'selecting') {
        domMedia = (
          <div slot="media">
            <img class="avatar avatar32" src={this._getItemMetaMedia(item)} />
          </div>
        );
      }
      // domHeader
      const domHeader = (
        <div slot="root-start" class="header">
          <div class="mediaLabel">
            <span>{this._getItemMetaMediaLabel(item)}</span>
          </div>
          <div class="date">
            {item.star > 0 && <span>⭐</span>}
            {item.attachmentCount > 0 && <span>🧷</span>}
            {item.attachmentCount > 1 && <span>{`${item.attachmentCount}`}</span>}
            {item.commentCount > 0 && <span>💬</span>}
            {item.commentCount > 1 && <span>{`${item.commentCount}`}</span>}
            <span>{this.$meta.util.formatDateTimeRelative(item.atomUpdatedAt)}</span>
          </div>
        </div>
      );
      // domTitle
      const domTitle = (
        <div slot="title" class="title">
          <div>{item.atomName}</div>
        </div>
      );
      // domSummary
      const domSummary = (
        <div slot="root-end" class="summary">
          { this._getItemMetaSummary(item) }
        </div>
      );
      // domAfter
      const domAfterMetaFlags = [];
      for (const flag of this._getItemMetaFlags(item)) {
        domAfterMetaFlags.push(
          <f7-badge key="flag">{flag}</f7-badge>
        );
      }
      const domAfterLabels = [];
      if (item.labels && this.layoutManager.userLabels) {
        for (const label of JSON.parse(item.labels)) {
          const _label = this._getLabel(label);
          domAfterLabels.push(
            <f7-badge key={label} style={ { backgroundColor: _label.color } }>{ _label.text}</f7-badge>
          );
        }
      }
      const domAfter = (
        <div slot="after" class="after">
          {domAfterMetaFlags}
          {domAfterLabels}
        </div>
      );
      // ok
      return (
        <eb-list-item class="item" key={item.atomId}
          name={this.radioName}
          radio={this.layoutManager.scene === 'selecting' && this.layoutManager.params.selectMode === 'single'}
          checkbox={this.layoutManager.scene === 'selecting' && this.layoutManager.params.selectMode === 'multiple'}
          link={this.layoutManager.scene === 'selecting' ? false : '#'}
          propsOnPerform={event => { this.onItemClick(event, item); }}
          onChange={event => { this.onItemChange(event, item); }}
          swipeout onSwipeoutOpened={event => { this.onSwipeoutOpened(event, item); } }
          onContextmenuOpened={event => { this.onSwipeoutOpened(event, item); } }
        >

          {domMedia}
          {domHeader}
          {domTitle}
          {domSummary}
          {domAfter}
          {this._renderListItemContextMenu(item)}
        </eb-list-item>
      );
    },
    _renderListItemContextMenu(item) {
      let domLeft;
      if (item.atomStage === 1) {
        domLeft = (
          <div slot="left">
            <div color="teal" propsOnPerform={event => { this.onStarSwitch(event, item); }}><span>⭐</span></div>
            <div color="blue" propsOnPerform={event => { this.onLabel(event, item); }}><span>🏷️</span></div>
          </div>
        );
      }
      return (
        <eb-context-menu>
          {domLeft}

        </eb-context-menu>
      );
    },
    _renderList() {
      const items = this.layout.items;
      const children = [];
      for (const item of items) {
        children.push(this._renderListItem(item));
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
