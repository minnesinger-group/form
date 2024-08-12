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

function buildInputId(formId: string | undefined, key: string | number | symbol) {
  return formId ? `${formId}-${String(key)}` : String(key);
}

const useForm = <C extends FormConfig, VCS extends ValidatorConfig<C>, VCL extends ValidatorConfig<C>>(
  { id: formId, config, onSubmit, submitValidator, liveValidator }: {
    id?: string,
    config: C,
    onSubmit: (values: ValidatedObject<C, VCS>) => void,
    submitValidator?: Validator<C, VCS>;
    liveValidator?: Validator<C, VCL>;
  }): FormSetup<C> => {
  const [values, setValues] = useState(mapRecord<C, FormValues<C>>(config, () => null));

  const refs = useComponentRefs(config);

  const { defaultResults, handleSubmit } = useValidation(
    config,
    values,
    refs,
    onSubmit,
    submitValidator,
    liveValidator,
  );

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
          id: buildInputId(formId, id),
          ref: refs[id].input,
          onChangeValue: (value: InputValueType<C[typeof id]['type']>) =>
            setValues(values => ({ ...values, [id]: value })),
        },
        label: { id: buildInputId(formId, id) },
        error: {
          ref: refs[id].error,
          defaultResult: defaultResults[id],
        },
      })),
    [config],
  );

  return {
    setup: { ...componentsSetup, form: { id: formId, onSubmit: handleSubmit, values } },
    values,
    setFieldValue,
    setFieldValues,
  };
};

export default useForm;
