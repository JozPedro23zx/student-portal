import BaseEntity from "@core/@shared/domain/entity/base-entity";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { Address } from "./value-object/address.vo";

export type StudentProps = {
    id?: Uuid;
    first_name: string;
    last_name: string;
    date_of_birth: Date;
    address: Address;
    phone_number?: string;
    createdAt?: Date,
    updatedAt?: Date,
}

export class Student extends  BaseEntity{
    first_name: string;
    last_name: string;
    date_of_birth: Date;
    address: Address;
    phone_number: string | null;

    constructor(props: StudentProps){
        super(props.id, props.createdAt, props.updatedAt);
        this.first_name = props.first_name;
        this.last_name = props.last_name;
        this.date_of_birth = props.date_of_birth;
        this.address = props.address;
        this.phone_number = props.phone_number;
    }

    changeName(first?: string, last?: string): void{
        this.first_name = first ? first : this.first_name;
        this.last_name = last ? last : this.last_name;
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

    toJSON(){
        return {
            id: this.uuid.id,
            first_name: this.first_name,
            last_name: this.last_name,
            date_of_birth: this.date_of_birth,
            address: this.address,
            phone_number: this.phone_number
        }
    }
}