import { classes } from 'typestyle';
import { z } from 'zod';
import { BeanRenderBase } from 'zova';
import { Render } from 'zova-module-a-bean';
import { ZForm, ZFormField, ZFormFieldBlank, ZFormFieldPreset } from 'zova-module-a-form';

@Render()
export class RenderPageToolOne extends BeanRenderBase {
  private _renderAuto() {
    return (
      <div>
        <ZForm
          controllerRef={ref => {
            this.controllerForm = ref;
          }}
          data={this.formData}
          schema={this.schemaUpdate}
          formMeta={this.formMeta}
          onSubmitData={data => this.submitData(data)}
          onShowError={({ error }) => {
            // eslint-disable-next-line no-alert
            window.alert(error.message);
          }}
          slotFooter={$$form => {
            return (
              <div>
                {$$form.formState.isSubmitting && (
                  <span class="loading loading-spinner text-primary"></span>
                )}
                {this.formMeta.formMode === 'edit' && (
                  <button
                    class={classes(
                      'btn btn-primary',
                      $$form.formState.isSubmitting && 'btn-disabled',
                    )}
                    onClick={async () => {
                      await $$form.submit();
                    }}
                  >
                    {this.scope.locale.Submit()}
                  </button>
                )}
              </div>
            );
          }}
        ></ZForm>
      </div>
    );
  }

  private _renderManual() {
    return (
      <ZForm data={this.formData} onSubmitData={data => this.submitData(data)}>
        <ZFormFieldPreset
          name="name"
          layout={{ label: `${this.scope.locale.YourName()}:` }}
          validators={{ onDynamic: z.string().min(3) }}
        ></ZFormFieldPreset>
        <ZFormField
          name="name"
          slotDefault={({ propsBucket, props }, $$formField) => {
            return (
              <input
                {...props}
                class="input"
                value={propsBucket.value}
                onInput={(e: Event) => {
                  $$formField.setValue((e.target as HTMLInputElement).value);
                }}
                onBlur={() => {
                  $$formField.handleBlur();
                }}
              ></input>
            );
          }}
        ></ZFormField>
        <ZFormField name="name">
          <span>span: name</span>
        </ZFormField>
        <ZFormFieldBlank
          slotDefault={$$form => {
            return (
              <button
                disabled={$$form.formState.isSubmitting}
                type="submit"
                class="btn btn-primary"
              >
                Submit
              </button>
            );
          }}
        ></ZFormFieldBlank>
      </ZForm>
    );
  }

  public render() {
    return (
      <div>
        <div>{this._renderAuto()}</div>
        <div>------------------------------------</div>
        <div>{this._renderManual()}</div>
      </div>
    );
  }
}
