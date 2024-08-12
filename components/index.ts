import {
  NumberInput,
  NumberInputSetup,
  NumberInputValueType,
  TextInput,
  TextInputSetup,
  TextInputValueType,
} from './Input';
import FileInput, { FileInputSetup, FileInputValueType } from './File';
import Label, { LabelSetup } from './Label';
import ErrorHint, { ErrorHintSetup } from './ErrorHint';

type InputDescriptions = {
  Text: {
    value: TextInputValueType;
    setup: TextInputSetup;
  };
  Number: {
    value: NumberInputValueType;
    setup: NumberInputSetup;
  };
  File: {
    value: FileInputValueType;
    setup: FileInputSetup;
  };
};

export type InputType = keyof InputDescriptions;
export type InputValueType<T extends InputType> = InputDescriptions[T]['value'];
export type ComponentSetupType<T extends InputType> = {
  input: InputDescriptions[T]['setup'];
  label: LabelSetup;
  error: ErrorHintSetup;
};
export type InputConfigType<T extends InputType> = {
  type: T;
} & Pick<InputDescriptions[T]['setup'], 'options'>;

export { Label, ErrorHint, NumberInput, TextInput, FileInput };
