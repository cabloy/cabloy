import type { IComponentOptions } from 'zova';
import type {
  ControllerFormField,
  IFormFieldComponentOptions,
  IFormFieldRenderContextPropsBucket,
} from 'zova-module-a-form';
import type { IResourceFormFieldOptionsBase, IImageSceneRecord } from 'zova-module-a-openapi';
import type { IImageUploaderResult } from 'zova-module-basic-image';

import { findParentNodeClosestToPos } from '@tiptap/core';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { Highlight } from '@tiptap/extension-highlight';
import { Image } from '@tiptap/extension-image';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import { TableKit } from '@tiptap/extension-table';
import { Markdown } from '@tiptap/markdown';
import StarterKit from '@tiptap/starter-kit';
import { Editor } from '@tiptap/vue-3';
import { common, createLowlight } from 'lowlight';
import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';

import { getCodeBlockLanguage, isCodeBlockLanguage } from '../../lib/codeBlockLanguages.js';

const markdownImageScene = 'a-markdown:markdown';
const lowlight = createLowlight(common);

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'basic-markdown:formFieldMarkdown'?: IResourceFormFieldMarkdownOptions;
  }
}

export interface IResourceFormFieldMarkdownOptions extends IResourceFormFieldOptionsBase {
  imageScene?: keyof IImageSceneRecord | string;
}

export interface ControllerFormFieldMarkdownProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldMarkdownOptions;
}

type IMarkdownHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface IMarkdownToolbarState {
  bold: boolean;
  italic: boolean;
  strike: boolean;
  code: boolean;
  highlight: boolean;
  bulletList: boolean;
  orderedList: boolean;
  taskList: boolean;
  blockquote: boolean;
  codeBlock: boolean;
  codeBlockLanguage?: string;
  link: boolean;
  headingLevel: IMarkdownHeadingLevel | undefined;
  canUndo: boolean;
  canRedo: boolean;
  canBold: boolean;
  canItalic: boolean;
  canStrike: boolean;
  canCode: boolean;
  canHighlight: boolean;
  canBulletList: boolean;
  canOrderedList: boolean;
  canTaskList: boolean;
  canBlockquote: boolean;
  canCodeBlock: boolean;
  canLink: boolean;
  canHorizontalRule: boolean;
  canTable: boolean;
  canAddTableRowBefore: boolean;
  canAddTableRowAfter: boolean;
  canDeleteTableRow: boolean;
  canAddTableColumnBefore: boolean;
  canAddTableColumnAfter: boolean;
  canDeleteTableColumn: boolean;
  canDeleteTable: boolean;
}

interface IMarkdownTableToolbarPosition {
  left: number;
  top: number;
}

interface IMarkdownTableDimensions {
  rows: number;
  cols: number;
}

interface IMarkdownSelection {
  from: number;
  to: number;
}

