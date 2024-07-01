import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { Enrollment } from "@core/enrollment/domain/enrollment";
import { EnrollmentModel } from "./enrollment.model";
import { EnrollmentStatus } from "@core/enrollment/domain/value-object/enrollmentStatus";


export class EnrollmentMapperModel {
  static toModel(entity: Enrollment): EnrollmentModel {
    return EnrollmentModel.build({
      id: entity.entityId.id,
      student_id: entity.student_id,
      class_id: entity.class_id,
      enrollment_date: entity.enrollment_date,
      status: entity.status.type,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toEntity(model: EnrollmentModel): Enrollment {
    const enrollmentStatus = EnrollmentStatus.create(model.status);

    const enrollment = new Enrollment({
      id: new Uuid(model.id),
      student_id: model.student_id,
      class_id: model.class_id,
      enrollment_date: model.enrollment_date,
      status: enrollmentStatus,
      created_at: model.createdAt,
      updated_at: model.updatedAt,
    });
    

    return enrollment;
  }
}
