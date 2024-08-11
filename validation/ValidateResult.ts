import { mapRecord } from '@/extensions/object';
import { FormConfig } from '../useForm';
import { FormValues } from '../Form';
import { FieldValidator } from './FieldValidator';
import { ValidatorConfig } from './Validator';

export type ValidationType<C extends FormConfig, VC extends ValidatorConfig<C>, K extends keyof FormValues<C>> =
  VC[K] extends FieldValidator<C, FormValues<C>[K], infer S, infer E>
    ? ReturnType<FieldValidator<C, FormValues<C>[K], S, E>>
    : never;

export type ValidateResult<C extends FormConfig, VC extends ValidatorConfig<C>> = {
  [key in keyof FormValues<C>]: ValidationType<C, VC, key>;
}

type ValidateSuccess<C extends FormConfig, VC extends ValidatorConfig<C>> = {
  [key in keyof FormValues<C>]: Extract<ValidateResult<C, VC>[key], { success: true }>;
}

export type ValidatedObject<C extends FormConfig, VC extends ValidatorConfig<C>> = {
  [key in keyof FormValues<C>]: ValidateSuccess<C, VC>[key]['value']
}

export function isSuccessResult<C extends FormConfig, VC extends ValidatorConfig<C>>(result: ValidateResult<C, VC>): result is ValidateSuccess<C, VC> {
  return Object.values(result).every(it => it.success);
}

export function resultToObject<C extends FormConfig, VC extends ValidatorConfig<C>>(result: ValidateSuccess<C, VC>): ValidatedObject<C, VC> {
  return mapRecord(result, (_, value) => value.value);
}
