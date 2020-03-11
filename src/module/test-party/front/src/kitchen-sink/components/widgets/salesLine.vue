<template>
  <f7-card>
    <f7-card-header>{{$text('Fruit Sales(Line Chart)')}}</f7-card-header>
    <f7-card-content>
      <canvas ref="chart"></canvas>
    </f7-card-content>
  </f7-card>
</template>
<script>
import dataSource from './data.js';

const propsSchema = {
  type: 'object',
  properties: {
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
    },
  },
};
export default {
  meta: {
    global: false,
    schema: {
      props: propsSchema,
    }
  },
  props: {
    fruit: {
      type: String,
    },
  },
  data() {
    return {
      chartjs: null,
      chart: null,
      dataSource,
    };
  },
  watch: {
    fruit() {
      this.__updateChart();
    },
  },
  mounted() {
    this.__init();
    this.$emit('widgetReal:ready', this);
  },
  beforeDestroy() {
    this.$emit('widgetReal:destroy', this);
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
    __updateChart() {
      if (!this.dataSource || !this.fruit) {
        if (this.chart) {
          this.chart.clear();
        }
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
        this.chart.config.data = this.__prepareData();
        this.chart.config.options = this.__prepareOptions();
        this.chart.update();
      }
    },
  },
};

</script>
<style scoped>
</style>
