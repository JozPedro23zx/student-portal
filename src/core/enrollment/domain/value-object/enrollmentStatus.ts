import { ValueObject } from "@core/@shared/domain/value-object/value-object";

export enum Status {
    ENROLLED = 'enrolled',
    COMPLETED = 'completed',
    DROPPED = 'droped',
}

export class EnrollmentStatus extends ValueObject{
    constructor(readonly type: Status){
        super()
        this.validateType(type);
    }

    private validateType(type: any): void {
        if (!Object.values(Status).includes(type)) {
            throw new InvalidStatusTypeError(type);
        }
    }

    public static create(type: any): EnrollmentStatus {
        if (this.isValidType(type)) {
            return new EnrollmentStatus(type);
        }
        throw new InvalidStatusTypeError(type);
    }

    public static isValidType(type: any): boolean {
        return Object.values(Status).includes(type);
    }
}

export class InvalidStatusTypeError extends Error{
    constructor(invalidType: any){
        super(`Invalid status type: ${invalidType}`)
        this.name = 'InvalidStatusTypeError'
    }
}