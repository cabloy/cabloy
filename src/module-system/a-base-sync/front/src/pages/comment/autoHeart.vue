<template>
  <eb-page>
    <eb-navbar :title="$text('Heart2')" eb-back-link="Back"></eb-navbar>
    <f7-block>
    </f7-block>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      atomId: this.$f7route.query.atomId,
      commentId: this.$f7route.query.commentId,
    };
  },
  created() {
    this.$api.post('/a/base/comment/heart', {
      key: { atomId: this.atomId },
      atom: { star: 1 },
      data: { commentId: this.commentId, heart: 1 },
    }).then(() => {
      this.$view.dialog.alert(this.$text('Hearted')).then(() => {
        this.openAtom();
      });
    });
  },
  methods: {
    openAtom() {
      location.assign(this.$f7route.query.returnTo);
    },
  },
};

</script>
</style>
