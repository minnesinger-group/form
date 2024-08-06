import { FunctionComponent } from 'preact';
import { HTMLAttributes, memo } from 'preact/compat';

export interface LabelSetup {
  id: string;
}

export interface LabelProps extends HTMLAttributes<HTMLLabelElement> {
  setup: LabelSetup;
}

const Label: FunctionComponent<LabelProps> = memo(({ setup: { id }, children, ...props }) => {
  console.log('Label: ', id);

  return <label for={id} {...props}>{children}</label>;
});

export default Label;
