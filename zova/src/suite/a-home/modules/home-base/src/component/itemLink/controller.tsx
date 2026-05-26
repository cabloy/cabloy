import { RouterLink } from '@cabloy/vue-router';
import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { IIconRecord, ZIcon } from 'zova-module-a-icon';

export interface ControllerItemLinkProps {
  title: string;
  description?: string;
  icon?: keyof IIconRecord;
  href?: string;
  to?: string | object;
}

@Controller()
export class ControllerItemLink extends BeanControllerBase {
  static $propsDefault = {
    description: '',
    icon: '',
  };

  _renderLink() {
    const domContent = [
      <ZIcon name={this.$props.icon} width={24}></ZIcon>,
      <div>
        <div>{this.$props.title}</div>
        {this.$props.description && <div class="text-gray-400">{this.$props.description}</div>}
      </div>,
    ];
    if (this.$props.href) {
      return (
        <a href={this.$props.href} target="_blank">
          {domContent}
        </a>
      );
    }
    if (!this.$props.to) {
      return <a href="#">{domContent}</a>;
    }
    return <RouterLink to={this.$props.to}>{domContent}</RouterLink>;
  }

  protected render() {
    return this._renderLink();
  }
}
