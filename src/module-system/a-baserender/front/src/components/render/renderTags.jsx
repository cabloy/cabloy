export default {
  props: {
    context: {
      type: Object,
    },
  },
  data() {
    return {
      tagsAll: null,
    };
  },
  computed: {
    atomClass() {
      const { parcel } = this.context;
      return {
        module: parcel.data.module,
        atomClassName: parcel.data.atomClassName,
      };
    },
  },
  created() {
    const { parcel } = this.context;
    this.loadTagsAll(parcel.data.atomLanguage);
  },
  methods: {
    combineAtomClassAndLanguage(language) {
      const queries = {
        module: this.atomClass.module,
        atomClassName: this.atomClass.atomClassName,
      };
      if (language) {
        queries.language = language;
      }
      return queries;
    },
    async loadTagsAll(language) {
      this.tagsAll = await this.$store.dispatch('a/base/getTags', {
        atomClass: this.atomClass,
        language,
      });
    },
    adjustTags(tags) {
      if (!this.tagsAll || !tags) return '';
      tags = JSON.parse(tags);
      tags = tags.map(tagId => {
        const tag = this.tagsAll.find(_item => _item.id === tagId);
        return tag ? tag.tagName : '';
      });
      return tags.join(',');
    },
    async onChooseTags(event) {
      const { parcel } = this.context;
      const action = {
        actionModule: 'a-base',
        actionComponent: 'action',
        name: 'selectLocale',
        targetEl: event.currentTarget,
      };
      let language;
      if (parcel.data.atomLanguage) {
        language = parcel.data.atomLanguage;
      } else {
        const locale = await this.$meta.util.performAction({ ctx: this, action, item: parcel.data });
        if (locale) {
          language = locale.value;
          this.context.setValue(locale.value, 'atomLanguage');
        }
      }
      if (language) {
        await this.loadTagsAll(language);
      }
      return new Promise(resolve => {
        const url = this.$meta.util.combineQueries(
          '/a/basefront/tag/select',
          this.combineAtomClassAndLanguage(language)
        );
        this.$view.navigate(url, {
          target: '_self',
          context: {
            params: {
              selectedTags: parcel.data.atomTags,
              multiple: true,
            },
            callback: (code, tags) => {
              if (code === 200) {
                this.context.setValue(tags ? JSON.stringify(tags) : null, 'atomTags');
                resolve(true);
              } else if (code === false) {
                resolve(false);
              }
            },
          },
        });
      });
    },
  },
  render() {
    const { parcel, dataPath, property, validate } = this.context;
    if (validate.readOnly || property.ebReadOnly) {
      return (
        <f7-list-item>
          {this.context.renderTitle({ slot: 'title' })}
          <div slot="after">{this.adjustTags(parcel.data.atomTags)}</div>
        </f7-list-item>
      );
    }
    return (
      <eb-list-item-choose link="#" dataPath={dataPath} propsOnChoose={this.onChooseTags}>
        {this.context.renderTitle({ slot: 'title' })}
        <div slot="after">{this.adjustTags(parcel.data.atomTags)}</div>
      </eb-list-item-choose>
    );
  },
};
