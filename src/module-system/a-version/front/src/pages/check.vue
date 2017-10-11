<template>
  <f7-page>
    <f7-navbar title="Version Check" back-link="Back" sliding></f7-navbar>
    <f7-block inner>
      <h2>{{$text('Version Check Result')}}</h2>
      <div v-if="module">
        <table>
          <thead>
            <tr>
              <td>Name</td>
              <td>Version</td>
              <td>Result</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{module.info.relativeName}}</td>
              <td>{{module.pkg.version}}</td>
              <td>{{module.__check.message}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="modules">
        <table>
          <thead>
            <tr>
              <td>Name</td>
              <td>Version</td>
              <td>Result</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="module of modules">
              <td>{{module.info.relativeName}}</td>
              <td>{{module.pkg.version}}</td>
              <td>Ready</td>
            </tr>
          </tbody>
        </table>
      </div>
    </f7-block>
  </f7-page>
</template>
<script>
import components from './mock.js';
export default {
  components,
  data() {
    return {
      module: null,
      modules: null,
    };
  },
  created() {
    this.$api.get('version/result').then(data => {
      this.module = data.module;
      this.modules = data.modules;
    });
  },
};

</script>
<style>


</style>
