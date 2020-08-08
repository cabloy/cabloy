<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Atom')" eb-back-link="Back"></eb-navbar>
    <eb-list class="item" no-hairlines-md>
      <eb-list-item :title="$text('Create Party')" link="#" :onPerform="onPerformCreate"></eb-list-item>
      <eb-list-item :title="$text('Party List')" link="#" eb-href="/a/base/atom/list?module=test-party&atomClassName=party"></eb-list-item>
      <eb-list-item :title="$text('Select Single Atom')" link="#" :onPerform="onPerformSelectAtom">
        <div slot="after" class="after">
          {{ atom && atom.atomName }}
        </div>
      </eb-list-item>
      <eb-list-item :title="$text('Select Multiple Atoms')" link="#" :onPerform="onPerformSelectAtoms">
        <div slot="after" class="after">
          {{ atomNames }}
        </div>
      </eb-list-item>
    </eb-list>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebMenus = Vue.prototype.$meta.module.get('a-base').options.mixins.ebMenus;
export default {
  mixins: [ebMenus],
  data() {
    return {
      atom: null,
      atoms: null,
    };
  },
  computed: {
    atomNames() {
      return this.atoms ? this.atoms.map(item => item.atomName).join(',') : null;
    },
  },
  methods: {
    onPerformCreate(event) {
      // menu
      let _menu = this.getMenu({ module: 'test-party', name: 'createParty' });
      if (!_menu || _menu.action !== 'create') return;
      const item = {
        module: 'test-party',
        atomClassName: 'party',
        atomClassIdParent: 0,
      };
      _menu = this.$utils.extend({}, _menu, { targetEl: event.target });
      // add
      return this.$meta.util.performAction({ ctx: this, action: _menu, item });
    },
    onPerformSelectAtom() {
      const url = '/a/base/atom/select';
      this.$view.navigate(url, {
        target: '_self',
        context: {
          params: {
            selectMode: 'single',
            selectedAtomId: this.atom && this.atom.atomId,
            atomClass: {
              module: 'test-party',
              atomClassName: 'party',
            },
            where: {},
          },
          callback: (code, selectedAtom) => {
            if (code === 200) {
              this.atom = selectedAtom;
            }
          },
        },
      });
    },
    onPerformSelectAtoms() {
      const url = '/a/base/atom/select';
      this.$view.navigate(url, {
        target: '_self',
        context: {
          params: {
            selectMode: 'multiple',
            selectedAtomIds: this.atoms ? this.atoms.map(item => item.atomId) : null,
            atomClass: null,
          },
          callback: (code, selectedAtoms) => {
            if (code === 200) {
              this.atoms = selectedAtoms;
            }
          },
        },
      });
    },

  },
};

</script>
