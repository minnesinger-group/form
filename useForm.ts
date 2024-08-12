import { useCallback, useMemo, useState } from 'preact/hooks';

import { mapRecord } from '@/extensions/object';
import { identity } from '@/extensions/functions';
import {
  InputType,
  InputValueType,
  ComponentSetupType,
  InputConfigType,
} from './components';
import useComponentRefs from './useComponentRefs';
import useValidation from './useValidation';
import { FormValues, FormComponentSetup } from './Form';
import { Validator, ValidatorConfig } from './validation/Validator';
import { ValidatedObject } from './validation/ValidateResult';

export type FormConfig = {
  [id: string]: InputConfigType<InputType>;
};

type ConfigBuilder<C extends FormConfig> = (
  fn: <T extends InputType>(obj: InputConfigType<T>) => InputConfigType<T>,
) => C;

export interface FormValidation<C extends FormConfig, VCS extends ValidatorConfig<C>, VCL extends ValidatorConfig<C>> {
  submitValidator: Validator<C, VCS>;
  liveValidator?: Validator<C, VCL>;
}

type ComponentsSetup<C extends FormConfig> = {
  [key in keyof C]: ComponentSetupType<C[key]['type']>;
};

type FormSetup<C extends FormConfig> = {
  setup: ComponentsSetup<C> & {
    form: FormComponentSetup<C>;
  };
  values: FormValues<C>;
  setFieldValue: <ID extends keyof C>(
    id: ID,
    value: InputValueType<C[ID]['type']>,
  ) => Promise<void>;
  setFieldValues: (values: {
    [key in keyof C]?: InputValueType<C[key]['type']>;
  }) => Promise<void>;
};

export function buildFormConfig<C extends FormConfig>(builder: ConfigBuilder<C>): C {
  return builder(identity);
}

const useForm = <C extends FormConfig, VCS extends ValidatorConfig<C>, VCL extends ValidatorConfig<C>>(
  config: C,
  onSubmit: (values: ValidatedObject<C, VCS>) => void,
  validation?: FormValidation<C, VCS, VCL>,
): FormSetup<C> => {
  const [values, setValues] = useState(mapRecord<C, FormValues<C>>(config, () => null));

  const refs = useComponentRefs(config);

  const { defaultResults, handleSubmit } = useValidation(config, values, refs, onSubmit, validation);

  const setFieldValue = useCallback(
    async (id: keyof C, value: InputValueType<C[typeof id]['type']>) => {
      await refs[id].input.current?.setValue?.(value);
    },
    [refs],
  );

  const setFieldValues = useCallback(
    async (values: {
      [key in keyof C]?: InputValueType<C[key]['type']>;
    }) => {
      await Promise.all(
        Object.entries(values).map(
          ([id, value]) => value !== undefined && setFieldValue(id, value),
        ),
      );
    },
    [setFieldValue],
  );

  const componentsSetup: ComponentsSetup<C> = useMemo(
    () =>
      mapRecord(config, (id, record) => ({
        input: {
          options: record.options,
          id: id.toString(),
          ref: refs[id].input,
          onChangeValue: (value: InputValueType<C[typeof id]['type']>) =>
            setValues(values => ({ ...values, [id]: value })),
        },
        label: { id: id.toString() },
        error: {
          ref: refs[id].error,
          defaultResult: defaultResults[id],
        },
      })),
    [config],
  );

  return {
    setup: { ...componentsSetup, form: { onSubmit: handleSubmit, values } },
    values,
    setFieldValue,
    setFieldValues,
  };
};

export default useForm;
