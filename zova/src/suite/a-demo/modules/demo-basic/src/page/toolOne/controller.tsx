import { SchemaObject } from 'openapi3-ts/oas31';
import { z } from 'zod';
import { Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import {
  BeanControllerPageFormBase,
  ControllerForm,
  TypeFormOnSubmitData,
} from 'zova-module-a-form';
import { $QueryAutoLoad } from 'zova-module-a-model';
import { IFormMeta } from 'zova-module-a-openapi';
import { ApiSchemaTestSsrDtoTestBodyPartial } from 'zova-module-home-api';

import { ModelTest } from '../../model/test.js';

export const ControllerPageToolOneSchemaParams = z.object({
  id: z.number().optional(),
});

export const ControllerPageToolOneSchemaQuery = z.object({
  name: z.string().optional(),
});

@Controller()
export class ControllerPageToolOne extends BeanControllerPageFormBase {
  // form: TypeForm<ApiSchemaTestSsrDtoTestBodyPartial>;
  public schemaUpdate?: SchemaObject;

  @Use()
  $$modelTest: ModelTest;

  controllerForm: ControllerForm;
  fieldName: string = 'name';
  formData: ApiSchemaTestSsrDtoTestBodyPartial;
  formMeta: IFormMeta;

  protected async __init__() {
    const apiSchemas = this.$apiSchema.testSsrToolOne.test();
    const querySdk = await $QueryAutoLoad(() => apiSchemas.sdk);
    this.schemaUpdate = this.$computed(() => {
      const schema = apiSchemas.requestBody;
      // eslint-disable-next-line
      console.log('schema: ', schema);
      return schema;
    });
    // eslint-disable-next-line
    console.log('sdk: ', querySdk?.data);
    // form data
    this.formData = {
      name: 'tom',
    };
    this.formMeta = {
      formMode: 'edit',
      editMode: 'update',
    };
    // form;
    // this.form = this.$useForm({
    //   defaultValues: this.formData,
    //   onSubmit: async ({ value }) => {
    //     console.log('submit manual: ', JSON.stringify(value));
    //   },
    // });
    // setInterval(()=>{
    //   this.fieldName=this.fieldName==='name'?'married':'name';
    // },1000)
  }

  async submitData(data: TypeFormOnSubmitData<ApiSchemaTestSsrDtoTestBodyPartial>) {
    // eslint-disable-next-line
    console.log('submit auto: ', JSON.stringify(data.value));
    this.formData = data.value;
  }
}
