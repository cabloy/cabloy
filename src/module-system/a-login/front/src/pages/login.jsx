import Login from '../components/login.jsx';

export default {
  meta: {
    title: 'Sign In',
    size: 'small',
    sizeFixed: true,
  },
  components: {
    Login,
  },
  data() {
    return {};
  },
  render() {
    return (
      <eb-page login-screen={true} no-toolbar={false} no-navbar={true} no-swipeback={true}>
        <Login></Login>
      </eb-page>
    );
  },
  methods: {},
};
