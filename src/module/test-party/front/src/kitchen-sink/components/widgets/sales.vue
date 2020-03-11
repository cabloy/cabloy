<template>
  <f7-card>
    <f7-card-header>{{$text('Fruit Sales')}}</f7-card-header>
    <f7-card-content>
      <div class="data-table">
        <table>
          <thead>
            <tr>
              <th class="label-cell"></th>
              <th v-for="(col,index) of data.cols" :key="index" class="numeric-cell">
                <f7-link @click="onClickFruit(col)">{{col}}</f7-link>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row,index) of data.rows" :key="index">
              <th class="label-cell">
                <f7-link @click="onClickSeason(row)">{{row}}</f7-link>
              </th>
              <td v-for="(col,colIndex) of data.cols" :key="colIndex" class="numeric-cell">{{data.dataset[index][colIndex]}}</td>
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
import data from './data.js';
export default {
  meta: {
    global: false,
  },
  data() {
    return {
      data,
    };
  },
  methods: {
    getAmount() {
      return this.data.dataset.reduce((total, row) => {
        return total + row[2];
      }, 0);
    },
    onClickFruit(fruit) {},
    onClickSeason(season) {},
  },
};

</script>
<style lang="less" scoped>
.data-table {

  th,
  td {
    padding: 0 6px;
  }
}

</style>
