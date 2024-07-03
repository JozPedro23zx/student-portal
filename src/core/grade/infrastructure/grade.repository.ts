import { IRepository } from "@core/@shared/infrastructure/repository/repository-interface";
import { Grade } from "../domain/grade.entity";

export interface IGradeRepository extends IRepository<Grade>{}