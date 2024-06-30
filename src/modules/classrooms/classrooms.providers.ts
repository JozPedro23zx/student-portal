import { CreateClassRoomUseCase } from "@core/classroom/application/create-classroom/create-classroom";
import { DeleteClassRoomUsecase } from "@core/classroom/application/delete-classrom/delete-classroom";
import { FindAllClassRoomsUsecase } from "@core/classroom/application/find-classroom/find-all-classrooms";
import { FindClassRoomUsecase } from "@core/classroom/application/find-classroom/find-classroom";
import { UpdateClassRoomUseCase } from "@core/classroom/application/update-classroom/update-classroom";
import { IClassRoomRepository } from "@core/classroom/infrastructure/classroom-interface.repository";
import { ClassRoomRepositoryInMemory } from "@core/classroom/infrastructure/in-memory/classroom-in-memory.repository";
import { ClassRoomSequelizeRepository } from "@core/classroom/infrastructure/sequelize/classroom-sequelize.repository";
import { ClassRoomModel } from "@core/classroom/infrastructure/sequelize/classroom.model";
import { getModelToken } from "@nestjs/sequelize";


export const REPOSITORIES = {
  ClassRoom_Repository: {
    provide: 'ClassRoomRepository',
    useExisting: ClassRoomSequelizeRepository,
  },
  ClassRoom_Repository_Memory: {
    provide: ClassRoomRepositoryInMemory,
    useClass: ClassRoomRepositoryInMemory,
  },
  ClassRoom_Repository_Sequelize: {
    provide: ClassRoomSequelizeRepository,
    useFactory: (classRoomModel: typeof ClassRoomModel) => {
      return new ClassRoomSequelizeRepository(classRoomModel);
    },
    inject: [getModelToken(ClassRoomModel)],
  },
};

export const USE_CASES = {
  Create_ClassRoom_Usecase: {
    provide: CreateClassRoomUseCase,
    useFactory: (classRoomRepo: IClassRoomRepository) => {
      return new CreateClassRoomUseCase(classRoomRepo);
    },
    inject: [REPOSITORIES.ClassRoom_Repository.provide],
  },
  Update_ClassRoom_Usecase: {
    provide: UpdateClassRoomUseCase,
    useFactory: (classRoomRepo: IClassRoomRepository) => {
      return new UpdateClassRoomUseCase(classRoomRepo);
    },
    inject: [REPOSITORIES.ClassRoom_Repository.provide],
  },
  Find_ClassRoom_Usecase: {
    provide: FindClassRoomUsecase,
    useFactory: (classRoomRepo: IClassRoomRepository) => {
      return new FindClassRoomUsecase(classRoomRepo);
    },
    inject: [REPOSITORIES.ClassRoom_Repository.provide],
  },
  FindAll_ClassRooms_Usecase: {
    provide: FindAllClassRoomsUsecase,
    useFactory: (classRoomRepo: IClassRoomRepository) => {
      return new FindAllClassRoomsUsecase(classRoomRepo);
    },
    inject: [REPOSITORIES.ClassRoom_Repository.provide],
  },
  Delete_ClassRoom_Usecase: {
    provide: DeleteClassRoomUsecase,
    useFactory: (classRoomRepo: IClassRoomRepository) => {
      return new DeleteClassRoomUsecase(classRoomRepo);
    },
    inject: [REPOSITORIES.ClassRoom_Repository.provide],
  },
};

export const ClassRoom_Providers = {
  REPOSITORIES,
  USE_CASES,
};
