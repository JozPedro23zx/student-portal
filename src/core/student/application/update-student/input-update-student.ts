import { Type } from "class-transformer";
import { IsDate, IsDefined, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsPositive, IsString, ValidateNested, validateSync } from "class-validator";

export type UpdateStudentInputProps = {
    id: string;
    first_name: string;
    last_name: string;
    date_of_birth: Date;
    address: {
        street: string;
        number: number;
        city: string;
    };
    phone_number?: string;
}

export class AddressInput{
    @IsString()
    @IsDefined()
    street?: string;

    @IsNumber()
    @IsPositive()
    @IsDefined()
    number?: number;

    @IsString()
    @IsDefined()
    city?: string;
}

export default class UpdateStudentInput {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsDefined()
    first_name?: string;

    @IsString()
    @IsDefined()
    last_name?: string;

    @IsDate()
    @IsDefined()
    date_of_birth?: Date;

    @ValidateNested()
    @Type(() => AddressInput)
    address?: AddressInput;

    @IsPhoneNumber(null, { message: 'Invalid Phone Number' })
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