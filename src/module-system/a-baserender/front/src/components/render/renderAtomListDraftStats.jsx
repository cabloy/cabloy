// export
export default {
  installFactory,
};

// installFactory
function installFactory(_Vue) {
  const Vue = _Vue;
  const ebAtomButtonBase = Vue.prototype.$meta.module.get('a-basefront').options.mixins.ebAtomButtonBase;
  return {
    mixins: [ebAtomButtonBase],
    data() {
      return {
        stats: {
          drafts: 0,
        },
      };
    },
    computed: {
      nameSub() {
        const atomClass = this.layoutManager.container.atomClass;
        return `${atomClass.module}_${atomClass.atomClassName}`;
      },
    },
    created() {
      // this.button.hide();
    },
    methods: {
      onStatsChange(event) {
        this.stats.drafts = event;
      },
    },
    render() {
      return (
        <eb-link
          class={this.buttonClass}
          iconMaterial={this.buttonIcon && this.buttonIcon.material}
          iconF7={this.buttonIcon && this.buttonIcon.f7}
          iconSize={this.buttonIconSize}
          text={this.buttonLabel}
          tooltip={this.buttonTooltip}
          propsOnPerform={event => this.onPerformClick(event)}
          badgeColor="orange"
          iconBadge={this.stats.drafts}
          stats_params={{ module: 'a-base', name: 'drafts', nameSub: this.nameSub }}
          onStats_change={event => this.onStatsChange(event)}
        ></eb-link>
      );
    },
  };
}
