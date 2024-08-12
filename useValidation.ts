import { useCallback, useEffect, useMemo } from 'preact/hooks';

import { FormConfig } from './useForm';
import { FormValues } from './Form';
import { ComponentRefs } from './useComponentRefs';
import { isSuccessResult, resultToObject, ValidatedObject, ValidateResult } from './validation/ValidateResult';
import { emptyValidator, Validator, ValidatorConfig } from './validation/Validator';

const useValidation = <C extends FormConfig, VCS extends ValidatorConfig<C>, VCL extends ValidatorConfig<C>>(
  config: C,
  values: FormValues<C>,
  refs: ComponentRefs<C>,
  onSubmit: (values: ValidatedObject<C, VCS>) => void,
  submitValidator?: Validator<C, VCS>,
  liveValidator?: Validator<C, VCL>,
) => {
  const defaultResults = useMemo(() => emptyValidator(config)(values), []);

  const setResults = (results: ValidateResult<C, any>) => {
    Object.keys(results).map(
      (id) => {
        refs[id].input.current?.setValid?.(results[id].success);
        refs[id].error.current?.setResult?.(results[id]);
      },
    );
  };

  useEffect(() => {
    if (liveValidator) {
      const newResults = liveValidator(values);
      setResults(newResults);
    } else {
      setResults(defaultResults);
    }
  }, [values]);

  const handleSubmit = useCallback((values: ValidatedObject<C, VCS>) => {
    if (submitValidator) {
      const result = submitValidator(values);
      setResults(result);
      if (isSuccessResult(result)) {
        onSubmit(resultToObject(result));
      }
    } else {
      onSubmit(values);
    }
  }, [submitValidator, onSubmit]);

  return { defaultResults, handleSubmit };
};

export default useValidation;
