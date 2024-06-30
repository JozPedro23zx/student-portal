import { IsString, IsDateString, IsNotEmpty, validateSync } from 'class-validator';

export type CreateClassRoomInputProps = {
    grade_level: string;
    start_date: Date;
    end_date: Date;
}

export default class CreateClassRoomInput {
    @IsString()
    @IsNotEmpty()
    grade_level: string;

    @IsDateString()
    @IsNotEmpty()
    start_date: Date;

    @IsDateString()
    @IsNotEmpty()
    end_date: Date;

    constructor(props: CreateClassRoomInputProps) {
        if (!props) return;
        this.grade_level = props.grade_level;
        this.start_date = props.start_date;
        this.end_date = props.end_date;
    }
}

export class ValidateCreateClassRoomInput {
    static validate(input: CreateClassRoomInput) {
        return validateSync(input);
    }
}
