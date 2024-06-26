import { InMemoryRepository } from "@core/@shared/infrastructure/repository/in-memory/memory.repository";
import { Teacher } from "../../domain/teacher.entity";
import { ITeacherRepository } from "../teacher-interface.repository";

export class TeacherRepositoryInMemory extends InMemoryRepository<Teacher> implements ITeacherRepository {}