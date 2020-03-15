<template>
  <f7-card>
    <f7-card-header>{{$text('Fruit Sales(Line Chart)')}}</f7-card-header>
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
      ebClue: 'salesDataSource',
    },
    fruit: {
      type: 'string',
      ebType: 'select',
      ebTitle: 'Fruit',
      ebOptions: [
        { title: 'All', value: 'All' },
        { title: 'Apples', value: 'Apples' },
        { title: 'Pears', value: 'Pears' },
      ],
      ebOptionsBlankAuto: true,
      ebClue: 'salesFruit',
    },
  },
};

const attrsSchema = {
  type: 'object',
  properties: {
    snapshot: {
      ebTitle: 'Snapshot',
      ebClue: 'snapshot',
    },
  },
};

// export
export default {
  install,
};

// install
function install(_Vue) {
  const Vue = _Vue;
  const ebDashboardWidgetBase = Vue.prototype.$meta.module.get('a-dashboard').options.mixins.ebDashboardWidgetBase;
  return {
    meta: {
      widget: {
        schema: {
          props: propsSchema,
          attrs: attrsSchema,
        },
      },
    },
    mixins: [ebDashboardWidgetBase],
    props: {
      dataSource: {
        type: Object,
      },
      fruit: {
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
      fruit() {
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
        const fruitIndex = this.dataSource.cols.findIndex(item => item === this.fruit);
        if (fruitIndex === -1) throw new Error();
        const chartData = {
          labels: this.dataSource.rows,
          datasets: [{
            fill: false,
            backgroundColor: this.dataSource.colors[fruitIndex],
            data: this.dataSource.dataset.map(item => item[fruitIndex]),
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
            text: this.fruit,
            fontColor: 'rgba(255, 255, 255, 0.4)',
          },
          legend: {
            display: false,
          },
          scales: {
            xAxes: [{
              gridLines: {
                display: false,
              },
              ticks: {
                fontColor: 'rgba(255, 255, 255, 0.4)',
              },
            }],
            yAxes: [{
              gridLines: {
                display: true,
              },
              ticks: {
                fontColor: 'rgba(255, 255, 255, 0.4)',
                stepSize: 200,
              },
            }],
          },
        };
        return chartOptions;
      },
      __createSnapshot() {
        const image = this.chart.toBase64Image();
        this.snapshot = {
          title: this.$text('Fruit Sales(Line Chart)'),
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
          if (!this.dataSource || !this.fruit) {
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
              type: 'line',
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

}

</script>
<style lang="less" scoped>
.error {
  position: absolute;
  bottom: 6px;
  right: 6px;
  font-size: smaller;
}

</style>
