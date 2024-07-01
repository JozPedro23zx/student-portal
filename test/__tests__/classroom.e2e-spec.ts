import CreateClassRoomInput from '@core/classroom/application/create-classroom/input-create-classroom';
import UpdateClassRoomInput from '@core/classroom/application/update-classroom/input-update-classroom';
import { ClassRoomFakeBuilder } from '@core/classroom/domain/classroom.fake';
import { IClassRoomRepository } from '@core/classroom/infrastructure/classroom-interface.repository';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/sequelize';
import { TestingModule, Test } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import { AppModule } from 'src/app.module';
import { DomainValidationFilter } from 'src/modules/@shared/filters/domain-validation/domain-validation.filter';
import { NotFoundFilter } from 'src/modules/@shared/filters/not-found/not-found.filter';
import request from 'supertest';


describe('ClassRoomsController (e2e)', () => {
  let app: INestApplication;
  let sequelize: Sequelize;
  let repository: IClassRoomRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        errorHttpStatusCode: 422,
        transform: true,
      }),
    );
    app.useGlobalFilters(
      new DomainValidationFilter(),
      new NotFoundFilter()
    );
    await app.init();
     
    sequelize = moduleFixture.get<Sequelize>(getConnectionToken());
    repository = app.get<IClassRoomRepository>('ClassRoomRepository');
  });

  beforeEach(async ()=>{
    await sequelize.sync({ force: true });
  })

  afterAll(async () => {
    await app.close();
  });

  describe('/classrooms (POST)', () => {
    it('should return a error 422 (invalid request body)', () => {
      const createClassRoomInput = {
        name: 'Test Classroom',
        capacity: 30,
      };

      return request(app.getHttpServer())
        .post('/classrooms')
        .send(createClassRoomInput)
        .expect(422);
    });

    it('should return a error 422 (entity validation error)', () => {
      const createClassRoomInput: CreateClassRoomInput = {
        grade_level: '1st Grade',
        start_date: new Date('2023-01-01'),
        end_date: new Date('2024-06-15'),
      };

      return request(app.getHttpServer())
        .post('/classrooms')
        .send(createClassRoomInput)
        .expect(422);
    });

    it('should return 201 (success to create classroom)', () => {
      const createClassRoomInput: CreateClassRoomInput = {
        grade_level: '1st Grade',
        start_date: new Date('2023-02-01'),
        end_date: new Date('2023-12-15'),
      };

      return request(app.getHttpServer())
        .post('/classrooms')
        .send(createClassRoomInput)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
        });
    });
  });

  describe('/classrooms/:id (GET)', () => {
    it('should emit not found error', () => {
      const id = '2ea1864c-a1b1-4f6c-a197-bf1db3a86c7b';
      return request(app.getHttpServer())
        .get(`/classrooms/${id}`)
        .expect(404);
    });

    it('should return a classroom', async () => {
      const classRoom = ClassRoomFakeBuilder.aClassRoom().build();
      await repository.create(classRoom);

      return request(app.getHttpServer())
        .get(`/classrooms/${classRoom.entityId.id}`)
        .expect(200);
    });
  });

  describe('/classrooms (PATCH)', () => {
    it('should emit not found error', () => {
      const input: UpdateClassRoomInput = {
        id: '2ea1864c-a1b1-4f6c-a197-bf1db3a86c7b',
        grade_level: '2st Grade',
      };
      return request(app.getHttpServer())
        .patch(`/classrooms`)
        .send(input)
        .expect(404);
    });

    it('should update classroom', async () => {
      const classRoom = ClassRoomFakeBuilder.aClassRoom().build();
      await repository.create(classRoom);

      const input: UpdateClassRoomInput = {
        id: classRoom.entityId.id,
        grade_level: '2st Grade',
      };
      return request(app.getHttpServer())
        .patch(`/classrooms`)
        .send(input)
        .expect(200)
        .expect((res) => {
          expect(res.body.grade_level).toBe(input.grade_level);
        });
    });
  });

  describe('/classrooms/:id (DELETE)', () => {
    it('should emit not found error', () => {
      const id = '2ea1864c-a1b1-4f6c-a197-bf1db3a86c7b';
      return request(app.getHttpServer())
        .delete(`/classrooms/${id}`)
        .expect(404);
    });

    it('should delete classroom', async () => {
      const classRoom = ClassRoomFakeBuilder.aClassRoom().build();
      await repository.create(classRoom);

      repository.find(classRoom.entityId);

      return request(app.getHttpServer())
        .delete(`/classrooms/${classRoom.entityId.id}`)
        .expect(200)
        .expect(async (res) => {
          await expect(repository.find(classRoom.entityId)).resolves.toBeNull();
        });
    });
  });
});
