import { FindClassRoomUsecase } from "@core/classroom/application/find-classroom/find-classroom";
import { ClassroomsController } from "../classrooms.controller";
import { CreateClassRoomUseCase } from "@core/classroom/application/create-classroom/create-classroom";
import { FindAllClassRoomsUsecase } from "@core/classroom/application/find-classroom/find-all-classrooms";
import { UpdateClassRoomUseCase } from "@core/classroom/application/update-classroom/update-classroom";
import { DeleteClassRoomUsecase } from "@core/classroom/application/delete-classrom/delete-classroom";
import { Test, TestingModule } from "@nestjs/testing";
import CreateClassRoomInput from "@core/classroom/application/create-classroom/input-create-classroom";
import UpdateClassRoomInput from "@core/classroom/application/update-classroom/input-update-classroom";


describe("ClassroomsController unit tests", () => {
  let controller: ClassroomsController;
  let createUsecase: CreateClassRoomUseCase;
  let findUsecase: FindClassRoomUsecase;
  let findAllUsecase: FindAllClassRoomsUsecase;
  let updateUsecase: UpdateClassRoomUseCase;
  let deleteUsecase: DeleteClassRoomUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassroomsController],
      providers: [
        {
          provide: CreateClassRoomUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: FindClassRoomUsecase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: FindAllClassRoomsUsecase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: UpdateClassRoomUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: DeleteClassRoomUsecase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<ClassroomsController>(ClassroomsController);
    createUsecase = module.get<CreateClassRoomUseCase>(CreateClassRoomUseCase);
    findUsecase = module.get<FindClassRoomUsecase>(FindClassRoomUsecase);
    findAllUsecase = module.get<FindAllClassRoomsUsecase>(FindAllClassRoomsUsecase);
    updateUsecase = module.get<UpdateClassRoomUseCase>(UpdateClassRoomUseCase);
    deleteUsecase = module.get<DeleteClassRoomUsecase>(DeleteClassRoomUsecase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call createUsecase.execute with correct values', async () => {
    const input: CreateClassRoomInput = {
      grade_level: '1st Grade',
      start_date: new Date('2023-09-01'),
      end_date: new Date('2024-06-15'),
    };

    await controller.create(input);
    
    expect(createUsecase.execute).toHaveBeenCalledWith(input);
  });

  it('should call findUsecase.execute with correct values', async () => {
    const id = '1';
    await controller.findOne(id);
    expect(findUsecase.execute).toHaveBeenCalledWith({ id });
  });

  it('should call findAllUsecase.execute', async () => {
    await controller.findAll();
    expect(findAllUsecase.execute).toHaveBeenCalled();
  });

  it('should call findAllUsecase.execute with correct values', async () => {
    const ids = ['1', '2'];
    await controller.findAll(ids);
    expect(findAllUsecase.execute).toHaveBeenCalledWith({ ids });
  });

  it('should call updateUsecase.execute with correct values', async () => {
    const updateClassroomDto: UpdateClassRoomInput = { 
      id: '123',
      grade_level: '2nd Grade',
      start_date: new Date('2023-09-01'),
      end_date: new Date('2024-06-15'),
    };
    await controller.update(updateClassroomDto);
    expect(updateUsecase.execute).toHaveBeenCalledWith(updateClassroomDto);
  });

  it('should call deleteUsecase.execute with correct values', async () => {
    const id = '1';
    await controller.remove(id);
    expect(deleteUsecase.execute).toHaveBeenCalledWith({ id });
  });
});
