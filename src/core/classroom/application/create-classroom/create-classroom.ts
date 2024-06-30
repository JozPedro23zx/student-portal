import { IUseCase } from "@core/@shared/application/use-case-interface";
import { ClassRoomOutput, ClassRoomOutputMapper } from "../output";
import { CreateClassRoomInputProps } from "./input-create-classroom";
import { IClassRoomRepository } from "@core/classroom/infrastructure/classroom-interface.repository";
import { ClassRoom } from "@core/classroom/domain/calssroom.entity";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { EntityValidationError } from "@core/@shared/erros/validate.error";

export class CreateClassRoomUseCase implements IUseCase<CreateClassRoomInputProps, ClassRoomOutput>{
    constructor(private classRoomRepository: IClassRoomRepository) {}

    async execute(input: CreateClassRoomInputProps): Promise<ClassRoomOutput> {
        const classRoom = new ClassRoom({
            id: new Uuid(),
            grade_level: input.grade_level,
            start_date: new Date(input.start_date),
            end_date: new Date(input.end_date),
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        classRoom.validateDate();

        if(classRoom.notifications.hasErrors()){
            throw new EntityValidationError(classRoom.notifications.messages());
        }

        await this.classRoomRepository.create(classRoom);

        return ClassRoomOutputMapper.toOutput(classRoom);
    }
}
