<template>
  <f7-card>
    <f7-card-header>{{$text('Fruit Sales')}}</f7-card-header>
    <f7-card-content>
      <div class="data-table">
        <table>
          <thead>
            <tr>
              <th class="label-cell"></th>
              <th v-for="(col,index) of dataSource.cols" :key="index" class="numeric-cell">
                <f7-link :class="col===fruit?'selected':''" @click="onClickFruit(col)">{{col}}</f7-link>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row,index) of dataSource.rows" :key="index">
              <th class="label-cell">
                <f7-link :class="row===season?'selected':''" @click="onClickSeason(row)">{{row}}</f7-link>
              </th>
              <td v-for="(col,colIndex) of dataSource.cols" :key="colIndex" class="numeric-cell">{{dataSource.dataset[index][colIndex]}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </f7-card-content>
    <f7-card-footer>
      <span></span>
      <span></span>
      <span>Amount: {{getAmount()}}</span>
    </f7-card-footer>
  </f7-card>
</template>
<script>
const attrs = {
  dataSource: {
    title: 'Data Source',
  },
  fruit: {
    title: 'Fruit',
  },
  season: {
    title: 'Season',
  },
};

import dataSource from './data.js';
const ebDashboardWidgetBase = Vue.prototype.$meta.module.get('a-dashboard').options.components.ebDashboardWidgetBase;
export default {
  meta: {
    global: false,
    widget: {
      attrs,
    },
  },
  mixins: [ebDashboardWidgetBase],
  data() {
    return {
      dataSource,
      fruit: 'All',
      season: 'Spring',
    };
  },
  methods: {
    getAmount() {
      return this.dataSource.dataset.reduce((total, row) => {
        return total + row[2];
      }, 0);
    },
    onClickFruit(fruit) {
      this.fruit = fruit;
    },
    onClickSeason(season) {
      this.season = season;
    },
  },
};

</script>
<style lang="less" scoped>
.data-table {

  th,
  td {
    padding: 0 6px;
  }

  th {
    .link.selected {
      font-size: larger;
    }
  }
}

</style>
