import { Ref } from 'preact/hooks';

import { IsOptional } from '@/extensions/types';

export type InputRefType<T> = Ref<{
  setValue: (value: T) => Promise<void>;
  setValid: (isValid: boolean) => void;
}>;

type OptionsBlock<O> = IsOptional<O> extends true ? { options?: O } : { options: O };

export type InputSetup<VT, O> = {
  id: string;
  ref: InputRefType<VT>;
  onChangeValue: (value: VT) => void;
} & OptionsBlock<O>;
