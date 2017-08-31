<template>
  <f7-page>
    <f7-navbar title="Dynamic Route" back-link="Back" sliding></f7-navbar>
    <f7-block inner>
      <ul>
        <li><b>Url:</b> {{$route.url}}</li>
        <li><b>Path:</b> {{$route.path}}</li>
        <li><b>Hash:</b> {{$route.hash}}</li>
        <li><b>Params:</b>
          <ul>
            <li v-for="(value, key) in $route.params"><b>{{key}}:</b> {{value}}</li>
          </ul>
        </li>
        <li><b>Query:</b>
          <ul>
            <li v-for="(value, key) in $route.query"><b>{{key}}:</b> {{value}}</li>
          </ul>
        </li>
        <li><b>Route:</b> {{$route.route.path}}</li>
      </ul>
    </f7-block>
    <f7-block inner>
      <f7-link @click="$route.view.router.back()">Go back via Router API</f7-link>
    </f7-block>

  </f7-page>
</template>

<script>
export default {}
</script>