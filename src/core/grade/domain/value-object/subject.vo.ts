import { ValueObject } from "@core/@shared/domain/value-object/value-object";

export enum Subjects{
    ENGLISH = "english",
    MATH = "math",
    HISTORY = "history",
    GEOGRAPHY = "geography",
    SCIENCE = "science"
}

export class Subject extends ValueObject{
    constructor(readonly type: Subjects){
        super()
        this.validateType(type);
    }

    private validateType(type: any): void {
        if (!Object.values(Subjects).includes(type)) {
            throw new InvalidSubjectTypeError(type);
        }
    }

    public static create(type: any): Subject {
        if (this.isValidType(type)) {
            return new Subject(type);
        }
        throw new InvalidSubjectTypeError(type);
    }

    public static isValidType(type: any): boolean {
        return Object.values(Subjects).includes(type);
    }
}

export class InvalidSubjectTypeError extends Error{
    constructor(invalidType: any){
        super(`Invalid subject type: ${invalidType}`)
        this.name = 'InvalidSubjectTypeError'
    }
}