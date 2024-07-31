import { RenderableProps } from 'preact';
import { memo, useImperativeHandle } from 'preact/compat';
import { useRef } from 'preact/hooks';

import { ComponentSetup } from './common';

export type TextInputValueType = string | null;
export type NumberInputValueType = number | null;

export type TextInputSetup = ComponentSetup<TextInputValueType, {}>;
export type NumberInputSetup = ComponentSetup<NumberInputValueType, {}>;

export interface TextInputProps {
  setup: TextInputSetup;
}

export interface NumberInputProps {
  setup: NumberInputSetup;
}

const TextInput = memo(({ setup: { id, onChangeValue, ref } }: RenderableProps<TextInputProps>) => {
  console.log('TextInput: ', id);
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    setValue: async (value: string | null) => {
      if (inputRef.current) {
        inputRef.current.value = value?.toString() ?? '';
        onChange();
      }
    },
  }));

  const onChange = () => {
    const value = inputRef.current?.value ?? null;
    onChangeValue(value);
  };

  return <input id={id} ref={inputRef} type="text" onChange={onChange} />;
});

const NumberInput = memo(
  ({ setup: { id, onChangeValue, ref } }: RenderableProps<NumberInputProps>) => {
    console.log('NumberInput: ', id);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      setValue: async (value: number | null) => {
        if (inputRef.current) {
          inputRef.current.value = value?.toString() ?? '';
          onChange();
        }
      },
    }));

    const onChange = () => {
      const value = Number.isNaN(Number(inputRef?.current?.value))
        ? null
        : Number(inputRef?.current?.value);
      onChangeValue(value);
    };

    return <input id={id} ref={inputRef} type="number" onChange={onChange} />;
  },
);

export { TextInput, NumberInput };
