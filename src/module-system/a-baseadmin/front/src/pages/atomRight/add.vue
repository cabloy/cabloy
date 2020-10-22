<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('New Atom Right')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link ref="buttonSubmit" iconMaterial="save" :onPerform="onSave"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-list form inline-labels no-hairlines-md @submit.prevent="onFormSubmit">
      <f7-list-item :title="$text('Atom Class')" link="#" @click="onSelectAtomClass">
        <div slot="after">{{atomClass && atomClass.title}}</div>
      </f7-list-item>
      <f7-list-item v-if="atomClass" smartSelect :title="$text('Atom Action')" :smartSelectParams="{openIn: 'page', closeOnSelect: true}">
        <eb-select name="actionCode" v-model="actionCode" :options="selectOptions"></eb-select>
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
const ebAtomActions = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomActions;
export default {
  mixins: [ ebAtomActions ],
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
    selectOptions() {
      const actions = this.getActionsOfAtomClass(this.atomClass);
      if (!actions) return null;
      const groupAtom = { title: 'Atom Actions', options: [] };
      const groupBulk = { title: 'Bulk Actions', options: [] };
      for (const key in actions) {
        const action = actions[key];
        if (action.authorize === false) continue;
        if (action.code === 1 || !action.bulk) {
          groupAtom.options.push(action);
        } else {
          groupBulk.options.push(action);
        }
      }
      return [ groupAtom, groupBulk ];
    },
    scopeTitle() {
      if (!this.scope) return null;
      return this.scope.map(item => item.data.roleName).join(',');
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
    atomClass() {
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
