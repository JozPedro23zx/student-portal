import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { Grade } from "../../domain/grade.entity";
import { GradeModel } from "./grade.model";
import { Subject } from "@core/grade/domain/value-object/subject.vo";

export class GradeMapper {
    static toModel(entity: Grade): GradeModel {
        return GradeModel.build({
            id: entity.entityId.id,
            student_id: entity.student_id,
            subject: entity.subject.type,
            exam: entity.exam,
            assignment: entity.assignment,
            others: entity.others,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }

    static toEntity(model: GradeModel): Grade {
        const subject = Subject.create(model.subject)

        return new Grade({
            id: new Uuid(model.id),
            student_id: model.student_id,
            subject: subject,
            exam: model.exam,
            assignment: model.assignment,
            others: model.others,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
        });
    }
}