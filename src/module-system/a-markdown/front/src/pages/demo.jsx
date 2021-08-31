import Editor from '../components/editor.jsx';
export default {
  components: {
    Editor,
  },
  data() {
    return {
      content: null, // 'hello world',
    };
  },
  methods: {},
  render() {
    return (
      <eb-page>
        <Editor style={{ height: '300px' }} value={this.content} onInput={value => (this.content = value)}></Editor>
        <textarea vModel={this.content} style="border:1px solid gray; width:100%;height:200px;"></textarea>
      </eb-page>
    );
  },
};
