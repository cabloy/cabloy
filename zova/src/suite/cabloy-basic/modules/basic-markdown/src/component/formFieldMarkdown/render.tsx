import type { IIconRecord } from 'zova-module-a-icon';

import { EditorContent } from '@tiptap/vue-3';
import { BeanRenderBase, ClientOnly } from 'zova';
import { Render } from 'zova-module-a-bean';
import { ZFormField } from 'zova-module-a-form';
import { ZIcon } from 'zova-module-a-icon';

@Render()
export class RenderFormFieldMarkdown extends BeanRenderBase {
  private _toolbarButton(
    name: keyof IIconRecord,
    label: string,
    action: () => void,
    options: { active?: boolean; disabled?: boolean } = {},
  ) {
    return (
      <button
        type="button"
        class={['btn btn-ghost btn-sm btn-square', options.active && 'btn-active text-primary']}
        aria-label={label}
        title={label}
        aria-pressed={options.active}
        disabled={options.disabled}
        onMousedown={event => {
          event.preventDefault();
        }}
        onClick={event => {
          event.stopPropagation();
          action();
        }}
      >
        <ZIcon name={name} width={18} height={18}></ZIcon>
      </button>
    );
  }

  private _renderTablePicker() {
    if (!this.tablePickerOpen) return null;
    const { rows, cols } = this.tablePickerPreview;
    const maxSize = this.tablePickerMaxSize;
    return (
      <div
        id="markdown-table-size-picker"
        ref={ref => {
          this.setTablePickerRoot(ref as HTMLDivElement | null);
        }}
        class="absolute right-0 top-full z-20 mt-1 rounded-box border border-base-300 bg-base-100 p-3 shadow-lg"
        role="dialog"
        aria-label={this.scope.locale.TableSizePicker()}
      >
        <div
          class="mb-2 text-center text-sm text-base-content/70"
          aria-live="polite"
          aria-atomic="true"
        >
          {this.scope.locale.TableSizeStatus()}: {rows} × {cols}
        </div>
        <div
          role="grid"
          aria-label={this.scope.locale.TableSizePicker()}
          aria-rowcount={maxSize}
          aria-colcount={maxSize}
          class="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${maxSize}, minmax(1.25rem, 1fr))` }}
        >
          {Array.from({ length: maxSize }, (_, rowIndex) =>
            Array.from({ length: maxSize }, (_, colIndex) => {
              const row = rowIndex + 1;
              const col = colIndex + 1;
              const selected = row <= rows && col <= cols;
              const active =
                row === this.tablePickerActive.rows && col === this.tablePickerActive.cols;
              const label = `${row} × ${col} ${this.scope.locale.TableSizeCell()}`;
              return (
                <button
                  key={`${row}-${col}`}
                  type="button"
                  role="gridcell"
                  data-table-picker-cell={`${row}-${col}`}
                  aria-label={label}
                  aria-rowindex={row}
                  aria-colindex={col}
                  aria-selected={selected}
                  tabindex={active ? 0 : -1}
                  class={[
                    'h-5 w-5 rounded-sm border border-base-300 p-0 transition-colors',
                    selected && 'border-primary bg-primary',
                    !selected && 'bg-base-200 hover:border-primary hover:bg-primary/30',
                    active && 'outline outline-2 outline-primary outline-offset-1',
                  ]}
                  onMousedown={event => {
                    event.preventDefault();
                  }}
                  onPointerenter={() => {
                    this.setTablePickerPreview(row, col);
                  }}
                  onFocus={() => {
                    this.setTablePickerPreview(row, col);
                  }}
                  onClick={event => {
                    event.stopPropagation();
                    this.selectTablePickerSize(row, col);
                  }}
                ></button>
              );
            }),
          )}
        </div>
      </div>
    );
  }

