import Vue from 'vue';
import roleItemBase from '../../components/role/roleItemBase.js';
import rights from '../../components/atomRight/rights.vue';
import spreads from '../../components/atomRight/spreads.vue';
export default {
  mixins: [roleItemBase],
  components: {
    rights,
    spreads,
  },
  data() {
    return {
      tabIdRights: Vue.prototype.$meta.util.nextId('tab'),
      tabIdSpreads: Vue.prototype.$meta.util.nextId('tab'),
      tabName: 'rights',
    };
  },
  computed: {
    tabSingle() {
      return this.role && this.role.roleTypeCode === 6;
    },
  },
  methods: {
    onPerformRightsAdd() {
      return this.$refs.rights.onPerformAdd();
    },
    _renderSubnavbar() {
      if (!this.role || this.tabSingle) return null;
      return (
        <f7-subnavbar>
          <f7-toolbar top tabbar>
            <f7-link tab-link={`#${this.tabIdRights}`} tab-link-active>
              {this.$text('Rights')}
            </f7-link>
            <f7-link tab-link={`#${this.tabIdSpreads}`}>{this.$text('Spreads')}</f7-link>
          </f7-toolbar>
        </f7-subnavbar>
      );
    },
    _renderTabs() {
      if (!this.role || this.tabSingle) return null;
      return (
        <f7-tabs>
          <eb-tab-page-content
            id={this.tabIdRights}
            tab-active
            onTabShow={() => {
              this.tabName = 'rights';
            }}
          >
            <rights ref="rights" slot="list" role={this.role}></rights>
          </eb-tab-page-content>
          <eb-tab-page-content
            id={this.tabIdSpreads}
            onTabShow={() => {
              this.tabName = 'spreads';
            }}
          >
            <spreads ref="spreads" slot="list" role={this.role}></spreads>
          </eb-tab-page-content>
        </f7-tabs>
      );
    },
    _renderNavRight() {
      if (!this.tabSingle && this.tabName !== 'rights') return;
      return (
        <f7-nav-right>
          <eb-link
            iconF7="::add"
            tooltip={this.$text('New Authorizations')}
            propsOnPerform={this.onPerformRightsAdd}
          ></eb-link>
        </f7-nav-right>
      );
    },
    _renderSingleRights() {
      if (!this.role || !this.tabSingle) return null;
      return <rights ref="rights" role={this.role} autoInit={true}></rights>;
    },
  },
  render() {
    return (
      <eb-page page-content={this.tabSingle} tabs={!this.tabSingle} with-subnavbar={!this.tabSingle}>
        <eb-navbar title={this.getPageTitle('Atom Authorizations')} eb-back-link="Back">
          {this._renderNavRight()}
          {this._renderSubnavbar()}
        </eb-navbar>
        {this._renderTabs()}
        {this._renderSingleRights()}
      </eb-page>
    );
  },
};
