import { error, success, buildValidator } from './FieldValidator';

export const isAlwaysValid = <T>() => buildValidator<any, T, T, T>((value: T) => success(value));

export const isNull = <T>(message?: string) =>
  buildValidator<any, T | null, null, T>((value: T | null) => value === null
    ? success(null)
    : error(message ?? 'Should be empty', value),
  );

export const isNotNull = <T>(message?: string) =>
  buildValidator<any, T | null, T, null>((value: T | null) => value !== null
    ? success(value)
    : error(message ?? 'Should not be empty', null),
  );

export const minLength = (min: number, message?: string) =>
  buildValidator<any, string, string, string>((value: string) =>
    value.length >= min
      ? success(value)
      : error(message ?? `Should be at least ${min} characters long`, value),
  );

export const isNotEmpty = (message?: string) => minLength(1, message ?? 'Should not be empty');
