import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsPositive, IsString, validateSync } from "class-validator";

export type CreateTeacherInputProps = {
    first_name: string;
    last_name: string;
    subject_specialization: string[];
    date_of_birth: Date;
    street: string;
    number: number;
    city: string;
    phone_number?: string;
}

export default class CreateTeacherInput {
    @IsString()
    @IsNotEmpty()
    first_name: string;

    @IsString()
    @IsNotEmpty()
    last_name: string;

    @IsArray()
    @IsNotEmpty()
    subject_specialization: string[];

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

    constructor(props: CreateTeacherInputProps){
        if (!props) return;
        this.first_name = props.first_name;
        this.last_name = props.last_name;
        this.subject_specialization = props.subject_specialization;
        this.date_of_birth = props.date_of_birth;
        this.street = props.street;
        this.number = props.number;
        this.city = props.city;
        this.phone_number = props.phone_number;
    }
}

export class ValidateCreateTeacherInput{
    static validate(input: CreateTeacherInput){
        return validateSync(input);
    }
}