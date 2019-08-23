<template>
  <eb-page>
    <eb-navbar :title="$text('Guide')" eb-back-link="Back"></eb-navbar>
    <!-- Basic process of frontend and backend development -->
    <f7-card>
      <f7-card-header>
        <div>{{$text('TipBasicProcess')}}</div>
        <div>
          <f7-link :external="true" target="_blank" :href="getUrl('basicProcess')">{{$text('How to do ...')}}</f7-link>
        </div>
      </f7-card-header>
      <f7-card-content>
        <div class="alert-info">{{message}}</div>
        <p>
          <eb-button :onPerform="onPerformClick">{{$text('Click')}}</eb-button>
        </p>
      </f7-card-content>
    </f7-card>
    <!-- Backend configuration & i18n -->
    <f7-card>
      <f7-card-header>
        <div>{{$text('TipBackendConfigI18N')}}</div>
        <div>
          <f7-link :external="true" target="_blank" :href="getUrl('backendConfigI18N')">{{$text('How to do ...')}}</f7-link>
        </div>
      </f7-card-header>
      <f7-card-content>
        <div class="alert-info">{{message3}}</div>
        <p>
          <eb-button :onPerform="onPerformClick3">{{$text('Click')}}</eb-button>
        </p>
      </f7-card-content>
    </f7-card>
    <!-- Frontend configuration & i18n -->
    <f7-card>
      <f7-card-header>
        <div>{{$text('TipFrontendConfigI18N')}}</div>
        <div>
          <f7-link :external="true" target="_blank" :href="getUrl('frontendConfigI18N')">{{$text('How to do ...')}}</f7-link>
        </div>
      </f7-card-header>
      <f7-card-content>
        <div class="alert-info">{{message4}}</div>
        <f7-segmented tag="p">
          <eb-button outline :onPerform="onPerformClick4">{{$text('Click')}}</eb-button>
          <eb-button outline :onPerform="onPerformClick5">{{$text('Click')}}</eb-button>
        </f7-segmented>
      </f7-card-content>
    </f7-card>
  </eb-page>
</template>
<script>
const gUrls = {};
gUrls['zh-cn'] = {
  basicProcess: 'https://cabloy.com/zh-cn/articles/a701324bdfbe4363943d6c35faa9240a.html',
  backendConfigI18N: 'https://cabloy.com/zh-cn/articles/9a7c907224124d328b7bea05021a2b02.html',
  frontendConfigI18N: 'https://cabloy.com/zh-cn/articles/597c4b0224eb46b2a7697e05f44ba9aa.html',
};
gUrls['en-us'] = {
  basicProcess: 'https://cabloy.com/articles/fb9110659f50472e9943f64eec5d22c6.html',
  backendConfigI18N: 'https://cabloy.com/articles/53fa7cafa02e4c169ba37a9cd4f76ca3.html',
  frontendConfigI18N: 'https://cabloy.com/articles/3691cfc1b8e54d78a24dae9af7327b30.html',
};
export default {
  data() {
    return {
      message: null,
      message3: null,
      message4: null,
    };
  },
  computed: {
    locale() {
      return this.$meta.util.cookies.get('locale') || 'en-us';
    },
    urlBasicProcess() {
      let url;
      switch (this.locale) {
        case 'zh-cn':
          url = '';
          break;
        default:
          url = '';
      }
      return url;
    },
    urlBackendConfigI18N() {
      let url;
      switch (this.locale) {
        case 'zh-cn':
          url = '';
          break;
        default:
          url = '';
      }
      return url;
    },
    urlFrontendConfigI18N() {
      let url;
      switch (this.locale) {
        case 'zh-cn':
          url = '';
          break;
        default:
          url = '';
      }
      return url;
    },
  },
  methods: {
    getUrl(name) {
      const locale = this.locale;
      return (gUrls[locale] && gUrls[locale][name]) || gUrls['en-us'][name];
    },
    onPerformClick() {
      return this.$api.post('kitchen-sink/guide/echo').then(data => {
        this.message = data;
      });
    },
    onPerformClick3() {
      return this.$api.post('kitchen-sink/guide/echo3').then(data => {
        this.message3 = data;
      });
    },
    onPerformClick4() {
      const params = {
        message: this.$config.message,
        markCount: this.$config.markCount,
      };
      return this.$api.post('kitchen-sink/guide/echo4', params).then(data => {
        this.message4 = data;
      });
    },
    onPerformClick5() {
      const params = {
        message: this.$text('Hello World'),
        markCount: this.$config.markCount,
      };
      return this.$api.post('kitchen-sink/guide/echo4', params).then(data => {
        this.message4 = data;
      });
    },
  },
};

</script>
<style scoped>
</style>
