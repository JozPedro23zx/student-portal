import { InMemoryRepository } from "@core/@shared/infrastructure/repository/in-memory/memory.repository";
import { ClassRoom } from "@core/classroom/domain/calssroom.entity";
import { IClassRoomRepository } from "../classroom-interface.repository";

export class ClassRoomRepositoryInMemory extends InMemoryRepository<ClassRoom> implements IClassRoomRepository{}