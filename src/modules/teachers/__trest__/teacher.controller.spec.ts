import 'reflect-metadata';

import { CreateTeacherUsecase } from "@core/teacher/application/create-teacher/create-teacher.usecase";
import { TeachersController } from "../teachers.controller";
import { FindTeacherUsecase } from "@core/teacher/application/find-teacher/find-teacher.usecase";
import { FindAllTeacherUsecase } from "@core/teacher/application/find-teacher/find-all-teacher.usecase";
import { UpdateTeacherUsecase } from "@core/teacher/application/update-teacher/update-teacher.usecase";
import { DeleteTeacherUsecase } from "@core/teacher/application/delete-teacher/delete-teacher.usecase";
import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { ProducerService } from 'src/modules/rabbitmq/services/producer.service';
import { TeacherOutput } from '@core/teacher/application/teacher-output';


describe('Teachers controller unit test', () => {
  let controller: TeachersController;
  let createUsecase: CreateTeacherUsecase;
  let findUsecase: FindTeacherUsecase;
  let findAllUsecase: FindAllTeacherUsecase;
  let updateUsecase: UpdateTeacherUsecase;
  let deleteUsecase: DeleteTeacherUsecase;
  let producerService: ProducerService;

  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  const mockProducerService = {
    sendUserCreationMessage: jest.fn()
  }

  const teacherOutput: TeacherOutput = {
    "id": "123",
    "first_name": "Jon",
    "last_name": "Silver",
    "subject_specialization": ['math', 'science'],
    "date_of_birth": new Date("1999-05-14"), 
    "street": "Flower Street",
    "number": 123,
    "city": "Old York",
    "phone_number": "12345-6789",
    "createdAt": new Date(),
    "updatedAt": new Date()
  } 

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeachersController],
      providers: [
        {
          provide: CreateTeacherUsecase,
          useValue: {
            execute: jest.fn().mockResolvedValue(teacherOutput),
          },
        },
        {
          provide: FindTeacherUsecase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: FindAllTeacherUsecase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: UpdateTeacherUsecase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: DeleteTeacherUsecase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: AuthGuard,
          useValue: mockAuthGuard,
        },
        {
          provide: JwtService,
          useValue: mockAuthService,
        },
        {
          provide: ProducerService,
          useValue: mockProducerService,
        },
      ],
    }).compile();

    controller = module.get<TeachersController>(TeachersController);
    createUsecase = module.get<CreateTeacherUsecase>(CreateTeacherUsecase);
    findUsecase = module.get<FindTeacherUsecase>(FindTeacherUsecase);
    findAllUsecase = module.get<FindAllTeacherUsecase>(FindAllTeacherUsecase);
    updateUsecase = module.get<UpdateTeacherUsecase>(UpdateTeacherUsecase);
    deleteUsecase = module.get<DeleteTeacherUsecase>(DeleteTeacherUsecase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call createUsecase.execute with correct params', async () => {
    const createDto = { 
        "id": "123",
        "first_name": "Jon",
        "last_name": "Silver",
        "subject_specialization": ['math', 'science'],
        "date_of_birth": new Date("1999-05-14"), 
        "street": "Flower Street",
        "number": 123,
        "city": "Old York",
        "phone_number": "12345-6789"
    };

    await controller.create(createDto);
    expect(createUsecase.execute).toHaveBeenCalledWith(createDto);
  });

  it('should call findUsecase.execute with correct params', async () => {
    const id = 'some-uuid';
    await controller.findOne(id);
    expect(findUsecase.execute).toHaveBeenCalledWith({ id });
  });

  it('should call findAllUsecase.execute with correct params', async () => {
    const ids = ['id1', 'id2'];
    await controller.findAll(ids);
    expect(findAllUsecase.execute).toHaveBeenCalledWith({ ids });
  });

  it('should call updateUsecase.execute with correct params', async () => {
    const updateDto = { 
        "id": "123",
        "first_name": "Jon",
        "last_name": "Silver",
        "subject_specialization": ['math', 'science'],
        "date_of_birth": new Date("1999-05-14"), 
        "address": {
            "street": "Flower Street",
            "number": 123,
            "city": "Old York",
        },
        "phone_number": "12345-6789"
    };

    await controller.update(updateDto);
    expect(updateUsecase.execute).toHaveBeenCalledWith(updateDto);
  });

  it('should call deleteUsecase.execute with correct params', async () => {
    const id = 'some-uuid';
    await controller.remove(id);
    expect(deleteUsecase.execute).toHaveBeenCalledWith({ id });
  });
});
