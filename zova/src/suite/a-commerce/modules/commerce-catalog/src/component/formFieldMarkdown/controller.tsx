import type { IComponentOptions } from 'zova';
import type { IFormFieldComponentOptions } from 'zova-module-a-form';
import type { IResourceFormFieldOptionsBase } from 'zova-module-a-openapi';

import { Highlight } from '@tiptap/extension-highlight';
import { Image } from '@tiptap/extension-image';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import { TableKit } from '@tiptap/extension-table';
import { Markdown } from '@tiptap/markdown';
import StarterKit from '@tiptap/starter-kit';
import { Editor, EditorContent } from '@tiptap/vue-3';
import { BeanControllerBase, ClientOnly } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZFormField } from 'zova-module-a-form';

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

  protected render() {
    const propsFormField = this.$props as ControllerFormFieldMarkdownProps;
    return (
      <ZFormField
        {...propsFormField}
        slotDefault={({ propsBucket, props }, $$formField) => {
          this.value = propsBucket.value ?? '';
          this.readonly = propsBucket.readonly ?? false;
          this._setValue = (value, disableNotifyChanged) => {
            $$formField.setValue(value, disableNotifyChanged);
          };
          this._handleBlur = () => {
            $$formField.handleBlur();
          };
          return (
            <div class={props.class}>
              <div
                class={[
                  'rounded-box border border-base-300 bg-base-100 p-4',
                  !$$formField.field.state.meta.isValid && 'border-error',
                ]}
              >
                <ClientOnly>
                  <EditorContent editor={this.editor} class="prose min-h-96 max-w-none" />
                </ClientOnly>
              </div>
            </div>
          );
        }}
      ></ZFormField>
    );
  }
}
