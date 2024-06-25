import { ClassValidator } from "@core/@shared/validation/validate";
import { IsNotEmpty, MaxDate, MaxLength, ValidationError } from "class-validator";
import { Teacher } from "./teacher.entity";
import { NotificationErrorInterface } from "@core/@shared/validation/notification-interface";

export class TeacherDomainRules{
    @IsNotEmpty()
    @MaxLength(255)
    first_name: string;

    @IsNotEmpty()
    @MaxLength(255)
    last_name: string;

    constructor(entity: Teacher){
        Object.assign(this, entity)
    }
}

export class TeacherDomainValidator extends ClassValidator{
    validate(notification: NotificationErrorInterface, data: any): boolean {
        return super.validate(notification, new TeacherDomainRules(data), ["name"]);
    }
}

export class TeacherValidatorFactory{
    static create(){
        return new TeacherDomainValidator();
    }
}