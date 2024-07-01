import BaseEntity from "@core/@shared/domain/entity/base-entity";
import { EnrollmentStatus } from "./value-object/enrollmentStatus";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";

export type EnrollmentProps = {
    id?: Uuid;
    student_id: string;
    class_id: string;
    enrollment_date: Date;
    status: EnrollmentStatus;
    created_at?: Date;
    updated_at?: Date;
}

export class Enrollment extends BaseEntity {
    student_id: string;
    class_id: string;
    enrollment_date: Date;
    status: EnrollmentStatus;

    constructor(props: EnrollmentProps) {
        super(props.id, props.created_at, props.updated_at)
        this.student_id = props.student_id;
        this.class_id = props.class_id;
        this.enrollment_date = props.enrollment_date;
        this.status = props.status;
    }

    updateStatus(status: EnrollmentStatus) {
        this.status = status;
    }

    toJSON(){
        return {
            id: this.entityId.id,
            student_id: this.student_id,
            class_id: this.class_id,
            enrollment_date: this.enrollment_date,
            status: this.status
        }
    }
}

