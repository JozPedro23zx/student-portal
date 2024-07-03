import { IsNotEmpty, IsNumber, IsString, IsUUID, Min, Max, validateSync, IsOptional } from 'class-validator';

export type UpdateGradeInputProps = {
    id: string;
    student_id?: string;
    subject?: string;
    exam?: number;
    assignment?: number;
    others?: number;
}

export default class UpdateGradeInput {
    @IsUUID()
    @IsOptional()
    id: string;

    @IsString()
    @IsOptional()
    student_id?: string;

    @IsString()
    @IsOptional()
    subject?: string;

    @IsNumber()
    @Min(0)
    @Max(10)
    @IsOptional()
    exam?: number;

    @IsNumber()
    @Min(0)
    @Max(10)
    @IsOptional()
    assignment?: number;

    @IsNumber()
    @Min(0)
    @Max(10)
    @IsOptional()
    others?: number;

    constructor(props: UpdateGradeInputProps) {
        if (!props) return;
        this.id = props.id;
        props.student_id && (this.student_id = props.student_id);
        props.subject && (this.subject = props.subject);
        props.exam && (this.exam = props.exam);
        props.assignment && (this.assignment = props.assignment);
        props.others && (this.others = props.others);
    }
}

export class ValidateUpdateGradeInput {
    static validate(input: UpdateGradeInput) {
        return validateSync(input);
    }
}
