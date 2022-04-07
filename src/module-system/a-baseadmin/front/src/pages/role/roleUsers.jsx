import roleItemBase from '../../components/role/roleItemBase.js';
import roleUsers from '../../components/role/roleUsers.jsx';
export default {
  mixins: [roleItemBase],
  components: {
    roleUsers,
  },
  data() {
    return {};
  },
  methods: {
    page_onRefresh(done) {
      done();
      this.$refs.roleUsers.reload();
    },
    page_onInfinite() {
      this.$refs.roleUsers.loadMore();
    },
    onPerformAdd() {
      return this.$refs.roleUsers.onPerformAdd();
    },
  },
  render() {
    return (
      <eb-page
        ptr
        onPtrRefresh={this.page_onRefresh}
        infinite
        infinitePreloader={false}
        onInfinite={this.page_onInfinite}
      >
        <eb-navbar large largeTransparent title={this.getPageTitle('Users')} eb-back-link="Back">
          <f7-nav-right>
            <eb-link iconF7="::add" propsOnPerform={this.onPerformAdd}></eb-link>
          </f7-nav-right>
        </eb-navbar>
        <role-users ref="roleUsers" roleAtomId={this.roleAtomId} roleId={this.roleId}></role-users>
      </eb-page>
    );
  },
};
