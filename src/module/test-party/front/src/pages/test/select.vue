<template>
  <eb-page>
    <eb-navbar :title="$text('Select')" eb-back-link="Back"></eb-navbar>
    <eb-list form no-hairlines-md @submit.prevent="onFormSubmit">
      <f7-list-item smartSelect :title="$text('Sex')" :smartSelectParams="{openIn: 'page', closeOnSelect: true}">
        <eb-select name="sex" v-model="sex" optionsBlankAuto :multiple="false" :options="sexes"></eb-select>
      </f7-list-item>
    </eb-list>
    <div>{{sex}}</div>
  </eb-page>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      sex: undefined,
      sexes: [
        { title: 'Male', value: 0 },
        { title: 'Female', value: 1 },
      ],
    };
  },
  methods: {
    onFormSubmit(event) {
      console.log(event);
    },
  },
};

</script>
