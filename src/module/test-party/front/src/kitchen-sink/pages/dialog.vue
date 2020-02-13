<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Dialog')" eb-back-link="Back"></eb-navbar>
    <f7-block strong>
      <p>There are 1:1 replacements of native Alert, Prompt and Confirm modals. They support callbacks, have very easy api and can be combined with each other. Check these examples:</p>
      <f7-row tag="p">
        <eb-button fill class="col" :onPerform="openAlert">Alert</eb-button>
        <eb-button fill class="col" :onPerform="openConfirm">Confirm</eb-button>
        <f7-button fill class="col" @click="openPrompt">Prompt</f7-button>
      </f7-row>
    </f7-block>
    <f7-block-title>Vertical Buttons</f7-block-title>
    <f7-block strong>
      <p>
        <f7-button fill @click="openVerticalButtons">Vertical Buttons</f7-button>
      </p>
    </f7-block>
    <f7-block-title>Preloader Dialog</f7-block-title>
    <f7-block strong>
      <f7-row tag="p">
        <f7-button fill class="col" @click="openPreloader">Preloader</f7-button>
        <f7-button fill class="col" @click="openCustomPreloader">Custom Text</f7-button>
      </f7-row>
    </f7-block>
    <f7-block-title>Progress Dialog</f7-block-title>
    <f7-block strong>
      <f7-row tag="p">
        <f7-button fill class="col" @click="openInfiniteProgress">Infinite</f7-button>
        <f7-button fill class="col" @click="openDeterminedProgress">Determined</f7-button>
      </f7-row>
    </f7-block>
    <f7-block-title>Dialogs Stack</f7-block-title>
    <f7-block strong>
      <p>This feature doesn't allow to open multiple dialogs at the same time, and will automatically open next dialog when you close the current one. Such behavior is similar to browser native dialogs: </p>
      <p>
        <f7-button fill @click="openAlerts">Open Multiple Alerts</f7-button>
      </p>
    </f7-block>
  </eb-page>
</template>
<script>
export default {
  methods: {
    openAlert() {
      return this.$view.dialog.alert('Hello!');
    },
    openConfirm() {
      return this.$view.dialog.confirm('Are you feel good today?').then(() => {
        this.$view.dialog.alert('Great!');
      });
    },
    openPrompt() {
      return this.$view.dialog.prompt('What is your name?').then(name => {
        return this.$view.dialog.confirm(`Are you sure that your name is ${name}?`).then(() => {
          this.$view.dialog.alert(`Ok, your name is ${name}`);
        });
      }).catch(() => {});
    },
    openAlerts() {
      this.$view.dialog.alert('Alert 1');
      this.$view.dialog.alert('Alert 2');
      this.$view.dialog.alert('Alert 3');
      this.$view.dialog.alert('Alert 4');
      this.$view.dialog.alert('Alert 5');
    },
    openVerticalButtons() {
      this.$view.dialog.create({
        title: 'Vertical Buttons',
        buttons: [{
            text: 'Button 1',
          },
          {
            text: 'Button 2',
          },
          {
            text: 'Button 3',
          },
        ],
        verticalButtons: true,
      }).open();
    },
    openPreloader() {
      this.$view.dialog.preloader();
      setTimeout(() => {
        this.$view.dialog.close();
      }, 3000);
    },
    openCustomPreloader() {
      this.$view.dialog.preloader('My text...');
      setTimeout(() => {
        this.$view.dialog.close();
      }, 3000);
    },
    openInfiniteProgress() {
      this.$view.dialog.progress();
      setTimeout(() => {
        this.$view.dialog.close();
      }, 3000);
    },
    openDeterminedProgress() {
      let progress = 0;
      const dialog = this.$view.dialog.progress('Loading assets', progress);
      dialog.setText('Image 1 of 10');
      const interval = setInterval(() => {
        progress += 10;
        dialog.setProgress(progress);
        dialog.setText(`Image ${(progress) / 10} of 10`);
        if (progress === 100) {
          clearInterval(interval);
          dialog.close();
        }
      }, 300);
    },
  },
};

</script>
