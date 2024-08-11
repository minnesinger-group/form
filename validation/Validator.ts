import { mapRecord } from '@/extensions/object';
import { FormConfig } from '../useForm';
import { FormValues } from '../Form';
import { FieldValidator } from './FieldValidator';
import { ValidateResult, ValidationType } from './ValidateResult';
import { isAlwaysValid } from './validators';

export type ValidatorConfig<C extends FormConfig> = {
  [key in keyof FormValues<C>]: FieldValidator<C, FormValues<C>[key], FormValues<C>[key], FormValues<C>[key]>
}

export type Validator<C extends FormConfig, VC extends ValidatorConfig<C>> = (values: FormValues<C>) => ValidateResult<C, VC>;

export function buildValidator<C extends FormConfig, VC extends ValidatorConfig<C>>(_: C, config: VC): Validator<C, VC> {
  return (values: FormValues<C>) =>
    mapRecord(
      values,
      (key, value) => config[key](value, values) as ValidationType<C, VC, typeof key>,
    );
}

export function emptyValidator<C extends FormConfig>(formConfig: C): Validator<C, ValidatorConfig<C>> {
  return buildValidator(formConfig, mapRecord(formConfig, () => isAlwaysValid()));
}
