import { IRepository } from "@core/@shared/infrastructure/repository/repository-interface";
import { Enrollment } from "../domain/enrollment";

export interface IEnrollmentRepository extends IRepository<Enrollment>{}