<template>
  <eb-page>
    <eb-navbar :title="$text('Buttons')" eb-back-link="Back"></eb-navbar>
    <f7-block-title>Usual Buttons</f7-block-title>
    <f7-block>
      <f7-row>
        <f7-col>
          <f7-button>Button</f7-button>
        </f7-col>
        <f7-col>
          <f7-button>Button</f7-button>
        </f7-col>
        <f7-col>
          <f7-button round>Round</f7-button>
        </f7-col>
      </f7-row>
    </f7-block>
    <f7-block-title>Fill Buttons</f7-block-title>
    <f7-block>
      <f7-row>
        <f7-col>
          <f7-button fill>Button</f7-button>
        </f7-col>
        <f7-col>
          <f7-button fill>Button</f7-button>
        </f7-col>
        <f7-col>
          <f7-button fill round>Round</f7-button>
        </f7-col>
      </f7-row>
    </f7-block>
    <f7-block-title>Outline Buttons</f7-block-title>
    <f7-block>
      <f7-row>
        <f7-col>
          <f7-button outline>Button</f7-button>
        </f7-col>
        <f7-col>
          <f7-button outline>Button</f7-button>
        </f7-col>
        <f7-col>
          <f7-button outline round>Round</f7-button>
        </f7-col>
      </f7-row>
    </f7-block>
    <f7-block-title>Raised Buttons</f7-block-title>
    <f7-block>
      <f7-row tag="p">
        <f7-col tag="span">
          <f7-button raised>Button</f7-button>
        </f7-col>
        <f7-col tag="span">
          <f7-button raised fill>Fill</f7-button>
        </f7-col>
        <f7-col tag="span">
          <f7-button raised outline>Outline</f7-button>
        </f7-col>
      </f7-row>
      <f7-row tag="p">
        <f7-col tag="span">
          <f7-button raised round>Round</f7-button>
        </f7-col>
        <f7-col tag="span">
          <f7-button raised fill round>Fill</f7-button>
        </f7-col>
        <f7-col tag="span">
          <f7-button raised outline round>Outline</f7-button>
        </f7-col>
      </f7-row>
    </f7-block>
    <f7-block-title>Segmented</f7-block-title>
    <f7-block>
      <f7-segmented raised tag="p">
        <f7-button>Button</f7-button>
        <f7-button>Button</f7-button>
        <f7-button active>Active</f7-button>
      </f7-segmented>
      <f7-segmented raised tag="p">
        <f7-button outline>Outline</f7-button>
        <f7-button outline>Outline</f7-button>
        <f7-button outline active>Active</f7-button>
      </f7-segmented>
      <f7-segmented raised round tag="p">
        <f7-button round>Button</f7-button>
        <f7-button round>Button</f7-button>
        <f7-button round active>Active</f7-button>
      </f7-segmented>
      <f7-segmented raised round tag="p">
        <f7-button round outline>Outline</f7-button>
        <f7-button round outline>Outline</f7-button>
        <f7-button round outline active>Active</f7-button>
      </f7-segmented>
    </f7-block>
    <f7-block-title>Large Buttons</f7-block-title>
    <f7-block>
      <f7-row tag="p">
        <f7-col tag="span">
          <f7-button large>Button</f7-button>
        </f7-col>
        <f7-col tag="span">
          <f7-button large fill>Fill</f7-button>
        </f7-col>
      </f7-row>
      <f7-row tag="p">
        <f7-col tag="span">
          <f7-button large raised>Raised</f7-button>
        </f7-col>
        <f7-col tag="span">
          <f7-button large raised fill>Raised Fill</f7-button>
        </f7-col>
      </f7-row>
    </f7-block>
    <f7-block-title>Small Buttons</f7-block-title>
    <f7-block>
      <f7-row tag="p">
        <f7-col tag="span">
          <f7-button large small>Button</f7-button>
        </f7-col>
        <f7-col tag="span">
          <f7-button large small outline>Outline</f7-button>
        </f7-col>
        <f7-col tag="span">
          <f7-button large small fill>Fill</f7-button>
        </f7-col>
      </f7-row>
      <f7-row tag="p">
        <f7-col tag="span">
          <f7-button large small round>Button</f7-button>
        </f7-col>
        <f7-col tag="span">
          <f7-button large small outline round>Outline</f7-button>
        </f7-col>
        <f7-col tag="span">
          <f7-button large small fill round>Fill</f7-button>
        </f7-col>
      </f7-row>
    </f7-block>
    <f7-block-title>Color Buttons</f7-block-title>
    <f7-block>
      <f7-row>
        <f7-col>
          <f7-button color="red">Red</f7-button>
        </f7-col>
        <f7-col>
          <f7-button color="green">Green</f7-button>
        </f7-col>
        <f7-col>
          <f7-button color="blue">Blue</f7-button>
        </f7-col>
      </f7-row>
    </f7-block>
    <f7-block-title>Color Fill Buttons</f7-block-title>
    <f7-block>
      <f7-row>
        <f7-col>
          <f7-button fill color="red">Red</f7-button>
        </f7-col>
        <f7-col>
          <f7-button fill color="green">Green</f7-button>
        </f7-col>
        <f7-col>
          <f7-button fill color="blue">Blue</f7-button>
        </f7-col>
      </f7-row>
    </f7-block>
    <f7-block-title>List-Block Buttons</f7-block-title>
    <f7-list inset>
      <f7-list-button title="List Button 1"></f7-list-button>
      <f7-list-button title="List Button 2"></f7-list-button>
      <f7-list-button title="List Button 3"></f7-list-button>
    </f7-list>
    <f7-list inset>
      <f7-list-button title="Large Red Button" color="red"></f7-list-button>
    </f7-list>
  </eb-page>
</template>
<script>
export default {};

</script>
