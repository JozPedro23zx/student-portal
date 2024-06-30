import { IUseCase } from "@core/@shared/application/use-case-interface";
import { ClassRoomOutput, ClassRoomOutputMapper } from "../output";
import { IClassRoomRepository } from "@core/classroom/infrastructure/classroom-interface.repository";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { CustomNotFoundError } from "@core/@shared/erros/not-found.error";
import { ClassRoom } from "@core/classroom/domain/calssroom.entity";

export class FindClassRoomUsecase implements IUseCase<FindClassRoomUsecaseInput, ClassRoomOutput>{
    constructor(private classRoomRepository: IClassRoomRepository) {}
    
    async execute(input: FindClassRoomUsecaseInput): Promise<ClassRoomOutput> {
        const classRoom = await this.classRoomRepository.find(new Uuid(input.id));

        if (!classRoom){
            throw new CustomNotFoundError(input.id, ClassRoom.name);
        }

        return ClassRoomOutputMapper.toOutput(classRoom);
    }
}

export type FindClassRoomUsecaseInput = {
    id: string;
}