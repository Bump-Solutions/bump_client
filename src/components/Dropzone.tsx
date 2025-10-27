import { Accept, useDropzone } from "react-dropzone";

import { CloudUpload } from "lucide-react";
import { MouseEvent } from "react";

interface DropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  onDropRejected?: (fileRejections: any[]) => void;
  onFileDialogCancel?: () => void;
  accept?: Accept;
  multiple?: boolean;
  maxFiles: number;
  maxSize?: number;
  isInvalid?: boolean;
}

const Dropzone = ({
  onDrop,
  accept,
  multiple,
  maxFiles,
  maxSize,
  onDropRejected,
  onFileDialogCancel,
  isInvalid,
}: DropzoneProps) => {
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      accept,
      onDrop,
      multiple,
      maxSize,
      maxFiles,
      onDropRejected,
      onFileDialogCancel,
    });

  const inputProps = getInputProps({
    onClick: (e: MouseEvent<HTMLInputElement>) => {
      // Trigger change event even if the same file is selected
      (e.target as HTMLInputElement).value = "";
    },
  });

  const files = acceptedFiles.map((file) => (
    <li key={file.name}>
      {file.name} - {(file.size / 1024 / 1024).toFixed(2)} MB
    </li>
  ));

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isDragActive ? "active" : ""} ${
        isInvalid ? "error" : ""
      }`}>
      <input {...inputProps} />
      <CloudUpload />
      {files.length > 0 ? (
        <ul>{files}</ul>
      ) : isDragActive ? (
        <p>
          Engedd el a {maxFiles > 1 ? "fájlokat" : "fájlt"} a feltöltéshez...
        </p>
      ) : (
        <p>
          Húzd ide a {maxFiles > 1 ? "fájlokat" : "fájlt"}, vagy kattints a
          kiválasztásához.
        </p>
      )}
    </div>
  );
};

export default Dropzone;
