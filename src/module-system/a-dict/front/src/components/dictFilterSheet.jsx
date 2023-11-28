export default {
  props: {
    dict: {},
  },
  data() {
    return {
      codesMatched: [],
      limit: 5,
    };
  },

  methods: {
    search(query) {
      // sheet
      if (query) {
        this.$refs.sheet.f7Sheet.open();
      } else {
        this.$refs.sheet.f7Sheet.close();
      }
      // search
      if (!query) {
        this.codesMatched = [];
      } else {
        const context = {
          queries: query
            .toLowerCase()
            .replace(/ /g, '/')
            .split('/')
            .filter(c => c),
          codesMatched: [],
          codeParent: '',
          titleLocaleParent: '',
        };
        this._search_loop(this.dict._dictItems, context);
        this.codesMatched = context.codesMatched;
      }
    },
    onPerformCodeMatch(event, codeMatch) {
      // close sheet
      this.$refs.sheet.f7Sheet.close();
      // expand
      this.$emit('codeMatchClick', codeMatch);
    },
    _cityMatch(dictItem, query) {
      // titleLocale
      let pos = dictItem.titleLocale.toLowerCase().indexOf(query);
      if (pos > -1) return true;
      // title
      if (dictItem.title !== dictItem.titleLocale) {
        pos = dictItem.title.toLowerCase().indexOf(query);
        if (pos > -1) return true;
      }
      // titleAlias
      if (dictItem.titleAlias && dictItem.titleAlias !== dictItem.title) {
        pos = dictItem.titleAlias.toLowerCase().indexOf(query);
        if (pos > -1) return true;
      }
      // titleShort
      if (
        dictItem.titleShort &&
        dictItem.titleShort !== dictItem.title &&
        dictItem.titleShort !== dictItem.titleAlias
      ) {
        pos = dictItem.titleShort.toLowerCase().indexOf(query);
        if (pos > -1) return true;
      }
      return false;
    },
    _search_loop(dictItems, context) {
      if (!dictItems || dictItems.length === 0) return false;
      const query = context.queries.shift();
      for (const dictItem of dictItems) {
        const codeCurrent = dictItem.codeFull;
        const titleLocaleCurrent = context.titleLocaleParent
          ? `${context.titleLocaleParent}/${dictItem.titleLocale}`
          : dictItem.titleLocale;
        const matched = this._cityMatch(dictItem, query);
        // find
        if (matched) {
          if (context.queries.length === 0) {
            // complete
            context.codesMatched.push({
              code: codeCurrent,
              titleLocale: titleLocaleCurrent,
            });
            if (context.codesMatched.length >= this.limit) return true;
          } else {
            // children
            const res = this._search_loop(dictItem.children, {
              queries: context.queries.concat(),
              codesMatched: context.codesMatched,
              codeParent: codeCurrent,
              titleLocaleParent: titleLocaleCurrent,
            });
            if (res) return true;
          }
        }
        // children
        const res = this._search_loop(dictItem.children, {
          queries: [query, ...context.queries],
          codesMatched: context.codesMatched,
          codeParent: codeCurrent,
          titleLocaleParent: titleLocaleCurrent,
        });
        if (res) return true;
      }
      return false;
    },
    _renderEmpty() {
      return (
        <f7-card>
          <f7-card-header>{this.$text('Friendly Tips')}</f7-card-header>
          <f7-card-content>
            <div>{this.$text('NoMatchedData')}</div>
          </f7-card-content>
        </f7-card>
      );
    },
    _renderList() {
      const children = [];
      for (const codeMatch of this.codesMatched) {
        children.push(
          <eb-list-item
            key={codeMatch.code}
            title={codeMatch.titleLocale}
            link="#"
            propsOnPerform={event => this.onPerformCodeMatch(event, codeMatch)}
          ></eb-list-item>
        );
      }
      return (
        <eb-list form inline-labels no-hairlines-md>
          {children}
        </eb-list>
      );
    },
  },
  render() {
    const domContent = this.codesMatched.length > 0 ? this._renderList() : this._renderEmpty();
    return (
      <f7-sheet ref="sheet" class="eb-sheet-no-backdrop" backdrop={false} fill>
        <f7-toolbar>
          <div></div>
          <div class="right">
            <f7-link sheet-close>{this.$text('Close')}</f7-link>
          </div>
        </f7-toolbar>
        <f7-page-content>{domContent}</f7-page-content>
      </f7-sheet>
    );
  },
};
