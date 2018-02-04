<script>
import Login from './login.vue';
export default {
  render(c) {
    const statusBar = c('f7-statusbar');
    const layout = c('layout');
    const login = c('login');
    return c(
      'div', {}, [
        statusBar,
        layout,
        login,
      ]
    );
  },
  components: {
    Login,
  },
};

</script>
<style scoped>


</style>
