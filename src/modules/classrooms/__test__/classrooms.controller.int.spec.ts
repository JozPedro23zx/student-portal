import { Test, TestingModule } from '@nestjs/testing';
import { ClassroomsController } from '../classrooms.controller';
import { IClassRoomRepository } from '@core/classroom/infrastructure/classroom-interface.repository';
import { DatabaseModule } from 'src/modules/database/database.module';
import { ClassroomsModule } from '../classrooms.module';
import { MyConfigModule } from 'src/modules/config/config.module';
import { CreateClassRoomUseCase } from '@core/classroom/application/create-classroom/create-classroom';
import { UpdateClassRoomUseCase } from '@core/classroom/application/update-classroom/update-classroom';
import { FindClassRoomUsecase } from '@core/classroom/application/find-classroom/find-classroom';
import { FindAllClassRoomsUsecase } from '@core/classroom/application/find-classroom/find-all-classrooms';
import { DeleteClassRoomUsecase } from '@core/classroom/application/delete-classrom/delete-classroom';
import CreateClassRoomInput from '@core/classroom/application/create-classroom/input-create-classroom';
import { ClassRoomOutput } from '@core/classroom/application/output';
import { ClassRoomFakeBuilder } from '@core/classroom/domain/classroom.fake';
import { ClassRoom } from '@core/classroom/domain/calssroom.entity';
import UpdateClassRoomInput from '@core/classroom/application/update-classroom/input-update-classroom';
import { AuthModule } from 'src/modules/auth/auth.module';

describe("ClassroomsController integration tests", () => {
  let controller: ClassroomsController;
  let repository: IClassRoomRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MyConfigModule.forRoot(),
        DatabaseModule,
        ClassroomsModule,
        AuthModule,
      ]
    }).compile();

    controller = module.get<ClassroomsController>(ClassroomsController);
    repository = module.get<IClassRoomRepository>('ClassRoomRepository');
  });

  it('should be definedA', () => {
    expect(controller).toBeDefined();
    expect(controller['createUsecase']).toBeInstanceOf(CreateClassRoomUseCase);
    expect(controller['updateUsecase']).toBeInstanceOf(UpdateClassRoomUseCase);
    expect(controller['findUsecase']).toBeInstanceOf(FindClassRoomUsecase);
    expect(controller['findAllUsecase']).toBeInstanceOf(FindAllClassRoomsUsecase);
    expect(controller['deleteUsecase']).toBeInstanceOf(DeleteClassRoomUsecase);
  });

  it('should call controller to create a classroom', async () => {
    const input: CreateClassRoomInput = {
      grade_level: '1st Grade',
      start_date: new Date('2023-09-01'),
      end_date: new Date('2024-06-15'),
    };

    const expectedOutput: ClassRoomOutput = {
      id: expect.any(String),
      grade_level: input.grade_level,
      start_date: input.start_date,
      end_date: input.end_date,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    };

    const output = await controller.create(input);

    expect(output).toStrictEqual(expectedOutput);
  });

  it('should call controller to find one classroom', async () => {
    const classroom = ClassRoomFakeBuilder.aClassRoom().build();
    await repository.create(classroom);

    const expectedOutput: ClassRoomOutput = {
      id: classroom.entityId.id,
      grade_level: classroom.grade_level,
      start_date: classroom.start_date,
      end_date: classroom.end_date,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    };

    const output = await controller.findOne(classroom.entityId.id);

    expect(output).toStrictEqual(expectedOutput);
  });

  it('should call controller to find all classrooms', async () => {
    const classrooms = [
      new ClassRoom({
        grade_level: '1st Grade',
        start_date: new Date('2023-09-01'),
        end_date: new Date('2024-06-15'),
      }),
      new ClassRoom({
        grade_level: '2nd Grade',
        start_date: new Date('2023-09-01'),
        end_date: new Date('2024-06-15'),
      }),
    ];

    for (const classroom of classrooms) {
      await repository.create(classroom);
    }

    const expectedOutput: ClassRoomOutput[] = classrooms.map(classroom => ({
      id: classroom.entityId.id,
      grade_level: classroom.grade_level,
      start_date: classroom.start_date,
      end_date: classroom.end_date,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    }));

    const output = await controller.findAll();
    expect(output).toStrictEqual(expectedOutput);
  });

  it('should call controller to find some classrooms', async () => {
    const classrooms = [
      new ClassRoom({
        grade_level: '1st Grade',
        start_date: new Date('2023-09-01'),
        end_date: new Date('2024-06-15'),
      }),
      new ClassRoom({
        grade_level: '2nd Grade',
        start_date: new Date('2023-09-01'),
        end_date: new Date('2024-06-15'),
      }),
      new ClassRoom({
        grade_level: '3rd Grade',
        start_date: new Date('2023-09-01'),
        end_date: new Date('2024-06-15'),
      }),
    ];

    for (const classroom of classrooms) {
      await repository.create(classroom);
    }

    const classroomIds = [classrooms[0].entityId.id, classrooms[2].entityId.id];

    const expectedOutput: ClassRoomOutput[] = [classrooms[0], classrooms[2]].map(classroom => ({
      id: classroom.entityId.id,
      grade_level: classroom.grade_level,
      start_date: classroom.start_date,
      end_date: classroom.end_date,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    }));

    let output = await controller.findAll(classroomIds);

    output = classroomIds.map(id => output.find(classroom => classroom.id === id));

    expect(output).toStrictEqual(expectedOutput);
  });

  it('should call controller to update a classroom', async () => {
    const classroom = ClassRoomFakeBuilder.aClassRoom().build();

    await repository.create(classroom);

    const updateClassroomInput: UpdateClassRoomInput = {
      id: classroom.entityId.id,
      grade_level: 'Updated Grade Level',
      start_date: new Date('2023-09-01'),
      end_date: new Date('2024-06-15'),
    };

    const expectedOutput: ClassRoomOutput = {
      id: classroom.entityId.id,
      grade_level: updateClassroomInput.grade_level,
      start_date: updateClassroomInput.start_date,
      end_date: updateClassroomInput.end_date,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    };

    const output = await controller.update(updateClassroomInput);

    expect(output).toStrictEqual(expectedOutput);
  });

  it('should call controller to delete a classroom', async () => {
    const classroom = ClassRoomFakeBuilder.aClassRoom().build();

    await repository.create(classroom);

    await controller.remove(classroom.entityId.id);

    const output = await repository.find(classroom.entityId);

    expect(output).toBeNull();
  });
});