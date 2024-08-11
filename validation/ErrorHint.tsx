import { FunctionComponent } from 'preact';
import { useRef } from 'preact/hooks';
import { HTMLAttributes } from 'preact/compat';

import { FieldValidateResult } from './FieldValidator';

interface ErrorHintProps extends HTMLAttributes<HTMLSpanElement> {
  result: FieldValidateResult<any, any>;
}

const usePrevious = (value: FieldValidateResult<any, any>) => {
  const ref = useRef<{ value: FieldValidateResult<any, any>, prev: FieldValidateResult<any, any> | null }>({
    value: value,
    prev: null,
  });

  if (value !== ref.current.value) {
    ref.current = { value: value, prev: ref.current.value };
  }

  return ref.current.prev;
};

const ErrorHint: FunctionComponent<ErrorHintProps> = ({ result, ...props }) => {
  const prevResult = usePrevious(result);

  return <span {...props} data-active={!result.success}>
    {result.success ? (prevResult === null || prevResult.success ? ' ' : prevResult.message) : result.message}
  </span>;
};

export default ErrorHint;
