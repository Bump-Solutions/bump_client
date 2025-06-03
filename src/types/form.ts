export interface Option<T = string | number> {
  label: string;
  value: T;
  description?: string;
}

export interface Errors {
  [key: string]: string;
}

export interface UploadedFile {
  id: string;
  file: File;
  dataUrl: string;
  name: string;
  size: number;
  type: string;
}
