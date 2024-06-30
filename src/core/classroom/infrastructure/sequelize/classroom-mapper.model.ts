import { ClassRoom } from "@core/classroom/domain/calssroom.entity";
import { ClassRoomModel } from "./classroom.model";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";

export class ClassRoomMapperModel {
    static toModel(entity: ClassRoom): ClassRoomModel{
        return ClassRoomModel.build({
            id: entity.entityId.id,
            grade_level: entity.grade_level,
            start_date: entity.start_date,
            end_date: entity.end_date,
            createdAt: entity.createdAt || new Date(),
            updatedAt: entity.updatedAt || new Date()
        })
    }

    static toEntity(model: ClassRoomModel): ClassRoom{
        return new ClassRoom({
            id: new Uuid(model.id),
            grade_level: model.grade_level,
            start_date: model.start_date,
            end_date: model.end_date,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt
        });
    }
}