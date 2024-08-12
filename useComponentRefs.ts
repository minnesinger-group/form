import { useMemo } from 'preact/hooks';

import { mapRecord } from '@/extensions/object';
import { FormConfig } from './useForm';
import { InputValueType } from './components';
import { InputRefType } from './components/common';
import { ErrorHintRefType } from './components/ErrorHint';

export type ComponentRefs<C extends FormConfig> = {
  [key in keyof C]: {
    input: InputRefType<InputValueType<C[key]['type']>>,
    error: ErrorHintRefType,
  };
};

const useComponentRefs = <C extends FormConfig>(config: C): ComponentRefs<C> => {
  return useMemo(() => mapRecord(config, () => ({
    input: { current: null },
    error: { current: null },
  })), [config]);
};

export default useComponentRefs;
