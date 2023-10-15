import { RenderableProps } from 'preact';

import { ComponentValueType } from './components';
import { FormConfig } from './useForm';

export type FormValues<C extends FormConfig> = {
  [key in keyof C]: ComponentValueType<C[key]['type']>;
};

export type FormComponentSetup<C extends FormConfig> = {
  values: FormValues<C>;
  onSubmit: (values: FormValues<C>) => void;
};

interface FormProps<C extends FormConfig> {
  setup: FormComponentSetup<C>;
  class?: string;
}

const Form = <C extends FormConfig>({
  setup: { onSubmit, values },
  class: className,
  children,
}: RenderableProps<FormProps<C>>) => {
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} class={`${className ? className : ''}`}>
      {children}
    </form>
  );
};

export default Form;
