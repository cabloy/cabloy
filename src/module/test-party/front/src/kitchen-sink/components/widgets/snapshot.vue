<template>
  <f7-card>
    <f7-card-header>{{$text('Snapshots')}}</f7-card-header>
    <f7-card-content>
      <div v-for="item of snapshots" :key="item.key">
        <template v-if="item.value">
          <f7-block-title>{{item.value.title}}</f7-block-title>
          <f7-block class="snapshot">
            <img :src="item.value.image">
          </f7-block>
        </template>
      </div>
    </f7-card-content>
  </f7-card>
</template>
<script>
const propsSchema = {
  type: 'object',
  properties: {
    snapshots: {
      type: 'array',
      ebTitle: 'Snapshots',
      ebBindOnly: true,
      ebBindArray: true,
      notEmpty: true,
    },
  },
};

const ebDashboardWidgetBase = Vue.prototype.$meta.module.get('a-dashboard').options.components.ebDashboardWidgetBase;
export default {
  meta: {
    global: false,
    schema: {
      props: propsSchema,
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

</script>
<style lang="less" scoped>
.snapshot {
  padding: 8px;
  text-align: center;

  img {
    width: 80%;
  }
}

</style>
