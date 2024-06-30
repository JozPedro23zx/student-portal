import { IUseCase } from "@core/@shared/application/use-case-interface";
import { ClassRoomOutput, ClassRoomOutputMapper } from "../output";
import { UpdateClassRoomInputProps } from "./input-update-classroom";
import { IClassRoomRepository } from "@core/classroom/infrastructure/classroom-interface.repository";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { CustomNotFoundError } from "@core/@shared/erros/not-found.error";
import { ClassRoom } from "@core/classroom/domain/calssroom.entity";

export class UpdateClassRoomUseCase implements IUseCase<UpdateClassRoomInputProps, ClassRoomOutput> {
    constructor(private classRoomRepository: IClassRoomRepository) {}

    async execute(input: UpdateClassRoomInputProps): Promise<ClassRoomOutput> {
        const classRoom = await this.classRoomRepository.find(new Uuid(input.id));
        if (!classRoom) {
            throw new CustomNotFoundError(input.id, ClassRoom.name);
        }

        input.grade_level && classRoom.changeGradeLevel(input.grade_level);
        input.start_date && classRoom.changeStartDate(new Date(input.start_date));
        input.end_date && classRoom.changeEndDate(new Date(input.end_date));

        await this.classRoomRepository.update(classRoom);

        return ClassRoomOutputMapper.toOutput(classRoom);
    }
}
