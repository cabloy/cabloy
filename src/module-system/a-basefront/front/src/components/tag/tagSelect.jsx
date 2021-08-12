export default {
  props: {
    atomClass: {},
    language: {},
    multiple: {},
    searchQuery: {},
    selectedTags: {},
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
      } else {
        this.tagsCurrent = JSON.parse(this.selectedTags);
      }
    },
    async loadTagsAll() {
      this.tagsAll = await this.$store.dispatch('a/base/getTags', {
        atomClass: this.atomClass,
        language: this.language,
      });
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
    },
  },
  render() {
    return <eb-treeview ref="tree" auto={false} propsOnLoadChildren={this.onLoadChildren} onNodeChange={this.onNodeChange}></eb-treeview>;
  },
};
