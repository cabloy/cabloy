export default {
  props: {
    atomClass: {},
    language: {},
    multiple: {},
    searchQuery: {},
    selectedTags: {},
    showBlockCurrent: {},
  },
  data() {
    return {
      tagsCurrent: [],
      tagsAll: null,
    };
  },
  computed: {
    tagsAll2() {
      if (!this.tagsAll || !this.searchQuery) return this.tagsAll;
      return this.tagsAll.filter(item => item.tagName.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1);
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.initTagsCurrent();
      await this.loadTagsAll();
    },
    initTagsCurrent() {
      // for disconnected from reaction
      if (!this.selectedTags) {
        this.tagsCurrent = [];
        return;
      }
      if (Array.isArray(this.selectedTags)) {
        this.tagsCurrent = this.selectedTags.concat();
      } else if (typeof this.selectedTags === 'number') {
        this.tagsCurrent = [this.selectedTags];
      } else {
        this.tagsCurrent = JSON.parse(this.selectedTags);
      }
    },
    async loadTagsAll() {
      // tagAtomCount maybe changed
      // this.tagsAll = await this.$store.dispatch('a/base/getTags', {
      //   atomClass: this.atomClass,
      //   language: this.language,
      // });
      const options = {
        where: { language: this.language },
        orders: [['tagName', 'asc']],
      };
      const res = await this.$api.post('/a/base/tag/list', {
        atomClass: this.atomClass,
        options,
      });
      this.tagsAll = res.list;
    },
    getTagName(tagId) {
      const tagBase = this.getTagBase(tagId);
      if (!tagBase) return null;
      return tagBase.tagName;
    },
    getTagBase(tagId) {
      if (!this.tagsAll) return null;
      return this.tagsAll.find(item => item.id === tagId);
    },
    tagIndex(tagId) {
      return this.tagsCurrent.findIndex(_tagId => _tagId === tagId);
    },
    onTagRemove(tagId) {
      const index = this.tagIndex(tagId);
      if (index > -1) {
        this.tagsCurrent.splice(index, 1);
      }
      this.emitChange();
    },
    onTagSwitch(item) {
      if (this.multiple) {
        const index = this.tagIndex(item.id);
        if (index > -1) {
          this.tagsCurrent.splice(index, 1);
        } else {
          this.tagsCurrent.push(item.id);
        }
      } else {
        this.tagsCurrent = [item.id];
      }
      this.emitChange();
    },
    emitChange() {
      this.$emit('change', this.tagsCurrent);
    },
    checked() {
      let res;
      if (this.multiple) {
        res = this.tagsCurrent.length > 0 ? this.tagsCurrent : null;
      } else {
        res = this.tagsCurrent.length > 0 ? this.tagsCurrent[0] : 0;
      }
      return res;
    },
    _renderTagsCurrent() {
      if (!this.showBlockCurrent) return null;
      if (!this.tagsAll) return null;
      const children = [];
      for (const tagId of this.tagsCurrent) {
        children.push(
          <f7-chip
            key={tagId}
            text={this.getTagName(tagId)}
            deleteable
            onClick={() => {
              this.onTagRemove(tagId);
            }}
          ></f7-chip>
        );
      }
      return (
        <div>
          <f7-block-title>{this.$text('Selected Tags')}</f7-block-title>
          <f7-block class="selected-tags">{children}</f7-block>
          <hr></hr>
        </div>
      );
    },
    _renderTagsAll() {
      if (!this.tagsAll) return null;
      const children = [];
      for (const item of this.tagsAll2) {
        const classes = {
          chip: true,
          'col-33': true,
          'chip-outline': this.tagIndex(item.id) === -1,
        };
        children.push(
          <div
            key={item.id}
            class={classes}
            onClick={() => {
              this.onTagSwitch(item);
            }}
          >
            <div class="chip-label">{item.tagName}</div>
            <f7-badge class="eb-icon-badge" color="gray">
              {item.tagAtomCount}
            </f7-badge>
          </div>
        );
      }
      return (
        <f7-block>
          <div class="row tags">
            {children}
            <div class="col-33"></div>
            <div class="col-33"></div>
          </div>
        </f7-block>
      );
    },
  },
  render() {
    const domTagsCurrent = this._renderTagsCurrent();
    const domTagsAll = this._renderTagsAll();
    return (
      <div class="eb-tag-select">
        {domTagsCurrent}
        {domTagsAll}
      </div>
    );
  },
};
