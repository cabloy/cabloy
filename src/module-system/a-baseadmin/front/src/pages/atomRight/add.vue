<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="getPageTitle('New Authorization')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link v-if="!!actionCurrent" ref="buttonSubmit" iconF7="::save" :onPerform="onSave"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-list v-if="ready" form inline-labels no-hairlines-md @submit="onFormSubmit">
      <f7-list-item :title="$text('Atom Class')" link="#" @click="onSelectAtomClass">
        <div slot="after">{{ atomClass && atomClass.title }}</div>
      </f7-list-item>
      <f7-list-item
        v-if="atomClass"
        smartSelect
        :title="$text('Atom Action')"
        :smartSelectParams="{ openIn: 'page', closeOnSelect: true }"
      >
        <eb-select name="actionName" v-model="actionName" :options="actionSelectOptions"></eb-select>
      </f7-list-item>
      <f7-list-item v-if="!isOpenAuthScope && scopeSelfEnable" :title="$text('Scope')">
        <span class="text-color-gray">{{ $text('Self') }}</span>
        <eb-toggle v-model="scopeSelf"></eb-toggle>
      </f7-list-item>
      <f7-list-item v-if="!isOpenAuthScope && scopeEnable" :title="$text('Scope')" link="#" @click="onSelectScope">
        <div slot="after">{{ scopeTitle }}</div>
      </f7-list-item>
    </eb-list>
  </eb-page>
</template>
<script>
import Vue from 'vue';
import roleItemBase from '../../components/role/roleItemBase.js';
const ebAtomActions = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomActions;
export default {
  mixins: [roleItemBase, ebAtomActions],
  data() {
    return {
      atomClass: null,
      actionName: '',
      actionSelectOptions: null,
      scopeSelf: true,
      scope: null,
    };
  },
  computed: {
    ready() {
      return this.role && this.actionsAll;
    },
    scopeTitle() {
      if (!this.scope) return null;
      return this.scope.map(item => item.atomNameLocale).join(',');
    },
    scopeSelfEnable() {
      const action = this.actionCurrent;
      if (!action) return false;
      return !action.bulk;
    },
    scopeEnable() {
      const action = this.actionCurrent;
      if (!action) return false;
      return !action.bulk && !this.scopeSelf;
    },
    actionCurrent() {
      if (!this.atomClass || !this.actionName) return null;
      return this.getAction({
        module: this.atomClass.module,
        atomClassName: this.atomClass.atomClassName,
        name: this.actionName,
      });
    },
    isOpenAuthScope() {
      return this.role && this.role.roleTypeCode === 6;
    },
  },
  watch: {
    atomClass() {
      this.actionName = '';
      this.loadActionSelectOptions();
    },
  },
  methods: {
    onFormSubmit() {
      this.$refs.buttonSubmit.onClick();
    },
    onSelectAtomClass() {
      this.$view.navigate('/a/basefront/atom/selectAtomClass', {
        target: '_self',
        context: {
          params: {
            atomClass: this.atomClass,
            optional: true,
            inner: null,
            user: true,
          },
          callback: (code, data) => {
            if (code === 200) {
              this.atomClass = data;
            }
          },
        },
      });
    },
    onSelectScope() {
      this.$view.navigate('/a/baseadmin/role/select', {
        target: '_self',
        context: {
          params: {
            roleIdStart: null,
            multiple: true,
            roleTypes: [0, 1, 2, 3, 4],
          },
          callback: (code, roles) => {
            if (code === 200) {
              this.scope = roles;
            }
          },
        },
      });
    },
    async onSave() {
      const action = this.actionCurrent;
      if (!action) return;
      await this.$api.post('atomRight/add', {
        key: this.roleKey,
        atomClass: this.atomClass,
        actionCode: parseInt(action.code),
        scopeSelf: this.scopeSelf,
        scope: this.scope ? this.scope.map(item => item.itemId) : [],
      });
      this.$meta.eventHub.$emit('atomRight:add', { roleId: this.roleId });
      this.$f7router.back();
    },
    async loadActionSelectOptions() {
      //
      const actions = this.getActionsOfAtomClass(this.atomClass);
      const actionsUser = await this.$api.post('/a/base/atomClass/actionsUser', {
        atomClass: this.atomClass,
      });
      console.log(actionsUser);
      //
      const groupAtom = { title: 'Atom Actions', options: [] };
      const groupBulk = { title: 'Bulk Actions', options: [] };
      for (const key in actions) {
        const action = actions[key];
        if (action.authorize === false) continue;
        const option = { title: action.titleLocale, value: key };
        if (action.code === 1 || !action.bulk) {
          groupAtom.options.push(option);
        } else {
          groupBulk.options.push(option);
        }
      }
      return [groupAtom, groupBulk];
    },
  },
};
</script>
<style scoped></style>
