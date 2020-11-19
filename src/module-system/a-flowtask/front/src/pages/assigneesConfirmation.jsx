import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ ebPageContext ],
  data() {
    return {
    };
  },
  computed: {
    assignees() {
      return this.contextParams.assignees;
    },
  },
  methods: {
    onPerformOk() {

    },
    _getItemMetaMedia(item) {
      const media = item.avatar || this.$meta.config.modules['a-base'].user.avatar.default;
      return this.$meta.util.combineImageUrl(media, 24);
    },
    renderUsers() {
      const users = this.assignees.users;
      const children = [];
      for (const user of users) {
        children.push(
          <eb-list-item class="item" key={user.id}
            checkbox checked>
            <div slot="title" class="display-flex align-items-center">
              <img class="avatar avatar24" src={this._getItemMetaMedia(user)} />
              <span>{user.userName}</span>
            </div>
          </eb-list-item>
        );
      }
      return (
        <f7-list>
          {children}
        </f7-list>
      );
    },
  },
  render() {
    return (
      <eb-page>
        <eb-navbar title={this.$text('Assignees Confirmation')} eb-back-link="Back">
          <f7-nav-right>
            <eb-link iconMaterial="done" propsOnPerform={event => this.onPerformOk(event)}></eb-link>
          </f7-nav-right>
        </eb-navbar>
        {this.renderUsers()}
      </eb-page>
    );
  },
};
