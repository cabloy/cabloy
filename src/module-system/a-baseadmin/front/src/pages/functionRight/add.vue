<template>
  <eb-page>
    <eb-navbar :title="$text(menu===1?'New Menu Right':'New Function Right')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="save" :onPerform="onSave"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <f7-list form no-hairlines-md>
      <f7-list-item smartSelect :title="$text('Module')" :smartSelectParams="{openIn: 'page', closeOnSelect: true}">
        <eb-select name="module" v-model="module" :options="modules"></eb-select>
      </f7-list-item>
      <f7-list-item v-if="!!module" :title="$text(menu===1?'Menu':'Function')" link="#" @click="onSelectFunction">
        <div slot="after">{{func && func.title}}</div>
      </f7-list-item>
    </f7-list>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      roleId: parseInt(this.$f7route.query.roleId),
      menu: parseInt(this.$f7route.query.menu),
      module: '',
      func: null,
    };
  },
  computed: {
    modules() {
      const functionsAll = this.$store.getState('a/base/functions');
      if (!functionsAll) return [];
      const options = [{ title: null, value: '' }];
      for (const key in functionsAll) {
        options.push({ title: key, value: key });
      }
      return options;
    },
    apiPath() {
      return this.menu === 1 ? 'menuRight' : 'functionRight';
    },
  },
  watch: {
    module(value) {
      this.func = null;
    },
  },
  created() {
    this.$meta.module.use('a-base', module => {
      this.$store.dispatch('a/base/getFunctions');
    });
  },
  methods: {
    onSelectFunction() {
      this.$view.navigate('/a/base/menu/selectFunction', {
        target: '_self',
        context: {
          params: {
            module: this.module,
            name: this.func ? this.func.name : null,
            menu: this.menu,
            optional: true,
          },
          callback: (code, data) => {
            if (code === 200) {
              this.func = data;
            }
          },
        },
      });
    },
    onSave() {
      if (!this.module || !this.func) return;
      return this.$api.post(`${this.apiPath}/add`, {
        roleId: this.roleId,
        module: this.module,
        name: this.func.name,
      })
        .then(() => {
          this.$meta.eventHub.$emit('functionRight:add', { roleId: this.roleId });
          this.$f7router.back();
        });
    },
  },
};

</script>
<style scoped>


</style>