  private _renderTablePickerTrigger() {
    return (
      <div class="relative">
        <button
          type="button"
          aria-label={this.scope.locale.InsertTable()}
          title={this.scope.locale.InsertTable()}
          aria-haspopup="grid"
          aria-expanded={this.tablePickerOpen}
          aria-controls="markdown-table-size-picker"
          disabled={!this.toolbarState.canTable}
          class="btn btn-ghost btn-sm btn-square"
          onMousedown={event => {
            event.preventDefault();
          }}
          onClick={event => {
            event.stopPropagation();
            this.toggleTablePicker();
          }}
          ref={ref => {
            this.setTablePickerTrigger(ref as HTMLButtonElement | null);
          }}
        >
          <ZIcon name=":editor:grid-on" width={18} height={18}></ZIcon>
        </button>
        {this._renderTablePicker()}
      </div>
    );
  }

  private _renderToolbar() {
    const state = this.toolbarState;
    return (
      <div
        class="flex flex-wrap items-center gap-1 border-b border-base-300 p-2"
        role="toolbar"
        aria-label={this.scope.locale.MarkdownToolbar()}
      >
        {this._toolbarButton(':editor:undo', this.scope.locale.Undo(), () => this.undo(), {
          disabled: !state.canUndo,
        })}
        {this._toolbarButton(':editor:redo', this.scope.locale.Redo(), () => this.redo(), {
          disabled: !state.canRedo,
        })}
        <select
          class="select select-sm select-bordered w-auto min-w-28"
          aria-label={this.scope.locale.BlockStyle()}
          value={state.headingLevel ? `heading-${state.headingLevel}` : 'paragraph'}
          onMousedown={event => {
            event.stopPropagation();
          }}
          onChange={event => {
            event.stopPropagation();
            const value = (event.target as HTMLSelectElement).value;
            if (value === 'paragraph') {
              this.setParagraph();
            } else if (value.startsWith('heading-')) {
              this.setHeading(Number(value.slice('heading-'.length)) as 1 | 2 | 3 | 4 | 5 | 6);
            }
          }}
        >
          <option value="paragraph">{this.scope.locale.Paragraph()}</option>
          <option value="heading-1">{this.scope.locale.Heading1()}</option>
          <option value="heading-2">{this.scope.locale.Heading2()}</option>
          <option value="heading-3">{this.scope.locale.Heading3()}</option>
          <option value="heading-4">{this.scope.locale.Heading4()}</option>
          <option value="heading-5">{this.scope.locale.Heading5()}</option>
          <option value="heading-6">{this.scope.locale.Heading6()}</option>
        </select>
        {this._toolbarButton(
          ':editor:format-bold',
          this.scope.locale.Bold(),
          () => this.toggleBold(),
          { active: state.bold, disabled: !state.canBold },
        )}
        {this._toolbarButton(
          ':editor:format-italic',
          this.scope.locale.Italic(),
          () => this.toggleItalic(),
          { active: state.italic, disabled: !state.canItalic },
        )}
        {this._toolbarButton(
          ':editor:format-strikethrough',
          this.scope.locale.Strikethrough(),
          () => this.toggleStrike(),
          { active: state.strike, disabled: !state.canStrike },
        )}
        {this._toolbarButton(
          ':editor:code',
          this.scope.locale.InlineCode(),
          () => this.toggleCode(),
          { active: state.code, disabled: !state.canCode },
        )}
        {this._toolbarButton(
          ':editor:insert-link-outline',
          this.scope.locale.Link(),
          () => {
            void this.editLink();
          },
          { active: state.link, disabled: !state.canLink },
        )}
        {this._toolbarButton(
          ':editor:bookmark',
          this.scope.locale.Highlight(),
          () => this.toggleHighlight(),
          { active: state.highlight, disabled: !state.canHighlight },
        )}
        {this._toolbarButton(
          ':editor:format-list-bulleted',
          this.scope.locale.BulletList(),
          () => this.toggleBulletList(),
          { active: state.bulletList, disabled: !state.canBulletList },
        )}
        {this._toolbarButton(
          ':editor:format-list-numbered',
          this.scope.locale.OrderedList(),
          () => this.toggleOrderedList(),
          { active: state.orderedList, disabled: !state.canOrderedList },
        )}
        {this._toolbarButton(
          ':editor:task-alt',
          this.scope.locale.TaskList(),
          () => this.toggleTaskList(),
          { active: state.taskList, disabled: !state.canTaskList },
        )}
        {this._toolbarButton(
          ':editor:format-quote',
          this.scope.locale.Blockquote(),
          () => this.toggleBlockquote(),
          { active: state.blockquote, disabled: !state.canBlockquote },
        )}
        {this._toolbarButton(
          ':editor:code-block',
          this.scope.locale.CodeBlock(),
          () => this.toggleCodeBlock(),
          { active: state.codeBlock, disabled: !state.canCodeBlock },
        )}
        {this._toolbarButton(
          ':editor:horizontal-rule',
          this.scope.locale.HorizontalRule(),
          () => this.setHorizontalRule(),
          { disabled: !state.canHorizontalRule },
        )}
        {this._renderTablePickerTrigger()}
      </div>
    );
  }

