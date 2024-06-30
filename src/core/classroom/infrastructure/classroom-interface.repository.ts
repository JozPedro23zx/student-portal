import { IRepository } from "@core/@shared/infrastructure/repository/repository-interface";
import { ClassRoom } from "../domain/calssroom.entity";

export interface IClassRoomRepository extends IRepository<ClassRoom>{}