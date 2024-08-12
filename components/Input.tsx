import { RenderableProps } from 'preact';
import { memo, useImperativeHandle, HTMLAttributes } from 'preact/compat';
import { useRef } from 'preact/hooks';

import { InputSetup } from './common';

export type TextInputValueType = string | null;
export type NumberInputValueType = number | null;

export type TextInputSetup = InputSetup<TextInputValueType, {}>;
export type NumberInputSetup = InputSetup<NumberInputValueType, {}>;

export interface TextInputProps extends HTMLAttributes<HTMLInputElement> {
  setup: TextInputSetup;
}

export interface NumberInputProps extends HTMLAttributes<HTMLInputElement> {
  setup: NumberInputSetup;
}

const TextInput = memo(({ setup: { id, onChangeValue, ref }, ...props }: RenderableProps<TextInputProps>) => {
  console.log('TextInput: ', id);
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    setValue: async (value: string | null) => {
      if (inputRef.current) {
        inputRef.current.value = value?.toString() ?? '';
        onChange();
      }
    },
    setValid: (isValid: boolean) => {
      if (inputRef.current) {
        inputRef.current.dataset.valid = `${isValid}`;
      }
    },
  }));

  const onChange = () => {
    const value = inputRef.current?.value ?? null;
    onChangeValue(value);
  };

  return <input id={id} ref={inputRef} type="text" onChange={onChange} data-valid="true" {...props} />;
});

const NumberInput = memo(
  ({ setup: { id, onChangeValue, ref }, ...props }: RenderableProps<NumberInputProps>) => {
    console.log('NumberInput: ', id);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      setValue: async (value: number | null) => {
        if (inputRef.current) {
          inputRef.current.value = value?.toString() ?? '';
          onChange();
        }
      },
      setValid: (isValid: boolean) => {
        if (inputRef.current) {
          inputRef.current.dataset.valid = `${isValid}`;
        }
      },
    }));

    const onChange = () => {
      const value = Number.isNaN(Number(inputRef?.current?.value))
        ? null
        : Number(inputRef?.current?.value);
      onChangeValue(value);
    };

    return <input id={id} ref={inputRef} type="number" onChange={onChange} data-valid="true" {...props} />;
  },
);

export { TextInput, NumberInput };
