import { RenderableProps } from 'preact';
import { useRef } from 'preact/hooks';
import { memo, useImperativeHandle } from 'preact/compat';

import { InputSetup } from './common';

export interface UploadedFile extends File {
  nameWithoutExtension: string;
  data: Uint8Array;
}

export function buildUploadedFile(name: string, type: string, data: Uint8Array): UploadedFile {
  return Object.assign(new File([data], name, { type, lastModified: new Date().getTime() }), {
    nameWithoutExtension: trimExtension(name),
    data,
  });
}

function buildFileList(files: Array<UploadedFile>): FileList {
  const dataTransfer = new DataTransfer();
  for (const file of files) {
    dataTransfer.items.add(file);
  }
  return dataTransfer.files;
}

function isAcceptedType(accept: Array<string>, type: string | undefined): type is string {
  return accept.some(acceptType => type?.match(acceptType));
}

function trimExtension(filename: string): string {
  const delimiterIndex = filename.indexOf('.');
  return delimiterIndex > 0 ? filename.substring(0, delimiterIndex) : filename;
}

export type FileInputValueType = UploadedFile | null;

export type FileInputSetup = InputSetup<
  FileInputValueType,
  {
    accept: Array<string>;
  }
>;

export interface FileInputProps {
  setup: FileInputSetup;
  class?: string;
  onDragClass?: string;
}

const FileInput = memo(
  ({
     setup: { id, options, onChangeValue, ref },
     onDragClass,
     class: className,
     children,
   }: RenderableProps<FileInputProps>) => {
    console.log('FileInput: ', id);

    const inputRef = useRef<HTMLInputElement>(null);
    const labelRef = useRef<HTMLLabelElement>(null);

    const handleFileList = async (fileList: FileList | null) => {
      if (inputRef.current && fileList) {
        if (fileList.length > 0) {
          if (isAcceptedType(options.accept, fileList[0].type)) {
            inputRef.current.files = fileList;
            await onChange();
          }
        } else {
          inputRef.current.files = fileList;
          onChangeValue(null);
        }
      }
    };

    useImperativeHandle(ref, () => ({
      setValue: async value => {
        await handleFileList(buildFileList(value ? [value] : []));
      },
      setValid: (isValid: boolean) => {
        if (labelRef.current) {
          labelRef.current.dataset.valid = `${isValid}`;
        }
      },
    }));

    const addLabelOnDragClass = () => {
      if (onDragClass && labelRef.current && !labelRef.current.classList.contains(onDragClass)) {
        labelRef.current.classList.add(onDragClass);
      }
    };

    const removeLabelOnDragClass = () => {
      if (onDragClass && labelRef.current && labelRef.current.classList.contains(onDragClass)) {
        labelRef.current.classList.remove(onDragClass);
      }
    };

    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy';
        addLabelOnDragClass();
      }
    };

    const onDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      removeLabelOnDragClass();
    };

    const onDrop = async (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      await handleFileList(e.dataTransfer?.files ?? null);
      removeLabelOnDragClass();
    };

    const onChange = async () => {
      const file = inputRef.current?.files?.[0];
      if (file) {
        const buffer = await file.arrayBuffer();
        const newFile = Object.assign(file, {
          nameWithoutExtension: trimExtension(file.name),
          data: new Uint8Array(buffer),
        });
        onChangeValue(newFile);
      }
    };

    return (
      <>
        <label
          class={`file-input-root ${className ? className : ''}`}
          for={id}
          ref={labelRef}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          data-valid="true"
        >
          {children}
        </label>
        <input
          id={id}
          ref={inputRef}
          type="file"
          accept={options.accept.join(',')}
          onChange={onChange}
          style={{ display: 'none' }}
        />
      </>
    );
  },
);

export default FileInput;
