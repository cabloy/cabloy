<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="getPageTitle('New Authorizations')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link v-if="!!atoms" ref="buttonSubmit" iconF7="::save" :onPerform="onSave"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-list form inline-labels no-hairlines-md @submit="onFormSubmit">
      <f7-list-item :title="$text('Resource Class')" link="#" @click="onSelectAtomClass">
        <div slot="after">{{ atomClass && atomClass.title }}</div>
      </f7-list-item>
      <eb-list-item v-if="atomClass">
        <div slot="after">
          <eb-link :onPerform="onPerformSelectAtoms">{{ $text('Select Resources') }}</eb-link>
        </div>
      </eb-list-item>
      <eb-list-item v-if="!!atoms" :title="$text('SelectedResources')" group-title> </eb-list-item>
      <eb-list-item class="item" v-for="item of atoms" :key="item.id" :title="item.atomNameLocale || item.atomName">
        <div slot="after">
          <f7-badge v-if="item.resourceType">{{ getTypeCategory(item) }}</f7-badge>
        </div>
      </eb-list-item>
    </eb-list>
  </eb-page>
</template>
<script>
import roleItemBase from '../../components/role/roleItemBase.js';
export default {
  mixins: [roleItemBase],
  data() {
    return {
      atomClass: null,
      atoms: null,
    };
  },
  watch: {
    atomClass() {
      this.atoms = null;
    },
  },
  methods: {
    onFormSubmit() {
      this.$refs.buttonSubmit.onClick();
    },
    onSelectAtomClass() {
      this.$view.navigate('/a/basefront2/atom/selectAtomClass', {
        target: '_self',
        context: {
          params: {
            atomClass: this.atomClass,
            optional: true,
            resource: true,
            inner: null,
          },
          callback: (code, data) => {
            if (code === 200) {
              this.atomClass = data;
            }
          },
        },
      });
    },
    onPerformSelectAtoms() {
      const url = '/a/basefront/atom/select';
      this.$view.navigate(url, {
        target: '_self',
        context: {
          params: {
            selectMode: 'multiple',
            selectedAtomIds: this.atoms ? this.atoms.map(item => item.atomId) : null,
            atomClass: this.atomClass,
            resource: 1,
          },
          callback: (code, selectedAtoms) => {
            if (code === 200) {
              this.atoms = selectedAtoms;
            }
          },
        },
      });
    },
    async onSave() {
      if (!this.atoms) return;
      await this.$api.post('resourceRight/add', {
        key: this.roleKey,
        atomIds: this.atoms.map(item => item.atomId),
      });
      this.$meta.eventHub.$emit('resourceRight:add', { roleId: this.roleId });
      this.$f7router.back();
    },
    getTypeCategory(item) {
      return `${item.resourceTypeLocale} / ${item.atomCategoryNameLocale}`;
    },
  },
};
</script>
<style scoped></style>
