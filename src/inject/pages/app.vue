<script>
import Main from './main.vue';
import Login from './login.vue';
export default {
  render(c) {
    const statusBar = c('f7-statusbar', { ref: 'statusbar' });
    const layout = c('eb-layout', { ref: 'layout' });
    const main = c('eb-main', { ref: 'main' });
    const login = c('eb-login', { ref: 'login' });
    return c(
      'div', [
        statusBar,
        layout,
        main,
        login,
      ]
    );
  },
  components: {
    ebMain: Main,
    ebLogin: Login,
  },
};

</script>
<style scoped>


</style>
