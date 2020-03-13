<template>
  <f7-card>
    <f7-card-header>{{$text('Snapshots')}}</f7-card-header>
    <f7-card-content>
      <div v-for="item of snapshots" :key="item.id">
        <template v-if="item.data">
          <f7-block-title>{{item.data.title}}</f7-block-title>
          <f7-block class="snapshot">
            <img :src="item.data.image">
          </f7-block>
        </template>
      </div>
      <div class="error" v-if="!snapshots">{{$text('Please set data source')}}</div>
    </f7-card-content>
  </f7-card>
</template>
<script>
const propsSchema = {
  type: 'object',
  properties: {
    snapshots: {
      type: 'array',
      ebType: 'text',
      ebTitle: 'Snapshots',
      ebBindOnly: true,
      ebBindArray: true,
      notEmpty: true,
    },
  },
};

// export
export default {
  install,
  meta: {
    global: false,
    widget: {
      schema: {
        props: propsSchema,
      },
    },
  },
  props: {
    snapshots: {
      type: Array,
    },
  },
};

// install
function install(_Vue) {
  const Vue = _Vue;
  const ebDashboardWidgetBase = Vue.prototype.$meta.module.get('a-dashboard').options.mixins.ebDashboardWidgetBase;
  return {
    mixins: [ebDashboardWidgetBase],
    data() {
      return {};
    },
    methods: {},
  };

}

</script>
<style lang="less" scoped>
.error {
  position: absolute;
  bottom: 6px;
  right: 6px;
  font-size: smaller;
}

.snapshot {
  padding: 8px;
  text-align: center;

  img {
    width: 80%;
  }
}

</style>
