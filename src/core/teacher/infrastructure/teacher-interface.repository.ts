import { IRepository } from "@core/@shared/infrastructure/repository/repository-interface";
import { Teacher } from "../domain/teacher.entity";


export interface ITeacherRepository extends IRepository<Teacher>{}