<template>
  <eb-page>
    <eb-navbar :title="$text('Select Tags')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="done" @click.prevent="onDone"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <f7-list form no-hairlines-md>
      <f7-list-item>
        <f7-label floating>{{$text('Tags')}}</f7-label>
        <eb-input type="text" v-model="tagsText" :placeholder="$text('Tags')" clear-button></eb-input>
      </f7-list-item>
    </f7-list>
    <f7-block>
      <div class="row tags">
        <div :class="{'chip':true, 'col-33':true, 'chip-outline':tagIndex(item)===-1}" v-for="item of tagsAll" :key="item.id" @click="onTagSwitch(item)">
          <div class="chip-media">{{item.articleCount}}</div>
          <div class="chip-label">{{item.tagName}}</div>
        </div>
      </div>
    </f7-block>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.components.ebPageContext;
export default {
  mixins: [ ebPageContext ],
  data() {
    return {
      tagsText: '',
      tagsAll: null,
    };
  },
  computed: {
    language() {
      return this.contextParams.language;
    },
    tags() {
      return this.contextParams.tags;
    },
  },
  created() {
    this.tagsText = this.adjustTags();
    // all tags
    const options = {
      where: { language: this.language },
      orders: [
        [ 'tagName', 'asc' ],
      ],
    };
    this.$api.post('tag/list', { options }).then(res => {
      this.tagsAll = res.list;
    });
  },
  methods: {
    adjustTags() {
      if (!this.tags) return '';
      const tags = JSON.parse(this.tags);
      return tags.map(item => item.name).join(',');
    },
    tagIndex(item) {
      if (!this.tagsText) return -1;
      const tags = this.tagsText.split(',');
      return tags.findIndex(name => name === item.tagName);
    },
    onTagSwitch(item) {
      const tags = this.tagsText ? this.tagsText.split(',') : [];
      const index = this.tagIndex(item);
      if (index > -1) {
        tags.splice(index, 1);
      } else {
        tags.push(item.tagName);
      }
      this.tagsText = tags.join(',');
    },
    onDone() {
      let selected = null;
      if (this.tagsText) {
        selected = [];
        const exists = {};
        const tags = this.tagsText.split(',');
        for (const name of tags) {
          if (!exists[name]) {
            exists[name] = true;
            const tag = this.tagsAll.find(item => item.tagName === name);
            if (tag) {
              selected.push({ id: tag.id, name });
            } else {
              selected.push({ id: 0, name });
            }
          }
        }
      }
      this.contextCallback(200, selected ? JSON.stringify(selected) : null);
      this.$f7router.back();
    },
  },
};

</script>
<style lang="less" scoped>
.tags {
  justify-content: space-around;

  .chip-media {
    min-width: 32px;
    width: auto;
    border: 1px solid orange;
    color: orange;
  }
}

</style>
