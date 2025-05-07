export interface Option {
  label: string;
  value: string | number;
  description?: string;
}

export interface Errors {
  [key: string]: string;
}
