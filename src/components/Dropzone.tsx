import { useDropzone, Accept } from "react-dropzone";

import { CloudUpload } from "lucide-react";

interface DropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  accept?: Accept;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  onDropRejected?: (fileRejections: any[]) => void;
  onFileDialogCancel?: () => void;
  error?: string;
}

const Dropzone = ({
  onDrop,
  accept,
  multiple,
  maxFiles,
  maxSize,
  onDropRejected,
  onFileDialogCancel,
  error,
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

  const files = acceptedFiles.map((file) => (
    <li key={file.name}>
      {file.name} - {(file.size / 1024 / 1024).toFixed(2)} MB
    </li>
  ));

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isDragActive ? "active" : ""} ${
        error ? "error" : ""
      }`}>
      <input {...getInputProps()} />
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
      {error && <p className='error-msg'>{error}</p>}
    </div>
  );
};

export default Dropzone;
