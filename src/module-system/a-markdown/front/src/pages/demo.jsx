import Editor from '../components/editor.jsx';
export default {
  components: {
    Editor,
  },
  data() {
    return {
      content: '## hello world',
    };
  },
  methods: {},
  render() {
    return (
      <eb-page>
        <Editor value={this.content} onInput={value => (this.content = value)}></Editor>
        <textarea vModel={this.content}></textarea>
      </eb-page>
    );
  },
};
