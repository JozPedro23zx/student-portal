import { IUseCase } from "@core/@shared/application/use-case-interface";
import { TeacherOutput, TeacherOutputMapper } from "../teacher-output";
import { ITeacherRepository } from "@core/teacher/infrastructure/teacher-interface.repository";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";
import { CustomNotFoundError } from "@core/@shared/erros/not-found.error";
import { Teacher } from "@core/teacher/domain/teacher.entity";

export class FindAllTeacherUsecase implements IUseCase<FindAllTeacherUsecaseInput, TeacherOutput[]>{
    constructor(private readonly teacherRepo: ITeacherRepository){}

    async execute(input?: FindAllTeacherUsecaseInput): Promise<TeacherOutput[]> {
        let teachers: Teacher[];

        
        if (!input || !Array.isArray(input.ids)) {
            teachers = await this.teacherRepo.findAll();
        }else {
            let uuids = input.ids.map((id) => new Uuid(id));
            teachers = await this.teacherRepo.findByIds(uuids);
        }
        //console.log(teachers)

        if (teachers.length === 0) {
            throw new CustomNotFoundError(input.ids, Teacher.name);
        }
        
        let output: TeacherOutput[] = [];
        for (let teacher of teachers){
            let out = TeacherOutputMapper.toOutput(teacher);
            output.push(out);
        }

        return output;
    }
}

export type FindAllTeacherUsecaseInput = {
    ids?: string[]
}