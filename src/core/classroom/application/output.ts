import { ClassRoom } from "../domain/calssroom.entity";

export type ClassRoomOutput = {
    id: string;
    grade_level: string;
    start_date: Date;
    end_date: Date;
    createdAt: Date;
    updatedAt: Date;
}

export class ClassRoomOutputMapper {
    static toOutput(entity: ClassRoom): ClassRoomOutput {
        return {
            id: entity.entityId.id,
            grade_level: entity.grade_level,
            start_date: entity.start_date,
            end_date: entity.end_date,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        }
    }
}
