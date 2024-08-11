import { useEffect, useState } from 'preact/hooks';

import { FormConfig } from '../useForm';
import { FormValues } from '../Form';
import { Validator, ValidatorConfig } from './Validator';
import { isSuccessResult, resultToObject, ValidatedObject } from './ValidateResult';

export function useValidation<C extends FormConfig, VCS extends ValidatorConfig<C>, VCL extends ValidatorConfig<C>>(
  submitValidator: Validator<C, VCS>,
  liveValidator: Validator<C, VCL>,
  values: FormValues<C>,
) {
  const [results, setResults] = useState<ReturnType<typeof submitValidator> | ReturnType<typeof liveValidator>>(
    liveValidator(values),
  );

  useEffect(() => {
    setResults(liveValidator(values));
  }, [values]);

  const submit = (): ValidatedObject<C, VCS> | null => {
    const result = submitValidator(values);
    setResults(result);
    if (isSuccessResult(result)) {
      return resultToObject(result);
    } else {
      return null;
    }
  };

  return { results, submit };
}
