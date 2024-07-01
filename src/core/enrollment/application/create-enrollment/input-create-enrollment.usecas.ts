import { IsDateString, IsNotEmpty, IsString, validateSync } from "class-validator";

export type CreateEnrollmentInputProps = {
    student_id: string;
    class_id: string;
    enrollment_date: Date;
    status: string;
}

export default class CreateEnrollmentInput {
    @IsString()
    @IsNotEmpty()
    student_id: string;

    @IsString()
    @IsNotEmpty()
    class_id: string;

    @IsDateString()
    @IsNotEmpty()
    enrollment_date: Date;

    @IsString()
    @IsNotEmpty()
    status: string;

    constructor(props: CreateEnrollmentInputProps){
        if (!props) return;
        this.student_id = props.student_id;
        this.class_id = props.class_id;
        this.enrollment_date = props.enrollment_date;
        this.status = props.status;
    }
}

export class ValidateCreateEnrollmentInput {
    static validate(input: CreateEnrollmentInput) {
        return validateSync(input);
    }
}
