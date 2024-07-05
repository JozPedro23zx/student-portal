import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { UpdateEnrollmentInput } from '@core/enrollment/application/update-enrollment/update-enrollment.usecase';
import { EnrollmentFakeBuilder } from '@core/enrollment/domain/enrollment.fake';
import { IEnrollmentRepository } from '@core/enrollment/infrastructure/enrollment-interface.repository';
import { getConnectionToken } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import { DomainValidationFilter } from 'src/modules/@shared/filters/domain-validation/domain-validation.filter';
import { NotFoundFilter } from 'src/modules/@shared/filters/not-found/not-found.filter';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/modules/auth/auth.service';


describe('EnrollmentsController (e2e)', () => {
  
    let app: INestApplication;
    let sequelize: Sequelize;
    let repository: IEnrollmentRepository;

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
      )
      await app.init();

      authService = moduleFixture.get<AuthService>(AuthService);
      jwtService = moduleFixture.get<JwtService>(JwtService);
      const payload = { 
        email: "admin@admin",
        name: 'test',
        realm_access: {
            roles: ['admin']
        }
      };
  
      token = jwtService.sign(payload);
  
      sequelize = moduleFixture.get<Sequelize>(getConnectionToken());
      repository = app.get<IEnrollmentRepository>('EnrollmentRepository');
    });
  
    beforeEach(async ()=>{
      await sequelize.sync({ force: true });
    })
  
    afterAll(async () => {
      await app.close();
    });
  
    describe('/enrollments (POST)', () => {
      it('should return a error 422 (invalid request body)', () => {
        const createEnrollmentInput = {
          name: "class 1",
          other: "other"
        };
    
        return request(app.getHttpServer())
          .post('/enrollments')
          .set('Authorization', `Bearer ${token}`)
          .send(createEnrollmentInput)
          .expect(422);
      });
  
      it('should return a error 422 (entity validation error)', () => {
        const createEnrollmentInput = {
          student_id: 'ecbfa144-c6e3-4eaf-a185-f9b70f05f866',
          class_id: '7a4429fb-0f02-4578-8958-8a276db8ea83',
          enrollment_date: '2023-07-01',
          status: 'active', // Invalid Status
        };
  
        return request(app.getHttpServer())
          .post('/enrollments')
          .set('Authorization', `Bearer ${token}`)
          .send(createEnrollmentInput)
          .expect(422);
      });
  
      it('should return 201 (success to create enrollment)', () => {
        const createEnrollmentInput = {
          student_id: 'ecbfa144-c6e3-4eaf-a185-f9b70f05f866',
          class_id: '7a4429fb-0f02-4578-8958-8a276db8ea83',
          enrollment_date: '2023-07-01',
          status: 'enrolled',
        };
  
        return request(app.getHttpServer())
          .post('/enrollments')
          .set('Authorization', `Bearer ${token}`)
          .send(createEnrollmentInput)
          .expect(201)
          .expect((res) => {
            expect(res.body).toHaveProperty('id');
          });
      });
    });
  
    describe('/enrollments/:id (GET)', () => {
      it('should emit not found error', () => {
        const id = '2ea1864c-a1b1-4f6c-a197-bf1db3a86c7b';
        return request(app.getHttpServer())
          .get(`/enrollments/${id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(404);
      });
  
      it('should return an enrollment', async () => {
        const enrollment = EnrollmentFakeBuilder.anEnrollment().build();
        await repository.create(enrollment);
  
        return request(app.getHttpServer())
          .get(`/enrollments/${enrollment.entityId.id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.id).toBe(enrollment.entityId.id);
          });
      });
    });
  
    describe('/enrollments (PATCH)', () => {
      it('should emit not found error', () => {
        const input: UpdateEnrollmentInput = {
          id: '2ea1864c-a1b1-4f6c-a197-bf1db3a86c7b',
          status: 'completed',
        };
        return request(app.getHttpServer())
          .patch('/enrollments')
          .set('Authorization', `Bearer ${token}`)
          .send(input)
          .expect(404);
      });
  
      it('should update enrollment', async () => {
        const enrollment = EnrollmentFakeBuilder.anEnrollment().build();
        await repository.create(enrollment);
  
        const input: UpdateEnrollmentInput = {
          id: enrollment.entityId.id,
          status: 'completed',
        };
        return request(app.getHttpServer())
          .patch('/enrollments')
          .set('Authorization', `Bearer ${token}`)
          .send(input)
          .expect(200)
          .expect((res) => {
            expect(res.body.status).toBe(input.status);
          });
      });
    });
  
    describe('/enrollments/:id (DELETE)', () => {
      it('should emit not found error', () => {
        const id = '2ea1864c-a1b1-4f6c-a197-bf1db3a86c7b';
        return request(app.getHttpServer())
          .delete(`/enrollments/${id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(404);
      });
  
      it('should delete enrollment', async () => {
        const enrollment = EnrollmentFakeBuilder.anEnrollment().build();
        await repository.create(enrollment);
  
        return request(app.getHttpServer())
          .delete(`/enrollments/${enrollment.entityId.id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .expect(async () => {
            await expect(repository.find(enrollment.entityId)).resolves.toBeNull();
          });
      });
    });
  });