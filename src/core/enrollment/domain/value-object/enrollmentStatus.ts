import { ValueObject } from "@core/@shared/domain/value-object/value-object";
import { EntityValidationError } from "@core/@shared/erros/validate.error";

export enum Status {
    ENROLLED = 'enrolled',
    COMPLETED = 'completed',
    DROPPED = 'dropped',
}

export class EnrollmentStatus extends ValueObject{
    constructor(readonly type: Status){
        super()
        this.validateType(type);
    }

    private validateType(type: any): void {
        if (!Object.values(Status).includes(type)) {
            throw new EntityValidationError([{status: ["status must be valid, like: enrolled, completed or droped"]}]);
        }
    }

    public static create(type: any): EnrollmentStatus {
        if (this.isValidType(type)) {
            return new EnrollmentStatus(type);
        }
        throw new EntityValidationError([{status: ["status must be valid, like: enrolled, completed or droped"]}]);
    }

    public static isValidType(type: any): boolean {
        return Object.values(Status).includes(type);
    }
}

// export class InvalidStatusTypeError extends Error{
//     constructor(invalidType: any){
//         super(`Invalid status type: ${invalidType}`)
//         this.name = 'InvalidStatusTypeError'
//     }
// }