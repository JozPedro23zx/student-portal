import { Type } from "class-transformer";
import {IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateNested, validateSync } from "class-validator";

export type UpdateStudentInputProps = {
    id: string;
    first_name?: string;
    last_name?: string;
    date_of_birth?: Date;
    address?: {
        street?: string;
        number?: number;
        city?: string;
    };
    phone_number?: string;
}

export class AddressInput{
    @IsString()
    @IsOptional()
    street?: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    number?: number;

    @IsString()
    @IsOptional()
    city?: string;
}

export default class UpdateStudentInput {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsOptional()
    first_name?: string;

    @IsString()
    @IsOptional()
    last_name?: string;

    @IsString()
    @IsOptional()
    date_of_birth?: Date;

    @ValidateNested()
    @IsOptional()
    @Type(() => AddressInput)
    address?: AddressInput;

    @IsString()
    @IsOptional()
    phone_number?: string;

    constructor(props: UpdateStudentInputProps){
        if (!props) return;
        this.id = props.id;
        props.first_name && (this.first_name = props.first_name);
        props.last_name && (this.last_name = props.last_name);
        props.date_of_birth && (this.date_of_birth = props.date_of_birth);
        props.address && (this.address = props.address);
        props.phone_number && (this.phone_number = props.phone_number);
    }
}

export class ValidateUpdateStudentInput{
    static validate(input: UpdateStudentInputProps){
        return validateSync(input);
    }
}