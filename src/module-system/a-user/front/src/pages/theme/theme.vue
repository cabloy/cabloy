<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Theme')" eb-back-link="Back"></eb-navbar>
    <f7-list v-if="theme && moduleThemes">
      <eb-list-item
        radio
        :checked="theme.type === 'builtIn'"
        :title="$text('Built-in Theme')"
        @change="onChangeBuiltIn"
      >
        <f7-link slot="after" @click="onClickBuiltIn">{{ $text('Edit') }}</f7-link>
      </eb-list-item>
      <eb-list-item
        radio
        :checked="theme.type === 'thirdParty'"
        :title="$text('Third-party Theme')"
        @change="onChangeThirdParty"
      >
        <a
          slot="after"
          ref="moduleThemes"
          @smartselect:beforeopen="onSmartselectBeforeOpen"
          @smartselect:closed="onSmartselectClosed"
          class="link smart-select"
          :data-page-title="$text('Third-party Theme')"
          data-close-on-select="true"
        >
          <select name="moduleThemes">
            <option value=""></option>
            <option
              v-for="moduleName of Object.keys(moduleThemes)"
              :key="moduleName"
              :value="moduleName"
              :selected="moduleName === theme.thirdParty"
            >
              {{ moduleThemes[moduleName].titleLocale }}
            </option>
          </select>
          <div>{{ theme.thirdParty || $text('Select') }}</div>
        </a>
      </eb-list-item>
    </f7-list>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      theme: null,
      moduleThemes: null,
    };
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.theme = this.$meta.vueLayout.theme_get();
      this.moduleThemes = await this.$api.post('/a/base/base/themes');
    },
    checkSave(type, force) {
      if (force || this.theme.type !== type) {
        this.theme.type = type;
        this.$meta.vueLayout.theme_set(this.theme);
        return true;
      }
      return false;
    },
    onChangeBuiltIn() {
      if (this.checkSave('builtIn')) {
        // this.editBuiltIn();
      }
    },
    onChangeThirdParty() {
      if (this.checkSave('thirdParty')) {
        // this.editThirdParty();
      }
    },
    onClickBuiltIn() {
      this.checkSave('builtIn');
      this.editBuiltIn();
    },
    onSmartselectBeforeOpen() {
      this.checkSave('thirdParty');
    },
    onSmartselectClosed() {
      const smartSelect = this.$f7.smartSelect.get(this.$refs.moduleThemes);
      const value = smartSelect.getValue();
      if (this.theme.thirdParty !== value) {
        this.theme.thirdParty = value;
        this.checkSave('thirdParty', true);
      }
    },
    editBuiltIn() {
      this.$view.navigate('/a/user/theme/builtIn', {
        target: '_self',
        context: {
          params: {
            builtIn: this.theme.builtIn,
            onChange: builtIn => {
              this.theme = { ...this.theme, builtIn };
              this.$meta.vueLayout.theme_set(this.theme);
            },
          },
          callback: (code, data) => {
            if (code === 200) {
              // donothing
            }
          },
        },
      });
    },
    editThirdParty() {
      this.$refs.moduleThemes.click();
    },
  },
};
</script>
<style lang="less" scoped=""></style>
