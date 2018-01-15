<template>
  <!-- App -->
  <div id="app">
    <!-- Statusbar -->
    <f7-statusbar></f7-statusbar>
    <!-- Main Views -->
    <f7-views>
      <f7-view id="main-view
" navbar-through :dynamic-navbar="true" main>
        <!-- iOS Theme Navbar -->
        <f7-navbar v-if="$theme.ios">
          <f7-nav-center sliding>egg-born example</f7-nav-center>
        </f7-navbar>
        <!-- Pages -->
        <f7-pages>
          <f7-page>
            <!-- Material Theme Navbar -->
            <f7-navbar v-if="$theme.material">
              <f7-nav-center sliding>egg-born example</f7-nav-center>
            </f7-navbar>
            <!-- Page Content -->
            <f7-block-title>Welcome to egg-born!</f7-block-title>
            <f7-block inner>
              <p>egg-born is the ultimate full-stack javascript framework.</p>
            </f7-block>
            <f7-block-title>Navigation</f7-block-title>
            <f7-list>
              <f7-list-item link="/aa/hello/welcome/You" title="Welcome"></f7-list-item>
              <f7-list-item link="/aa/hello/profile" title="Profile"></f7-list-item>
            </f7-list>
          </f7-page>
        </f7-pages>
      </f7-view>
    </f7-views>
    <!-- Login Screen -->
    <f7-login-screen id="login-screen">
      <f7-view>
        <f7-pages>
          <f7-page login-screen>
            <f7-login-screen-title>Login</f7-login-screen-title>
            <f7-list form>
              <f7-list-item>
                <f7-label>Username</f7-label>
                <f7-input v-model="username" type="text"></f7-input>
              </f7-list-item>
              <f7-list-item>
                <f7-label>Password</f7-label>
                <f7-input v-model="password" type="password"></f7-input>
              </f7-list-item>
            </f7-list>
            <f7-list>
              <f7-list-button @click="login" title="Sign In" close-login-screen></f7-list-button>
            </f7-list>
          </f7-page>
        </f7-pages>
      </f7-view>
    </f7-login-screen>
  </div>
</template>
<script>
/* eslint-disable */
const __hash = location.hash;
if (__hash !== '' && __hash !== '#') { // not check '#/'
  history.replaceState(null, '', location.pathname + location.search);
}
/* eslint-enable */
export default {
  data() {
    return {
      username: 'zhennann',
      password: '123456',
    };
  },
  methods: {
    login() {
      this.$store.commit('auth/login', { user: { name: this.username } });

      const params = this.$meta.loginParams;
      this.$meta.loginParams = null;
      if (params) { params.view.loadPage(params.options); } else { this.$f7.closeModal(); }
    },
  },
  mounted() {
    // load first hash
    if (__hash !== '' && __hash !== '#' && __hash !== '#/') {
      this.$nextTick(() => {
        this.$f7.mainView.router.loadPage(__hash.substr(1));
      });
    }
  },
};

</script>
