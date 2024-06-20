import { FieldsErrors } from "../validation/notification-interface";

export class EntityValidationError extends Error{
    constructor(public error: FieldsErrors[]){
        super("Invalid Data Error")
    }
}