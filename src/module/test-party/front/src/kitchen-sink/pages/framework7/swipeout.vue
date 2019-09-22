<template>
  <eb-page @page:beforeremove="onPageBeforeRemove" @page:init="onPageInit">
    <eb-navbar :title="$text('Swipeout')" eb-back-link="Back"></eb-navbar>
    <f7-block>
      <p>
        Swipe out actions on list elements is one of the most awesome F7 features. It allows you to call hidden menu for each list element where you can put default ready-to use delete button or any other buttons for some required actions.
      </p>
    </f7-block>
    <f7-block-title>Swipe to delete with confirm modal</f7-block-title>
    <f7-list>
      <f7-list-item swipeout title="Swipe left on me please">
        <f7-icon slot="media" icon="icon-f7"></f7-icon>
        <eb-swipeout-actions right>
          <eb-swipeout-button color="red" :onPerform="onActionDelete" context="Are you sure you want to delete this item?">Delete</eb-swipeout-button>
        </eb-swipeout-actions>
      </f7-list-item>
      <f7-list-item swipeout title="Swipe left on me too">
        <f7-icon slot="media" icon="icon-f7"></f7-icon>
        <eb-swipeout-actions right>
          <eb-swipeout-button color="orange" :onPerform="onActionDelete" context="Are you sure you want to delete this item?">Delete</eb-swipeout-button>
        </eb-swipeout-actions>
      </f7-list-item>
      <f7-list-item title="I am not removable">
        <f7-icon slot="media" icon="icon-f7"></f7-icon>
      </f7-list-item>
    </f7-list>
    <f7-block-title>Swipe for actions</f7-block-title>
    <f7-list>
      <f7-list-item swipeout title="Swipe left on me please">
        <f7-icon slot="media" icon="icon-f7"></f7-icon>
        <eb-swipeout-actions right>
          <eb-swipeout-button :onPerform="more">More</eb-swipeout-button>
          <eb-swipeout-button color="red" :onPerform="onActionDelete" context="Are you sure you want to delete this item?">Delete</eb-swipeout-button>
        </eb-swipeout-actions>
      </f7-list-item>
      <f7-list-item swipeout title="Swipe left on me too">
        <f7-icon slot="media" icon="icon-f7"></f7-icon>
        <eb-swipeout-actions right>
          <eb-swipeout-button :onPerform="more">More</eb-swipeout-button>
          <eb-swipeout-button color="red" :onPerform="onActionDelete" context="Are you sure you want to delete this item?">Delete</eb-swipeout-button>
        </eb-swipeout-actions>
      </f7-list-item>
      <f7-list-item swipeout title="You can't delete me">
        <f7-icon slot="media" icon="icon-f7"></f7-icon>
        <eb-swipeout-actions right>
          <eb-swipeout-button :onPerform="more">More</eb-swipeout-button>
        </eb-swipeout-actions>
      </f7-list-item>
    </f7-list>
    <f7-block-title>With callback on remove</f7-block-title>
    <f7-list>
      <f7-list-item swipeout @swipeout:deleted="onDeleted" title="Swipe left on me please">
        <f7-icon slot="media" icon="icon-f7"></f7-icon>
        <eb-swipeout-actions right>
          <eb-swipeout-button color="red" :onPerform="onActionDelete" context="Are you sure you want to delete this item?">Delete</eb-swipeout-button>
        </eb-swipeout-actions>
      </f7-list-item>
      <f7-list-item swipeout @swipeout:deleted="onDeleted" title="Swipe left on me too">
        <f7-icon slot="media" icon="icon-f7"></f7-icon>
        <eb-swipeout-actions right>
          <eb-swipeout-button color="red" :onPerform="onActionDelete">Delete</eb-swipeout-button>
        </eb-swipeout-actions>
      </f7-list-item>
      <f7-list-item title="I am not removable">
        <f7-icon slot="media" icon="icon-f7"></f7-icon>
      </f7-list-item>
    </f7-list>
    <f7-block-title>With actions on left side (swipe to right)</f7-block-title>
    <f7-list>
      <f7-list-item swipeout title="Swipe right on me please">
        <f7-icon slot="media" icon="icon-f7"></f7-icon>
        <eb-swipeout-actions left>
          <eb-swipeout-button color="green" :onPerform="reply">Reply</eb-swipeout-button>
          <eb-swipeout-button color="blue" :onPerform="forward">Forward</eb-swipeout-button>
        </eb-swipeout-actions>
      </f7-list-item>
      <f7-list-item swipeout title="Swipe right on me too">
        <f7-icon slot="media" icon="icon-f7"></f7-icon>
        <eb-swipeout-actions left>
          <eb-swipeout-button color="green" :onPerform="reply">Reply</eb-swipeout-button>
          <eb-swipeout-button color="blue" :onPerform="forward">Forward</eb-swipeout-button>
        </eb-swipeout-actions>
      </f7-list-item>
    </f7-list>
    <f7-block-title>On both sides with overswipes</f7-block-title>
    <f7-list media-list>
      <f7-list-item swipeout title="Facebook" after="17:14" subtitle="New messages from John Doe" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus.">
        <eb-swipeout-actions left>
          <eb-swipeout-button overswipe color="green" :onPerform="reply">Reply</eb-swipeout-button>
          <eb-swipeout-button color="blue" :onPerform="forward">Forward</eb-swipeout-button>
        </eb-swipeout-actions>
        <eb-swipeout-actions right>
          <eb-swipeout-button :onPerform="more">More</eb-swipeout-button>
          <eb-swipeout-button color="orange" :onPerform="mark">Mark</eb-swipeout-button>
          <eb-swipeout-button color="red" :onPerform="onActionDelete" overswipe>Delete</eb-swipeout-button>
        </eb-swipeout-actions>
      </f7-list-item>
      <f7-list-item swipeout title="John Doe (via Twitter)" after="17:11" subtitle="John Doe (@_johndoe) mentioned you on Twitter!" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus.">
        <eb-swipeout-actions left>
          <eb-swipeout-button overswipe color="green" :onPerform="reply">Reply</eb-swipeout-button>
          <eb-swipeout-button color="blue" :onPerform="forward">Forward</eb-swipeout-button>
        </eb-swipeout-actions>
        <eb-swipeout-actions right>
          <eb-swipeout-button :onPerform="more">More</eb-swipeout-button>
          <eb-swipeout-button color="orange" :onPerform="mark">Mark</eb-swipeout-button>
          <eb-swipeout-button color="red" :onPerform="onActionDelete" overswipe>Delete</eb-swipeout-button>
        </eb-swipeout-actions>
      </f7-list-item>
      <f7-list-item swipeout title="Facebook" after="16:48" subtitle="New messages from John Doe" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus.">
        <eb-swipeout-actions left>
          <eb-swipeout-button overswipe color="green" :onPerform="reply">Reply</eb-swipeout-button>
          <eb-swipeout-button color="blue" :onPerform="forward">Forward</eb-swipeout-button>
        </eb-swipeout-actions>
        <eb-swipeout-actions right>
          <eb-swipeout-button :onPerform="more">More</eb-swipeout-button>
          <eb-swipeout-button color="orange" :onPerform="mark">Mark</eb-swipeout-button>
          <eb-swipeout-button color="red" :onPerform="onActionDelete" overswipe context="Are you sure you want to delete this item?">Delete</eb-swipeout-button>
        </eb-swipeout-actions>
      </f7-list-item>
      <f7-list-item swipeout title="John Doe (via Twitter)" after="15:32" subtitle="John Doe (@_johndoe) mentioned you on Twitter!" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus.">
        <eb-swipeout-actions left>
          <eb-swipeout-button overswipe color="green" :onPerform="reply">Reply</eb-swipeout-button>
          <eb-swipeout-button color="blue" :onPerform="forward">Forward</eb-swipeout-button>
        </eb-swipeout-actions>
        <eb-swipeout-actions right>
          <eb-swipeout-button :onPerform="more">More</eb-swipeout-button>
          <eb-swipeout-button color="orange" :onPerform="mark">Mark</eb-swipeout-button>
          <eb-swipeout-button color="red" :onPerform="onActionDelete" overswipe context="Are you sure you want to delete this item?">Delete</eb-swipeout-button>
        </eb-swipeout-actions>
      </f7-list-item>
    </f7-list>
  </eb-page>
</template>
<script>
export default {
  methods: {
    onActionDelete(event, context) {
      const message = context;
      if (!message) {
        this.$meta.util.swipeoutDelete(event.target);
      } else {
        this.$view.dialog.confirm(message).then(() => {
          this.$meta.util.swipeoutDelete(event.target);
        });
      }
    },
    more() {
      const self = this;
      self.actions.open();
    },
    mark() {
      this.$view.dialog.alert('Mark');
    },
    reply() {
      this.$view.dialog.alert('Reply');
    },
    forward() {
      this.$view.dialog.alert('Forward');
    },
    onDeleted() {
      this.$view.dialog.alert('Thanks, item removed!');
    },
    onPageBeforeRemove() {
      const self = this;
      self.actions.destroy();
    },
    onPageInit() {
      const self = this;
      const app = self.$f7;
      const hostEl = this.$view.getHostEl();
      self.actions = app.actions.create({
        hostEl,
        buttons: [
          [{
            text: 'Here comes some optional description or warning for actions below',
            label: true,
          },
          {
            text: 'Action 1',
          },
          {
            text: 'Action 2',
          },
          ],
          [{
            text: 'Cancel',
            bold: true,
          },],
        ],
      });
    },
  },
};

</script>
