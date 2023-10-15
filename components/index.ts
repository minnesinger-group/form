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

type ComponentDescriptions = {
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

export type ComponentType = keyof ComponentDescriptions;
export type ComponentValueType<T extends ComponentType> = ComponentDescriptions[T]['value'];
export type ComponentSetupType<T extends ComponentType> = {
  input: ComponentDescriptions[T]['setup'];
  label: LabelSetup;
};
export type ComponentConfigType<T extends ComponentType> = {
  type: T;
} & Pick<ComponentDescriptions[T]['setup'], 'options'>;

export { Label, NumberInput, TextInput, FileInput };
