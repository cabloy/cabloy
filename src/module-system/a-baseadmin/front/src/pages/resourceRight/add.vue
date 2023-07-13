<template>
  <eb-page>
    <eb-navbar eb-back-link="Back">
      <f7-nav-title>
        <div>{{ $text('New Authorizations') }}</div>
        <div class="subtitle">
          <f7-badge>{{ atomMain.atomNameLocale || atomMain.atomName }}</f7-badge>
        </div>
      </f7-nav-title>
      <f7-nav-right>
        <eb-link v-if="!!atoms" ref="buttonSubmit" iconF7="::save" :onPerform="onSave"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-list form inline-labels no-hairlines-md @submit="onFormSubmit">
      <f7-list-item :title="$text('Resource Class')" link="#" @click="onSelectAtomClass">
        <div slot="after">{{ atomClass && atomClass.titleLocale }}</div>
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
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ebPageContext],
  data() {
    return {
      atomClass: null,
      atoms: null,
    };
  },
  computed: {
    atomMain() {
      return this.contextParams.atomMain;
    },
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
            selectedAtomClass: this.atomClass,
            optional: true,
            check: {
              itemOnly: false,
              resource: true,
            },
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
      // key
      const key = {
        atomId: this.atomMain.atomId,
      };
      // add
      await this.$api.post('resourceRight/add', {
        key,
        atomIds: this.atoms.map(item => item.atomId),
      });
      // event
      this.$meta.eventHub.$emit('atom:action', {
        key: null,
        atomClass: {
          module: 'a-base',
          atomClassName: 'roleResourceRight',
        },
        action: {
          name: 'create',
        },
        atom: {
          atomStage: 1,
          module: 'a-base',
          atomClassName: 'roleResourceRight',
        },
      });
      // back
      this.$f7router.back();
    },
    getTypeCategory(item) {
      return `${item.resourceTypeLocale} / ${item.atomCategoryNameLocale}`;
    },
  },
};
</script>
<style scoped></style>
