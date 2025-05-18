export interface Option {
  label: string;
  value: string | number;
  description?: string;
}

export interface UploadedFile {
  id: string;
  file: File;
  dataUrl: string;
  name: string;
  size: number;
  type: string;
}

export interface Errors {
  [key: string]: string;
}
