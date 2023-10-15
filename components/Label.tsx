import { FunctionComponent } from 'preact';
import { memo } from 'preact/compat';

export interface LabelSetup {
  id: string;
}

export interface LabelProps {
  setup: LabelSetup;
}

const Label: FunctionComponent<LabelProps> = memo(({ setup: { id }, children }) => {
  console.log('Label: ', id);

  return <label for={id}>{children}</label>;
});

export default Label;
