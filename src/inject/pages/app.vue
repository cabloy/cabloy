<script>
import Login from './login.vue';
export default {
  render(c) {
    const statusBar = c('f7-statusbar', { ref: 'statusbar' });
    const layout = c('layout', { ref: 'layout' });
    const login = c('login', { ref: 'login' });
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
