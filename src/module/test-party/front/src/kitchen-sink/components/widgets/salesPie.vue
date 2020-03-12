<template>
  <f7-card>
    <f7-card-header>{{$text('Fruit Sales(Pie Chart)')}}</f7-card-header>
    <f7-card-content>
      <canvas ref="chart"></canvas>
      <div class="error" v-if="errorMessage">{{errorMessage}}</div>
    </f7-card-content>
  </f7-card>
</template>
<script>
const propsSchema = {
  type: 'object',
  properties: {
    dataSource: {
      type: 'object',
      ebType: 'text',
      ebTitle: 'Data Source',
      ebBindOnly: true,
      notEmpty: true,
    },
    season: {
      type: 'string',
      ebType: 'select',
      ebTitle: 'Season',
      ebOptions: [
        { title: 'Spring', value: 'Spring' },
        { title: 'Summer', value: 'Summer' },
        { title: 'Autumn', value: 'Autumn' },
        { title: 'Winter', value: 'Winter' },
      ],
      ebOptionsBlankAuto: true,
      notEmpty: true,
    },
  },
};

const attrs = {
  snapshot: {
    title: 'Snapshot',
  },
};

const ebDashboardWidgetBase = Vue.prototype.$meta.module.get('a-dashboard').options.components.ebDashboardWidgetBase;
export default {
  meta: {
    global: false,
    widget: {
      schema: {
        props: propsSchema,
      },
      attrs,
    },
  },
  mixins: [ebDashboardWidgetBase],
  props: {
    dataSource: {
      type: Object,
    },
    season: {
      type: String,
    },
  },
  data() {
    return {
      chartjs: null,
      chart: null,
      snapshot: null,
      errorMessage: null,
    };
  },
  watch: {
    dataSource() {
      this.__updateChart();
    },
    season() {
      this.__updateChart();
    },
  },
  mounted() {
    this.__init();
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  },
  methods: {
    __init() {
      this.$meta.module.use('a-chartjs', module => {
        this.chartjs = module.options.utils.chartjs;
        this.__updateChart();
      });
    },
    __prepareData() {
      const seasonIndex = this.dataSource.rows.findIndex(item => item === this.season);
      if (seasonIndex === -1) throw new Error();
      const chartData = {
        labels: this.dataSource.cols.slice(0, 2),
        datasets: [{
          backgroundColor: this.dataSource.colors.slice(0, 2),
          data: this.dataSource.dataset[seasonIndex].slice(0, 2),
        }, ],
      };
      return chartData;
    },
    __prepareOptions() {
      const chartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        animation: {
          onComplete: () => {
            this.__createSnapshot();
          }
        },
        title: {
          display: true,
          position: 'top',
          text: this.season,
          fontColor: 'rgba(255, 255, 255, 0.4)',
        },
        legend: {
          display: true,
          position: 'left',
          labels: {
            fontColor: 'rgba(255, 255, 255, 0.4)',
          },
        },
      };
      return chartOptions;
    },
    __createSnapshot() {
      const image = this.chart.toBase64Image();
      this.snapshot = {
        title: this.$text('Fruit Sales(Pie Chart)'),
        image,
      };
    },
    __clearChart() {
      if (this.chart) {
        this.chart.clear();
      }
    },
    __updateChart() {
      try {
        if (!this.dataSource || !this.season) {
          this.__clearChart();
          this.errorMessage = this.$text('Please set data source');
          return;
        }
        const chartData = this.__prepareData();
        const chartOptions = this.__prepareOptions();
        if (!this.chart) {
          // canvas
          const chartCanvas = this.$refs.chart.getContext('2d');
          // fill
          this.chart = new this.chartjs(chartCanvas, {
            type: 'doughnut',
            data: chartData,
            options: chartOptions,
          });
        } else {
          this.chart.data = this.__prepareData();
          this.chart.options = this.__prepareOptions();
          this.chart.update();
        }
        this.errorMessage = null;
        return;
      } catch (err) {
        this.__clearChart();
        this.errorMessage = this.$text('There may be a binding error');
      }
    },
  },
};

</script>
<style lang="less" scoped>
.error {
  position: absolute;
  bottom: 6px;
  right: 6px;
  font-size: smaller;
}

</style>
