<template>
  <f7-page>
    <f7-navbar title="Form" back-link="Back" sliding></f7-navbar>
    <f7-block-title>Form</f7-block-title>
    <f7-list form>
      <f7-list-item>
        <f7-label>Name</f7-label>
        <f7-input type="text" placeholder="Name"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>Password</f7-label>
        <f7-input type="password" placeholder="Password"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>E-mail</f7-label>
        <f7-input type="email" placeholder="E-mail"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>URL</f7-label>
        <f7-input type="url" placeholder="URL"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>Phone</f7-label>
        <f7-input type="tel" placeholder="Phone"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>Birth date</f7-label>
        <f7-input type="date" placeholder="Birth date" value="2014-04-30"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>Date time</f7-label>
        <f7-input type="datetime-local"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>Gender</f7-label>
        <f7-input type="select">
          <option value="1">Male</option>
          <option value="1">Female</option>
        </f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>Switch</f7-label>
        <f7-input type="switch"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>Range</f7-label>
        <f7-input type="range" min="0" max="100" step="1" value="90"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>Textarea</f7-label>
        <f7-input type="textarea" placeholder="Textarea"></f7-input>
      </f7-list-item>
    </f7-list>

    <f7-block-title>Form With Floating Labels</f7-block-title>
    <f7-list form>
      <f7-list-item>
        <f7-label floating>Name</f7-label>
        <f7-input type="text" placeholder="Name"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label floating>Password</f7-label>
        <f7-input type="password" placeholder="Password"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label floating>E-mail</f7-label>
        <f7-input type="email" placeholder="E-mail"></f7-input>
      </f7-list-item>
    </f7-list>

    <f7-block-title>Form Without Labels</f7-block-title>
    <f7-list form>
      <f7-list-item>
        <f7-input type="text" placeholder="Name"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-input type="password" placeholder="Password"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-input type="email" placeholder="E-mail"></f7-input>
      </f7-list-item>
    </f7-list>

    <f7-block-title>Checkboxes</f7-block-title>
    <f7-list form>
      <f7-list-item v-for="n in 3" checkbox name="my-checkbox" :value="n" :title="'Checkbox ' + n"></f7-list-item>
    </f7-list>

    <f7-block-title>Radios</f7-block-title>
    <f7-list form>
      <f7-list-item v-for="n in 3" radio name="my-radio" :checked="n === 1" :value="n" :title="'Radio ' + n"></f7-list-item>
    </f7-list>

    <f7-block-title>Buttons</f7-block-title>
    <f7-block inner>
      <p><f7-button>Button</f7-button></p>
      <p><f7-button round>Button Round</f7-button></p>
      <p><f7-button fill>Button Fill</f7-button></p>
      <p>
        <f7-buttons>
          <f7-button round active>Button 1</f7-button>
          <f7-button round>Button 2</f7-button>
          <f7-button round>Button 3</f7-button>
        </f7-buttons>
      </p>
      <p>
        <f7-buttons color="orange">
          <f7-button round big>Button 1</f7-button>
          <f7-button round big active>Button 2</f7-button>
          <f7-button round big>Button 3</f7-button>
        </f7-buttons>
      </p>
      <p>
        <f7-grid>
          <f7-col><f7-button big fill color="green">Send</f7-button></f7-col>
          <f7-col><f7-button big fill color="red">Delete</f7-button></f7-col>
        </f7-grid>
      </p>
      <p>
        <f7-grid>
          <f7-col><f7-button fill raised color="green">Raised</f7-button></f7-col>
          <f7-col><f7-button raised color="red">Raised</f7-button></f7-col>
          <f7-col><f7-button fill raised color="pink">Raised</f7-button></f7-col>
        </f7-grid>
      </p>
    </f7-block>
  </f7-page>
</template>

<script>
export default {}
</script>