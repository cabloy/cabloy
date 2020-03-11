<template>
  <f7-card>
    <f7-card-header>{{$text('Fruit Sales(Pie Chart)')}}</f7-card-header>
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
      season: 'Summer', //'Spring',
      labels: ['Apples', 'Pears'],
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
      const seasonIndex = this.dataSource.rows.findIndex(item => item === this.season);
      const chartData = {
        labels: this.labels,
        datasets: [{
          backgroundColor: ['#f56954', '#f39c12'],
          data: this.dataSource.dataset[seasonIndex].slice(0, 2),
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
        scales: {

        },
      };
      // fill
      this.chart = new this.chartjs(chartCanvas, {
        type: 'doughnut',
        data: chartData,
        options: chartOptions,
      });
    },
    __updateChart(season) {
      this.season = season;
      this.chart.config.data = this.__prepareData();
      this.chart.config.options.title.text = this.season;
      this.chart.update();
    },
  },
};

</script>
<style scoped>
</style>
