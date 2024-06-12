import { ClassValidator } from "@core/@shared/validate";
import { IsNotEmpty, MaxDate, ValidationError } from "class-validator";
import { Student } from "./student.entity";

export class StudentDomainRules{
    @IsNotEmpty({groups: ['name']})
    first_name: string;

    @IsNotEmpty({groups: ['name']})
    last_name: string;

    @MaxDate(minimalDate(), {groups: ['date']})
    date_of_birth: Date;

    constructor(entity: Student){
        Object.assign(this, entity)
    }
}

function minimalDate(): Date{
    const currentlyDate = new Date(Date.now())
    const restrictionDate = new Date(currentlyDate.getFullYear() - 14, 1,)
    return restrictionDate
}

export class StudentDomainValidator extends ClassValidator{
    validate(data: any, fields: string[]): ValidationError[] {
        return super.validate(new StudentDomainRules(data), fields);
    }
}

export class StudentValidatorFactory{
    static create(){
        return new StudentDomainValidator();
    }
}