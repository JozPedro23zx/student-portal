import { IRepository } from "@core/@shared/infrastructure/repository/repository-interface";
import { Grade } from "../domain/grade.entity";
import { Uuid } from "@core/@shared/domain/value-object/uuid.vo";

export interface IGradeRepository extends IRepository<Grade>{
    findByStudent(id: Uuid): Promise<Grade[]>;
}