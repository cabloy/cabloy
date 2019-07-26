<template>
  <eb-page>
    <eb-navbar :title="$text('Form / Schema / Validation')" eb-back-link="Back"></eb-navbar>
    <eb-list no-hairlines-md>
      <eb-list-item :title="$text('Form (Simple)')" link="#" eb-href="kitchen-sink/form-schema-validation/form"></eb-list-item>
      <eb-list-item :title="$text('Form / Schema (Auto) / Validation')" link="#" eb-href="kitchen-sink/form-schema-validation/formSchemaAuto"></eb-list-item>
      <eb-list-item :title="$text('Form / Schema (Custom) / Validation')" link="#" eb-href="kitchen-sink/form-schema-validation/formSchemaCustom"></eb-list-item>
    </eb-list>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {},
};

</script>
