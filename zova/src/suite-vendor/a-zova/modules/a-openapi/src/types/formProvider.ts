import { TypeComponentRecordSelectorKeys } from 'zova';
import {
  TypeBehaviorRecordSelectorKeys,
  TypeBehaviorRecordSelectorKeysStrict,
} from 'zova-module-a-behavior';

export interface IFormProviderComponents {
  Input?: TypeComponentRecordSelectorKeys<'formField'>;
}

export interface IFormProviderBehaviors {
  FormField?: TypeBehaviorRecordSelectorKeysStrict<'formField'>;
  FormFieldLayout?: TypeBehaviorRecordSelectorKeys<'formFieldLayout'>;
}

export interface IFormProvider {
  components?: IFormProviderComponents;
  behaviors?: IFormProviderBehaviors;
}
