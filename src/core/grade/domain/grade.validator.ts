import { NotificationErrorInterface } from "@core/@shared/validation/notification-interface";
import { ClassValidator } from "@core/@shared/validation/validate";
import { Max, Min } from "class-validator";
import { Grade } from "./grade.entity";

export class GradeDomainRules{
    @Min(-10)
    @Max(10)
    exam: number;

    @Min(-10)
    @Max(10)
    assignment: number;

    @Min(-10)
    @Max(10)
    others: number;

    constructor(entity: Grade){
        Object.assign(this, entity)
    }
}

export class GradeDomainValidator extends ClassValidator{
    validate(notification: NotificationErrorInterface, data: any): boolean {
        return super.validate(notification, new GradeDomainRules(data), [])
    }
}

export class GradeValidatorFactory{
    static create(){
        return new GradeDomainValidator();
    }
}