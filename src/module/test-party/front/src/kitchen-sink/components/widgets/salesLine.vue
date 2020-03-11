<template>
  <f7-card>
    <f7-card-header>Fruit Sales(Line Chart)</f7-card-header>
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
    };
  },
  mounted() {
    this.__init();
  },
  methods: {
    __init() {
      this.$meta.module.use('a-chartjs', module => {
        this.chartjs = module.options.utils.chartjs;
        this.__fillChart();
      });
    },
    __fillChart() {
      // canvas
      const chartCanvas = this.$refs.chart.getContext('2d');
      // data
      const chartData = {
        labels: dataSource.rows,
        datasets: [{
          label: 'Apple',
          fill: false,
          data: dataSource.dataset.map(item => item[0]),
        }, ],
      };
      // options
      const chartOptions = {
        maintainAspectRatio: false,
        responsive: true,
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
      })
    }
  },
};

</script>
<style scoped>
</style>
