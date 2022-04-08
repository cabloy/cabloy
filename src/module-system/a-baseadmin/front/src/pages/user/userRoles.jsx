import userItemBase from '../../components/user/userItemBase.js';
import userRoles from '../../components/user/userRoles.jsx';
export default {
  mixins: [userItemBase],
  components: {
    userRoles,
  },
  data() {
    return {};
  },
  methods: {
    page_onRefresh(done) {
      done();
      this.$refs.userRoles.reload();
    },
    page_onInfinite() {
      this.$refs.userRoles.loadMore();
    },
    onPerformAdd() {
      return this.$refs.userRoles.onPerformAdd();
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
        <eb-navbar large largeTransparent title={this.getPageTitle('Roles')} eb-back-link="Back">
          <f7-nav-right>
            <eb-link iconF7="::add" propsOnPerform={this.onPerformAdd}></eb-link>
          </f7-nav-right>
        </eb-navbar>
        <user-roles ref="userRoles" userAtomId={this.userAtomId} userId={this.userId}></user-roles>
      </eb-page>
    );
  },
};
