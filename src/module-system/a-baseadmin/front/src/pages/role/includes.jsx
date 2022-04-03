import roleIncludes from '../../components/role/includes.vue';
export default {
  components: {
    roleIncludes,
  },
  data() {
    return {
      roleAtomId: parseInt(this.$f7route.query.roleAtomId),
      roleId: parseInt(this.$f7route.query.roleId),
    };
  },
  render() {
    return (
      <eb-page>
        <eb-navbar large largeTransparent title={this.$text('Includes')} eb-back-link="Back"></eb-navbar>
        <role-includes ref="includes" roleAtomId={this.roleAtomId} roleId={this.roleId}></role-includes>
      </eb-page>
    );
  },
};
