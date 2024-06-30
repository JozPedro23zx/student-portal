import { IsString, IsDateString, IsNotEmpty, IsUUID, validateSync, IsOptional } from 'class-validator';

export type UpdateClassRoomInputProps = {
    id: string;
    grade_level?: string;
    start_date?: Date;
    end_date?: Date;
}

export default class UpdateClassRoomInput {
    @IsUUID()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsOptional()
    grade_level?: string;

    @IsDateString()
    @IsOptional()
    start_date?: Date;

    @IsDateString()
    @IsOptional()
    end_date?: Date;

    constructor(props: UpdateClassRoomInputProps) {
        if (!props) return;
        this.id = props.id;
        props.grade_level && (this.grade_level = props.grade_level);
        props.start_date && (this.start_date = props.start_date);
        props.end_date && (this.end_date = props.end_date);
    }
}

export class ValidateUpdateClassRoomInput {
    static validate(input: UpdateClassRoomInput) {
        return validateSync(input);
    }
}
