import { IUseCase } from "@core/@shared/application/use-case-interface";
import { IStudentRepository } from "@core/student/infrastructure/student-interface.repository";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";

export class DeleteStudentUsecase implements IUseCase<InputDeleteStudentUsecase, void>{
    constructor(private readonly studentRepo: IStudentRepository){}

    async execute(input: InputDeleteStudentUsecase): Promise<void> {
        await this.studentRepo.delete(new Uuid(input.id));
    }
}

export type InputDeleteStudentUsecase = {
    id: string
}