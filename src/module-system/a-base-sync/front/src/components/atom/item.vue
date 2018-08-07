<template>
  <eb-page>
    <eb-navbar :title="title" eb-back-link="Back">
      <f7-nav-right>
        <eb-link v-if="ready && findAction('write')" :iconMaterial="this.mode==='edit'?'save':'edit'" :context="this.mode==='edit'?'save':'write'" :onPerform="onAction"></eb-link>
        <f7-link v-if="ready" iconMaterial="more_horiz" :popover-open="`#${popoverId}`"></f7-link>
      </f7-nav-right>
    </eb-navbar>
    <template v-if="notfound">
      <f7-list>
        <f7-list-item :title="$text('Not found')"></f7-list-item>
      </f7-list>
    </template>
    <template v-else>
      <atoms v-if="ready" mode="list" :itemShow="item"></atoms>
      <eb-validate v-if="ready" ref="validate" :readOnly="this.mode!=='edit'" auto :data="item" :params="validateParams" :onPerform="onPerformValidate">
      </eb-validate>
      <f7-popover :id="popoverId">
        <f7-list v-if="ready" inset>
          <eb-list-button v-if="findAction('write') && item.atomEnabled===0" popover-close context="submit" :onPerform="onAction">{{$text('Submit')}}</eb-list-button>
          <eb-list-button v-for="action of actions" :key="action.id" v-if="action.name!=='write'" popover-close :context="action" :onPerform="onAction">{{getActionTitle(action)}}</eb-list-button>
        </f7-list>
      </f7-popover>
    </template>
  </eb-page>
</template>
<script>
import Vue from 'vue';
import atoms from './list.vue';
const ebActions = Vue.prototype.$meta.module.get('a-components').options.components.ebActions;
export default {
  mixins: [ ebActions ],
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
      return this.item && this.module && this.validateParams && this.actions && this.actionsAll;
    },
    title() {
      const name = this.mode === 'edit' ? this.$text('Edit') : this.$text('View');
      if (!this.item) return name;
      return `${name}: ${this.item.atomName}`;
    },
  },
  mounted() {
    this.$meta.eventHub.$on('atom:action', this.onActionChanged);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('atom:action', this.onActionChanged);
  },
  created() {
    this.load();
  },
  methods: {
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
          atomClass: { id: this.atomClassId },
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
      const _action = this.getAction(action);
      // for write
      if (action.name === 'write') {
        _action.navigateOptions = { target: '_self' };
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
      this.item = null;
      this.actions = null;
      this.load();
    },
  },
};

</script>
<style scoped>


</style>
