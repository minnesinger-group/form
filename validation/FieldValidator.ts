import { FormConfig } from '../useForm';
import { FormValues } from '../Form';

type FieldValidateSuccess<S> = { success: true, value: S };
type FieldValidateError<E> = { success: false, message: string, value: E };
export type FieldValidateResult<S, E> = FieldValidateSuccess<S> | FieldValidateError<E>;

export const success = <S>(value: S): FieldValidateSuccess<S> => ({ success: true, value });
export const error = <E>(message: string, value: E): FieldValidateError<E> => ({ success: false, message, value });

export type FieldValidator<C extends FormConfig, T, S extends T, E extends T> =
  (value: T, values: FormValues<C>) => FieldValidateResult<S, E>;

export interface FieldValidatorBuilder<C extends FormConfig, T, S extends T, E extends T> extends FieldValidator<C, T, S, E> {
  and: <SN extends S, EN extends S>(nextValidator: FieldValidator<C, S, SN, EN>) =>
    FieldValidatorBuilder<C, T, SN, E | EN>;
  or: <SN extends E, EN extends E>(nextValidator: FieldValidator<C, E, SN, EN>) =>
    FieldValidatorBuilder<C, T, S | SN, EN>;
}

export function buildValidator<C extends FormConfig, T, S extends T, E extends T>(
  validator: FieldValidator<C, T, S, E>,
): FieldValidatorBuilder<C, T, S, E> {
  const builder = validator as FieldValidatorBuilder<C, T, S, E>;

  builder.and = <SN extends S, EN extends S>(nextValidator: FieldValidator<C, S, SN, EN>) =>
    buildValidator<C, T, SN, E | EN>((value, values) => {
      const result = validator(value, values);
      return result.success ? nextValidator(result.value, values) : result;
    });
  builder.or = <SN extends E, EN extends E>(nextValidator: FieldValidator<C, E, SN, EN>) =>
    buildValidator<C, T, S | SN, EN>((value, values) => {
      const result = validator(value, values);
      return result.success ? result : nextValidator(result.value, values);
    });

  return builder;
}
