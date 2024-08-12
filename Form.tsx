import { RenderableProps } from 'preact';

import { InputValueType } from './components';
import { FormConfig } from './useForm';

export type FormValues<C extends FormConfig> = {
  [key in keyof C]: InputValueType<C[key]['type']>;
};

export type FormComponentSetup<C extends FormConfig> = {
  id?: string;
  values: FormValues<C>;
  onSubmit: (values: FormValues<C>) => void;
};

interface FormProps<C extends FormConfig> {
  setup: FormComponentSetup<C>;
  class?: string;
}

const Form = <C extends FormConfig>(
  {
    setup: { id, onSubmit, values },
    class: className,
    children,
  }: RenderableProps<FormProps<C>>) => {
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form {...id ? { id } : {}} onSubmit={handleSubmit} class={`${className ? className : ''}`}>
      {children}
    </form>
  );
};

export default Form;
