import type { IComponentOptions } from 'zova';
import type {
  ControllerFormField,
  IFormFieldComponentOptions,
  IFormFieldRenderContextPropsBucket,
} from 'zova-module-a-form';
import type { IResourceFormFieldOptionsBase } from 'zova-module-a-openapi';

import { Highlight } from '@tiptap/extension-highlight';
import { Image } from '@tiptap/extension-image';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import { TableKit } from '@tiptap/extension-table';
import { Markdown } from '@tiptap/markdown';
import StarterKit from '@tiptap/starter-kit';
import { Editor } from '@tiptap/vue-3';
import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'commerce-catalog:formFieldMarkdown'?: IResourceFormFieldMarkdownOptions;
  }
}

export interface IResourceFormFieldMarkdownOptions extends IResourceFormFieldOptionsBase {}

export interface ControllerFormFieldMarkdownProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldMarkdownOptions;
}

@Controller()
export class ControllerFormFieldMarkdown extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  editor?: Editor;
  value = '';
  readonly = false;
  private _syncing = false;
  private _setValue?: (value: string, disableNotifyChanged?: boolean) => void;
  private _handleBlur?: () => void;

  protected async __init__() {
    this.$controllerMounted(() => {
      this.editor = new Editor({
        extensions: [
          Markdown,
          StarterKit,
          TaskList,
          TaskItem.configure({ nested: true }),
          Image,
          TableKit,
          Highlight,
        ],
        content: this.value,
        contentType: 'markdown',
        editable: !this.readonly,
        editorProps: {
          attributes: {
            class: 'min-h-96 p-4 outline-none',
          },
        },
        onUpdate: ({ editor }) => {
          if (this._syncing) return;
          this._setValue?.(editor.getMarkdown());
        },
        onBlur: () => {
          this._handleBlur?.();
        },
      });
      this.$watch(
        () => this.value,
        value => {
          if (!this.editor || this.editor.getMarkdown() === value) return;
          this._syncing = true;
          this.editor.commands.setContent(value, { contentType: 'markdown' });
          this._syncing = false;
        },
      );
      this.$watch(
        () => this.readonly,
        readonly => {
          this.editor?.setEditable(!readonly);
        },
      );
    });
  }

  protected __dispose__() {
    this.editor?.destroy();
  }

  public bindFormField(
    propsBucket: IFormFieldRenderContextPropsBucket,
    formField: ControllerFormField,
  ) {
    const value = propsBucket.value ?? '';
    const readonly = propsBucket.readonly ?? false;
    if (this.value !== value) this.value = value;
    if (this.readonly !== readonly) this.readonly = readonly;
    if (this._setValue && this._handleBlur) return;
    this._setValue = (value, disableNotifyChanged) => {
      if (this.readonly) return;
      formField.setValue(value, disableNotifyChanged);
    };
    this._handleBlur = () => {
      if (this.readonly) return;
      formField.handleBlur();
    };
  }
}
