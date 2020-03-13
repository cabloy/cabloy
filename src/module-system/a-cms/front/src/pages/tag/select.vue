<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Select Tags')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="search" :onPerform="onPerformSearch"></eb-link>
        <eb-link ref="buttonSubmit" iconMaterial="done" :onPerform="onPerformDone"></eb-link>
      </f7-nav-right>
      <f7-searchbar ref="searchbar" expandable @searchbar:search="onSearch" @searchbar:disable="onDisable" :backdrop="false" :disable-button="true" :clear-button="true" :custom-search="true">
      </f7-searchbar>
    </eb-navbar>
    <f7-block-title>{{$text('Selected Tags')}}</f7-block-title>
    <f7-block class="selected-tags">
      <f7-chip v-for="item of tagsCurrent" :key="item.id" :text="item.name" deleteable @click="onTagRemove(item)"></f7-chip>
    </f7-block>
    <f7-block>
      <div class="row tags">
        <div :class="{'chip':true, 'col-33':true, 'chip-outline':tagIndex(item)===-1}" v-for="item of tagsAll2" :key="item.id" @click="onTagSwitch(item)">
          <div class="chip-media">{{item.articleCount}}</div>
          <div class="chip-label">{{item.tagName}}</div>
        </div>
        <div class="col-33"></div>
        <div class="col-33"></div>
      </div>
    </f7-block>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
import utils from '../../common/utils.js';
export default {
  mixins: [ebPageContext],
  data() {
    const atomClass = utils.parseAtomClass(this.$f7route.query);
    return {
      atomClass,
      tagsCurrent: [],
      tagsAll: null,
      searchQuery: null,
    };
  },
  computed: {
    language() {
      return this.contextParams.language;
    },
    tags() {
      return this.contextParams.tags;
    },
    tagsAll2() {
      if (!this.tagsAll || !this.searchQuery) return this.tagsAll;
      return this.tagsAll.filter(item => item.tagName.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1);
    }
  },
  created() {
    this.initTagsCurrent();
    // all tags
    const options = {
      where: { language: this.language },
      orders: [
        ['tagName', 'asc'],
      ],
    };
    this.$api.post('tag/list', {
      atomClass: this.atomClass,
      options,
    }).then(res => {
      this.tagsAll = res.list;
    });
  },
  methods: {
    initTagsCurrent() {
      // for disconnected from reaction
      if (!this.tags) return this.tagsCurrent = [];
      this.tagsCurrent = JSON.parse(this.tags).concat();
    },
    tagIndex(item) {
      return this.tagsCurrent.findIndex(_item => _item.id === item.id);
    },
    onTagRemove(item) {
      const index = this.tagIndex(item);
      if (index > -1) {
        this.tagsCurrent.splice(index, 1);
      }
    },
    onTagSwitch(item) {
      const index = this.tagIndex(item);
      if (index > -1) {
        this.tagsCurrent.splice(index, 1);
      } else {
        this.tagsCurrent.push({ id: item.id, name: item.tagName });
      }
    },
    onPerformDone() {
      this.contextCallback(200, this.tagsCurrent.length > 0 ? JSON.stringify(this.tagsCurrent) : null);
      this.$f7router.back();
    },
    onPerformSearch() {
      this.$refs.searchbar.f7Searchbar.enable();
    },
    onSearch: Vue.prototype.$meta.util.debounce(function(searchbar, query) {
      this.searchQuery = query;
    }, 200),
    onDisable() {
      this.searchQuery = null;
    },
  },
};

</script>
<style lang="less" scoped>
.selected-tags {
  min-height: 40px;

  .chip {

    &+.chip {
      margin-left: 6px;
    }
  }
}

.tags {
  justify-content: space-around;

  .chip {
    cursor: pointer;

    .chip-media {
      min-width: 32px;
      width: auto;
      border: 1px solid var(--f7-block-header-text-color);
      color: var(--f7-block-header-text-color);
    }

  }

}

</style>
