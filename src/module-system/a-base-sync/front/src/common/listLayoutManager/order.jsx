export default {
  data() {
    return {
      order: {
        selected: null,
      },
    };
  },
  computed: {
    order_default() {
      let atomOrder;
      if (this.container.scene === 'select') {
        atomOrder = {
          name: 'atomName',
          by: 'asc',
          tableAlias: 'a',
        };
      } else if (this.container.options && this.container.options.star) {
        atomOrder = {
          name: 'updatedAt',
          by: 'desc',
          tableAlias: 'd',
        };
      } else if (this.container.options && this.container.options.label) {
        atomOrder = {
          name: 'updatedAt',
          by: 'desc',
          tableAlias: 'e',
        };
      } else {
        // others
        atomOrder = {
          name: 'updatedAt',
          by: 'desc',
          tableAlias: 'a',
        };
      }
      // ok
      return atomOrder;
    },
  },
  methods: {
    order_onPerformPopover(element) {
      const popover = this.$refs.order_popover.$el;
      this.$f7.popover.open(popover, element);
    },
    order_onPerformChange(event, atomOrder) {
      // switch
      const atomOrderCurrent = this.order.selected || this.order_default;
      if (this.order_getKey(atomOrderCurrent) === this.order_getKey(atomOrder)) {
        this.order.selected = {
          name: atomOrderCurrent.name,
          tableAlias: atomOrderCurrent.tableAlias,
          by: atomOrderCurrent.by === 'desc' ? 'asc' : 'desc',
        };
      } else {
        this.order.selected = atomOrder;
      }
      // reload
      this.onPageRefresh();
    },
    order_getKey(atomOrder) {
      return atomOrder ? `${atomOrder.tableAlias || 'f'}.${atomOrder.name}` : null;
    },
    order_getStatus(atomOrder) {
      const atomOrderCurrent = this.order.selected || this.order_default;
      if (this.order_getKey(atomOrderCurrent) === this.order_getKey(atomOrder)) {
        return atomOrderCurrent.by === 'desc' ? 'arrow_drop_down' : 'arrow_drop_up';
      }
      return '';
    },
    order_getList() {
      // base
      const ordersBase = this.configAtomBase.render.list.info.orders;
      // atomClass
      const ordersAtomClass = this.$meta.util.getProperty(this.configAtom, 'render.list.info.orders');
      // atomOrders
      return ordersAtomClass ? ordersBase.concat(ordersAtomClass) : ordersBase;
    },
    order_renderPopover() {
      if (!this.ready) return null;
      // list
      const children = [];
      for (const atomOrder of this.order_getList()) {
        children.push(
          <eb-list-item key={this.order_getKey(atomOrder)} popoverClose link="#" propsOnPerform={event => this.order_onPerformChange(event, atomOrder)}>
            <f7-icon slot="media" material={this.order_getStatus(atomOrder)}></f7-icon>
            <div slot="title">{this.$text(atomOrder.title)}</div>
          </eb-list-item>
        );
      }
      return (
        <eb-popover ref="order_popover" ready={true}>
          <f7-list inset>
            {children}
          </f7-list>
        </eb-popover>
      );
    },
  },
};
