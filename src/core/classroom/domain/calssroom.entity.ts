import BaseEntity from "@core/@shared/domain/entity/base-entity";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";

type ClassRoomProps = {
    id?: Uuid;
    grade_level: string;
    start_date: Date;
    end_date: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export class ClassRoom extends BaseEntity {
    grade_level: string;
    start_date: Date;
    end_date: Date;

    constructor(props: ClassRoomProps){
        super(props.id, props.createdAt, props.updatedAt);
        this.grade_level = props.grade_level;
        this.start_date = props.start_date;
        this.end_date = props.end_date;
    }

    changeGradeLevel(level: string){
        this.grade_level = level
    }

    changeStartDate(date: Date){
        this.start_date = date
    }

    changeEndDate(date: Date){
        this.end_date = date
    }

    validateDate(){
        const start_year = this.start_date.getFullYear();
        const start_month = this.start_date.getMonth();
        
        const end_year = this.end_date.getFullYear();
        const end_month = this.end_date.getMonth();

        const diff = (end_year - start_year) * 12 + (end_month - start_month);

        if(diff > 10){
            this.notifications.addError({message: "the period must be less than 10", field: "start_date"})
        }
    }

    toJSON(){
        return {
            id: this.entityId.id,
            grade_level: this.grade_level,
            start_date: this.start_date,
            end_date: this.end_date
        }
    }
}