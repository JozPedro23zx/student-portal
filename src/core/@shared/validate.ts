import { ValidationError, validateSync } from 'class-validator';

export abstract class ClassValidator {
    validate(data: any): ValidationError[]{
        const error = validateSync(data)
        if (error) {
            console.log("Validate error: ", error)
            return error
        }
    }
}