import roleItemBase from '../../components/role/roleItemBase.js';
import roleIncludes from '../../components/role/includes.jsx';
export default {
  mixins: [roleItemBase],
  components: {
    roleIncludes,
  },
  data() {
    return {};
  },
  methods: {
    page_onRefresh(done) {
      done();
      this.$refs.includes.reload();
    },
    page_onInfinite() {
      this.$refs.includes.loadMore();
    },
    onPerformAdd() {
      return this.$refs.includes.onPerformAdd();
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
        <eb-navbar large largeTransparent title={this.getPageTitle('Inherits')} eb-back-link="Back">
          <f7-nav-right>
            <eb-link iconF7="::add" propsOnPerform={this.onPerformAdd}></eb-link>
          </f7-nav-right>
        </eb-navbar>
        <role-includes ref="includes" roleAtomId={this.roleAtomId} roleId={this.roleId}></role-includes>
      </eb-page>
    );
  },
};
