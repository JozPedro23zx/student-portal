import { ClassValidator } from "@core/@shared/validation/validate";
import { IsNotEmpty, MaxDate, MaxLength, ValidationError } from "class-validator";
import { Student } from "./student.entity";
import { NotificationErrorInterface } from "@core/@shared/validation/notification-interface";

export class StudentDomainRules{
    @IsNotEmpty({groups: ['name']})
    @MaxLength(255)
    first_name: string;

    @IsNotEmpty({groups: ['name']})
    @MaxLength(255)
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
    validate(notification: NotificationErrorInterface, data: any, fields: string[]): boolean {
        const newFields = fields?.length ? fields : ['name', 'date'];
        return super.validate(notification, new StudentDomainRules(data), newFields);
    }
}

export class StudentValidatorFactory{
    static create(){
        return new StudentDomainValidator();
    }
}