@Controller()
export class ControllerFormFieldMarkdown extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  editor?: Editor;
  value = '';
  readonly = false;
  toolbarState: IMarkdownToolbarState = this._emptyToolbarState();
  tableToolbarPosition?: IMarkdownTableToolbarPosition;
  readonly tablePickerMaxSize = 8;
  tablePickerOpen = false;
  tablePickerPreview: IMarkdownTableDimensions = { rows: 1, cols: 1 };
  tablePickerActive: IMarkdownTableDimensions = { rows: 1, cols: 1 };
  imageScene = markdownImageScene;
  imageUploadError?: string;
  private _imageUploadSelection?: IMarkdownSelection;
  private _syncing = false;
  private _setValue?: (value: string, disableNotifyChanged?: boolean) => void;
  private _handleBlur?: () => void;
  private _tableToolbarHost?: HTMLElement;
  private _tableToolbarFocused = false;
  private _tableToolbarUpdateFrame?: number;
  private _tableToolbarViewportHandler?: () => void;
  private _tablePickerTrigger?: HTMLButtonElement;
  private _tablePickerRoot?: HTMLElement;
  private _tablePickerPointerHandler?: (event: PointerEvent) => void;
  private _tablePickerKeyHandler?: (event: KeyboardEvent) => void;

  private _emptyToolbarState(): IMarkdownToolbarState {
    return {
      bold: false,
      italic: false,
      strike: false,
      code: false,
      highlight: false,
      bulletList: false,
      orderedList: false,
      taskList: false,
      blockquote: false,
      codeBlock: false,
      codeBlockLanguage: undefined,
      link: false,
      headingLevel: undefined,
      canUndo: false,
      canRedo: false,
      canBold: false,
      canItalic: false,
      canStrike: false,
      canCode: false,
      canHighlight: false,
      canBulletList: false,
      canOrderedList: false,
      canTaskList: false,
      canBlockquote: false,
      canCodeBlock: false,
      canLink: false,
      canHorizontalRule: false,
      canTable: false,
      canAddTableRowBefore: false,
      canAddTableRowAfter: false,
      canDeleteTableRow: false,
      canAddTableColumnBefore: false,
      canAddTableColumnAfter: false,
      canDeleteTableColumn: false,
      canDeleteTable: false,
    };
  }

  private _refreshToolbarState() {
    const editor = this.editor;
    if (!editor) {
      this.toolbarState = this._emptyToolbarState();
      this._scheduleTableToolbarPosition();
      return;
    }
    const can = editor.can();
    const heading = editor.getAttributes('heading').level;
    const codeBlockActive = editor.isActive('codeBlock');
    const codeBlockLanguage = editor.getAttributes('codeBlock').language;
    const tableActive = editor.isActive('table');
    this.toolbarState = {
      bold: editor.isActive('bold'),
      italic: editor.isActive('italic'),
      strike: editor.isActive('strike'),
      code: editor.isActive('code'),
      highlight: editor.isActive('highlight'),
      bulletList: editor.isActive('bulletList'),
      orderedList: editor.isActive('orderedList'),
      taskList: editor.isActive('taskList'),
      blockquote: editor.isActive('blockquote'),
      codeBlock: codeBlockActive,
      codeBlockLanguage: codeBlockActive
        ? (getCodeBlockLanguage(codeBlockLanguage) ?? codeBlockLanguage ?? undefined)
        : undefined,
      link: editor.isActive('link'),
      headingLevel:
        heading === 1 ||
        heading === 2 ||
        heading === 3 ||
        heading === 4 ||
        heading === 5 ||
        heading === 6
          ? heading
          : undefined,
      canUndo: can.undo(),
      canRedo: can.redo(),
      canBold: can.toggleBold(),
      canItalic: can.toggleItalic(),
      canStrike: can.toggleStrike(),
      canCode: can.toggleCode(),
      canHighlight: can.toggleHighlight(),
      canBulletList: can.toggleBulletList(),
      canOrderedList: can.toggleOrderedList(),
      canTaskList: can.toggleTaskList(),
      canBlockquote: can.toggleBlockquote(),
      canCodeBlock: can.toggleCodeBlock(),
      canLink:
        editor.isActive('link') ||
        (!editor.state.selection.empty && can.setLink({ href: 'https://example.com' })),
      canHorizontalRule: can.setHorizontalRule(),
      canTable: can.insertTable({ rows: 3, cols: 3, withHeaderRow: true }),
      canAddTableRowBefore: tableActive ? can.addRowBefore() : false,
      canAddTableRowAfter: tableActive ? can.addRowAfter() : false,
      canDeleteTableRow: tableActive ? can.deleteRow() : false,
      canAddTableColumnBefore: tableActive ? can.addColumnBefore() : false,
      canAddTableColumnAfter: tableActive ? can.addColumnAfter() : false,
      canDeleteTableColumn: tableActive ? can.deleteColumn() : false,
      canDeleteTable: tableActive ? can.deleteTable() : false,
    };
    this._scheduleTableToolbarPosition();
  }

  private _runCommand(command: (editor: Editor) => boolean) {
    if (this.readonly || !this.editor) return;
    command(this.editor);
  }

  private _shouldShowTableToolbar() {
    const editor = this.editor;
    return !!(
      editor &&
      !this.readonly &&
      editor.isEditable &&
      editor.isActive('table') &&
      (editor.view.hasFocus() || this._tableToolbarFocused)
    );
  }

  private _setTableToolbarPosition(position?: IMarkdownTableToolbarPosition) {
    if (
      this.tableToolbarPosition?.left === position?.left &&
      this.tableToolbarPosition?.top === position?.top
    ) {
      return;
    }
    this.tableToolbarPosition = position;
  }

  private _scheduleTableToolbarPosition() {
    if (!process.env.CLIENT || this._tableToolbarUpdateFrame !== undefined) return;
    this._tableToolbarUpdateFrame = window.requestAnimationFrame(() => {
      this._tableToolbarUpdateFrame = undefined;
      this._updateTableToolbarPosition();
    });
  }

  private _updateTableToolbarPosition() {
    const editor = this.editor;
    const host = this._tableToolbarHost;
    if (!editor || !host || !this._shouldShowTableToolbar()) {
      this._setTableToolbarPosition();
      return;
    }
    const table = findParentNodeClosestToPos(
      editor.state.selection.$from,
      node => node.type.name === 'table',
    );
    if (!table) {
      this._setTableToolbarPosition();
      return;
    }
    const dom = editor.view.nodeDOM(table.pos);
    if (!(dom instanceof HTMLElement)) {
      this._setTableToolbarPosition();
      return;
    }
    const tableElement = dom.querySelector('table') ?? dom;
    const tableRect = tableElement.getBoundingClientRect();
    const hostRect = host.getBoundingClientRect();
    this._setTableToolbarPosition({
      left: tableRect.left - hostRect.left + tableRect.width / 2,
      top: tableRect.top - hostRect.top - 8,
    });
  }

  public setTableToolbarHost(host: HTMLElement | null) {
    if (this._tableToolbarHost === host) return;
    this._tableToolbarHost = host ?? undefined;
    this._scheduleTableToolbarPosition();
  }

  public setTableToolbarFocused(focused: boolean) {
    this._tableToolbarFocused = focused;
    this._scheduleTableToolbarPosition();
  }

  private _isValidTablePickerDimensions(rows: number, cols: number) {
    return (
      Number.isInteger(rows) &&
      Number.isInteger(cols) &&
      rows >= 1 &&
      rows <= this.tablePickerMaxSize &&
      cols >= 1 &&
      cols <= this.tablePickerMaxSize
    );
  }

  private _setTablePickerActive(rows: number, cols: number, focus = false) {
    if (!this._isValidTablePickerDimensions(rows, cols)) return;
    this.tablePickerActive = { rows, cols };
    this.tablePickerPreview = { rows, cols };
    if (focus && this._tablePickerRoot) {
      const cell = this._tablePickerRoot.querySelector<HTMLButtonElement>(
        `[data-table-picker-cell="${rows}-${cols}"]`,
      );
      cell?.focus();
    }
  }

  public setTablePickerTrigger(trigger: HTMLButtonElement | null) {
    this._tablePickerTrigger = trigger ?? undefined;
  }

  public setTablePickerRoot(root: HTMLElement | null) {
    this._tablePickerRoot = root ?? undefined;
  }

  public openTablePicker() {
    if (this.readonly || !this.toolbarState.canTable) return;
    this.tablePickerOpen = true;
    this._setTablePickerActive(1, 1);
  }

  public closeTablePicker(options: { restoreFocus?: boolean } = {}) {
    if (!this.tablePickerOpen) return;
    this.tablePickerOpen = false;
    this._setTablePickerActive(1, 1);
    if (options.restoreFocus) {
      this._tablePickerTrigger?.focus();
    }
  }

  public toggleTablePicker() {
    if (this.tablePickerOpen) {
      this.closeTablePicker({ restoreFocus: true });
    } else {
      this.openTablePicker();
    }
  }

  public setTablePickerPreview(rows: number, cols: number) {
    this._setTablePickerActive(rows, cols);
  }

  public selectTablePickerSize(rows: number, cols: number) {
    if (
      !this.tablePickerOpen ||
      this.readonly ||
      !this.toolbarState.canTable ||
      !this._isValidTablePickerDimensions(rows, cols)
    ) {
      return;
    }
    this.closeTablePicker();
    this.insertTable(rows, cols);
  }

  public handleTablePickerKeydown(event: KeyboardEvent) {
    if (!this.tablePickerOpen) return;
    const { rows, cols } = this.tablePickerActive;
    let nextRows = rows;
    let nextCols = cols;
    switch (event.key) {
      case 'ArrowUp':
        nextRows = Math.max(1, rows - 1);
        break;
      case 'ArrowDown':
        nextRows = Math.min(this.tablePickerMaxSize, rows + 1);
        break;
      case 'ArrowLeft':
        nextCols = Math.max(1, cols - 1);
        break;
      case 'ArrowRight':
        nextCols = Math.min(this.tablePickerMaxSize, cols + 1);
        break;
      case 'Home':
        nextCols = 1;
        break;
      case 'End':
        nextCols = this.tablePickerMaxSize;
        break;
      case 'Enter':
      case ' ': {
        event.preventDefault();
        this.selectTablePickerSize(rows, cols);
        return;
      }
      case 'Escape':
        event.preventDefault();
        this.closeTablePicker({ restoreFocus: true });
        return;
      case 'Tab':
        this.closeTablePicker();
        return;
      default:
        return;
    }
    event.preventDefault();
    this._setTablePickerActive(nextRows, nextCols, true);
  }

  public undo() {
    this._runCommand(editor => editor.chain().focus().undo().run());
  }

  public redo() {
    this._runCommand(editor => editor.chain().focus().redo().run());
  }

  public setParagraph() {
    this._runCommand(editor => editor.chain().focus().setParagraph().run());
  }

  public setHeading(level: IMarkdownHeadingLevel) {
    this._runCommand(editor => editor.chain().focus().toggleHeading({ level }).run());
  }

  public toggleBold() {
    this._runCommand(editor => editor.chain().focus().toggleBold().run());
  }

  public toggleItalic() {
    this._runCommand(editor => editor.chain().focus().toggleItalic().run());
  }

  public toggleStrike() {
    this._runCommand(editor => editor.chain().focus().toggleStrike().run());
  }

  public toggleCode() {
    this._runCommand(editor => editor.chain().focus().toggleCode().run());
  }

  public async editLink() {
    const editor = this.editor;
    if (this.readonly || !editor) return;
    const selection = editor.state.selection;
    const linkActive = editor.isActive('link');
    const canEditLink = linkActive
      ? editor.can().unsetLink()
      : !selection.empty && editor.can().setLink({ href: 'https://example.com' });
    if (!canEditLink) return;

    const href = editor.getAttributes('link').href ?? '';
    const result = await this.$appModal.prompt({
      icon: ':editor:insert-link-outline',
      title: this.scope.locale.Link(),
      text: this.scope.locale.LinkUrl(),
      defaultValue: href,
    });
    if (this.readonly || this.editor !== editor || result === undefined) return;

    const value = result.trim();
    const chain = editor.chain().focus().setTextSelection({
      from: selection.from,
      to: selection.to,
    });
    if (linkActive) {
      chain.extendMarkRange('link');
    }
    if (!value) {
      if (linkActive) chain.unsetLink().run();
      return;
    }
    chain.setLink({ href: value }).run();
  }

  public toggleHighlight() {
    this._runCommand(editor => editor.chain().focus().toggleHighlight().run());
  }

  public toggleBulletList() {
    this._runCommand(editor => editor.chain().focus().toggleBulletList().run());
  }

  public toggleOrderedList() {
    this._runCommand(editor => editor.chain().focus().toggleOrderedList().run());
  }

  public toggleTaskList() {
    this._runCommand(editor => editor.chain().focus().toggleTaskList().run());
  }

  public toggleBlockquote() {
    this._runCommand(editor => editor.chain().focus().toggleBlockquote().run());
  }

  public toggleCodeBlock() {
    this._runCommand(editor => editor.chain().focus().toggleCodeBlock().run());
  }

  public setCodeBlockLanguage(language?: string) {
    if (language && !isCodeBlockLanguage(language)) return;
    this._runCommand(editor => {
      if (!editor.isActive('codeBlock')) return false;
      return editor
        .chain()
        .focus()
        .updateAttributes('codeBlock', { language: language || null })
        .run();
    });
  }

  public setHorizontalRule() {
    this._runCommand(editor => editor.chain().focus().setHorizontalRule().run());
  }

  public insertTable(rows: number, cols: number) {
    if (!this._isValidTablePickerDimensions(rows, cols)) return;
    this._runCommand(editor =>
      editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run(),
    );
  }

  public addTableRowBefore() {
    this._runCommand(editor => editor.chain().focus().addRowBefore().run());
  }

  public addTableRowAfter() {
    this._runCommand(editor => editor.chain().focus().addRowAfter().run());
  }

  public deleteTableRow() {
    this._runCommand(editor => editor.chain().focus().deleteRow().run());
  }

  public addTableColumnBefore() {
    this._runCommand(editor => editor.chain().focus().addColumnBefore().run());
  }

  public addTableColumnAfter() {
    this._runCommand(editor => editor.chain().focus().addColumnAfter().run());
  }

  public deleteTableColumn() {
    this._runCommand(editor => editor.chain().focus().deleteColumn().run());
  }

  public deleteTable() {
    this._runCommand(editor => editor.chain().focus().deleteTable().run());
  }

  public beginImageUpload(chooseFiles: () => void) {
    const editor = this.editor;
    if (this.readonly || !editor || !editor.isEditable) return;
    this._imageUploadSelection = {
      from: editor.state.selection.from,
      to: editor.state.selection.to,
    };
    this.imageUploadError = undefined;
    chooseFiles();
  }

  public handleImageUploaded(result: IImageUploaderResult) {
    const editor = this.editor;
    const selection = this._imageUploadSelection;
    const src = this._resolveImageUrl(result.url);
    if (!editor || this.readonly || !editor.isEditable || !selection || !src) {
      this.imageUploadError = this.scope.locale.ImageUploadInvalidUrl();
      return;
    }
    const { from, to } = selection;
    if (from < 0 || to < from || to > editor.state.doc.content.size) {
      this.imageUploadError = this.scope.locale.ImageUploadInvalidUrl();
      return;
    }
    const chain = editor.chain().focus().setTextSelection({ from, to });
    if (!chain.setImage({ src, ...(result.filename ? { alt: result.filename } : {}) }).run()) {
      this.imageUploadError = this.scope.locale.ImageUploadFailed();
      return;
    }
    this._imageUploadSelection = undefined;
    this.imageUploadError = undefined;
  }

  public handleImageUploadError(error: Error) {
    this.imageUploadError = error.message || this.scope.locale.ImageUploadFailed();
  }

  private _resolveImageUrl(url: string | undefined) {
    if (!url) return undefined;
    const resolved =
      url.startsWith('/api/') && this.sys.config.api.baseURL
        ? `${this.sys.config.api.baseURL.replace(/\/$/, '')}${url}`
        : url;
    try {
      const parsed = new URL(resolved);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:'
        ? parsed.toString()
        : undefined;
    } catch {
      return undefined;
    }
  }

  protected async __init__() {
    this.$controllerMounted(() => {
      this._tableToolbarViewportHandler = () => {
        if (this._shouldShowTableToolbar()) {
          this._scheduleTableToolbarPosition();
        }
      };
      this._tablePickerPointerHandler = event => {
        const target = event.target;
        if (
          target instanceof Node &&
          (this._tablePickerTrigger?.contains(target) || this._tablePickerRoot?.contains(target))
        ) {
          return;
        }
        this.closeTablePicker();
      };
      this._tablePickerKeyHandler = event => {
        this.handleTablePickerKeydown(event);
      };
      window.addEventListener('resize', this._tableToolbarViewportHandler);
      window.addEventListener('scroll', this._tableToolbarViewportHandler, true);
      document.addEventListener('pointerdown', this._tablePickerPointerHandler);
      document.addEventListener('keydown', this._tablePickerKeyHandler);
      this.editor = new Editor({
        extensions: [
          Markdown,
          StarterKit.configure({ codeBlock: false }),
          CodeBlockLowlight.configure({ lowlight }),
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
          if (!this._syncing) {
            this._setValue?.(editor.getMarkdown());
          }
        },
        onSelectionUpdate: () => {
          this._refreshToolbarState();
        },
        onTransaction: () => {
          this._refreshToolbarState();
        },
        onFocus: () => {
          this._scheduleTableToolbarPosition();
        },
        onBlur: () => {
          this._handleBlur?.();
          this._scheduleTableToolbarPosition();
        },
      });
      this._refreshToolbarState();
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
          if (readonly) this.closeTablePicker();
          this._refreshToolbarState();
        },
      );
    });
  }

  protected __dispose__() {
    if (this._tableToolbarUpdateFrame !== undefined) {
      window.cancelAnimationFrame(this._tableToolbarUpdateFrame);
    }
    if (this._tableToolbarViewportHandler) {
      window.removeEventListener('resize', this._tableToolbarViewportHandler);
      window.removeEventListener('scroll', this._tableToolbarViewportHandler, true);
    }
    if (this._tablePickerPointerHandler) {
      document.removeEventListener('pointerdown', this._tablePickerPointerHandler);
    }
    if (this._tablePickerKeyHandler) {
      document.removeEventListener('keydown', this._tablePickerKeyHandler);
    }
    this._tablePickerTrigger = undefined;
    this._tablePickerRoot = undefined;
    this._tableToolbarHost = undefined;
    this._setTableToolbarPosition();
    this.editor?.destroy();
  }

  public bindFormField(
    propsBucket: IFormFieldRenderContextPropsBucket,
    formField: ControllerFormField,
  ) {
    const value = propsBucket.value ?? '';
    const readonly = propsBucket.readonly ?? false;
    const options = propsBucket.options ?? {};
    const imageScene = options.imageScene ?? markdownImageScene;
    if (this.value !== value) this.value = value;
    if (this.readonly !== readonly) this.readonly = readonly;
    if (this.imageScene !== imageScene) this.imageScene = imageScene;
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
