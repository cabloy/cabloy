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
// install
function install(_Vue) {
  const Vue = _Vue;
  const ebDashboardWidgetBase = Vue.prototype.$meta.module.get('a-dashboard').options.components.ebDashboardWidgetBase;

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

  return {
    meta: {
      global: false,
      widget: {
        schema: {
          props: propsSchema,
        },
      },
    },
    mixins: [ebDashboardWidgetBase],
    props: {
      snapshots: {
        type: Array,
      },
    },
    data() {
      return {};
    },
    methods: {},
  };

}

// export
export default {
  install,
};

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
