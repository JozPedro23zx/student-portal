import { IsString, IsNotEmpty, IsNumber, validateSync } from "class-validator";

export type CreateGradeInputProps = {
    student_id: string;
    subject: string;
    exam: number;
    assignment: number;
    others: number;
}

export default class CreateGradeInput {
    @IsString()
    @IsNotEmpty()
    student_id: string;

    @IsString()
    @IsNotEmpty()
    subject: string;

    @IsNumber()
    @IsNotEmpty()
    exam: number;

    @IsNumber()
    @IsNotEmpty()
    assignment: number;

    @IsNumber()
    @IsNotEmpty()
    others: number;

    constructor(props: CreateGradeInputProps){
        if (!props) return;
        this.student_id = props.student_id;
        this.subject = props.subject;
        this.exam = props.exam;
        this.assignment = props.assignment;
        this.others = props.others;
    }
}

export class ValidateCreateGradeInput {
    static validate(input: CreateGradeInput) {
        return validateSync(input);
    }
}