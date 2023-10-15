import { useMemo } from 'preact/hooks';

import { mapRecord } from '@/extensions/object';
import { FormConfig } from './useForm';
import { ComponentValueType } from './components';
import { ComponentRefType } from './components/common';

type ComponentRefs<C extends FormConfig> = {
  [key in keyof C]: ComponentRefType<ComponentValueType<C[key]['type']>>;
};

const useComponentRefs = <C extends FormConfig>(config: C): ComponentRefs<C> => {
  return useMemo(() => mapRecord(config, () => ({ current: null })), [config]);
};

export default useComponentRefs;
