import { IUseCase } from "@core/@shared/application/use-case-interface";
import { IClassRoomRepository } from "@core/classroom/infrastructure/classroom-interface.repository";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";

export class DeleteClassRoomUsecase implements IUseCase<DeleteClassRoomInput, void>{
    constructor(private classRoomRepository: IClassRoomRepository) {}

    async execute(input: DeleteClassRoomInput): Promise<void> {
        await this.classRoomRepository.delete(new Uuid(input.id))
    }
}

export type DeleteClassRoomInput = {
    id: string;
}