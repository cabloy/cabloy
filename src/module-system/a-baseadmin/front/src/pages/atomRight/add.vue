<template>
  <f7-page>
    <eb-navbar title="Add Atom Right" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="save" :onPerform="onSave"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <f7-list form no-hairlines-md>
      <f7-list-item title="Atom class" link="#" @click="onSelectAtomClass">
        <div slot="after">{{atomClass && atomClass.title}}</div>
      </f7-list-item>
      <f7-list-item smartSelect title="Atom action" :smartSelectParams="{openIn: 'page', closeOnSelect: true}">
        <eb-select name="actionCode" v-model="actionCode" :options="actions"></eb-select>
      </f7-list-item>
      <f7-list-item v-if="scopeSelfEnable" title="Scope">
        <span class="text-color-gray">Self</span>
        <eb-toggle v-model="scopeSelf"></eb-toggle>
      </f7-list-item>
      <f7-list-item v-if="scopeEnable" title="Scope" link="#" @click="onSelectScope">
        <div slot="after">{{scopeTitle}}</div>
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>
<script>
import Vue from 'vue';
const ebActions = Vue.prototype.$meta.module.get('a-components').options.components.ebActions;
export default {
  mixins: [ebActions],
  data() {
    return {
      roleId: parseInt(this.$f7Route.query.roleId),
      atomClass: null,
      actionCode: '',
      scopeSelf: true,
      scope: null,
    };
  },
  computed: {
    actions() {
      const actions = this.getActionsOfAtomClass(this.atomClass);
      if (!actions) return null;
      const options = [{ title: null, value: '' }];
      for (const key in actions) {
        if (['save', 'submit'].indexOf(key) === -1) {
          options.push({ title: key, value: actions[key].code });
        }
      }
      return options;
    },
    scopeTitle() {
      if (!this.scope) return null;
      return this.scope.map(item => item.roleName).join(',');
    },
    scopeSelfEnable() {
      return this.actionCode && ['3', '4'].indexOf(this.actionCode) > -1;
    },
    scopeEnable() {
      if (!this.actionCode) return false;
      if (this.actionCode === '1') return false;
      if (['3', '4'].indexOf(this.actionCode) > -1 && this.scopeSelf) return false;
      return true;
    },
  },
  watch: {
    atomClass(value) {
      this.actionCode = '';
    },
  },
  methods: {
    onSelectAtomClass() {
      this.$view.navigate('/a/base/atom/selectAtomClass', {
        view: 'self',
        context: {
          params: {
            atomClass: this.atomClass,
            optional: true,
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
        view: 'self',
        context: {
          params: {
            roleIdStart: null,
            multiple: true,
          },
          callback: (code, data) => {
            if (code === 200) {
              this.scope = data;
            }
          },
        },
      });
    },
    onSave() {
      if (!this.atomClass || !this.actionCode) return;
      return this.$api.post('atomRight/add', {
          roleId: this.roleId,
          atomClass: this.atomClass,
          actionCode: parseInt(this.actionCode),
          scopeSelf: this.scopeSelf,
          scope: this.scope ? this.scope.map(item => item.id) : [],
        })
        .then(() => {
          this.$meta.eventHub.$emit('atomRight:add', { roleId: this.roleId });
          this.$f7Router.back();
        });
    },
  },
};

</script>
<style scoped>


</style>
