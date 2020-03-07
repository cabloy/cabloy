<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Grid / Layout')" eb-back-link="Back"></eb-navbar>
    <div class="grid-demo">
      <f7-block>
        <p>Columns within a row are automatically set to have equal width. Otherwise you can define your column with pourcentage of screen you want.</p>
      </f7-block>
      <f7-block-title>Columns with gap</f7-block-title>
      <f7-block>
        <f7-row>
          <f7-col>50% (.col)</f7-col>
          <f7-col>50% (.col)</f7-col>
        </f7-row>
        <f7-row>
          <f7-col>25% (.col)</f7-col>
          <f7-col>25% (.col)</f7-col>
          <f7-col>25% (.col)</f7-col>
          <f7-col>25% (.col)</f7-col>
        </f7-row>
        <f7-row>
          <f7-col>33% (.col)</f7-col>
          <f7-col>33% (.col)</f7-col>
          <f7-col>33% (.col)</f7-col>
        </f7-row>
        <f7-row>
          <f7-col>20% (.col)</f7-col>
          <f7-col>20% (.col)</f7-col>
          <f7-col>20% (.col)</f7-col>
          <f7-col>20% (.col)</f7-col>
          <f7-col>20% (.col)</f7-col>
        </f7-row>
        <f7-row>
          <f7-col width="33">33% (.col-33)</f7-col>
          <f7-col width="66">66% (.col-66)</f7-col>
        </f7-row>
        <f7-row>
          <f7-col width="25">25% (.col-25)</f7-col>
          <f7-col width="25">25% (.col-25)</f7-col>
          <f7-col width="50">50% (.col-50)</f7-col>
        </f7-row>
        <f7-row>
          <f7-col width="75">75% (.col-75)</f7-col>
          <f7-col width="25">25% (.col-25)</f7-col>
        </f7-row>
        <f7-row>
          <f7-col width="80">80% (.col-80)</f7-col>
          <f7-col width="20">20% (.col-20)</f7-col>
        </f7-row>
      </f7-block>
      <f7-block-title>No gap between columns</f7-block-title>
      <f7-block>
        <f7-row no-gap>
          <f7-col>50% (.col)</f7-col>
          <f7-col>50% (.col)</f7-col>
        </f7-row>
        <f7-row no-gap>
          <f7-col>25% (.col)</f7-col>
          <f7-col>25% (.col)</f7-col>
          <f7-col>25% (.col)</f7-col>
          <f7-col>25% (.col)</f7-col>
        </f7-row>
        <f7-row no-gap>
          <f7-col>33% (.col)</f7-col>
          <f7-col>33% (.col)</f7-col>
          <f7-col>33% (.col)</f7-col>
        </f7-row>
        <f7-row no-gap>
          <f7-col>20% (.col)</f7-col>
          <f7-col>20% (.col)</f7-col>
          <f7-col>20% (.col)</f7-col>
          <f7-col>20% (.col)</f7-col>
          <f7-col>20% (.col)</f7-col>
        </f7-row>
        <f7-row no-gap>
          <f7-col width="33">33% (.col-33)</f7-col>
          <f7-col width="66">66% (.col-66)</f7-col>
        </f7-row>
        <f7-row no-gap>
          <f7-col width="25">25% (.col-25)</f7-col>
          <f7-col width="25">25% (.col-25)</f7-col>
          <f7-col width="50">50% (.col-50)</f7-col>
        </f7-row>
        <f7-row no-gap>
          <f7-col width="75">75% (.col-75)</f7-col>
          <f7-col width="25">25% (.col-25)</f7-col>
        </f7-row>
        <f7-row no-gap>
          <f7-col width="80">80% (.col-80)</f7-col>
          <f7-col width="20">20% (.col-20)</f7-col>
        </f7-row>
      </f7-block>
      <f7-block-title>Nested</f7-block-title>
      <f7-block>
        <f7-row>
          <f7-col>50% (.col)
            <f7-row>
              <f7-col>50% (.col)</f7-col>
              <f7-col>50% (.col)</f7-col>
            </f7-row>
          </f7-col>
          <f7-col>50% (.col)
            <f7-row>
              <f7-col width="33">33% (.col-33)</f7-col>
              <f7-col width="66">66% (.col-66)</f7-col>
            </f7-row>
          </f7-col>
        </f7-row>
      </f7-block>
      <f7-block-title>Responsive Grid</f7-block-title>
      <f7-block>
        <p>Grid cells have different size on Phone(Small)/Tablet(Medium)</p>
        <f7-row>
          <f7-col width="100" medium="50">.col-100.tablet-50</f7-col>
          <f7-col width="100" medium="50">.col-100.tablet-50</f7-col>
        </f7-row>
        <f7-row>
          <f7-col resizable width="50" medium="25">.col-50.tablet-25</f7-col>
          <f7-col resizable width="50" medium="25">.col-50.tablet-25</f7-col>
          <f7-col resizable width="50" medium="25">.col-50.tablet-25</f7-col>
          <f7-col resizable width="50" medium="25">.col-50.tablet-25</f7-col>
        </f7-row>
        <f7-row>
          <f7-col width="100" medium="40">.col-100.tablet-40</f7-col>
          <f7-col width="50" medium="60">.col-50.tablet-60</f7-col>
          <f7-col width="50" medium="66">.col-50.tablet-66</f7-col>
          <f7-col width="100" medium="33">.col-100.tablet-33</f7-col>
        </f7-row>
      </f7-block>
    </div>
  </eb-page>
</template>
<script>
export default {
  meta: {
    size: 'medium',
  },
};

</script>
