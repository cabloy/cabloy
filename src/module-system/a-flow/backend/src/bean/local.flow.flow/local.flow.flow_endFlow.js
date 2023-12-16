const moduleInfo = module.info;
module.exports = class FlowInstance {
  async _endFlow(options) {
    options = options || {};
    const flowHandleStatus = options.flowHandleStatus || 1;
    const flowRemark = options.flowRemark || null;
    const flowId = this.context._flowId;
    const flowStatus = this.constant.flow.status.end;
    const timeEnd = new Date();
    // check if end
    if (this.context._flow.flowStatus === flowStatus) {
      this.ctx.throw.module(moduleInfo.relativeName, 1008, flowId);
    }
    // handle atom
    await this._endFlow_handleAtom(options);
    // tail
    this.ctx.tail(async () => {
      // need not in transaction
      // flow: update fields for onFlowEnd
      this.context._flow.flowStatus = flowStatus;
      this.context._flow.flowHandleStatus = flowHandleStatus;
      this.context._flow.flowRemark = flowRemark;
      this.context._flow.timeEnd = timeEnd;
      await this.modelFlow.delete({ id: flowId });
      // flow history
      this.context._flowHistory.flowStatus = flowStatus;
      this.context._flowHistory.flowHandleStatus = flowHandleStatus;
      this.context._flowHistory.flowRemark = flowRemark;
      this.context._flowHistory.timeEnd = timeEnd;
      await this.modelFlowHistory.update(this.context._flowHistory);
      // raise event: onFlowEnd
      await this._flowListener.onFlowEnd(options);
      // clear nodes
      await this._clearNodeRemains();
      // publish uniform message
      await this._endFlowPublish();
      // log
      const debug = this.ctx.app.bean.debug.get('flow');
      debug('flow end: flowId:%d', flowId);
    });
    // notify
    if (this.context._flow.flowAtomId) {
      this._notifyFlowInitiateds(this.context._flow.flowUserId);
    }
  }

  async _endFlow_handleAtom(options) {
    if (!options.atom) return;
    const atomId = this.context._flow.flowAtomId;
    if (!atomId) return;
    if (options.atom.submit) {
      // submit: _submitDirect
      const item = this.context._atom;
      const atomClass = {
        id: item.atomClassId,
        module: item.module,
        atomClassName: item.atomClassName,
      };
      await this.ctx.bean.atom._submitDirect({
        atomClass,
        key: { atomId, itemId: item.itemId },
        item,
        user: { id: this.context._atom.userIdUpdated },
      });
    } else if (options.atom.close) {
      // close draft/formal
      const atomStage = this.context._atom.atomStage;
      if (atomStage === 0) {
        await this.ctx.bean.atom.closeDraft({
          key: { atomId },
        });
      } else if (atomStage === 1) {
        await this.ctx.bean.atom.closeFormal({
          key: { atomId },
        });
      }
    }
  }

  async _clearNodeRemains() {
    const flowId = this.context._flowId;
    const flowNodes = await this.modelFlowNode.select({
      where: { flowId },
    });
    for (const flowNode of flowNodes) {
      const flowNodeInstance = await this._loadNodeInstance({ flowNode });
      await flowNodeInstance.clear({ flowNodeHandleStatus: 0 });
    }
  }

  async _endFlowPublish() {
    // publish uniform message
    const userOp = this._getOpUser();
    const flowUserId = this.context._flow.flowUserId;
    await this._publishMessageFlowEnd({ flowUserId, user: userOp });
  }
};
