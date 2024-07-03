import BaseEntity from "@core/@shared/domain/entity/base-entity";
import { Subject } from "./value-object/subject.vo";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { GradeValidatorFactory } from "./grade.validator";


export type GradeProps = {
    id?: Uuid;
    student_id: string;
    subject: Subject;
    exam: number;
    assignment: number;
    others: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Grade extends BaseEntity{
    student_id: string;
    subject: Subject;
    exam: number;
    assignment: number;
    others: number;

    constructor(props: GradeProps){
        super(props.id, props.createdAt, props.updatedAt)
        this.student_id = props.student_id,
        this.subject = props.subject,
        this.exam = props.exam,
        this.assignment = props.assignment,
        this.others = props.others
    }

    manageExamGrade(grade: number){
        this.exam = grade
        this.validate();
    }

    manageAssignmentGrade(grade: number){
        this.assignment = grade
        this.validate();
    }

    manageOthersGrade(grade: number){
        this.others = grade
        this.validate();
    }

    getGrade(){
        return (this.exam + this.assignment + this.others) / 3
    }

    validate(){
        const validator = GradeValidatorFactory.create();
        const err = validator.validate(this.notifications, this);
        return err
    }

    toJson(){
        return{
            id: this.entityId.id,
            student_id: this.student_id,
            subject: this.subject.type,
            exam: this.exam,
            assignment: this.assignment,
            others: this.others,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        }
    }
}