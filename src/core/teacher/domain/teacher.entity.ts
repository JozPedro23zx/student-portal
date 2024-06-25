import BaseEntity from "@core/@shared/domain/entity/base-entity";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { Address } from "./value-object/address.vo";
import { Subject } from "./value-object/subject.vo";
import { TeacherValidatorFactory } from "./teacher.valitator";

export type TeacherProps = {
    id?: Uuid;
    first_name: string;
    last_name: string;
    subject_specialization: Subject[];
    date_of_birth: Date;
    address: Address;
    phone_number?: string;
    createdAt?: Date,
    updatedAt?: Date,
}

export class Teacher extends  BaseEntity{
    first_name: string;
    last_name: string;
    subject_specialization: Subject[];
    date_of_birth: Date;
    address: Address;
    phone_number: string | null;

    constructor(props: TeacherProps){
        super(props.id, props.createdAt, props.updatedAt);
        this.first_name = props.first_name;
        this.last_name = props.last_name;
        this.subject_specialization = props.subject_specialization;
        this.date_of_birth = props.date_of_birth;
        this.address = props.address;
        this.phone_number = props.phone_number;
    }

    changeName(first?: string, last?: string): void{
        this.first_name = first ? first : this.first_name;
        this.last_name = last ? last : this.last_name;
        this.validate()
    }

    addSubjectSpecialization(subject: Subject): void {
        if (!this.subject_specialization.some(s => s.type === subject.type)) {
            this.subject_specialization.push(subject);
        }
    }

    removeSubjectSpecialization(subject: Subject): void {
        this.subject_specialization = this.subject_specialization.filter(s => s.type !== subject.type);
    }

    changeBirthday(date: Date){
        this.date_of_birth = date;
    }

    changeAddress(address: Address){
        this.address = address;
    }

    changePhone(number: string){
        this.phone_number = number;
    }

    validate(){
        const validator = TeacherValidatorFactory.create();
        const err = validator.validate(this.notifications, this);
        this.newUpdatedAt = new Date(Date.now())
        return err
    }

    toJSON(){
        return {
            id: this.entityId.id,
            first_name: this.first_name,
            last_name: this.last_name,
            date_of_birth: this.date_of_birth,
            address: this.address,
            phone_number: this.phone_number
        }
    }
}