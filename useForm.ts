import { Inputs, useCallback, useMemo, useState } from 'preact/hooks';

import { mapRecord } from '@/extensions/object';
import { identity } from '@/extensions/functions';
import {
  ComponentType,
  ComponentValueType,
  ComponentSetupType,
  ComponentConfigType,
} from './components';
import useComponentRefs from './useComponentRefs';
import { FormValues, FormComponentSetup } from './Form';

export type FormConfig = {
  [id: string]: ComponentConfigType<ComponentType>;
};

type ConfigBuilder<C extends FormConfig> = (
  fn: <T extends ComponentType>(obj: ComponentConfigType<T>) => ComponentConfigType<T>,
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
    value: ComponentValueType<C[ID]['type']>,
  ) => Promise<void>;
  setFieldValues: (values: {
    [key in keyof C]?: ComponentValueType<C[key]['type']>;
  }) => Promise<void>;
};

const useForm = <C extends FormConfig>(
  configBuilder: ConfigBuilder<C>,
  onSubmit: (values: FormValues<C>) => void,
  inputs: Inputs,
): FormSetup<C> => {
  const config = useMemo(() => configBuilder(identity), inputs);

  const [values, setValues] = useState<FormValues<C>>(mapRecord(config, () => null));

  const refs = useComponentRefs(config);

  const setFieldValue = useCallback(
    async (id: keyof C, value: ComponentValueType<C[typeof id]['type']>) => {
      await refs[id].current?.setValue?.(value);
    },
    [refs],
  );

  const setFieldValues = useCallback(
    async (values: {
      [key in keyof C]?: ComponentValueType<C[key]['type']>;
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
          ref: refs[id],
          onChangeValue: (value: ComponentValueType<C[typeof id]['type']>) =>
            setValues(values => ({ ...values, [id]: value })),
        },
        label: { id: id.toString() },
      })),
    [config],
  );

  return {
    setup: { ...componentsSetup, form: { onSubmit, values } },
    values,
    setFieldValue,
    setFieldValues,
  };
};

export default useForm;
