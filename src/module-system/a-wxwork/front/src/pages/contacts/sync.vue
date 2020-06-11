<template>
  <eb-page>
    <eb-navbar :title="getPageTitle()" eb-back-link="Back">
      <f7-nav-right>
        <eb-link :onPerform="onPerformSync">{{$text('Sync Now')}}</eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-box @size="onSize">
      <textarea ref="textarea" type="textarea" readonly="readonly" :value="content" class="json-textarea"></textarea>
    </eb-box>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      type: this.$f7route.query.type,
      mode: this.$f7route.query.mode,
      content: '',
    };
  },
  methods: {
    getPageTitle() {
      const type = this.type === 'departments' ? 'Departments' : 'Members';
      const mode = this.mode === 'inc' ? 'Sync (Incremental)' : 'Sync (Full)';
      return `${this.$text(type)}: ${this.$text(mode)}`;
    },
    onPerformSync() {
      return this.$view.dialog.confirm().then(() => {
        return this.$api.post(`contacts/sync`, {
          type: this.type,
          mode: this.mode,
        }).then(res => {
          console.log(res);
        });
      });
    },
    onSize(size) {
      this.$$(this.$refs.textarea).css({
        height: `${size.height - 20}px`,
        width: `${size.width - 20}px`,
      });
    },
  },
};

</script>
<style>
</style>
