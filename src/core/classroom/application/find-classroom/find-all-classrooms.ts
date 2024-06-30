import { IUseCase } from "@core/@shared/application/use-case-interface";
import { ClassRoomOutput, ClassRoomOutputMapper } from "../output";
import { IClassRoomRepository } from "@core/classroom/infrastructure/classroom-interface.repository";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { CustomNotFoundError } from "@core/@shared/erros/not-found.error";
import { ClassRoom } from "@core/classroom/domain/calssroom.entity";

export class FindAllClassRoomsUsecase implements IUseCase<FindAllClassRoomsUsecaseInput, ClassRoomOutput[]>{
    constructor(private classRoomRepository: IClassRoomRepository) {}
    
    async execute(input?: FindAllClassRoomsUsecaseInput): Promise<ClassRoomOutput[]> {
        let classRooms: ClassRoom[];

        if (!input || !Array.isArray(input.ids)) {
            classRooms = await this.classRoomRepository.findAll();
        }else {
            let uuids = input.ids.map((id) => new Uuid(id));
            classRooms = await this.classRoomRepository.findByIds(uuids);
        }

        if (classRooms.length === 0){
            throw new CustomNotFoundError(input.ids, ClassRoom.name);
        }

        let output: ClassRoomOutput[] = [];
        for (let classRoom of classRooms){
            let out = ClassRoomOutputMapper.toOutput(classRoom);
            output.push(out);
        }

        return output;
    }
}

export type FindAllClassRoomsUsecaseInput = {
    ids?: string[];
}