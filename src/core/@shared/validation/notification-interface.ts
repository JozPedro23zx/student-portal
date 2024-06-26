export type FieldsErrors =
  | {
      [field: string]: string[];
    }
  | string;


export type ErrorProps = {
    message: string | string[];
    field?: string;
}

export interface NotificationErrorInterface {
    addError(error: ErrorProps): void;
    hasErrors(): boolean;
    getErrors(): any;
    messages(): FieldsErrors[];
}