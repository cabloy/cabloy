<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="title" eb-back-link="Back">
      <f7-nav-right>
        <eb-link ref="buttonSave" v-if="ready && findAction('write')" :iconMaterial="this.mode==='edit'?'save':'edit'" :context="this.mode==='edit'?'save':'write'" :onPerform="onAction"></eb-link>
        <f7-link v-if="showPopover" iconMaterial="more_horiz" :popover-open="`#${popoverId}`"></f7-link>
      </f7-nav-right>
    </eb-navbar>
    <template v-if="notfound">
      <f7-list>
        <f7-list-item :title="$text('Not found')"></f7-list-item>
      </f7-list>
    </template>
    <template v-else>
      <atoms v-if="ready" mode="list" :itemShow="item"></atoms>
      <eb-validate v-if="ready" ref="validate" :readOnly="this.mode!=='edit'" auto :data="item" :params="validateParams" :onPerform="onPerformValidate" :onSave="onSave" @submit.prevent="onSubmit">
      </eb-validate>
      <f7-popover :id="popoverId">
        <f7-list v-if="showPopover" inset>
          <eb-list-button v-if="findAction('write') && item.atomEnabled===0" popover-close context="submit" :onPerform="onAction">{{$text('Submit')}}</eb-list-button>
          <eb-list-button v-for="action of actions" :key="action.id" v-if="action.name!=='write'" popover-close :context="action" :onPerform="onAction">{{getActionTitle(action)}}</eb-list-button>
        </f7-list>
      </f7-popover>
    </template>
    <f7-toolbar v-if="ready && enableFootbar" bottom-md>
      <eb-link v-if="enableComment" iconMaterial="comment" :eb-href="`comment/list?atomId=${item.atomId}`">{{item.commentCount}}</eb-link>
      <eb-link v-if="enableAttachment" iconMaterial="attach_file" :eb-href="`attachment/list?atomId=${item.atomId}`">{{item.attachmentCount}}</eb-link>
    </f7-toolbar>
  </eb-page>
</template>
<script>
import Vue from 'vue';
import atoms from './list.vue';
import ebAtomClasses from '../../common/atomClasses.js';
import ebAtomActions from '../../common/atomActions.js';
export default {
  mixins: [ebAtomClasses, ebAtomActions],
  meta: {
    global: false,
  },
  components: {
    atoms,
  },
  props: {
    // mode: edit/view
    mode: {
      type: String,
    },
    query: {
      type: Object,
    },
  },
  data() {
    return {
      atomId: parseInt(this.query.atomId || 0),
      itemId: parseInt(this.query.itemId || 0),
      atomClassId: parseInt(this.query.atomClassId || 0),
      item: null,
      module: null,
      validateParams: null,
      actions: null,
      popoverId: Vue.prototype.$meta.util.nextId('popover'),
      notfound: false,
    };
  },
  computed: {
    ready() {
      return this.item && this.module && this.validateParams && this.actions && this.atomClassesAll && this.actionsAll;
    },
    title() {
      const name = this.mode === 'edit' ? this.$text('Edit') : this.$text('View');
      if (!this.item) return name;
      return `${name}: ${this.item.atomName}`;
    },
    showPopover() {
      if (!this.ready) return false;
      // submit
      const submit = this.findAction('write') && this.item.atomEnabled === 0;
      if (submit) return true;
      // others
      for (const action of this.actions) {
        if (action.name !== 'write') return true;
      }
      return false;
    },
    atomClass() {
      if (!this.item) return null;
      return {
        module: this.item.module,
        atomClassName: this.item.atomClassName,
      };
    },
    enableFootbar() {
      return this.enableComment || this.enableAttachment;
    },
    enableComment() {
      const atomClassInfo = this.getAtomClass(this.atomClass);
      if (!atomClassInfo) return false;
      return !(atomClassInfo.meta && atomClassInfo.meta.comment === false);
    },
    enableAttachment() {
      const atomClassInfo = this.getAtomClass(this.atomClass);
      if (!atomClassInfo) return false;
      return !(atomClassInfo.meta && atomClassInfo.meta.attachment === false);
    },
  },
  mounted() {
    this.$meta.eventHub.$on('atom:action', this.onActionChanged);
    this.$meta.eventHub.$on('comment:action', this.onCommentChanged);
    this.$meta.eventHub.$on('attachment:action', this.onAttachmentChanged);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('atom:action', this.onActionChanged);
    this.$meta.eventHub.$off('comment:action', this.onCommentChanged);
    this.$meta.eventHub.$off('attachment:action', this.onAttachmentChanged);
  },
  created() {
    this.load();
  },
  methods: {
    reload() {
      this.item = null;
      this.actions = null;
      this.load();
    },
    load() {
      // item & module
      this.$api.post('atom/read', {
        key: { atomId: this.atomId },
      }).then(data => {
        this.item = data;
        // module
        this.$meta.module.use(this.item.module, module => {
          this.module = module;
        });
        // validateParams
        this.$api.post('atom/validator', {
          atomClass: { id: this.item.atomClassId },
        }).then(data => {
          this.validateParams = {
            module: data.module,
            validator: data.validator,
          };
        });
        // actions
        this.fetchActions();
      }).catch(() => {
        this.notfound = true;
      });
    },
    fetchActions() {
      this.$api.post('atom/actions', {
        key: { atomId: this.atomId },
      }).then(data => {
        this.actions = data;
      });
    },
    findAction(actionName) {
      return this.actions.find(item => item.name === actionName);
    },
    onSave(event) {
      return this.onAction(event, 'save');
    },
    onAction(event, action) {
      if (action === 'save' || action === 'submit') {
        return this.$refs.validate.perform(event, action);
      }
      if (typeof action === 'string') {
        action = {
          module: this.item.module,
          atomClassName: this.item.atomClassName,
          name: action,
        };
      }
      // action
      let _action = this.getAction(action);
      // for write
      if (action.name === 'write') {
        _action = this.$utils.extend({}, _action, { navigateOptions: { target: '_self' } });
      }
      return this.$meta.util.performAction({ ctx: this, action: _action, item: this.item }).then(res => {
        if (res) this.$f7router.back();
      });
    },
    onPerformValidate(event, actionName) {
      const action = this.$utils.extend({}, this.findAction('write'), { name: actionName });
      const _action = this.getAction(action);
      return this.$meta.util.performAction({ ctx: this, action: _action, item: this.item }).then(() => {
        if (actionName === 'save') return true; // toast on success
        if (actionName === 'submit') this.$f7router.back();
      });
    },
    onActionChanged(data) {
      const key = data.key;
      const action = data.action;

      if (this.mode === 'edit') return;
      if (!this.ready) return;
      if (this.item.atomId !== key.atomId) return;

      // create
      if (action.menu === 1 && action.action === 'create') {
        return;
      }
      // delete
      if (action.name === 'delete') {
        this.item = null;
        this.notfound = true;
        return;
      }
      // others
      this.reload();
    },
    onCommentChanged(data) {
      if (!this.item || data.atomId !== this.atomId) return;
      if (data.action === 'create') this.item.commentCount += 1;
      if (data.action === 'delete') this.item.commentCount -= 1;
    },
    onAttachmentChanged(data) {
      if (!this.item || data.atomId !== this.atomId) return;
      if (data.action === 'create') this.item.attachmentCount += 1;
      if (data.action === 'delete') this.item.attachmentCount -= 1;
    },
    onSubmit() {
      this.$refs.buttonSave.onClick();
    },
  },
};

</script>
<style scoped>
</style>
