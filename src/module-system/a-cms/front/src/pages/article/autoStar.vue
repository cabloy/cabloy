<template>
  <eb-page>
    <eb-navbar :title="$text('Star')" eb-back-link="Back"></eb-navbar>
    <f7-block>
    </f7-block>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      atomId: this.$f7route.query.atomId,
    };
  },
  created() {
    console.log(this.atomId);
    this.$api.post('/a/base/atom/star', {
      key: { atomId: this.atomId },
      atom: { star: 1 },
    }).then(() => {
      this.$view.dialog.alert(this.$text('Starred')).then(() => {
        this.openAtom();
      });
    });
  },
  methods: {
    openAtom() {
      this.$api.post('render/getArticleUrl', {
        atomClass: null,
        key: { atomId: this.atomId },
      }).then(data => {
        location.assign(data.url);
      });
    },
  },
};

</script>
</style>
