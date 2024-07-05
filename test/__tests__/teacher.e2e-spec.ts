import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { DomainValidationFilter } from 'src/modules/@shared/filters/domain-validation/domain-validation.filter';
import { NotFoundFilter } from 'src/modules/@shared/filters/not-found/not-found.filter';
import { ITeacherRepository } from '@core/teacher/infrastructure/teacher-interface.repository';
import { Sequelize } from 'sequelize-typescript';
import { getConnectionToken } from '@nestjs/sequelize';
import { TeacherFakeBuilder } from '@core/teacher/domain/teacher.fake';
import UpdateTeacherInput from '@core/teacher/application/update-teacher/input-update-teacher';
import { Uuid } from '@core/@shared/domain/value-object/uuid.vo';
import CreateTeacherInput from '@core/teacher/application/create-teacher/input-create-teacher';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/modules/auth/auth.service';

describe('TeachersController (e2e)', () => {
  let app: INestApplication;
  let sequelize: Sequelize;
  let repository: ITeacherRepository;

  let authService: AuthService;
  let jwtService: JwtService;
  let token: string;


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

    authService = moduleFixture.get<AuthService>(AuthService);
    jwtService = moduleFixture.get<JwtService>(JwtService);
    const payload = {
      email: "admin@admin",
      name: 'test',
      realm_access: {
        roles: ['admin', 'teacher']
      }
    };

    token = jwtService.sign(payload);

    sequelize = moduleFixture.get<Sequelize>(getConnectionToken());
    repository = app.get<ITeacherRepository>('TeacherRepository');
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  })

  afterAll(async () => {
    await app.close();
  });

  describe('/teachers (POST)', () => {
    it('should return a error 422 (invalid request body)', () => {
      const createTeacherInput = {
        first_name: 'Test',
        last_name: 'Teacher',
        // Missing required fields
      };

      return request(app.getHttpServer())
        .post('/teachers')
        .set('Authorization', `Bearer ${token}`)
        .send(createTeacherInput)
        .expect(422);
    });

    it('should return 201 (success to create teacher)', () => {
      const createTeacherInput: CreateTeacherInput = {
        first_name: 'John',
        last_name: 'Doe',
        subject_specialization: ['math', 'science'],
        date_of_birth: new Date("1980-01-01"),
        street: '123 Main St',
        number: 100,
        city: 'New York',
        phone_number: '123-456-7890',
      };

      return request(app.getHttpServer())
        .post('/teachers')
        .set('Authorization', `Bearer ${token}`)
        .send(createTeacherInput)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
        });
    });
  });

  describe('/teachers (GET)', () => {
    it('should emit not found error', () => {
      const id = '2ea1864c-a1b1-4f6c-a197-bf1db3a86c7b';
      return request(app.getHttpServer())
        .get(`/teachers/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('should return a teacher', async () => {
      const teacher = TeacherFakeBuilder.aTeacher().build();
      await repository.create(teacher);

      return request(app.getHttpServer())
        .get(`/teachers/${teacher.entityId.id}`)
        .expect(200)
        .set('Authorization', `Bearer ${token}`)
        .expect((res) => {
          expect(res.body.id).toBe(teacher.entityId.id);
        });
    });
  });

  describe('/teachers (PATCH)', () => {
    it('should emit not found error', () => {
      const input: UpdateTeacherInput = {
        id: '2ea1864c-a1b1-4f6c-a197-bf1db3a86c7b',
        first_name: 'Alex',
      };
      return request(app.getHttpServer())
        .patch('/teachers')
        .set('Authorization', `Bearer ${token}`)
        .send(input)
        .expect(404);
    });

    it('should update teacher', async () => {
      const teacher = TeacherFakeBuilder.aTeacher().build();
      await repository.create(teacher);

      const input: UpdateTeacherInput = {
        id: teacher.entityId.id,
        first_name: 'Alex',
      };

      return request(app.getHttpServer())
        .patch('/teachers')
        .set('Authorization', `Bearer ${token}`)
        .send(input)
        .expect(200)
        .expect((res) => {
          expect(res.body.first_name).toBe(input.first_name);
        });
    });
  });

  describe('/teachers (DELETE)', () => {
    it('should emit not found error', () => {
      const id = '2ea1864c-a1b1-4f6c-a197-bf1db3a86c7b';
      return request(app.getHttpServer())
        .delete(`/teachers/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('should delete teacher', async () => {
      const teacher = TeacherFakeBuilder.aTeacher().build();
      await repository.create(teacher);

      return request(app.getHttpServer())
        .delete(`/teachers/${teacher.entityId.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect(async () => {
          await expect(repository.find(new Uuid(teacher.entityId.id))).resolves.toBeNull();
        });
    });
  });
});
