import { Ref } from 'preact/hooks';

import { IsOptional } from '@/extensions/types';

export type ComponentRefType<T> = Ref<{
  setValue: (value: T) => Promise<void>;
}>;

type OptionsBlock<O> = IsOptional<O> extends true ? { options?: O } : { options: O };

export type ComponentSetup<VT, O> = {
  id: string;
  ref: ComponentRefType<VT>;
  onChangeValue: (value: VT) => void;
} & OptionsBlock<O>;
