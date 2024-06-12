import { IRepository } from "@core/@shared/infrastructure/repository-interface";
import { Student } from "../domain/student.entity";

export interface IStudentRepository extends IRepository<Student>{}