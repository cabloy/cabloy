<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Atom')" eb-back-link="Back"></eb-navbar>
    <eb-list class="item" no-hairlines-md>
      <eb-list-item :title="$text('Create Party')" link="#" :onPerform="onPerformCreate"></eb-list-item>
      <eb-list-item :title="$text('Party List')" link="#" eb-href="/a/basefront/atom/list?module=test-party&atomClassName=party"></eb-list-item>
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
const ebAtomActions = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomActions;
export default {
  mixins: [ ebAtomActions ],
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
      const resourceConfig = {
        module: 'test-party',
        atomClassName: 'party',
        atomAction: 'create',
      };
      let action = this.getAction({
        module: resourceConfig.module,
        atomClassName: resourceConfig.atomClassName,
        name: resourceConfig.atomAction,
      });
      const item = {
        module: resourceConfig.module,
        atomClassName: resourceConfig.atomClassName,
      };
      action = this.$utils.extend({}, action, { targetEl: event.target });
      return this.$meta.util.performAction({ ctx: this, action, item });
    },
    onPerformSelectAtom() {
      const url = '/a/basefront/atom/select';
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
            options: {},
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
      const url = '/a/basefront/atom/select';
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