  private _renderTableToolbar() {
    const position = this.tableToolbarPosition;
    const state = this.toolbarState;
    return (
      <div
        class="pointer-events-none absolute inset-0 z-10"
        ref={ref => {
          this.setTableToolbarHost(ref as HTMLDivElement | null);
        }}
      >
        {position && (
          <div
            class="pointer-events-auto absolute flex flex-wrap items-center gap-1 rounded-box border border-base-300 bg-base-100 p-1 shadow"
            style={{
              left: `${position.left}px`,
              top: `${position.top}px`,
              transform: 'translate(-50%, -100%)',
            }}
            role="toolbar"
            aria-label={this.scope.locale.TableToolbar()}
            onFocus={() => {
              this.setTableToolbarFocused(true);
            }}
            onBlur={event => {
              const nextTarget = event.relatedTarget;
              const currentTarget = event.currentTarget as HTMLElement;
              if (!(nextTarget instanceof Node) || !currentTarget.contains(nextTarget)) {
                this.setTableToolbarFocused(false);
              }
            }}
          >
            {this._toolbarButton(
              ':editor:add-box',
              this.scope.locale.AddRowBefore(),
              () => this.addTableRowBefore(),
              { disabled: !state.canAddTableRowBefore },
            )}
            {this._toolbarButton(
              ':editor:add-box-outline',
              this.scope.locale.AddRowAfter(),
              () => this.addTableRowAfter(),
              { disabled: !state.canAddTableRowAfter },
            )}
            {this._toolbarButton(
              ':editor:horizontal-rule',
              this.scope.locale.DeleteRow(),
              () => this.deleteTableRow(),
              {
                disabled: !state.canDeleteTableRow,
              },
            )}
            {this._toolbarButton(
              ':editor:add-box',
              this.scope.locale.AddColumnBefore(),
              () => this.addTableColumnBefore(),
              { disabled: !state.canAddTableColumnBefore },
            )}
            {this._toolbarButton(
              ':editor:add-box-outline',
              this.scope.locale.AddColumnAfter(),
              () => this.addTableColumnAfter(),
              { disabled: !state.canAddTableColumnAfter },
            )}
            {this._toolbarButton(
              '::delete',
              this.scope.locale.DeleteColumn(),
              () => this.deleteTableColumn(),
              {
                disabled: !state.canDeleteTableColumn,
              },
            )}
            {this._toolbarButton(
              '::delete-forever',
              this.scope.locale.DeleteTable(),
              () => this.deleteTable(),
              {
                disabled: !state.canDeleteTable,
              },
            )}
          </div>
        )}
      </div>
    );
  }

  public render() {
    return (
      <ZFormField
        {...this.$props}
        slotDefault={({ propsBucket, props }, $$formField) => {
          this.bindFormField(propsBucket, $$formField);
          return (
            <div class={props.class}>
              <div
                class={[
                  'relative rounded-box border border-base-300 bg-base-100',
                  !$$formField.field.state.meta.isValid && 'border-error',
                ]}
                onClick={() => {
                  if (!this.readonly) {
                    this.editor?.commands.focus();
                  }
                }}
              >
                <ClientOnly
                  v-slots={{
                    default: () => (
                      <>
                        {!this.readonly && this._renderToolbar()}
                        {!this.readonly && this.editor && this._renderTableToolbar()}
                        <EditorContent editor={this.editor} class={this.cMarkdown} />
                      </>
                    ),
                    placeholder: () => <div class="min-h-96 p-4" aria-hidden="true"></div>,
                  }}
                ></ClientOnly>
              </div>
            </div>
          );
        }}
      ></ZFormField>
    );
  }
}
