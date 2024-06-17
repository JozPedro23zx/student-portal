import { NotificationErrorInterface, ErrorProps, FieldsErrors } from "./notification-interface";

export class NotificationError implements NotificationErrorInterface{
    private errors = new Map<string, string[] | string>();

    addError(error: ErrorProps): void {
        const field = error.field;
        const message = Array.isArray(error.message) ? error.message.join(', ') : error.message;
        if (field) {
            const errors = (this.errors.get(field) ?? []) as string[];
            errors.indexOf(message) === -1 && errors.push(message);
            this.errors.set(field, errors);
        } else {
            this.errors.set(message, message);
        }
    }

    hasErrors(): boolean {
        return this.errors.size > 0;
    }

    getErrors(): any {
        return this.errors;
    }

    messages(): FieldsErrors[] {
        const errors: Array<string | { [key: string]: string[] }> = [];
        this.errors.forEach((value, key) => {
          if (typeof value === 'string') {
            errors.push(value);
          } else {
            errors.push({ [key]: value });
          }
        });
        return errors;
    }
    
}