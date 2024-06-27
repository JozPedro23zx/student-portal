import { IUseCase } from "@core/@shared/application/use-case-interface";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { ITeacherRepository } from "@core/teacher/infrastructure/teacher-interface.repository";

export class DeleteTeacherUsecase implements IUseCase<InputDeleteTeacherUsecase, void>{
    constructor(private readonly studentRepo: ITeacherRepository){}

    async execute(input: InputDeleteTeacherUsecase): Promise<void> {
        await this.studentRepo.delete(new Uuid(input.id));
    }
}

export type InputDeleteTeacherUsecase = {
    id: string
}