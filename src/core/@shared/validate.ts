import { ValidationError, validateSync } from 'class-validator';

export abstract class ClassValidator {
    validate(data: any, fields: string[]): ValidationError[]{
        const errors = validateSync(data, {groups: fields})
        if (errors.length) {
            return errors
        }
    }
}