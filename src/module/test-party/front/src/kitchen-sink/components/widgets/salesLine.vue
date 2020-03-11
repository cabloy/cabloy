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
export default {
  meta: {
    global: false,
  },
  data() {
    return {
      chartjs: null,
      chart: null,
      dataSource,
      fruit: 'All', //'Apples',
    };
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
        this.__fillChart();
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
    __fillChart() {
      // canvas
      const chartCanvas = this.$refs.chart.getContext('2d');
      // data
      const chartData = this.__prepareData();
      // options
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
      // fill
      this.chart = new this.chartjs(chartCanvas, {
        type: 'line',
        data: chartData,
        options: chartOptions,
      });
    },
    __updateChart(fruit) {
      this.fruit = fruit;
      this.chart.config.data = this.__prepareData();
      this.chart.config.options.title.text = this.fruit;
      this.chart.update();
    },
  },
};

</script>
<style scoped>
</style>
