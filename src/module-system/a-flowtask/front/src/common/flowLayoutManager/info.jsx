export default {
  data() {
    return {
    };
  },
  methods: {
    async info_onPerformFlowChart() {
      // flowChartProcess
      const flowChartProcess = await this.$api.post('/a/flowchart/flowDef/flowChartProcess', {
        host: {
          flowId: this.container.flowId,
        },
      });


      const { parcel, validate } = this.context;
      const url = '/a/flowchart/flowDef/contentEdit';
      this.$view.navigate(url, {
        target: undefined,
        context: {
          params: {
            ctx: this,
            item: parcel.data,
            readOnly: true,
          },
          callback: (code, res) => {
            if (code === 200) {
              this.context.setValue(res.content);
            }
          },
        },
      });
    },
    info_getItemMetaMedia(avatar) {
      const media = avatar || this.$meta.config.modules['a-base'].user.avatar.default;
      return this.$meta.util.combineImageUrl(media, 16);
    },
    info_renderActionsLeft() {
      if (!this.base_ready) return;
      const atom = this.base.data.atom;
      const children = [];
      if (!atom) {
        children.push(
          <f7-badge color="gray">{this.$text('Outdated')}</f7-badge>
        );
      } else {
        // comment
        if (this.base.config.render.item.info.comment) {
          children.push(
            <eb-link key="actionsLeft:comment" iconMaterial="comment" iconBadge={atom.commentCount} eb-href={`/a/basefront/comment/list?atomId=${atom.id}`}></eb-link>
          );
        }
        // attachment
        if (this.base.config.render.item.info.attachment) {
          children.push(
            <eb-link key="actionsLeft:attachment" iconMaterial="attachment" iconBadge={atom.attachmentCount} eb-href={`/a/basefront/attachment/list?atomId=${atom.id}`}></eb-link>
          );
        }
        // flowChart
        children.push(
          <eb-link key="actionsLeft:flowChart" iconMaterial="account_tree" propsOnPerform={this.info_onPerformFlowChart}></eb-link>
        );
      }
      // ok
      return children;
    },
    info_renderAvatar() {
      const flow = this.base.data.flow;
      const children = [];
      children.push(
        <img key="avatar:one"
          class="avatar avatar16"
          src={this.info_getItemMetaMedia(flow.avatar)}
          title={flow.userName}
        />
      );
      return (
        <div key="avatar" class="info-avatar">
          {children}
        </div>
      );
    },
    info_renderDate() {
      const flow = this.base.data.flow;
      const children = [];
      const dateCreated = this.$meta.util.formatDateTime(flow.createdAt);
      const dateEnd = this.$meta.util.formatDateTime(flow.timeEnd);
      let small = false;
      if (flow.timeEnd) {
        small = true;
        children.push(
          <div key="date:one">{dateCreated}</div>
        );
      }
      if (small) {
        children.push(
          <div key="date:two">{dateEnd}</div>
        );
      } else {
        children.push(
          <div key="date:one2">{this.$meta.util.formatDate(flow.createdAt)}</div>
        );
        children.push(
          <div key="date:two2">{this.$meta.util.formatTime(flow.createdAt)}</div>
        );
      }
      return (
        <div key="date" class='info-date'>
          {children}
        </div>
      );
    },
    info_renderActionsRight() {
      if (!this.base_ready) return;
      const children = [];
      // avatar
      children.push(this.info_renderAvatar());
      // date
      children.push(this.info_renderDate());
      // ok
      return children;
    },
    info_renderFlowStatus() {
      if (!this.base_ready) return null;
      const flow = this.base.data.flow;
      const children = [];
      // flowStatus
      if (flow.flowStatus === 1) {
        const endText = `${flow.flowRemarkLocale || this.$text('End')}`;
        children.push(
          <f7-badge class="eb-flowStatus" key="flowStatus" color="teal">{endText}</f7-badge>
        );
      } else {
        const currentText = `${this.$text('Current')}: ${flow.flowNodeNameCurrentLocale}`;
        children.push(
          <f7-badge class="eb-flowStatus" key="flowStatus" color="orange">{currentText}</f7-badge>
        );
      }
      //
      return children;
    },
  },
};
