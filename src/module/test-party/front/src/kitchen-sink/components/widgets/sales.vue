<template>
  <f7-card>
    <f7-card-header>Fruit Sales</f7-card-header>
    <f7-card-content>
      <div class="data-table">
        <table>
          <thead>
            <tr>
              <th class="label-cell"></th>
              <th v-for="(col,index) of data.cols" :key="index" class="numeric-cell">{{col}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row,index) of data.rows" :key="index">
              <th class="label-cell">{{row}}</th>
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
    }
  },
};

</script>
<style scoped>
</style>
