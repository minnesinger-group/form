import { FunctionComponent } from 'preact';
import { Ref, useState } from 'preact/hooks';
import { HTMLAttributes, useImperativeHandle } from 'preact/compat';

import { FieldValidateResult } from '../validation';

export type ErrorHintRefType = Ref<{
  setResult: (value: FieldValidateResult<any, any>) => void;
}>;

export interface ErrorHintSetup {
  ref: ErrorHintRefType;
  defaultResult: FieldValidateResult<any, any>;
}

export interface ErrorHintProps extends HTMLAttributes<HTMLSpanElement> {
  setup: ErrorHintSetup;
}

const ErrorHint: FunctionComponent<ErrorHintProps> = ({ setup: { ref, defaultResult }, ...props }) => {
  const [prevResult, setPrevResult] = useState<FieldValidateResult<any, any> | null>(null);
  const [result, setResult] = useState<FieldValidateResult<any, any>>(defaultResult);

  useImperativeHandle(ref, () => ({
    setResult: (newResult: FieldValidateResult<any, any>) => {
      setPrevResult(result);
      setResult(newResult);
    },
  }));

  return <span {...props} data-active={!result.success}>
    {result.success ? (prevResult === null || prevResult.success ? ' ' : prevResult.message) : result.message}
  </span>;
};

export default ErrorHint;
