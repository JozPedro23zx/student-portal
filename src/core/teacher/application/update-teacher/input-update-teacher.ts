import { Type } from "class-transformer";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateNested, validateSync } from "class-validator";

export type UpdateTeacherInputProps = {
    id: string;
    first_name?: string;
    last_name?: string;
    subject_specialization?: string[];
    subject_to_add?: string;
    subject_to_remove?: string;
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

export default class UpdateTeacherInput {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsOptional()
    first_name?: string;

    @IsString()
    @IsOptional()
    last_name?: string;

    @IsOptional({ each: true })
    @IsString({ each: true })
    subject_specialization?: string[];

    @IsString()
    @IsOptional()
    subject_to_add?: string;

    @IsString()
    @IsOptional()
    subject_to_remove?: string;

    @IsDateString()
    @IsOptional()
    date_of_birth?: Date;

    @ValidateNested()
    @IsOptional()
    @Type(() => AddressInput)
    address?: AddressInput;

    @IsString()
    @IsOptional()
    phone_number?: string;

    constructor(props: UpdateTeacherInputProps){
        if (!props) return;
        this.id = props.id;
        props.first_name && (this.first_name = props.first_name);
        props.last_name && (this.last_name = props.last_name);
        props.subject_specialization && (this.subject_specialization = props.subject_specialization);
        props.subject_to_add && (this.subject_to_add = props.subject_to_add);
        props.subject_to_remove && (this.subject_to_remove = props.subject_to_remove);
        props.date_of_birth && (this.date_of_birth = props.date_of_birth);
        props.address && (this.address = props.address);
        props.phone_number && (this.phone_number = props.phone_number);
    }
}

export class ValidateUpdateTeacherInput {
    static validate(input: UpdateTeacherInput) {
        return validateSync(input);
    }
}
