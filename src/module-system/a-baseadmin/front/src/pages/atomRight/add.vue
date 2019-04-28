<template>
  <eb-page>
    <eb-navbar :title="$text('New Atom Right')" eb-back-link="Back">
      <f7-nav-right>
        <eb-button ref="buttonSubmit" iconMaterial="save" :onPerform="onSave"></eb-button>
      </f7-nav-right>
    </eb-navbar>
    <eb-list form no-hairlines-md @submit.prevent="onFormSubmit">
      <f7-list-item :title="$text('Atom Class')" link="#" @click="onSelectAtomClass">
        <div slot="after">{{atomClass && atomClass.title}}</div>
      </f7-list-item>
      <f7-list-item smartSelect :title="$text('Atom Action')" :smartSelectParams="{openIn: 'page', closeOnSelect: true}">
        <eb-select name="actionCode" v-model="actionCode" :options="actions"></eb-select>
      </f7-list-item>
      <f7-list-item v-if="scopeSelfEnable" :title="$text('Scope')">
        <span class="text-color-gray">Self</span>
        <eb-toggle v-model="scopeSelf"></eb-toggle>
      </f7-list-item>
      <f7-list-item v-if="scopeEnable" :title="$text('Scope')" link="#" @click="onSelectScope">
        <div slot="after">{{scopeTitle}}</div>
      </f7-list-item>
    </eb-list>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebActions = Vue.prototype.$meta.module.get('a-base').options.components.ebActions;
export default {
  mixins: [ ebActions ],
  data() {
    return {
      roleId: parseInt(this.$f7route.query.roleId),
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
        if (actions[key].authorize) {
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
      return this.actionCode && [ '3', '4' ].indexOf(this.actionCode) > -1;
    },
    scopeEnable() {
      if (!this.actionCode) return false;
      if (this.actionCode === '1') return false;
      if ([ '3', '4' ].indexOf(this.actionCode) > -1 && this.scopeSelf) return false;
      return true;
    },
  },
  watch: {
    atomClass(value) {
      this.actionCode = '';
    },
  },
  methods: {
    onFormSubmit() {
      this.$refs.buttonSubmit.onClick();
    },
    onSelectAtomClass() {
      this.$view.navigate('/a/base/atom/selectAtomClass', {
        target: '_self',
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
        target: '_self',
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
          this.$f7router.back();
        });
    },
  },
};

</script>
<style scoped>
</style>
