import { ClassValidator } from "@core/@shared/validate";
import { IsNotEmpty, MaxDate, ValidationError } from "class-validator";
import { Student } from "./student.entity";
import { Address } from "./value-object/address.vo";
import { Type } from "class-transformer";

export class StudentDomainRules{
    @IsNotEmpty()
    first_name: string;

    @IsNotEmpty()
    last_name: string;

    @MaxDate(minimalDate())
    date_of_birth: Date;

    @Type(() => Address)
    address: Address;

    constructor(entity: Student){
        Object.assign(this, entity)
    }
}

function minimalDate(): Date{
    const currentlyDate = new Date();
    currentlyDate.setDate(Date.now());
    
    const restrictionDate = new Date(currentlyDate.getFullYear() - 14)

    return restrictionDate
}

export class StudentDomainValidator extends ClassValidator{
    validate(data: any): ValidationError[] {
        return super.validate(new StudentDomainRules(data));
    }
}

export class StudentValidatorFactory{
    static create(){
        return new StudentDomainValidator();
    }
}