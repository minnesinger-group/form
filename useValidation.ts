import { useCallback, useEffect, useMemo } from 'preact/hooks';

import { FormConfig, FormValidation } from './useForm';
import { FormValues } from './Form';
import { ComponentRefs } from './useComponentRefs';
import { isSuccessResult, resultToObject, ValidatedObject, ValidateResult } from './validation/ValidateResult';
import { emptyValidator, ValidatorConfig } from './validation/Validator';

const useValidation = <C extends FormConfig, VCS extends ValidatorConfig<C>, VCL extends ValidatorConfig<C>>(
  config: C,
  values: FormValues<C>,
  refs: ComponentRefs<C>,
  onSubmit: (values: ValidatedObject<C, VCS>) => void,
  validation?: FormValidation<C, VCS, VCL>,
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
    if (validation?.liveValidator) {
      const newResults = validation.liveValidator(values);
      setResults(newResults);
    } else {
      setResults(defaultResults);
    }
  }, [values]);

  const handleSubmit = useCallback((values: ValidatedObject<C, VCS>) => {
    if (validation?.submitValidator) {
      const result = validation?.submitValidator(values);
      setResults(result);
      if (isSuccessResult(result)) {
        onSubmit(resultToObject(result));
      }
    } else {
      onSubmit(values);
    }
  }, [validation?.submitValidator, onSubmit]);

  return { defaultResults, handleSubmit };
};

export default useValidation;
