import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsPositive, IsString, validateSync } from "class-validator";

export type CreateStudentInputProps = {
    first_name: string;
    last_name: string;
    date_of_birth: Date;
    street: string;
    number: number;
    city: string;
    phone_number?: string;
}

export default class CreateStudentInput {
    @IsString()
    @IsNotEmpty()
    first_name: string;

    @IsString()
    @IsNotEmpty()
    last_name: string;

    @IsDateString()
    @IsNotEmpty()
    date_of_birth: Date;

    @IsString()
    @IsNotEmpty()
    street: string;

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    number: number;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsOptional()
    phone_number?: string;

    constructor(props: CreateStudentInputProps){
        if (!props) return;
        this.first_name = props.first_name;
        this.last_name = props.last_name;
        this.date_of_birth = props.date_of_birth;
        this.street = props.street;
        this.number = props.number;
        this.city = props.city;
        this.phone_number = props.phone_number;
    }
}

export class ValidateCreateStudentInput{
    static validate(input: CreateStudentInput){
        return validateSync(input);
    }
}