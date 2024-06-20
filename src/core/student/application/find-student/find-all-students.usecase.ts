import { IUseCase } from "@core/@shared/application/use-case-interface";
import { StudentOutput, StudentOutputMapper } from "../output/student-output";
import { IStudentRepository } from "@core/student/infrastructure/student-interface.repository";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { Student } from "@core/student/domain/student.entity";
import { CustomNotFoundError } from "@core/@shared/erros/not-found.error";

export class FindAllStudentUsecase implements IUseCase<FindAllStudentUsecaseInput, StudentOutput[]>{
    constructor(private readonly studentRepo: IStudentRepository){}

    async execute(input?: FindAllStudentUsecaseInput): Promise<StudentOutput[]> {
        let students: Student[];
        if(!input || input.ids.length === 0){
            students = await this.studentRepo.findAll();
        }else if(input.ids.length > 0){
            let uuids = input.ids.map((id) => new Uuid(id));
            students = await this.studentRepo.findByIds(uuids);
        }

        if (students.length === 0) {
            throw new CustomNotFoundError(input.ids, Student.name);
        }
        
        let output: StudentOutput[] = [];
        for (let student of students){
            let out = StudentOutputMapper.toOutput(student);
            output.push(out);
        }

        return output;
    }
}

export type FindAllStudentUsecaseInput = {
    ids?: string[]
}