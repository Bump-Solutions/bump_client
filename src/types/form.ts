export interface Errors {
  [key: string]: string;
}

export interface FileUpload {
  id: string;
  file: File;
  dataUrl: string;
  name: string;
  size: number;
  type: string;
}
